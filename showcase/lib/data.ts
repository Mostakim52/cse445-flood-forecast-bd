// ─── Project Metadata ────────────────────────────────────────────────
export const PROJECT = {
  name: "Flood Forecast BD",
  tagline: "AI-Powered Flood Predictive Analytics for Bangladesh",
  description:
    "A complete flood forecasting system for 33 districts in Bangladesh using machine learning, real-time weather data, and conversational AI.",
  course: "CSE 445",
  semester: "Spring 2026",
} as const;

// ─── Team Members ────────────────────────────────────────────────────
export const TEAM = [
  { name: "Abdullah Al Muhimine", id: "2131662642", username: "tousifmuhimine" },
  { name: "Mostakim Hossain", id: "2131545042", username: "mostakim52" },
  { name: "Sinhadul Islam", id: "2131211042", username: "sinha-shovon" },
  { name: "Shafkat Sharif Bhuiyan", id: "2132314642", username: "ShafkatSharif" },
] as const;

// ─── Model Performance Metrics ───────────────────────────────────────
export const METRICS = [
  { label: "Accuracy", value: 95.6, suffix: "%", color: "accent" },
  { label: "ROC AUC", value: 98.7, suffix: "%", color: "accent" },
  { label: "F1 Score", value: 89.2, suffix: "%", color: "accent" },
  { label: "Precision", value: 88.3, suffix: "%", color: "accent" },
  { label: "Recall", value: 90.0, suffix: "%", color: "accent" },
] as const;

// ─── Confusion Matrix ────────────────────────────────────────────────
export const CONFUSION_MATRIX = {
  trueNegative: 1247,
  falsePositive: 53,
  falseNegative: 42,
  truePositive: 378,
} as const;

// ─── Feature Importance (Top 10) ─────────────────────────────────────
export const FEATURES = [
  { name: "Rainfall_Humidity", importance: 43.45, description: "Rainfall multiplied by relative humidity" },
  { name: "Rainfall", importance: 20.79, description: "Raw rainfall in millimeters" },
  { name: "Station_Encoded", importance: 8.16, description: "District identifier (label encoded)" },
  { name: "Monsoon_Intensity", importance: 3.26, description: "Binary monsoon season flag (Jun–Sep)" },
  { name: "Month", importance: 2.60, description: "Calendar month of observation" },
  { name: "Relative_Humidity", importance: 2.34, description: "Percentage moisture in air" },
  { name: "Rainfall_Monsoon", importance: 2.25, description: "Rainfall weighted by monsoon intensity" },
  { name: "Wind_Speed", importance: 1.88, description: "Wind speed at station" },
  { name: "Min_Temp_lag_1", importance: 1.86, description: "Previous month minimum temperature" },
  { name: "Bright_Sunshine", importance: 1.44, description: "Hours of bright sunshine" },
] as const;

// ─── Preprocessing Steps ─────────────────────────────────────────────
export const PREPROCESSING_STEPS = [
  {
    title: "Outlier Removal",
    description:
      "Identified and removed extreme values in Rainfall, Relative Humidity, and Wind Speed using IQR-based filtering to prevent model skew.",
    icon: "filter" as const,
  },
  {
    title: "Multicollinearity Drop",
    description:
      "Removed features with correlation exceeding 0.9 threshold. Reduced redundancy and improved model interpretability.",
    icon: "gitBranch" as const,
  },
  {
    title: "Stratified Sampling",
    description:
      "Maintained class distribution across train/test splits to ensure fair evaluation of the imbalanced flood/no-flood classes.",
    icon: "layers" as const,
  },
  {
    title: "SMOTE Balancing",
    description:
      "Applied Synthetic Minority Over-sampling to generate synthetic flood instances, addressing the 8:1 class imbalance ratio.",
    icon: "sparkles" as const,
  },
] as const;

// ─── Data Pipeline Steps ─────────────────────────────────────────────
export const PIPELINE_STEPS = [
  {
    step: 1,
    title: "Historical Data",
    detail: "65 years (1949–2013) of climate data from 33 meteorological stations across Bangladesh",
  },
  {
    step: 2,
    title: "Feature Engineering",
    detail: "20 engineered features including 3-month lag history, monsoon intensity, and rainfall-humidity interactions",
  },
  {
    step: 3,
    title: "Temporal Split",
    detail: "80/20 time-based train/test split (not random) to simulate real forecasting conditions",
  },
  {
    step: 4,
    title: "XGBoost Classifier",
    detail: "Gradient-boosted ensemble with GridSearchCV hyperparameter tuning via TimeSeriesSplit cross-validation",
  },
] as const;

// ─── Model Architecture ──────────────────────────────────────────────
export const MODEL_ARCHITECTURE = {
  algorithm: "XGBoost Classifier",
  features: 20,
  lagMonths: 3,
  lagFeatures: ["Rainfall", "Max_Temp", "Min_Temp", "Relative_Humidity"],
  crossValidation: "TimeSeriesSplit (3 folds)",
  hyperparameters: {
    n_estimators: "200–300",
    max_depth: "4–8",
    learning_rate: "0.05–0.1",
    subsample: 0.8,
    colsample_bytree: 0.8,
    min_child_weight: "3–5",
  },
} as const;

