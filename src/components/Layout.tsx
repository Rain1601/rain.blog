'use client';

import Link from 'next/link';
import { useState, createContext, useContext, useEffect, useRef } from 'react';
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

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('zh');
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);

  // 页面切换时重启 main 元素上的 pageEnter 动画（不重挂载，避免 removeChild 雷）
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    el.classList.remove(styles.pageEnter);
    // 强制 reflow，让 remove + add 生效
    void el.offsetHeight;
    el.classList.add(styles.pageEnter);
  }, [pathname]);

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
    <div className={styles.layout}>
      {/* Navigation */}
      <nav className={styles.navbar}>
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
                key={item.name}
                href={item.href}
                className={`${styles.navLink} ${isNavActive(item.href) ? styles.navLinkActive : ''}`}
                aria-label={item.href === '/' ? item.name : undefined}
                title={item.href === '/' ? item.name : undefined}
              >
                {item.href === '/' ? <HomeIcon /> : item.name}
              </Link>
            ))}
          </div>

          {/* 右侧区域 - 语言切换 + GitHub */}
          <div className={styles.rightSection}>
            {/* Language Switcher */}
            <div className={styles.langSwitcher}>
              <button
                className={`${styles.langBtn} ${language === 'zh' ? styles.active : ''}`}
                onClick={() => setLanguage('zh')}
              >
                中文
              </button>
              <span className={styles.langDivider}>/</span>
              <button
                className={`${styles.langBtn} ${language === 'en' ? styles.active : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
            </div>

            {/* 白天 / 黑夜 */}
            <ThemeToggle language={language} />

            {/* GitHub Button */}
            <a
              href="https://github.com/Rain1601"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubButton}
              aria-label="GitHub"
            >
              <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </a>
          </div>

          {/* Mobile menu button */}
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
                key={item.name}
                href={item.href}
                className={`${styles.mobileNavLink} ${isNavActive(item.href) ? styles.mobileNavLinkActive : ''}`}
                onClick={handleDrawerToggle}
              >
                {item.name}
              </Link>
            ))}
            {/* 语言切换 */}
            <div className={styles.mobileLangSection}>
              <span className={styles.sectionTitle}>语言 / Language</span>
              <div className={styles.mobileLangButtons}>
                <button
                  className={`${styles.mobileLangBtn} ${language === 'zh' ? styles.active : ''}`}
                  onClick={() => setLanguage('zh')}
                >
                  中文
                </button>
                <button
                  className={`${styles.mobileLangBtn} ${language === 'en' ? styles.active : ''}`}
                  onClick={() => setLanguage('en')}
                >
                  English
                </button>
              </div>
            </div>

            {/* 白天 / 黑夜 */}
            <div className={styles.mobileLangSection}>
              <span className={styles.sectionTitle}>外观 / Theme</span>
              <ThemeToggle language={language} className={styles.themeToggleMobile} />
            </div>

            <a
              href="https://github.com/Rain1601"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileGithubLink}
              onClick={handleDrawerToggle}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              GitHub 仓库
            </a>
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
        <main ref={mainRef} className={`${styles.main} ${styles.pageEnter}`}>
          {children}
        </main>
      </LanguageContext.Provider>
    </div>
  );
}
