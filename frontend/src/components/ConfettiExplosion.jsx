const PARTICLE_COUNT = 40;
const COLORS = ["#fbbf24", "#f97316", "#ef4444", "#8b5cf6", "#22c55e", "#3b82f6", "#ec4899"];

function pseudoRandom(seed) {
  const value = Math.sin(seed * 9999.91) * 43758.5453123;
  return value - Math.floor(value);
}

export default function ConfettiExplosion({ active, duration = 2000 }) {
  const particles = active
    ? Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const seed = i + duration / 100;
        const x = 10 + pseudoRandom(seed + 1) * 80;
        const y = -10 + pseudoRandom(seed + 2) * 40;
        const size = 4 + pseudoRandom(seed + 3) * 6;
        const color = COLORS[Math.floor(pseudoRandom(seed + 4) * COLORS.length)];
        const rotation = pseudoRandom(seed + 5) * 360;
        const dx = -40 + pseudoRandom(seed + 6) * 80;
        const dy = 40 + pseudoRandom(seed + 7) * 80;
        const delay = pseudoRandom(seed + 8) * 0.3;
        const shape = pseudoRandom(seed + 9) > 0.5 ? "circle" : "rect";

        return {
          id: i,
          x,
          y,
          size,
          color,
          rotation,
          dx,
          dy,
          delay,
          shape,
        };
      })
    : [];

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
            animationDuration: `${duration}ms`,
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}vh`,
          }}
        />
      ))}
    </div>
  );
}
