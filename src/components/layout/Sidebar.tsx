import React, { useState } from "react";
import {
  LayoutDashboard, BookOpen, Code2, BarChart3, Trophy, Star,
  User, Settings, ChevronLeft, ChevronRight, Flame, Sparkles, Lock
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
      <div className={`flex items-center h-14 px-2 shrink-0 ${sidebarCollapsed ? "justify-center" : "justify-between"}`}
        style={{ borderBottom: "1px solid color-mix(in srgb, var(--sidebar-border) 72%, transparent)" }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-[26px] h-[26px] rounded-md flex items-center justify-center shrink-0"
            style={{ background: "var(--sidebar-primary)" }}>
            <span className="text-sidebar-primary-foreground font-semibold text-[13px]">P</span>
          </div>
          {!sidebarCollapsed && (
            <span className="font-semibold text-[14px] tracking-[-0.025em] truncate"
              style={{ color: "var(--sidebar-accent-foreground)" }}>
              PythonQuest
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md transition-colors hover:bg-white/[0.04] hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--sidebar-ring)] shrink-0"
          style={{ color: "var(--sidebar-foreground)" }}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight size={14} strokeWidth={1.8} /> : <ChevronLeft size={14} strokeWidth={1.8} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 px-2">
        {!sidebarCollapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] px-2.5 mb-2.5"
            style={{ color: "var(--sidebar-foreground)", opacity: 0.62 }}>
            Workspace
          </p>
        )}
        <ul className="space-y-1">
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

        <div className="my-5 mx-2" style={{ borderTop: "1px solid color-mix(in srgb, var(--sidebar-border) 72%, transparent)" }} />

        {!sidebarCollapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] px-2.5 mb-2.5"
            style={{ color: "var(--sidebar-foreground)", opacity: 0.62 }}>
            Account
          </p>
        )}
        <ul className="space-y-1">
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
      <div className="shrink-0 p-2" style={{ borderTop: "1px solid color-mix(in srgb, var(--sidebar-border) 72%, transparent)" }}>
        {sidebarCollapsed ? (
          <div className="flex justify-center py-2">
            <div title={`${displayName} · Level ${levelInfo.current}`} className="w-8 h-8 rounded-[10px] flex items-center justify-center text-xs font-semibold"
              style={{ background: "var(--sidebar-primary)", color: "var(--sidebar-primary-foreground)" }}>
              {initials}
            </div>
          </div>
        ) : (
          <div className="rounded-[10px] p-3" style={{ background: "var(--sidebar-accent)" }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-xs font-semibold shrink-0"
                style={{ background: "var(--sidebar-primary)", color: "var(--sidebar-primary-foreground)" }}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold tracking-[-0.01em] truncate" style={{ color: "var(--sidebar-accent-foreground)" }}>
                  {displayName}
                </p>
                <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--sidebar-foreground)", opacity: 0.78 }}>
                  {levelInfo.title}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-semibold tracking-wide" style={{ color: "var(--sidebar-accent-foreground)" }}>
                Level {levelInfo.current}
              </span>
              <div className="flex items-center gap-1.5">
                <Sparkles size={11} strokeWidth={1.8} style={{ color: "var(--warning)" }} />
                <span className="text-[11px] font-semibold tabular-nums" style={{ color: "var(--sidebar-accent-foreground)" }}>
                  {currentXp.toLocaleString()} XP
                </span>
                <span className="mx-0.5 h-3 w-px" style={{ background: "color-mix(in srgb, var(--sidebar-foreground) 22%, transparent)" }} />
                <Flame size={11} style={{ color: "var(--sidebar-primary)" }} />
                <span className="text-[11px] tabular-nums" style={{ color: "var(--sidebar-foreground)", opacity: 0.8 }}>
                  {user?.streak ?? 0}d
                </span>
              </div>
            </div>

            <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: "color-mix(in srgb, var(--sidebar-foreground) 16%, transparent)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(xpProgress, 100)}%`, background: "var(--sidebar-primary)" }}
              />
            </div>
            <p className="text-[10px] mt-2" style={{ color: "var(--sidebar-foreground)", opacity: 0.78 }}>
              {levelInfo.nextXp.toLocaleString()} XP to next level
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
        className={`w-full min-h-10 flex items-center gap-3 px-2.5 py-2 rounded-[9px] text-[13px] transition-colors duration-150 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--sidebar-ring)] ${
          item.locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${collapsed ? "justify-center" : ""}`}
        style={{
          background: active ? "color-mix(in srgb, var(--sidebar-primary) 12%, var(--sidebar))" : "transparent",
          color: active ? "var(--sidebar-accent-foreground)" : "var(--sidebar-foreground)",
          boxShadow: active && !collapsed ? "inset 2px 0 0 var(--sidebar-primary)" : undefined,
        }}
        onMouseEnter={event => {
          if (!active && !item.locked) event.currentTarget.style.background = "color-mix(in srgb, var(--sidebar-primary) 6%, var(--sidebar))";
        }}
        onMouseLeave={event => {
          if (!active) event.currentTarget.style.background = "transparent";
        }}
        title={collapsed ? item.label : undefined}
        disabled={item.locked}
      >
        <Icon
          size={20}
          strokeWidth={1.8}
          className={`shrink-0 transition-opacity ${active ? "" : "opacity-70 group-hover:opacity-100"}`}
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
