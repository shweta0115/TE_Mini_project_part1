import { CheckCircle2, Lock, Clock, Sparkles, ArrowRight, BookOpen, Play } from "lucide-react";
import type { Topic } from "../types";
import { useApp } from "../context/AppContext";

interface LearnPageProps {
  onOpenTopic: (topicId: string) => void;
}

const CATEGORY_LABELS = {
  beginner: { label: "Beginner", color: "text-primary", bg: "bg-secondary", border: "border-primary/20" },
  intermediate: { label: "Intermediate", color: "text-foreground", bg: "bg-muted", border: "border-border" },
  advanced: { label: "Advanced", color: "text-foreground", bg: "bg-muted", border: "border-border" },
};

function TopicRow({ topic, onOpen, userXp }: { topic: Topic; onOpen: () => void; userXp: number }) {
  const isLocked = topic.status === "locked";
  const isCompleted = topic.status === "completed";
  const isInProgress = topic.status === "in-progress";
  return (
    <div
      onClick={() => !isLocked && onOpen()}
      className={`flex items-center gap-4 px-1 py-4 transition-colors ${
        isLocked ? "opacity-55 cursor-not-allowed" :
        isCompleted ? "cursor-pointer group" :
        "cursor-pointer group"
      }`}
    >
      {/* Status indicator */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isCompleted ? "bg-success" :
        isInProgress ? "bg-primary" :
        isLocked ? "bg-muted border-2 border-muted" :
        "bg-muted border-2 border-primary/30"
      }`}>
        {isCompleted && <CheckCircle2 size={14} className="text-success-foreground" />}
        {isInProgress && <Play size={12} className="text-primary-foreground" />}
        {isLocked && <Lock size={12} className="text-muted-foreground" />}
        {topic.status === "unlocked" && <span className="text-xs font-bold text-primary">{topic.order}</span>}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs text-muted-foreground font-mono">#{topic.order.toString().padStart(2, "0")}</span>
          <h3 className={`font-medium text-sm truncate ${isLocked ? "" : "group-hover:text-primary"} transition-colors`}>
            {topic.title}
          </h3>
          {isInProgress && (
            <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-green-pale text-primary shrink-0">
              In Progress
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{topic.description}</p>
        {isInProgress && (
          <div className="mt-2 flex items-center gap-2">
            <div className="w-24 h-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${topic.progress}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{topic.progress}%</span>
          </div>
        )}
        {isLocked && (topic.requiredXp || topic.requiredLevel) && (
          <div className="flex items-center gap-1.5 mt-1">
            <Lock size={10} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {topic.requiredLevel ? `Requires Level ${topic.requiredLevel}` : `Requires ${topic.requiredXp?.toLocaleString()} XP`}
            </span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
          <Clock size={11} />
          {topic.estimatedMinutes} min
        </div>
          <div className="flex items-center gap-1 text-xs font-medium text-warning">
          <Sparkles size={11} strokeWidth={1.8} />
          +{topic.xpReward}
        </div>
        {!isLocked && (
          <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        )}
      </div>
    </div>
  );
}

export default function LearnPage({ onOpenTopic }: LearnPageProps) {
  const { currentXp, topics: TOPICS } = useApp();
  const categories = ["beginner", "intermediate", "advanced"] as const;
  const completedCount = TOPICS.filter(t => t.status === "completed").length;
  const totalCount = TOPICS.length;

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="pq-page-heading text-2xl font-bold mb-1">Python Learning Path</h1>
            <p className="text-muted-foreground text-sm">Progress from Python fundamentals to advanced development.</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{completedCount}<span className="text-muted-foreground text-lg font-normal">/{totalCount}</span></p>
            <p className="text-xs text-muted-foreground">topics completed</p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="course-progress-summary">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen size={14} className="text-primary" />
              <span className="text-sm font-medium">Python Fundamentals</span>
            </div>
            <span className="text-sm font-semibold">{Math.round((completedCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.round((completedCount / totalCount) * 100)}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {completedCount} of {totalCount} topics completed · {(totalCount - completedCount)} remaining
          </p>
        </div>
      </div>

      {/* Topics by Category */}
      {categories.map(cat => {
        const topics = TOPICS.filter(t => t.category === cat);
        const catInfo = CATEGORY_LABELS[cat];
        const catCompleted = topics.filter(t => t.status === "completed").length;

        return (
          <div key={cat} className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${catInfo.bg} ${catInfo.color} ${catInfo.border}`}>
                  {catInfo.label.toUpperCase()}
                </span>
                <span className="text-xs text-muted-foreground">{catCompleted}/{topics.length} complete</span>
              </div>
              <div className="w-16 h-1 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full bg-primary`} style={{ width: `${Math.round((catCompleted / topics.length) * 100)}%` }} />
              </div>
            </div>

            <div className="course-topic-list divide-y divide-border border-y border-border">
              {topics.map(topic => (
                <TopicRow
                  key={topic.id}
                  topic={topic}
                  onOpen={() => onOpenTopic(topic.id)}
                  userXp={currentXp}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
