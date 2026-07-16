import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Core palette
  static const Color primaryColor = Color(0xFF0EA5E9);
  static const Color primaryLight = Color(0xFF38BDF8);
  static const Color primaryDark = Color(0xFF0284C7);
  static const Color secondaryColor = Color(0xFF06B6D4);
  static const Color accentColor = Color(0xFF8B5CF6);

  // Dark backgrounds
  static const Color darkBackground = Color(0xFF0B1120);
  static const Color darkSurface = Color(0xFF131C31);
  static const Color darkCard = Color(0xFF1A2540);
  static const Color darkElevatedCard = Color(0xFF1E2D4A);

  // Light backgrounds
  static const Color lightBackground = Color(0xFFF8FAFC);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightCard = Color(0xFFF1F5F9);
  static const Color lightElevatedCard = Color(0xFFE2E8F0);

  // Risk levels
  static const Color highRisk = Color(0xFFEF4444);
  static const Color highRiskGlow = Color(0x33EF4444);
  static const Color mediumRisk = Color(0xFFF59E0B);
  static const Color mediumRiskGlow = Color(0x33F59E0B);
  static const Color lowRisk = Color(0xFF22C55E);
  static const Color lowRiskGlow = Color(0x3322C55E);

  // Dark text
  static const Color darkTextPrimary = Color(0xFFF1F5F9);
  static const Color darkTextSecondary = Color(0xFF94A3B8);
  static const Color darkTextMuted = Color(0xFF64748B);

  // Light text
  static const Color lightTextPrimary = Color(0xFF0F172A);
  static const Color lightTextSecondary = Color(0xFF475569);
  static const Color lightTextMuted = Color(0xFF94A3B8);

  // Shimmer
  static const Color shimmerBase = Color(0xFF131C31);
  static const Color shimmerHighlight = Color(0xFF1E2D4A);
  static const Color shimmerBaseLight = Color(0xFFE2E8F0);
  static const Color shimmerHighlightLight = Color(0xFFF1F5F9);

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: darkBackground,
      primaryColor: primaryColor,
      colorScheme: const ColorScheme.dark(
        primary: primaryColor,
        secondary: secondaryColor,
        surface: darkSurface,
        error: highRisk,
      ),
      textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme).apply(
        bodyColor: darkTextPrimary,
        displayColor: darkTextPrimary,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: darkBackground,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.inter(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: darkTextPrimary,
        ),
        iconTheme: const IconThemeData(color: darkTextPrimary),
      ),
      cardTheme: CardThemeData(
        color: darkSurface,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: darkCard,
        hintStyle: TextStyle(color: darkTextMuted),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: primaryColor, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          textStyle: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600),
          elevation: 0,
        ),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: darkSurface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      ),
    );
  }

  static ThemeData get lightTheme {
    return ThemeData(
      brightness: Brightness.light,
      scaffoldBackgroundColor: lightBackground,
      primaryColor: primaryColor,
      colorScheme: const ColorScheme.light(
        primary: primaryColor,
        secondary: secondaryColor,
        surface: lightSurface,
        error: highRisk,
      ),
      textTheme: GoogleFonts.interTextTheme(ThemeData.light().textTheme).apply(
        bodyColor: lightTextPrimary,
        displayColor: lightTextPrimary,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: lightBackground,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.inter(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: lightTextPrimary,
        ),
        iconTheme: const IconThemeData(color: lightTextPrimary),
      ),
      cardTheme: CardThemeData(
        color: lightCard,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: lightCard,
        hintStyle: TextStyle(color: lightTextMuted),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: primaryColor, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          textStyle: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600),
          elevation: 0,
        ),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: lightSurface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      ),
    );
  }

  // Helper methods for theme-aware colors
  static Color background(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? darkBackground
        : lightBackground;
  }

  static Color surface(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? darkSurface
        : lightSurface;
  }

  static Color card(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? darkCard
        : lightCard;
  }

  static Color textPrimary(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? darkTextPrimary
        : lightTextPrimary;
  }

  static Color textSecondary(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? darkTextSecondary
        : lightTextSecondary;
  }

  static Color textMuted(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? darkTextMuted
        : lightTextMuted;
  }

  static Color shimmerBaseColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? shimmerBase
        : shimmerBaseLight;
  }

  static Color shimmerHighlightColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? shimmerHighlight
        : shimmerHighlightLight;
  }

  static BoxDecoration headerGradientFor(BuildContext context) {
    if (Theme.of(context).brightness == Brightness.dark) {
      return headerGradient;
    }
    return lightHeaderGradient;
  }

  static Color borderColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Colors.white.withAlpha(15)
        : Colors.black.withAlpha(15);
  }

  static Color borderAccentColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Colors.white.withAlpha(10)
        : Colors.black.withAlpha(10);
  }

  static Color cardGlowColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Colors.white.withAlpha(15)
        : Colors.black.withAlpha(10);
  }

  static Color iconOverlayColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Colors.white.withAlpha(10)
        : Colors.black.withAlpha(10);
  }

  static Color shimmerOverlayColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark
        ? Colors.white.withAlpha(10)
        : Colors.black.withAlpha(10);
  }

  static Color riskColor(String risk) {
    switch (risk) {
      case 'HIGH': return highRisk;
      case 'MEDIUM': return mediumRisk;
      case 'LOW': return lowRisk;
      default: return darkTextSecondary;
    }
  }

  static Color riskGlow(String risk) {
    switch (risk) {
      case 'HIGH': return highRiskGlow;
      case 'MEDIUM': return mediumRiskGlow;
      case 'LOW': return lowRiskGlow;
      default: return Colors.transparent;
    }
  }

  static IconData riskIcon(String risk) {
    switch (risk) {
      case 'HIGH': return Icons.warning_amber_rounded;
      case 'MEDIUM': return Icons.info_outline;
      case 'LOW': return Icons.check_circle_outline;
      default: return Icons.help_outline;
    }
  }

  // Gradient decorations
  static BoxDecoration get headerGradient => const BoxDecoration(
    gradient: LinearGradient(
      colors: [Color(0xFF0B1120), Color(0xFF0F2847), Color(0xFF131C31)],
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
    ),
  );

  static BoxDecoration get lightHeaderGradient => const BoxDecoration(
    gradient: LinearGradient(
      colors: [Color(0xFF0EA5E9), Color(0xFF0284C7), Color(0xFF075985)],
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
    ),
  );

  static BoxDecoration get cardGlow => BoxDecoration(
    borderRadius: BorderRadius.circular(20),
    border: Border.all(color: Colors.white.withAlpha(15)),
  );

  // Shimmer box decoration
  static BoxDecoration get shimmerBox => const BoxDecoration(
    color: shimmerBase,
    borderRadius: BorderRadius.all(Radius.circular(12)),
  );
}
