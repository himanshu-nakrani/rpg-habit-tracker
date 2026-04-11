const RANKS = [
  { min: 1, title: "Novice", color: "#94a3b8", glow: "rgba(148,163,184,0.3)" },
  { min: 3, title: "Apprentice", color: "#4ade80", glow: "rgba(74,222,128,0.3)" },
  { min: 5, title: "Adventurer", color: "#60a5fa", glow: "rgba(96,165,250,0.3)" },
  { min: 8, title: "Veteran", color: "#a78bfa", glow: "rgba(167,139,250,0.3)" },
  { min: 12, title: "Elite", color: "#f97316", glow: "rgba(249,115,22,0.3)" },
  { min: 18, title: "Champion", color: "#fbbf24", glow: "rgba(251,191,36,0.4)" },
  { min: 25, title: "Hero", color: "#ef4444", glow: "rgba(239,68,68,0.4)" },
  { min: 35, title: "Legend", color: "#ec4899", glow: "rgba(236,72,153,0.4)" },
  { min: 50, title: "Mythic", color: "#f43f5e", glow: "rgba(244,63,94,0.5)" },
];

function getRank(level) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (level >= r.min) rank = r;
  }
  return rank;
}

export default function ClassRank({ level }) {
  const rank = getRank(level);
  const nextRank = RANKS.find((r) => r.min > level);

  return (
    <div className="class-rank" style={{ "--rank-color": rank.color, "--rank-glow": rank.glow }}>
      <span className="rank-title">{rank.title}</span>
      {nextRank && (
        <span className="rank-next">Next: {nextRank.title} (Lv.{nextRank.min})</span>
      )}
    </div>
  );
}
