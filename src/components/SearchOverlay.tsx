import { useState, useEffect, useRef } from "react";
import { Search, BookOpen, Code2, Star, X, ArrowRight } from "lucide-react";
import { useApp } from "../context/AppContext";

interface SearchResult {
  id: string;
  type: "topic" | "challenge" | "quiz";
  title: string;
  subtitle: string;
  action: () => void;
}

interface SearchOverlayProps {
  onNavigate: (view: string, id?: string) => void;
}

export default function SearchOverlay({ onNavigate }: SearchOverlayProps) {
  const { searchOpen, closeSearch, topics: TOPICS, challenges: CHALLENGES, quizzes: QUIZZES } = useApp();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
    }
  }, [searchOpen]);

  if (!searchOpen) return null;

  const results: SearchResult[] = query.length < 2 ? [] : [
    ...TOPICS.filter(t => t.title.toLowerCase().includes(query.toLowerCase())).slice(0, 4).map(t => ({
      id: t.id, type: "topic" as const,
      title: t.title, subtitle: `${t.category} · ${t.estimatedMinutes} min · +${t.xpReward} XP`,
      action: () => { closeSearch(); onNavigate("topic", t.id); },
    })),
    ...CHALLENGES.filter(c => c.title.toLowerCase().includes(query.toLowerCase())).slice(0, 4).map(c => ({
      id: c.id, type: "challenge" as const,
      title: c.title, subtitle: `${c.difficulty} · +${c.xpReward} XP`,
      action: () => { closeSearch(); onNavigate("challenge-detail", c.id); },
    })),
    ...QUIZZES.filter(q => q.topicTitle.toLowerCase().includes(query.toLowerCase())).slice(0, 2).map(q => ({
      id: q.id, type: "quiz" as const,
      title: `${q.topicTitle} Quiz`, subtitle: `${q.difficulty} · ${q.questions.length} questions`,
      action: () => { closeSearch(); onNavigate("quiz", q.topicId); },
    })),
  ];

  const TYPE_ICONS = {
    topic: BookOpen,
    challenge: Code2,
    quiz: Star,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={closeSearch} />
      <div className="relative w-full max-w-lg bg-card rounded-xl border border-border shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search topics, lessons, challenges..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <div className="flex items-center gap-2">
            <kbd className="text-xs px-1.5 py-0.5 rounded border border-border font-mono text-muted-foreground">Esc</kbd>
            <button onClick={closeSearch} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {query.length < 2 ? (
            <div className="py-8 text-center">
              <Search size={24} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Type to search topics, challenges, and quizzes</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
            </div>
          ) : (
            <ul>
              {results.map(r => {
                const Icon = TYPE_ICONS[r.type];
                return (
                  <li key={r.id}>
                    <button onClick={r.action}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors group">
                      <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Icon size={13} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium truncate">{r.title}</p>
                        <p className="text-xs text-muted-foreground truncate capitalize">{r.subtitle}</p>
                      </div>
                      <ArrowRight size={13} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><kbd className="px-1 py-0.5 rounded border border-border font-mono">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1.5"><kbd className="px-1 py-0.5 rounded border border-border font-mono">↵</kbd> select</span>
          <span className="flex items-center gap-1.5"><kbd className="px-1 py-0.5 rounded border border-border font-mono">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
