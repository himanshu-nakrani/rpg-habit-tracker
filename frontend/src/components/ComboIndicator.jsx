import { Zap } from "lucide-react";

export default function ComboIndicator({ combo }) {
  if (!combo || combo <= 1) return null;

  const intensity = Math.min(combo, 6);
  const glowColor = intensity >= 5 ? "#f97316" : intensity >= 3 ? "#fbbf24" : "#8b5cf6";

  return (
    <div className="combo-indicator" style={{ "--glow": glowColor }}>
      <div className="combo-badge">
        <Zap size={16} className="combo-bolt" />
        <span className="combo-count">{combo}x</span>
        <span className="combo-label">COMBO</span>
      </div>
      <div className="combo-multiplier">+{((combo - 1) * 15)}% XP Bonus</div>
    </div>
  );
}
