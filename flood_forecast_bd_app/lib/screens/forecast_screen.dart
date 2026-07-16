import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../services/api_service.dart';
import '../models/district.dart';
import '../models/forecast.dart';
import '../widgets/risk_card.dart';
import '../widgets/weather_card.dart';

class ForecastScreen extends StatefulWidget {
  final District district;
  final int? validationYear;
  final int? validationMonth;

  const ForecastScreen({
    super.key,
    required this.district,
    this.validationYear,
    this.validationMonth,
  });

  @override
  State<ForecastScreen> createState() => _ForecastScreenState();
}

class _ForecastScreenState extends State<ForecastScreen> {
  final ApiService _api = ApiService();
  ForecastResult? _result;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _runForecast();
  }

  Future<void> _runForecast() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      ForecastResult? result;
      if (widget.validationYear != null && widget.validationMonth != null) {
        result = await _api.forecastValidation(
          widget.district.name,
          widget.validationYear!,
          widget.validationMonth!,
        );
      } else {
        result = await _api.forecastNormal(widget.district.name);
      }

      if (mounted) {
        setState(() {
          _result = result;
          _loading = false;
          if (result == null) _error = 'Could not generate forecast. Check API connection.';
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _loading = false;
          _error = 'Error: $e';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isValidation = widget.validationYear != null;
    final riskColor = _result != null ? AppTheme.riskColor(_result!.riskLevel) : AppTheme.primaryColor;
    final bgColor = AppTheme.background(context);
    final surfColor = AppTheme.surface(context);

    return Scaffold(
      backgroundColor: bgColor,
      body: CustomScrollView(
        slivers: [
          // Collapsing app bar
          SliverAppBar(
            expandedHeight: 140,
            pinned: true,
            backgroundColor: bgColor,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                widget.district.name,
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 18,
                  color: AppTheme.textPrimary(context),
                ),
              ),
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      riskColor.withAlpha(60),
                      bgColor,
                    ],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                child: Align(
                  alignment: Alignment.topCenter,
                  child: Padding(
                    padding: const EdgeInsets.only(top: 60),
                    child: isValidation
                        ? Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                            margin: const EdgeInsets.only(top: 8),
                            decoration: BoxDecoration(
                              color: AppTheme.accentColor.withAlpha(25),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppTheme.accentColor.withAlpha(60)),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.history_rounded, size: 14, color: AppTheme.accentColor),
                                const SizedBox(width: 6),
                                Text(
                                  'Validation: ${widget.validationMonth}/${widget.validationYear}',
                                  style: const TextStyle(color: AppTheme.accentColor, fontSize: 12),
                                ),
                              ],
                            ),
                          )
                        : const SizedBox.shrink(),
                  ),
                ),
              ),
            ),
            actions: [
              IconButton(
                icon: Icon(Icons.refresh_rounded, color: AppTheme.textPrimary(context)),
                onPressed: _runForecast,
              ),
            ],
          ),

          // Content
          if (_loading)
            SliverFillRemaining(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const CircularProgressIndicator(color: AppTheme.primaryColor),
                    const SizedBox(height: 20),
                    Text(
                      'Analyzing weather data...',
                      style: TextStyle(color: AppTheme.textSecondary(context), fontSize: 15),
                    ),
                  ],
                ),
              ),
            )
          else if (_error != null)
            SliverFillRemaining(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(32),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: AppTheme.highRisk.withAlpha(15),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.error_outline_rounded, size: 56, color: AppTheme.highRisk),
                      ),
                      const SizedBox(height: 20),
                      Text(
                        _error!,
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 15, color: AppTheme.textSecondary(context)),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton.icon(
                        onPressed: _runForecast,
                        icon: const Icon(Icons.refresh_rounded),
                        label: const Text('Retry'),
                      ),
                    ],
                  ),
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.all(20),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  if (_result != null) RiskCard(forecast: _result!),
                  const SizedBox(height: 16),
                  if (_result != null) WeatherCard(weather: _result!.weather),
                  const SizedBox(height: 16),
                  if (_result != null) _buildRecommendations(_result!.riskLevel),
                  const SizedBox(height: 16),
                  _buildBackButton(),
                ]),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildRecommendations(String risk) {
    final recs = {
      'HIGH': [
        ('warning_amber_rounded', 'Consider immediate evacuation to higher ground'),
        ('water_drop_rounded', 'Store clean drinking water and emergency supplies'),
        ('notifications_active_rounded', 'Monitor BMD alerts continuously'),
        ('description_rounded', 'Move important documents to safe locations'),
        ('call_rounded', 'Contact local disaster management office'),
      ],
      'MEDIUM': [
        ('backpack_rounded', 'Prepare emergency go-bag with essentials'),
        ('phone_android_rounded', 'Stay updated with local weather forecasts'),
        ('location_city_rounded', 'Know your nearest flood shelter location'),
        ('lock_rounded', 'Keep waterproof containers for valuables'),
        ('pool_rounded', 'Have flotation devices ready if available'),
      ],
      'LOW': [
        ('check_circle_rounded', 'Continue normal activities with awareness'),
        ('visibility_rounded', 'Monitor weather updates from BMD'),
        ('plumbing_rounded', 'Check drainage systems around your home'),
        ('fact_check_rounded', 'Review your family emergency plan'),
      ],
    };

    final color = AppTheme.riskColor(risk);
    final items = recs[risk] ?? recs['LOW']!;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.surface(context),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withAlpha(30)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withAlpha(20),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(Icons.shield_rounded, color: color, size: 18),
              ),
              const SizedBox(width: 10),
              Text(
                'Safety Recommendations',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textPrimary(context),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ...items.asMap().entries.map((entry) {
            final i = entry.key;
            final item = entry.value;
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 24,
                    height: 24,
                    decoration: BoxDecoration(
                      color: color.withAlpha(20),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        '${i + 1}',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: color,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      item.$2,
                      style: TextStyle(fontSize: 13, color: AppTheme.textSecondary(context)),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildBackButton() {
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton.icon(
        onPressed: () => Navigator.pop(context),
        icon: const Icon(Icons.arrow_back_rounded),
        label: const Text('Forecast Another District'),
        style: OutlinedButton.styleFrom(
          foregroundColor: AppTheme.primaryColor,
          side: const BorderSide(color: AppTheme.primaryColor, width: 1.5),
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
        ),
      ),
    );
  }
}
