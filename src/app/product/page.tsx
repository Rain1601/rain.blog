'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from '@/components/Layout';
import { productData, sectionTitles } from '@/content/product/config';
import styles from './page.module.css';

export default function ProductPage() {
  const { language } = useLanguage();
  const t = sectionTitles[language];
  const [selectedId, setSelectedId] = useState(productData[0].id);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const selected = productData.find((p) => p.id === selectedId) ?? productData[0];

  const handleSelect = useCallback((id: string) => {
    if (id === selectedId) return;
    setIsTransitioning(true);
    // Start fade-out, then swap content, then fade-in
    setTimeout(() => {
      setSelectedId(id);
      // Allow a frame for new content to render, then fade in
      requestAnimationFrame(() => {
        setIsTransitioning(false);
      });
    }, 200);
  }, [selectedId]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>
      </header>

      <div className={styles.layout}>
        {/* Left sidebar — project list */}
        <aside className={styles.sidebar}>
          {productData.map((product, index) => (
            <button
              key={product.id}
              className={`${styles.thumbCard} ${product.id === selectedId ? styles.thumbCardActive : ''}`}
              onClick={() => handleSelect(product.id)}
            >
              <div className={styles.thumbInner}>
                <div
                  className={styles.thumbPreview}
                  style={{ background: product.coverGradient }}
                />
                <div className={styles.thumbInfo}>
                  <span className={styles.thumbIndex}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.thumbLabel}>
                    {product.title[language]}
                  </span>
                </div>
              </div>
              {/* Active indicator bar */}
              <div className={styles.activeBar} />
            </button>
          ))}
        </aside>

        {/* Right detail — selected project */}
        <main className={`${styles.detail} ${isTransitioning ? styles.detailOut : styles.detailIn}`}>
          <div
            className={styles.detailPreview}
            style={{ background: selected.coverGradient }}
          >
            <span className={styles.detailPreviewLabel}>
              {selected.title[language]}
            </span>
          </div>

          <div className={styles.detailBody}>
            <h2 className={styles.detailTitle}>{selected.title[language]}</h2>
            <p className={styles.detailDescription}>
              {selected.description[language]}
            </p>
            <div className={styles.techStack}>
              {selected.techStack.map((tech) => (
                <span key={tech} className={styles.techTag}>
                  {tech}
                </span>
              ))}
            </div>
            {(selected.link || selected.github) && (
              <div className={styles.links}>
                {selected.link && (
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkBtn}
                  >
                    {language === 'zh' ? '访问' : 'Visit'} &rarr;
                  </a>
                )}
                {selected.github && (
                  <a
                    href={selected.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkBtn}
                  >
                    GitHub &rarr;
                  </a>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
