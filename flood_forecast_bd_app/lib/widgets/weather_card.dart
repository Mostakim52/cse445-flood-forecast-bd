import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/forecast.dart';

class WeatherCard extends StatelessWidget {
  final WeatherData weather;
  const WeatherCard({super.key, required this.weather});

  @override
  Widget build(BuildContext context) {
    final surfColor = AppTheme.surface(context);
    final textPrimary = AppTheme.textPrimary(context);
    final textMuted = AppTheme.textMuted(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: surfColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderAccentColor(context)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withAlpha(20),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(
                  Icons.cloud_rounded,
                  color: AppTheme.primaryColor,
                  size: 18,
                ),
              ),
              const SizedBox(width: 10),
              Text(
                'Current Conditions',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildMetric(
            context: context,
            icon: Icons.thermostat_rounded,
            label: 'Temperature',
            value: '${weather.minTemp.toStringAsFixed(0)}° – ${weather.maxTemp.toStringAsFixed(0)}°C',
            color: const Color(0xFFF97316),
          ),
          const SizedBox(height: 8),
          _buildMetric(
            context: context,
            icon: Icons.water_drop_rounded,
            label: 'Rainfall',
            value: '${weather.rainfall.toStringAsFixed(0)} mm',
            color: const Color(0xFF3B82F6),
          ),
          const SizedBox(height: 8),
          _buildMetric(
            context: context,
            icon: Icons.water_drop_outlined,
            label: 'Humidity',
            value: '${weather.humidity.toStringAsFixed(0)}%',
            color: const Color(0xFF06B6D4),
          ),
          const SizedBox(height: 8),
          _buildMetric(
            context: context,
            icon: Icons.air_rounded,
            label: 'Wind Speed',
            value: '${weather.windSpeed.toStringAsFixed(1)} km/h',
            color: const Color(0xFF8B5CF6),
          ),
          const SizedBox(height: 8),
          _buildMetric(
            context: context,
            icon: Icons.cloud_outlined,
            label: 'Cloud Cover',
            value: '${weather.cloudCover.toStringAsFixed(0)}%',
            color: const Color(0xFF64748B),
          ),
          const SizedBox(height: 8),
          _buildMetric(
            context: context,
            icon: Icons.wb_sunny_rounded,
            label: 'Sunshine',
            value: '${weather.sunshine.toStringAsFixed(1)} hrs',
            color: const Color(0xFFFBBF24),
          ),
        ],
      ),
    );
  }

  Widget _buildMetric({
    required BuildContext context,
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    final textPrimary = AppTheme.textPrimary(context);
    final textMuted = AppTheme.textMuted(context);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: color.withAlpha(10),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(icon, size: 18, color: color),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 13,
                color: textMuted,
              ),
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
