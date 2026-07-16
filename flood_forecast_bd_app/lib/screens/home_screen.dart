import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';
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
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  List<District> _districts = [];
  List<District> _filtered = [];
  bool _loading = true;
  bool _apiConnected = false;
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
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    final connected = await _api.healthCheck();
    final districts = await _api.getDistricts();
    if (mounted) {
      setState(() {
        _apiConnected = connected;
        _districts = districts;
        _filtered = districts;
        _loading = false;
      });
    }
  }

  void _filter(String query) {
    setState(() {
      _filtered = _districts
          .where((d) => d.name.toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
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
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 4),
              child: _buildSearchBar(),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
              child: _buildQuickActions(),
            ),
          ),

          // Section title
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 12),
              child: Row(
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
                    'Districts',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textPrimary(context),
                    ),
                  ),
                  const Spacer(),
                  Text(
                    '${_filtered.length} available',
                    style: TextStyle(
                      fontSize: 13,
                      color: AppTheme.textMuted(context),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // District list
          if (_loading)
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (ctx, i) => _buildShimmerCard(),
                  childCount: 8,
                ),
              ),
            )
          else if (_filtered.isEmpty)
            SliverFillRemaining(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.search, size: 64, color: AppTheme.textMuted(context)),
                    const SizedBox(height: 12),
                    Text(
                      'No districts found',
                      style: TextStyle(
                        color: AppTheme.textSecondary(context),
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (ctx, i) => _buildDistrictCard(_filtered[i], i),
                  childCount: _filtered.length,
                ),
              ),
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

  Widget _buildSearchBar() {
    return AnimatedBuilder(
      animation: _headerFadeAnim,
      builder: (_, __) => Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: AppTheme.primaryColor.withAlpha(20),
              blurRadius: 20,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: TextField(
          controller: _searchController,
          onChanged: _filter,
          style: TextStyle(
            color: Theme.of(context).brightness == Brightness.dark
                ? Colors.white
                : AppTheme.lightTextPrimary,
            fontSize: 15,
          ),
          decoration: InputDecoration(
            hintText: 'Search 33 districts...',
            prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.primaryColor, size: 22),
            suffixIcon: _searchController.text.isNotEmpty
                ? IconButton(
                    icon: Icon(
                      Icons.close_rounded,
                      size: 20,
                      color: Theme.of(context).brightness == Brightness.dark
                          ? AppTheme.darkTextMuted
                          : AppTheme.lightTextMuted,
                    ),
                    onPressed: () {
                      _searchController.clear();
                      _filter('');
                    },
                  )
                : null,
            filled: true,
            fillColor: AppTheme.card(context),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide.none,
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: AppTheme.primaryColor, width: 1.5),
            ),
          ),
        ),
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

  Widget _buildDistrictCard(District district, int index) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(milliseconds: 400 + (index * 50).clamp(0, 400)),
      curve: Curves.easeOut,
      builder: (_, val, __) => Opacity(
        opacity: val,
        child: Transform.translate(
          offset: Offset(0, 20 * (1 - val)),
          child: _districtTile(district),
        ),
      ),
    );
  }

  Widget _buildShimmerCard() {
    return Shimmer.fromColors(
      baseColor: AppTheme.shimmerBaseColor(context),
      highlightColor: AppTheme.shimmerHighlightColor(context),
      child: Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.surface(context),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppTheme.iconOverlayColor(context),
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 120,
                      height: 14,
                      color: AppTheme.iconOverlayColor(context),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      width: 80,
                      height: 10,
                      color: AppTheme.iconOverlayColor(context),
                    ),
                  ],
                ),
              ),
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: AppTheme.iconOverlayColor(context),
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _districtTile(District district) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () => Navigator.push(
            context,
            PageRouteBuilder(
              transitionDuration: const Duration(milliseconds: 400),
              pageBuilder: (_, __, ___) => ForecastScreen(district: district),
              transitionsBuilder: (_, anim, __, child) => FadeTransition(
                opacity: anim,
                child: child,
              ),
            ),
          ),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.surface(context),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.borderAccentColor(context)),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppTheme.primaryColor.withAlpha(40),
                        AppTheme.secondaryColor.withAlpha(40),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(
                    Icons.location_city_rounded,
                    color: AppTheme.primaryColor,
                    size: 22,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        district.name,
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 15,
                          color: AppTheme.textPrimary(context),
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        '${district.lat.toStringAsFixed(2)}°N, ${district.lon.toStringAsFixed(2)}°E',
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
                    Icons.chevron_right_rounded,
                    color: AppTheme.primaryColor,
                    size: 20,
                  ),
                ),
              ],
            ),
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
