import React from "react";
import { FaBook, FaShippingFast, FaSmile, FaQuoteLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{styles}</style>

      {/* ── Hero ── */}
      <section className="ab-hero">
        <div className="ab-hero-orb ab-hero-orb1" aria-hidden="true" />
        <div className="ab-hero-orb ab-hero-orb2" aria-hidden="true" />
        <div className="ab-hero-inner">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="ab-hero-badge"
          >
            <FaBook /> &nbsp; Est. 2024
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="ab-hero-title"
          >
            About BookMart
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="ab-hero-sub"
          >
            Your one-stop online bookstore for all your reading adventures.
            We bring your favourite books closer with ease and convenience.
          </motion.p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="ab-section ab-mission">
        <div className="ab-container ab-container--narrow">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="ab-label"
          >
            Who we are
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="ab-section-title"
          >
            Our Mission
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="ab-mission-text"
          >
            At BookMart, our mission is to ignite a love for reading by providing
            easy access to a wide range of books. Whether you're looking for the
            latest bestseller, a classic novel, or educational materials, we make
            reading accessible and enjoyable for everyone.
          </motion.p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="ab-section ab-features-section">
        <div className="ab-container">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="ab-label ab-label--center"
          >
            Why choose us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="ab-section-title ab-section-title--center"
          >
            What We Offer
          </motion.h2>
          <div className="ab-features-grid">
            {[
              {
                icon: <FaBook />,
                title: "Wide Selection",
                description: "Thousands of titles across all genres to satisfy every reader.",
                color: "#3b82f6",
                bg: "#eff6ff",
              },
              {
                icon: <FaShippingFast />,
                title: "Fast Delivery",
                description: "Quick and reliable shipping, right to your doorstep.",
                color: "#10b981",
                bg: "#ecfdf5",
              },
              {
                icon: <FaSmile />,
                title: "Customer Satisfaction",
                description: "We prioritize our customers with excellent support and service.",
                color: "#f59e0b",
                bg: "#fffbeb",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -6 }}
                className="ab-feature-card"
              >
                <div
                  className="ab-feature-icon"
                  style={{ color: feature.color, background: feature.bg }}
                >
                  {feature.icon}
                </div>
                <h3 className="ab-feature-title">{feature.title}</h3>
                <p className="ab-feature-desc">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="ab-section ab-testimonials-section">
        <div className="ab-container">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="ab-label ab-label--center"
          >
            Reader stories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="ab-section-title ab-section-title--center"
          >
            What Our Readers Say
          </motion.h2>
          <div className="ab-testimonials-grid">
            {[
              { name: "Alice", feedback: "BookMart has the best collection and fast delivery!" },
              { name: "John", feedback: "I love the easy navigation and amazing customer service." },
              { name: "Sophie", feedback: "A paradise for book lovers. Highly recommended!" },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="ab-testimonial-card"
              >
                <FaQuoteLeft className="ab-quote-icon" />
                <p className="ab-testimonial-text">{t.feedback}</p>
                <div className="ab-testimonial-footer">
                  <div className="ab-testimonial-avatar">
                    {t.name[0]}
                  </div>
                  <span className="ab-testimonial-name">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ab-cta">
        <div className="ab-cta-orb ab-cta-orb1" aria-hidden="true" />
        <div className="ab-cta-orb ab-cta-orb2" aria-hidden="true" />
        <div className="ab-cta-inner">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="ab-cta-title"
          >
            Join Our Reading Community
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="ab-cta-sub"
          >
            Explore our collection and find your next favourite book today.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            href="/books"
            className="ab-cta-btn"
          >
            Browse Books →
          </motion.a>
        </div>
      </section>
    </div>
  );
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --bg:         #f8f9fc;
    --card:       #ffffff;
    --border:     #e8eaf0;
    --ink:        #111827;
    --ink-soft:   #6b7280;
    --ink-faint:  #9ca3af;
    --blue:       #2563eb;
    --blue-dark:  #1d4ed8;
    --blue-pale:  #eff6ff;
    --shadow-sm:  0 1px 4px rgba(0,0,0,0.06);
    --shadow-md:  0 6px 24px rgba(0,0,0,0.08);
    --shadow-lg:  0 16px 48px rgba(0,0,0,0.11);
    --radius:     20px;
    --radius-sm:  12px;
  }

  * { box-sizing: border-box; }

  /* ── HERO ──────────────────────────────────────── */
  .ab-hero {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #4f46e5 100%);
    padding: 5rem 1rem 4.5rem;
    text-align: center;
  }

  .ab-hero-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .ab-hero-orb1 {
    width: 400px; height: 400px;
    top: -120px; left: -80px;
    background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
  }
  .ab-hero-orb2 {
    width: 320px; height: 320px;
    bottom: -100px; right: -60px;
    background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
  }

  .ab-hero-inner {
    position: relative;
    z-index: 1;
    max-width: 720px;
    margin: 0 auto;
  }

  .ab-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.9);
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.35rem 0.9rem;
    border-radius: 100px;
    margin-bottom: 1.25rem;
  }

  .ab-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.4rem, 8vw, 4.5rem);
    font-weight: 700;
    color: #fff;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
  }

  .ab-hero-sub {
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
    color: rgba(255,255,255,0.82);
    font-weight: 300;
    line-height: 1.7;
    max-width: 560px;
    margin: 0 auto;
  }

  @media (max-width: 480px) {
    .ab-hero { padding: 3.5rem 1rem 3rem; }
  }

  /* ── SHARED LAYOUT ─────────────────────────────── */
  .ab-section {
    padding: 4rem 1rem;
  }

  @media (min-width: 640px) {
    .ab-section { padding: 5rem 1.5rem; }
  }

  .ab-container {
    max-width: 1160px;
    margin: 0 auto;
  }

  .ab-container--narrow {
    max-width: 720px;
    margin: 0 auto;
  }

  .ab-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--blue);
    margin-bottom: 0.6rem;
  }
  .ab-label--center { text-align: center; }

  .ab-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.75rem, 4vw, 2.75rem);
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.02em;
    margin-bottom: 1.25rem;
  }
  .ab-section-title--center { text-align: center; }

  /* ── MISSION ───────────────────────────────────── */
  .ab-mission {
    background: var(--bg);
    text-align: center;
  }

  .ab-mission-text {
    font-size: clamp(0.95rem, 2vw, 1.1rem);
    color: var(--ink-soft);
    line-height: 1.85;
    font-weight: 400;
  }

  /* ── FEATURES ──────────────────────────────────── */
  .ab-features-section {
    background: var(--card);
  }

  .ab-features-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
    margin-top: 2.5rem;
  }

  @media (min-width: 640px) {
    .ab-features-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
  }

  .ab-feature-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.75rem 1.5rem;
    text-align: center;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.3s;
  }

  .ab-feature-card:hover {
    box-shadow: var(--shadow-md);
  }

  .ab-feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 58px;
    border-radius: 16px;
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  .ab-feature-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 0.5rem;
  }

  .ab-feature-desc {
    font-size: 0.9rem;
    color: var(--ink-soft);
    line-height: 1.65;
  }

  /* ── TESTIMONIALS ──────────────────────────────── */
  .ab-testimonials-section {
    background: var(--bg);
  }

  .ab-testimonials-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
    margin-top: 2.5rem;
  }

  @media (min-width: 640px) {
    .ab-testimonials-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
  }

  .ab-testimonial-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.75rem 1.5rem;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: box-shadow 0.3s;
  }

  .ab-testimonial-card:hover {
    box-shadow: var(--shadow-md);
  }

  .ab-quote-icon {
    color: var(--blue);
    opacity: 0.25;
    font-size: 1.25rem;
  }

  .ab-testimonial-text {
    font-size: 0.95rem;
    color: var(--ink-soft);
    line-height: 1.75;
    font-style: italic;
    flex: 1;
  }

  .ab-testimonial-footer {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .ab-testimonial-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    color: #fff;
    font-size: 0.85rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ab-testimonial-name {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--ink);
  }

  /* ── CTA ───────────────────────────────────────── */
  .ab-cta {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #4f46e5 100%);
    padding: 5rem 1rem;
    text-align: center;
  }

  .ab-cta-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }
  .ab-cta-orb1 {
    width: 350px; height: 350px;
    top: -100px; right: -60px;
    background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
  }
  .ab-cta-orb2 {
    width: 280px; height: 280px;
    bottom: -80px; left: -40px;
    background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
  }

  .ab-cta-inner {
    position: relative;
    z-index: 1;
    max-width: 640px;
    margin: 0 auto;
  }

  .ab-cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.9rem, 5vw, 3rem);
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .ab-cta-sub {
    font-size: clamp(0.9rem, 2.5vw, 1.05rem);
    color: rgba(255,255,255,0.82);
    margin-bottom: 2rem;
    font-weight: 300;
    line-height: 1.65;
  }

  .ab-cta-btn {
    display: inline-block;
    background: #fff;
    color: var(--blue);
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: clamp(0.875rem, 2vw, 1rem);
    padding: 0.9rem 2.25rem;
    border-radius: 100px;
    text-decoration: none;
    box-shadow: 0 6px 24px rgba(0,0,0,0.18);
    transition: background 0.2s, box-shadow 0.2s;
  }

  .ab-cta-btn:hover {
    background: #f0f4ff;
    box-shadow: 0 10px 32px rgba(0,0,0,0.22);
  }

  @media (max-width: 480px) {
    .ab-cta { padding: 3.5rem 1rem; }
  }
`;

export default AboutPage;