import React from "react";
import {
  ArrowRight, Flame, Sparkles, BookOpen, Code2, CheckCircle2,
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

function ActivityIcon({ type }: { type: string }) {
  const map: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; color: string }> = {
    challenge: { icon: Code2, color: "text-primary bg-green-soft" },
    quiz: { icon: Star, color: "text-teal bg-green-pale" },
    achievement: { icon: Trophy, color: "text-primary bg-secondary" },
    lesson: { icon: BookOpen, color: "text-primary bg-secondary" },
    unlock: { icon: CheckCircle2, color: "text-primary bg-secondary" },
    streak: { icon: Flame, color: "text-primary bg-green-soft" },
  };
  const { icon: Icon, color } = map[type] ?? map.lesson;
  return (
    <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${color}`}>
      <Icon size={13} />
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
          <h1 className="pq-page-heading text-2xl font-bold tracking-tight mb-1">Welcome back, {user?.name ?? "Learner"}.</h1>
          <p className="text-muted-foreground text-sm">Continue your Python journey. You've completed {completedTopics} of {TOPICS.length} topics.</p>
        </div>
        <button
          onClick={() => onOpenTopic ? onOpenTopic(currentTopic.id) : onNavigate("learn")}
          className="pq-charcoal-action hidden sm:flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium"
        >
          Continue Learning <ArrowRight size={14} />
        </button>
      </div>

      {/* Top Row: Level + Streak + Daily Challenge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Level Progress */}
        <div className="pq-feature-card p-5 md:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="pq-feature-card__eyebrow text-xs font-semibold uppercase tracking-widest mb-1">Current Level</p>
              <p className="pq-feature-card__title font-semibold text-lg leading-tight">{levelInfo.title}</p>
            </div>
            <div className="pq-feature-card__level-mark w-11 h-11 rounded-full border flex items-center justify-center">
              <span className="text-base font-semibold tabular-nums">{levelInfo.current}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Sparkles size={11} strokeWidth={1.8} className="pq-feature-card__reward" />
                <span className="pq-feature-card__metric font-semibold tabular-nums">{currentXp.toLocaleString()} XP</span>
              </div>
              <span className="pq-feature-card__muted">Level {levelInfo.current + 1} at {levelInfo.nextXp.toLocaleString()}</span>
            </div>
            <div className="pq-feature-card__progress-track w-full h-1.5 rounded-full overflow-hidden">
              <div
                className="pq-feature-card__progress-fill h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="pq-feature-card__muted text-xs">
              <span className="pq-feature-card__metric font-medium">{(levelInfo.nextXp - currentXp).toLocaleString()} XP</span> until Level {levelInfo.current + 1}
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="p-5 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">Learning Streak</p>
              <div className="flex items-center gap-2">
                <Flame size={20} className="text-primary" />
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
                    ? "bg-primary"
                    : "bg-muted"
                }`}>
                  {weekActive[i] ? (
                    <CheckCircle2 size={11} className="text-primary-foreground" />
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
        <div className={`p-5 rounded-lg border transition-colors ${
          DAILY_CHALLENGE.completed
            ? "border-success/20 bg-secondary"
            : "pq-feature-card"
        }`}>
          <div className="flex items-center gap-1.5 mb-3">
            <Target size={13} className={DAILY_CHALLENGE.completed ? "text-success" : "text-primary"} />
            <span className={`text-xs font-semibold uppercase tracking-widest ${DAILY_CHALLENGE.completed ? "text-muted-foreground" : "pq-feature-card__eyebrow"}`}>Daily Challenge</span>
          </div>

          {DAILY_CHALLENGE.completed ? (
            <div>
              <p className="font-semibold text-sm mb-1">{DAILY_CHALLENGE.title}</p>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={14} className="text-success" />
                <span className="text-xs text-success font-medium">Completed · <span className="text-warning">+{DAILY_CHALLENGE.xpReward} XP</span></span>
              </div>
              <p className="text-xs text-muted-foreground">Come back tomorrow for a new challenge.</p>
            </div>
          ) : (
            <>
              <p className="pq-feature-card__title font-semibold mb-2">{DAILY_CHALLENGE.title}</p>
              <div className="pq-feature-card__muted flex items-center flex-wrap gap-x-3 gap-y-1 text-xs mb-4">
                <span className="capitalize font-medium pq-feature-card__metric">{DAILY_CHALLENGE.difficulty}</span>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Sparkles size={11} strokeWidth={1.8} className="pq-feature-card__reward" />
                  <span className="pq-feature-card__reward font-semibold">+{DAILY_CHALLENGE.xpReward} XP</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Clock size={11} />
                  {DAILY_CHALLENGE.estimatedMinutes} min
                </div>
              </div>
              <button
                onClick={() => onOpenChallenge?.(DAILY_CHALLENGE.challengeId)}
                className="pq-charcoal-action w-full py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                Start Challenge <ArrowRight size={12} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Learning Overview */}
      <section className="learning-overview" aria-labelledby="learning-overview-title">
        <h2 id="learning-overview-title" className="learning-overview__title">Learning Overview</h2>
        <div className="learning-overview__grid">
          {[
            { label: "Lessons", value: user?.stats.lessonsCompleted ?? completedTopics, detail: "Completed", icon: BookOpen, tone: "green" },
            { label: "Quizzes", value: user?.stats.quizzesCompleted ?? 0, detail: "Completed", icon: Star, tone: "teal" },
            { label: "Challenges", value: user?.stats.challengesCompleted ?? 0, detail: "Completed", icon: Code2, tone: "charcoal" },
            { label: "Accuracy", value: `${user?.stats.quizAccuracy ?? 0}%`, detail: "Average", icon: TrendingUp, tone: "green" },
          ].map(metric => (
            <div className="learning-overview__metric" key={metric.label}>
              <div className="learning-overview__label">
                <metric.icon size={16} strokeWidth={1.8} className={`learning-overview__icon learning-overview__icon--${metric.tone}`} />
                <span>{metric.label}</span>
              </div>
              <p className="learning-overview__value">{metric.value}</p>
              <p className="learning-overview__detail">{metric.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Current Topic + Recent Activity */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* In Progress Topic */}
        <section className="dashboard-list-section" aria-labelledby="dashboard-in-progress-title">
          <div className="dashboard-list-section__heading">
            <h2 id="dashboard-in-progress-title">In Progress</h2>
            <span>{currentTopic.progress}%</span>
          </div>
          <div className="dashboard-topic-row">
            <div className="dashboard-topic-row__main">
              <div className="min-w-0">
                <h3>{currentTopic.title}</h3>
                <div className="dashboard-topic-row__meta">
                  <span><Clock size={12} /> {currentTopic.estimatedMinutes} min</span>
                  <span className="dashboard-reward"><Sparkles size={12} strokeWidth={1.8} /> +{currentTopic.xpReward} XP</span>
                </div>
              </div>
              <button
                onClick={() => onOpenTopic?.(currentTopic.id)}
                className="dashboard-continue-link"
              >
                Continue <ArrowRight size={13} />
              </button>
            </div>
            <div className="dashboard-topic-row__progress-meta">
              <span>{currentTopic.progress}% complete</span>
              <span>{Math.round((currentTopic.subtopics.length * currentTopic.progress) / 100)}/{currentTopic.subtopics.length} subtopics</span>
            </div>
            <div className="dashboard-topic-row__track"><div style={{ width: `${currentTopic.progress}%` }} /></div>
          </div>
          <div className="dashboard-up-next">
            <p>Up next in the learning path</p>
            {TOPICS.filter(t => t.status === "unlocked").slice(0, 2).map(t => (
              <button key={t.id} onClick={() => onOpenTopic?.(t.id)}>
                <span className="dashboard-up-next__number">{t.order}</span>
                <span>{t.title}</span>
                <ArrowRight size={12} />
              </button>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="dashboard-list-section" aria-labelledby="dashboard-activity-title">
          <div className="dashboard-list-section__heading">
            <h2 id="dashboard-activity-title">Recent Activity</h2>
            <button onClick={() => onNavigate("progress")} className="dashboard-continue-link">
              View all <ArrowRight size={13} />
            </button>
          </div>
          <div className="dashboard-activity-list">
            {ACTIVITY.slice(0, 6).map(act => (
              <div key={act.id} className="dashboard-activity-row">
                <ActivityIcon type={act.type} />
                <div className="flex-1 min-w-0">
                  <p className="dashboard-activity-row__title">{act.title}</p>
                  <p className="dashboard-activity-row__date">{new Date(act.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}</p>
                </div>
                {act.xp && <span className="dashboard-reward">+{act.xp} XP</span>}
              </div>
            ))}
          </div>
        </section>
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
                  c.difficulty === "beginner" ? "text-primary bg-secondary" :
                  c.difficulty === "intermediate" ? "text-foreground bg-muted" : "text-foreground bg-muted"
                }`}>{c.difficulty}</span>
              </div>
              <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">{c.title}</h4>
              <p className="text-xs text-muted-foreground flex-1 mb-3 line-clamp-2">{c.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><Sparkles size={10} strokeWidth={1.8} className="text-warning" /><span className="text-warning font-semibold">+{c.xpReward} XP</span></div>
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
          className="pq-charcoal-action w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium"
        >
          Continue Learning <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
