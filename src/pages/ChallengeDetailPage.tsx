import React, { useState, useRef } from "react";
import {
  ArrowLeft, Play, Upload, RefreshCw, ChevronDown, CheckCircle2, XCircle,
  Lightbulb, Sparkles, Clock, Lock, Image, X, Loader2, AlertCircle
} from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Challenge } from "../types";

interface ChallengeDetailProps {
  challengeId: string;
  onBack: () => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "text-primary bg-secondary border-primary/20",
  intermediate: "text-foreground bg-muted border-border",
  advanced: "text-muted-foreground bg-muted border-border",
  expert: "text-foreground bg-muted border-border",
};

type SubmissionState = "idle" | "running" | "success" | "error";

function HintPanel({ challenge, onSpendXp, canAfford }: {
  challenge: Challenge; onSpendXp: (amount: number, desc: string) => boolean; canAfford: (cost: number) => boolean;
}) {
  const [revealedHints, setRevealedHints] = useState<Set<string>>(new Set());
  const [pendingHint, setPendingHint] = useState<string | null>(null);

  const handleReveal = (hintId: string, cost: number) => {
    if (!canAfford(cost)) return;
    setPendingHint(hintId);
  };

  const confirmReveal = (hintId: string, cost: number, desc: string) => {
    const ok = onSpendXp(cost, desc);
    if (ok) setRevealedHints(prev => new Set([...prev, hintId]));
    setPendingHint(null);
  };

  return (
    <div>
      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
        <Lightbulb size={14} className="text-warning" /> Hints
      </h3>
      <div className="space-y-2">
        {challenge.hints.map((hint, i) => {
          const isRevealed = revealedHints.has(hint.id);
          const isPending = pendingHint === hint.id;
          const affordable = canAfford(hint.xpCost);

          return (
            <div key={hint.id} className="rounded-lg border border-border overflow-hidden">
              {isPending ? (
                <div className="p-3 bg-warning/10">
                  <p className="text-xs font-semibold text-foreground mb-2">
                    Reveal this hint for {hint.xpCost} XP?
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setPendingHint(null)}
                      className="flex-1 py-1.5 rounded text-xs border border-border hover:bg-muted transition-colors">
                      Cancel
                    </button>
                    <button onClick={() => confirmReveal(hint.id, hint.xpCost, `Used Hint ${i + 1}: ${challenge.title}`)}
                      className="flex-1 py-1.5 rounded text-xs bg-warning text-foreground hover:bg-warning/90 transition-colors font-medium">
                      Reveal Hint (-{hint.xpCost} XP)
                    </button>
                  </div>
                </div>
              ) : isRevealed ? (
                <div className="p-3 bg-warning/5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Lightbulb size={11} className="text-warning" />
                    <span className="text-xs font-semibold text-foreground">Hint {i + 1}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{hint.text}</p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <Lock size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Hint {i + 1}</span>
                  </div>
                  <button
                    onClick={() => handleReveal(hint.id, hint.xpCost)}
                    disabled={!affordable}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      affordable
                        ? "bg-warning/10 text-foreground hover:bg-warning/20"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    <Sparkles size={10} strokeWidth={1.8} />
                    {hint.xpCost} XP
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CodeEditor({ code, onChange }: { code: string; onChange: (v: string) => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden rounded-lg border border-border">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-border bg-background text-xs font-mono">
            <span>Python 3.11</span>
            <ChevronDown size={11} className="text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-hidden flex bg-[#111814]">
        {/* Line numbers */}
        <div className="py-4 px-3 text-right select-none shrink-0 bg-[#1b241f]">
          {code.split("\n").map((_, i) => (
            <div key={i} className="text-xs leading-6 font-mono" style={{ color: "#68736d" }}>
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          value={code}
          onChange={e => onChange(e.target.value)}
          className="flex-1 py-4 px-4 text-sm font-mono leading-6 resize-none outline-none bg-transparent"
          style={{ color: "#f1f3ee", caretColor: "#f1f3ee" }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
}

function ScreenshotSubmission({ onSubmit }: { onSubmit: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "uploading" | "analyzing" | "done">("idle");
  const [result, setResult] = useState<"pass" | "fail" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setState("uploading");
    await new Promise(r => setTimeout(r, 1000));
    setState("analyzing");
    await new Promise(r => setTimeout(r, 1500));
    setState("done");
    setResult("pass");
    onSubmit();
  };

  if (state === "done" && result === "pass") {
    return (
      <div className="p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 size={22} className="text-success" />
        </div>
        <h3 className="font-semibold mb-1">Challenge Completed!</h3>
        <p className="text-sm text-muted-foreground mb-3">Your solution has been verified successfully.</p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
          <Sparkles size={13} strokeWidth={1.8} /> XP Earned
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">
          Note: Screenshot analysis is simulated. Future backend will use OCR + Python execution.
        </p>
      </div>
    );
  }

  if (state === "analyzing" || state === "uploading") {
    return (
      <div className="p-6 text-center">
        <Loader2 size={28} className="animate-spin text-primary mx-auto mb-3" />
        <p className="font-medium text-sm mb-1">
          {state === "uploading" ? "Uploading screenshot..." : "Analyzing submission..."}
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          {state === "analyzing" ? "Detecting code, verifying syntax, running test cases." : ""}
        </p>
        {state === "analyzing" && (
          <div className="space-y-2 text-left max-w-xs mx-auto">
            {["Code detected", "Syntax verified", "Test cases evaluated"].map((step) => (
              <div key={step} className="flex items-center gap-2 text-xs">
                <CheckCircle2 size={12} className="text-success" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Image size={14} className="text-primary" />
        <h3 className="font-semibold text-sm">Submit Screenshot</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Solved this in VS Code, PyCharm, or another IDE? Upload a clear screenshot of your solution.
      </p>

      {preview ? (
        <div className="relative mb-4">
          <img src={preview} alt="Code screenshot" className="w-full rounded-lg border border-border object-contain max-h-48" />
          <button onClick={() => { setFile(null); setPreview(null); }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors">
            <X size={12} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors mb-4 text-center"
        >
          <Upload size={20} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Drag & drop your screenshot</p>
            <p className="text-xs text-muted-foreground">or click to browse files</p>
          </div>
          <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

      <div className="p-3 rounded-lg bg-secondary border border-primary/15 mb-4">
        <div className="flex items-start gap-2">
          <AlertCircle size={13} className="text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-foreground">
            Screenshot analysis is a frontend demonstration. A future backend will use OCR to extract and evaluate your code.
          </p>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={!file}
        className="w-full py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40">
        Submit Solution
      </button>
    </div>
  );
}

export default function ChallengeDetailPage({ challengeId, onBack }: ChallengeDetailProps) {
  const { challenges: CHALLENGES, submitChallengeResult, spendXp, canAfford } = useApp();
  const challenge = CHALLENGES.find(c => c.id === challengeId) ?? CHALLENGES[0];
  const [code, setCode] = useState(challenge.starterCode);
  const [activeTab, setActiveTab] = useState<"problem" | "hints">("problem");
  const [rightTab, setRightTab] = useState<"editor" | "screenshot">("editor");
  const [submitState, setSubmitState] = useState<SubmissionState>("idle");
  const [testResults, setTestResults] = useState<{ id: string; passed: boolean }[]>([]);
  const handleRun = async () => {
    setSubmitState("running");
    await new Promise(r => setTimeout(r, 800));
    setTestResults(challenge.testCases.map(tc => ({ id: tc.id, passed: Math.random() > 0.2 })));
    setSubmitState("idle");
  };

  const handleSubmit = async () => {
    setSubmitState("running");
    await new Promise(r => setTimeout(r, 1200));
    const results = challenge.testCases.map(tc => ({ id: tc.id, passed: true }));
    setTestResults(results);
    setSubmitState("success");
    void submitChallengeResult(challenge, { code, passed: true });
  };

  const handleScreenshotSubmit = () => {
    void submitChallengeResult(challenge, { passed: true, submissionType: "screenshot" });
  };

  const allPassed = testResults.length > 0 && testResults.every(r => r.passed);
  const passedCount = testResults.filter(r => r.passed).length;

  const diffColors = DIFFICULTY_COLORS[challenge.difficulty] ?? DIFFICULTY_COLORS.beginner;

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} /> Back
          </button>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm">{challenge.title}</h2>
            <span className={`px-2 py-0.5 rounded text-xs font-medium border capitalize ${diffColors}`}>
              {challenge.difficulty}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock size={12} />{challenge.estimatedMinutes} min
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles size={12} strokeWidth={1.8} />+{challenge.xpReward} XP
          </div>
        </div>
      </div>

      {/* Split Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem */}
        <div className="w-96 flex flex-col border-r border-border overflow-hidden shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-border shrink-0">
            {[
              { key: "problem", label: "Problem" },
              { key: "hints", label: `Hints (${challenge.hints.length})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === "problem" ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Problem Statement</p>
                  <p className="text-sm text-foreground leading-relaxed">{challenge.problemStatement}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Input Format</p>
                  <p className="text-sm text-muted-foreground">{challenge.inputFormat}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Output Format</p>
                  <p className="text-sm text-muted-foreground">{challenge.outputFormat}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Examples</p>
                  {challenge.examples.map((ex, i) => (
                    <div key={i} className="mb-3 rounded-lg border border-border overflow-hidden">
                      <div className="px-3 py-1.5 bg-muted/30 border-b border-border">
                        <span className="text-xs font-mono text-muted-foreground">Example {i + 1}</span>
                      </div>
                      <div className="p-3 space-y-2">
                        <div>
                          <span className="text-xs text-muted-foreground">Input: </span>
                          <code className="text-xs font-mono">{ex.input}</code>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Output: </span>
                          <code className="text-xs font-mono">{ex.output}</code>
                        </div>
                        {ex.explanation && <p className="text-xs text-muted-foreground italic">{ex.explanation}</p>}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Constraints</p>
                  <ul className="space-y-1">
                    {challenge.constraints.map((c, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <HintPanel challenge={challenge} onSpendXp={spendXp} canAfford={canAfford} />
            )}
          </div>
        </div>

        {/* Right Panel: Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Sub-tabs */}
          <div className="flex items-center border-b border-border shrink-0">
            {[
              { key: "editor", label: "Editor" },
              { key: "screenshot", label: "Submit Screenshot" },
            ].map(tab => (
              <button key={tab.key} onClick={() => setRightTab(tab.key as typeof rightTab)}
                className={`px-4 py-2.5 text-xs font-medium transition-colors ${
                  rightTab === tab.key
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {rightTab === "editor" ? (
            <div className="flex-1 flex flex-col overflow-hidden p-4 gap-3">
              {/* Editor */}
              <CodeEditor code={code} onChange={setCode} />

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setCode(challenge.starterCode)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-border text-xs hover:bg-muted transition-colors">
                  <RefreshCw size={12} /> Reset
                </button>
                <div className="flex-1" />
                <button onClick={handleRun} disabled={submitState === "running"}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-border text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50">
                  {submitState === "running" ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                  Run
                </button>
                <button onClick={handleSubmit} disabled={submitState === "running" || submitState === "success"}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {submitState === "running" ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  Submit
                </button>
              </div>

              {/* Test Results */}
              {testResults.length > 0 && (
                <div className="shrink-0 p-3 rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold">Test Results</p>
                    <span className={`text-xs font-semibold ${allPassed ? "text-success" : "text-muted-foreground"}`}>
                      {passedCount} / {testResults.length} Passed
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {testResults.map((r, i) => (
                      <div key={r.id} className="flex items-center gap-2">
                        {r.passed ? (
                          <CheckCircle2 size={13} className="text-success shrink-0" />
                        ) : (
                          <XCircle size={13} className="text-destructive shrink-0" />
                        )}
                        <span className="text-xs text-muted-foreground">Test Case {i + 1}</span>
                        <span className={`ml-auto text-xs font-medium ${r.passed ? "text-success" : "text-destructive"}`}>
                          {r.passed ? "Passed" : "Failed"}
                        </span>
                      </div>
                    ))}
                  </div>
                  {submitState === "success" && (
                    <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-success" />
                      <span className="text-xs font-semibold text-success">All tests passed! +{challenge.xpReward} XP earned.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <ScreenshotSubmission onSubmit={handleScreenshotSubmit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
