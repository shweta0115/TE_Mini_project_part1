import React, { useState } from "react";
import {
  LayoutDashboard, BookOpen, Code2, BarChart3, Trophy, Star,
  User, Settings, ChevronLeft, ChevronRight, Flame, Zap, Lock
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  view: string;
  locked?: boolean;
}

const WORKSPACE_NAV: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, view: "dashboard" },
  { label: "Learn", icon: BookOpen, view: "learn" },
  { label: "Challenges", icon: Code2, view: "challenges" },
  { label: "Progress", icon: BarChart3, view: "progress" },
  { label: "Leaderboard", icon: Trophy, view: "leaderboard" },
  { label: "Achievements", icon: Star, view: "achievements" },
];

const ACCOUNT_NAV: NavItem[] = [
  { label: "Profile", icon: User, view: "profile" },
  { label: "Settings", icon: Settings, view: "settings" },
];

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

function getInitials(name?: string, username?: string) {
  const source = (name || username || "Learner").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebar, currentXp, getLevelInfo, user } = useApp();
  const levelInfo = getLevelInfo();
  const initials = getInitials(user?.name, user?.username);
  const displayName = user?.username || user?.name || "Learner";
  const xpProgress = Math.round(((currentXp - getLevelForLevel(levelInfo.current)) / (levelInfo.nextXp - getLevelForLevel(levelInfo.current))) * 100);

  function getLevelForLevel(level: number) {
    const mins = [0, 100, 250, 500, 850, 1300, 2000, 3000, 4500, 6500];
    return mins[level - 1] ?? 0;
  }

  return (
    <aside
      className={`flex flex-col h-screen transition-all duration-300 ease-in-out shrink-0 ${
        sidebarCollapsed ? "w-16" : "w-60"
      }`}
      style={{ background: "var(--sidebar)", borderRight: "1px solid var(--sidebar-border)" }}
    >
      {/* Brand */}
      <div className="flex items-center h-14 px-4 shrink-0" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
            style={{ background: "var(--sidebar-primary)" }}>
            <span className="text-white font-bold text-sm">P</span>
          </div>
          {!sidebarCollapsed && (
            <span className="font-semibold text-sm tracking-tight truncate"
              style={{ color: "var(--sidebar-accent-foreground)" }}>
              PythonQuest
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="ml-auto p-1 rounded-md transition-colors hover:opacity-80 shrink-0"
          style={{ color: "var(--sidebar-foreground)" }}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {!sidebarCollapsed && (
          <p className="text-xs font-semibold uppercase tracking-widest px-2 mb-2"
            style={{ color: "var(--sidebar-foreground)", opacity: 0.4 }}>
            Workspace
          </p>
        )}
        <ul className="space-y-0.5">
          {WORKSPACE_NAV.map(item => (
            <NavLink
              key={item.view}
              item={item}
              active={currentView === item.view}
              collapsed={sidebarCollapsed}
              onNavigate={onNavigate}
            />
          ))}
        </ul>

        <div className="my-4" style={{ borderTop: "1px solid var(--sidebar-border)" }} />

        {!sidebarCollapsed && (
          <p className="text-xs font-semibold uppercase tracking-widest px-2 mb-2"
            style={{ color: "var(--sidebar-foreground)", opacity: 0.4 }}>
            Account
          </p>
        )}
        <ul className="space-y-0.5">
          {ACCOUNT_NAV.map(item => (
            <NavLink
              key={item.view}
              item={item}
              active={currentView === item.view}
              collapsed={sidebarCollapsed}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </nav>

      {/* User Info */}
      <div className="shrink-0 p-2" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
        {sidebarCollapsed ? (
          <div className="flex justify-center py-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{ background: "var(--sidebar-primary)", color: "white" }}>
              {initials}
            </div>
          </div>
        ) : (
          <div className="rounded-lg p-2.5" style={{ background: "var(--sidebar-accent)" }}>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                style={{ background: "var(--sidebar-primary)", color: "white" }}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: "var(--sidebar-accent-foreground)" }}>
                  {displayName}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--sidebar-foreground)", opacity: 0.6 }}>
                  {levelInfo.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex items-center gap-1">
                <Zap size={10} style={{ color: "var(--sidebar-primary)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--sidebar-accent-foreground)" }}>
                  {currentXp.toLocaleString()} XP
                </span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <Flame size={10} className="text-orange-400" />
                <span className="text-xs" style={{ color: "var(--sidebar-foreground)", opacity: 0.7 }}>
                  {user?.streak ?? 0}d
                </span>
              </div>
            </div>

            <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "var(--sidebar-border)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(xpProgress, 100)}%`, background: "var(--sidebar-primary)" }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--sidebar-foreground)", opacity: 0.5 }}>
              Level {levelInfo.current} → {levelInfo.nextXp.toLocaleString()} XP
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

function NavLink({ item, active, collapsed, onNavigate }: {
  item: NavItem; active: boolean; collapsed: boolean; onNavigate: (v: string) => void;
}) {
  const Icon = item.icon;
  return (
    <li>
      <button
        onClick={() => !item.locked && onNavigate(item.view)}
        className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-all duration-150 group ${
          item.locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${collapsed ? "justify-center" : ""}`}
        style={{
          background: active ? "var(--sidebar-accent)" : "transparent",
          color: active ? "var(--sidebar-accent-foreground)" : "var(--sidebar-foreground)",
        }}
        title={collapsed ? item.label : undefined}
        disabled={item.locked}
      >
        <Icon
          size={16}
          className={`shrink-0 transition-colors ${active ? "" : "opacity-60 group-hover:opacity-100"}`}
        />
        {!collapsed && (
          <span className="font-medium truncate flex-1 text-left">{item.label}</span>
        )}
        {!collapsed && item.locked && <Lock size={12} className="shrink-0 opacity-50" />}
        {!collapsed && active && (
          <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "var(--sidebar-primary)" }} />
        )}
      </button>
    </li>
  );
}
