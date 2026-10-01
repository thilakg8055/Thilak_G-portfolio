import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const SECTORS = ["hero", "work", "experience", "skills", "contact"];

// Fixed telemetry: scroll "power" rail on the right, sector readout bottom-left.
export default function ScrollHUD() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  const [pct, setPct] = useState(0);
  const [sector, setSector] = useState("hero");
  const markerTop = useTransform(smooth, (v) => `${v * 100}%`);

  useEffect(() => smooth.on("change", (v) => setPct(Math.round(v * 100))), [smooth]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setSector(e.target.id || "hero")),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    SECTORS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Progress rail */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 h-48 w-px bg-white/10 z-40 hidden md:block" aria-hidden>
        <motion.div className="absolute top-0 left-0 w-px bg-gradient-to-b from-[#00FFB3] to-[#00D4FF] origin-top h-full" style={{ scaleY: smooth }} />
        <motion.div
          className="absolute -left-[5px] w-[11px] h-[11px] border border-[#00FFB3] rotate-45 -translate-y-1/2 bg-[#050A0E]"
          style={{ top: markerTop, boxShadow: "0 0 10px #00FFB3" }}
        />
        {SECTORS.map((s, i) => (
          <span
            key={s}
            className="absolute -left-[2px] w-[5px] h-px bg-white/30"
            style={{ top: `${(i / (SECTORS.length - 1)) * 100}%` }}
          />
        ))}
      </div>

      {/* Sector readout */}
      <div className="fixed right-8 bottom-5 z-40 hidden md:flex flex-col items-end gap-1 font-mono text-[10px] tracking-[0.2em] text-white/35 pointer-events-none" aria-hidden>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#00FFB3] animate-pulse" />
          SECTOR: <span className="text-[#00FFB3]">{sector.toUpperCase()}</span>
        </span>
        <span>
          NAV.PROGRESS: <span className="text-[#00D4FF]">{String(pct).padStart(3, "0")}%</span>
        </span>
      </div>
    </>
  );
}
