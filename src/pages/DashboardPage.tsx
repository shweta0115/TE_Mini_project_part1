import React from "react";
import {
  ArrowRight, Flame, Zap, BookOpen, Code2, CheckCircle2,
  Trophy, Target, Clock, TrendingUp, Plus, Star, Lock
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { LEVELS } from "../data/mockData";

interface DashboardProps {
  onNavigate: (view: string) => void;
  onOpenTopic?: (topicId: string) => void;
  onOpenChallenge?: (challengeId: string) => void;
}

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

// Which days of the current (Mon-first) week have a positive-XP transaction.
function computeWeekActive(transactions: { amount: number; createdAt: string }[]): boolean[] {
  const active = [false, false, false, false, false, false, false];
  const now = new Date();
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  for (const tx of transactions) {
    if (tx.amount <= 0) continue;
    const d = new Date(tx.createdAt);
    if (d < monday) continue;
    const idx = Math.floor((d.getTime() - monday.getTime()) / 86400000);
    if (idx >= 0 && idx < 7) active[idx] = true;
  }
  return active;
}

function StatCard({ label, value, icon: Icon, trend, color = "primary" }: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  trend?: string;
  color?: "primary" | "green" | "blue" | "orange";
}) {
  const colorMap = {
    primary: "text-primary bg-primary/10",
    green: "text-green-600 bg-green-100 dark:bg-green-900/30",
    blue: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    orange: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
  };
  return (
    <div className="p-5 rounded-lg border border-border bg-card hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={16} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold tracking-tight mb-0.5">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const map: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; color: string }> = {
    challenge: { icon: Code2, color: "text-primary bg-primary/10" },
    quiz: { icon: Star, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30" },
    achievement: { icon: Trophy, color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30" },
    lesson: { icon: BookOpen, color: "text-green-500 bg-green-100 dark:bg-green-900/30" },
    unlock: { icon: CheckCircle2, color: "text-green-500 bg-green-100 dark:bg-green-900/30" },
    streak: { icon: Flame, color: "text-orange-500 bg-orange-100 dark:bg-orange-900/30" },
  };
  const { icon: Icon, color } = map[type] ?? map.lesson;
  return (
    <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${color}`}>
      <Icon size={12} />
    </div>
  );
}

export default function DashboardPage({ onNavigate, onOpenTopic, onOpenChallenge }: DashboardProps) {
  const {
    currentXp, getLevelInfo, user, topics: TOPICS, challenges: CHALLENGES,
    activity: ACTIVITY, dailyChallenge: DAILY_CHALLENGE, xpTransactions: XP_TRANSACTIONS
  } = useApp();
  const levelInfo = getLevelInfo();
  const weekActive = computeWeekActive(XP_TRANSACTIONS);
  const currentLevelData = LEVELS.find(l => l.level === levelInfo.current) ?? LEVELS[0];
  const xpIntoLevel = currentXp - currentLevelData.minXp;
  const xpNeeded = levelInfo.nextXp - currentLevelData.minXp;
  const xpProgress = Math.min(Math.round((xpIntoLevel / xpNeeded) * 100), 100);

  const currentTopic =
    TOPICS.find(t => t.status === "in-progress") ??
    TOPICS.find(t => t.status === "unlocked") ??
    TOPICS[0];
  const unlockedChallenges = CHALLENGES.filter(c => c.status === "unlocked").slice(0, 2);
  const completedTopics = TOPICS.filter(t => t.status === "completed").length;

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 space-y-7">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome back, {user?.name ?? "Learner"}.</h1>
          <p className="text-muted-foreground text-sm">Continue your Python journey. You've completed {completedTopics} of {TOPICS.length} topics.</p>
        </div>
        <button
          onClick={() => onOpenTopic ? onOpenTopic(currentTopic.id) : onNavigate("learn")}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          Continue Learning <ArrowRight size={14} />
        </button>
      </div>

      {/* Top Row: Level + Streak + Daily Challenge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Level Progress */}
        <div className="p-5 rounded-lg border border-border bg-card md:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Current Level</p>
              <p className="font-bold text-lg leading-tight">{levelInfo.title}</p>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center bg-primary/5">
              <span className="text-lg font-bold text-primary">{levelInfo.current}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Zap size={11} className="text-primary" />
                <span className="font-semibold">{currentXp.toLocaleString()} XP</span>
              </div>
              <span className="text-muted-foreground">Level {levelInfo.current + 1} at {levelInfo.nextXp.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{(levelInfo.nextXp - currentXp).toLocaleString()} XP</span> until Level {levelInfo.current + 1}
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="p-5 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Learning Streak</p>
              <div className="flex items-center gap-2">
                <Flame size={20} className="text-orange-500" />
                <span className="text-2xl font-bold">{user?.streak ?? 0}</span>
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-1.5">
            {WEEK_DAYS.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className={`w-full h-7 rounded-md flex items-center justify-center transition-colors ${
                  weekActive[i]
                    ? "bg-orange-500 shadow-sm"
                    : "bg-muted"
                }`}>
                  {weekActive[i] ? (
                    <CheckCircle2 size={11} className="text-white" />
                  ) : (
                    <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground font-medium">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Challenge */}
        <div className={`p-5 rounded-lg border transition-all ${
          DAILY_CHALLENGE.completed
            ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10"
            : "border-primary/25 bg-gradient-to-br from-primary/4 to-transparent"
        }`}>
          <div className="flex items-center gap-1.5 mb-3">
            <Target size={13} className={DAILY_CHALLENGE.completed ? "text-green-600" : "text-primary"} />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Daily Challenge</span>
          </div>

          {DAILY_CHALLENGE.completed ? (
            <div>
              <p className="font-semibold text-sm mb-1">{DAILY_CHALLENGE.title}</p>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={14} className="text-green-600" />
                <span className="text-xs text-green-600 font-medium">Completed · +{DAILY_CHALLENGE.xpReward} XP</span>
              </div>
              <p className="text-xs text-muted-foreground">Come back tomorrow for a new challenge.</p>
            </div>
          ) : (
            <>
              <p className="font-semibold mb-2">{DAILY_CHALLENGE.title}</p>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-4">
                <span className="capitalize font-medium text-foreground">{DAILY_CHALLENGE.difficulty}</span>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Zap size={11} className="text-primary" />
                  <span className="text-primary font-semibold">+{DAILY_CHALLENGE.xpReward} XP</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Clock size={11} />
                  {DAILY_CHALLENGE.estimatedMinutes} min
                </div>
              </div>
              <button
                onClick={() => onOpenChallenge?.(DAILY_CHALLENGE.challengeId)}
                className="w-full py-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
              >
                Start Challenge <ArrowRight size={12} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Lessons Completed" value={user?.stats.lessonsCompleted ?? completedTopics} icon={BookOpen} color="green" />
        <StatCard label="Quizzes Completed" value={user?.stats.quizzesCompleted ?? 0} icon={Star} color="blue" />
        <StatCard label="Coding Challenges" value={user?.stats.challengesCompleted ?? 0} icon={Code2} color="primary" />
        <StatCard label="Quiz Accuracy" value={`${user?.stats.quizAccuracy ?? 0}%`} icon={TrendingUp} color="orange" />
      </div>

      {/* Current Topic + Recent Activity */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* In Progress Topic */}
        <div className="p-5 rounded-lg border border-border bg-card">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">In Progress</p>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="font-semibold mb-1">{currentTopic.title}</h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock size={11} />
                  {currentTopic.estimatedMinutes} min
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={11} className="text-primary" />
                  <span className="text-primary font-medium">+{currentTopic.xpReward} XP</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onOpenTopic?.(currentTopic.id)}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors shrink-0 whitespace-nowrap"
            >
              Continue <ArrowRight size={11} />
            </button>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentTopic.progress}% complete</span>
              <span>
                {Math.round((currentTopic.subtopics.length * currentTopic.progress) / 100)}/{currentTopic.subtopics.length} subtopics
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${currentTopic.progress}%` }} />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">Up next in the learning path:</p>
            {TOPICS.filter(t => t.status === "unlocked").slice(0, 2).map(t => (
              <div key={t.id}
                onClick={() => onOpenTopic?.(t.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors group"
              >
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{t.order}</span>
                </div>
                <span className="text-xs font-medium group-hover:text-primary transition-colors flex-1">{t.title}</span>
                <ArrowRight size={11} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-5 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Recent Activity</p>
            <button onClick={() => onNavigate("progress")}
              className="text-xs text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1">
              View all <ArrowRight size={11} />
            </button>
          </div>
          <div className="space-y-3">
            {ACTIVITY.slice(0, 6).map(act => (
              <div key={act.id} className="flex items-center gap-3 group">
                <ActivityIcon type={act.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate leading-snug">{act.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(act.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
                  </p>
                </div>
                {act.xp && (
                  <span className="text-xs font-semibold text-primary shrink-0">+{act.xp} XP</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Challenges */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Recommended for You</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Based on your current learning path.</p>
          </div>
          <button onClick={() => onNavigate("challenges")}
            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1">
            Browse all <ArrowRight size={11} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {unlockedChallenges.map(c => (
            <div key={c.id}
              onClick={() => onOpenChallenge?.(c.id)}
              className="flex flex-col p-4 rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-sm cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <Code2 size={13} className="text-primary" />
                </div>
                <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${
                  c.difficulty === "beginner" ? "text-green-700 bg-green-100 dark:bg-green-900/30" :
                  c.difficulty === "intermediate" ? "text-blue-700 bg-blue-100 dark:bg-blue-900/30" : "text-purple-700 bg-purple-100 dark:bg-purple-900/30"
                }`}>{c.difficulty}</span>
              </div>
              <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">{c.title}</h4>
              <p className="text-xs text-muted-foreground flex-1 mb-3 line-clamp-2">{c.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><Zap size={10} className="text-primary" /><span className="text-primary font-semibold">+{c.xpReward} XP</span></div>
                  <div className="flex items-center gap-1"><Clock size={10} />{c.estimatedMinutes} min</div>
                </div>
                <ArrowRight size={13} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
              </div>
            </div>
          ))}
          {/* Explore more */}
          <div onClick={() => onNavigate("challenges")}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors text-center group">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Plus size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Explore Challenges</p>
            <p className="text-xs text-muted-foreground">Browse 200+ Python problems</p>
          </div>
        </div>
      </div>

      {/* Mobile continue button */}
      <div className="sm:hidden">
        <button
          onClick={() => onOpenTopic ? onOpenTopic(currentTopic.id) : onNavigate("learn")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Continue Learning <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
