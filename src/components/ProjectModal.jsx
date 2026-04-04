import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-4 md:inset-10 z-50 overflow-auto rounded-none bg-[#0A1628] border border-[#00FFB3]/20"
          >
            <div className="grid md:grid-cols-2 h-full">
              {/* Left: Image */}
              <div className="relative overflow-hidden" style={{ minHeight: "300px" }}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A1628]/80" />
                <span
                  className="absolute top-6 left-6 px-3 py-1 font-mono text-xs tracking-widest text-black font-bold"
                  style={{ backgroundColor: project.tagColor }}
                >
                  {project.tag}
                </span>
              </div>

              {/* Right: Content */}
              <div className="p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-3">
                      <span className="px-3 py-1 border border-white/10 font-mono text-xs text-white/40">{project.year}</span>
                      <span className="px-3 py-1 border border-white/10 font-mono text-xs text-white/40">{project.role}</span>
                    </div>
                    <button
                      onClick={onClose}
                      className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-[#00FFB3] transition-colors duration-300"
                    >
                      ✕
                    </button>
                  </div>

                  <h2 className="font-display text-4xl md:text-5xl text-white mb-6 leading-none">{project.title}</h2>
                  <p className="text-white/60 leading-relaxed mb-8">{project.description}</p>

                  <div className="mb-8">
                    <h4 className="font-mono text-xs tracking-widest text-[#00FFB3] mb-4">TECH STACK</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-4 py-2 border border-white/10 font-mono text-xs text-white/60 hover:border-[#00FFB3] hover:text-[#00FFB3] transition-colors duration-300"
                        >
                          {t.replace("#", "")}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a
                    href={project.github}
                    className="flex-1 py-4 border border-white/20 flex items-center justify-center gap-3 font-display tracking-wider text-white/60 hover:border-[#00FFB3] hover:text-[#00FFB3] transition-colors duration-300"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    SOURCE CODE
                  </a>
                  <a
                    href={project.link}
                    className="flex-1 py-4 bg-gradient-to-r from-[#00FFB3] to-[#00D4FF] flex items-center justify-center gap-3 font-display tracking-wider text-black"
                  >
                    LIVE DEMO ↗
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
