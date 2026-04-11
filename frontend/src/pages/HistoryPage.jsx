import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import api from "../api/client";
import { ArrowLeft, Calendar, Flame, Star } from "lucide-react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getIntensity(count) {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

function generateCalendarData(historyMap, days) {
  const cells = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const entry = historyMap[key] || { completions: 0, xp_earned: 0 };
    cells.push({ date: key, ...entry, day: d.getDay(), month: d.getMonth() });
  }
  return cells;
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    api.get("/progress/history?days=90").then((res) => {
      setHistory(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  const historyMap = {};
  history.forEach((h) => { historyMap[h.date] = h; });

  const cells = generateCalendarData(historyMap, 90);
  const totalCompletions = history.reduce((s, h) => s + h.completions, 0);
  const totalXp = history.reduce((s, h) => s + h.xp_earned, 0);
  const activeDays = history.length;

  // Group cells into weeks (columns)
  const weeks = [];
  let currentWeek = new Array(7).fill(null);
  cells.forEach((cell, i) => {
    if (i === 0) {
      // Pad the first week
      currentWeek[cell.day] = cell;
    } else {
      currentWeek[cell.day] = cell;
    }
    if (cell.day === 6 || i === cells.length - 1) {
      weeks.push(currentWeek);
      currentWeek = new Array(7).fill(null);
    }
  });

  return (
    <div className="history-page">
      <div className="history-card">
        <button className="history-back" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
          Back to Quests
        </button>

        <h1 className="history-title">
          <Calendar size={24} />
          Quest History
        </h1>

        {/* Stats Summary */}
        <div className="history-stats">
          <div className="history-stat">
            <span className="history-stat-value">{activeDays}</span>
            <span className="history-stat-label">Active Days</span>
          </div>
          <div className="history-stat">
            <Flame size={18} className="text-orange-400" />
            <span className="history-stat-value">{totalCompletions}</span>
            <span className="history-stat-label">Completions</span>
          </div>
          <div className="history-stat">
            <Star size={18} className="text-amber-400" />
            <span className="history-stat-value">{totalXp}</span>
            <span className="history-stat-label">XP Earned</span>
          </div>
        </div>

        {/* Heatmap */}
        <div className="heatmap-container">
          <div className="heatmap-day-labels">
            {DAYS.map((d, i) => (
              <span key={d} className="heatmap-day-label">
                {i % 2 === 1 ? d : ""}
              </span>
            ))}
          </div>
          <div className="heatmap-grid">
            {weeks.map((week, wi) => (
              <div key={wi} className="heatmap-week">
                {week.map((cell, di) => (
                  <div
                    key={di}
                    className={`heatmap-cell intensity-${cell ? getIntensity(cell.completions) : 0}`}
                    onMouseEnter={() => cell && setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div className="heatmap-tooltip">
            <strong>{hoveredCell.date}</strong>: {hoveredCell.completions} quest{hoveredCell.completions !== 1 ? "s" : ""}, +{hoveredCell.xp_earned} XP
          </div>
        )}

        {/* Legend */}
        <div className="heatmap-legend">
          <span className="heatmap-legend-label">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div key={level} className={`heatmap-cell-sm intensity-${level}`} />
          ))}
          <span className="heatmap-legend-label">More</span>
        </div>

        {loading && <p className="history-loading">Loading history...</p>}
      </div>

    </div>
  );
}
