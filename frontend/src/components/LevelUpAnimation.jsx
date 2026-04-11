import { useEffect, useState } from "react";

export default function LevelUpAnimation({ level, show, onComplete }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="levelup-overlay">
      <div className="levelup-content">
        <div className="levelup-particles">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="particle" style={{ "--i": i }} />
          ))}
        </div>
        <div className="levelup-text">LEVEL UP!</div>
        <div className="levelup-number">LV. {level}</div>
        <div className="levelup-subtitle">Your power grows stronger</div>
      </div>

    </div>
  );
}
