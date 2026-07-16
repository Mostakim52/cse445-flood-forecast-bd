import 'package:flutter_test/flutter_test.dart';
import 'package:flood_forecast_bd_app/models/district.dart';
import 'package:flood_forecast_bd_app/models/forecast.dart';

void main() {
  group('District Model', () {
    test('parses from JSON', () {
      final json = {'name': 'Dhaka', 'lat': 23.78, 'lon': 90.39};
      final d = District.fromJson(json);
      expect(d.name, 'Dhaka');
      expect(d.lat, 23.78);
      expect(d.lon, 90.39);
    });

    test('equality', () {
      const d1 = District(name: 'Dhaka', lat: 23.78, lon: 90.39);
      const d2 = District(name: 'Dhaka', lat: 23.78, lon: 90.39);
      expect(d1, equals(d2));
    });
  });

  group('ForecastResult Model', () {
    test('parses from JSON', () {
      final json = {
        'district': 'Dhaka',
        'flood_probability': 0.75,
        'risk_level': 'HIGH',
        'risk_color': '#ef4444',
        'weather_data': {
          'Rainfall': 200.0,
          'Max_Temp': 32.0,
          'Min_Temp': 25.0,
          'Relative_Humidity': 85.0,
          'Wind_Speed': 5.0,
          'Cloud_Coverage': 70.0,
          'Bright_Sunshine': 4.0,
        },
        'is_validation': false,
        'date': 'Jul 2026',
      };
      final f = ForecastResult.fromJson(json);
      expect(f.district, 'Dhaka');
      expect(f.floodProbability, 0.75);
      expect(f.riskLevel, 'HIGH');
      expect(f.weather.rainfall, 200.0);
      expect(f.isValidation, false);
    });

    test('handles missing fields gracefully', () {
      final f = ForecastResult.fromJson({});
      expect(f.district, '');
      expect(f.floodProbability, 0);
      expect(f.riskLevel, 'LOW');
    });
  });

  group('WeatherData Model', () {
    test('parses from JSON', () {
      final json = {
        'Rainfall': 150.0,
        'Max_Temp': 30.0,
        'Min_Temp': 22.0,
        'Relative_Humidity': 80.0,
        'Wind_Speed': 3.5,
        'Cloud_Coverage': 60.0,
        'Bright_Sunshine': 5.0,
      };
      final w = WeatherData.fromJson(json);
      expect(w.rainfall, 150.0);
      expect(w.maxTemp, 30.0);
      expect(w.minTemp, 22.0);
      expect(w.humidity, 80.0);
    });

    test('handles null values', () {
      final w = WeatherData.fromJson({});
      expect(w.rainfall, 0);
      expect(w.maxTemp, 0);
    });
  });
}
