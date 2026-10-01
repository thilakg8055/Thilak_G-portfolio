import { useEffect, useRef, useState } from "react";

const INTERACTIVE = "a, button, [data-cursor='lock']";

// Targeting reticle that trails the pointer and locks onto interactive elements.
export default function RoboCursor() {
  const dot = useRef();
  const reticle = useRef();
  const readout = useRef();
  const [locked, setLocked] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    setEnabled(fine.matches);
    document.body.classList.toggle("robo-cursor", fine.matches);
    if (!fine.matches) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf;

    const move = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      setLocked(!!e.target.closest?.(INTERACTIVE));
    };

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      if (reticle.current) reticle.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (readout.current) {
        readout.current.textContent = `X:${String(Math.round(pos.x)).padStart(4, "0")} Y:${String(Math.round(pos.y)).padStart(4, "0")}`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      document.body.classList.remove("robo-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={dot} className="robo-cursor-dot" />
      <div ref={reticle} className={`robo-reticle ${locked ? "is-locked" : ""}`}>
        <div className="robo-reticle-frame">
          <span className="rc rc-tl" />
          <span className="rc rc-tr" />
          <span className="rc rc-bl" />
          <span className="rc rc-br" />
        </div>
        <span className="robo-reticle-label">{locked ? "◉ TARGET LOCK" : <span ref={readout} />}</span>
      </div>
    </>
  );
}
