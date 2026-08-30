import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { User, Notification, XPTransaction, ThemeMode } from "../types";
import { DEMO_USER, NOTIFICATIONS, XP_TRANSACTIONS, LEVELS } from "../data/mockData";

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  notifications: Notification[];
  xpTransactions: XPTransaction[];
  theme: ThemeMode;
  sidebarCollapsed: boolean;
  searchOpen: boolean;
  currentXp: number;
}

interface AppContextValue extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, username: string, email: string, password: string) => Promise<boolean>;
  setTheme: (theme: ThemeMode) => void;
  toggleSidebar: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  addXp: (amount: number, description: string) => void;
  spendXp: (amount: number, description: string) => boolean;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  getLevelInfo: () => { current: number; title: string; nextXp: number; progress: number };
  canAfford: (cost: number) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [xpTransactions, setXpTransactions] = useState<XPTransaction[]>(XP_TRANSACTIONS);
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentXp, setCurrentXp] = useState(DEMO_USER.xp);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1000));
    if (email && _password) {
      const loggedUser = { ...DEMO_USER, xp: currentXp };
      setUser(loggedUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, [currentXp]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const register = useCallback(async (name: string, username: string, email: string, _password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1200));
    if (name && username && email && _password) {
      return true;
    }
    return false;
  }, []);

  const setTheme = useCallback((t: ThemeMode) => {
    setThemeState(t);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const getLevelForXp = (xp: number) => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].minXp) return LEVELS[i];
    }
    return LEVELS[0];
  };

  const addXp = useCallback((amount: number, description: string) => {
    setCurrentXp(prev => {
      const newXp = prev + amount;
      const newLevel = getLevelForXp(newXp);
      setUser(u => u ? { ...u, xp: newXp, level: newLevel.level, levelTitle: newLevel.title, nextLevelXp: newLevel.maxXp + 1 } : u);
      return newXp;
    });
    const tx: XPTransaction = {
      id: `x-${Date.now()}`, amount, description, type: "earned",
      createdAt: new Date().toISOString(),
    };
    setXpTransactions(prev => [tx, ...prev]);
    const notif: Notification = {
      id: `n-${Date.now()}`, title: `+${amount} XP Earned`, message: description,
      type: "xp", read: false, createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);
  }, []);

  const spendXp = useCallback((amount: number, description: string): boolean => {
    if (currentXp < amount) return false;
    setCurrentXp(prev => prev - amount);
    setUser(u => u ? { ...u, xp: u.xp - amount } : u);
    const tx: XPTransaction = {
      id: `x-${Date.now()}`, amount: -amount, description, type: "spent",
      createdAt: new Date().toISOString(),
    };
    setXpTransactions(prev => [tx, ...prev]);
    return true;
  }, [currentXp]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getLevelInfo = useCallback(() => {
    const lvl = getLevelForXp(currentXp);
    const nextLvl = LEVELS.find(l => l.level === lvl.level + 1);
    const progress = nextLvl
      ? Math.round(((currentXp - lvl.minXp) / (nextLvl.minXp - lvl.minXp)) * 100)
      : 100;
    return {
      current: lvl.level,
      title: lvl.title,
      nextXp: nextLvl ? nextLvl.minXp : lvl.maxXp,
      progress,
    };
  }, [currentXp]);

  const canAfford = useCallback((cost: number) => currentXp >= cost, [currentXp]);

  return (
    <AppContext.Provider value={{
      user, isAuthenticated, notifications, xpTransactions, theme, sidebarCollapsed,
      searchOpen, currentXp, login, logout, register, setTheme, toggleSidebar,
      openSearch, closeSearch, addXp, spendXp, markNotificationRead,
      markAllNotificationsRead, unreadCount, getLevelInfo, canAfford,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
