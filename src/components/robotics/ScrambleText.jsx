import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const GLYPHS = "01<>/\\[]{}#$%&*+=ΣΔΩ▲◆░▒▓";

// Text that "decrypts" from random glyphs into its final value once in view
// (or once `trigger` turns true when provided).
export default function ScrambleText({ text, className = "", style, duration = 900, delay = 0, trigger, as: Tag = "span" }) {
  const ref = useRef();
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const active = trigger === undefined ? inView : trigger;
  const [display, setDisplay] = useState(() => text.replace(/\S/g, " "));

  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setDisplay(text);
      return;
    }
    let raf;
    let start;
    const timer = setTimeout(() => {
      const step = (now) => {
        start ??= now;
        const p = Math.min((now - start) / duration, 1);
        const revealed = Math.floor(p * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === " " || i < revealed) out += ch;
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setDisplay(out);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [active, text, duration, delay, reduce]);

  return (
    <Tag ref={ref} className={className} style={style} aria-label={text}>
      <span aria-hidden>{display}</span>
    </Tag>
  );
}
