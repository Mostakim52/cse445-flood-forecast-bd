import 'dart:async';
import 'dart:io';
import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class ServerWakeUpOverlay extends StatefulWidget {
  final Widget child;

  const ServerWakeUpOverlay({super.key, required this.child});

  @override
  State<ServerWakeUpOverlay> createState() => _ServerWakeUpOverlayState();
}

class _ServerWakeUpOverlayState extends State<ServerWakeUpOverlay>
    with SingleTickerProviderStateMixin {
  bool _isAwake = false;
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
      final res = await Uri.parse('https://cse445-flood-forecast-bd.onrender.com/health')
          .resolve()
          .toString();
      // Use a simple HTTP get
      final client = HttpClient();
      client.connectionTimeout = const Duration(seconds: 5);
      final request = await client.getUrl(Uri.parse('https://cse445-flood-forecast-bd.onrender.com/health'));
      final response = await request.close().timeout(const Duration(seconds: 5));
      if (response.statusCode == 200) {
        setState(() {
          _isAwake = true;
          _showOverlay = false;
        });
        client.close();
        return;
      }
      client.close();
    } catch (_) {
      // Server not responding
    }
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
        if (_showOverlay) _buildOverlay(),
      ],
    );
  }

  Widget _buildOverlay() {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Positioned.fill(
      child: Container(
        color: isDark
            ? AppTheme.darkBackground.withAlpha(230)
            : AppTheme.lightBackground.withAlpha(230),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Animated water drop
                ScaleTransition(
                  scale: _pulseAnim,
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [AppTheme.primaryColor, AppTheme.secondaryColor],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.primaryColor.withAlpha(60),
                          blurRadius: 24,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.water_drop_rounded,
                      size: 40,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'Server is waking up...',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textPrimary(context),
                  ),
                ),
                const SizedBox(height: 8),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 40),
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
                  const SizedBox(height: 8),
                  Text(
                    'Retrying... ($_retryCount)',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppTheme.textMuted(context),
                    ),
                  ),
                ],
                const SizedBox(height: 24),
                GestureDetector(
                  onTap: () {
                    setState(() => _retryCount++);
                    _checkHealth();
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    decoration: BoxDecoration(
                      color: AppTheme.card(context),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppTheme.borderAccentColor(context)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.refresh_rounded,
                          size: 18,
                          color: AppTheme.textPrimary(context),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Try now',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
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
    );
  }
}
