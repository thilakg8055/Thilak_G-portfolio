import { motion } from "framer-motion";

const socials = [
  {
    label: "GITHUB",
    href: "https://github.com/thilakg8055",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/thilak-g-8a1235322",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "EMAIL",
    href: "mailto:tilakg8055@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export default function Contact() {
  return (
    <section id="contact" className="bg-[#050A0E] py-24 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      {/* Big bg text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="font-display text-[clamp(8rem,25vw,22rem)] text-white/[0.015] whitespace-nowrap"
        >
          THILAK
        </span>
      </div>

      <div className="relative grid md:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <div>
          <span className="section-num">/ 04</span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-[clamp(3rem,7vw,6rem)] leading-none text-white mt-4 mb-8"
          >
            LET'S BUILD<br />
            SOMETHING<br />
            <span style={{ WebkitTextStroke: "2px rgba(255,255,255,0.3)", color: "transparent" }}>
              GREAT
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 leading-relaxed mb-10 max-w-md"
          >
            Got a project in mind? Let's collaborate and create something extraordinary together.
          </motion.p>

          <motion.a
            href="mailto:thilak@example.com"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-4 group"
            whileHover={{ x: 4 }}
          >
            <span className="font-display text-xl md:text-2xl text-white group-hover:gradient-text transition-all duration-300">
              Tilakg8055@gmail.com
            </span>
            <span className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/40 group-hover:border-[#00FFB3] group-hover:text-[#00FFB3] transition-colors duration-300">
              ↗
            </span>
          </motion.a>
        </div>

        {/* Right */}
        <div>
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h4 className="font-mono text-xs tracking-widest text-[#00FFB3] mb-4">CONTACT</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 p-4 border border-white/10 bg-[#0D1F2D]/40">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} className="text-white/40">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
                </svg>
                <span className="text-white/60 font-mono text-sm">+91 9901096221</span>
              </div>
              <div className="flex items-center gap-4 p-4 border border-white/10 bg-[#0D1F2D]/40">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} className="text-white/40">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-white/60 font-mono text-sm">Bangalore, Karnataka, India</span>
              </div>
            </div>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-10"
          >
            <h4 className="font-mono text-xs tracking-widest text-[#00D4FF] mb-4">SOCIALS</h4>
            <div className="flex gap-3">
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ y: -3, borderColor: "#00FFB3", color: "#00FFB3" }}
                  className="flex-1 py-4 border border-white/10 flex items-center justify-center gap-2 font-mono text-xs text-white/50 transition-colors duration-300"
                >
                  {social.icon}
                  <span className="hidden sm:inline">{social.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <h4 className="font-mono text-xs tracking-widest text-[#00FFB3] mb-4">NAVIGATE</h4>
            <div className="flex gap-6">
              {["Work", "Experience", "Skills"].map((item) => (
                <button
                  key={item}
                  onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
                  className="text-white/40 hover:text-[#00D4FF] font-body text-sm transition-colors duration-300"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="font-mono text-xs text-white/20">© 2026 Thilak.G — Crafted with passion.</span>
        <span className="font-mono text-xs text-white/20">Built with React + Tailwind CSS</span>
      </div>
    </section>
  );
}
