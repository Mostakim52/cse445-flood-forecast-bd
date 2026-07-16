"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, BookOpen, Users, UserPlus } from "lucide-react";
import { TEAM } from "@/lib/data";

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface TeamMemberWithGitHub {
  name: string;
  id: string;
  username: string;
  github: GitHubUser | null;
  loading: boolean;
}

export function TeamCards() {
  const [members, setMembers] = useState<TeamMemberWithGitHub[]>(
    TEAM.map((m) => ({ ...m, github: null, loading: true }))
  );

  useEffect(() => {
    const fetchUsers = async () => {
      const results = await Promise.allSettled(
        TEAM.map(async (member) => {
          try {
            const res = await fetch(
              `https://api.github.com/users/${member.username}`,
              { next: { revalidate: 3600 } }
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {members.map((member, i) => (
        <motion.a
          key={member.id}
          href={member.github?.html_url ?? `https://github.com/${member.username}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          whileHover={{ y: -4 }}
          className="group relative flex flex-col p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-accent/30 hover:bg-accent/[0.04] transition-all duration-300 cursor-pointer overflow-hidden"
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 0 24px rgba(14,165,233,0.1), 0 8px 32px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* Top row: Name + Avatar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-text group-hover:text-accent transition-colors truncate">
                {member.github?.name || member.name}
              </span>
              <span className="text-[11px] font-mono text-muted/60 mt-0.5">
                {member.id}
              </span>
            </div>

            {/* Avatar */}
            <div className="flex-shrink-0 ml-3">
              {member.loading ? (
                <div className="w-11 h-11 rounded-full bg-white/5 animate-pulse" />
              ) : member.github?.avatar_url ? (
                <img
                  src={member.github.avatar_url}
                  alt={member.github.login}
                  className="w-11 h-11 rounded-full border-2 border-white/10 group-hover:border-accent/30 transition-colors"
                  loading="lazy"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-accent/10 border-2 border-white/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-accent">
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom row: Stats + GitHub logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Repos */}
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-muted/50" />
                {member.loading ? (
                  <div className="w-6 h-2.5 rounded bg-white/5 animate-pulse" />
                ) : (
                  <span className="text-[11px] font-mono text-muted">
                    {member.github?.public_repos ?? "—"}
                  </span>
                )}
                <span className="text-[10px] text-muted/40 hidden sm:inline">
                  repos
                </span>
              </div>

              {/* Followers */}
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-muted/50" />
                {member.loading ? (
                  <div className="w-6 h-2.5 rounded bg-white/5 animate-pulse" />
                ) : (
                  <span className="text-[11px] font-mono text-muted">
                    {member.github?.followers ?? "—"}
                  </span>
                )}
                <span className="text-[10px] text-muted/40 hidden sm:inline">
                  followers
                </span>
              </div>

              {/* Following */}
              <div className="flex items-center gap-1.5">
                <UserPlus className="w-3 h-3 text-muted/50" />
                {member.loading ? (
                  <div className="w-6 h-2.5 rounded bg-white/5 animate-pulse" />
                ) : (
                  <span className="text-[11px] font-mono text-muted">
                    {member.github?.following ?? "—"}
                  </span>
                )}
              </div>
            </div>

            {/* GitHub logo */}
            <Github className="w-4 h-4 text-muted/25 group-hover:text-accent/50 transition-colors flex-shrink-0" />
          </div>

          {/* Username subtitle (login) */}
          {member.github?.login && (
            <div className="mt-2 pt-2 border-t border-white/[0.04]">
              <span className="text-[10px] text-muted/40">
                @{member.github.login}
              </span>
            </div>
          )}
        </motion.a>
      ))}
    </div>
  );
}
