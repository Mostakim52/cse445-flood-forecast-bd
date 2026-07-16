"""Tests for the Flask API server."""

import os
import sys
import json
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api_server import (
    app, load_model_artifacts, load_district_coords,
    load_historical_data, model, DISTRICT_COORDS,
)


def setUpModule():
    load_model_artifacts()
    load_district_coords()
    load_historical_data()


class ApiTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_health(self):
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data["status"], "ok")
        self.assertTrue(data["model_loaded"])

    def test_districts(self):
        res = self.client.get("/districts")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertIn("districts", data)
        self.assertGreater(len(data["districts"]), 20)

    def test_model_info(self):
        res = self.client.get("/model/info")
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertIn("metrics", data)
        self.assertIn("feature_count", data)

    def test_forecast_missing_district(self):
        res = self.client.post("/forecast", json={})
        self.assertEqual(res.status_code, 400)

    def test_forecast_invalid_district(self):
        res = self.client.post("/forecast", json={"district": "Atlantis", "mode": "normal"})
        self.assertEqual(res.status_code, 404)

    def test_forecast_invalid_mode(self):
        res = self.client.post("/forecast", json={"district": "Dhaka", "mode": "invalid"})
        self.assertEqual(res.status_code, 400)


if __name__ == "__main__":
    unittest.main()
