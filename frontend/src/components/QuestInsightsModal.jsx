import { useEffect, useState } from "react";
import api from "../api/client";
import { Flame, Star, Target, TrendingUp, Trophy, Zap, BarChart3, Heart, Brain, Briefcase, Users, Palette, Sword } from "lucide-react";
import ModalShell from "./ModalShell";

const SKILL_ICONS = { health: Heart, mind: Brain, career: Briefcase, social: Users, creativity: Palette };

function PowerRing({ score }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22c55e" : score >= 50 ? "#fbbf24" : score >= 25 ? "#f97316" : "#ef4444";

  return (
    <div className="power-ring-container">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#1a1033" strokeWidth="6" />
        <circle
          cx="48" cy="48" r={radius} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 48 48)"
          style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="power-ring-value" style={{ color }}>
        <span className="power-ring-number">{score}</span>
        <span className="power-ring-label">Power</span>
      </div>
    </div>
  );
}

export default function QuestInsightsModal({ habitId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/habits/${habitId}/insights`)
      .then((res) => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [habitId]);

  if (loading) {
    return (
      <ModalShell
        className="insights-card"
        closeLabel="Close quest insights"
        description="Quest activity and completion trends."
        onClose={onClose}
        title="Quest Insights"
      >
          <div className="insights-loading">
            <div className="insights-spinner" />
            <span>Analyzing quest data…</span>
          </div>
      </ModalShell>
    );
  }

  if (!data) return null;

  return (
    <ModalShell
      className="insights-card"
      closeLabel="Close quest insights"
      description="Quest activity and completion trends."
      onClose={onClose}
      title={null}
    >
        <div className="insights-header">
          <span className="insights-skill-icon">{(() => { const Icon = SKILL_ICONS[data.skill] || Sword; return <Icon size={24} />; })()}</span>
          <div>
            <h2 className="insights-title">{data.title}</h2>
            <span className="insights-subtitle">Quest Level Insights</span>
          </div>
        </div>

        {/* Power Score + Key Stats */}
        <div className="insights-top-row">
          <PowerRing score={data.power_score} />
          <div className="insights-key-stats">
            <div className="istat">
              <Target size={16} className="istat-icon" style={{ color: "#8b5cf6" }} />
              <div className="istat-data">
                <span className="istat-value">{data.total_completions}</span>
                <span className="istat-label">Total Completions</span>
              </div>
            </div>
            <div className="istat">
              <Star size={16} className="istat-icon" style={{ color: "#fbbf24" }} />
              <div className="istat-data">
                <span className="istat-value">{data.total_xp.toLocaleString()}</span>
                <span className="istat-label">Total XP Earned</span>
              </div>
            </div>
            <div className="istat">
              <Flame size={16} className="istat-icon" style={{ color: "#f97316" }} />
              <div className="istat-data">
                <span className="istat-value">{data.current_streak}</span>
                <span className="istat-label">Current Streak</span>
              </div>
            </div>
            <div className="istat">
              <Trophy size={16} className="istat-icon" style={{ color: "#22c55e" }} />
              <div className="istat-data">
                <span className="istat-value">{data.best_streak}</span>
                <span className="istat-label">Best Streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Completion Rates */}
        <div className="insights-rates">
          <div className="rate-card">
            <div className="rate-header">
              <TrendingUp size={14} />
              <span>Last 7 Days</span>
            </div>
            <div className="rate-bar-track">
              <div className="rate-bar-fill" style={{ width: `${Math.min(data.rate_7d, 100)}%`, background: rateColor(data.rate_7d) }} />
            </div>
            <span className="rate-value" style={{ color: rateColor(data.rate_7d) }}>{data.rate_7d}%</span>
          </div>
          <div className="rate-card">
            <div className="rate-header">
              <BarChart3 size={14} />
              <span>Last 30 Days</span>
            </div>
            <div className="rate-bar-track">
              <div className="rate-bar-fill" style={{ width: `${Math.min(data.rate_30d, 100)}%`, background: rateColor(data.rate_30d) }} />
            </div>
            <span className="rate-value" style={{ color: rateColor(data.rate_30d) }}>{data.rate_30d}%</span>
          </div>
        </div>

        {/* 14-Day Activity */}
        <div className="insights-activity">
          <span className="insights-section-title">Last 14 Days</span>
          <div className="activity-grid">
            {data.last_14_days.map((d) => (
              <div
                aria-label={`${d.date}: ${d.completed ? `Completed for ${d.xp} XP` : "Missed"}`}
                key={d.date}
                className="activity-day"
                title={`${d.date}: ${d.completed ? `+${d.xp} XP` : "Missed"}`}
              >
                <div className={`activity-dot ${d.completed ? "activity-done" : "activity-miss"}`}>
                  {d.completed && <Zap size={10} />}
                </div>
                <span className="activity-label">{d.day[0]}</span>
              </div>
            ))}
          </div>
        </div>
    </ModalShell>
  );
}

function rateColor(rate) {
  if (rate >= 80) return "#22c55e";
  if (rate >= 50) return "#fbbf24";
  if (rate >= 25) return "#f97316";
  return "#ef4444";
}
