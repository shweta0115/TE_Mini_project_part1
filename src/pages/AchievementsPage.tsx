import React, { useState } from "react";
import { Trophy, BookOpen, Code2, Star, Flame, Zap, Type, Moon, Award, RefreshCw, Target, CheckCircle2, Lock } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Achievement } from "../types";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  BookOpen, Code2, Trophy, Flame, Zap, Star, Type, Moon, Award, RefreshCw, Target,
};

const CATEGORY_TABS = ["All", "Learning", "Challenges", "Streaks", "Accuracy", "Speed"] as const;
type CategoryTab = typeof CATEGORY_TABS[number];

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const Icon = ICON_MAP[achievement.icon] ?? Trophy;
  const pct = Math.min(Math.round((achievement.progress / achievement.total) * 100), 100);

  return (
    <div className={`flex gap-4 p-4 rounded-lg border transition-all ${
      achievement.earned
        ? "border-primary/20 bg-primary/3"
        : "border-border hover:border-primary/20"
    }`}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
        achievement.earned
          ? "bg-primary/15 border border-primary/20"
          : "bg-muted border border-border"
      }`}>
        {achievement.earned ? (
          <Icon size={20} className="text-primary" />
        ) : (
          <Icon size={20} className="text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <h3 className={`font-semibold text-sm ${achievement.earned ? "text-foreground" : "text-muted-foreground"}`}>
              {achievement.title}
            </h3>
            <p className="text-xs text-muted-foreground">{achievement.description}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {achievement.earned ? (
              <span className="flex items-center gap-1 text-xs font-medium text-primary">
                <Zap size={10} />+{achievement.xpReward} XP
              </span>
            ) : (
              <Lock size={12} className="text-muted-foreground" />
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-2">{achievement.requirement}</p>

        {!achievement.earned && (
          <div>
            <div className="flex items-center justify-between mb-1 text-xs text-muted-foreground">
              <span>{achievement.progress} / {achievement.total}</span>
              <span>{pct}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary/50 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {achievement.earned && achievement.earnedAt && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 size={11} className="text-green-500" />
            <span>Earned {new Date(achievement.earnedAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const { achievements: ACHIEVEMENTS } = useApp();
  const [tab, setTab] = useState<CategoryTab>("All");

  const filtered = ACHIEVEMENTS.filter(a => {
    if (tab === "All") return true;
    return a.category === tab.toLowerCase();
  });

  const earned = ACHIEVEMENTS.filter(a => a.earned).length;
  const total = ACHIEVEMENTS.length;

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Achievements</h1>
          <p className="text-muted-foreground text-sm">Track your milestones and unlock achievement badges.</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{earned}<span className="text-muted-foreground text-lg font-normal">/{total}</span></p>
          <p className="text-xs text-muted-foreground">achievements earned</p>
        </div>
      </div>

      {/* Progress */}
      <div className="p-4 rounded-lg border border-border bg-card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-semibold">{Math.round((earned / total) * 100)}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${Math.round((earned / total) * 100)}%` }} />
        </div>
        <div className="flex items-center justify-between mt-1.5 text-xs text-muted-foreground">
          <span>{earned} earned</span>
          <span>{total - earned} remaining</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {CATEGORY_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === t
                ? "bg-primary text-white"
                : "border border-border hover:bg-muted text-muted-foreground"
            }`}>
            {t}
            {t !== "All" && (
              <span className="ml-1.5 opacity-60">
                ({ACHIEVEMENTS.filter(a => a.category === t.toLowerCase()).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Achievements list: earned first */}
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 size={11} className="text-green-500" /> Earned
          </p>
          <div className="space-y-2">
            {filtered.filter(a => a.earned).map(a => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        </div>

        {filtered.filter(a => !a.earned).length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5 mt-4">
              <Lock size={11} /> In Progress
            </p>
            <div className="space-y-2">
              {filtered.filter(a => !a.earned).map(a => (
                <AchievementCard key={a.id} achievement={a} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
