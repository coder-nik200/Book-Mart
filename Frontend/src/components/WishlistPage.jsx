import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { wishlistAPI } from "../api/apiClient";
import { useWishlist } from "../context/WishlistContext";

const WishlistPage = () => {
  const { wishlist, fetchWishlist, removeFromWishlistLocal } = useWishlist();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      await fetchWishlist();
      setLoading(false);
    };
    loadWishlist();
  }, []);

  const removeFromWishlist = async (bookId) => {
    try {
      await wishlistAPI.removeFromWishlist(bookId);
      removeFromWishlistLocal(bookId);
    } catch (error) {
      console.error("Failed to remove book:", error);
    }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{styles}</style>

      {/* ── Hero Banner ── */}
      <section className="wl-hero">
        <div className="wl-hero-bg" aria-hidden="true" />
        <div className="wl-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="wl-hero-icon"
          >
            <FaHeart />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="wl-hero-title"
          >
            My Wishlist
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="wl-hero-sub"
          >
            Books you love and want to read next
          </motion.p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="wl-body">
        <div className="wl-container">

          {/* Loading */}
          {loading && (
            <div className="wl-loading">
              <div className="wl-spinner" />
            </div>
          )}

          {/* Empty */}
          {!loading && wishlist.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="wl-empty"
            >
              <div className="wl-empty-icon">
                <FaRegHeart />
              </div>
              <h2 className="wl-empty-title">Your wishlist is empty</h2>
              <p className="wl-empty-sub">Browse books and add your favorites ❤️</p>
            </motion.div>
          )}

          {/* Grid */}
          {!loading && wishlist.length > 0 && (
            <>
              <p className="wl-count">{wishlist.length} book{wishlist.length !== 1 ? "s" : ""} saved</p>
              <div className="wl-grid">
                {wishlist.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07 }}
                    whileHover={{ y: -6 }}
                    className="wl-card"
                  >
                    {/* Cover */}
                    <div className="wl-card-img-wrap">
                      <motion.img
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.4 }}
                        src={`http://localhost:5000${book.image?.url}`}
                        alt={book.title}
                        className="wl-card-img"
                      />
                      <div className="wl-card-overlay" aria-hidden="true" />
                    </div>

                    {/* Info */}
                    <div className="wl-card-body">
                      <h3 className="wl-card-title">{book.title}</h3>
                      <p className="wl-card-author">{book.author}</p>

                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => removeFromWishlist(book.id)}
                        className="wl-remove-btn"
                      >
                        <FaHeart />
                        <span>Remove</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --bg:        #fdf6f0;
    --card-bg:   #ffffff;
    --border:    #f0e8e0;
    --ink:       #1a1010;
    --ink-soft:  #7a6a6a;
    --ink-faint: #b8a8a8;
    --rose:      #e8304a;
    --rose-dark: #c0192e;
    --rose-pale: #fdedef;
    --rose-mid:  #f87185;
    --gold:      #c9903a;
    --shadow-sm: 0 2px 8px rgba(180,80,80,0.08);
    --shadow-md: 0 8px 32px rgba(180,80,80,0.13);
    --shadow-lg: 0 16px 48px rgba(180,80,80,0.18);
    --radius:    18px;
    --radius-sm: 12px;
  }

  /* ── HERO ────────────────────────────────────────── */
  .wl-hero {
    position: relative;
    overflow: hidden;
    padding: 4rem 1rem 3.5rem;
    text-align: center;
  }

  .wl-hero-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #e8304a 0%, #ff6b6b 45%, #ff9a8b 100%);
    z-index: 0;
  }

  .wl-hero-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 40%);
  }

  .wl-hero-inner {
    position: relative;
    z-index: 1;
    max-width: 640px;
    margin: 0 auto;
  }

  .wl-hero-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    margin-bottom: 1rem;
    font-size: 1.4rem;
    color: #fff;
    backdrop-filter: blur(8px);
  }

  .wl-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.2rem, 7vw, 3.75rem);
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.6rem;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  .wl-hero-sub {
    font-size: clamp(0.875rem, 2.5vw, 1.05rem);
    color: rgba(255,255,255,0.88);
    font-weight: 300;
    letter-spacing: 0.01em;
  }

  @media (max-width: 480px) {
    .wl-hero { padding: 3rem 1rem 2.5rem; }
    .wl-hero-icon { width: 46px; height: 46px; font-size: 1.1rem; }
  }

  /* ── BODY ────────────────────────────────────────── */
  .wl-body {
    padding: 2.5rem 0 4rem;
  }

  .wl-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  @media (min-width: 640px) {
    .wl-body { padding: 3rem 0 5rem; }
    .wl-container { padding: 0 1.5rem; }
  }

  /* ── COUNT LABEL ─────────────────────────────────── */
  .wl-count {
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-faint);
    margin-bottom: 1.5rem;
  }

  /* ── LOADING ─────────────────────────────────────── */
  .wl-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 10rem;
  }

  .wl-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border);
    border-top-color: var(--rose);
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── EMPTY STATE ─────────────────────────────────── */
  .wl-empty {
    text-align: center;
    padding: 4rem 1.5rem;
    background: var(--card-bg);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  .wl-empty-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: var(--rose-pale);
    border-radius: 50%;
    margin-bottom: 1.25rem;
    font-size: 2rem;
    color: var(--rose-mid);
  }

  .wl-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 0.5rem;
  }

  .wl-empty-sub {
    font-size: 0.9rem;
    color: var(--ink-soft);
  }

  /* ── GRID ────────────────────────────────────────── */
  .wl-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (min-width: 640px) {
    .wl-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }
  }

  @media (min-width: 768px) {
    .wl-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    .wl-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.75rem;
    }
  }

  /* ── CARD ────────────────────────────────────────── */
  .wl-card {
    background: var(--card-bg);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .wl-card:hover {
    box-shadow: var(--shadow-md);
  }

  /* Cover */
  .wl-card-img-wrap {
    position: relative;
    overflow: hidden;
    aspect-ratio: 3/4;
    background: var(--border);
  }

  .wl-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .wl-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(26,16,16,0.35) 0%, transparent 55%);
    pointer-events: none;
  }

  /* Body */
  .wl-card-body {
    padding: 0.875rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  @media (min-width: 640px) {
    .wl-card-body { padding: 1.1rem 1.1rem 1.25rem; }
  }

  .wl-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(0.95rem, 2vw, 1.1rem);
    font-weight: 600;
    color: var(--ink);
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .wl-card-author {
    font-size: 0.78rem;
    color: var(--ink-soft);
    margin-bottom: 0.65rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Remove button */
  .wl-remove-btn {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    width: 100%;
    padding: 0.55rem 0.75rem;
    border: none;
    border-radius: 100px;
    background: var(--rose-pale);
    color: var(--rose);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }

  .wl-remove-btn:hover {
    background: var(--rose);
    color: #fff;
  }

  @media (min-width: 640px) {
    .wl-remove-btn {
      font-size: 0.875rem;
      padding: 0.65rem 1rem;
    }
  }

  /* ── TINY SCREENS (< 360px) ──────────────────────── */
  @media (max-width: 359px) {
    .wl-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default WishlistPage;