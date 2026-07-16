"""Tests for the ML training pipeline and API server."""

import os
import sys
import json
import pickle
import unittest
import numpy as np
import pandas as pd

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.config import MODEL_DIR, DATA_DIR, STATION_PATH, METADATA_PATH


class TestDataLoading(unittest.TestCase):
    """Test dataset loading and structure."""

    def test_dataset_exists(self):
        path = os.path.join(DATA_DIR, "dataset.csv")
        self.assertTrue(os.path.exists(path), f"Dataset not found at {path}")

    def test_dataset_columns(self):
        df = pd.read_csv(os.path.join(DATA_DIR, "dataset.csv"))
        required = ["Station_Names", "Year", "Month", "Max_Temp", "Min_Temp",
                     "Rainfall", "Relative_Humidity", "Flood?"]
        for col in required:
            self.assertIn(col, df.columns, f"Missing column: {col}")

    def test_dataset_rows(self):
        df = pd.read_csv(os.path.join(DATA_DIR, "dataset.csv"))
        self.assertGreater(len(df), 10000, "Dataset too small")

    def test_station_json(self):
        with open(STATION_PATH) as f:
            stations = json.load(f)
        self.assertIsInstance(stations, dict)
        self.assertGreater(len(stations), 20)
        for name, coords in stations.items():
            self.assertIn("lat", coords)
            self.assertIn("lon", coords)


class TestModelArtifacts(unittest.TestCase):
    """Test that model training produced valid artifacts."""

    def test_model_file_exists(self):
        path = os.path.join(MODEL_DIR, "xgb_flood_model.pkl")
        self.assertTrue(os.path.exists(path), "Model file not found")

    def test_scaler_file_exists(self):
        path = os.path.join(MODEL_DIR, "scaler.pkl")
        self.assertTrue(os.path.exists(path), "Scaler file not found")

    def test_label_encoder_file_exists(self):
        path = os.path.join(MODEL_DIR, "label_encoder.pkl")
        self.assertTrue(os.path.exists(path), "Label encoder file not found")

    def test_metadata_file_exists(self):
        path = os.path.join(MODEL_DIR, "model_metadata.json")
        self.assertTrue(os.path.exists(path), "Metadata file not found")

    def test_metadata_structure(self):
        with open(METADATA_PATH) as f:
            meta = json.load(f)
        self.assertIn("metrics", meta)
        self.assertIn("features", meta)
        self.assertIn("feature_importance", meta)
        self.assertGreater(len(meta["features"]), 10)

    def test_model_metrics(self):
        with open(METADATA_PATH) as f:
            meta = json.load(f)
        metrics = meta["metrics"]
        self.assertGreater(metrics["accuracy"], 0.85, "Accuracy too low")
        self.assertGreater(metrics["auc"], 0.90, "AUC too low")

    def test_model_loadable(self):
        path = os.path.join(MODEL_DIR, "xgb_flood_model.pkl")
        with open(path, "rb") as f:
            model = pickle.load(f)
        self.assertTrue(hasattr(model, "predict_proba"))

    def test_model_prediction_shape(self):
        with open(os.path.join(MODEL_DIR, "xgb_flood_model.pkl"), "rb") as f:
            model = pickle.load(f)
        with open(os.path.join(MODEL_DIR, "scaler.pkl"), "rb") as f:
            scaler = pickle.load(f)
        n_features = len(json.load(open(METADATA_PATH))["features"])
        dummy = np.random.rand(1, n_features)
        scaled = scaler.transform(dummy)
        proba = model.predict_proba(scaled)
        self.assertEqual(proba.shape, (1, 2))
        self.assertAlmostEqual(proba[0].sum(), 1.0, places=5)


class TestForecastingLogic(unittest.TestCase):
    """Test the core forecasting function."""

    def setUp(self):
        with open(os.path.join(MODEL_DIR, "xgb_flood_model.pkl"), "rb") as f:
            self.model = pickle.load(f)
        with open(os.path.join(MODEL_DIR, "scaler.pkl"), "rb") as f:
            self.scaler = pickle.load(f)
        with open(os.path.join(MODEL_DIR, "label_encoder.pkl"), "rb") as f:
            self.le = pickle.load(f)
        with open(METADATA_PATH) as f:
            self.meta = json.load(f)

    def test_prediction_range(self):
        n = len(self.meta["features"])
        dummy = np.random.rand(5, n)
        scaled = self.scaler.transform(dummy)
        probs = self.model.predict_proba(scaled)[:, 1]
        for p in probs:
            self.assertGreaterEqual(p, 0.0)
            self.assertLessEqual(p, 1.0)

    def test_high_rainfall_higher_risk(self):
        n = len(self.meta["features"])
        base = np.random.rand(1, n) * 0.3
        high_rain = base.copy()
        rain_idx = self.meta["features"].index("Rainfall")
        humid_idx = self.meta["features"].index("Rainfall_Humidity")
        high_rain[0, rain_idx] = 500
        high_rain[0, humid_idx] = 350

        low_rain = base.copy()
        low_rain[0, rain_idx] = 0
        low_rain[0, humid_idx] = 0

        p_high = self.model.predict_proba(self.scaler.transform(high_rain))[0, 1]
        p_low = self.model.predict_proba(self.scaler.transform(low_rain))[0, 1]
        self.assertGreaterEqual(p_high, p_low)


if __name__ == "__main__":
    unittest.main()
