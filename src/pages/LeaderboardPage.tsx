import { useState } from "react";
import { Trophy, Medal, Zap, Flame } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { LeaderboardEntry } from "../types";

const TABS = ["Global", "Weekly", "Monthly", "Friends"] as const;
type Tab = typeof TABS[number];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center"><Trophy size={14} className="text-yellow-900" /></div>;
  if (rank === 2) return <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center"><Medal size={14} className="text-slate-600 dark:text-slate-200" /></div>;
  if (rank === 3) return <div className="w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center"><Medal size={14} className="text-amber-100" /></div>;
  return <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center"><span className="text-xs font-bold text-muted-foreground">{rank}</span></div>;
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <div className={`flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 transition-colors ${
      entry.isCurrentUser ? "bg-primary/4 border-l-2 border-l-primary" : "hover:bg-muted/30"
    }`}>
      <RankBadge rank={entry.rank} />

      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-xs font-semibold text-primary">
          {entry.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm truncate">{entry.name}</span>
          {entry.isCurrentUser && (
            <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary shrink-0">You</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>@{entry.username}</span>
          <span>·</span>
          <span>{entry.levelTitle}</span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-6 text-right">
        <div>
          <div className="flex items-center gap-1 justify-end">
            <Zap size={11} className="text-primary" />
            <span className="font-semibold text-sm">{entry.xp.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground">XP</p>
        </div>
        <div>
          <p className="font-semibold text-sm text-center">{entry.challengesCompleted}</p>
          <p className="text-xs text-muted-foreground">Challenges</p>
        </div>
        <div>
          <p className="font-semibold text-sm text-center">{entry.achievementsCount}</p>
          <p className="text-xs text-muted-foreground">Achievements</p>
        </div>
        <div>
          <div className="flex items-center gap-1 justify-end">
            <Flame size={11} className="text-orange-500" />
            <span className="font-semibold text-sm">{entry.streak}d</span>
          </div>
          <p className="text-xs text-muted-foreground">Streak</p>
        </div>
        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
          <span className="text-xs font-bold">{entry.level}</span>
        </div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const { leaderboard: LEADERBOARD } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("Global");
  const currentUser = LEADERBOARD.find(e => e.isCurrentUser);

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Leaderboard</h1>
        <p className="text-muted-foreground text-sm">See how you rank against other Python learners.</p>
      </div>

      {/* Current user rank highlight */}
      {currentUser && (
        <div className="p-4 rounded-lg border border-primary/20 bg-primary/4 mb-6 flex items-center gap-4">
          <RankBadge rank={currentUser.rank} />
          <div className="flex-1">
            <p className="font-semibold text-sm">You're currently ranked #{currentUser.rank}</p>
            <p className="text-xs text-muted-foreground">
              {currentUser.xp.toLocaleString()} XP · Level {currentUser.level} {currentUser.levelTitle}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              {LEADERBOARD[currentUser.rank - 2]
                ? `${(LEADERBOARD[currentUser.rank - 2].xp - currentUser.xp).toLocaleString()} XP behind #${currentUser.rank - 1}`
                : "You're at the top!"}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border mb-0">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="rounded-lg border border-border bg-card overflow-hidden mt-4">
        <div className="flex items-center gap-4 px-5 py-3 bg-muted/30 border-b border-border">
          <div className="w-7" />
          <div className="w-8" />
          <div className="flex-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-right">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">XP</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-20">Challenges</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-20">Achievements</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">Streak</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-6">Lvl</span>
          </div>
        </div>

        {LEADERBOARD.map(entry => (
          <LeaderboardRow key={entry.userId} entry={entry} />
        ))}
      </div>

      {/* Bottom note */}
      <p className="text-xs text-center text-muted-foreground mt-4">
        Leaderboard updates every hour. Keep learning to climb the ranks!
      </p>
    </div>
  );
}
