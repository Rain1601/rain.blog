'use client';

import Link from 'next/link';
import { useState, createContext, useContext, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import styles from './Layout.module.css';

// 语言类型
export type Language = 'zh' | 'en';

// 语言上下文
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'zh',
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

const ReadingModeContext = createContext(false);
export const useReadingMode = () => useContext(ReadingModeContext);

type ArticleTranslation =
  | { sourceId: string; targetId: string; sourceLanguage: Language }
  | { sourceId: string; targetId: null }
  | null;
const ArticleTranslationContext = createContext<React.Dispatch<React.SetStateAction<ArticleTranslation>> | null>(null);
export const useSetArticleTranslation = () => useContext(ArticleTranslationContext)!;
const readIn = {
  zh: { en: '阅读英文版', zh: '阅读中文版' },
  en: { en: 'Read in English', zh: 'Read in Chinese' },
};

/** 首页图标（线性房子，跟随文字颜色） */
function HomeIcon() {
  return (
    <svg
      className={styles.homeIcon}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12H3l9-9 9 9h-2" />
      <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
      <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" />
    </svg>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

const LANGUAGE_FADE_OUT_MS = 240;
const INLINE_TEXT = 'a, abbr, b, br, code, em, i, kbd, mark, s, samp, small, span, strong, sub, sup, time, u, wbr';

function visibleTextElements(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const elements = new Set<HTMLElement>();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const element = node.parentElement;
    if (!(element instanceof HTMLElement) || !node.textContent?.trim() || elements.has(element)) continue;
    if (element.closest('[aria-hidden="true"], [inert]') || element.querySelector(`:not(${INLINE_TEXT})`)) continue;

    const bounds = element.getBoundingClientRect();
    const left = Math.max(bounds.left, 0);
    const top = Math.max(bounds.top, 0);
    const right = Math.min(bounds.right, window.innerWidth);
    const bottom = Math.min(bounds.bottom, window.innerHeight);
    if (left >= right || top >= bottom) continue;
    if (element.contains(document.elementFromPoint((left + right) / 2, (top + bottom) / 2))) elements.add(element);
  }

  // A paragraph with inline links or emphasis fades as one piece.
  return [...elements].filter((element) => {
    for (let parent = element.parentElement; parent !== null && parent !== root; parent = parent.parentElement) {
      if (elements.has(parent)) return false;
    }
    return true;
  });
}

async function fadePageText(root: HTMLElement, update: () => void) {
  const outgoing: Animation[] = [];
  for (const element of visibleTextElements(root)) {
    const opacity = Number(getComputedStyle(element).opacity);
    if (opacity === 0) continue;
    element.getAnimations().find((animation) => animation.id === 'language-text')?.cancel();
    outgoing.push(element.animate({ opacity: [opacity, 0] }, {
      duration: LANGUAGE_FADE_OUT_MS, easing: 'ease-in', fill: 'forwards',
    }));
  }

  await Promise.all(outgoing.map((animation) => animation.finished));
  flushSync(update);
  outgoing.forEach((animation) => animation.cancel());

  for (const element of visibleTextElements(root)) {
    element.getAnimations().find((animation) => animation.id === 'language-text')?.cancel();
    const opacity = Number(getComputedStyle(element).opacity);
    if (opacity > 0) {
      element.animate({ opacity: [0, opacity] }, { id: 'language-text', duration: 1000, easing: 'ease-in-out' });
    }
  }
}

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('zh');
  const [readingMode, setReadingMode] = useState(false);
  const [articleTranslation, setArticleTranslation] = useState<ArticleTranslation>(null);
  const pathname = usePathname();
  const layoutRef = useRef<HTMLDivElement>(null);
  const languageFadeOut = useRef(false);
  const mainRef = useRef<HTMLElement>(null);

  // 页面切换时重启 main 元素上的 pageEnter 动画（不重挂载，避免 removeChild 雷）
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    el.classList.remove(styles.pageEnter);
    // 强制 reflow，让 remove + add 生效
    void el.offsetHeight;
    el.classList.add(styles.pageEnter);
    if (!pathname.startsWith('/blog/')) setReadingMode(false);
  }, [pathname]);

  const isArticle = pathname.startsWith('/blog/');
  const articleId = isArticle ? pathname.slice('/blog/'.length) : null;
  const currentTranslation = articleTranslation?.sourceId === articleId ? articleTranslation : null;
  const translationGlyph = currentTranslation?.targetId && currentTranslation.sourceLanguage === 'en' ? 'A' : '文';
  const translationMark = <span key={articleId} className={styles.translationMark} aria-hidden="true">{translationGlyph}</span>;
  const translationLabel = currentTranslation?.targetId
    ? readIn[language][currentTranslation.sourceLanguage === 'zh' ? 'en' : 'zh']
    : (language === 'zh' ? '暂无译文' : 'No translation');
  const translationControl = isArticle && (currentTranslation === null ? (
    <span className={`${styles.articleTranslation} ${styles.translationPlaceholder}`} aria-hidden="true" />
  ) : currentTranslation.targetId ? (
    <Link href={`/blog/${currentTranslation.targetId}`} className={styles.articleTranslation} aria-label={translationLabel} title={translationLabel}>
      {translationMark}
    </Link>
  ) : (
    <span className={`${styles.articleTranslation} ${styles.translationUnavailable}`} aria-label={translationLabel} title={translationLabel}>
      {translationMark}
    </span>
  ));
  const languageLabel = language === 'zh' ? '切换为英文' : 'Switch to Chinese';
  // 只切换界面语言，不换文章（看译文用旁边的「文 / A」按钮）
  const toggleLanguage = async () => {
    if (languageFadeOut.current) return;
    const next = language === 'zh' ? 'en' : 'zh';
    const root = layoutRef.current!;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.animate || !root.getAnimations) {
      setLanguage(next);
      return;
    }
    languageFadeOut.current = true;
    await fadePageText(root, () => setLanguage(next));
    languageFadeOut.current = false;
  };
  const languageButton = (
    <button type="button" className={styles.languageToggle} onClick={toggleLanguage} aria-label={languageLabel} title={languageLabel}>
      {/* 两种语言并排显示，当前的加深加粗，另一个变灰：一眼就知道现在是哪种语言 */}
      <span className={`${styles.languageText} ${styles.languageZh} ${language === 'zh' ? styles.languageTextActive : ''}`} aria-hidden="true">中</span>
      <span className={styles.languageSep} aria-hidden="true">/</span>
      <span className={`${styles.languageText} ${styles.languageEn} ${language === 'en' ? styles.languageTextActive : ''}`} aria-hidden="true">EN</span>
    </button>
  );
  const readingLabel = language === 'zh'
    ? (readingMode ? '退出阅读模式' : '进入阅读模式')
    : (readingMode ? 'Exit reading mode' : 'Enter reading mode');
  const readingButton = isArticle && (
    <button
      type="button"
      className={`${styles.readingButton} ${readingMode ? styles.readingButtonActive : ''}`}
      onClick={() => { setReadingMode((current) => !current); setMobileOpen(false); }}
      aria-label={readingLabel}
      aria-pressed={readingMode}
      title={readingLabel}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // 顺序：首页（图标）· 随笔 · 文章 · 作品
  const navigationItems = language === 'zh' ? [
    { name: '首页', href: '/' },
    { name: '随笔', href: '/notes' },
    { name: '文章', href: '/articles' },
    { name: '作品', href: '/product' },
  ] : [
    { name: 'Home', href: '/' },
    { name: 'Notes', href: '/notes' },
    { name: 'Articles', href: '/articles' },
    { name: 'Portfolio', href: '/product' },
  ];

  const isNavActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/articles') return pathname === '/articles' || pathname.startsWith('/blog');
    return pathname.startsWith(href);
  };

  return (
    <div ref={layoutRef} className={styles.layout}>
      {/* Navigation */}
      <nav className={`${styles.navbar} ${isArticle && readingMode ? styles.navbarReading : ''}`}>
        <div className={styles.navContainer}>
          {/* 左侧：仅手机端显示首页图标（桌面端首页图标在中间导航里） */}
          <Link
            href="/"
            className={`${styles.mobileHome} ${pathname === '/' ? styles.navLinkActive : ''}`}
            aria-label={language === 'zh' ? '首页' : 'Home'}
          >
            <HomeIcon />
          </Link>

          {/* Desktop Navigation - 中间 */}
          <div className={styles.navLinks}>
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isNavActive(item.href) ? styles.navLinkActive : ''}`}
                aria-label={item.href === '/' ? item.name : undefined}
                title={item.href === '/' ? item.name : undefined}
              >
                {item.href === '/' ? <HomeIcon /> : <span>{item.name}</span>}
              </Link>
            ))}
          </div>

          {/* 右侧区域 - 语言、主题与文章阅读模式 */}
          <div className={styles.rightSection}>
            {translationControl}
            {languageButton}
            {/* 白天 / 黑夜 */}
            <ThemeToggle language={language} />

            {readingButton}
          </div>

          <div className={styles.mobileControls}>
            {translationControl}
            <ThemeToggle language={language} />
            {readingButton}
            <button
              className={styles.mobileMenuButton}
              onClick={handleDrawerToggle}
              aria-label="Toggle navigation menu"
            >
              <span className={styles.hamburger}></span>
              <span className={styles.hamburger}></span>
              <span className={styles.hamburger}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.mobileDrawer} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.drawerContent}>
          <button
            className={styles.closeButton}
            onClick={handleDrawerToggle}
            aria-label="Close navigation menu"
          >
            ✕
          </button>
          <div className={styles.mobileNavLinks}>
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.mobileNavLink} ${isNavActive(item.href) ? styles.mobileNavLinkActive : ''}`}
                onClick={handleDrawerToggle}
              >
                <span>{item.name}</span>
              </Link>
            ))}
            {/* 语言切换 */}
            <div className={styles.mobileLangSection}>
              <span className={styles.sectionTitle}>语言 / Language</span>
              {languageButton}
            </div>

          </div>
        </div>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div 
          className={styles.overlay} 
          onClick={handleDrawerToggle}
        />
      )}

      {/* Main content */}
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <ReadingModeContext.Provider value={readingMode}>
          <ArticleTranslationContext.Provider value={setArticleTranslation}>
            <main ref={mainRef} className={`${styles.main} ${styles.pageEnter}`}>
              {children}
            </main>
          </ArticleTranslationContext.Provider>
        </ReadingModeContext.Provider>
      </LanguageContext.Provider>
    </div>
  );
}
