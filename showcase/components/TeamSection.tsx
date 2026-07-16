"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, BookOpen, Users, UserPlus, ExternalLink } from "lucide-react";
import { TEAM } from "@/lib/data";

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  bio: string | null;
}

interface TeamMemberWithGitHub {
  name: string;
  id: string;
  username: string;
  github: GitHubUser | null;
  loading: boolean;
}

const GRADIENTS = [
  "from-accent/20 via-cyan-500/10 to-blue-500/20",
  "from-violet-500/20 via-purple-500/10 to-fuchsia-500/20",
  "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
  "from-amber-500/20 via-orange-500/10 to-rose-500/20",
];

const GLOW_COLORS = [
  "rgba(14,165,233,0.35)",
  "rgba(139,92,246,0.35)",
  "rgba(16,185,129,0.35)",
  "rgba(245,158,11,0.35)",
];

export function TeamSection() {
  const [members, setMembers] = useState<TeamMemberWithGitHub[]>(
    TEAM.map((m) => ({ ...m, github: null, loading: true }))
  );

  useEffect(() => {
    const fetchUsers = async () => {
      const results = await Promise.allSettled(
        TEAM.map(async (member) => {
          try {
            const res = await fetch(
              `https://api.github.com/users/${member.username}`
            );
            if (!res.ok) throw new Error("Not found");
            const data: GitHubUser = await res.json();
            return { ...member, github: data, loading: false };
          } catch {
            return { ...member, github: null, loading: false };
          }
        })
      );

      setMembers(
        results.map((r, i) =>
          r.status === "fulfilled"
            ? r.value
            : { ...TEAM[i], github: null, loading: false }
        )
      );
    };

    fetchUsers();
  }, []);

  return (
    <section id="team" className="relative py-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="section-label w-fit mx-auto mb-4">
            <Github className="w-3.5 h-3.5" />
            The Team
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Built by{" "}
            <span className="gradient-text">Team Ryzen 4090</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Four developers, one mission — making flood intelligence
            accessible to every district in Bangladesh.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, i) => (
            <motion.a
              key={member.id}
              href={member.github?.html_url ?? `https://github.com/${member.username}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -8 }}
              onHoverStart={() => {}}
              className="group relative flex flex-col rounded-3xl overflow-hidden cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 40px ${GLOW_COLORS[i]}, 0 20px 50px rgba(0,0,0,0.4)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[i]} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Card content */}
              <div className="relative glass-card p-6 flex flex-col items-center text-center h-full border-0!">
                {/* Avatar */}
                <div className="mb-5 relative">
                  {member.loading ? (
                    <div className="w-24 h-24 rounded-2xl bg-white/5 animate-pulse" />
                  ) : member.github?.avatar_url ? (
                    <>
                      {/* Glow ring behind avatar */}
                      <div
                        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"
                        style={{ background: GLOW_COLORS[i] }}
                      />
                      <img
                        src={member.github.avatar_url}
                        alt={member.github.login}
                        className="w-24 h-24 rounded-2xl border-2 border-white/15 group-hover:border-white/30 transition-colors relative z-10"
                        loading="lazy"
                      />
                    </>
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-accent/15 border-2 border-white/15 flex items-center justify-center">
                      <span className="text-3xl font-bold text-accent">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold text-text mb-1 group-hover:text-accent transition-colors">
                  {member.github?.name || member.name}
                </h3>

                {/* Student ID */}
                <p className="text-xs font-mono text-muted/60 mb-4">
                  {member.id}
                </p>

                {/* GitHub username */}
                {member.github?.login && (
                  <p className="text-xs text-accent/70 mb-4 flex items-center gap-1">
                    <Github className="w-3 h-3" />
                    @{member.github.login}
                  </p>
                )}

                {/* Bio if available */}
                {member.github?.bio && (
                  <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-2">
                    {member.github.bio}
                  </p>
                )}

                {/* Spacer to push stats to bottom */}
                <div className="flex-1" />

                {/* Stats Row */}
                <div className="w-full pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-3">
                  <StatItem
                    icon={BookOpen}
                    value={member.github?.public_repos}
                    label="Repos"
                    loading={member.loading}
                  />
                  <StatItem
                    icon={Users}
                    value={member.github?.followers}
                    label="Followers"
                    loading={member.loading}
                  />
                  <StatItem
                    icon={UserPlus}
                    value={member.github?.following}
                    label="Following"
                    loading={member.loading}
                  />
                </div>

                {/* View Profile link */}
                <div className="w-full mt-4 flex items-center justify-center gap-1.5 text-xs text-muted/40 group-hover:text-accent/60 transition-colors">
                  <span>View Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({
  icon: Icon,
  value,
  label,
  loading,
}: {
  icon: React.ElementType;
  value: number | undefined;
  label: string;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className="w-3.5 h-3.5 text-muted/50" />
      {loading ? (
        <div className="w-8 h-3 rounded bg-white/5 animate-pulse" />
      ) : (
        <span className="text-sm font-mono font-bold text-text">
          {value ?? "—"}
        </span>
      )}
      <span className="text-[9px] text-muted/50 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
