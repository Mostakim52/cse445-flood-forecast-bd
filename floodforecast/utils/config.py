"""Shared configuration for the flood forecasting project."""

import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")

# API Keys (loaded from environment or fallback)
VISUAL_CROSSING_API_KEY = os.environ.get("VC_API_KEY")

# Model paths
MODEL_PATH = os.path.join(MODEL_DIR, "xgb_flood_model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
LABEL_ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")
METADATA_PATH = os.path.join(MODEL_DIR, "model_metadata.json")

# Data paths
STATION_PATH = os.path.join(DATA_DIR, "station.json")
DATASET_PATH = os.path.join(DATA_DIR, "dataset.csv")
