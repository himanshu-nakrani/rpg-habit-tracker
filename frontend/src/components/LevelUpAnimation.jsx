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

      <style>{`
        .levelup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .levelup-content {
          text-align: center;
          position: relative;
        }
        .levelup-particles {
          position: absolute;
          inset: -100px;
        }
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #fbbf24;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          animation: particle-fly 1.5s ease-out infinite;
          animation-delay: calc(var(--i) * 0.1s);
          box-shadow: 0 0 8px #f59e0b;
        }
        @keyframes particle-fly {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% {
            transform: translate(
              calc(-50% + cos(var(--i) * 30deg) * 120px),
              calc(-50% + sin(var(--i) * 30deg) * 120px)
            ) scale(0);
            opacity: 0;
          }
        }
        .levelup-text {
          font-size: 2.5rem;
          font-weight: 900;
          color: #fbbf24;
          text-shadow: 0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.3);
          animation: level-pulse 0.5s ease;
          letter-spacing: 6px;
        }
        @keyframes level-pulse {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .levelup-number {
          font-size: 5rem;
          font-weight: 900;
          color: #e2e8f0;
          text-shadow: 0 0 40px rgba(245, 158, 11, 0.5);
          animation: number-pop 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.3s both;
        }
        @keyframes number-pop {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .levelup-subtitle {
          font-size: 0.9rem;
          color: #94a3b8;
          margin-top: 8px;
          animation: fadeIn 0.5s ease 0.6s both;
        }
      `}</style>
    </div>
  );
}
