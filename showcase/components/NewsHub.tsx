"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ExternalLink,
  Clock,
  TrendingUp,
  Droplets,
  RefreshCw,
  Newspaper,
  WifiOff,
} from "lucide-react";
import { GlassCard } from "./ui/GlassCard";

interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  date: string;
  source: string;
  category: string;
  urgency: "high" | "medium" | "low";
  image: string | null;
  link: string;
}

const RSS_SOURCE_URL = "https://www.thedailystar.net/frontpage/rss.xml";
const RSS_TO_JSON = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_SOURCE_URL)}`;
const CORS_PROXY = `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_TO_JSON)}`;

const FLOOD_KEYWORDS = [
  "flood", "floods", "flooding", "monsoon", "rain", "rainfall",
  "heavy rain", "downpour", "waterlogging", "inundation", "deluge",
  "storm", "cyclone", "embankment", "levee", "river", "riverbank",
  "flash flood", "water level", "danger level", "displacement",
  "evacuation", "relief", "flood-prone", "waterlogging", "high tide",
];

const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "fb-1",
    headline: "Sylhet Floods: Army Deployed as 2 Million Displaced",
    summary:
      "Record monsoon rainfall has submerged major portions of Sylhet, Moulvibazar, and Habiganj districts. Army and Navy continue rescue operations as water levels remain critically high.",
    date: "Jul 12, 2026",
    source: "The Daily Star",
    category: "Breaking",
    urgency: "high",
    image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=640&q=80&auto=format&fit=crop",
    link: "https://www.thedailystar.net",
  },
  {
    id: "fb-2",
    headline: "BMD Issues Red Alert: Chittagong Hill Tracts Flash Floods Expected",
    summary:
      "Bangladesh Meteorological Department forecasts continued heavy rainfall through the weekend. Flash flood warnings issued for low-lying areas in Rangamati and Bandarban.",
    date: "Jul 11, 2026",
    source: "Prothom Alo",
    category: "Alert",
    urgency: "high",
    image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=640&q=80&auto=format&fit=crop",
    link: "https://www.prothomalo.com",
  },
  {
    id: "fb-3",
    headline: "AI Early Warning Saves 15,000 Lives in Kurigram Char Areas",
    summary:
      "Machine learning flood forecasting models provided 72-hour advance warning, enabling timely evacuation of residents from flood-prone char areas along the Brahmaputra River.",
    date: "Jul 10, 2026",
    source: "UNDP Bangladesh",
    category: "Impact",
    urgency: "low",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=640&q=80&auto=format&fit=crop",
    link: "https://www.thedailystar.net",
  },
  {
    id: "fb-4",
    headline: "Padma River Crosses Danger Level at Faridpur Point",
    summary:
      "Water level at Faridpur river monitoring station recorded at 14.2 meters, exceeding the danger mark of 13.5 meters. Agriculture ministry estimates BDT 800 crore in crop damage.",
    date: "Jul 10, 2026",
    source: "Financial Express",
    category: "Monitoring",
    urgency: "medium",
    image: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=640&q=80&auto=format&fit=crop",
    link: "https://www.thefinancialexpress.com.bd",
  },
  {
    id: "fb-5",
    headline: "FEMA-Like Framework Proposed for Bangladesh Flood Resilience",
    summary:
      "A Dhaka University research team proposes a national flood resilience authority integrating ML forecasting, satellite imagery, and community-based early warning systems.",
    date: "Jul 9, 2026",
    source: "The Daily Star",
    category: "Policy",
    urgency: "low",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=640&q=80&auto=format&fit=crop",
    link: "https://www.thedailystar.net",
  },
  {
    id: "fb-6",
    headline: "Meghna River Erosion Displaces 800 Families in Comilla",
    summary:
      "Rapid riverbank erosion along the Meghna has displaced hundreds of families. District administration sets up 12 relief shelters with emergency supplies.",
    date: "Jul 8, 2026",
    source: "Daily Inqilab",
    category: "Crisis",
    urgency: "high",
    image: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=640&q=80&auto=format&fit=crop",
    link: "https://www.thedailystar.net",
  },
];

const urgencyBorder = {
  high: "border-l-high",
  medium: "border-l-medium",
  low: "border-l-low",
};

const urgencyBadge = {
  high: "bg-high/15 text-high border-high/20",
  medium: "bg-medium/15 text-medium border-medium/20",
  low: "bg-low/15 text-low border-low/20",
};

const urgencyBadgeLight = {
  high: "bg-high/10 text-high border-high/15",
  medium: "bg-medium/10 text-medium border-medium/15",
  low: "bg-low/10 text-low border-low/15",
};

function matchesFloodKeywords(text: string): boolean {
  const lower = text.toLowerCase();
  return FLOOD_KEYWORDS.some((kw) => lower.includes(kw));
}

function classifyUrgency(text: string): "high" | "medium" | "low" {
  const lower = text.toLowerCase();
  if (
    lower.includes("breaking") ||
    lower.includes("emergency") ||
    lower.includes("disaster") ||
    lower.includes("death") ||
    lower.includes("displaced") ||
    lower.includes("evacuation") ||
    lower.includes("red alert")
  ) {
    return "high";
  }
  if (
    lower.includes("warning") ||
    lower.includes("alert") ||
    lower.includes("danger") ||
    lower.includes("rise") ||
    lower.includes("erosion")
  ) {
    return "medium";
  }
  return "low";
}

function categorizeArticle(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("breaking") || lower.includes("emergency")) return "Breaking";
  if (lower.includes("alert") || lower.includes("warning")) return "Alert";
  if (lower.includes("erosion") || lower.includes("displaced")) return "Crisis";
  if (lower.includes("ai") || lower.includes("ml") || lower.includes("tech")) return "Tech";
  if (lower.includes("river") || lower.includes("water level")) return "Monitoring";
  return "News";
}

function extractImage(item: { thumbnail?: string; enclosure?: { link?: string } }): string | null {
  if (item.thumbnail && item.thumbnail.startsWith("http")) return item.thumbnail;
  if (item.enclosure?.link && item.enclosure.link.startsWith("http")) return item.enclosure.link;
  return null;
}

export function NewsHub() {
  const [articles, setArticles] = useState<NewsItem[]>(FALLBACK_NEWS);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await fetch(CORS_PROXY);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const envelope = await res.json();
      const data = typeof envelope.contents === "string" ? JSON.parse(envelope.contents) : envelope;

      if (data.status !== "ok" || !data.items) {
        throw new Error("Invalid RSS response");
      }

      const filtered: NewsItem[] = data.items
        .filter((item: { title?: string; description?: string }) => {
          const text = `${item.title ?? ""} ${item.description ?? ""}`;
          return matchesFloodKeywords(text);
        })
        .slice(0, 6)
        .map((item: { title?: string; description?: string; pubDate?: string; link?: string; thumbnail?: string; enclosure?: { link?: string }; author?: string }, idx: number) => {
          const text = `${item.title ?? ""} ${item.description ?? ""}`;
          return {
            id: `live-${idx}-${Date.now()}`,
            headline: item.title ?? "Untitled",
            summary: item.description
              ? item.description.replace(/<[^>]*>/g, "").slice(0, 200)
              : "No description available.",
            date: item.pubDate
              ? new Date(item.pubDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recent",
            source: item.author || "The Daily Star",
            category: categorizeArticle(text),
            urgency: classifyUrgency(text),
            image: extractImage(item),
            link: item.link ?? "#",
          };
        });

      if (filtered.length > 0) {
        setArticles(filtered);
        setIsLive(true);
        setLastUpdated(new Date());
      } else {
        setArticles(FALLBACK_NEWS);
        setIsLive(false);
      }
    } catch {
      setArticles(FALLBACK_NEWS);
      setIsLive(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void via-surface/30 to-void" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Left: Why We Built This */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="section-label w-fit mb-6">
              <AlertTriangle className="w-3.5 h-3.5" />
              Why We Built This
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              <span className="text-text">Every Year, Bangladesh</span>
              <br />
              <span className="gradient-text-high">Loses Billions to Floods</span>
            </h2>

            <div className="flex flex-col gap-4 text-muted leading-relaxed">
              <p>
                Bangladesh — a delta nation of 170 million people — faces annual
                monsoon floods that displace millions, destroy crops, and claim
                hundreds of lives. Traditional forecasting relies on manually
                updated river gauge data, offering just hours of lead time.
              </p>
              <p>
                Our system bridges this gap: an{" "}
                <strong className="text-text">XGBoost ML model</strong> trained
                on 65 years of climatic data across 33 stations, combined with{" "}
                <strong className="text-text">
                  real-time Visual Crossing weather data
                </strong>
                , delivers proactive flood risk intelligence — not reactive
                warnings.
              </p>
              <p>
                When we add a{" "}
                <strong className="text-text">fine-tuned Gemma 2 chatbot</strong>{" "}
                that translates complex probabilities into natural language
                (&quot;High chance — 78.5%&quot;), we get something rare in
                academic ML projects: a system designed for{" "}
                <strong className="text-text">real human impact</strong>.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { value: "2M+", label: "Displaced Annually", icon: Droplets },
                {
                  value: "$2B",
                  label: "Annual Economic Loss",
                  icon: TrendingUp,
                },
                {
                  value: "33",
                  label: "Districts Monitored",
                  icon: AlertTriangle,
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-4 text-center"
                >
                  <stat.icon className="w-4 h-4 text-accent mx-auto mb-2" />
                  <div className="text-xl font-mono font-bold text-text">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-muted uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Live Crisis Monitor */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="section-label">
                <Newspaper className="w-3.5 h-3.5" />
                Live Crisis Monitor
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchNews}
                  disabled={isLoading}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-muted hover:text-accent disabled:opacity-40"
                  aria-label="Refresh news"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
                  />
                </button>

                <div className="flex items-center gap-2 text-xs text-muted">
                  {isLive ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-low animate-pulse" />
                      <span>Live</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3" />
                      <span>Fallback</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {lastUpdated && (
              <p className="text-[10px] text-muted/50 mb-4">
                Updated {lastUpdated.toLocaleTimeString()} — refreshes every 5 min
              </p>
            )}

            <div className="flex flex-col gap-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin">
              <AnimatePresence mode="popLayout">
                {articles.map((article, i) => (
                  <motion.a
                    key={article.id}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                    className="group block"
                  >
                    <div className="glass-card overflow-hidden transition-all duration-300 hover:border-[var(--glass-card-hover-border)] hover:bg-[var(--glass-card-hover-bg)]">
                      <div
                        className={`border-l-[3px] ${urgencyBorder[article.urgency]}`}
                      >
                        <div className="flex gap-4 p-4">
                          {/* Thumbnail Image */}
                          {article.image ? (
                            <div className="flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden bg-white/5">
                              <img
                                src={article.image}
                                alt={article.headline}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
                              <Newspaper className="w-8 h-8 text-muted/20" />
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <span
                                className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                                  urgencyBadge[article.urgency]
                                }`}
                              >
                                {article.category}
                              </span>
                              <span className="text-[11px] text-muted flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {article.date}
                              </span>
                              <span className="text-[11px] text-muted/50 hidden sm:inline">
                                {article.source}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-text mb-1.5 leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                              {article.headline}
                            </h4>

                            <p className="text-xs text-muted leading-relaxed line-clamp-2">
                              {article.summary}
                            </p>
                          </div>

                          {/* Arrow */}
                          <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4 text-accent" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </AnimatePresence>

              {isLoading && (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="glass-card p-4 animate-pulse">
                      <div className="flex gap-4">
                        <div className="w-32 h-24 rounded-xl bg-white/5" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-white/5 rounded w-1/4" />
                          <div className="h-4 bg-white/5 rounded w-3/4" />
                          <div className="h-3 bg-white/5 rounded w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
