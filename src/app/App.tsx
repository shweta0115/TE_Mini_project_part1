import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { AppProvider, useApp } from "../context/AppContext";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import SearchOverlay from "../components/SearchOverlay";
import LandingPage from "../pages/LandingPage";
import AuthPages from "../pages/AuthPages";
import DashboardPage from "../pages/DashboardPage";
import LearnPage from "../pages/LearnPage";
import TopicPage from "../pages/TopicPage";
import QuizPage from "../pages/QuizPage";
import ChallengePage from "../pages/ChallengePage";
import ChallengeDetailPage from "../pages/ChallengeDetailPage";
import ProgressPage from "../pages/ProgressPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import AchievementsPage from "../pages/AchievementsPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import NotificationsPage from "../pages/NotificationsPage";
import { BookOpen, Code2, BarChart3, User, LayoutDashboard } from "lucide-react";

type View =
  | "landing" | "login" | "register" | "onboarding"
  | "dashboard" | "learn" | "topic" | "quiz"
  | "challenges" | "challenge-detail"
  | "progress" | "leaderboard" | "achievements"
  | "profile" | "settings" | "notifications";

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="text-6xl font-bold text-muted mb-2">404</div>
      <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs">The page you're looking for doesn't exist or has been moved.</p>
      <button onClick={onBack} className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
        Return to Dashboard
      </button>
    </div>
  );
}

function Unauthorized({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="text-6xl font-bold text-muted mb-2">403</div>
      <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs">You don't have permission to access this page. Please sign in to continue.</p>
      <button onClick={onBack} className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
        Sign In
      </button>
    </div>
  );
}

const MOBILE_NAV = [
  { view: "dashboard", label: "Home", icon: LayoutDashboard },
  { view: "learn", label: "Learn", icon: BookOpen },
  { view: "challenges", label: "Challenges", icon: Code2 },
  { view: "progress", label: "Progress", icon: BarChart3 },
  { view: "profile", label: "Profile", icon: User },
];

function AppShell() {
  const { isAuthenticated } = useApp();
  const [view, setView] = useState<View>("landing");
  const [topicId, setTopicId] = useState<string>("t6");
  const [challengeId, setChallengeId] = useState<string>("c1");
  const [quizTopicId, setQuizTopicId] = useState<string>("t6");

  useEffect(() => {
    if (!isAuthenticated && !["landing", "login", "register", "onboarding"].includes(view)) {
      setView("landing");
    }
  }, [isAuthenticated]);

  const navigate = (v: string, id?: string) => {
    if (v === "topic" && id) setTopicId(id);
    if (v === "challenge-detail" && id) setChallengeId(id);
    if (v === "quiz" && id) setQuizTopicId(id);
    setView(v as View);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Public views (no auth, no layout)
  if (!isAuthenticated) {
    if (view === "login" || view === "register" || view === "onboarding") {
      return (
        <AuthPages
          mode={view as "login" | "register" | "onboarding"}
          onNavigate={navigate}
        />
      );
    }
    if (view !== "landing") {
      return <Unauthorized onBack={() => setView("login")} />;
    }
    return <LandingPage onNavigate={navigate} />;
  }

  // Authenticated: show app shell
  const isChallengeDetail = view === "challenge-detail";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar (hidden on mobile) */}
      <div className="hidden md:block">
        <Sidebar currentView={view} onNavigate={navigate} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header currentView={view} onNavigate={navigate} />

        {/* Page Content */}
        <main className={`flex-1 overflow-auto ${isChallengeDetail ? "overflow-hidden" : ""}`}>
          {view === "dashboard" && (
            <DashboardPage
              onNavigate={navigate}
              onOpenTopic={id => navigate("topic", id)}
              onOpenChallenge={id => navigate("challenge-detail", id)}
            />
          )}
          {view === "learn" && <LearnPage onOpenTopic={id => navigate("topic", id)} />}
          {view === "topic" && (
            <TopicPage
              topicId={topicId}
              onBack={() => navigate("learn")}
              onStartQuiz={tid => navigate("quiz", tid)}
              onStartChallenge={() => navigate("challenges")}
            />
          )}
          {view === "quiz" && (
            <QuizPage
              topicId={quizTopicId}
              onBack={() => navigate("topic", quizTopicId)}
              onContinueLearning={() => navigate("learn")}
              onNextChallenge={() => navigate("challenges")}
            />
          )}
          {view === "challenges" && (
            <ChallengePage onOpenChallenge={id => navigate("challenge-detail", id)} />
          )}
          {view === "challenge-detail" && (
            <ChallengeDetailPage
              challengeId={challengeId}
              onBack={() => navigate("challenges")}
            />
          )}
          {view === "progress" && <ProgressPage />}
          {view === "leaderboard" && <LeaderboardPage />}
          {view === "achievements" && <AchievementsPage />}
          {view === "profile" && <ProfilePage />}
          {view === "settings" && <SettingsPage />}
          {view === "notifications" && <NotificationsPage />}
          {!["dashboard","learn","topic","quiz","challenges","challenge-detail","progress","leaderboard","achievements","profile","settings","notifications"].includes(view) && (
            <NotFound onBack={() => navigate("dashboard")} />
          )}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden flex items-center justify-around border-t border-border bg-card px-2 py-2 shrink-0">
          {MOBILE_NAV.map(item => {
            const Icon = item.icon;
            const isActive = view === item.view;
            return (
              <button key={item.view} onClick={() => navigate(item.view)}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}>
                <Icon size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search Overlay */}
      <SearchOverlay onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
      <Toaster position="top-right" richColors />
    </AppProvider>
  );
}
