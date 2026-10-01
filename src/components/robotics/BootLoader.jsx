import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const LINES = [
  { text: "BIOS v4.2.0 — THILAK.G ROBOTICS CORE", status: "" },
  { text: "Mounting neural cortex", status: "OK" },
  { text: "Loading transformer weights (7.2B)", status: "OK" },
  { text: "Calibrating servo actuators J1–J6", status: "OK" },
  { text: "Vision module · object detection", status: "ONLINE" },
  { text: "Establishing secure uplink", status: "OK" },
  { text: "All systems nominal", status: "READY" },
];

export default function BootLoader({ onDone }) {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const duration = reduce ? 400 : 2400;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // Ease out with a little stutter so it feels like real loading.
      const eased = 1 - Math.pow(1 - p, 2.2);
      setProgress(Math.floor(eased * 100));
      setVisibleLines(Math.min(LINES.length, Math.floor(p * LINES.length) + 1));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setOpen(false), reduce ? 0 : 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const skip = () => setOpen(false);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {open && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[10000] cursor-pointer"
          onClick={skip}
          exit={{ opacity: 0, transition: { delay: 0.75, duration: 0.01 } }}
        >
          {/* Shutters that split open on exit */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-[#050A0E] border-b border-[#00FFB3]/40"
            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[#050A0E] border-t border-[#00FFB3]/40"
            exit={{ y: "100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          />

          <motion.div
            className="relative h-full flex flex-col items-center justify-center px-6"
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
          >
            {/* Robotic eye */}
            <div className="relative w-36 h-36 mb-10">
              <motion.div
                className="absolute inset-0 rounded-full border border-dashed border-[#00FFB3]/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-3 rounded-full border-2 border-transparent border-t-[#00D4FF] border-r-[#00D4FF]/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-8 rounded-full border border-[#00FFB3]/30 flex items-center justify-center">
                <motion.div
                  className="w-6 h-6 rounded-full bg-[#00FFB3]"
                  style={{ boxShadow: "0 0 30px #00FFB3, 0 0 60px #00FFB3" }}
                  animate={{ scale: [1, 0.6, 1], x: [0, 6, -6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              </div>
              {/* Scan line */}
              <motion.div
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FFB3] to-transparent"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {/* Terminal */}
            <div className="w-full max-w-md font-mono text-[11px] sm:text-xs leading-6">
              {LINES.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between gap-4"
                >
                  <span className="text-white/60 truncate">
                    <span className="text-[#00FFB3]">&gt;</span> {line.text}
                  </span>
                  {line.status && (
                    <span className={line.status === "READY" ? "text-[#00FFB3]" : "text-[#00D4FF]"}>
                      [{line.status}]
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Progress */}
            <div className="w-full max-w-md mt-8">
              <div className="flex justify-between font-mono text-[10px] tracking-widest text-white/40 mb-2">
                <span>SYSTEM BOOT</span>
                <span className="text-[#00FFB3]">{String(progress).padStart(3, "0")}%</span>
              </div>
              <div className="flex gap-[3px]">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-2 flex-1 transition-colors duration-150"
                    style={{
                      background: i < (progress / 100) * 30 ? (i % 5 === 4 ? "#00D4FF" : "#00FFB3") : "rgba(255,255,255,0.06)",
                    }}
                  />
                ))}
              </div>
              <p className="mt-6 text-center font-mono text-[10px] tracking-[0.3em] text-white/20">CLICK TO SKIP</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
