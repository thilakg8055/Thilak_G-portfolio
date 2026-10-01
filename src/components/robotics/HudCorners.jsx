import { motion } from "framer-motion";

// Targeting brackets that snap into the corners of a `relative` parent when it
// scrolls into view. Pass `active` to tighten them (e.g. on hover).
export default function HudCorners({ color = "#00FFB3", size = 14, inset = 0, active = false }) {
  const offset = active ? inset - 4 : inset;
  const corners = [
    { top: offset, left: offset, borderTop: true, borderLeft: true, from: { x: -12, y: -12 } },
    { top: offset, right: offset, borderTop: true, borderRight: true, from: { x: 12, y: -12 } },
    { bottom: offset, left: offset, borderBottom: true, borderLeft: true, from: { x: -12, y: 12 } },
    { bottom: offset, right: offset, borderBottom: true, borderRight: true, from: { x: 12, y: 12 } },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-20" aria-hidden>
      {corners.map(({ from, borderTop, borderLeft, borderRight, borderBottom, ...pos }, i) => (
        <motion.span
          key={i}
          className="absolute transition-all duration-300"
          initial={{ opacity: 0, ...from }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          style={{
            ...pos,
            width: size,
            height: size,
            borderColor: color,
            borderTopWidth: borderTop ? 2 : 0,
            borderLeftWidth: borderLeft ? 2 : 0,
            borderRightWidth: borderRight ? 2 : 0,
            borderBottomWidth: borderBottom ? 2 : 0,
            filter: active ? `drop-shadow(0 0 6px ${color})` : "none",
          }}
        />
      ))}
    </div>
  );
}