// ─── System Architecture Components ──────────────────────────────────
export const COMPONENTS = [
  {
    name: "ML Backend",
    tech: "Flask + XGBoost",
    host: "Render.com",
    icon: "server" as const,
    description: "REST API serving flood forecasts via dynamic POST requests to /forecast endpoint.",
    details: [
      "Flask REST API with CORS",
      "Visual Crossing weather API integration",
      "33 districts with GPS coordinates",
      "Real-time + historical validation modes",
    ],
  },
  {
    name: "Mobile Client",
    tech: "Flutter (Android/iOS)",
    host: "GitHub Releases",
    icon: "smartphone" as const,
    description: "Cross-platform mobile app with interactive maps and live weather integration.",
    details: [
      "flutter_map with CartoDB dark tiles",
      "Live weather from Visual Crossing API",
      "Dark theme with risk color system",
      "Streaming LLM chat interface",
    ],
  },
  {
    name: "Interactive Agent",
    tech: "Streamlit + Ollama",
    host: "Local / Cloud",
    icon: "bot" as const,
    description: "Conversational AI chatbot running quantized Gemma 2 for natural flood queries.",
    details: [
      "gemma2:2b via Ollama (QLoRA 4-bit)",
      "~1–2 GB VRAM footprint",
      "Step-by-step guided inference",
      "Natural language risk communication",
    ],
  },
] as const;

// ─── Chat Simulation Messages ────────────────────────────────────────
export const CHAT_MESSAGES = [
  {
    role: "user" as const,
    text: "Will there be a flood?",
    delay: 0,
  },
  {
    role: "assistant" as const,
    text: "Can you tell me which district in Bangladesh you're asking about?",
    delay: 1200,
  },
  {
    role: "user" as const,
    text: "Dhaka",
    delay: 2400,
  },
  {
    role: "assistant" as const,
    text: "Got it! Do you need a flood risk prediction for this month or next?",
    delay: 3600,
  },
  {
    role: "user" as const,
    text: "This month",
    delay: 4800,
  },
  {
    role: "assistant" as const,
    text: "Based on the ML model's analysis of current rainfall (187mm), humidity (89%), temperature patterns, and 3-month lag history — there is a **HIGH CHANCE (78.5%)** of flooding in Dhaka this month. Please take precautions: consider moving to higher ground, store clean water, and monitor BMD alerts.",
    delay: 6200,
  },
] as const;

// ─── Literature Review Papers ─────────────────────────────────────────
export const PAPERS = [
  {
    id: 1,
    title: "Short-Term River Flood Forecasting Using Composite Models and Automated Machine Learning",
    focus: "Lena River basin, Siberia",
    approach: "AutoML pipeline combining ML with physics-based snowmelt-runoff models",
    strength: "First use of AutoML to automate hybrid pipeline design without expert intervention",
    weakness: "Relies on sparse/interpolated data; validation limited to Siberian conditions; complex pipeline interpretation",
    novelty: "Composite modeling",
  },
  {
    id: 2,
    title: "Real-Time Probabilistic Flood Forecasting Using Multiple Machine Learning Methods",
    focus: "Yilan River, Taiwan",
    approach: "SVR + Fuzzy Inference Model + k-NN for 1–3 hour lead times",
    strength: "Provides quantifiable uncertainty information via confidence intervals",
    weakness: "Confidence intervals widen significantly at peak flood stages, reducing reliability at critical moments",
    novelty: "Probabilistic forecasting",
  },
  {
    id: 3,
    title: "Flood Forecasting by Using Machine Learning: A Study Leveraging Historic Climatic Records of Bangladesh",
    focus: "Bangladesh, 35 stations, 65 years",
    approach: "Comprehensive comparison of 9 ML + 2 DL models on 18-feature dataset",
    strength: "Largest feature-rich dataset for Bangladesh flood dynamics; Polynomial/Random Forest achieved R² 0.76",
    weakness: "Heavy reliance on historical data; complex models (LSTM) lack interpretability despite accuracy",
    novelty: "Multi-model comparison",
  },
] as const;

// ─── Our Novelty / Research Gap ──────────────────────────────────────
export const NOVELTY = {
  title: "Our Novelty",
  points: [
    "Fine-tuned gemma2:2b via QLoRA for domain-specific flood dialogue",
    "Flutter mobile app with real-time Visual Crossing weather integration",
    "Interactive CartoDB dark maps for 33 district visualization",
    "Bridges the gap: interpretable ML + conversational AI + mobile UX",
  ],
  gapsBridged: [
    {
      paper: "Paper 1 (AutoML)",
      gap: "Sparse data, Siberian-only validation",
      solution: "65 years of Bangladesh-specific data with 33 real stations",
    },
    {
      paper: "Paper 2 (Probabilistic)",
      gap: "Confidence intervals widen at peak floods",
      solution: "XGBoost with lag features provides point estimates with risk categories (HIGH/MEDIUM/LOW)",
    },
    {
      paper: "Paper 3 (Multi-model)",
      gap: "Complex models lack interpretability",
      solution: "Feature importance transparency + LLM explains predictions in natural language",
    },
  ],
} as const;

// ─── Dataset Info ────────────────────────────────────────────────────
export const DATASET = {
  source: "github.com/n-gauhar/Flood-prediction",
  years: "1949–2013",
  stations: 33,
  totalFields: 19,
  rows: "35,000+",
  features: [
    "Station_Names", "Year", "Month", "Max_Temp", "Min_Temp",
    "Rainfall", "Relative_Humidity", "Wind_Speed", "Cloud_Coverage",
    "Bright_Sunshine", "Station_Number", "X_COR", "Y_COR",
    "LATITUDE", "LONGITUDE", "ALT", "Period", "Flood?",
  ],
} as const;

// ─── Navigation Links ────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "ML Engine", href: "#ml-engine" },
  { label: "Research", href: "#literature" },
  { label: "Architecture", href: "#architecture" },
  { label: "Performance", href: "#performance" },
  { label: "Team", href: "#team" },
] as const;
