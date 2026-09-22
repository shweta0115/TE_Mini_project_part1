import { Zap, Flame, BookOpen, Star, Code2, TrendingUp, Trophy, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

function getInitials(name?: string, username?: string) {
  const source = (name || username || "Learner").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function ProfilePage() {
  const { currentXp, getLevelInfo, user, achievements: ACHIEVEMENTS, activity: ACTIVITY, analytics: ANALYTICS } = useApp();
  const levelInfo = getLevelInfo();
  const initials = getInitials(user?.name, user?.username);
  const xpForLevel = [0, 100, 250, 500, 850, 1300, 2000, 3000, 4500, 6500][levelInfo.current - 1] ?? 0;
  const xpProgress = Math.round(((currentXp - xpForLevel) / (levelInfo.nextXp - xpForLevel)) * 100);
  const earnedAchievements = ACHIEVEMENTS.filter(a => a.earned);

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      {/* Profile Hero */}
      <div className="p-6 rounded-lg border border-border bg-card mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold">{user?.name ?? "Learner"}</h1>
              <p className="text-muted-foreground text-sm">@{user?.username ?? "learner"}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Zap size={13} className="text-primary" />
                <span className="text-sm font-semibold text-primary">{currentXp.toLocaleString()} XP</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                <Flame size={13} className="text-orange-500" />
                <span className="text-sm font-semibold text-orange-600">{user?.streak ?? 0} days</span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="font-medium text-foreground">Level {levelInfo.current} — {levelInfo.title}</span>
              <span className="text-muted-foreground">{currentXp.toLocaleString()} / {levelInfo.nextXp.toLocaleString()} XP</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(xpProgress, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: BookOpen, label: "Lessons", value: user?.stats.lessonsCompleted ?? 0 },
          { icon: Star, label: "Quizzes", value: user?.stats.quizzesCompleted ?? 0 },
          { icon: Code2, label: "Challenges", value: user?.stats.challengesCompleted ?? 0 },
          { icon: TrendingUp, label: "Accuracy", value: `${user?.stats.quizAccuracy ?? 0}%` },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-lg border border-border bg-card text-center">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <s.icon size={15} className="text-primary" />
            </div>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="p-5 rounded-lg border border-border bg-card">
          <h3 className="font-semibold text-sm mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {ACTIVITY.slice(0, 6).map(act => (
              <div key={act.id} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                  act.type === "challenge" ? "bg-primary/10" :
                  act.type === "quiz" ? "bg-blue-500/10" :
                  act.type === "achievement" ? "bg-yellow-500/10" :
                  act.type === "unlock" ? "bg-green-500/10" : "bg-muted"
                }`}>
                  {act.type === "challenge" && <Code2 size={11} className="text-primary" />}
                  {act.type === "quiz" && <Star size={11} className="text-blue-500" />}
                  {act.type === "achievement" && <Trophy size={11} className="text-yellow-500" />}
                  {act.type === "lesson" && <BookOpen size={11} className="text-green-500" />}
                  {act.type === "unlock" && <CheckCircle2 size={11} className="text-green-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{act.title}</p>
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

        {/* Achievements */}
        <div className="p-5 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Achievements</h3>
            <span className="text-xs text-muted-foreground">{earnedAchievements.length} / {ACHIEVEMENTS.length}</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {earnedAchievements.map(a => (
              <div key={a.id} className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-primary/15 bg-primary/4">
                <Trophy size={18} className="text-primary" />
                <span className="text-xs font-medium text-center leading-tight">{a.title}</span>
              </div>
            ))}
          </div>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary rounded-full"
              style={{ width: `${Math.round((earnedAchievements.length / ACHIEVEMENTS.length) * 100)}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {ACHIEVEMENTS.length - earnedAchievements.length} achievements remaining
          </p>
        </div>

        {/* Weekly XP Chart */}
        <div className="p-5 rounded-lg border border-border bg-card lg:col-span-2">
          <h3 className="font-semibold text-sm mb-4">XP This Week</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={ANALYTICS.weeklyActivity} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.5 }}
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar dataKey="xp" name="XP" fill="#4338ca" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
