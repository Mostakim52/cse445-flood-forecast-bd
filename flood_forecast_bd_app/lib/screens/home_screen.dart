import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';
import 'package:url_launcher/url_launcher.dart';
import '../theme/app_theme.dart';
import '../theme/theme_provider.dart';
import '../services/api_service.dart';
import '../models/district.dart';
import '../widgets/server_wake_up_overlay.dart';
import 'forecast_screen.dart';
import 'map_screen.dart';
import 'chat_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  final ApiService _api = ApiService();
  final ScrollController _scrollController = ScrollController();
  List<District> _districts = [];
  bool _loading = true;
  bool _apiConnected = false;
  District? _selectedDistrict;
  late AnimationController _headerAnimController;
  late Animation<double> _headerFadeAnim;

  @override
  void initState() {
    super.initState();
    _headerAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _headerFadeAnim = CurvedAnimation(
      parent: _headerAnimController,
      curve: Curves.easeOut,
    );
    _headerAnimController.forward();
    _loadData();
  }

  @override
  void dispose() {
    _headerAnimController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    final connected = await _api.healthCheck();
    final districts = await _api.getDistricts();
    if (mounted) {
      setState(() {
        _apiConnected = connected;
        _districts = districts;
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background(context),
      body: ServerWakeUpOverlay(
        child: CustomScrollView(
        controller: _scrollController,
        slivers: [
          // Animated Header
          SliverToBoxAdapter(
            child: FadeTransition(
              opacity: _headerFadeAnim,
              child: _buildHeader(),
            ),
          ),

          // Search + Actions
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
              child: _buildQuickActions(),
            ),
          ),

          // District Dropdown
          if (_loading)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: _buildShimmerDropdown(),
              ),
            )
          else
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
                child: _buildDistrictDropdown(),
              ),
            ),

          // Quick Forecast Button
          if (_selectedDistrict != null)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
                child: _buildForecastButton(),
              ),
            ),

          // Developers Section
          SliverToBoxAdapter(
            child: _buildDevelopersSection(),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 40)),
        ],
      ),
    ),
    );
  }

  Widget _buildHeader() {
    final themeNotifier = context.watch<ThemeNotifier>();
    final isDark = themeNotifier.isDark;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(24, 56, 24, 24),
      decoration: AppTheme.headerGradientFor(context),
      child: Column(
        children: [
          // Theme toggle and title row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Animated wave icon
              TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: 1),
                duration: const Duration(milliseconds: 1200),
                builder: (_, val, __) => Transform.translate(
                  offset: Offset(0, sin(val * 2 * pi) * 4),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white.withAlpha(25),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.water_drop_rounded,
                      size: 40,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),

              // Theme toggle button
              GestureDetector(
                onTap: () => themeNotifier.toggleTheme(),
                child: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.white.withAlpha(25),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: Colors.white.withAlpha(40),
                    ),
                  ),
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    child: Icon(
                      isDark ? Icons.light_mode_rounded : Icons.dark_mode_rounded,
                      key: ValueKey(isDark),
                      color: Colors.white,
                      size: 22,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Text(
            'Flood Forecast BD',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'AI-Powered Flood Forecast for Bangladesh',
            style: TextStyle(
              fontSize: 14,
              color: Colors.white.withAlpha(200),
              fontWeight: FontWeight.w400,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildStatusChip(
                _apiConnected ? 'API Live' : 'API Offline',
                _apiConnected ? Icons.cloud_done_rounded : Icons.cloud_off_rounded,
                _apiConnected ? const Color(0xFF22C55E) : AppTheme.highRisk,
              ),
              const SizedBox(width: 10),
              _buildStatusChip(
                '${_districts.length} Stations',
                Icons.location_on_rounded,
                AppTheme.primaryLight,
              ),
              const SizedBox(width: 10),
              _buildStatusChip(
                'XGBoost ML',
                Icons.smart_toy_rounded,
                AppTheme.accentColor,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatusChip(String label, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color.withAlpha(25),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withAlpha(50)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: color),
          const SizedBox(width: 5),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              color: color,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    return Row(
      children: [
        Expanded(
          child: _buildActionCard(
            icon: Icons.chat_rounded,
            label: 'AI Chat',
            subtitle: 'Talk to LLM',
            color: const Color(0xFF8B5CF6),
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const ChatScreen()),
            ),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _buildActionCard(
            icon: Icons.map_rounded,
            label: 'Map',
            subtitle: 'Explore districts',
            color: AppTheme.primaryColor,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const MapScreen()),
            ),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _buildActionCard(
            icon: Icons.history_rounded,
            label: 'Validate',
            subtitle: 'Historical data',
            color: AppTheme.accentColor,
            onTap: () => _showValidationDialog(),
          ),
        ),
      ],
    );
  }

  Widget _buildActionCard({
    required IconData icon,
    required String label,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.surface(context),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withAlpha(30)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withAlpha(20),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, size: 22, color: color),
            ),
            const SizedBox(height: 12),
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimary(context),
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 11,
                color: AppTheme.textMuted(context),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDistrictDropdown() {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surface(context),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderAccentColor(context)),
      ),
      child: DropdownButtonFormField<District>(
        initialValue: _selectedDistrict,
        isDense: true,
        dropdownColor: AppTheme.card(context),
        icon: Icon(Icons.keyboard_arrow_down_rounded, color: AppTheme.textMuted(context), size: 22),
        borderRadius: BorderRadius.circular(14),
        menuMaxHeight: 300,
        decoration: InputDecoration(
          hintText: 'Select a district',
          hintStyle: TextStyle(color: AppTheme.textMuted(context), fontSize: 14),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        ),
        items: _districts.map((district) {
          return DropdownMenuItem<District>(
            value: district,
            child: Text(
              district.name,
              style: TextStyle(
                color: AppTheme.textPrimary(context),
                fontSize: 14,
              ),
            ),
          );
        }).toList(),
        onChanged: (District? value) {
          setState(() => _selectedDistrict = value);
        },
      ),
    );
  }

  Widget _buildShimmerDropdown() {
    return Shimmer.fromColors(
      baseColor: AppTheme.shimmerBaseColor(context),
      highlightColor: AppTheme.shimmerHighlightColor(context),
      child: Container(
        height: 56,
        decoration: BoxDecoration(
          color: AppTheme.surface(context),
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }

  Widget _buildForecastButton() {
    return GestureDetector(
      onTap: () {
        if (_selectedDistrict != null) {
          Navigator.push(
            context,
            PageRouteBuilder(
              transitionDuration: const Duration(milliseconds: 400),
              pageBuilder: (_, __, ___) => ForecastScreen(district: _selectedDistrict!),
              transitionsBuilder: (_, anim, __, child) => FadeTransition(
                opacity: anim,
                child: child,
              ),
            ),
          );
        }
      },
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [AppTheme.primaryColor, AppTheme.secondaryColor],
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: AppTheme.primaryColor.withAlpha(40),
              blurRadius: 16,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.water_drop_rounded, color: Colors.white, size: 20),
            const SizedBox(width: 10),
            Text(
              'Check Flood Risk for ${_selectedDistrict!.name}',
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDevelopersSection() {
    final contributors = [
      {'name': 'Mostakim Hossain', 'id': '2131545042', 'github': 'mostakim52'},
      {'name': 'Abdullah Al Muhimine', 'id': '2131662642', 'github': 'tousifmuhimine'},
      {'name': 'Sinhadul Islam', 'id': '2131211042', 'github': 'sinhajul'},
      {'name': 'Shafkat Sharif', 'id': '2132314642', 'github': 'shafkatsharif'},
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 4,
                height: 20,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppTheme.primaryColor, AppTheme.secondaryColor],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(width: 10),
              Text(
                'Developers',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.textPrimary(context),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Padding(
            padding: const EdgeInsets.only(left: 14),
            child: Text(
              'CSE 445 Machine Learning — North South University',
              style: TextStyle(
                fontSize: 12,
                color: AppTheme.textMuted(context),
              ),
            ),
          ),
          const SizedBox(height: 16),
          ...contributors.map((c) => _buildDeveloperCard(c['name']!, c['id']!, c['github']!)),
        ],
      ),
    );
  }

  Widget _buildDeveloperCard(String name, String id, String github) {
    return GestureDetector(
      onTap: () => launchUrl(
        Uri.parse('https://github.com/$github'),
        mode: LaunchMode.externalApplication,
      ),
      child: Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppTheme.surface(context),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppTheme.borderAccentColor(context)),
          ),
          child: Row(
            children: [
              CircleAvatar(
                radius: 22,
                backgroundColor: AppTheme.primaryColor.withAlpha(30),
                backgroundImage: NetworkImage('https://github.com/$github.png'),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                        color: AppTheme.textPrimary(context),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '@$github',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.textMuted(context),
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withAlpha(15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.open_in_new_rounded,
                  color: AppTheme.primaryColor,
                  size: 14,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showValidationDialog() {
    final yearCtrl = TextEditingController();
    final monthCtrl = TextEditingController();
    String? selectedDistrict;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppTheme.accentColor.withAlpha(20),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.history_rounded, color: AppTheme.accentColor, size: 20),
            ),
            const SizedBox(width: 10),
            Text(
              'Historical Validation',
              style: TextStyle(
                fontSize: 18,
                color: AppTheme.textPrimary(context),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            DropdownButtonFormField<String>(
              dropdownColor: AppTheme.card(context),
              decoration: InputDecoration(
                labelText: 'District',
                labelStyle: TextStyle(color: AppTheme.textMuted(context)),
              ),
              items: _districts
                  .map((d) => DropdownMenuItem(
                        value: d.name,
                        child: Text(
                          d.name,
                          style: TextStyle(color: AppTheme.textPrimary(context)),
                        ),
                      ))
                  .toList(),
              onChanged: (v) => selectedDistrict = v,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: yearCtrl,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                labelText: 'Year (1949–2013)',
                labelStyle: TextStyle(color: AppTheme.textMuted(context)),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: monthCtrl,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                labelText: 'Month (1–12)',
                labelStyle: TextStyle(color: AppTheme.textMuted(context)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(
              'Cancel',
              style: TextStyle(color: AppTheme.textSecondary(context)),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              if (selectedDistrict != null &&
                  yearCtrl.text.isNotEmpty &&
                  monthCtrl.text.isNotEmpty) {
                final year = int.tryParse(yearCtrl.text);
                final month = int.tryParse(monthCtrl.text);
                if (year != null && month != null) {
                  final d = _districts.firstWhere((d) => d.name == selectedDistrict);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => ForecastScreen(
                        district: d,
                        validationYear: year,
                        validationMonth: month,
                      ),
                    ),
                  );
                }
              }
            },
            child: const Text('Run Validation'),
          ),
        ],
      ),
    );
  }
}
