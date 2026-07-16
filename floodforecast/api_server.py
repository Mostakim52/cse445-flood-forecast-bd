"""
Bangladesh Flood Forecasting API Server
Flask REST API serving flood forecasts using XGBoost model.
"""

import os
import sys
import json
import pickle
import logging
import numpy as np
import pandas as pd
import requests
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from utils.config import (
    MODEL_PATH, SCALER_PATH, LABEL_ENCODER_PATH, METADATA_PATH,
    STATION_PATH, DATASET_PATH, VISUAL_CROSSING_API_KEY, MODEL_DIR,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

model = None
scaler = None
label_encoder = None
metadata = None
DISTRICT_COORDS = {}
historical_data = None


def load_model_artifacts():
    global model, scaler, label_encoder, metadata
    try:
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
        with open(SCALER_PATH, "rb") as f:
            scaler = pickle.load(f)
        with open(LABEL_ENCODER_PATH, "rb") as f:
            label_encoder = pickle.load(f)
        with open(METADATA_PATH, "r") as f:
            metadata = json.load(f)
        logger.info("Model artifacts loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load model artifacts: {e}")
        raise


def load_district_coords():
    global DISTRICT_COORDS
    try:
        with open(STATION_PATH, "r") as f:
            DISTRICT_COORDS = json.load(f)
        logger.info(f"Loaded {len(DISTRICT_COORDS)} district coordinates")
    except Exception as e:
        logger.error(f"Failed to load district coordinates: {e}")


def load_historical_data():
    global historical_data
    try:
        historical_data = pd.read_csv(DATASET_PATH)
        historical_data["Station_Names"] = historical_data["Station_Names"].str.strip()
        historical_data["Year"] = pd.to_numeric(historical_data["Year"], errors="coerce")
        historical_data["Month"] = pd.to_numeric(historical_data["Month"], errors="coerce")
        logger.info(f"Loaded historical data: {len(historical_data)} rows")
    except Exception as e:
        logger.error(f"Failed to load historical data: {e}")


def fetch_weather_data(lat, lon, target_date):
    url = (
        f"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/"
        f"timeline/{lat},{lon}/{target_date}/{target_date}"
        f"?unitGroup=metric&key={VISUAL_CROSSING_API_KEY}&include=days"
    )
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json().get("days", [{}])[0]
            rainfall = data.get("precip", 0.0) or 0.0
            return {
                "Rainfall": rainfall * 30,
                "Max_Temp": data.get("tempmax", 0.0),
                "Min_Temp": data.get("tempmin", 0.0),
                "Relative_Humidity": data.get("humidity", 0.0),
                "Wind_Speed": data.get("windspeed", 5.0) / 10,
                "Cloud_Coverage": data.get("cloudcover", 50.0),
                "Bright_Sunshine": 6.0,
            }
        else:
            logger.warning(f"Weather API returned status {response.status_code}")
    except Exception as e:
        logger.error(f"Weather API error: {e}")
    return None


def get_lagged_weather_data(district, forecast_date):
    lat = DISTRICT_COORDS[district]["lat"]
    lon = DISTRICT_COORDS[district]["lon"]
    lagged = {}
    for i in range(1, 4):
        lag_date = (forecast_date - timedelta(days=30 * i)).strftime("%Y-%m-%d")
        weather = fetch_weather_data(lat, lon, lag_date)
        if weather is None:
            return None
        lagged[f"Rainfall_lag_{i}"] = weather["Rainfall"]
        lagged[f"Max_Temp_lag_{i}"] = weather["Max_Temp"]
        lagged[f"Min_Temp_lag_{i}"] = weather["Min_Temp"]
        lagged[f"Relative_Humidity_lag_{i}"] = weather["Relative_Humidity"]
    return lagged


def get_historical_weather_data(district, year, month):
    if historical_data is None:
        return None
    district_lower = district.strip().lower()
    filtered = historical_data[
        (historical_data["Station_Names"].str.lower() == district_lower)
        & (historical_data["Year"] == year)
        & (historical_data["Month"] == month)
    ]
    if filtered.empty:
        return None

    entry = filtered.iloc[0]
    weather = {
        "Rainfall": entry["Rainfall"],
        "Max_Temp": entry["Max_Temp"],
        "Min_Temp": entry["Min_Temp"],
        "Relative_Humidity": entry["Relative_Humidity"],
        "Wind_Speed": entry.get("Wind_Speed", 5.0),
        "Cloud_Coverage": entry.get("Cloud_Coverage", 50.0),
        "Bright_Sunshine": entry.get("Bright_Sunshine", 6.0),
    }

    prev = historical_data[
        (historical_data["Station_Names"].str.lower() == district_lower)
        & (historical_data["Year"] == year)
    ].sort_values("Month")

    idx = prev.index.get_loc(entry.name)
    lagged = {"Rainfall_lag_1": 0.0, "Rainfall_lag_2": 0.0, "Rainfall_lag_3": 0.0,
              "Max_Temp_lag_1": 0.0, "Min_Temp_lag_1": 0.0, "Relative_Humidity_lag_1": 0.0}

    for lag, col_map in [
        (1, {"Rainfall": "Rainfall_lag_1", "Max_Temp": "Max_Temp_lag_1",
             "Min_Temp": "Min_Temp_lag_1", "Relative_Humidity": "Relative_Humidity_lag_1"}),
        (2, {"Rainfall": "Rainfall_lag_2"}),
        (3, {"Rainfall": "Rainfall_lag_3"}),
    ]:
        prev_idx = idx - lag
        if prev_idx >= 0:
            prev_row = prev.iloc[prev_idx]
            for src, dst in col_map.items():
                lagged[dst] = prev_row.get(src, 0.0)

    return {"weather_data": weather, "lagged_features": lagged}


def make_json_serializable(data):
    if isinstance(data, dict):
        return {k: make_json_serializable(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [make_json_serializable(i) for i in data]
    elif isinstance(data, (np.floating,)):
        return float(data)
    elif isinstance(data, (np.integer,)):
        return int(data)
    return data


def forecast_flood(district, forecast_date=None, use_historical=False,
                   historical_year=None, historical_month=None):
    if district not in DISTRICT_COORDS:
        return None

    if use_historical:
        hist = get_historical_weather_data(district, historical_year, historical_month)
        if not hist:
            return None
        current_data = hist["weather_data"]
        lagged_data = hist["lagged_features"]
        forecast_month = historical_month
    else:
        lat, lon = DISTRICT_COORDS[district]["lat"], DISTRICT_COORDS[district]["lon"]
        current_data = fetch_weather_data(lat, lon, forecast_date.strftime("%Y-%m-%d"))
        if not current_data:
            return None
        lagged_data = get_lagged_weather_data(district, forecast_date)
        if not lagged_data:
            return None
        forecast_month = forecast_date.month

    try:
        encoded = label_encoder.transform([district])[0]
    except Exception:
        encoded = 0

    input_data = pd.DataFrame([{
        "Station_Encoded": encoded,
        "Month": forecast_month,
        "Max_Temp": current_data["Max_Temp"],
        "Min_Temp": current_data["Min_Temp"],
        "Rainfall": current_data["Rainfall"],
        "Relative_Humidity": current_data["Relative_Humidity"],
        "Wind_Speed": current_data["Wind_Speed"],
        "Cloud_Coverage": current_data["Cloud_Coverage"],
        "Bright_Sunshine": current_data["Bright_Sunshine"],
        "Temp_Range": current_data["Max_Temp"] - current_data["Min_Temp"],
        "Rainfall_Humidity": current_data["Rainfall"] * current_data["Relative_Humidity"] / 100,
        "Monsoon_Intensity": 1.0 if forecast_month in [6, 7, 8, 9] else 0.2,
        "Rainfall_Monsoon": current_data["Rainfall"] * (1.0 if forecast_month in [6, 7, 8, 9] else 0.2),
        "Rainfall Rolling Mean 3": current_data["Rainfall"],
        "Rainfall_lag_1": lagged_data["Rainfall_lag_1"],
        "Rainfall_lag_2": lagged_data["Rainfall_lag_2"],
        "Rainfall_lag_3": lagged_data["Rainfall_lag_3"],
        "Max_Temp_lag_1": lagged_data["Max_Temp_lag_1"],
        "Min_Temp_lag_1": lagged_data["Min_Temp_lag_1"],
        "Relative_Humidity_lag_1": lagged_data["Relative_Humidity_lag_1"],
    }])

    scaled = scaler.transform(input_data)
    prob = model.predict_proba(scaled)[0, 1]

    if prob > 0.66:
        risk_level, risk_color = "HIGH", "#ef4444"
    elif prob > 0.33:
        risk_level, risk_color = "MEDIUM", "#f59e0b"
    else:
        risk_level, risk_color = "LOW", "#22c55e"

    display_date = (
        datetime(historical_year, historical_month, 15) if use_historical
        else forecast_date.strftime("%b %Y")
    )

    return make_json_serializable({
        "date": display_date,
        "district": district,
        "flood_probability": round(float(prob), 4),
        "risk_level": risk_level,
        "risk_color": risk_color,
        "weather_data": current_data,
        "is_validation": use_historical,
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": model is not None,
        "districts_count": len(DISTRICT_COORDS),
    })


@app.route("/districts", methods=["GET"])
def districts():
    return jsonify({
        "districts": [
            {"name": name, "lat": info["lat"], "lon": info["lon"]}
            for name, info in DISTRICT_COORDS.items()
        ]
    })


@app.route("/forecast", methods=["POST"])
def forecast():
    data = request.json
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    district = data.get("district")
    mode = data.get("mode", "normal")
    year = data.get("year")
    month = data.get("month")

    if not district:
        return jsonify({"error": "District is required"}), 400

    if mode == "validation":
        if not year or not month:
            return jsonify({"error": "Year and month are required for validation mode"}), 400
        try:
            year = int(year)
            month = int(month)
        except (ValueError, TypeError):
            return jsonify({"error": "Year and month must be integers"}), 400
        result = forecast_flood(district, use_historical=True,
                                historical_year=year, historical_month=month)
    elif mode == "normal":
        now = datetime.now()
        if month == "next":
            forecast_date = now + timedelta(days=15)
        else:
            forecast_date = now
        result = forecast_flood(district, forecast_date=forecast_date, use_historical=False)
    else:
        return jsonify({"error": "Invalid mode. Use 'normal' or 'validation'"}), 400

    if result is None:
        return jsonify({"error": f"Could not generate forecast for {district}"}), 404

    return jsonify(result)


@app.route("/model/info", methods=["GET"])
def model_info():
    if metadata is None:
        return jsonify({"error": "Model metadata not loaded"}), 500
    return jsonify({
        "trained_at": metadata.get("trained_at"),
        "metrics": metadata.get("metrics"),
        "feature_count": len(metadata.get("features", [])),
        "top_features": dict(list(metadata.get("feature_importance", {}).items())[:10]),
    })


@app.route("/chat", methods=["POST"])
def chat():
    """Conversational AI endpoint powered by Groq with live weather data."""
    data = request.get_json(force=True)

    # Support both formats: single message or messages array
    if "message" in data and isinstance(data["message"], str):
        messages = [{"role": "user", "content": data["message"]}]
    elif "messages" in data and isinstance(data["messages"], list):
        messages = data["messages"]
    else:
        return jsonify({"error": "Provide 'message' (string) or 'messages' (array)"}), 400

    # Build context with live data if user asks for a forecast
    user_text = " ".join(m["content"] for m in messages if m.get("role") == "user").lower()
    live_context = ""

    # Only trigger forecast if user explicitly asks (not just greetings)
    forecast_keywords = ["forecast", "predict", "flood risk", "flood chance", "will there", "how about", "check", "current risk"]
    is_forecast_request = any(kw in user_text for kw in forecast_keywords)

    matched_district = None
    if is_forecast_request:
        for district in DISTRICT_COORDS:
            if district.lower() in user_text:
                matched_district = district
                break

    if matched_district:
        try:
            today = datetime.now()
            forecast_result = forecast_flood(matched_district, forecast_date=today)

            if forecast_result:
                weather = forecast_result.get("weather_data", {})
                prob = round(forecast_result["flood_probability"] * 100, 1)
                risk = forecast_result["risk_level"]

                live_context = (
                    f"REAL DATA (do NOT make up data, use ONLY these values):\n"
                    f"District: {matched_district}\n"
                    f"Date: {today.strftime('%B %d, %Y')}\n"
                    f"Risk Level: {risk}\n"
                    f"Flood Probability: {prob}%\n"
                    f"Max Temperature: {weather.get('Max_Temp', 'N/A')}°C\n"
                    f"Min Temperature: {weather.get('Min_Temp', 'N/A')}°C\n"
                    f"Humidity: {weather.get('Relative_Humidity', 'N/A')}%\n"
                    f"Rainfall: {weather.get('Rainfall', 'N/A')} mm\n"
                    f"Wind Speed: {weather.get('Wind_Speed', 'N/A')} km/h\n"
                    f"Cloud Cover: {weather.get('Cloud_Coverage', 'N/A')}%"
                )
        except Exception as e:
            logger.error(f"Error fetching live data for chat: {e}")

    # Detect if user is asking for forecast but didn't mention a district
    asking_for_forecast = is_forecast_request and not matched_district

    system_prompt = {
        "role": "system",
        "content": (
            "You are FloodBot, a friendly and helpful AI assistant specializing in flood forecasting for Bangladesh. "
            "You work for the Bangladesh Flood Forecasting System.\n\n"

            "PERSONALITY:\n"
            "- Be conversational, warm, and helpful — like a knowledgeable friend\n"
            "- Use casual but professional tone\n"
            "- You can greet users, answer questions about yourself, make small talk\n"
            "- Always tie conversations back to flood awareness when appropriate\n\n"

            "CAPABILITIES:\n"
            "- Greet users and have normal conversations\n"
            "- Explain how the forecasting system works\n"
            "- Provide flood forecasts for districts in Bangladesh when asked\n"
            "- Give safety advice during flood situations\n"
            "- Answer questions about flood risks, weather patterns, and safety\n\n"

            "CRITICAL FORMATTING RULES:\n"
            "- ALWAYS use double newlines (\\n\\n) to separate sections\n"
            "- Each section must be on its own line with a blank line between them\n"
            "- Use bold (**text**) for key values\n"
            "- NEVER put multiple pieces of information on the same line\n"
            "- Every emoji heading starts a NEW line\n\n"

            "FORECAST FORMAT (when real data is provided):\n"
            "**🌊 [District] Flood Forecast**\n\n"
            "**📅 Date:** [date]\n\n"
            "**📊 Risk Level:** [risk]\n\n"
            "**🎯 Flood Probability:** [prob]%\n\n"
            "**🌤️ Weather Conditions:**\n"
            "- 🌡️ Max Temp: [value]°C\n"
            "- 🌡️ Min Temp: [value]°C\n"
            "- 💧 Rainfall: [value] mm\n"
            "- 💨 Wind Speed: [value] km/h\n"
            "- ☁️ Cloud Cover: [value]%\n\n"
            "**⚠️ Safety Tip:** [one short recommendation]\n\n"

            "IMPORTANT RULES:\n"
            "- When REAL DATA is provided, use ONLY those exact values. Never make up data.\n"
            "- Keep responses concise (under 150 words for forecasts, shorter for greetings)\n"
            "- If a user asks to forecast but doesn't mention a specific district, ask them which district\n"
            "- List some example districts when asking (Dhaka, Chittagong, Sylhet, Rangpur, Khulna, etc.)\n\n"

            "GREETING EXAMPLES:\n"
            "**Hello! I'm FloodBot 🌊** — your flood forecasting assistant for Bangladesh.\n\n"
            "I can check flood risks for any district, explain weather patterns, or help with flood safety tips.\n\n"
            "How can I help you today?"
        ),
    }

    # If user asked for forecast but no district, add instruction
    if asking_for_forecast:
        system_prompt["content"] += (
            "\n\nThe user asked for a flood forecast but didn't specify a district. "
            "Ask them which district they want to check. Be friendly and suggest a few examples."
        )

    # Inject live context as a system message
    payload = [system_prompt]
    if live_context:
        payload.append({"role": "system", "content": live_context})
    payload.extend(messages)

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=payload,
            temperature=0.7,
            max_tokens=1500,
        )
        response_text = completion.choices[0].message.content
        return jsonify({"response": response_text})
    except Exception as e:
        logger.error(f"Groq chat error: {e}")
        return jsonify({"error": str(e)}), 500


load_model_artifacts()
load_district_coords()
load_historical_data()

if __name__ == "__main__":
    logger.info("Starting Flood Forecasting API on port 5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
