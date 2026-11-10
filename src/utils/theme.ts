'use client';

import { useSyncExternalStore } from 'react';

/**
 * 白天 / 黑夜主题。真正的状态是 <html data-theme="light|dark">：
 * - 页面绘制前由 layout.tsx 的 THEME_INIT_SCRIPT 设置（避免先闪一下浅色）；
 * - 用户点过切换，就把选择存进 localStorage，之后一直用它；
 * - 没选过就跟随系统，系统切换时也跟着变。
 */

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

/** 内联在 <head> 里、在页面绘制前执行（不能依赖任何打包代码） */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}})();`;

export function getTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/** 是否手动选过主题（选过就不再跟随系统） */
export function hasStoredTheme(): boolean {
  try {
    const t = localStorage.getItem(THEME_STORAGE_KEY);
    return t === 'light' || t === 'dark';
  } catch {
    return false;
  }
}

let transitionTimer: number | undefined;

/** 应用主题；persist 为 true 时记住用户的选择。 */
export function applyTheme(theme: Theme, persist: boolean) {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    window.clearTimeout(transitionTimer);
    root.classList.add('theme-transition');
  }
  root.setAttribute('data-theme', theme);
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* 隐私模式等情况下存不了，本次访问内仍然生效 */
    }
  }
  if (!reduceMotion) transitionTimer = window.setTimeout(() => root.classList.remove('theme-transition'), 220);
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

/** 在组件里读取当前主题，主题变化时自动重新渲染 */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, () => 'light');
}
