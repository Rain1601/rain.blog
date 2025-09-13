'use client';

import Link from 'next/link';
import { useState, createContext, useContext } from 'react';
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

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('zh');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = language === 'zh' ? [
    { name: '首页', href: '/' },
    { name: '关于我', href: '/about' },
  ] : [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
  ];

  return (
    <div className={styles.layout}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          {/* Logo - 左侧 */}
          <Link href="/" className={styles.logo}>
            Rain&apos;s Blog
          </Link>

          {/* Desktop Navigation - 中间 */}
          <div className={styles.navLinks}>
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={styles.navLink}
              >
                {item.name}
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
                className={styles.mobileNavLink}
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
        <main className={styles.main}>
          {children}
        </main>
      </LanguageContext.Provider>
    </div>
  );
}