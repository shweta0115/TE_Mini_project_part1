import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight, Github, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";

interface AuthPagesProps {
  mode: "login" | "register" | "onboarding";
  onNavigate: (view: string) => void;
}

function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    if (password.length === 0) return { score: 0, label: "", color: "" };
    if (password.length < 6) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password))
      return { score: 2, label: "Medium", color: "bg-yellow-500" };
    return { score: 3, label: "Strong", color: "bg-green-500" };
  };
  const { score, label, color } = getStrength();
  if (!password) return null;
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= score ? color : "bg-muted"}`} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Password strength: <span className="font-medium">{label}</span></p>
    </div>
  );
}

export function LoginPage({ onNavigate }: { onNavigate: (v: string) => void }) {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) onNavigate("dashboard");
    else setError("Invalid email or password. Try any email/password.");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-1/2 bg-primary p-12 text-white">
        <div className="flex items-center gap-2 mb-auto">
          <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center">
            <span className="font-bold text-sm">P</span>
          </div>
          <span className="font-semibold">PythonQuest</span>
        </div>
        <div className="my-auto">
          <h1 className="text-3xl font-bold mb-4 leading-tight">
            Learn Python.<br />Build Skills.<br />Level Up.
          </h1>
          <p className="text-white/70 leading-relaxed mb-8">
            Master Python through structured learning, real coding challenges, and a progression system designed to keep you engaged.
          </p>
          <div className="space-y-3">
            {[
              "27 structured topics from beginner to advanced",
              "XP system with 10 distinct levels",
              "200+ coding challenges with test cases",
              "Achievements, streaks, and leaderboards",
            ].map(item => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-white/70 shrink-0" />
                <span className="text-sm text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto pt-12">
          <div className="p-4 rounded-xl bg-white/10 border border-white/20">
            <p className="text-sm text-white/80 italic mb-2">
              "PythonQuest gave me the structure I needed. The gamification actually kept me motivated through the hard topics."
            </p>
            <p className="text-xs text-white/60">— Alex Chen, Python Pro · Level 9</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-semibold">PythonQuest</span>
          </div>

          <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-6">Sign in to continue your Python journey.</p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 mb-4">
              <AlertCircle size={14} className="text-destructive shrink-0" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-md border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium">Password</label>
                <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 rounded-md border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-primary" />
              <label htmlFor="remember" className="text-sm text-muted-foreground">Remember me</label>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-60">
              {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in...</> : <>Sign In <ArrowRight size={14} /></>}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Google", icon: "G" },
              { label: "GitHub", icon: <Github size={14} /> },
            ].map(provider => (
              <button key={provider.label}
                className="flex items-center justify-center gap-2 py-2.5 rounded-md border border-border text-sm font-medium hover:bg-muted transition-colors">
                <span className="font-bold text-xs">{typeof provider.icon === "string" ? provider.icon : provider.icon}</span>
                {provider.label}
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <button onClick={() => onNavigate("register")} className="text-primary font-medium hover:text-primary/80 transition-colors">
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage({ onNavigate }: { onNavigate: (v: string) => void }) {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useApp();

  const update = (k: keyof typeof form, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.username || !form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (!terms) { setError("Please accept the Terms & Conditions."); return; }
    setLoading(true);
    const ok = await register(form.name, form.username, form.email, form.password);
    setLoading(false);
    if (ok) onNavigate("onboarding");
    else setError("Registration failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex flex-col w-1/2 bg-primary p-12 text-white">
        <div className="flex items-center gap-2 mb-auto">
          <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center">
            <span className="font-bold text-sm">P</span>
          </div>
          <span className="font-semibold">PythonQuest</span>
        </div>
        <div className="my-auto">
          <h2 className="text-3xl font-bold mb-4">Begin your Python journey today.</h2>
          <p className="text-white/70 leading-relaxed">Create your free account and start earning XP from your very first lesson.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-1">Create account</h2>
          <p className="text-muted-foreground text-sm mb-6">Start your Python learning journey for free.</p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 mb-4">
              <AlertCircle size={14} className="text-destructive shrink-0" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { label: "Full Name", key: "name", type: "text", placeholder: "Shweta Gupta" },
              { label: "Username", key: "username", type: "text", placeholder: "shweta_g" },
              { label: "Email", key: "email", type: "email", placeholder: "you@example.com" },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-1.5">{field.label}</label>
                <input type={field.type} value={form[field.key as keyof typeof form]}
                  onChange={e => update(field.key as keyof typeof form, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2.5 rounded-md border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.password}
                  onChange={e => update("password", e.target.value)} placeholder="Create a strong password"
                  className="w-full px-3 py-2.5 pr-10 rounded-md border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={e => update("confirm", e.target.value)}
                placeholder="Repeat your password"
                className="w-full px-3 py-2.5 rounded-md border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
            </div>
            <div className="flex items-start gap-2 pt-1">
              <input type="checkbox" id="terms" checked={terms} onChange={e => setTerms(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-primary mt-0.5" />
              <label htmlFor="terms" className="text-sm text-muted-foreground leading-snug">
                I agree to the{" "}
                <span className="text-primary cursor-pointer hover:text-primary/80">Terms & Conditions</span>
                {" "}and{" "}
                <span className="text-primary cursor-pointer hover:text-primary/80">Privacy Policy</span>
              </label>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 mt-2">
              {loading ? <><Loader2 size={15} className="animate-spin" /> Creating account...</> : <>Create Account <ArrowRight size={14} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{" "}
            <button onClick={() => onNavigate("login")} className="text-primary font-medium hover:text-primary/80">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const EXPERIENCE_OPTIONS = [
  { value: "complete-beginner", label: "Complete Beginner", desc: "Never written a line of Python" },
  { value: "beginner", label: "Beginner", desc: "Know the basics but need structure" },
  { value: "intermediate", label: "Intermediate", desc: "Comfortable with core concepts" },
  { value: "advanced", label: "Advanced", desc: "Looking to master advanced topics" },
];

const GOAL_OPTIONS = [
  { value: "learn-scratch", label: "Learn Python from scratch" },
  { value: "improve-skills", label: "Improve my coding skills" },
  { value: "interview-prep", label: "Prepare for technical interviews" },
  { value: "problem-solving", label: "Practice problem solving" },
  { value: "build-projects", label: "Build Python projects" },
];

export function OnboardingPage({ onNavigate }: { onNavigate: (v: string) => void }) {
  const [step, setStep] = useState(0);
  const [experience, setExperience] = useState("");
  const [goal, setGoal] = useState("");
  const { login } = useApp();

  const handleFinish = async () => {
    await login("demo@pythonquest.app", "demo");
    onNavigate("dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">P</span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-6">
            {[0, 1, 2].map(i => (
              <div key={i} className={`h-1 rounded-full transition-all ${i <= step ? "bg-primary w-8" : "bg-muted w-4"}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{step === 0 ? "Step 1 of 2" : step === 1 ? "Step 2 of 2" : "All done!"}</p>
        </div>

        {step === 0 && (
          <div>
            <h2 className="text-xl font-bold text-center mb-1">What's your Python experience?</h2>
            <p className="text-muted-foreground text-sm text-center mb-6">We'll personalize your learning path.</p>
            <div className="space-y-2">
              {EXPERIENCE_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setExperience(opt.value)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    experience === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-muted/30"
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{opt.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                    </div>
                    {experience === opt.value && <CheckCircle2 size={16} className="text-primary shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => experience && setStep(1)} disabled={!experience}
              className="w-full mt-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
              Continue <ArrowRight size={14} />
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-center mb-1">What's your learning goal?</h2>
            <p className="text-muted-foreground text-sm text-center mb-6">Help us tailor your recommendations.</p>
            <div className="space-y-2">
              {GOAL_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setGoal(opt.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between ${
                    goal === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-muted/30"
                  }`}>
                  <span className="font-medium text-sm">{opt.label}</span>
                  {goal === opt.value && <CheckCircle2 size={16} className="text-primary shrink-0" />}
                </button>
              ))}
            </div>
            <button onClick={() => goal && setStep(2)} disabled={!goal}
              className="w-full mt-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
              Continue <ArrowRight size={14} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">You're all set!</h2>
            <p className="text-muted-foreground text-sm mb-2">
              Your personalized Python learning path is ready.
            </p>
            <p className="text-xs text-muted-foreground mb-8">
              {experience === "complete-beginner" || experience === "beginner"
                ? "We'll start with Python fundamentals and build from there."
                : "We'll focus on intermediate concepts based on your experience."}
            </p>
            <div className="p-4 rounded-lg bg-muted/50 border border-border mb-6 text-left space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-medium capitalize">{experience.replace("-", " ")}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Goal</span>
                <span className="font-medium">{GOAL_OPTIONS.find(g => g.value === goal)?.label}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Starting XP</span>
                <span className="font-medium text-primary">0 XP</span>
              </div>
            </div>
            <button onClick={handleFinish}
              className="w-full py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              Let's Start Learning <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthPages({ mode, onNavigate }: AuthPagesProps) {
  if (mode === "login") return <LoginPage onNavigate={onNavigate} />;
  if (mode === "register") return <RegisterPage onNavigate={onNavigate} />;
  return <OnboardingPage onNavigate={onNavigate} />;
}
