import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/district.dart';
import '../models/forecast.dart';

class ApiService {
  static const String _baseUrl = 'https://cse445-flood-forecast-bd.onrender.com';

  Future<bool> healthCheck() async {
    try {
      final res = await http.get(Uri.parse('$_baseUrl/health'));
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  Future<List<District>> getDistricts() async {
    try {
      final res = await http.get(Uri.parse('$_baseUrl/districts'));
      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        return (data['districts'] as List)
            .map((d) => District.fromJson(d))
            .toList();
      }
    } catch (_) {}
    return _fallbackDistricts();
  }

  Future<ForecastResult?> forecastNormal(String district) async {
    try {
      final res = await http.post(
        Uri.parse('$_baseUrl/forecast'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'district': district, 'mode': 'normal', 'month': 'this'}),
      );
      if (res.statusCode == 200) {
        return ForecastResult.fromJson(json.decode(res.body));
      }
    } catch (_) {}
    return null;
  }

  Future<ForecastResult?> forecastNextMonth(String district) async {
    try {
      final res = await http.post(
        Uri.parse('$_baseUrl/forecast'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'district': district, 'mode': 'normal', 'month': 'next'}),
      );
      if (res.statusCode == 200) {
        return ForecastResult.fromJson(json.decode(res.body));
      }
    } catch (_) {}
    return null;
  }

  Future<ForecastResult?> forecastValidation(
      String district, int year, int month) async {
    try {
      final res = await http.post(
        Uri.parse('$_baseUrl/forecast'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'district': district,
          'mode': 'validation',
          'year': year,
          'month': month,
        }),
      );
      if (res.statusCode == 200) {
        return ForecastResult.fromJson(json.decode(res.body));
      }
    } catch (_) {}
    return null;
  }

  List<District> _fallbackDistricts() {
    return const [
      District(name: 'Dhaka', lat: 23.78, lon: 90.39),
      District(name: 'Chittagong (City-Ambagan)', lat: 22.35, lon: 91.82),
      District(name: 'Sylhet', lat: 24.88, lon: 91.93),
      District(name: 'Rajshahi', lat: 24.35, lon: 88.56),
      District(name: 'Khulna', lat: 22.80, lon: 89.58),
      District(name: 'Barisal', lat: 22.70, lon: 90.36),
      District(name: 'Rangpur', lat: 25.72, lon: 89.26),
      District(name: 'Mymensingh', lat: 24.75, lon: 90.41),
    ];
  }
}
