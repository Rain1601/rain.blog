'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/components/Layout';
import { productData, sectionTitles } from '@/content/product/config';
import styles from './page.module.css';

export default function ProductPage() {
  const { language } = useLanguage();
  const t = sectionTitles[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  const product = productData[currentIndex];
  const total = productData.length;

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const goTo = useCallback((index: number) => {
    if (index === currentIndex || isAnimating) return;
    setDirection(index > currentIndex ? 'right' : 'left');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      requestAnimationFrame(() => {
        setTimeout(() => setIsAnimating(false), 60);
      });
    }, 350);
  }, [currentIndex, isAnimating]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  const goNext = useCallback(() => {
    if (currentIndex < total - 1) goTo(currentIndex + 1);
  }, [currentIndex, total, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext]);

  const contentClass = isAnimating
    ? (direction === 'right' ? styles.contentExit : styles.contentExitReverse)
    : styles.contentEnter;

  return (
    <div className={`${styles.page} ${mounted ? styles.pageMounted : ''}`}>
      {/* Full-screen blob background */}
      <div
        className={styles.blobBg}
        style={{ backgroundColor: product.blobBg }}
      >
        <div className={styles.blobField}>
          <div className={`${styles.blob} ${styles.b1}`} style={{ backgroundColor: product.blobColors[0] }} />
          <div className={`${styles.blob} ${styles.b2}`} style={{ backgroundColor: product.blobColors[1] }} />
          <div className={`${styles.blob} ${styles.b3}`} style={{ backgroundColor: product.blobColors[2] }} />
          <div className={`${styles.blob} ${styles.b4}`} style={{ backgroundColor: product.blobColors[3] }} />
        </div>
        {/* Noise texture overlay */}
        <div className={styles.noiseOverlay} />
      </div>

      {/* Content overlay */}
      <div className={`${styles.content} ${contentClass}`}>
        {/* Top-left: tagline */}
        <div className={styles.topLeft}>
          <span className={styles.tagline}>{language === 'zh' ? '作品集' : 'Portfolio'}</span>
          <h1 className={styles.heroTitle}>{t.title}</h1>
        </div>

        {/* Center: product title */}
        <div className={styles.center}>
          <span className={styles.indexLabel}>
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <h2 className={styles.productName}>{product.title[language]}</h2>
        </div>

        {/* Bottom-left: product info card */}
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

      {/* Left arrow */}
      <button
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={goPrev}
        disabled={currentIndex === 0}
        aria-label="Previous"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      {/* Right arrow */}
      <button
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={goNext}
        disabled={currentIndex === total - 1}
        aria-label="Next"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 6 15 12 9 18"/>
        </svg>
      </button>

      {/* Bottom center: dots */}
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
  );
}
