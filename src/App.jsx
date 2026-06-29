import { useState, useEffect, useRef, useCallback } from "react";
import music from "./assets/music.mp3";
// ─── Utility: random range ───────────────────────────────────────────────────
const rnd = (min, max) => Math.random() * (max - min) + min;
const rndInt = (min, max) => Math.floor(rnd(min, max + 1));

// ─── Particle canvas hook ────────────────────────────────────────────────────
function useParticleCanvas(canvasRef, active, config = {}) {
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const defaults = {
      count: 120,
      colors: ["#f4a0c0", "#c77dff", "#ffd700", "#e0aaff", "#fff", "#ffb3c6"],
      minSize: 1,
      maxSize: 3,
      speed: 0.3,
      twinkle: true,
      ...config,
    };

    for (let i = 0; i < defaults.count; i++) {
      particles.push({
        x: rnd(0, canvas.width),
        y: rnd(0, canvas.height),
        r: rnd(defaults.minSize, defaults.maxSize),
        color: defaults.colors[rndInt(0, defaults.colors.length - 1)],
        alpha: rnd(0.2, 1),
        da: rnd(-0.01, 0.01),
        vx: rnd(-defaults.speed, defaults.speed),
        vy: rnd(-defaults.speed, defaults.speed),
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        if (defaults.twinkle) p.alpha += p.da;
        if (p.alpha > 1 || p.alpha < 0.1) p.da *= -1;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [active]);
}

// ─── Mouse trail sparkles ────────────────────────────────────────────────────
function MouseTrail() {
  const [sparks, setSparks] = useState([]);
  useEffect(() => {
    const handler = (e) => {
      const id = Date.now() + Math.random();
      const spark = {
        id,
        x: e.clientX,
        y: e.clientY,
        color: ["#ffd700", "#ff69b4", "#c77dff", "#fff", "#ffb3c6"][rndInt(0, 4)],
      };
      setSparks((s) => [...s.slice(-18), spark]);
      setTimeout(() => setSparks((s) => s.filter((p) => p.id !== id)), 700);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return (
    <div style={{ pointerEvents: "none", position: "fixed", inset: 0, zIndex: 9999 }}>
      {sparks.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: s.x - 6,
            top: s.y - 6,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: s.color,
            boxShadow: `0 0 12px ${s.color}`,
            animation: "sparkFade 0.7s ease-out forwards",
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
}

// ─── Floating hearts background ──────────────────────────────────────────────
function FloatingHearts({ count = 18 }) {
  const hearts = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rnd(0, 100),
      delay: rnd(0, 8),
      dur: rnd(6, 14),
      size: rnd(14, 32),
      color: ["#ff69b4", "#ffd700", "#c77dff", "#ffb3c6", "#fff"][rndInt(0, 4)],
    }))
  ).current;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {hearts.map((h) => (
        <div
          key={h.id}
          style={{
            position: "absolute",
            left: `${h.left}%`,
            bottom: "-60px",
            fontSize: h.size,
            animation: `floatUp ${h.dur}s ${h.delay}s linear infinite`,
            opacity: 0.55,
            filter: `drop-shadow(0 0 8px ${h.color})`,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
}

// ─── Floating petals ─────────────────────────────────────────────────────────
function RosePetals({ count = 14 }) {
  const petals = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rnd(0, 100),
      delay: rnd(0, 10),
      dur: rnd(8, 16),
    }))
  ).current;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {petals.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-40px",
            fontSize: rnd(14, 24),
            animation: `petalFall ${p.dur}s ${p.delay}s linear infinite`,
            opacity: 0.6,
          }}
        >
          🌸
        </div>
      ))}
    </div>
  );
}

