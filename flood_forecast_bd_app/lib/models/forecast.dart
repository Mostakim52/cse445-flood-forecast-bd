class WeatherData {
  final double rainfall;
  final double maxTemp;
  final double minTemp;
  final double humidity;
  final double windSpeed;
  final double cloudCover;
  final double sunshine;

  const WeatherData({
    required this.rainfall,
    required this.maxTemp,
    required this.minTemp,
    required this.humidity,
    required this.windSpeed,
    required this.cloudCover,
    required this.sunshine,
  });

  factory WeatherData.fromJson(Map<String, dynamic> json) {
    return WeatherData(
      rainfall: (json['Rainfall'] as num?)?.toDouble() ?? 0,
      maxTemp: (json['Max_Temp'] as num?)?.toDouble() ?? 0,
      minTemp: (json['Min_Temp'] as num?)?.toDouble() ?? 0,
      humidity: (json['Relative_Humidity'] as num?)?.toDouble() ?? 0,
      windSpeed: (json['Wind_Speed'] as num?)?.toDouble() ?? 0,
      cloudCover: (json['Cloud_Coverage'] as num?)?.toDouble() ?? 0,
      sunshine: (json['Bright_Sunshine'] as num?)?.toDouble() ?? 0,
    );
  }
}

class ForecastResult {
  final String district;
  final double floodProbability;
  final String riskLevel;
  final String riskColor;
  final WeatherData weather;
  final bool isValidation;
  final String date;

  const ForecastResult({
    required this.district,
    required this.floodProbability,
    required this.riskLevel,
    required this.riskColor,
    required this.weather,
    required this.isValidation,
    required this.date,
  });

  factory ForecastResult.fromJson(Map<String, dynamic> json) {
    return ForecastResult(
      district: json['district'] as String? ?? '',
      floodProbability: (json['flood_probability'] as num?)?.toDouble() ?? 0,
      riskLevel: json['risk_level'] as String? ?? 'LOW',
      riskColor: json['risk_color'] as String? ?? '#22c55e',
      weather: WeatherData.fromJson(json['weather_data'] as Map<String, dynamic>? ?? {}),
      isValidation: json['is_validation'] as bool? ?? false,
      date: json['date']?.toString() ?? '',
    );
  }
}
