import { useState } from "react";
import { ArrowRight, BookOpen, Code2, Trophy, BarChart3, Zap, Star, CheckCircle2, Lock, Flame, Users } from "lucide-react";

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

const FEATURES = [
  { icon: BookOpen, title: "Structured Curriculum", desc: "27 topics organized from basics to advanced Python, with a clear, linear progression." },
  { icon: Code2, title: "Coding Challenges", desc: "200+ Python problems with real test cases, multiple hints, and detailed solutions." },
  { icon: Zap, title: "XP & Levels", desc: "Earn XP for every activity. Level up through 10 tiers from Beginner to Python Master." },
  { icon: Trophy, title: "Leaderboards", desc: "Compete globally, weekly, or with friends. Rankings update in real time." },
  { icon: Star, title: "Achievements", desc: "Unlock achievement badges as you reach milestones in your Python journey." },
  { icon: Flame, title: "Daily Streaks", desc: "Build strong habits with daily challenges and a streak tracking system." },
  { icon: BarChart3, title: "Progress Analytics", desc: "Deep insights into your learning patterns, topic accuracy, and overall mastery." },
  { icon: Lock, title: "Unlock System", desc: "Advanced content unlocks as you grow — always giving you a clear next goal." },
];

const STEPS = [
  { num: "01", label: "Learn", desc: "Study structured Python topics with code examples, notes, and explanations." },
  { num: "02", label: "Practice", desc: "Test your knowledge with topic quizzes and real coding challenges." },
  { num: "03", label: "Earn XP", desc: "Every completed lesson, quiz, and challenge earns you experience points." },
  { num: "04", label: "Unlock", desc: "Spend XP to unlock advanced content, challenges, and hint assists." },
  { num: "05", label: "Master", desc: "Build streaks, earn achievements, and climb the leaderboard." },
];

const TESTIMONIALS = [
  { name: "Arjun Sharma", role: "Software Engineering Intern", avatar: "AS", quote: "I went from knowing almost no Python to writing proper scripts in 6 weeks. The XP system kept me consistent when I'd normally have quit." },
  { name: "Priya Mehta", role: "Computer Science Student", avatar: "PM", quote: "Finally a platform that doesn't make learning feel like homework. The daily challenges and streak system are genuinely addictive." },
  { name: "Daniel Liu", role: "Data Analyst", avatar: "DL", quote: "The analytics section alone is worth it. I could see exactly which concepts I was struggling with and target them directly." },
];

const SOCIAL_PROOF = [
  { value: "12,400+", label: "Active Learners" },
  { value: "91%", label: "Avg. Quiz Accuracy" },
  { value: "200+", label: "Coding Challenges" },
  { value: "27", label: "Structured Topics" },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">PythonQuest</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate("login")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
              Sign In
            </button>
            <button onClick={() => onNavigate("register")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
              Get Started <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold mb-6">
              <Zap size={11} />
              Gamified Python Learning Platform
            </div>
            <h1 className="text-4xl lg:text-[3.25rem] font-bold tracking-tight leading-tight mb-5">
              Learn Python.<br />
              <span className="text-primary">Build Skills.</span><br />
              Level Up.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
              Master Python through a structured curriculum, real coding challenges, and a progression system that actually keeps you learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button onClick={() => onNavigate("register")}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-sm">
                Start Learning for Free <ArrowRight size={16} />
              </button>
              <button onClick={() => onNavigate("login")}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-border text-foreground font-medium hover:bg-muted transition-all">
                Sign In
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users size={13} />
              <span>Joined by <strong className="text-foreground">12,400+</strong> developers and students</span>
            </div>
          </div>

          {/* App Preview */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/8 via-transparent to-accent/8 rounded-2xl blur-xl" />
            <div className="relative rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
              {/* Browser Chrome */}
              <div className="h-9 flex items-center gap-2 px-4 border-b border-border bg-muted/50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="ml-2 flex-1 h-5 rounded-md bg-muted flex items-center px-2">
                  <span className="text-xs text-muted-foreground font-mono">pythonquest.app/dashboard</span>
                </div>
              </div>

              {/* Mini Dashboard */}
              <div className="p-4 space-y-3">
                {/* Level + Streak row */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg border border-border bg-primary/4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold">Level 7</span>
                      <span className="text-xs text-muted-foreground">2,450 XP</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "82%" }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Code Master</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Flame size={14} className="text-orange-500" />
                      <span className="text-xs font-semibold">12-day streak</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {["M","T","W","T","F","S","S"].map((d,i) => (
                        <div key={i} className={`flex-1 h-4 rounded-sm ${i < 6 ? "bg-orange-500" : "bg-muted"}`} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Topics */}
                <div className="space-y-1.5">
                  {[
                    { name: "Python Introduction", status: "done" },
                    { name: "Variables & Types", status: "done" },
                    { name: "Loops & Iteration", status: "active", pct: 65 },
                    { name: "Functions", status: "locked" },
                  ].map(t => (
                    <div key={t.name} className="flex items-center gap-2.5 p-2.5 rounded-md border border-border hover:bg-muted/30 transition-colors cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        t.status === "done" ? "bg-green-500" : t.status === "active" ? "bg-primary" : "bg-muted"
                      }`}>
                        {t.status === "done" && <CheckCircle2 size={10} className="text-white" />}
                        {t.status === "active" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        {t.status === "locked" && <Lock size={8} className="text-muted-foreground" />}
                      </div>
                      <span className="text-xs flex-1 group-hover:text-primary transition-colors">{t.name}</span>
                      {t.status === "active" && (
                        <div className="w-14 h-1 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${t.pct}%` }} />
                        </div>
                      )}
                      {t.status === "done" && <span className="text-xs text-green-600 font-semibold">+10 XP</span>}
                    </div>
                  ))}
                </div>

                {/* Daily Challenge CTA */}
                <div className="p-3 rounded-lg border border-primary/25 bg-primary/4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Code2 size={11} className="text-primary" />
                      <span className="text-xs font-semibold text-primary">Daily Challenge</span>
                    </div>
                    <p className="text-xs font-medium">Find the Largest Number</p>
                    <p className="text-xs text-muted-foreground">+75 XP · 15 min</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-md bg-primary text-white text-xs font-semibold">Start</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {SOCIAL_PROOF.map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold mb-3">How PythonQuest Works</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              A clear, motivating progression system built around how developers actually learn.
            </p>
          </div>
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-5 left-full w-full h-px border-t border-dashed border-border z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <span className="text-xs font-mono font-bold text-primary">{step.num}</span>
                  </div>
                  <h3 className="font-semibold mb-1.5">{step.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border bg-muted/20 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold mb-3">Platform Features</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">Everything you need to learn Python seriously — no fluff, just results.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title}
                  className="p-5 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all group">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1.5">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold mb-3">What Learners Say</h2>
            <p className="text-muted-foreground text-sm">From students to working developers — real results from real people.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="p-6 rounded-xl border border-border bg-card">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary mx-auto mb-5 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Start Your Python Journey</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed max-w-sm mx-auto">
            Join 12,400+ developers learning Python with a structured, gamified approach that actually works.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 max-w-xs px-4 py-2.5 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            />
            <button onClick={() => onNavigate("register")}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm">
              Get Started Free <ArrowRight size={14} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">No credit card required. Free to start.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <span className="text-sm font-semibold">PythonQuest</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2024 PythonQuest</p>
        </div>
      </footer>
    </div>
  );
}
