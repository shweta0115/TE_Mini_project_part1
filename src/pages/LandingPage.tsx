import { useState, type CSSProperties } from "react";
import { ArrowRight, BookOpen, Code2, Trophy, BarChart3, Sparkles, Star, Lock, Flame } from "lucide-react";

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

const FEATURES = [
  { icon: BookOpen, title: "Structured Curriculum", desc: "27 topics organized from basics to advanced Python, with a clear, linear progression." },
  { icon: Code2, title: "Coding Challenges", desc: "200+ Python problems with real test cases, multiple hints, and detailed solutions." },
  { icon: Sparkles, title: "XP & Levels", desc: "Earn XP for every activity. Level up through 10 tiers from Beginner to Python Master." },
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

const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=2400&q=85";

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [email, setEmail] = useState("");

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="absolute inset-x-0 top-0 z-50 border-b border-white/10 text-sidebar-accent-foreground">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">PythonQuest</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors">How It Works</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate("login")}
              className="text-sm text-sidebar-accent-foreground/85 hover:text-sidebar-accent-foreground transition-colors font-medium">
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
      <section
        className="landing-hero"
        style={{ "--landing-hero-image": `url("${HERO_IMAGE_URL}")` } as CSSProperties}
      >
        <div className="landing-hero__image" aria-hidden="true" />
        <div className="landing-hero__content">
          <h1 className="landing-hero__title">Python Quiz</h1>
          <p className="landing-hero__subtitle">
            Test your Python knowledge, improve your skills, and learn through interactive quizzes.
          </p>
          <div className="landing-hero__actions">
            <button onClick={() => onNavigate("register")} className="landing-hero__primary">
              Get Started <ArrowRight size={17} />
            </button>
            <button onClick={() => onNavigate("login")} className="landing-hero__secondary">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {SOCIAL_PROOF.map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
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
                    <Star key={i} size={13} className="text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
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
      <section className="border-t border-border py-20 bg-muted/30">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary mx-auto mb-5 flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-bold text-lg">P</span>
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
              <span className="text-primary-foreground font-bold text-xs">P</span>
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
