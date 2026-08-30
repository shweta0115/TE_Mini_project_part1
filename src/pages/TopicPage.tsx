import { useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, Zap, ChevronRight, BookOpen, Code2, Star } from "lucide-react";
import { TOPICS } from "../data/mockData";
import { useApp } from "../context/AppContext";

interface TopicPageProps {
  topicId: string;
  onBack: () => void;
  onStartQuiz: (topicId: string) => void;
  onStartChallenge: () => void;
}

function CodeBlock({ code, output }: { code: string; output?: string }) {
  return (
    <div className="rounded-lg overflow-hidden border border-border my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">python</span>
        </div>
      </div>
      <pre className="p-4 text-sm overflow-x-auto bg-[#1e1e2e] text-[#cdd6f4]">
        <code>{code}</code>
      </pre>
      {output && (
        <>
          <div className="px-4 py-2 bg-muted/30 border-t border-border">
            <span className="text-xs font-mono text-muted-foreground">Output</span>
          </div>
          <pre className="p-4 text-sm bg-muted/20 text-foreground font-mono">
            <code>{output}</code>
          </pre>
        </>
      )}
    </div>
  );
}

export default function TopicPage({ topicId, onBack, onStartQuiz, onStartChallenge }: TopicPageProps) {
  const { addXp } = useApp();
  const topic = TOPICS.find(t => t.id === topicId) ?? TOPICS[5];
  const [activeSubtopic, setActiveSubtopic] = useState(0);
  const [completedSubtopics, setCompletedSubtopics] = useState<Set<number>>(new Set());
  const [topicCompleted, setTopicCompleted] = useState(false);

  const currentSub = topic.subtopics[activeSubtopic];
  const progress = topic.status === "completed" ? 100 :
    topic.status === "in-progress" ? Math.round((completedSubtopics.size / Math.max(topic.subtopics.length, 1)) * 100) : 0;

  const handleMarkComplete = () => {
    setCompletedSubtopics(prev => new Set([...prev, activeSubtopic]));
    if (activeSubtopic < topic.subtopics.length - 1) {
      setActiveSubtopic(prev => prev + 1);
    } else {
      if (!topicCompleted) {
        setTopicCompleted(true);
        addXp(topic.xpReward, `Completed: ${topic.title}`);
      }
    }
  };

  const allDone = completedSubtopics.size === topic.subtopics.length && topic.subtopics.length > 0;

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      {/* Back + Header */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft size={14} /> Back to Learn
      </button>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left Nav */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="p-4 rounded-lg border border-border bg-card mb-4">
              <p className="text-xs text-muted-foreground mb-2">Topic Progress</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">{progress}%</span>
                <span className="text-xs text-muted-foreground">{completedSubtopics.size}/{topic.subtopics.length}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden mb-3">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Clock size={11} />{topic.estimatedMinutes} min</div>
                <div className="flex items-center gap-1.5 text-primary font-medium"><Zap size={11} />+{topic.xpReward} XP</div>
              </div>
            </div>

            {topic.subtopics.length > 0 && (
              <nav className="space-y-1">
                {topic.subtopics.map((sub, i) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubtopic(i)}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-md text-xs transition-all ${
                      activeSubtopic === i
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      completedSubtopics.has(i) ? "bg-green-500" : activeSubtopic === i ? "bg-primary" : "bg-muted"
                    }`}>
                      {completedSubtopics.has(i) ? (
                        <CheckCircle2 size={9} className="text-white" />
                      ) : (
                        <span className="text-xs font-bold text-white">{i + 1}</span>
                      )}
                    </div>
                    <span className="truncate">{sub.title}</span>
                    {activeSubtopic === i && <ChevronRight size={11} className="shrink-0 ml-auto" />}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground font-mono">#{topic.order.toString().padStart(2, "0")}</span>
              <span className="text-xs px-2 py-0.5 rounded border border-border text-muted-foreground capitalize">{topic.difficulty}</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">{topic.title}</h1>
            <p className="text-muted-foreground">{topic.description}</p>
          </div>

          {allDone && (
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 mb-6 flex items-center gap-3">
              <CheckCircle2 size={18} className="text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">Topic Completed!</p>
                <p className="text-xs text-green-700 dark:text-green-400">You earned +{topic.xpReward} XP. Ready for the quiz?</p>
              </div>
            </div>
          )}

          {currentSub ? (
            <div>
              <h2 className="text-lg font-semibold mb-3">{currentSub.title}</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">{currentSub.content}</p>
              </div>

              {currentSub.codeExample && (
                <>
                  <h3 className="font-medium text-sm mt-5 mb-2 flex items-center gap-1.5">
                    <Code2 size={14} className="text-primary" /> Code Example
                  </h3>
                  <CodeBlock code={currentSub.codeExample} output={currentSub.codeOutput} />
                </>
              )}

              {currentSub.notes && (
                <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-xs font-semibold text-primary mb-1">Important Note</p>
                  <p className="text-sm text-muted-foreground">{currentSub.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center rounded-lg border border-dashed border-border">
              <BookOpen size={32} className="text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Content coming soon</h3>
              <p className="text-sm text-muted-foreground">This topic's detailed content is being prepared.</p>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
            <div className="flex items-center gap-3">
              {!allDone && currentSub && (
                <button onClick={handleMarkComplete}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <CheckCircle2 size={14} />
                  {activeSubtopic === topic.subtopics.length - 1 ? "Complete Topic" : "Mark Complete"}
                </button>
              )}
              {allDone && (
                <button onClick={() => onStartQuiz(topic.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Star size={14} /> Take Quiz
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onStartQuiz(topic.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-border text-sm hover:bg-muted transition-colors">
                <Star size={13} /> Take Quiz
              </button>
              <button onClick={onStartChallenge}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-border text-sm hover:bg-muted transition-colors">
                <Code2 size={13} /> Try Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
