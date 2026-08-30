import React, { useState } from "react";
import { Sun, Moon, Monitor, Bell, Lock, User, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { ThemeMode } from "../types";

const SECTIONS = ["Profile", "Account", "Password", "Notifications", "Appearance", "Privacy"] as const;
type Section = typeof SECTIONS[number];

function SectionButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
        active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}>
      {label}
    </button>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-4" : "translate-x-0.5"
      }`} />
    </button>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useApp();
  const [activeSection, setActiveSection] = useState<Section>("Profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [profile, setProfile] = useState({ name: "Shweta Gupta", username: "shweta_g", email: "shweta@example.com", bio: "Python learner and developer." });
  const [notifications, setNotifications] = useState({
    xpAlerts: true, achievementUnlocks: true, streakReminders: true, dailyChallenges: true, weeklyReport: false, leaderboardUpdates: false,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const THEME_OPTIONS: { value: ThemeMode; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account preferences and configuration.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Nav */}
        <nav className="md:w-44 shrink-0">
          <div className="space-y-0.5">
            {SECTIONS.map(s => (
              <SectionButton key={s} label={s} active={activeSection === s} onClick={() => setActiveSection(s)} />
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="p-6 rounded-lg border border-border bg-card">
            {/* Profile Section */}
            {activeSection === "Profile" && (
              <div>
                <h2 className="font-semibold mb-4">Profile Information</h2>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold">SG</div>
                  <div>
                    <p className="text-sm font-medium">{profile.name}</p>
                    <p className="text-xs text-muted-foreground">@{profile.username}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Full Name", key: "name", type: "text" },
                    { label: "Username", key: "username", type: "text" },
                    { label: "Email", key: "email", type: "email" },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium mb-1.5">{field.label}</label>
                      <input type={field.type} value={profile[field.key as keyof typeof profile]}
                        onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-md border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Bio</label>
                    <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={3}
                      className="w-full px-3 py-2.5 rounded-md border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all" />
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Section */}
            {activeSection === "Appearance" && (
              <div>
                <h2 className="font-semibold mb-4">Appearance</h2>
                <div>
                  <p className="text-sm font-medium mb-3">Theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    {THEME_OPTIONS.map(opt => {
                      const Icon = opt.icon;
                      return (
                        <button key={opt.value} onClick={() => setTheme(opt.value)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                            theme === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                          }`}>
                          <Icon size={20} className={theme === opt.value ? "text-primary" : "text-muted-foreground"} />
                          <span className={`text-xs font-medium ${theme === opt.value ? "text-primary" : "text-muted-foreground"}`}>
                            {opt.label}
                          </span>
                          {theme === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === "Notifications" && (
              <div>
                <h2 className="font-semibold mb-4">Notifications</h2>
                <div className="space-y-4">
                  {[
                    { key: "xpAlerts", label: "XP Alerts", desc: "Notify when you earn XP" },
                    { key: "achievementUnlocks", label: "Achievement Unlocks", desc: "Notify when you earn achievements" },
                    { key: "streakReminders", label: "Streak Reminders", desc: "Daily reminder to maintain your streak" },
                    { key: "dailyChallenges", label: "Daily Challenges", desc: "Notify when a new daily challenge is available" },
                    { key: "weeklyReport", label: "Weekly Report", desc: "Get a weekly summary of your progress" },
                    { key: "leaderboardUpdates", label: "Leaderboard Updates", desc: "Notify when your rank changes" },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Toggle
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={v => setNotifications(n => ({ ...n, [item.key]: v }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Password Section */}
            {activeSection === "Password" && (
              <div>
                <h2 className="font-semibold mb-4">Change Password</h2>
                <div className="space-y-4">
                  {[
                    { label: "Current Password", placeholder: "••••••••" },
                    { label: "New Password", placeholder: "Min. 8 characters" },
                    { label: "Confirm New Password", placeholder: "Repeat new password" },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="block text-sm font-medium mb-1.5">{field.label}</label>
                      <div className="relative">
                        <input type={showPass ? "text" : "password"} placeholder={field.placeholder}
                          className="w-full px-3 py-2.5 pr-10 rounded-md border border-border bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Section */}
            {activeSection === "Privacy" && (
              <div>
                <h2 className="font-semibold mb-4">Privacy</h2>
                <div className="space-y-4">
                  {[
                    { label: "Public Profile", desc: "Allow others to view your profile and achievements" },
                    { label: "Show on Leaderboard", desc: "Display your name on the global leaderboard" },
                    { label: "Share Activity", desc: "Let others see your recent learning activity" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Toggle checked={true} onChange={() => {}} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Account Section */}
            {(activeSection === "Account") && (
              <div>
                <h2 className="font-semibold mb-4">Account</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <p className="text-sm font-medium mb-1">Account Plan</p>
                    <p className="text-xs text-muted-foreground">Free Plan — All core features included</p>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm font-semibold text-destructive mb-2">Danger Zone</p>
                    <button className="px-4 py-2 rounded-md border border-destructive/30 text-destructive text-sm hover:bg-destructive/10 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> :
                 saved ? <><CheckCircle2 size={14} /> Saved!</> : "Save Changes"}
              </button>
              <button className="px-4 py-2 rounded-md border border-border text-sm hover:bg-muted transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
