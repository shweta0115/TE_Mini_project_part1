import React, { useState } from "react";
import { Trophy, BookOpen, Code2, Star, Flame, Sparkles, Zap, Type, Moon, Award, RefreshCw, Target, CheckCircle2, Lock } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Achievement } from "../types";
import "../styles/achievements.css";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  BookOpen, Code2, Trophy, Flame, Zap, Star, Type, Moon, Award, RefreshCw, Target,
};

const CATEGORY_TABS = ["All", "Learning", "Challenges", "Streaks", "Accuracy", "Speed"] as const;
type CategoryTab = typeof CATEGORY_TABS[number];

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const Icon = ICON_MAP[achievement.icon] ?? Trophy;
  const pct = Math.min(Math.round((achievement.progress / achievement.total) * 100), 100);

  return (
    <article className={`achievement-card ${achievement.earned ? "is-earned" : "is-locked"}`}>
      <div className="achievement-card__icon" aria-hidden="true">
        <Icon size={19} strokeWidth={1.8} />
      </div>

      <div className="achievement-card__content">
        <div className="achievement-card__topline">
          <div className="achievement-card__heading">
            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>
          </div>
          <span className="achievement-xp" title={`${achievement.xpReward} experience points`}>
            <Sparkles size={12} strokeWidth={1.8} aria-hidden="true" />
            +{achievement.xpReward} XP
          </span>
        </div>

        <p className="achievement-requirement">{achievement.requirement}</p>

        {achievement.earned ? (
          <div className="achievement-status achievement-status--earned">
            <CheckCircle2 size={14} strokeWidth={2} aria-hidden="true" />
            <span>
              {achievement.earnedAt
                ? `Earned ${new Date(achievement.earnedAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}`
                : "Earned"}
            </span>
          </div>
        ) : (
          <div className="achievement-progress">
            <div className="achievement-progress__meta">
              <span><Lock size={12} aria-hidden="true" /> In progress</span>
              <span>{achievement.progress} / {achievement.total} <b>{pct}%</b></span>
            </div>
            <div
              className="achievement-progress__track"
              role="progressbar"
              aria-label={`${achievement.title} progress`}
              aria-valuemin={0}
              aria-valuemax={achievement.total}
              aria-valuenow={Math.min(achievement.progress, achievement.total)}
            >
              <div className="achievement-progress__fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default function AchievementsPage() {
  const { achievements: ACHIEVEMENTS } = useApp();
  const [tab, setTab] = useState<CategoryTab>("All");

  const filtered = ACHIEVEMENTS.filter(a => {
    if (tab === "All") return true;
    return a.category === tab.toLowerCase();
  });

  const earned = ACHIEVEMENTS.filter(a => a.earned).length;
  const total = ACHIEVEMENTS.length;

  const earnedAchievements = filtered.filter(a => a.earned);
  const inProgressAchievements = filtered.filter(a => !a.earned);
  const progressPercent = total ? Math.round((earned / total) * 100) : 0;

  return (
    <div className="achievements-page">
      <div className="achievements-page__header">
        <div>
          <p className="achievements-eyebrow">Your learning journey</p>
          <h1 className="pq-page-heading">Achievements</h1>
          <p className="achievements-page__intro">A record of the skills, habits, and milestones you’ve built.</p>
        </div>
        <div className="achievement-summary" aria-label={`${earned} of ${total} achievements earned`}>
          <span className="achievement-summary__value">{earned}<span>/{total}</span></span>
          <span className="achievement-summary__label">achievements earned</span>
        </div>
      </div>

      <section className="overall-progress" aria-labelledby="overall-progress-title">
        <div className="overall-progress__top">
          <div className="overall-progress__title">
            <div className="overall-progress__mark"><Trophy size={17} strokeWidth={1.8} /></div>
            <div>
              <h2 id="overall-progress-title">Overall progress</h2>
              <p>{earned} of {total} achievements earned so far.</p>
            </div>
          </div>
          <span className="overall-progress__percent">{progressPercent}%</span>
        </div>
        <div className="overall-progress__track" role="progressbar" aria-label="Overall achievements progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={earned}>
          <div className="overall-progress__fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="overall-progress__footer">
          <span><CheckCircle2 size={13} aria-hidden="true" /> {earned} earned</span>
          <span>{total - earned} remaining</span>
        </div>
      </section>

      <div className="achievement-filters" role="group" aria-label="Filter achievements by category">
        {CATEGORY_TABS.map(t => {
          const count = t === "All" ? total : ACHIEVEMENTS.filter(a => a.category === t.toLowerCase()).length;
          return (
            <button key={t} type="button" aria-pressed={tab === t} onClick={() => setTab(t)}>
              {t}<span>{count}</span>
            </button>
          );
        })}
      </div>

      <section className="achievement-group" aria-labelledby="earned-heading">
        <div className="achievement-group__heading">
          <div className="achievement-group__label">
            <CheckCircle2 size={15} strokeWidth={1.9} aria-hidden="true" />
            <h2 id="earned-heading">Earned</h2>
          </div>
          <span>{earnedAchievements.length}</span>
        </div>
        {earnedAchievements.length > 0 ? (
          <div className="achievement-grid">
            {earnedAchievements.map(a => <AchievementCard key={a.id} achievement={a} />)}
          </div>
        ) : (
          <p className="achievement-empty">No achievements earned in this category yet.</p>
        )}
      </section>

      {inProgressAchievements.length > 0 && (
        <section className="achievement-group achievement-group--in-progress" aria-labelledby="in-progress-heading">
          <div className="achievement-group__heading">
            <div className="achievement-group__label">
              <Lock size={14} strokeWidth={1.9} aria-hidden="true" />
              <h2 id="in-progress-heading">In progress</h2>
            </div>
            <span>{inProgressAchievements.length}</span>
          </div>
          <div className="achievement-grid">
            {inProgressAchievements.map(a => <AchievementCard key={a.id} achievement={a} />)}
          </div>
        </section>
      )}
    </div>
  );
}
