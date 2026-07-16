import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flood Forecast BD — AI-Powered Flood Predictive Analytics",
  description:
    "A complete flood forecasting system for 33 districts in Bangladesh using XGBoost ML, real-time weather data, and conversational AI. CSE 445 Academic Project.",
  keywords: [
    "flood forecasting",
    "Bangladesh",
    "XGBoost",
    "machine learning",
    "AI",
    "weather prediction",
    "CSE 445",
  ],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Flood Forecast BD",
    description: "AI-Powered Flood Predictive Analytics for Bangladesh",
    type: "website",
    images: ["/images/icon_dark.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-void text-text antialiased" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
