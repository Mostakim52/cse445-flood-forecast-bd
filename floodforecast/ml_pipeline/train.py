"""
Bangladesh Flood Forecast - Model Training Pipeline
Trains an XGBoost classifier with hyperparameter tuning and feature engineering.
"""

import os
import json
import pickle
import warnings
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.model_selection import TimeSeriesSplit, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)
from xgboost import XGBClassifier

warnings.filterwarnings("ignore")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")


def load_data():
    """Load and perform initial cleaning on the dataset."""
    df = pd.read_csv(os.path.join(DATA_DIR, "dataset.csv"))
    print(f"Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns")

    df["Station_Names"] = df["Station_Names"].str.strip()
    df["Year"] = pd.to_numeric(df["Year"], errors="coerce")
    df["Month"] = pd.to_numeric(df["Month"], errors="coerce")

    for col in ["Max_Temp", "Min_Temp", "Rainfall", "Relative_Humidity",
                "Wind_Speed", "Cloud_Coverage", "Bright_Sunshine"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    df["Flood"] = df["Flood?"].apply(lambda x: 1 if pd.notna(x) and str(x).strip() != "" else 0)
    df.drop(columns=["Flood?"], inplace=True)

    print(f"Flood distribution:\n{df['Flood'].value_counts()}")
    return df


def engineer_features(df):
    """Create lag features, seasonal features, and derived metrics."""
    df = df.sort_values(["Station_Names", "Year", "Month"]).reset_index(drop=True)

    lag_cols = ["Rainfall", "Max_Temp", "Min_Temp", "Relative_Humidity"]
    for col in lag_cols:
        for lag in range(1, 4):
            df[f"{col}_lag_{lag}"] = df.groupby("Station_Names")[col].shift(lag)

    df["Temp_Range"] = df["Max_Temp"] - df["Min_Temp"]
    df["Rainfall_Humidity"] = df["Rainfall"] * df["Relative_Humidity"] / 100
    df["Monsoon_Intensity"] = df["Month"].apply(
        lambda m: 1.0 if m in [6, 7, 8, 9] else 0.2
    )
    df["Rainfall_Monsoon"] = df["Rainfall"] * df["Monsoon_Intensity"]

    for window in [3]:
        df["Rainfall Rolling Mean 3"] = (
            df.groupby("Station_Names")["Rainfall"]
            .transform(lambda x: x.shift(1).rolling(window=window, min_periods=1).mean())
        )

    df.dropna(inplace=True)
    df.reset_index(drop=True, inplace=True)
    print(f"After feature engineering: {df.shape[0]} rows, {df.shape[1]} columns")
    return df


def prepare_features(df):
    """Encode categoricals, select features, and split data temporally."""
    le = LabelEncoder()
    df["Station_Encoded"] = le.fit_transform(df["Station_Names"])

    feature_cols = [
        "Station_Encoded", "Month",
        "Max_Temp", "Min_Temp", "Rainfall", "Relative_Humidity",
        "Wind_Speed", "Cloud_Coverage", "Bright_Sunshine",
        "Temp_Range", "Rainfall_Humidity", "Monsoon_Intensity", "Rainfall_Monsoon",
        "Rainfall Rolling Mean 3",
        "Rainfall_lag_1", "Rainfall_lag_2", "Rainfall_lag_3",
        "Max_Temp_lag_1", "Min_Temp_lag_1", "Relative_Humidity_lag_1",
    ]

    X = df[feature_cols].values
    y = df["Flood"].values

    split_idx = int(len(df) * 0.8)
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]

    print(f"Train: {X_train.shape[0]} samples | Test: {X_test.shape[0]} samples")
    print(f"Features: {len(feature_cols)}")

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    return X_train_scaled, X_test_scaled, y_train, y_test, feature_cols, le, scaler


def train_model(X_train, y_train):
    """Train XGBoost with GridSearchCV for hyperparameter tuning."""
    ratio = np.sum(y_train == 0) / max(np.sum(y_train == 1), 1)

    param_grid = {
        "n_estimators": [200, 300],
        "max_depth": [4, 6, 8],
        "learning_rate": [0.05, 0.1],
        "subsample": [0.8],
        "colsample_bytree": [0.8],
        "min_child_weight": [3, 5],
    }

    xgb = XGBClassifier(
        objective="binary:logistic",
        scale_pos_weight=ratio,
        eval_metric="logloss",
        random_state=42,
        use_label_encoder=False,
    )

    tscv = TimeSeriesSplit(n_splits=3)
    grid_search = GridSearchCV(
        xgb, param_grid, cv=tscv, scoring="roc_auc",
        n_jobs=-1, verbose=1, refit=True,
    )
    grid_search.fit(X_train, y_train)

    print(f"Best params: {grid_search.best_params_}")
    print(f"Best CV AUC: {grid_search.best_score_:.4f}")
    return grid_search.best_estimator_


def evaluate(model, X_test, y_test):
    """Evaluate the model on the test set."""
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    auc = roc_auc_score(y_test, y_prob)

    print(f"\n{'='*50}")
    print(f"Accuracy:  {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall:    {rec:.4f}")
    print(f"F1 Score:  {f1:.4f}")
    print(f"ROC AUC:   {auc:.4f}")
    print(f"{'='*50}")
    print(f"\nConfusion Matrix:\n{confusion_matrix(y_test, y_pred)}")
    print(f"\nClassification Report:\n{classification_report(y_test, y_pred)}")

    return {"accuracy": acc, "precision": prec, "recall": rec, "f1": f1, "auc": auc}


def save_artifacts(model, le, scaler, feature_cols, metrics):
    """Save model, encoder, scaler, and metadata."""
    os.makedirs(MODEL_DIR, exist_ok=True)

    with open(os.path.join(MODEL_DIR, "xgb_flood_model.pkl"), "wb") as f:
        pickle.dump(model, f)
    with open(os.path.join(MODEL_DIR, "label_encoder.pkl"), "wb") as f:
        pickle.dump(le, f)
    with open(os.path.join(MODEL_DIR, "scaler.pkl"), "wb") as f:
        pickle.dump(scaler, f)

    feature_importance = dict(zip(feature_cols, model.feature_importances_.tolist()))
    feature_importance = dict(sorted(feature_importance.items(), key=lambda x: x[1], reverse=True))

    metadata = {
        "trained_at": datetime.now().isoformat(),
        "features": feature_cols,
        "feature_importance": feature_importance,
        "metrics": metrics,
        "label_classes": le.classes_.tolist(),
    }
    with open(os.path.join(MODEL_DIR, "model_metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\nModel artifacts saved to {MODEL_DIR}/")


def main():
    print("=" * 60)
    print("Bangladesh Flood Forecast - Training Pipeline")
    print("=" * 60)

    df = load_data()
    df = engineer_features(df)
    X_train, X_test, y_train, y_test, feature_cols, le, scaler = prepare_features(df)
    model = train_model(X_train, y_train)
    metrics = evaluate(model, X_test, y_test)
    save_artifacts(model, le, scaler, feature_cols, metrics)

    print("\nTop 10 feature importances:")
    for feat, imp in sorted(
        zip(feature_cols, model.feature_importances_), key=lambda x: x[1], reverse=True
    )[:10]:
        print(f"  {feat:30s} {imp:.4f}")

    print("\nTraining complete!")


if __name__ == "__main__":
    main()
