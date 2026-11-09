'use client';

import { useEffect } from 'react';
import { applyTheme, hasStoredTheme, useTheme } from '@/utils/theme';
import styles from './Layout.module.css';

/** 白天 / 黑夜切换按钮：当前是白天显示月亮（点了变黑夜），黑夜显示太阳 */
export default function ThemeToggle({ language, className }: { language: 'zh' | 'en'; className?: string }) {
  const theme = useTheme();
  const isDark = theme === 'dark';
  const label =
    language === 'zh' ? (isDark ? '切换到白天' : '切换到黑夜') : isDark ? 'Switch to light' : 'Switch to dark';

  // 没手动选过时跟随系统：系统切换深浅色，网站跟着变
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      if (!hasStoredTheme()) applyTheme(e.matches ? 'dark' : 'light', false);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return (
    <button
      type="button"
      className={`${styles.themeToggle} ${className ?? ''}`}
      onClick={() => applyTheme(isDark ? 'light' : 'dark', true)}
      aria-label={label}
      title={label}
    >
      {/* 两个图标叠在一起，切换时一个转出、一个转入 */}
      <svg className={`${styles.themeIcon} ${isDark ? styles.themeIconOn : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M3 12h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7-.7.7m0 11.4.7.7m-12.1-.7-.7.7" />
      </svg>
      <svg className={`${styles.themeIcon} ${isDark ? '' : styles.themeIconOn}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3h.4a7.5 7.5 0 0 0 7.9 12.4A9 9 0 1 1 12 3z" />
      </svg>
    </button>
  );
}
