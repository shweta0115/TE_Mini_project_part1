import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type {
  Achievement, ActivityEntry, AnalyticsData, Challenge, LeaderboardEntry,
  LearningState, Notification, Quiz, ThemeMode, Topic, User, XPTransaction
} from "../types";
import {
  ACHIEVEMENTS, ACTIVITY, ANALYTICS, CHALLENGES, DAILY_CHALLENGE,
  DEMO_USER, LEADERBOARD, LEVELS, NOTIFICATIONS, QUIZZES, TOPICS, XP_TRANSACTIONS
} from "../data/mockData";
import { apiRequest, getAccessToken, loadBootstrap, setAccessToken } from "../lib/api";

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  notifications: Notification[];
  xpTransactions: XPTransaction[];
  theme: ThemeMode;
  sidebarCollapsed: boolean;
  searchOpen: boolean;
  currentXp: number;
  topics: Topic[];
  quizzes: Quiz[];
  challenges: Challenge[];
  achievements: Achievement[];
  activity: ActivityEntry[];
  analytics: AnalyticsData;
  leaderboard: LeaderboardEntry[];
  dailyChallenge: typeof DAILY_CHALLENGE;
}

interface AppContextValue extends AppState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, username: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  authError: string;
  completeOnboarding: (experience: string, learningGoal: string) => Promise<boolean>;
  setTheme: (theme: ThemeMode) => void;
  toggleSidebar: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  addXp: (amount: number, description: string) => void;
  spendXp: (amount: number, description: string) => boolean;
  completeTopic: (topic: Topic, completedSubtopics: number[], progress: number) => Promise<boolean>;
  submitQuizResult: (quiz: Quiz, score: number, total: number, xp: number) => Promise<boolean>;
  submitChallengeResult: (challenge: Challenge, payload: { passed: boolean; code?: string; submissionType?: string }) => Promise<boolean>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  getLevelInfo: () => { current: number; title: string; nextXp: number; progress: number };
  canAfford: (cost: number) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_LEARNING_STATE: LearningState = {
  topicProgress: {},
  quizAttempts: {},
  challengeProgress: {},
  achievementProgress: {},
  activity: ACTIVITY,
  analytics: ANALYTICS,
  leaderboard: LEADERBOARD,
};

function getLevelForXp(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
}

interface TopicMeta {
  id: string;
  order: number;
  requiredXp?: number;
  requiredLevel?: number;
}

