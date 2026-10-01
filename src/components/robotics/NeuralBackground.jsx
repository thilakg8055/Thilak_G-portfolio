import { useEffect, useRef } from "react";

// Full-page 2D neural mesh: drifting nodes, synapse links, travelling signal
// pulses, and links that reach toward the cursor.
export default function NeuralBackground() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: -9999, y: -9999 };
    const LINK = 150;
    let w, h, dpr, nodes, pulses, raf;

    const init = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (w * h) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
      }));
      pulses = [];
    };

    const spawnPulse = () => {
      const a = nodes[Math.floor(Math.random() * nodes.length)];
      let best = null;
      let bestD = LINK;
      for (const b of nodes) {
        if (b === a) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < bestD && Math.random() > 0.4) {
          best = b;
          bestD = d;
        }
      }
      if (best) pulses.push({ a, b: best, t: 0, speed: 0.012 + Math.random() * 0.02 });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        if (!reduce) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - d / LINK) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 200) {
          ctx.strokeStyle = `rgba(0, 255, 179, ${(1 - md / 200) * 0.45})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        ctx.fillStyle = md < 200 ? "rgba(0,255,179,0.9)" : "rgba(0,255,179,0.45)";
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduce) {
        if (Math.random() < 0.08 && pulses.length < 25) spawnPulse();
        pulses = pulses.filter((p) => p.t < 1);
        for (const p of pulses) {
          p.t += p.speed;
          const x = p.a.x + (p.b.x - p.a.x) * p.t;
          const y = p.a.y + (p.b.y - p.a.y) * p.t;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 6);
          g.addColorStop(0, "rgba(255,255,255,0.95)");
          g.addColorStop(0.4, "rgba(0,255,179,0.6)");
          g.addColorStop(1, "rgba(0,255,179,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(draw);
    };

    init();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", init);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none -z-10" aria-hidden />;
}
