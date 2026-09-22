export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";
export type TopicStatus = "completed" | "in-progress" | "unlocked" | "locked";
export type ChallengeStatus = "completed" | "attempted" | "unlocked" | "locked";
export type ThemeMode = "light" | "dark" | "system";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  level: number;
  levelTitle: string;
  xp: number;
  nextLevelXp: number;
  streak: number;
  joinedAt: string;
  experience: "beginner" | "intermediate" | "advanced";
  learningGoal: string;
  stats: UserStats;
}

export interface UserStats {
  lessonsCompleted: number;
  quizzesCompleted: number;
  challengesCompleted: number;
  quizAccuracy: number;
  learningHours: number;
  totalXpEarned: number;
}

export interface Level {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
}

export interface Topic {
  id: string;
  order: number;
  title: string;
  description: string;
  category: "beginner" | "intermediate" | "advanced";
  difficulty: Difficulty;
  xpReward: number;
  estimatedMinutes: number;
  status: TopicStatus;
  progress: number;
  subtopics: Subtopic[];
  requiredXp?: number;
  requiredLevel?: number;
}

export interface Subtopic {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
  codeOutput?: string;
  notes?: string;
}

export interface Quiz {
  id: string;
  topicId: string;
  topicTitle: string;
  difficulty: Difficulty;
  xpReward: number;
  timeLimit: number;
  questions: Question[];
  completed?: boolean;
  bestScore?: number;
}

export interface Question {
  id: string;
  text: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  topic: string;
  xpReward: number;
  estimatedMinutes: number;
  status: ChallengeStatus;
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  examples: ChallengeExample[];
  constraints: string[];
  hints: ChallengeHint[];
  starterCode: string;
  testCases: TestCase[];
  requiredXp?: number;
  requiredLevel?: number;
}

export interface ChallengeExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ChallengeHint {
  id: string;
  text: string;
  xpCost: number;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  passed?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  progress: number;
  total: number;
  earned: boolean;
  earnedAt?: string;
  xpReward: number;
  category: "learning" | "challenges" | "streaks" | "accuracy" | "speed";
}

export interface XPTransaction {
  id: string;
  amount: number;
  description: string;
  type: "earned" | "spent";
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "xp" | "achievement" | "streak" | "challenge" | "unlock" | "system";
  read: boolean;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  username: string;
  level: number;
  levelTitle: string;
  xp: number;
  challengesCompleted: number;
  achievementsCount: number;
  streak: number;
  isCurrentUser?: boolean;
}

export interface ActivityEntry {
  id: string;
  type: "lesson" | "quiz" | "challenge" | "achievement" | "unlock" | "streak";
  title: string;
  xp?: number;
  createdAt: string;
}

export interface StreakDay {
  date: string;
  active: boolean;
  xpEarned: number;
}

export interface DailyChallenge {
  id: string;
  challengeId: string;
  title: string;
  difficulty: Difficulty;
  xpReward: number;
  estimatedMinutes: number;
  completed: boolean;
  date: string;
}

export interface AnalyticsData {
  xpByWeek: { week: string; xp: number }[];
  accuracyByTopic: { topic: string; accuracy: number }[];
  challengesByDifficulty: { difficulty: string; count: number }[];
  weeklyActivity: { day: string; xp: number; lessons: number; challenges: number }[];
  topicMastery: { topic: string; mastery: number }[];
  dailyActivity?: { date: string; xp: number }[];
}

export interface LearningState {
  topicProgress: Record<string, {
    topicId: string;
    title?: string;
    status?: TopicStatus;
    progress?: number;
    completedSubtopics?: number[];
    updatedAt?: string;
  }>;
  quizAttempts: Record<string, {
    quizId: string;
    topicId?: string;
    topicTitle?: string;
    completed?: boolean;
    bestScore?: number;
    bestAccuracy?: number;
    attempts?: number;
    updatedAt?: string;
  }>;
  challengeProgress: Record<string, {
    challengeId: string;
    title?: string;
    status?: ChallengeStatus;
    attempts?: number;
    submissionType?: string;
    lastCode?: string;
    updatedAt?: string;
  }>;
  achievementProgress: Record<string, Partial<Achievement>>;
  activity: ActivityEntry[];
  analytics: AnalyticsData;
  leaderboard: LeaderboardEntry[];
}
