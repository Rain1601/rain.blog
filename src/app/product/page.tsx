'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '@/components/Layout';
import { productData, sectionTitles } from '@/content/product/config';
import styles from './page.module.css';
import ProductIllustration from './ProductIllustration';

export default function ProductPage() {
  const { language } = useLanguage();
  const t = sectionTitles[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const detailRef = useRef<HTMLDivElement>(null);
  const product = productData[currentIndex];
  const total = productData.length;

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const goTo = useCallback((index: number) => {
    if (index === currentIndex || isAnimating || detailOpen) return;
    setDirection(index > currentIndex ? 'right' : 'left');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      requestAnimationFrame(() => {
        setTimeout(() => setIsAnimating(false), 60);
      });
    }, 350);
  }, [currentIndex, isAnimating, detailOpen]);

  // Loop navigation
  const goPrev = useCallback(() => {
    if (detailOpen) return;
    const prev = currentIndex === 0 ? total - 1 : currentIndex - 1;
    goTo(prev);
  }, [currentIndex, total, goTo, detailOpen]);

  const goNext = useCallback(() => {
    if (detailOpen) return;
    const next = currentIndex === total - 1 ? 0 : currentIndex + 1;
    goTo(next);
  }, [currentIndex, total, goTo, detailOpen]);

  const openDetail = useCallback(() => {
    setDetailOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
  }, []);

  // Scroll-to-close: when detail view is scrolled to top and user keeps scrolling up, close it
  useEffect(() => {
    const el = detailRef.current;
    if (!el || !detailOpen) return;

    let lastScrollTop = 0;
    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      if (scrollTop <= 0 && lastScrollTop <= 0) {
        closeDetail();
      }
      lastScrollTop = scrollTop;
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [detailOpen, closeDetail]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (detailOpen) {
        if (e.key === 'Escape') closeDetail();
        return;
      }
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext, detailOpen, closeDetail]);

  const contentClass = isAnimating
    ? (direction === 'right' ? styles.contentExit : styles.contentExitReverse)
    : styles.contentEnter;

  const hasDetail = product.highlights && product.highlights.length > 0;

  return (
    <div className={`${styles.page} ${mounted ? styles.pageMounted : ''}`}>
      {/* Solid dark background */}
      <div className={styles.solidBg} />

      {/* Hand-drawn illustration — positioned left */}
      <div className={`${styles.illustrationWrap} ${contentClass}`}>
        <ProductIllustration projectId={product.id} />
      </div>

      {/* ===== Hero view (slides up when detail opens) ===== */}
      <div className={`${styles.heroView} ${detailOpen ? styles.heroSlideUp : ''}`}>
        {/* Content overlay */}
        <div className={`${styles.content} ${contentClass}`}>
          <div className={styles.topLeft}>
            <span className={styles.tagline}>{language === 'zh' ? '作品集' : 'Portfolio'}</span>
            <h1 className={styles.heroTitle}>{t.title}</h1>
          </div>

          <div className={styles.center}>
            <span className={styles.indexLabel}>
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <h2 className={styles.productName}>{product.title[language]}</h2>

            {hasDetail && (
              <button
                className={styles.exploreBtn}
                onClick={openDetail}
                aria-label={language === 'zh' ? '探索项目' : 'Explore project'}
              >
                <span className={styles.exploreBtnText}>
                  {language === 'zh' ? '探索' : 'Explore'}
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
            )}
          </div>

          <div className={styles.infoCard}>
            <p className={styles.productDesc}>{product.description[language]}</p>
            <div className={styles.techStack}>
              {product.techStack.map((tech) => (
                <span key={tech} className={styles.techTag}>{tech}</span>
              ))}
            </div>
            {(product.link || product.github) && (
              <div className={styles.links}>
                {product.link && (
                  <a href={product.link} target="_blank" rel="noopener noreferrer" className={styles.linkPrimary}>
                    {language === 'zh' ? '访问项目' : 'Visit'} →
                  </a>
                )}
                {product.github && (
                  <a href={product.github} target="_blank" rel="noopener noreferrer" className={styles.linkGhost}>
                    GitHub →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Arrows — always enabled for loop */}
        <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={goPrev} aria-label="Previous">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={goNext} aria-label="Next">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 15 12 9 18"/>
          </svg>
        </button>

        {/* Dots */}
        <div className={styles.dots}>
          {productData.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Project ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ===== Detail view (slides in from bottom) ===== */}
      <div ref={detailRef} className={`${styles.detailView} ${detailOpen ? styles.detailSlideIn : ''}`}>
        {/* Back button */}
        <button className={styles.backBtn} onClick={closeDetail}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
          <span>{language === 'zh' ? '返回' : 'Back'}</span>
        </button>

        <div className={styles.detailContent}>
          <div className={styles.detailHeader}>
            <span className={styles.detailIndex}>
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <h2 className={styles.detailTitle}>{product.title[language]}</h2>
            <p className={styles.detailDesc}>{product.description[language]}</p>
            <div className={styles.detailLinks}>
              {product.github && (
                <a href={product.github} target="_blank" rel="noopener noreferrer" className={styles.linkPrimary}>
                  GitHub →
                </a>
              )}
              {product.link && (
                <a href={product.link} target="_blank" rel="noopener noreferrer" className={styles.linkPrimary}>
                  {language === 'zh' ? '访问项目' : 'Visit'} →
                </a>
              )}
            </div>
          </div>

          {/* Highlights grid */}
          {product.highlights && (
            <div className={styles.highlightsGrid}>
              {product.highlights.map((h, i) => (
                <div key={i} className={styles.highlightCard}>
                  <h3 className={styles.highlightTitle}>{h.title[language]}</h3>
                  <p className={styles.highlightDesc}>{h.desc[language]}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tech stack */}
          <div className={styles.detailTech}>
            <span className={styles.detailTechLabel}>
              {language === 'zh' ? '技术栈' : 'Tech Stack'}
            </span>
            <div className={styles.techStack}>
              {product.techStack.map((tech) => (
                <span key={tech} className={styles.techTag}>{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