export function deriveTopicStatus(
  topics: Topic[],
  topicProgress: LearningState["topicProgress"],
  currentXp: number,
  levelForXp: (xp: number) => { level: number },
): Topic[] {
  const currentLevel = levelForXp(currentXp).level;
  const ordered: TopicMeta[] = [...topics]
    .sort((a, b) => a.order - b.order)
    .map(topic => ({
      id: topic.id,
      order: topic.order,
      requiredXp: topic.requiredXp,
      requiredLevel: topic.requiredLevel,
    }));

  const saved = (id: string) => topicProgress[id];
  const isCompleted = (id: string) => saved(id)?.status === "completed";
  const meetsGate = (meta: TopicMeta) => {
    if (meta.requiredLevel && currentLevel < meta.requiredLevel) return false;
    if (meta.requiredXp && currentXp < meta.requiredXp) return false;
    return true;
  };

  // A topic unlocks only when the immediately preceding topic is completed
  // and its own XP/level gate is satisfied. Fresh users have nothing completed,
  // so only the first topic starts unlocked.
  let previousCompleted = true;
  const computed: Record<string, { status: Topic["status"]; progress: number }> = {};
  for (const meta of ordered) {
    const record = saved(meta.id);
    let status: Topic["status"];
    if (isCompleted(meta.id)) {
      status = "completed";
    } else if (!previousCompleted || !meetsGate(meta)) {
      status = "locked";
    } else if ((record?.progress ?? 0) > 0) {
      status = "in-progress";
    } else {
      status = "unlocked";
    }
    computed[meta.id] = {
      status,
      progress: status === "completed" ? 100 : Math.max(record?.progress ?? 0, 0),
    };
    previousCompleted = status === "completed";
  }

  return topics.map(topic => ({
    ...topic,
    ...(computed[topic.id] ?? {}),
  }));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [xpTransactions, setXpTransactions] = useState<XPTransaction[]>(XP_TRANSACTIONS);
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentXp, setCurrentXp] = useState(DEMO_USER.xp);
  const [authError, setAuthError] = useState("");
  const [learningState, setLearningState] = useState<LearningState>(DEFAULT_LEARNING_STATE);

  const applyBootstrap = useCallback((data: Awaited<ReturnType<typeof loadBootstrap>>) => {
    setUser(data.user);
    setCurrentXp(data.user.xp);
    setNotifications(data.notifications);
    setXpTransactions(data.xpTransactions);
    setLearningState(data.learningState ?? DEFAULT_LEARNING_STATE);
    setIsAuthenticated(true);
  }, []);

  const applyApiResult = useCallback((data: { user?: User; transaction?: XPTransaction | null; learningState?: LearningState }) => {
    if (data.user) {
      setUser(data.user);
      setCurrentXp(data.user.xp);
    }
    if (data.transaction) {
      setXpTransactions(prev => [data.transaction!, ...prev.filter(tx => tx.id !== data.transaction!.id)]);
    }
    if (data.learningState) {
      setLearningState(data.learningState);
    }
  }, []);

  const topics = deriveTopicStatus(TOPICS, learningState.topicProgress, currentXp, getLevelForXp);
  const quizzes = QUIZZES.map(quiz => {
    const saved = learningState.quizAttempts[quiz.id];
    return saved ? { ...quiz, completed: saved.completed ?? quiz.completed, bestScore: saved.bestScore ?? quiz.bestScore } : quiz;
  });
  const challenges = CHALLENGES.map(challenge => {
    const saved = learningState.challengeProgress[challenge.id];
    return saved ? { ...challenge, status: saved.status ?? challenge.status } : challenge;
  });
  const achievements = ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    ...(learningState.achievementProgress[achievement.id] ?? {}),
  }));
  const activity = learningState.activity?.length ? learningState.activity : ACTIVITY;
  const analytics = learningState.analytics ?? ANALYTICS;
  const leaderboard = learningState.leaderboard?.length ? learningState.leaderboard : LEADERBOARD;
  const dailyChallenge = {
    ...DAILY_CHALLENGE,
    completed: learningState.challengeProgress[DAILY_CHALLENGE.challengeId]?.status === "completed" || DAILY_CHALLENGE.completed,
  };

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const hashToken = hash.get("access_token");
    if (hashToken) {
      setAccessToken(hashToken);
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }
    if (!hashToken && !getAccessToken()) return;
    loadBootstrap().then(applyBootstrap).catch(() => setAccessToken(null));
  }, [applyBootstrap]);

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

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setAuthError("");
    try {
      const result = await apiRequest<{ accessToken: string }>("/auth/login", {
        method: "POST", body: JSON.stringify({ email, password }),
      });
      setAccessToken(result.accessToken);
      const data = await loadBootstrap();
      applyBootstrap(data);
      return true;
    } catch {
      setAccessToken(null);
      setAuthError("Invalid email or password.");
      return false;
    }
  }, [applyBootstrap]);

  const logout = useCallback(() => {
    void apiRequest("/auth/logout", { method: "POST" }).catch(() => undefined);
    setAccessToken(null);
    setUser(null);
    setLearningState(DEFAULT_LEARNING_STATE);
    setIsAuthenticated(false);
  }, []);

  const register = useCallback(async (name: string, username: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    setAuthError("");
    try {
      const result = await apiRequest<{ accessToken?: string; session?: { access_token: string } }>("/auth/register", {
        method: "POST", body: JSON.stringify({ name, username, email, password }),
      });
      const accessToken = result.accessToken ?? result.session?.access_token;
      if (!accessToken) {
        setAuthError("Account created. Check your email to confirm it, then sign in.");
        return { ok: false, error: "Account created. Check your email to confirm it, then sign in." };
      }
      setAccessToken(accessToken);
      return { ok: true };
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Registration failed.");
      return { ok: false, error: error instanceof Error ? error.message : "Registration failed." };
    }
  }, []);

  const completeOnboarding = useCallback(async (experience: string, learningGoal: string) => {
    try {
      await apiRequest("/profile", {
        method: "PATCH",
        body: JSON.stringify({ experience, learningGoal }),
      });
      const data = await loadBootstrap();
      applyBootstrap(data);
      return true;
    } catch {
      return false;
    }
  }, [applyBootstrap]);

  const setTheme = useCallback((t: ThemeMode) => {
    setThemeState(t);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

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
    void apiRequest("/xp", { method: "POST", body: JSON.stringify({ amount, description }) }).catch(() => undefined);
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
    void apiRequest("/xp", { method: "POST", body: JSON.stringify({ amount: -amount, description }) }).catch(() => undefined);
    return true;
  }, [currentXp]);

  const completeTopic = useCallback(async (topic: Topic, completedSubtopics: number[], progress: number) => {
    const status = progress >= 100 ? "completed" : "in-progress";
    setLearningState(prev => ({
      ...prev,
      topicProgress: {
        ...prev.topicProgress,
        [topic.id]: { topicId: topic.id, title: topic.title, status, progress, completedSubtopics },
      },
    }));
    try {
      const data = await apiRequest<{ user?: User; transaction?: XPTransaction | null; learningState?: LearningState; topicProgress: LearningState["topicProgress"][string] }>(`/topics/${topic.id}/progress`, {
        method: "PATCH",
        body: JSON.stringify({ title: topic.title, progress, completedSubtopics, status, xp: topic.xpReward }),
      });
      applyApiResult(data);
      return true;
    } catch {
      return false;
    }
  }, [applyApiResult]);

  const submitQuizResult = useCallback(async (quiz: Quiz, score: number, total: number, xp: number) => {
    try {
      const data = await apiRequest<{ user?: User; transaction?: XPTransaction | null; learningState?: LearningState }>("/quiz/submit", {
        method: "POST",
        body: JSON.stringify({ quizId: quiz.id, topicId: quiz.topicId, topicTitle: quiz.topicTitle, score, total, xp }),
      });
      applyApiResult(data);
      return true;
    } catch {
      return false;
    }
  }, [applyApiResult]);

  const submitChallengeResult = useCallback(async (challenge: Challenge, payload: { passed: boolean; code?: string; submissionType?: string }) => {
    try {
      const data = await apiRequest<{ user?: User; transaction?: XPTransaction | null; learningState?: LearningState }>("/challenge/submit", {
        method: "POST",
        body: JSON.stringify({ challengeId: challenge.id, title: challenge.title, xp: challenge.xpReward, ...payload }),
      });
      applyApiResult(data);
      return true;
    } catch {
      return false;
    }
  }, [applyApiResult]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    void apiRequest(`/notifications/${id}`, { method: "PATCH" }).catch(() => undefined);
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    void apiRequest("/notifications/read-all", { method: "POST" }).catch(() => undefined);
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
      searchOpen, currentXp, topics, quizzes, challenges, achievements, activity, analytics,
      leaderboard, dailyChallenge,
      login, logout, register, completeOnboarding, setTheme, toggleSidebar,
      authError,
      openSearch, closeSearch, addXp, spendXp, completeTopic, submitQuizResult, submitChallengeResult, markNotificationRead,
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
