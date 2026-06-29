import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
      <style>{styles}</style>

      {/* ── Background ── */}
      <div className="hero-bg" aria-hidden="true" />

      {/* Animated orbs */}
      <motion.div
        className="hero-orb hero-orb1"
        animate={{ scale: [1, 1.15, 1], rotate: [0, 15, -15, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="hero-orb hero-orb2"
        animate={{ scale: [1, 1.08, 1], rotate: [0, -10, 10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="hero-orb hero-orb3"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grain overlay */}
      <div className="hero-grain" aria-hidden="true" />
      <div className="absolute inset-0 bg-black/35" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 text-center">

        {/* Badge */}
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="hero-badge-dot" />
          10,000+ books available
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight hero-heading"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
        >
          Discover Your Next{" "}
          <span className="hero-highlight">Favorite Book</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="mt-6 text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto hero-sub"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Explore thousands of books across every genre. From bestsellers to
          hidden gems — your perfect read is waiting.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Link to="/books" className="hero-btn-primary group">
            Shop Now
            <ArrowRight
              className="group-hover:translate-x-1 transition-transform duration-300"
              size={18}
            />
          </Link>

          <Link to="/about" className="hero-btn-secondary">
            Learn More
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          {[
            { value: "10K+", label: "Books" },
            { value: "50K+", label: "Readers" },
            { value: "4.9★", label: "Rating" },
          ].map((s) => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <div className="hero-scroll-pill">
            <div className="hero-scroll-dot" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* ── BACKGROUND ─────────────────────────────────── */
  .hero-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 40%, #312e81 75%, #0f172a 100%);
    z-index: 0;
  }

  /* ── ORBS ────────────────────────────────────────── */
  .hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 1;
  }
  .hero-orb1 {
    width: clamp(260px, 35vw, 420px);
    height: clamp(260px, 35vw, 420px);
    top: -100px; left: -80px;
    background: radial-gradient(circle, rgba(139,92,246,0.55), transparent 70%);
  }
  .hero-orb2 {
    width: clamp(280px, 38vw, 460px);
    height: clamp(280px, 38vw, 460px);
    bottom: -120px; right: -100px;
    background: radial-gradient(circle, rgba(234,179,8,0.35), transparent 70%);
  }
  .hero-orb3 {
    width: clamp(200px, 25vw, 300px);
    height: clamp(200px, 25vw, 300px);
    top: 40%; left: 55%;
    background: radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%);
  }

  /* ── GRAIN ───────────────────────────────────────── */
  .hero-grain {
    position: absolute;
    inset: 0;
    z-index: 2;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px;
  }

  /* ── BADGE ───────────────────────────────────────── */
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.18);
    color: rgba(255,255,255,0.88);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    padding: 0.35rem 1rem;
    border-radius: 100px;
    margin-bottom: 1.5rem;
  }

  .hero-badge-dot {
    width: 7px;
    height: 7px;
    background: #4ade80;
    border-radius: 50%;
    box-shadow: 0 0 6px #4ade80;
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* ── HEADING ─────────────────────────────────────── */
  .hero-heading {
    font-family: 'Cormorant Garamond', serif;
    text-shadow: 0 2px 40px rgba(0,0,0,0.4);
  }

  .hero-highlight {
    color: #fbbf24;
    position: relative;
    display: inline-block;
    text-shadow: 0 0 40px rgba(251,191,36,0.4), 0 2px 20px rgba(0,0,0,0.3);
  }

  /* ── SUBTEXT ─────────────────────────────────────── */
  .hero-sub {
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    text-shadow: 0 1px 12px rgba(0,0,0,0.3);
  }

  /* ── BUTTONS ─────────────────────────────────────── */
  .hero-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 2rem;
    background: #fbbf24;
    color: #1a1a1a;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.95rem;
    border-radius: 100px;
    text-decoration: none;
    box-shadow: 0 6px 30px rgba(251,191,36,0.45), 0 2px 8px rgba(0,0,0,0.2);
    transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .hero-btn-primary:hover {
    background: #fcd34d;
    transform: scale(1.05);
    box-shadow: 0 10px 40px rgba(251,191,36,0.55);
  }

  .hero-btn-secondary {
    display: inline-flex;
    align-items: center;
    padding: 0.85rem 2rem;
    border: 1.5px solid rgba(255,255,255,0.45);
    border-radius: 100px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 0.95rem;
    text-decoration: none;
    backdrop-filter: blur(8px);
    background: rgba(255,255,255,0.06);
    transition: background 0.25s, color 0.25s, border-color 0.25s;
  }
  .hero-btn-secondary:hover {
    background: rgba(255,255,255,0.92);
    color: #1e1b4b;
    border-color: transparent;
  }

  /* ── STATS ───────────────────────────────────────── */
  .hero-stats {
    display: flex;
    justify-content: center;
    gap: clamp(1.5rem, 5vw, 3.5rem);
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .hero-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
  }

  .hero-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.4rem, 4vw, 2rem);
    font-weight: 700;
    color: #fbbf24;
    line-height: 1;
  }

  .hero-stat-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
  }

  /* ── SCROLL PILL ─────────────────────────────────── */
  .hero-scroll-pill {
    width: 26px;
    height: 42px;
    border: 1.5px solid rgba(255,255,255,0.35);
    border-radius: 100px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 5px;
  }

  .hero-scroll-dot {
    width: 4px;
    height: 10px;
    background: rgba(255,255,255,0.7);
    border-radius: 100px;
    animation: scroll-bounce 1.6s ease-in-out infinite;
  }

  @keyframes scroll-bounce {
    0%, 100% { transform: translateY(0); opacity: 1; }
    50% { transform: translateY(8px); opacity: 0.4; }
  }

  /* ── RESPONSIVE ──────────────────────────────────── */
  @media (max-width: 480px) {
    .hero-badge { font-size: 0.7rem; padding: 0.3rem 0.8rem; }
    .hero-btn-primary,
    .hero-btn-secondary { padding: 0.75rem 1.6rem; font-size: 0.875rem; width: 100%; justify-content: center; }
    .hero-stats { gap: 1.25rem; }
    .hero-stat-value { font-size: 1.3rem; }
  }
`;

export default HeroSection;