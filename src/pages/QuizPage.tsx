import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Clock, Zap, ArrowRight, RotateCcw, BookOpen } from "lucide-react";
import { QUIZZES } from "../data/mockData";
import { useApp } from "../context/AppContext";
import type { Quiz, Question } from "../types";

interface QuizPageProps {
  topicId?: string;
  onBack: () => void;
  onContinueLearning: () => void;
  onNextChallenge: () => void;
}

function QuizOption({ option, index, selected, correct, revealed, onClick }: {
  option: string; index: number; selected: boolean; correct: boolean; revealed: boolean; onClick: () => void;
}) {
  const letters = ["A", "B", "C", "D"];
  let stateClass = "border-border hover:border-primary/40 hover:bg-muted/30";
  if (selected && !revealed) stateClass = "border-primary bg-primary/5";
  if (revealed && correct) stateClass = "border-green-500 bg-green-50 dark:bg-green-900/20";
  if (revealed && selected && !correct) stateClass = "border-red-400 bg-red-50 dark:bg-red-900/20";
  if (revealed && !selected && !correct) stateClass = "border-border opacity-50";

  return (
    <button
      onClick={onClick}
      disabled={revealed}
      className={`w-full text-left flex items-center gap-3 p-4 rounded-lg border transition-all ${stateClass} ${!revealed ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-xs font-bold transition-all ${
        selected && !revealed ? "bg-primary text-white" :
        revealed && correct ? "bg-green-500 text-white" :
        revealed && selected && !correct ? "bg-red-400 text-white" :
        "bg-muted text-muted-foreground"
      }`}>
        {revealed && correct ? <CheckCircle2 size={13} /> :
         revealed && selected && !correct ? <XCircle size={13} /> :
         letters[index]}
      </div>
      <span className="text-sm font-medium">{option}</span>
    </button>
  );
}

function QuizComplete({ quiz, score, xpEarned, elapsed, onRetry, onContinue, onNextChallenge }: {
  quiz: Quiz; score: number; xpEarned: number; elapsed: number; onRetry: () => void; onContinue: () => void; onNextChallenge: () => void;
}) {
  const total = quiz.questions.length;
  const accuracy = Math.round((score / total) * 100);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div className="max-w-md mx-auto py-12 px-6 text-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
        accuracy >= 80 ? "bg-green-100 dark:bg-green-900/30" : "bg-yellow-100 dark:bg-yellow-900/30"
      }`}>
        {accuracy >= 80 ? <CheckCircle2 size={28} className="text-green-600" /> : <BookOpen size={28} className="text-yellow-600" />}
      </div>

      <h2 className="text-2xl font-bold mb-1">Quiz Completed</h2>
      <p className="text-muted-foreground text-sm mb-8">{quiz.topicTitle}</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { label: "Score", value: `${score} / ${total}` },
          { label: "Accuracy", value: `${accuracy}%` },
          { label: "XP Earned", value: `+${xpEarned} XP` },
          { label: "Time", value: `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}` },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-lg border border-border bg-card">
            <p className="text-2xl font-bold mb-0.5">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {accuracy < 80 && (
        <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 mb-6 text-sm text-yellow-800 dark:text-yellow-300">
          Review the questions you missed and try again to improve your score.
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button onClick={onRetry}
          className="flex items-center justify-center gap-2 py-2.5 rounded-md border border-border font-medium text-sm hover:bg-muted transition-colors">
          <RotateCcw size={14} /> Retry Quiz
        </button>
        <button onClick={onContinue}
          className="flex items-center justify-center gap-2 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
          Continue Learning <ArrowRight size={14} />
        </button>
        <button onClick={onNextChallenge}
          className="flex items-center justify-center gap-2 py-2.5 rounded-md text-primary font-medium text-sm hover:bg-primary/5 transition-colors">
          Try a Coding Challenge <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function QuizPage({ topicId, onBack, onContinueLearning, onNextChallenge }: QuizPageProps) {
  const { addXp } = useApp();
  const quiz = QUIZZES.find(q => q.topicId === topicId) ?? QUIZZES[0];
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [finished]);

  const question: Question = quiz.questions[currentQ];
  const total = quiz.questions.length;
  const progress = ((currentQ + (revealed ? 1 : 0)) / total) * 100;

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelectedAnswer(idx);
  };

  const handleReveal = () => {
    if (selectedAnswer === null) return;
    setRevealed(true);
    if (selectedAnswer === question.correctIndex) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < total - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
      setRevealed(false);
    } else {
      const finalScore = selectedAnswer === question.correctIndex ? correctCount + 1 : correctCount;
      setScore(finalScore);
      const xp = quiz.xpReward;
      const bonus = Math.round((finalScore / total) * 100) === 100 ? 25 : 0;
      const totalXp = xp + bonus;
      setXpEarned(totalXp);
      addXp(totalXp, `Completed Quiz: ${quiz.topicTitle}${bonus ? " (+25 XP perfect bonus)" : ""}`);
      setFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setRevealed(false);
    setCorrectCount(0);
    setFinished(false);
    setScore(0);
    setElapsed(0);
  };

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  if (finished) {
    return (
      <QuizComplete
        quiz={quiz} score={score} xpEarned={xpEarned} elapsed={elapsed}
        onRetry={handleRetry} onContinue={onContinueLearning} onNextChallenge={onNextChallenge}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Clock size={13} />
            <span className="font-mono">{mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-primary text-sm font-semibold">
            <Zap size={13} />
            +{quiz.xpReward} XP
          </div>
        </div>
      </div>

      {/* Quiz title & progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground">{quiz.topicTitle}</p>
            <p className="font-semibold">Quiz</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">Question {currentQ + 1} / {total}</p>
            <p className="text-xs text-muted-foreground capitalize">{quiz.difficulty}</p>
          </div>
        </div>
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="p-5 rounded-lg border border-border bg-card mb-5">
        <p className="font-medium text-sm mb-3">{question.text}</p>
        {question.code && (
          <pre className="p-4 rounded-md bg-[#1e1e2e] text-[#cdd6f4] text-sm font-mono overflow-x-auto">
            <code>{question.code}</code>
          </pre>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2 mb-5">
        {question.options.map((opt, i) => (
          <QuizOption
            key={i}
            option={opt}
            index={i}
            selected={selectedAnswer === i}
            correct={i === question.correctIndex}
            revealed={revealed}
            onClick={() => handleSelect(i)}
          />
        ))}
      </div>

      {/* Explanation */}
      {revealed && (
        <div className={`p-4 rounded-lg border mb-5 ${
          selectedAnswer === question.correctIndex
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        }`}>
          <div className="flex items-center gap-2 mb-1">
            {selectedAnswer === question.correctIndex
              ? <CheckCircle2 size={14} className="text-green-600" />
              : <XCircle size={14} className="text-red-500" />}
            <span className={`text-xs font-semibold ${selectedAnswer === question.correctIndex ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {selectedAnswer === question.correctIndex ? "Correct!" : "Incorrect"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{question.explanation}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        {!revealed ? (
          <button
            onClick={handleReveal}
            disabled={selectedAnswer === null}
            className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            {currentQ < total - 1 ? "Next Question" : "Finish Quiz"}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
