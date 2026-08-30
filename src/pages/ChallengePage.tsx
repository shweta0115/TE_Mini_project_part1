import { useState } from "react";
import {
  Code2, Lock, CheckCircle2, Clock, Zap, Filter,
  Search, ChevronDown
} from "lucide-react";
import { CHALLENGES } from "../data/mockData";
import { useApp } from "../context/AppContext";
import type { Challenge } from "../types";

interface ChallengePageProps {
  onOpenChallenge: (id: string) => void;
}

const DIFFICULTY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  beginner: { text: "text-green-700 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/30", border: "border-green-200 dark:border-green-800" },
  intermediate: { text: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30", border: "border-blue-200 dark:border-blue-800" },
  advanced: { text: "text-purple-700 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30", border: "border-purple-200 dark:border-purple-800" },
  expert: { text: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/30", border: "border-red-200 dark:border-red-800" },
};

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors = DIFFICULTY_COLORS[difficulty] ?? DIFFICULTY_COLORS.beginner;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border capitalize ${colors.text} ${colors.bg} ${colors.border}`}>
      {difficulty}
    </span>
  );
}

function ChallengeCard({ challenge, onOpen, userXp }: { challenge: Challenge; onOpen: () => void; userXp: number }) {
  const isLocked = challenge.status === "locked";
  const isCompleted = challenge.status === "completed";

  return (
    <div
      onClick={() => !isLocked && onOpen()}
      className={`relative flex flex-col p-5 rounded-lg border transition-all ${
        isLocked ? "border-border opacity-60 cursor-not-allowed" :
        isCompleted ? "border-green-200 dark:border-green-800 cursor-pointer hover:shadow-sm" :
        "border-border cursor-pointer hover:border-primary/40 hover:shadow-sm group"
      }`}
    >
      {isCompleted && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 size={16} className="text-green-500" />
        </div>
      )}
      {isLocked && (
        <div className="absolute top-3 right-3">
          <Lock size={14} className="text-muted-foreground" />
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <DifficultyBadge difficulty={challenge.difficulty} />
        <span className="text-xs text-muted-foreground">{challenge.topic}</span>
      </div>

      <h3 className="font-semibold text-sm mb-1.5 group-hover:text-primary transition-colors">{challenge.title}</h3>
      <p className="text-xs text-muted-foreground flex-1 mb-4 line-clamp-2">{challenge.description}</p>

      {isLocked && (challenge.requiredXp || challenge.requiredLevel) && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <Lock size={10} />
          {challenge.requiredLevel ? `Requires Level ${challenge.requiredLevel}` : `Requires ${challenge.requiredXp?.toLocaleString()} XP`}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Zap size={11} className="text-primary" />
          <span className="font-medium text-primary">+{challenge.xpReward} XP</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={11} />
          {challenge.estimatedMinutes} min
        </div>
        <div className="flex items-center gap-1">
          <Code2 size={11} />
          {challenge.testCases.length} tests
        </div>
      </div>
    </div>
  );
}

export default function ChallengePage({ onOpenChallenge }: ChallengePageProps) {
  const { currentXp } = useApp();
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = CHALLENGES.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.topic.toLowerCase().includes(search.toLowerCase());
    const matchDiff = difficultyFilter === "all" || c.difficulty === difficultyFilter;
    const matchStatus = statusFilter === "all" ||
      (statusFilter === "completed" && c.status === "completed") ||
      (statusFilter === "unlocked" && c.status === "unlocked") ||
      (statusFilter === "locked" && c.status === "locked");
    return matchSearch && matchDiff && matchStatus;
  });

  const stats = {
    total: CHALLENGES.length,
    completed: CHALLENGES.filter(c => c.status === "completed").length,
    unlocked: CHALLENGES.filter(c => c.status === "unlocked").length,
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Coding Challenges</h1>
          <p className="text-muted-foreground text-sm">Practice Python with structured coding problems.</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="font-bold text-lg">{stats.completed}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="font-bold text-lg">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Beginner", count: CHALLENGES.filter(c => c.difficulty === "beginner").length, completed: CHALLENGES.filter(c => c.difficulty === "beginner" && c.status === "completed").length },
          { label: "Intermediate", count: CHALLENGES.filter(c => c.difficulty === "intermediate").length, completed: CHALLENGES.filter(c => c.difficulty === "intermediate" && c.status === "completed").length },
          { label: "Advanced", count: CHALLENGES.filter(c => c.difficulty === "advanced").length, completed: 0 },
          { label: "Expert", count: CHALLENGES.filter(c => c.difficulty === "expert").length, completed: 0 },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-lg border border-border bg-card text-center">
            <p className="text-lg font-bold">{s.completed}<span className="text-muted-foreground font-normal text-sm">/{s.count}</span></p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-md border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
          />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-sm hover:bg-muted transition-colors">
          <Filter size={13} />
          Filters
          <ChevronDown size={13} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 mb-5 p-4 rounded-lg bg-muted/30 border border-border">
          <div>
            <p className="text-xs font-medium mb-1.5 text-muted-foreground">Difficulty</p>
            <div className="flex gap-2">
              {["all", "beginner", "intermediate", "advanced", "expert"].map(d => (
                <button key={d} onClick={() => setDifficultyFilter(d)}
                  className={`px-2.5 py-1 rounded text-xs font-medium capitalize transition-colors ${
                    difficultyFilter === d ? "bg-primary text-white" : "bg-background border border-border hover:bg-muted"
                  }`}>
                  {d === "all" ? "All" : d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium mb-1.5 text-muted-foreground">Status</p>
            <div className="flex gap-2">
              {[
                { key: "all", label: "All" },
                { key: "completed", label: "Completed" },
                { key: "unlocked", label: "Unlocked" },
                { key: "locked", label: "Locked" },
              ].map(s => (
                <button key={s.key} onClick={() => setStatusFilter(s.key)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    statusFilter === s.key ? "bg-primary text-white" : "bg-background border border-border hover:bg-muted"
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenge Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Code2 size={36} className="text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-1">No challenges found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onOpen={() => onOpenChallenge(challenge.id)}
              userXp={currentXp}
            />
          ))}
        </div>
      )}
    </div>
  );
}
