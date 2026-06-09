'use client';

import { Suspense, useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/components/Layout';
import { productData, sectionTitles } from '@/content/product/config';
import PixelRain from './PixelRain';
import styles from './page.module.css';

// useSearchParams() must live under a Suspense boundary so the rest of the
// page stays inert during the initial-params resolution.
export default function ProductPage() {
  return (
    <Suspense fallback={null}>
      <ProductPageInner />
    </Suspense>
  );
}

const SLIDE_OUT_MS = 240;
const SLIDE_SETTLE_MS = 60;
const SCROLL_CLOSE_THRESHOLD = 80; // cumulative upward px at scrollTop=0
const ARM_SCROLL_PX = 8;            // user must scroll down at least this far first

function ProductPageInner() {
  const { language } = useLanguage();
  const t = sectionTitles[language];
  const searchParams = useSearchParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const detailRef = useRef<HTMLDivElement>(null);
  const slideOutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slideSettleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slideRafRef = useRef<number | null>(null);

  const product = productData[currentIndex];
  const total = productData.length;
  const isUteki = product.id === 'uteki';
  const hasDetail = !!(product.highlights && product.highlights.length > 0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Reset iframe load state whenever the slide changes
  useEffect(() => {
    setIframeLoaded(false);
  }, [currentIndex]);

  // Deep-link: reactive to soft navigation, gated by hasDetail so we never open
  // an empty detail panel for products without highlights (e.g. coming-soon).
  useEffect(() => {
    const projectId = searchParams.get('project') || searchParams.get('detail');
    if (!projectId) return;
    const index = productData.findIndex((item) => item.id === projectId);
    if (index < 0) return;
    const target = productData[index];
    const targetHasDetail = !!(target.highlights && target.highlights.length > 0);
    setCurrentIndex(index);
    if (targetHasDetail) setDetailOpen(true);
  }, [searchParams]);

  const clearSlideTimers = useCallback(() => {
    if (slideOutTimerRef.current) {
      clearTimeout(slideOutTimerRef.current);
      slideOutTimerRef.current = null;
    }
    if (slideSettleTimerRef.current) {
      clearTimeout(slideSettleTimerRef.current);
      slideSettleTimerRef.current = null;
    }
    if (slideRafRef.current) {
      cancelAnimationFrame(slideRafRef.current);
      slideRafRef.current = null;
    }
  }, []);

  const goTo = useCallback((index: number) => {
    if (index === currentIndex || isAnimating || detailOpen) return;
    setDirection(index > currentIndex ? 'right' : 'left');
    setIsAnimating(true);
    clearSlideTimers();
    slideOutTimerRef.current = setTimeout(() => {
      setCurrentIndex(index);
      slideRafRef.current = requestAnimationFrame(() => {
        slideSettleTimerRef.current = setTimeout(
          () => setIsAnimating(false),
          SLIDE_SETTLE_MS,
        );
      });
    }, SLIDE_OUT_MS);
  }, [currentIndex, isAnimating, detailOpen, clearSlideTimers]);

  useEffect(() => () => clearSlideTimers(), [clearSlideTimers]);

  const goPrev = useCallback(() => {
    if (detailOpen) return;
    goTo(currentIndex === 0 ? total - 1 : currentIndex - 1);
  }, [currentIndex, total, goTo, detailOpen]);

  const goNext = useCallback(() => {
    if (detailOpen) return;
    goTo(currentIndex === total - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, total, goTo, detailOpen]);

  const openDetail = useCallback(() => {
    if (!hasDetail) return;
    setDetailOpen(true);
  }, [hasDetail]);

  const closeDetail = useCallback(() => setDetailOpen(false), []);

  // Scroll-to-close: require the user to have scrolled down first (armed), then
  // accumulate genuine upward wheel intent at the top before closing. Touch
  // devices never reach this (wheel events do not fire) — for them the back
  // button is the canonical close path.
  useEffect(() => {
    const el = detailRef.current;
    if (!el || !detailOpen) return;

    let upwardAccum = 0;
    let armed = false;

    const onScroll = () => {
      if (el.scrollTop > ARM_SCROLL_PX) {
        armed = true;
        upwardAccum = 0;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!armed) return;
      if (el.scrollTop > 0) {
        upwardAccum = 0;
        return;
      }
      if (e.deltaY >= 0) {
        upwardAccum = 0;
        return;
      }
      upwardAccum += -e.deltaY;
      if (upwardAccum >= SCROLL_CLOSE_THRESHOLD) {
        upwardAccum = 0;
        closeDetail();
      }
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('wheel', onWheel);
    };
  }, [detailOpen, closeDetail]);

  // Keyboard navigation — bail out when the user is focused on a form or
  // interactive element so we never hijack their Enter / ArrowDown.
  useEffect(() => {
    const isInteractive = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        tag === 'BUTTON' ||
        tag === 'A' ||
        target.isContentEditable
      );
    };

    const handleKey = (e: KeyboardEvent) => {
      if (detailOpen) {
        if (e.key === 'Escape') closeDetail();
        return;
      }
      if (e.key === 'ArrowLeft') {
        if (!isInteractive(e.target)) goPrev();
        return;
      }
      if (e.key === 'ArrowRight') {
        if (!isInteractive(e.target)) goNext();
        return;
      }
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        if (isInteractive(e.target)) return;
        if (hasDetail) openDetail();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext, detailOpen, closeDetail, hasDetail, openDetail]);

  const contentClass = isAnimating
    ? (direction === 'right' ? styles.contentExit : styles.contentExitReverse)
    : styles.contentEnter;

  return (
    <div className={`${styles.page} ${mounted ? styles.pageMounted : ''}`}>
      <div className={styles.solidBg} />

      {/* ===== Hero view ===== */}
      <div className={`${styles.heroView} ${detailOpen ? styles.heroSlideUp : ''}`}>
        {isUteki && !detailOpen && <PixelRain />}
        <div className={`${styles.content} ${contentClass}`}>
          <div className={styles.topLeft}>
            <span className={styles.tagline}>{language === 'zh' ? '作品集' : 'Portfolio'}</span>
            <h1 className={styles.heroTitle}>{t.title}</h1>
          </div>

          <div className={styles.center}>
            {product.logo && (
              <img src={product.logo} alt="" className={styles.productLogo} />
            )}
            <span className={styles.indexLabel}>
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <h2 className={styles.productName}>{product.title[language]}</h2>
            {product.tagline && (
              <p className={styles.productTagline}>{product.tagline[language]}</p>
            )}

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

      {/* ===== Detail view ===== */}
      <div ref={detailRef} className={`${styles.detailView} ${isUteki ? styles.utekiDetailView : ''} ${detailOpen ? styles.detailSlideIn : ''}`}>
        <div className={`${styles.detailContent} ${isUteki ? styles.utekiDetailContent : ''}`}>
          {isUteki ? (
            <section className={`${styles.detailScreen} ${styles.utekiSingleScreen}`}>
              <div className={styles.utekiDetailTop}>
                <div className={styles.utekiTitleBlock}>
                  <span className={styles.detailIndex}>
                    {String(currentIndex + 1).padStart(2, '0')}
                  </span>
                  <h2 className={styles.detailTitle}>{product.title[language]}</h2>
                  <p className={styles.utekiDetailDesc}>{product.description[language]}</p>
                </div>

                <div className={styles.utekiActions}>
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
                  <button className={styles.backBtn} onClick={closeDetail} title="Esc">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"/>
                    </svg>
                    <span>{language === 'zh' ? '返回' : 'Back'}</span>
                  </button>
                </div>
              </div>

              {product.interactiveDemo && (
                <section className={`${styles.demoFrameSection} ${styles.utekiDemoSection}`}>
                  <div className={styles.utekiDemoHeader}>
                    <div>
                      <span className={styles.demoEyebrow}>
                        {language === 'zh' ? '运行过程' : 'Live Flow'}
                      </span>
                      <h3 className={styles.demoTitle}>{product.interactiveDemo.title[language]}</h3>
                    </div>
                    <a
                      href={product.interactiveDemo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.demoOpenLink}
                    >
                      {language === 'zh' ? '打开完整 Demo' : 'Open Full Demo'} →
                    </a>
                  </div>

                  <div className={styles.utekiDemoLayout}>
                    <div className={`${styles.demoFrameShell} ${styles.utekiDemoFrameShell}`}>
                      <div
                        className={`${styles.demoFrameSkeleton} ${iframeLoaded ? styles.demoFrameSkeletonHidden : ''}`}
                        aria-hidden="true"
                      >
                        <span className={styles.demoFrameSkeletonHint}>
                          {language === 'zh' ? '正在加载演示…' : 'Loading demo…'}
                        </span>
                      </div>
                      <iframe
                        key={product.id}
                        src={product.interactiveDemo.url}
                        title={product.interactiveDemo.title[language]}
                        className={`${styles.demoFrame} ${iframeLoaded ? styles.demoFrameLoaded : ''}`}
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                        referrerPolicy="no-referrer-when-downgrade"
                        onLoad={() => setIframeLoaded(true)}
                      />
                    </div>

                    {product.architecture && (
                      <aside className={styles.utekiRuntimePanel}>
                        <div>
                          <span className={styles.demoEyebrow}>
                            {language === 'zh' ? 'Agent 架构' : 'Agent Architecture'}
                          </span>
                          <h3 className={styles.utekiRuntimeTitle}>
                            {product.architecture.title[language]}
                          </h3>
                          <p>{product.architecture.desc[language]}</p>
                        </div>

                        <div className={styles.utekiStageList}>
                          {product.architecture.stages.map((stage, i) => (
                            <div
                              key={stage.label}
                              className={styles.utekiStageItem}
                              style={{ animationDelay: `${0.18 + i * 0.05}s` }}
                            >
                              <span>{stage.label}</span>
                              <div>
                                <h4>{stage.title[language]}</h4>
                                <p>{stage.desc[language]}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className={styles.utekiCapabilityRail}>
                          {product.architecture.capabilities.map((capability, i) => (
                            <div
                              key={`cap-${i}`}
                              style={{ animationDelay: `${0.36 + i * 0.05}s` }}
                            >
                              <strong>{capability.title[language]}</strong>
                              <span>{capability.items[language].slice(0, 2).join(' / ')}</span>
                            </div>
                          ))}
                        </div>
                      </aside>
                    )}
                  </div>
                </section>
              )}

              <div className={`${styles.detailTech} ${styles.utekiTech}`}>
                <span className={styles.detailTechLabel}>
                  {language === 'zh' ? '技术栈' : 'Tech Stack'}
                </span>
                <div className={styles.techStack}>
                  {product.techStack.map((tech) => (
                    <span key={tech} className={styles.techTag}>{tech}</span>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <>
          <section className={styles.detailScreen}>
            <div className={styles.detailHeader}>
              <div className={styles.detailHeaderTop}>
                <div>
                  <span className={styles.detailIndex}>
                    {String(currentIndex + 1).padStart(2, '0')}
                  </span>
                  <h2 className={styles.detailTitle}>{product.title[language]}</h2>
                </div>
                <button className={styles.backBtn} onClick={closeDetail} title="Esc">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                  <span>{language === 'zh' ? '返回' : 'Back'}</span>
                </button>
              </div>
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

            {product.interactiveDemo && (
              <section className={styles.demoFrameSection}>
                <div className={styles.demoFrameHeader}>
                  <div>
                    <span className={styles.demoEyebrow}>
                      {language === 'zh' ? '运行过程' : 'Live Flow'}
                    </span>
                    <h3 className={styles.demoTitle}>
                      {product.interactiveDemo.title[language]}
                    </h3>
                    <p className={styles.demoDesc}>
                      {product.interactiveDemo.desc[language]}
                    </p>
                  </div>
                  <a
                    href={product.interactiveDemo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.demoOpenLink}
                  >
                    {language === 'zh' ? '打开完整 Demo' : 'Open Full Demo'} →
                  </a>
                </div>
                <div className={styles.demoFrameShell}>
                  <div
                    className={`${styles.demoFrameSkeleton} ${iframeLoaded ? styles.demoFrameSkeletonHidden : ''}`}
                    aria-hidden="true"
                  >
                    <span className={styles.demoFrameSkeletonHint}>
                      {language === 'zh' ? '正在加载演示…' : 'Loading demo…'}
                    </span>
                  </div>
                  <iframe
                    key={product.id}
                    src={product.interactiveDemo.url}
                    title={product.interactiveDemo.title[language]}
                    className={`${styles.demoFrame} ${iframeLoaded ? styles.demoFrameLoaded : ''}`}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={() => setIframeLoaded(true)}
                  />
                </div>
              </section>
            )}

            {product.demoVideo && (
              <div className={styles.videoSection}>
                <video
                  src={product.demoVideo}
                  controls
                  playsInline
                  preload="metadata"
                  className={styles.videoPlayer}
                >
                  <source src={product.demoVideo} type="video/mp4" />
                </video>
              </div>
            )}
          </section>

          {product.architecture ? (
            <section className={`${styles.detailScreen} ${styles.architectureScreen}`}>
              <div className={styles.architectureHeader}>
                <span className={styles.demoEyebrow}>
                  {language === 'zh' ? 'Agent 架构' : 'Agent Architecture'}
                </span>
                <h3 className={styles.architectureTitle}>{product.architecture.title[language]}</h3>
                <p className={styles.architectureDesc}>{product.architecture.desc[language]}</p>
              </div>

              <div className={styles.architectureFlow}>
                {product.architecture.stages.map((stage, i) => (
                  <div
                    key={stage.label}
                    className={styles.architectureStage}
                    style={{ animationDelay: `${0.24 + i * 0.06}s` }}
                  >
                    <span className={styles.stageLabel}>{stage.label}</span>
                    <h4>{stage.title[language]}</h4>
                    <p>{stage.desc[language]}</p>
                  </div>
                ))}
              </div>

              <div className={styles.capabilityGrid}>
                {product.architecture.capabilities.map((capability, i) => (
                  <div
                    key={`cap-${i}`}
                    className={styles.capabilityCard}
                    style={{ animationDelay: `${0.36 + i * 0.08}s` }}
                  >
                    <h4>{capability.title[language]}</h4>
                    <div className={styles.capabilityItems}>
                      {capability.items[language].map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            product.highlights && (
              <section className={styles.detailScreen}>
                <div className={styles.highlightsGrid}>
                  {product.highlights.map((h, i) => (
                    <div
                      key={i}
                      className={styles.highlightCard}
                      style={{ animationDelay: `${0.18 + i * 0.08}s` }}
                    >
                      <h3 className={styles.highlightTitle}>{h.title[language]}</h3>
                      <p className={styles.highlightDesc}>{h.desc[language]}</p>
                    </div>
                  ))}
                </div>
              </section>
            )
          )}

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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
