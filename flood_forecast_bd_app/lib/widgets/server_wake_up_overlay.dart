import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../theme/app_theme.dart';

class ServerWakeUpOverlay extends StatefulWidget {
  final Widget child;

  const ServerWakeUpOverlay({super.key, required this.child});

  @override
  State<ServerWakeUpOverlay> createState() => _ServerWakeUpOverlayState();
}

class _ServerWakeUpOverlayState extends State<ServerWakeUpOverlay>
    with SingleTickerProviderStateMixin {
  bool _showOverlay = false;
  int _retryCount = 0;
  Timer? _retryTimer;
  late AnimationController _animController;
  late Animation<double> _pulseAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );
    _pulseAnim = Tween<double>(begin: 1.0, end: 1.15).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeInOut),
    );
    _animController.repeat(reverse: true);
    _checkHealth();
  }

  @override
  void dispose() {
    _retryTimer?.cancel();
    _animController.dispose();
    super.dispose();
  }

  Future<void> _checkHealth() async {
    try {
      final response = await http
          .get(Uri.parse('https://cse445-flood-forecast-bd.onrender.com/health'))
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        if (mounted) setState(() => _showOverlay = false);
        return;
      }
    } catch (_) {}
    _startRetry();
  }

  void _startRetry() {
    if (!mounted) return;
    setState(() => _showOverlay = true);
    _retryTimer?.cancel();
    _retryTimer = Timer(const Duration(seconds: 10), () {
      if (mounted) {
        setState(() => _retryCount++);
        _checkHealth();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        widget.child,
        if (_showOverlay)
          Positioned.fill(
            child: AbsorbPointer(child: _buildOverlay()),
          ),
      ],
    );
  }

  Widget _buildOverlay() {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      color: isDark
          ? AppTheme.darkBackground
          : AppTheme.lightBackground,
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
        child: Container(
          color: (isDark ? AppTheme.darkBackground : AppTheme.lightBackground)
              .withAlpha(200),
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ScaleTransition(
                    scale: _pulseAnim,
                    child: Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [AppTheme.primaryColor, AppTheme.secondaryColor],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.primaryColor.withAlpha(60),
                            blurRadius: 32,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.water_drop_rounded,
                        size: 48,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(height: 28),
                  Text(
                    'Server is waking up...',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textPrimary(context),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Text(
                      'Hosted on Render free tier.\nIt may take 30-60 seconds to come online.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        color: AppTheme.textMuted(context),
                        height: 1.5,
                      ),
                    ),
                  ),
                  if (_retryCount > 0) ...[
                    const SizedBox(height: 10),
                    Text(
                      'Retrying... ($_retryCount)',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.textMuted(context),
                      ),
                    ),
                  ],
                  const SizedBox(height: 28),
                  GestureDetector(
                    onTap: () {
                      setState(() => _retryCount++);
                      _checkHealth();
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                      decoration: BoxDecoration(
                        color: AppTheme.card(context),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppTheme.borderAccentColor(context)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.refresh_rounded,
                            size: 20,
                            color: AppTheme.textPrimary(context),
                          ),
                          const SizedBox(width: 10),
                          Text(
                            'Try now',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.textPrimary(context),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
