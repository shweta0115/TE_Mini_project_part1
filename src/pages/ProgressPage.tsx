import React from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts";
import { Zap, Flame, BookOpen, Star, Code2, TrendingUp, Award, Calendar } from "lucide-react";
import { ANALYTICS, XP_TRANSACTIONS } from "../data/mockData";

function StatCard({ icon: Icon, label, value, sub, color = "primary" }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  sub?: string;
  color?: "primary" | "orange" | "blue" | "green" | "purple";
}) {
  const colorMap = {
    primary: "text-primary bg-primary/10",
    orange: "text-orange-500 bg-orange-100 dark:bg-orange-900/30",
    blue: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    green: "text-green-600 bg-green-100 dark:bg-green-900/30",
    purple: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
  };
  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <div className={`w-8 h-8 rounded-md flex items-center justify-center mb-3 ${colorMap[color]}`}>
        <Icon size={15} />
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
      {sub && <p className="text-xs text-green-600 font-medium mt-0.5">{sub}</p>}
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

// Generate realistic heatmap data for the past 15 weeks (~105 days)
function generateHeatmapData() {
  const cells: { date: string; xp: number; level: 0 | 1 | 2 | 3 | 4 }[] = [];
  const today = new Date("2024-11-23");
  const realActive: Record<string, number> = {
    "2024-11-11": 60, "2024-11-12": 80, "2024-11-13": 30, "2024-11-14": 120,
    "2024-11-15": 200, "2024-11-16": 50, "2024-11-17": 70, "2024-11-18": 40,
    "2024-11-19": 90, "2024-11-20": 125, "2024-11-21": 95, "2024-11-22": 145,
  };

  const rng = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 104; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const r = rng(i * 13 + 7);

    let xp = 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (realActive[key] !== undefined) {
      xp = realActive[key];
    } else if (i > 14) {
      const prob = i < 60 ? 0.6 : 0.45;
      if (r < prob) {
        xp = Math.round((rng(i * 7 + 3) * 180) + 20);
      }
    }

    if (xp === 0) level = 0;
    else if (xp < 50) level = 1;
    else if (xp < 100) level = 2;
    else if (xp < 150) level = 3;
    else level = 4;

    cells.push({ date: key, xp, level });
  }
  return cells;
}

const HEATMAP_DATA = generateHeatmapData();
const LEVEL_COLORS = [
  "bg-muted dark:bg-muted",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/65",
  "bg-primary",
];
const WEEK_LABELS = ["Mon", "Wed", "Fri"];
const MONTH_LABELS = ["Sep", "Oct", "Nov"];

function ActivityHeatmap() {
  const weeks: typeof HEATMAP_DATA[] = [];
  for (let i = 0; i < HEATMAP_DATA.length; i += 7) {
    weeks.push(HEATMAP_DATA.slice(i, i + 7));
  }

  const totalActive = HEATMAP_DATA.filter(d => d.xp > 0).length;

  return (
    <div className="p-5 rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-primary" />
          <h3 className="font-semibold text-sm">Activity Heatmap</h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{totalActive} active days in the last 15 weeks</span>
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
            {WEEK_LABELS.map(l => (
              <span key={l} className="text-xs text-muted-foreground leading-none" style={{ height: "13px", lineHeight: "13px" }}>{l}</span>
            ))}
          </div>
          {/* Grid */}
          <div>
            {/* Month labels */}
            <div className="flex mb-1">
              {MONTH_LABELS.map((m, i) => (
                <span key={m} className="text-xs text-muted-foreground"
                  style={{ width: `${i === 0 ? 5 : i === 1 ? 5 : 5}rem`, display: "inline-block" }}>
                  {m}
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((cell, di) => (
                    <div key={di}
                      title={cell.xp > 0 ? `${cell.date}: ${cell.xp} XP earned` : cell.date}
                      className={`w-3 h-3 rounded-sm cursor-default transition-opacity hover:opacity-80 ${LEVEL_COLORS[cell.level]}`}
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
  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Progress Analytics</h1>
        <p className="text-muted-foreground text-sm">Track your learning journey and identify areas for growth.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard icon={Zap} label="Total XP" value="2,450" sub="+825 this month" color="primary" />
        <StatCard icon={Flame} label="Current Streak" value="12 days" color="orange" />
        <StatCard icon={BookOpen} label="Topics Done" value="5" sub="of 27 total" color="green" />
        <StatCard icon={Star} label="Quiz Accuracy" value="91%" sub="+4% this week" color="blue" />
        <StatCard icon={Code2} label="Challenges" value="24" sub="+5 this week" color="purple" />
        <StatCard icon={TrendingUp} label="Hours Learned" value="47h" color="primary" />
      </div>

      {/* Heatmap */}
      <div className="mb-6">
        <ActivityHeatmap />
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
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            "Your strongest topic is Conditional Statements with 97% quiz accuracy.",
            "Quiz accuracy improved by 12% compared to last month.",
            "You completed 5 challenges this week — your best week yet!",
          ].map((insight, i) => (
            <div key={i} className="flex gap-3 p-3.5 rounded-lg bg-primary/4 border border-primary/10">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">{insight}</p>
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
                    ? "bg-green-100 dark:bg-green-900/30"
                    : "bg-red-100 dark:bg-red-900/30"
                }`}>
                  <Zap size={12} className={tx.type === "earned" ? "text-green-600" : "text-red-500"} />
                </div>
                <span className="text-sm">{tx.description}</span>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-semibold ${tx.type === "earned" ? "text-green-600" : "text-red-500"}`}>
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
