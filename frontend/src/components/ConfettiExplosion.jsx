import { useEffect, useState } from "react";

const PARTICLE_COUNT = 40;
const COLORS = ["#fbbf24", "#f97316", "#ef4444", "#8b5cf6", "#22c55e", "#3b82f6", "#ec4899"];

function randomBetween(a, b) {
  return Math.random() * (b - a) + a;
}

export default function ConfettiExplosion({ active, duration = 2000 }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }
    const newParticles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: randomBetween(10, 90),
      y: randomBetween(-10, 30),
      size: randomBetween(4, 10),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: randomBetween(0, 360),
      dx: randomBetween(-40, 40),
      dy: randomBetween(40, 120),
      delay: randomBetween(0, 0.3),
      shape: Math.random() > 0.5 ? "circle" : "rect",
    }));
    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), duration);
    return () => clearTimeout(timer);
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`confetti-particle confetti-${p.shape}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.shape === "rect" ? p.size * 0.6 : p.size,
            background: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animationDelay: `${p.delay}s`,
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}vh`,
          }}
        />
      ))}
    </div>
  );
}