// ─── Fireflies ───────────────────────────────────────────────────────────────
function Fireflies({ count = 20 }) {
  const flies = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: rnd(5, 95),
      y: rnd(10, 90),
      delay: rnd(0, 6),
      dur: rnd(3, 7),
    }))
  ).current;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2, overflow: "hidden" }}>
      {flies.map((f) => (
        <div
          key={f.id}
          style={{
            position: "absolute",
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#fffacd",
            boxShadow: "0 0 10px 4px #fffacd",
            animation: `fireflyGlow ${f.dur}s ${f.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Confetti burst ──────────────────────────────────────────────────────────
function Confetti({ active }) {
  const pieces = useRef(
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: rnd(0, 100),
      color: ["#ffd700", "#ff69b4", "#c77dff", "#00cfff", "#fff", "#ff4500"][rndInt(0, 5)],
      delay: rnd(0, 1.5),
      dur: rnd(2.5, 5),
      size: rnd(6, 14),
      shape: rndInt(0, 1) ? "50%" : "0%",
    }))
  ).current;
  if (!active) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100, overflow: "hidden" }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape,
            animation: `confettiFall ${p.dur}s ${p.delay}s ease-in forwards`,
            boxShadow: `0 0 6px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Typewriter ──────────────────────────────────────────────────────────────
function Typewriter({ lines, onDone, speed = 38 }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [displayed, setDisplayed] = useState([]);
  const [pausing, setPausing] = useState(false);

  useEffect(() => {
    if (lineIdx >= lines.length) {
      onDone && onDone();
      return;
    }
    if (pausing) {
      const t = setTimeout(() => {
        setPausing(false);
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      }, 1400);
      return () => clearTimeout(t);
    }
    if (charIdx <= lines[lineIdx].length) {
      const t = setTimeout(() => {
        setDisplayed((d) => {
          const arr = [...d];
          arr[lineIdx] = lines[lineIdx].slice(0, charIdx);
          return arr;
        });
        setCharIdx((c) => c + 1);
      }, speed);
      return () => clearTimeout(t);
    } else {
      setPausing(true);
    }
  }, [lineIdx, charIdx, pausing, lines]);

  return (
    <div style={{ textAlign: "center" }}>
      {displayed.map((line, i) => (
        <p
          key={i}
          style={{
            fontSize: "clamp(1.1rem, 2.8vw, 1.55rem)",
            color: "#f8d7e8",
            margin: "0.45em 0",
            fontFamily: "'Georgia', serif",
            fontStyle: "italic",
            letterSpacing: "0.04em",
            textShadow: "0 0 18px #ff69b480",
            opacity: i < lineIdx ? 0.7 : 1,
            transition: "opacity 0.4s",
          }}
        >
          {line}
          {i === lineIdx && charIdx <= lines[lineIdx].length && (
            <span style={{ borderRight: "2px solid #ffd700", marginLeft: 2, animation: "blink 0.7s infinite" }} />
          )}
        </p>
      ))}
    </div>
  );
}

// ─── Star text canvas ────────────────────────────────────────────────────────
function StarText({ text, show }) {
  const canvasRef = useRef();
  useEffect(() => {
    if (!show || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = Math.min(window.innerWidth * 0.95, 820);
    canvas.height = 180;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${Math.min(canvas.width / text.length * 1.45, 110)}px 'Georgia', serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const stars = [];

    for (let y = 0; y < canvas.height; y += 5) {
      for (let x = 0; x < canvas.width; x += 5) {
        const idx = (y * canvas.width + x) * 4;
        if (data[idx + 3] > 30) {
          stars.push({ tx: x, ty: y, x: rnd(0, canvas.width), y: rnd(0, canvas.height), r: rnd(1, 3.5) });
        }
      }
    }

    let frame = 0;
    const totalFrames = 90;
    let animId;
    const colors = ["#ffd700", "#ff69b4", "#c77dff", "#fff", "#ffb3c6"];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Math.min(frame / totalFrames, 1);
      const ease = 1 - Math.pow(1 - t, 3);

      stars.forEach((s, i) => {
        const cx = s.x + (s.tx - s.x) * ease;
        const cy = s.y + (s.ty - s.y) * ease;
        ctx.beginPath();
        ctx.arc(cx, cy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = colors[i % colors.length];
        ctx.shadowColor = colors[i % colors.length];
        ctx.shadowBlur = 10;
        ctx.fill();
      });

      if (frame < totalFrames + 20) {
        frame++;
        animId = requestAnimationFrame(animate);
      }
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, [show, text]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", margin: "0 auto", maxWidth: "100%" }}
    />
  );
}

// ─── Constellation world ─────────────────────────────────────────────────────
const TRAITS = [
  "Kindness", "Happiness", "Courage", "Strength", "Dreams",
  "Confidence", "Hope", "Success", "Joy", "Positivity",
  "Friendship", "Beauty", "Grace", "Wisdom", "Love", "Magic",
  "Freedom", "Growth",
];

function ConstellationStar({ x, y, trait, size }) {
  const [popped, setPopped] = useState(false);
  return (
    <div
      onClick={() => setPopped(true)}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        cursor: "pointer",
        zIndex: 5,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "radial-gradient(circle, #fff 30%, #ffd700 70%, transparent)",
          boxShadow: "0 0 14px 6px #ffd70088",
          animation: `twinkle ${rnd(1.5, 3.5)}s ease-in-out infinite alternate`,
          transition: "transform 0.2s",
        }}
      />
      {popped && (
        <div
          style={{
            position: "absolute",
            top: "-44px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #2d0050cc, #1a001aee)",
            border: "1px solid #ffd700",
            borderRadius: 12,
            padding: "6px 14px",
            color: "#ffd700",
            fontSize: "0.8rem",
            fontFamily: "'Georgia', serif",
            whiteSpace: "nowrap",
            boxShadow: "0 0 20px #ffd70066",
            zIndex: 20,
            animation: "popIn 0.3s cubic-bezier(.17,.67,.35,1.3)",
          }}
        >
          ✨ {trait}
        </div>
      )}
    </div>
  );
}

// ─── Flip card ───────────────────────────────────────────────────────────────
function FlipCard({ front, back, color = "#c77dff" }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      style={{
        width: 160,
        height: 200,
        perspective: 800,
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.7s cubic-bezier(.4,2,.55,.44)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            borderRadius: 18,
            background: `linear-gradient(135deg, ${color}33, #0d002299)`,
            border: `1px solid ${color}88`,
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 32px ${color}44`,
            padding: 16,
            textAlign: "center",
          }}
        >
          {front}
        </div>
        {/* Back */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 18,
            background: `linear-gradient(135deg, #ffd70022, ${color}44)`,
            border: `1px solid #ffd70099`,
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 32px #ffd70044`,
            padding: 16,
            textAlign: "center",
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}

// ─── Shooting star canvas ─────────────────────────────────────────────────────
function ShootingStarCanvas({ onClick }) {
  const canvasRef = useRef();
  const meteors = useRef([]);
  const sparkles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const addMeteor = (x, y) => {
      for (let i = 0; i < 3; i++) {
        meteors.current.push({
          x: x ?? rnd(0, canvas.width),
          y: y ?? rnd(0, canvas.height / 3),
          vx: rnd(6, 14),
          vy: rnd(3, 7),
          life: 1,
          len: rnd(80, 160),
        });
      }
      for (let i = 0; i < 14; i++) {
        sparkles.current.push({
          x: x ?? rnd(0, canvas.width),
          y: y ?? rnd(canvas.height / 3, canvas.height * 0.7),
          vx: rnd(-3, 3),
          vy: rnd(-4, -1),
          life: 1,
          r: rnd(2, 5),
          color: ["#ffd700", "#ff69b4", "#c77dff", "#fff"][rndInt(0, 3)],
        });
      }
    };

    const autoInterval = setInterval(() => addMeteor(), 1800);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      meteors.current.forEach((m) => {
        ctx.save();
        ctx.globalAlpha = m.life;
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.len, m.y - m.len / 2);
        grad.addColorStop(0, "#fff");
        grad.addColorStop(1, "transparent");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.len, m.y - m.len / 2);
        ctx.stroke();
        ctx.restore();
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 0.025;
      });
      meteors.current = meteors.current.filter((m) => m.life > 0);

      sparkles.current.forEach((s) => {
        ctx.save();
        ctx.globalAlpha = s.life;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.018;
      });
      sparkles.current = sparkles.current.filter((s) => s.life > 0);

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(autoInterval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    meteors.current.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      vx: rnd(6, 14) * (Math.random() > 0.5 ? 1 : -1),
      vy: rnd(3, 7),
      life: 1,
      len: rnd(100, 200),
    });
    for (let i = 0; i < 22; i++) {
      sparkles.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        vx: rnd(-5, 5),
        vy: rnd(-6, -1),
        life: 1,
        r: rnd(2, 6),
        color: ["#ffd700", "#ff69b4", "#c77dff", "#fff", "#00cfff"][rndInt(0, 4)],
      });
    }
    onClick && onClick();
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      style={{ position: "absolute", inset: 0, cursor: "crosshair", zIndex: 3 }}
    />
  );
}

// ─── Candle ──────────────────────────────────────────────────────────────────
const CANDLE_WISHES = [
  "May you always be loved",
  "May joy never leave you",
  "May your dreams soar higher than ever",
  "May you find your true calling",
  "May laughter fill every single day",
  "May success be your loyal companion",
  "May kindness always return to you",
  "May beauty surround you always",
  "May your heart stay warm and brave",
  "May every wish come true",
  "May hope always light your way",
  "May your smile never fade",
  "May genuine friendship surround you",
  "May courage guide your every path",
  "May happiness be your destiny",
  "May your 18th year open every door",
  "May freedom bring you new adventures",
  "May this chapter be your most magical ✨",
];

function Candle({ index, lit, onLight, wish }) {
  return (
    <div
      onClick={onLight}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: lit ? "default" : "pointer",
        gap: 2,
        position: "relative",
      }}
    >
      {lit && (
        <div style={{ fontSize: "1.3rem", animation: "flicker 0.15s infinite alternate" }}>🔥</div>
      )}
      {!lit && (
        <div style={{ fontSize: "1rem", color: "#888" }}>🕯</div>
      )}
      <div
        style={{
          width: 10,
          height: 44,
          borderRadius: "4px 4px 2px 2px",
          background: lit
            ? "linear-gradient(180deg, #fff5c3, #ffd700, #ff8c00)"
            : "linear-gradient(180deg, #f8d0a0, #d4956a)",
          boxShadow: lit ? "0 0 18px 6px #ffd70088" : "none",
          transition: "all 0.4s",
        }}
      />
      {lit && wish && (
        <div
          style={{
            position: "absolute",
            top: "-54px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1a003388",
            border: "1px solid #ffd700",
            borderRadius: 10,
            padding: "5px 10px",
            color: "#ffd700",
            fontSize: "0.65rem",
            whiteSpace: "nowrap",
            maxWidth: 130,
            textAlign: "center",
            zIndex: 10,
            boxShadow: "0 0 14px #ffd70055",
            animation: "popIn 0.4s ease-out",
          }}
        >
          {wish}
        </div>
      )}
      <div style={{ color: "#ffb3c6", fontSize: "0.6rem" }}>{index + 1}</div>
    </div>
  );
}

// ─── Music player ─────────────────────────────────────────────────────────────
function MusicPlayer() {
  const audioRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(0.5);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = vol;
    a.loop = true;
    const upd = () => {
      if (a.duration) setProgress((a.currentTime / a.duration) * 100);
    };
    a.addEventListener("timeupdate", upd);
    return () => a.removeEventListener("timeupdate", upd);
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = vol;
  }, [vol]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().catch(() => {}); setPlaying(true); }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
        background: "linear-gradient(135deg, #1a003388, #2d005088)",
        backdropFilter: "blur(16px)",
        border: "1px solid #c77dff66",
        borderRadius: 20,
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 8px 32px #c77dff44",
        minWidth: 200,
      }}
    >
      <audio ref={audioRef} src={music} />
      <button
        onClick={toggle}
        style={{
          background: "linear-gradient(135deg, #c77dff, #ff69b4)",
          border: "none",
          borderRadius: "50%",
          width: 38,
          height: 38,
          cursor: "pointer",
          fontSize: "1.1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 12px #c77dff88",
          flexShrink: 0,
        }}
      >
        {playing ? "⏸" : "▶"}
      </button>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
        <div
          style={{
            height: 4,
            background: "#ffffff22",
            borderRadius: 2,
            cursor: "pointer",
            overflow: "hidden",
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            const a = audioRef.current;
            if (a && a.duration) a.currentTime = pct * a.duration;
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #c77dff, #ffd700)",
              borderRadius: 2,
              transition: "width 0.5s linear",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#c77dff", fontSize: "0.65rem" }}>🎵</span>
          <input
            type="range" min={0} max={1} step={0.01} value={vol}
            onChange={(e) => setVol(parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "#c77dff", cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Glassy section wrapper ───────────────────────────────────────────────────
function GlassPanel({ children, style = {}, glow = "#c77dff" }) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${glow}18, #0d002299)`,
        backdropFilter: "blur(18px)",
        border: `1px solid ${glow}55`,
        borderRadius: 28,
        padding: "clamp(24px, 5vw, 52px)",
        boxShadow: `0 12px 60px ${glow}33, inset 0 1px 0 ${glow}22`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionTitle({ children, color = "#ffd700" }) {
  return (
    <h2
      style={{
        fontFamily: "'Georgia', serif",
        fontSize: "clamp(1.5rem, 4vw, 2.6rem)",
        color,
        textAlign: "center",
        textShadow: `0 0 30px ${color}88`,
        marginBottom: "1.5rem",
        letterSpacing: "0.06em",
      }}
    >
      {children}
    </h2>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════
export default function App() {
  const [world, setWorld] = useState("loading");
  const [loadPct, setLoadPct] = useState(0);
  const [w1Phase, setW1Phase] = useState(0);
  const [w2Phase, setW2Phase] = useState(0);
  const [litCandles, setLitCandles] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wishBoxes, setWishBoxes] = useState({});
  const [leafWishes, setLeafWishes] = useState({});
  const [heartMsgs, setHeartMsgs] = useState({});
  const [showLetter, setShowLetter] = useState(false);
  const [showDoor, setShowDoor] = useState(false);
  const [endPhase, setEndPhase] = useState(0);
  const bgCanvasRef = useRef();

  const bgActive = world !== "loading";
  useParticleCanvas(bgCanvasRef, bgActive, {
    count: 160,
    colors: ["#fff", "#ffd700aa", "#c77dffaa", "#ff69b455", "#e0aaffaa"],
    minSize: 0.8,
    maxSize: 2.2,
    speed: 0.15,
  });

  // ── loading counter
  useEffect(() => {
    if (world !== "loading") return;
    const t = setInterval(() => {
      setLoadPct((p) => {
        if (p >= 100) {
          clearInterval(t);
          setTimeout(() => setWorld("w1"), 600);
          return 100;
        }
        return p + rnd(0.8, 2.2);
      });
    }, 55);
    return () => clearInterval(t);
  }, [world]);

  // ── world 1 phases
  const onW1TypeDone = () => setTimeout(() => setW1Phase(1), 400);
  useEffect(() => {
    if (w1Phase === 1) setTimeout(() => setW1Phase(2), 2800);
  }, [w1Phase]);

  // ── world 2 phase
  const onW2TypeDone = () => setTimeout(() => setW2Phase(1), 600);
  useEffect(() => {
    if (w2Phase === 1) setTimeout(() => setWorld("w3"), 2000);
  }, [w2Phase]);

  // ── candles — 18 total now
  const lightCandle = (i) => {
    if (litCandles.includes(i)) return;
    const next = [...litCandles, i];
    setLitCandles(next);
    if (next.length === 18) {
      setTimeout(() => setShowConfetti(true), 200);
      setTimeout(() => setWorld("w13"), 4000);
    }
  };

  // ── end sequence
  useEffect(() => {
    if (world !== "wEnd") return;
    const msgs = 9;
    let i = 0;
    const t = setInterval(() => {
      setEndPhase((p) => p + 1);
      i++;
      if (i >= msgs) clearInterval(t);
    }, 2200);
    return () => clearInterval(t);
  }, [world]);

  const nav = (w) => setWorld(w);

  const WORLDS = ["w1","w2","w3","w4","w5","w6","w7","w8","w9","w10","w11","w12","w13","w14","wEnd"];
  const worldIdx = WORLDS.indexOf(world);

  // ─── Gift box data
  const GIFTS = [
    { emoji: "🎁", title: "A Wish",    msg: "May every morning bring you reasons to smile." },
    { emoji: "💫", title: "A Secret",  msg: "You are more magical than you know." },
    { emoji: "🌟", title: "A Truth",   msg: "The world is brighter because you're in it." },
    { emoji: "🎀", title: "A Promise", msg: "Good things are coming your way — always." },
    { emoji: "🌸", title: "A Blessing",msg: "May love surround you every single day." },
    { emoji: "✨", title: "A Surprise",msg: "You deserve every beautiful thing in this universe." },
  ];

  // ─── Leaf wishes — 18 leaves
  const LEAF_WISHES = [
    "May happiness always find you",
    "May your dreams become reality",
    "May success walk beside you",
    "May your smile never fade",
    "May your future shine brilliantly",
    "May your heart always remain strong",
    "May love fill your days",
    "May adventure find you",
    "May peace surround you",
    "May courage never leave you",
    "May laughter light your days",
    "May grace follow your steps",
    "May freedom open new doors",
    "May wisdom guide your choices",
    "May confidence carry you forward",
    "May your 18th year be extraordinary",
    "May every dream find its wings",
    "May this new chapter be legendary ✨",
  ];

  // ─── Heart messages
  const HEART_MSGS = [
    "You are appreciated ❤️",
    "You are amazing 🌟",
    "You are stronger than you know 💪",
    "You deserve happiness 🌸",
    "You deserve beautiful memories ✨",
    "You bring light wherever you go 💫",
    "You make life more beautiful 🌺",
    "You are irreplaceable 👑",
    "You are a gift to everyone who knows you 🎁",
    "You radiate joy 🌟",
    "You are endlessly inspiring 💖",
    "You are one in a billion ⭐",
  ];

  // ─── Reasons — 18 now
  const REASONS = [
    ["Beautiful Smile",    "Your smile can light up any room ✨"],
    ["Kind Heart",         "Your kindness changes lives 💖"],
    ["Strong Mind",        "You think, dream, and conquer 🌟"],
    ["Dream Chaser",       "You never stop reaching for the stars ⭐"],
    ["Positive Soul",      "Your positivity is contagious 🌸"],
    ["Caring Nature",      "You care for others like no one else 💛"],
    ["Brave Spirit",       "You face every storm with grace 🦋"],
    ["Wonderful Friend",   "You are the friend everyone wishes for 🌺"],
    ["Radiant Beauty",     "Inside and out — you shine 💎"],
    ["Creative Mind",      "Your imagination knows no limits 🎨"],
    ["Gentle Strength",    "Soft yet unbreakable 🌿"],
    ["Laughter Maker",     "You fill rooms with joy 😊"],
    ["Loyal Heart",        "Rare and precious loyalty 🤝"],
    ["Future Star",        "Greatness already lives in you 🚀"],
    ["Inspiring Soul",     "You inspire without even knowing it 🔥"],
    ["Pure Magic",         "There is simply no one like you ✨"],
    ["Fearless Dreamer",   "18 and unstoppable — the world is yours 🌍"],
    ["One of a Kind",      "Unique, irreplaceable, extraordinary 👑"],
  ];

  // ─── Awards
  const AWARDS = [
    { icon: "🏆", title: "Golden Smile Award",        desc: "For brightening every room she enters" },
    { icon: "💖", title: "Kindest Heart Award",        desc: "For loving without condition" },
    { icon: "⭐", title: "Future Star Award",          desc: "For the greatness that awaits" },
    { icon: "🌟", title: "Dream Chaser Award",         desc: "For never giving up on her dreams" },
    { icon: "☀️", title: "Happiness Creator Award",    desc: "For radiating joy wherever she goes" },
    { icon: "👑", title: "Best Friend Award",          desc: "For being the friend everyone needs" },
    { icon: "💎", title: "Most Precious Soul Award",   desc: "For being one of a kind" },
    { icon: "🦋", title: "Graceful Spirit Award",      desc: "For her endless elegance" },
    { icon: "🔥", title: "Unstoppable Force Award",    desc: "For rising every single time" },
  ];

  // ─── Year cards — 18 years
  const YEAR_CARDS = Array.from({ length: 18 }, (_, i) => ({
    year: i + 1,
    blessing: [
      "A year of first smiles",
      "A year of wonder",
      "A year of little joys",
      "A year of growing wings",
      "A year of discovering magic",
      "A year of finding your voice",
      "A year of golden memories",
      "A year of beautiful friendships",
      "A year of blossoming dreams",
      "A year of quiet courage",
      "A year of sparkling confidence",
      "A year of daring adventures",
      "A year of quiet strength",
      "A year of unstoppable spirit",
      "A year of pure grace",
      "A year of new independence",
      "A year of rising boldly",
      "A year of becoming legendary — welcome to 18 ✨",
    ][i],
  }));

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 20% 10%, #1a0033 0%, #0d001a 55%, #000010 100%)",
        color: "#fff",
        fontFamily: "'Georgia', serif",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Global CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes floatUp {
          0%{transform:translateY(0) scale(1);opacity:0.55}
          100%{transform:translateY(-110vh) scale(0.5);opacity:0}
        }
        @keyframes petalFall {
          0%{transform:translateY(0) rotate(0deg);opacity:0.7}
          100%{transform:translateY(110vh) rotate(720deg);opacity:0}
        }
        @keyframes sparkFade {
          0%{transform:scale(1);opacity:1}
          100%{transform:scale(0) translateY(-30px);opacity:0}
        }
        @keyframes twinkle {
          0%{opacity:0.3;transform:scale(0.7)}
          100%{opacity:1;transform:scale(1.2)}
        }
        @keyframes popIn {
          0%{transform:translateX(-50%) scale(0)}
          80%{transform:translateX(-50%) scale(1.1)}
          100%{transform:translateX(-50%) scale(1)}
        }
        @keyframes flicker {
          0%{transform:scaleX(1)}50%{transform:scaleX(0.9)}100%{transform:scaleX(1.05)}
        }
        @keyframes confettiFall {
          0%{transform:translateY(0) rotate(0deg);opacity:1}
          100%{transform:translateY(110vh) rotate(720deg);opacity:0}
        }
        @keyframes fireflyGlow {
          0%{opacity:0.1;transform:scale(0.7)}
          100%{opacity:1;transform:scale(1.4)}
        }
        @keyframes pulse {
          0%,100%{transform:scale(1)} 50%{transform:scale(1.06)}
        }
        @keyframes slideUp {
          0%{opacity:0;transform:translateY(60px)}
          100%{opacity:1;transform:translateY(0)}
        }
        @keyframes fadeIn {
          0%{opacity:0} 100%{opacity:1}
        }
        @keyframes doorOpen {
          0%{transform:perspective(800px) rotateY(0deg)}
          100%{transform:perspective(800px) rotateY(-90deg)}
        }
        @keyframes shimmer {
          0%{background-position:0% 50%}
          50%{background-position:100% 50%}
          100%{background-position:0% 50%}
        }
        @keyframes aurora {
          0%{opacity:0.3;transform:scaleX(1)}
          50%{opacity:0.7;transform:scaleX(1.1)}
          100%{opacity:0.3;transform:scaleX(1)}
        }
        @keyframes lanternRise {
          0%{transform:translateY(0) rotate(-3deg);opacity:0.85}
          100%{transform:translateY(-100vh) rotate(5deg);opacity:0}
        }
        @keyframes gentleBob {
          0%,100%{transform:translateY(0px)} 50%{transform:translateY(-14px)}
        }
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:#0d001a}
        ::-webkit-scrollbar-thumb{background:linear-gradient(#c77dff,#ffd700);border-radius:3px}
      `}</style>

      {/* Persistent bg canvas */}
      <canvas
        ref={bgCanvasRef}
        style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      />

      {/* Decorative aurora */}
      {world !== "loading" && (
        <>
          <div style={{
            position: "fixed", top: 0, left: "-20%", width: "80%", height: "35%",
            background: "radial-gradient(ellipse, #c77dff22 0%, transparent 70%)",
            animation: "aurora 8s ease-in-out infinite", pointerEvents: "none", zIndex: 0,
          }} />
          <div style={{
            position: "fixed", top: "10%", right: "-10%", width: "60%", height: "25%",
            background: "radial-gradient(ellipse, #ff69b418 0%, transparent 70%)",
            animation: "aurora 11s ease-in-out infinite 3s", pointerEvents: "none", zIndex: 0,
          }} />
        </>
      )}

      <MouseTrail />
      <MusicPlayer />
      {world !== "loading" && world !== "w1" && <FloatingHearts count={10} />}
      {["w12", "w13", "w14", "wEnd"].includes(world) && <RosePetals />}
      {["w12", "w14"].includes(world) && <Fireflies />}
      <Confetti active={showConfetti} />

      {/* ──────────── LOADING ──────────── */}
      {world === "loading" && (
        <div style={{
          position: "fixed", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", zIndex: 200,
          background: "radial-gradient(ellipse at center, #1a003a 0%, #000010 100%)",
        }}>
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${rnd(0, 100)}%`,
              top: `${rnd(0, 100)}%`,
              width: rnd(2, 5),
              height: rnd(2, 5),
              borderRadius: "50%",
              background: ["#fff", "#ffd700", "#c77dff", "#ff69b4"][i % 4],
              animation: `twinkle ${rnd(1, 3)}s ${rnd(0, 2)}s ease-in-out infinite alternate`,
              boxShadow: `0 0 8px ${["#fff", "#ffd700", "#c77dff", "#ff69b4"][i % 4]}`,
            }} />
          ))}

          <div style={{
            fontSize: "3rem", marginBottom: 16,
            animation: "pulse 2s ease-in-out infinite",
            filter: "drop-shadow(0 0 20px #c77dff)",
          }}>✨</div>

          <h1 style={{
            fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
            fontFamily: "'Georgia', serif",
            fontStyle: "italic",
            color: "#f8d7e8",
            textShadow: "0 0 30px #c77dff",
            marginBottom: 40,
            textAlign: "center",
            padding: "0 20px",
            animation: "fadeIn 1.5s ease-in",
          }}>
            Preparing Priyanka's Universe…
          </h1>

          <div style={{
            width: "min(380px, 80vw)",
            background: "#ffffff18",
            borderRadius: 100,
            height: 10,
            overflow: "hidden",
            border: "1px solid #c77dff44",
            boxShadow: "0 0 20px #c77dff33",
          }}>
            <div style={{
              height: "100%",
              width: `${loadPct}%`,
              background: "linear-gradient(90deg, #c77dff, #ff69b4, #ffd700)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s linear infinite",
              borderRadius: 100,
              transition: "width 0.1s linear",
            }} />
          </div>
          <p style={{ color: "#c77dff", fontSize: "1rem", marginTop: 14, fontFamily: "'Georgia', serif" }}>
            {Math.min(100, Math.floor(loadPct))}%
          </p>
        </div>
      )}

      {/* ──────────── WORLD 1: GATEWAY OF STARS ──────────── */}
      {world === "w1" && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "40px 20px",
          position: "relative", animation: "fadeIn 1.5s ease-in",
        }}>
          <div style={{
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            marginBottom: 32,
            filter: "drop-shadow(0 0 30px #ffd700)",
            animation: "pulse 2.5s ease-in-out infinite",
          }}>⭐</div>

          {w1Phase === 0 && (
            <Typewriter
              lines={[
                "Some people enter our lives quietly.",
                "And somehow leave beautiful memories behind.",
                "There are billions of stars.",
                "Yet some shine brighter than others.",
              ]}
              onDone={onW1TypeDone}
              speed={42}
            />
          )}

          {w1Phase >= 1 && (
            <div style={{ marginTop: 24, animation: "slideUp 1s ease-out" }}>
              <StarText text="PRIYANKA ❤️" show={true} />
            </div>
          )}

          {w1Phase === 2 && (
            <button
              onClick={() => setWorld("w2")}
              style={{
                marginTop: 40,
                padding: "16px 48px",
                background: "linear-gradient(135deg, #c77dff, #ff69b4, #ffd700)",
                backgroundSize: "200% 200%",
                animation: "shimmer 3s linear infinite, slideUp 0.8s ease-out",
                border: "none",
                borderRadius: 50,
                color: "#fff",
                fontSize: "1.15rem",
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
                letterSpacing: "0.1em",
                cursor: "pointer",
                boxShadow: "0 0 40px #c77dff88, 0 8px 32px #0006",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.07)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              ✨ ENTER THE UNIVERSE ✨
            </button>
          )}
        </div>
      )}

      {/* ──────────── WORLD 2 ──────────── */}
      {world === "w2" && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "60px 20px",
          animation: "fadeIn 1s ease-in",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 28, filter: "drop-shadow(0 0 20px #c77dff)" }}>🌌</div>
          {w2Phase === 0 && (
            <Typewriter
              lines={[
                "Life introduces us to many people.",
                "But only a few become unforgettable.",
                "Some friendships bring laughter.",
                "Some bring strength.",
                "Some become memories we carry with us.",
                "No matter how much time passes…",
                "Good memories never lose their light.",
                "And today…",
                "This universe exists to celebrate you.",
              ]}
              onDone={onW2TypeDone}
              speed={38}
            />
          )}
          {w2Phase === 1 && (
            <div style={{ animation: "pulse 0.5s ease-out", fontSize: "3rem", textAlign: "center" }}>
              💫✨💫
            </div>
          )}
        </div>
      )}

      {/* ──────────── WORLD 3: CONSTELLATION ──────────── */}
      {world === "w3" && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "60px 20px",
          animation: "fadeIn 1s ease-in",
        }}>
          <SectionTitle color="#ffd700">✨ The Priyanka Constellation ✨</SectionTitle>
          <p style={{ color: "#f4a0c088", textAlign: "center", marginBottom: 40, fontStyle: "italic" }}>
            Tap each star to discover what makes you extraordinary
          </p>

          <div style={{ position: "relative", width: "min(700px, 95vw)", height: "min(500px, 75vw)" }}>
            {TRAITS.map((trait, i) => {
              const angle = (i / TRAITS.length) * Math.PI * 2;
              const r = 35 + Math.sin(i * 1.7) * 12;
              const x = 50 + Math.cos(angle) * r;
              const y = 50 + Math.sin(angle) * r * 0.7;
              return (
                <ConstellationStar
                  key={trait}
                  x={x} y={y}
                  trait={trait}
                  size={rndInt(10, 20)}
                />
              );
            })}
            <div style={{
              position: "absolute", left: "50%", top: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "clamp(1.4rem, 5vw, 2.2rem)",
              animation: "pulse 2s ease-in-out infinite",
              filter: "drop-shadow(0 0 30px #ffd700)",
              textAlign: "center",
            }}>
              <div style={{ color: "#ffd700", fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
                PRIYANKA
              </div>
              <div>⭐</div>
            </div>
          </div>

          <button onClick={() => nav("w4")} style={nextBtnStyle()}>
            Continue the Journey →
          </button>
        </div>
      )}

      {/* ──────────── WORLD 4: WISHING SKY ──────────── */}
      {world === "w4" && (
        <div style={{
          minHeight: "100vh", position: "relative", display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 1s ease-in",
        }}>
          <ShootingStarCanvas />
          <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 20px" }}>
            <div style={{ fontSize: "4rem", marginBottom: 16, filter: "drop-shadow(0 0 30px #fff)" }}>🌠</div>
            <h2 style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              color: "#ffd700",
              textShadow: "0 0 40px #ffd700",
              marginBottom: 16,
              fontStyle: "italic",
            }}>
              Make a Wish
            </h2>
            <p style={{ color: "#f4a0c0", fontStyle: "italic", fontSize: "1.05rem", marginBottom: 40 }}>
              Tap anywhere in the sky ✨
            </p>
            <button onClick={() => nav("w5")} style={nextBtnStyle()}>
              Next World →
            </button>
          </div>
        </div>
      )}

      {/* ──────────── WORLD 5: HEART GARDEN ──────────── */}
      {world === "w5" && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "60px 20px",
          animation: "fadeIn 1s ease-in",
        }}>
          <SectionTitle color="#ff69b4">💖 Heart Garden 💖</SectionTitle>
          <p style={{ color: "#f4a0c088", textAlign: "center", marginBottom: 40, fontStyle: "italic" }}>
            Touch each heart to reveal a message for you
          </p>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 20,
            justifyContent: "center", maxWidth: 700,
          }}>
            {HEART_MSGS.map((msg, i) => (
              <div
                key={i}
                onClick={() => setHeartMsgs((m) => ({ ...m, [i]: true }))}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 18,
                  background: heartMsgs[i]
                    ? "linear-gradient(135deg, #ff69b444, #c77dff44)"
                    : "linear-gradient(135deg, #ff69b422, #c77dff22)",
                  border: `1px solid ${heartMsgs[i] ? "#ff69b4" : "#ff69b444"}`,
                  backdropFilter: "blur(12px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 10,
                  textAlign: "center",
                  transition: "all 0.3s",
                  boxShadow: heartMsgs[i] ? "0 0 30px #ff69b466" : "none",
                  animation: `gentleBob ${rnd(3, 5)}s ${rnd(0, 2)}s ease-in-out infinite`,
                }}
              >
                {heartMsgs[i] ? (
                  <p style={{ color: "#fff", fontSize: "0.72rem", fontStyle: "italic", lineHeight: 1.4 }}>{msg}</p>
                ) : (
                  <span style={{ fontSize: "2.2rem", filter: "drop-shadow(0 0 10px #ff69b4)", animation: "pulse 1.5s infinite" }}>❤️</span>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => nav("w6")} style={{ ...nextBtnStyle(), marginTop: 40 }}>
            Enter the Wish Tree →
          </button>
        </div>
      )}

      {/* ──────────── WORLD 6: WISH TREE ──────────── */}
      {world === "w6" && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "60px 20px",
          animation: "fadeIn 1s ease-in",
        }}>
          <SectionTitle color="#90ee90">🌳 The Wish Tree 🌳</SectionTitle>
          <p style={{ color: "#f4a0c088", textAlign: "center", marginBottom: 40, fontStyle: "italic" }}>
            Touch each leaf to reveal a wish — 18 leaves for 18 years
          </p>

          <div style={{ position: "relative", width: "min(600px, 95vw)", height: 420 }}>
            <div style={{
              position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
              width: 28, height: 160,
              background: "linear-gradient(180deg, #8B4513, #5c2e0a)",
              borderRadius: 4,
              boxShadow: "0 0 20px #8B451366",
            }} />
            <div style={{
              position: "absolute", bottom: 140, left: "50%", transform: "translateX(-50%)",
              width: 320, height: 280,
              background: "radial-gradient(ellipse, #1a5c1a 30%, #0d3d0d 70%, transparent)",
              borderRadius: "50%",
              boxShadow: "0 0 60px #00ff0033",
            }} />

            {LEAF_WISHES.map((wish, i) => {
              const angle = (i / LEAF_WISHES.length) * Math.PI * 2;
              const r = 90 + Math.sin(i * 0.8) * 30;
              const x = 50 + (Math.cos(angle) * r / 3.2);
              const y = 45 + (Math.sin(angle) * r / 5);
              return (
                <div
                  key={i}
                  onClick={() => setLeafWishes((l) => ({ ...l, [i]: true }))}
                  style={{
                    position: "absolute",
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                    zIndex: 5,
                  }}
                >
                  {leafWishes[i] ? (
                    <div style={{
                      background: "#0d330044",
                      border: "1px solid #90ee90",
                      borderRadius: 10,
                      padding: "6px 10px",
                      color: "#90ee90",
                      fontSize: "0.65rem",
                      maxWidth: 110,
                      textAlign: "center",
                      backdropFilter: "blur(8px)",
                      animation: "popIn 0.3s ease-out",
                      boxShadow: "0 0 14px #90ee9044",
                    }}>{wish}</div>
                  ) : (
                    <div style={{
                      fontSize: "1.6rem",
                      animation: `twinkle ${rnd(1.5, 3)}s ease-in-out infinite alternate`,
                      filter: "drop-shadow(0 0 8px #90ee90)",
                    }}>🍃</div>
                  )}
                </div>
              );
            })}
          </div>

          <button onClick={() => nav("w7")} style={{ ...nextBtnStyle(), marginTop: 40 }}>
            Discover Your 18 Years →
          </button>
        </div>
      )}

      {/* ──────────── WORLD 7: 18 YEARS ──────────── */}
      {world === "w7" && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", padding: "60px 20px 80px",
          animation: "fadeIn 1s ease-in",
        }}>
          <SectionTitle color="#ffd700">✨ 18 Years of Magic ✨</SectionTitle>
          <p style={{ color: "#f4a0c088", textAlign: "center", marginBottom: 40, fontStyle: "italic" }}>
            Tap each card to unwrap your year
          </p>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 16,
            justifyContent: "center", maxWidth: 900,
          }}>
            {YEAR_CARDS.map((card) => (
              <FlipCard
                key={card.year}
                color="#ffd700"
                front={
                  <>
                    <div style={{ fontSize: "2rem", marginBottom: 8 }}>⭐</div>
                    <div style={{ color: "#ffd700", fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: "1.4rem" }}>
                      Year {card.year}
                    </div>
                    <div style={{ color: "#fff8", fontSize: "0.7rem", marginTop: 6 }}>Tap to reveal</div>
                  </>
                }
                back={
                  <>
                    <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>🌟</div>
                    <div style={{ color: "#ffd700", fontFamily: "'Georgia', serif", fontSize: "0.8rem", fontStyle: "italic", lineHeight: 1.5 }}>
                      {card.blessing}
                    </div>
                  </>
                }
              />
            ))}
          </div>
          <button onClick={() => nav("w8")} style={{ ...nextBtnStyle(), marginTop: 48 }}>
            See Why You're Amazing →
          </button>
        </div>
      )}

      {/* ──────────── WORLD 8: 18 REASONS ──────────── */}
      {world === "w8" && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", padding: "60px 20px 80px",
          animation: "fadeIn 1s ease-in",
        }}>
          <SectionTitle color="#ff69b4">💖 18 Reasons You Are Amazing 💖</SectionTitle>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 16,
            justifyContent: "center", maxWidth: 900,
          }}>
            {REASONS.map(([title, desc], i) => (
              <FlipCard
                key={i}
                color="#ff69b4"
                front={
                  <>
                    <div style={{ color: "#ff69b4", fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: "0.95rem", textAlign: "center" }}>
                      {title}
                    </div>
                    <div style={{ color: "#fff5", fontSize: "0.65rem", marginTop: 8 }}>Tap to read</div>
                  </>
                }
                back={
                  <>
                    <div style={{ color: "#ffd700", fontFamily: "'Georgia', serif", fontSize: "0.78rem", fontStyle: "italic", lineHeight: 1.5, textAlign: "center" }}>
                      {desc}
                    </div>
                  </>
                }
              />
            ))}
          </div>
          <button onClick={() => nav("w9")} style={{ ...nextBtnStyle(), marginTop: 48 }}>
            Collect Your Awards →
          </button>
        </div>
      )}

      {/* ──────────── WORLD 9: AWARDS ──────────── */}
      {world === "w9" && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", padding: "60px 20px 80px",
          animation: "fadeIn 1s ease-in",
        }}>
          <SectionTitle color="#ffd700">🏆 Achievement Awards 🏆</SectionTitle>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 24,
            justifyContent: "center", maxWidth: 900,
          }}>
            {AWARDS.map((a, i) => (
              <GlassPanel
                key={i}
                glow="#ffd700"
                style={{
                  width: "min(240px, 90vw)",
                  textAlign: "center",
                  animation: `slideUp 0.6s ${i * 0.1}s ease-out both`,
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: 12, filter: "drop-shadow(0 0 16px #ffd700)" }}>
                  {a.icon}
                </div>
                <div style={{
                  color: "#ffd700", fontFamily: "'Georgia', serif",
                  fontWeight: 700, fontSize: "1rem", marginBottom: 8,
                }}>
                  {a.title}
                </div>
                <div style={{ color: "#f8d7e8", fontSize: "0.82rem", fontStyle: "italic", lineHeight: 1.5 }}>
                  {a.desc}
                </div>
                <div style={{
                  marginTop: 14, fontSize: "0.7rem",
                  color: "#ffd700aa", fontFamily: "'Georgia', serif",
                }}>
                  Awarded to Priyanka ❤️
                </div>
              </GlassPanel>
            ))}
          </div>
          <button onClick={() => nav("w10")} style={{ ...nextBtnStyle(), marginTop: 48 }}>
            Find Secret Gifts →
          </button>
        </div>
      )}

      {/* ──────────── WORLD 10: GIFT BOXES ──────────── */}
      {world === "w10" && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "60px 20px",
          animation: "fadeIn 1s ease-in",
        }}>
          <SectionTitle color="#c77dff">🎁 Secret Gift Boxes 🎁</SectionTitle>
          <p style={{ color: "#f4a0c088", textAlign: "center", marginBottom: 40, fontStyle: "italic" }}>
            Every box holds a hidden surprise just for you
          </p>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 24,
            justifyContent: "center", maxWidth: 700,
          }}>
            {GIFTS.map((g, i) => (
              <div
                key={i}
                onClick={() => setWishBoxes((b) => ({ ...b, [i]: true }))}
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 22,
                  background: wishBoxes[i]
                    ? "linear-gradient(135deg, #c77dff44, #ffd70033)"
                    : "linear-gradient(135deg, #c77dff22, #2d005044)",
                  border: `1px solid ${wishBoxes[i] ? "#ffd700" : "#c77dff44"}`,
                  backdropFilter: "blur(14px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: wishBoxes[i] ? "default" : "pointer",
                  padding: 16,
                  textAlign: "center",
                  transition: "all 0.4s",
                  boxShadow: wishBoxes[i] ? "0 0 40px #ffd70055" : "0 4px 20px #c77dff33",
                  animation: wishBoxes[i] ? "pulse 0.4s ease-out" : `gentleBob ${rnd(3, 6)}s ease-in-out infinite`,
                }}
              >
                {wishBoxes[i] ? (
                  <>
                    <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>✨</div>
                    <div style={{ color: "#ffd700", fontFamily: "'Georgia', serif", fontWeight: 700, fontSize: "0.82rem", marginBottom: 6 }}>
                      {g.title}
                    </div>
                    <div style={{ color: "#f8d7e8", fontSize: "0.7rem", fontStyle: "italic", lineHeight: 1.4 }}>
                      {g.msg}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: "3rem", filter: "drop-shadow(0 0 16px #c77dff)" }}>{g.emoji}</div>
                    <div style={{ color: "#c77dff", fontSize: "0.72rem", marginTop: 8 }}>Tap to open</div>
                  </>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => nav("w11")} style={{ ...nextBtnStyle(), marginTop: 48 }}>
            Open the Letter Chamber →
          </button>
        </div>
      )}

      {/* ──────────── WORLD 11: LETTER CHAMBER ──────────── */}
      {world === "w11" && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "60px 20px",
          animation: "fadeIn 1s ease-in",
        }}>
          {!showDoor && !showLetter && (
            <>
              <p style={{ color: "#f4a0c0", textAlign: "center", fontStyle: "italic", fontSize: "1.1rem", marginBottom: 40, maxWidth: 500 }}>
                "A message has been waiting for you."
              </p>
              <div
                onClick={() => setShowDoor(true)}
                style={{
                  width: 200, height: 300,
                  background: "linear-gradient(180deg, #2d0050, #1a0033)",
                  border: "2px solid #ffd700",
                  borderRadius: "18px 18px 4px 4px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 0 60px #ffd70066, inset 0 0 30px #c77dff33",
                  animation: "pulse 2.5s ease-in-out infinite",
                  position: "relative",
                }}
              >
                <div style={{ fontSize: "4rem", filter: "drop-shadow(0 0 20px #ffd700)" }}>🚪</div>
                <p style={{ color: "#ffd700", fontStyle: "italic", fontSize: "0.85rem", marginTop: 12 }}>
                  Open the Door
                </p>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    left: `${rnd(-20, 120)}%`,
                    top: `${rnd(-10, 110)}%`,
                    fontSize: "0.8rem",
                    animation: `twinkle ${rnd(1, 2)}s ${rnd(0, 1)}s ease-in-out infinite alternate`,
                  }}>⭐</div>
                ))}
              </div>
            </>
          )}

          {showDoor && !showLetter && (
            <div style={{ textAlign: "center", animation: "fadeIn 0.8s ease-in" }}>
              <div style={{ fontSize: "5rem", animation: "pulse 1s 3", marginBottom: 20 }}>✨</div>
              <p style={{ color: "#ffd700", fontFamily: "'Georgia', serif", fontSize: "1.2rem", fontStyle: "italic" }}>
                The door opens...
              </p>
              {setTimeout(() => setShowLetter(true), 2000) && null}
            </div>
          )}

          {showLetter && (
            <div style={{ animation: "slideUp 1s ease-out", maxWidth: 680, width: "100%" }}>
              <SectionTitle color="#ffd700">💌 A Letter For You</SectionTitle>
              <GlassPanel glow="#ffd700" style={{ position: "relative" }}>
                {["🦋", "🦋", "🦋"].map((b, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    top: rnd(-10, 20),
                    left: ["-5%", "50%", "95%"][i],
                    fontSize: "1.6rem",
                    animation: `gentleBob ${rnd(2, 4)}s ease-in-out infinite`,
                    filter: "drop-shadow(0 0 8px #ffd700)",
                  }}>{b}</div>
                ))}
                <div style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "clamp(0.85rem, 2vw, 0.98rem)",
                  color: "#f8d7e8",
                  lineHeight: 1.95,
                  fontStyle: "italic",
                  whiteSpace: "pre-line",
                }}>
{`Dearest Priyanka,

Eighteen. What a beautiful, powerful, extraordinary word — and what a beautiful, powerful, extraordinary person you have grown into.

If words could hold the weight of everything I feel, I would write you a letter that stretches across the sky — but today, I'll try my best.

I remember the first time I realized you were different. Not in the way that people throw that word around, but truly different — the kind of different that makes a room feel warmer, a conversation feel lighter, and life feel like it actually makes sense. You have that rare, inexplicable gift of making people feel seen. Not just heard — seen.

At 18, you are stepping into something extraordinary. You are no longer waiting for the world — you are ready to shape it. That courage, that brightness, that unshakable kindness you carry — it is going to take you places that even your wildest dreams haven't imagined yet.

You carry so much without ever making it look heavy. You show up with your whole heart, even on the days when your own heart is tired. You laugh in a way that makes everyone around you want to laugh too. And when you love, you love fiercely, quietly, and without condition.

I think about everything you've been through — the moments that tried to dim your light — and I am in awe that you are still here, still shining, still becoming more beautifully yourself than ever before. You are not just surviving. You are blooming.

Today, on this 18th birthday, I want you to know something that I don't say nearly enough: you have changed my life. The memories we've built together — the laughter, the late-night conversations, the moments that only we understand — they live in me permanently. You are woven into some of my happiest memories, and I would not trade that for anything in this universe.

So here's my birthday wish for you, Priyanka: May this year hold more magic than you ever imagined. May you finally believe, fully and deeply, how extraordinary you are. May kindness come back to you in waves. May every dream you've been quietly carrying finally find its wings.

You deserve a life as beautiful as you are.

Happy 18th Birthday, my dearest Priyanka. The universe lit up a little brighter the day you were born — and today, it shines brightest of all.

With all my love, always ❤️`}
                </div>
                <div style={{ textAlign: "center", marginTop: 24, fontSize: "1.5rem" }}>
                  🦋 ✨ 🦋
                </div>
              </GlassPanel>
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <button onClick={() => nav("w12")} style={nextBtnStyle()}>
                  Enter the Birthday Palace →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──────────── WORLD 12: BIRTHDAY PALACE ──────────── */}
      {world === "w12" && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "60px 20px",
          animation: "fadeIn 1s ease-in", position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center top, #c77dff22 0%, transparent 60%)",
            pointerEvents: "none",
          }} />

          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${rnd(5, 90)}%`,
              bottom: `${rnd(10, 30)}%`,
              fontSize: "2rem",
              animation: `lanternRise ${rnd(8, 14)}s ${rnd(0, 5)}s linear infinite`,
              filter: "drop-shadow(0 0 16px #ffd700)",
            }}>🏮</div>
          ))}

          <div style={{
            fontSize: "clamp(2rem, 8vw, 4rem)",
            textAlign: "center",
            marginBottom: 8,
            filter: "drop-shadow(0 0 40px #c77dff)",
            animation: "pulse 2s ease-in-out infinite",
          }}>🏰</div>

          <h1 style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            textAlign: "center",
            background: "linear-gradient(135deg, #ffd700, #ff69b4, #c77dff, #ffd700)",
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 4s linear infinite",
            marginBottom: 48,
            lineHeight: 1.3,
          }}>
            HAPPY 18TH BIRTHDAY<br />PRIYANKA ❤️
          </h1>

          {/* CAKE — 18 candles */}
          <GlassPanel glow="#ff69b4" style={{ textAlign: "center", maxWidth: 660, width: "100%" }}>
            <SectionTitle color="#ffd700">🎂 Light Your 18 Candles 🎂</SectionTitle>
            <p style={{ color: "#f4a0c088", fontStyle: "italic", marginBottom: 24 }}>
              Each candle reveals a birthday wish — light them all!
            </p>

            <div style={{ position: "relative", display: "inline-block" }}>
              {/* Candles */}
              <div style={{
                display: "flex", gap: 8, justifyContent: "center",
                flexWrap: "wrap", maxWidth: 560, margin: "0 auto 20px",
              }}>
                {Array.from({ length: 18 }).map((_, i) => (
                  <Candle
                    key={i}
                    index={i}
                    lit={litCandles.includes(i)}
                    wish={litCandles.includes(i) ? CANDLE_WISHES[i] : null}
                    onLight={() => lightCandle(i)}
                  />
                ))}
              </div>

              {/* Cake tiers */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: 220, height: 60,
                  background: "linear-gradient(180deg, #ffb3c6, #ff69b4)",
                  borderRadius: "12px 12px 4px 4px",
                  border: "2px solid #ffd700",
                  boxShadow: "0 4px 20px #ff69b466",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: "0.85rem", fontStyle: "italic",
                }}>🌸 18th Birthday 🌸</div>
                <div style={{
                  width: 290, height: 70,
                  background: "linear-gradient(180deg, #e0aaff, #c77dff)",
                  border: "2px solid #ffd700",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: "0.85rem", fontStyle: "italic",
                }}>✨ Happy Birthday Priyanka ✨</div>
                <div style={{
                  width: 360, height: 80,
                  background: "linear-gradient(180deg, #ffd700, #ffaa00)",
                  borderRadius: "4px 4px 16px 16px",
                  border: "2px solid #ffd700",
                  boxShadow: "0 8px 30px #ffd70066",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: "1rem", fontStyle: "italic",
                }}>💖 Welcome to 18 — The World is Yours 💖</div>
              </div>
            </div>

            {litCandles.length < 18 && (
              <p style={{ color: "#ffd700", marginTop: 20, fontStyle: "italic" }}>
                {litCandles.length} / 18 candles lit ✨
              </p>
            )}
            {litCandles.length === 18 && (
              <div style={{ marginTop: 20, animation: "pulse 0.5s ease-out 4" }}>
                <p style={{ color: "#ffd700", fontSize: "1.2rem", fontStyle: "italic" }}>
                  🎉 All 18 candles lit! Your wish has been sent to the stars! 🎉
                </p>
              </div>
            )}
          </GlassPanel>

          {litCandles.length < 18 && (
            <button onClick={() => nav("w13")} style={{ ...nextBtnStyle(), marginTop: 32 }}>
              Skip to Celebration →
            </button>
          )}
        </div>
      )}

      {/* ──────────── WORLD 13: GRAND CELEBRATION ──────────── */}
      {world === "w13" && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "60px 20px",
          animation: "fadeIn 0.8s ease-in", position: "relative", overflow: "hidden",
        }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${rnd(0, 95)}%`,
              top: `${rnd(0, 80)}%`,
              fontSize: rnd(1.5, 3.5) + "rem",
              animation: `twinkle ${rnd(0.5, 1.5)}s ${rnd(0, 1)}s ease-in-out infinite alternate`,
              filter: "drop-shadow(0 0 20px #ffd700)",
              pointerEvents: "none",
            }}>
              {["🎆", "🎇", "✨", "🎊", "🎉", "💖", "⭐", "🌟"][i % 8]}
            </div>
          ))}

          <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
            <div style={{
              fontSize: "clamp(3rem, 10vw, 6rem)",
              animation: "pulse 0.8s ease-in-out infinite",
              filter: "drop-shadow(0 0 40px #ffd700)",
              marginBottom: 20,
            }}>🎉</div>

            <h1 style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(2rem, 7vw, 4.5rem)",
              background: "linear-gradient(135deg, #ffd700, #ff69b4, #c77dff, #00cfff, #ffd700)",
              backgroundSize: "400% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 2s linear infinite",
              lineHeight: 1.2,
              marginBottom: 24,
            }}>
              HAPPY 18TH BIRTHDAY<br />PRIYANKA ❤️
            </h1>

            <div style={{
              display: "flex", gap: 16, justifyContent: "center",
              flexWrap: "wrap", fontSize: "2rem", marginBottom: 32,
            }}>
              {["🎊", "🌸", "💖", "🦋", "✨", "🌟", "🎆", "💎", "🎀"].map((e, i) => (
                <span key={i} style={{
                  animation: `gentleBob ${rnd(1.5, 3)}s ${rnd(0, 1)}s ease-in-out infinite`,
                  filter: "drop-shadow(0 0 12px #ffd700)",
                }}>{e}</span>
              ))}
            </div>

            <button onClick={() => nav("w14")} style={nextBtnStyle()}>
              Enter the Dream Kingdom →
            </button>
          </div>
        </div>
      )}

      {/* ──────────── WORLD 14: DREAM KINGDOM ──────────── */}
      {world === "w14" && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "60px 20px",
          animation: "fadeIn 1.2s ease-in", position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, #0a001a 0%, #0d0d2b 40%, #1a0a3a 70%, #0a001a 100%)",
            zIndex: -1,
          }} />

          {["🌤", "⛅", "🌤"].map((c, i) => (
            <div key={i} style={{
              position: "absolute",
              top: `${[10, 20, 12][i]}%`,
              left: `${[5, 50, 80][i]}%`,
              fontSize: "4rem",
              opacity: 0.25,
              animation: `gentleBob ${[5, 7, 6][i]}s ease-in-out infinite`,
              filter: "sepia(1) saturate(2) hue-rotate(30deg)",
            }}>{c}</div>
          ))}

          {[
            { left: "8%",  top: "55%", emoji: "🏝" },
            { left: "75%", top: "62%", emoji: "🏔" },
            { left: "45%", top: "75%", emoji: "🌋" },
          ].map((island, i) => (
            <div key={i} style={{
              position: "absolute",
              left: island.left, top: island.top,
              fontSize: "3rem",
              opacity: 0.35,
              animation: `gentleBob ${5 + i}s ${i}s ease-in-out infinite`,
              filter: "drop-shadow(0 8px 20px #c77dff44)",
            }}>{island.emoji}</div>
          ))}

          <div style={{ position: "relative", zIndex: 5, textAlign: "center", padding: "0 20px" }}>
            <div style={{ fontSize: "3rem", marginBottom: 20, filter: "drop-shadow(0 0 30px #ffd700)" }}>
              🌉
            </div>
            <h2 style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              color: "#ffd700",
              textShadow: "0 0 40px #ffd700",
              marginBottom: 32,
              fontStyle: "italic",
            }}>
              The Dream Kingdom
            </h2>
            <GlassPanel glow="#c77dff" style={{ maxWidth: 620 }}>
              <p style={{
                fontFamily: "'Georgia', serif",
                fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                color: "#f8d7e8",
                fontStyle: "italic",
                lineHeight: 1.9,
                textAlign: "center",
                textShadow: "0 0 20px #c77dff44",
              }}>
                "At 18, the world opens its doors for you.<br />
                May you walk through them with joy,<br />
                with courage, and with a heart full of dreams."
              </p>
              <div style={{ textAlign: "center", marginTop: 20, fontSize: "1.8rem" }}>
                🌟 💫 ✨ 💖 ✨ 💫 🌟
              </div>
            </GlassPanel>
            <button onClick={() => nav("wEnd")} style={{ ...nextBtnStyle(), marginTop: 40 }}>
              Reach the Stars →
            </button>
          </div>
        </div>
      )}

      {/* ──────────── FINAL WORLD: THE ENDING ──────────── */}
      {world === "wEnd" && (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: "60px 20px",
          animation: "fadeIn 2s ease-in", position: "relative",
        }}>
          <div style={{ textAlign: "center", maxWidth: 600 }}>
            {[
              { text: "Among billions of stars…",        delay: 0 },
              { text: "Some shine brighter.",             delay: 1 },
              { text: "Among billions of stories…",      delay: 2 },
              { text: "Some stay in our hearts.",         delay: 3 },
              { text: "Among billions of people…",       delay: 4 },
              { text: "There is only one Priyanka.", delay: 5, color: "#ffd700", size: "1.4rem" },
              { text: "Thank you for being you.",         delay: 6 },
              { text: "Thank you for your kindness.",     delay: 7 },
              { text: "Thank you for the memories.",      delay: 8 },
            ].map((line, i) => (
              endPhase > i && (
                <p
                  key={i}
                  style={{
                    fontFamily: "'Georgia', serif",
                    fontSize: line.size || "clamp(1rem, 2.5vw, 1.25rem)",
                    color: line.color || "#f8d7e8",
                    fontStyle: "italic",
                    lineHeight: 1.8,
                    textShadow: `0 0 20px ${line.color || "#ff69b4"}55`,
                    animation: "fadeIn 1.5s ease-in",
                    marginBottom: "0.2em",
                  }}
                >
                  {line.text}
                </p>
              )
            ))}

            {endPhase >= 9 && (
              <div style={{ marginTop: 32, animation: "slideUp 1s ease-out" }}>
                <div style={{
                  fontSize: "4rem",
                  animation: "pulse 2s ease-in-out infinite",
                  filter: "drop-shadow(0 0 40px #ffd700)",
                  marginBottom: 20,
                }}>⭐</div>
                <h1 style={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "clamp(1.8rem, 5vw, 3rem)",
                  background: "linear-gradient(135deg, #ffd700, #ff69b4, #c77dff)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "shimmer 3s linear infinite",
                  marginBottom: 16,
                }}>
                  Happy 18th Birthday Priyanka ❤️
                </h1>
                <p style={{
                  color: "#ffd700",
                  fontFamily: "'Georgia', serif",
                  fontStyle: "italic",
                  fontSize: "1.05rem",
                  marginBottom: 8,
                }}>
                  "May every dream find its way to you."
                </p>
                <div style={{ marginTop: 32 }}>
                  <GlassPanel glow="#ffd700" style={{ display: "inline-block", padding: "24px 48px" }}>
                    <p style={{
                      color: "#ffd700",
                      fontFamily: "'Georgia', serif",
                      fontSize: "clamp(1rem, 3vw, 1.3rem)",
                      fontStyle: "italic",
                      letterSpacing: "0.08em",
                    }}>FOR PRIYANKA ❤️</p>
                    <p style={{ color: "#f8d7e8", fontSize: "0.85rem", marginTop: 8, letterSpacing: "0.1em" }}>
                      ON YOUR 18TH BIRTHDAY
                    </p>
                    <div style={{ fontSize: "2rem", marginTop: 12, animation: "pulse 2s infinite" }}>⭐</div>
                  </GlassPanel>
                </div>
                <button
                  onClick={() => {
                    setWorld("loading");
                    setLoadPct(0);
                    setW1Phase(0);
                    setW2Phase(0);
                    setLitCandles([]);
                    setShowConfetti(false);
                    setWishBoxes({});
                    setLeafWishes({});
                    setHeartMsgs({});
                    setShowLetter(false);
                    setShowDoor(false);
                    setEndPhase(0);
                  }}
                  style={{ ...nextBtnStyle(), marginTop: 32, background: "linear-gradient(135deg, #ffd700, #ff69b4)" }}
                >
                  ✨ Replay the Universe ✨
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ──────────── Nav dots ──────────── */}
      {!["loading", "w1", "w2"].includes(world) && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 8, zIndex: 500, background: "#00001088",
          backdropFilter: "blur(10px)", borderRadius: 20, padding: "8px 16px",
          border: "1px solid #c77dff33",
        }}>
          {WORLDS.map((w) => (
            <div
              key={w}
              onClick={() => nav(w)}
              title={w}
              style={{
                width: world === w ? 20 : 8,
                height: 8,
                borderRadius: 4,
                background: world === w
                  ? "linear-gradient(90deg, #ffd700, #ff69b4)"
                  : "#ffffff44",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: world === w ? "0 0 10px #ffd70088" : "none",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shared next-btn style ────────────────────────────────────────────────────
function nextBtnStyle() {
  return {
    padding: "14px 40px",
    background: "linear-gradient(135deg, #c77dff, #ff69b4)",
    border: "none",
    borderRadius: 50,
    color: "#fff",
    fontSize: "1rem",
    fontFamily: "'Georgia', serif",
    fontStyle: "italic",
    cursor: "pointer",
    boxShadow: "0 0 30px #c77dff66",
    letterSpacing: "0.06em",
    transition: "transform 0.2s, box-shadow 0.2s",
  };
}
