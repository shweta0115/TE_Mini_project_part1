import React from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts";
import { Sparkles, Flame, BookOpen, Star, Code2, TrendingUp, Award, Calendar } from "lucide-react";
import { useApp } from "../context/AppContext";

function StatCard({ icon: Icon, label, value, sub, color = "primary" }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  sub?: string;
  color?: "primary" | "amber" | "green" | "neutral" | "teal";
}) {
  const colorMap = {
    primary: "text-primary bg-secondary",
    amber: "text-warning bg-warning/10",
    green: "text-primary bg-secondary",
    neutral: "text-foreground bg-muted",
    teal: "text-teal bg-green-pale",
  };
  return (
    <div className="analytics-stat">
      <div className={`analytics-stat__icon ${colorMap[color]}`}>
        <Icon size={16} strokeWidth={1.8} />
      </div>
      <p className="analytics-stat__value">{value}</p>
      <p className="analytics-stat__label">{label}</p>
      {sub && <p className="analytics-stat__sub">{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card shadow-lg p-3 text-xs">
      <p className="font-semibold mb-1.5 text-foreground">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="flex items-center gap-1.5" style={{ color: entry.color }}>
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: entry.color }} />
          {entry.name}: <span className="font-semibold ml-auto pl-3">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

const HEATMAP_WEEKS = 15;
const HEATMAP_DAYS = HEATMAP_WEEKS * 7;
const LEVEL_COLORS = [
  "bg-muted dark:bg-muted",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/65",
  "bg-primary",
];
const WEEKDAY_LABELS: Record<number, string> = { 1: "Mon", 3: "Wed", 5: "Fri" };

type HeatCell = { date: string; xp: number; future: boolean };

function xpLevel(xp: number, maxXp: number): 0 | 1 | 2 | 3 | 4 {
  if (xp <= 0) return 0;
  if (maxXp <= 0) return 1;
  const ratio = xp / maxXp;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function buildHeatmap(dailyActivity: { date: string; xp: number }[]): HeatCell[] {
  const totals = new Map(dailyActivity.map(d => [d.date, d.xp]));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start on the Sunday on/before (today - HEATMAP_DAYS + 1) so columns are Mon..Sun weeks.
  const start = new Date(today);
  start.setDate(start.getDate() - (HEATMAP_DAYS - 1));
  const startDow = (start.getDay() + 6) % 7; // 0 = Monday
  start.setDate(start.getDate() - startDow);

  const cells: HeatCell[] = [];
  for (let i = 0; i < HEATMAP_DAYS + 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (d > today) {
      cells.push({ date: d.toISOString().slice(0, 10), xp: 0, future: true });
    } else {
      const key = d.toISOString().slice(0, 10);
      cells.push({ date: key, xp: totals.get(key) ?? 0, future: false });
    }
  }
  return cells;
}

function ActivityHeatmap({ dailyActivity }: { dailyActivity: { date: string; xp: number }[] }) {
  const cells = buildHeatmap(dailyActivity);
  const maxXp = cells.reduce((max, c) => Math.max(max, c.xp), 0);
  const activeDays = cells.filter(c => !c.future && c.xp > 0).length;

  const weeks: HeatCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  // Month label per week column, shown when the week contains the 1st of a month.
  const monthLabels = weeks.map(week => {
    const firstOfMonth = week.find(cell => cell.date.endsWith("-01") && !cell.future);
    if (!firstOfMonth) return "";
    return new Date(`${firstOfMonth.date}T00:00:00`).toLocaleDateString("en", { month: "short" });
  });

  return (
    <div className="p-5 rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-primary" />
          <h3 className="font-semibold text-sm">Activity Heatmap</h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{activeDays} active day{activeDays === 1 ? "" : "s"} in the last {HEATMAP_WEEKS} weeks</span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            {LEVEL_COLORS.map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c} border border-border/30`} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1 min-w-max">
          {/* Day labels */}
          <div className="flex flex-col justify-around pr-1" style={{ paddingTop: "18px" }}>
            {[0, 1, 2, 3, 4, 5, 6].map(dow => (
              <span key={dow} className="text-xs text-muted-foreground leading-none"
                style={{ height: "13px", lineHeight: "13px" }}>
                {WEEKDAY_LABELS[dow] ?? ""}
              </span>
            ))}
          </div>
          {/* Grid */}
          <div>
            {/* Month labels aligned to their week column */}
            <div className="flex gap-1 mb-1">
              {monthLabels.map((label, wi) => (
                <span key={wi} className="text-xs text-muted-foreground" style={{ width: "12px" }}>
                  {label}
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((cell, di) => (
                    <div key={di}
                      title={cell.future
                        ? cell.date
                        : `${cell.date}: ${cell.xp} XP earned`}
                      className={`w-3 h-3 rounded-sm cursor-default transition-opacity hover:opacity-80 ${
                        cell.future ? "bg-transparent" : LEVEL_COLORS[xpLevel(cell.xp, maxXp)]
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { analytics: ANALYTICS, xpTransactions: XP_TRANSACTIONS, user, currentXp, topics, challenges } = useApp();
  const completedTopics = topics.filter(t => t.status === "completed").length;
  const completedChallenges = challenges.filter(c => c.status === "completed").length;

  // Prefer the backend's per-day activity; fall back to deriving it from XP transactions.
  const dailyActivity = ANALYTICS.dailyActivity?.length
    ? ANALYTICS.dailyActivity
    : Object.entries(
        XP_TRANSACTIONS.reduce<Record<string, number>>((acc, tx) => {
          if (tx.amount <= 0) return acc;
          const key = new Date(tx.createdAt).toISOString().slice(0, 10);
          acc[key] = (acc[key] ?? 0) + tx.amount;
          return acc;
        }, {}),
      ).map(([date, xp]) => ({ date, xp }));
  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="pq-page-heading text-2xl font-bold mb-1">Progress Analytics</h1>
        <p className="text-muted-foreground text-sm">Track your learning journey and identify areas for growth.</p>
      </div>

      {/* Stats Row */}
      <div className="analytics-stats-row grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6">
        <StatCard icon={Sparkles} label="Total XP" value={currentXp.toLocaleString()} color="amber" />
        <StatCard icon={Flame} label="Current Streak" value={`${user?.streak ?? 0} days`} color="amber" />
        <StatCard icon={BookOpen} label="Topics Done" value={String(completedTopics)} sub={`of ${topics.length} total`} color="green" />
        <StatCard icon={Star} label="Quiz Accuracy" value={`${user?.stats.quizAccuracy ?? 0}%`} color="teal" />
        <StatCard icon={Code2} label="Challenges" value={String(completedChallenges)} color="neutral" />
        <StatCard icon={TrendingUp} label="Hours Learned" value={`${user?.stats.learningHours ?? 0}h`} color="primary" />
      </div>

      {/* Heatmap */}
      <div className="mb-6">
        <ActivityHeatmap dailyActivity={dailyActivity} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="p-5 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">XP Growth</h3>
            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">Last 6 weeks</span>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={ANALYTICS.xpByWeek} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="xp" name="XP Earned"
                stroke="var(--primary)" strokeWidth={2}
                fill="url(#xpGrad)"
                dot={{ fill: "var(--primary)", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Weekly Activity</h3>
            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">This week</span>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={ANALYTICS.weeklyActivity} barGap={2} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="xp" name="XP" fill="var(--primary)" radius={[3, 3, 0, 0]} maxBarSize={18} />
              <Bar dataKey="challenges" name="Challenges" fill="var(--accent)" radius={[3, 3, 0, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="p-5 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Quiz Accuracy by Topic</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ANALYTICS.accuracyByTopic} layout="vertical" barSize={10}
              margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
              <YAxis dataKey="topic" type="category" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="accuracy" name="Accuracy" fill="var(--primary)" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-5 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Topic Mastery</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={ANALYTICS.topicMastery.slice(0, 6)} margin={{ top: 8, right: 30, bottom: 8, left: 30 }}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="topic" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} />
              <Radar dataKey="mastery" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="p-5 rounded-lg border border-border bg-card mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Award size={15} className="text-primary" />
          <h3 className="font-semibold text-sm">Learning Insights</h3>
        </div>
        <div className="learning-insights-list">
          {[
            "Your strongest topic is Conditional Statements with 97% quiz accuracy.",
            "Quiz accuracy improved by 12% compared to last month.",
            "You completed 5 challenges this week — your best week yet!",
          ].map((insight, i) => (
            <div key={i} className="learning-insight-row">
              <div className="learning-insight-row__mark" />
              <p>{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* XP History */}
      <div className="p-5 rounded-lg border border-border bg-card">
        <h3 className="font-semibold text-sm mb-4">XP Transaction History</h3>
        <div className="divide-y divide-border">
          {XP_TRANSACTIONS.slice(0, 10).map(tx => (
            <div key={tx.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                  tx.type === "earned"
                    ? "bg-warning/10"
                    : "bg-muted"
                }`}>
                  <Sparkles size={12} strokeWidth={1.8} className="text-warning" />
                </div>
                <span className="text-sm">{tx.description}</span>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-foreground">
                  {tx.type === "earned" ? "+" : ""}{tx.amount} XP
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(tx.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
