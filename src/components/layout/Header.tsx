import { useState } from "react";
import { Search, Bell, Sparkles, ChevronRight, X, CheckCheck, Clock, LogOut, User, Settings } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { formatDistanceToNow } from "date-fns";

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const VIEW_LABELS: Record<string, string[]> = {
  dashboard: ["Dashboard"],
  learn: ["Learn"],
  topic: ["Learn", "Topic"],
  quiz: ["Learn", "Quiz"],
  challenges: ["Challenges"],
  "challenge-detail": ["Challenges", "Challenge"],
  progress: ["Progress"],
  leaderboard: ["Leaderboard"],
  achievements: ["Achievements"],
  profile: ["Profile"],
  settings: ["Settings"],
  notifications: ["Notifications"],
};

function getInitials(name?: string, username?: string) {
  const source = (name || username || "Learner").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function Header({ currentView, onNavigate }: HeaderProps) {
  const { currentXp, notifications, unreadCount, markNotificationRead, markAllNotificationsRead, openSearch, logout, user } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const breadcrumbs = VIEW_LABELS[currentView] ?? [currentView];
  const initials = getInitials(user?.name, user?.username);

  return (
    <header className="h-14 flex items-center gap-4 px-5 shrink-0 bg-background border-b border-border">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 flex-1 min-w-0" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <ChevronRight size={13} className="text-muted-foreground shrink-0" />}
            <span
              className={`text-sm truncate ${
                i === breadcrumbs.length - 1
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {crumb}
            </span>
          </div>
        ))}
      </nav>

      {/* Search */}
      <button
        onClick={openSearch}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-muted-foreground text-sm hover:border-primary/35 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors"
        aria-label="Open search (Ctrl+K)"
      >
        <Search size={13} />
        <span className="text-xs">Search anything...</span>
        <kbd className="ml-4 text-[10px] px-1.5 py-0.5 rounded border border-border bg-muted/60 font-mono">Ctrl K</kbd>
      </button>

      {/* XP Balance */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-warning/10 border border-warning/20">
        <Sparkles size={13} strokeWidth={1.8} className="text-warning" />
        <span className="text-xs font-semibold text-foreground">{currentXp.toLocaleString()} XP</span>
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-transparent hover:border-border hover:bg-muted/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors"
          aria-label="Notifications"
        >
          <Bell size={16} className="text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-10 w-80 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="font-semibold text-sm">Notifications</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      <CheckCheck size={12} />
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => { setNotifOpen(false); onNavigate("notifications"); }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    View all
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 6).map(notif => (
                  <button
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0 ${!notif.read ? "bg-primary/3" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${!notif.read ? "bg-primary" : "bg-transparent"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{notif.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={10} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Avatar + User Menu */}
      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="w-8 h-8 rounded-[10px] flex items-center justify-center text-xs font-semibold bg-primary text-primary-foreground shrink-0 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring transition-colors"
          aria-label="Open account menu"
        >
          {initials}
        </button>
        {userMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
            <div className="absolute right-0 top-10 w-44 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden py-1">
              <button onClick={() => { setUserMenuOpen(false); onNavigate("profile"); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors">
                <User size={13} /> Profile
              </button>
              <button onClick={() => { setUserMenuOpen(false); onNavigate("settings"); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors">
                <Settings size={13} /> Settings
              </button>
              <div className="my-1 border-t border-border" />
              <button onClick={() => { setUserMenuOpen(false); logout(); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
