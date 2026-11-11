'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/Layout';
import { INTRO } from '@/content/intro';
import styles from './home.module.css';

export interface HomeItem {
  kind: 'article' | 'note';
  key: string;
  title: string;
  excerpt: string;
  english?: { title: string; excerpt: string };
  /** YYYY-MM-DD，部分旧文章只有 YYYY-MM */
  date: string;
  href: string;
  hasVideo?: boolean;
}

/**
 * 首页左侧的个人信息。介绍文案是占位稿，待重新撰写后替换 intro 即可。
 * （不再读取 about.json）
 */
const PROFILE = {
  name: '陈小宇 / Rain',
  avatar: 'https://avatars.githubusercontent.com/Rain1601?s=360',
  intro: {
    zh: '研究 Agent 如何工作，也动手把它做出来。',
    en: 'Studying how agents work — and building them.',
  },
  github: 'https://github.com/Rain1601',
  email: 'rain1104@foxmail.com',
};

/** 首页每栏最多显示几条，其余通过「全部 →」进入对应页面 */
const PER_COLUMN = 5;

type View = 'list' | 'intro';

const translations = {
  zh: {
    latest: '最新',
    article: '文章',
    note: '随笔',
    video: '视频',
    all: '全部',
    read: '阅读',
    more: (n: number) => `还有 ${n} 篇`,
    projects: '作品 · Uteki',
    empty: '还没有内容。',
    introBtn: '个人介绍',
    collapse: '收起',
    introTitle: '个人介绍',
    back: '返回文章列表',
    now: '正在做',
    experience: '经历',
  },
  en: {
    latest: 'Latest',
    article: 'Articles',
    note: 'Notes',
    video: 'Video',
    all: 'All',
    read: 'Read',
    more: (n: number) => `${n} more`,
    projects: 'Projects · Uteki',
    empty: 'Nothing yet.',
    introBtn: 'About me',
    collapse: 'Close',
    introTitle: 'About me',
    back: 'Back to writing',
    now: 'Now',
    experience: 'Experience',
  },
};

/** 2026-11-05 → 2026.11.05；只有月份的旧文章显示 2025.09 */
const dotDate = (date: string) => date.slice(0, 10).replace(/-/g, '.');

/** 一栏：标题 + 数量 + 全部 →，下面是「日期 标题」一行一条 */
function Column({
  label,
  total,
  href,
  items,
  more,
  t,
}: {
  label: string;
  total: number;
  href: string;
  items: HomeItem[];
  /** 超出 PER_COLUMN 没显示的条数，> 0 时在末尾显示「……」 */
  more: number;
  t: (typeof translations)['zh'];
}) {
  return (
    <section className={styles.column}>
      <header className={styles.columnHead}>
        <h2 className={styles.columnTitle}>
          {label}
          <span className={styles.count}>{total}</span>
        </h2>
        <Link href={href} className={styles.allLink}>{t.all} →</Link>
      </header>
      {items.length === 0 ? (
        <p className={styles.empty}>{t.empty}</p>
      ) : (
        <ul className={styles.rows}>
          {items.map((item) => (
            <li key={item.key}>
              <Link href={item.href} className={styles.row} title={item.title}>
                <span className={styles.rowDate}>{dotDate(item.date)}</span>
                <span className={styles.rowTitle}>{item.title}</span>
                {item.hasVideo && <span className={styles.rowBadge}>{t.video}</span>}
                <span className={styles.rowArrow} aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
          {more > 0 && (
            <li>
              <Link href={href} className={styles.moreRow}>
                <span className={styles.moreDots} aria-hidden="true">……</span>
                <span>{t.more(more)} →</span>
              </Link>
            </li>
          )}
        </ul>
      )}
    </section>
  );
}

export default function HomeClient({ items: sourceItems }: { items: HomeItem[] }) {
  const { language } = useLanguage();
  const t = translations[language];
  const items = language === 'en' ? sourceItems.map((item) => ({ ...item, ...item.english })) : sourceItems;
  const [view, setView] = useState<View>('list');
  const backRef = useRef<HTMLButtonElement>(null);
  const introBtnRef = useRef<HTMLButtonElement>(null);
  const firstRender = useRef(true);

  // 最新一篇单独放在顶部，两栏里不再重复
  const latest = items[0];
  const rest = items.slice(1);
  const articles = rest.filter((i) => i.kind === 'article');
  const notes = rest.filter((i) => i.kind === 'note');
  const totalArticles = items.filter((i) => i.kind === 'article').length;
  const totalNotes = items.filter((i) => i.kind === 'note').length;

  // 切换视图后把焦点放到对应按钮上（键盘用户不会丢失位置）；Esc 从介绍返回列表
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (view === 'intro') backRef.current?.focus({ preventScroll: true });
    else introBtnRef.current?.focus({ preventScroll: true });
  }, [view]);

  useEffect(() => {
    if (view !== 'intro') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView('list');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view]);

  return (
    <div className={styles.page}>
      {/* ---- 左：个人信息 ---- */}
      <aside className={styles.profile}>
        <Image src={PROFILE.avatar} alt="Rain" width={180} height={180} className={styles.avatar} priority />
        <h1 className={styles.name}>{PROFILE.name}</h1>
        <p className={styles.intro}>{PROFILE.intro[language]}</p>
        <ul className={styles.links}>
          <li><Link href="/product">{t.projects}</Link></li>
          <li>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className={styles.githubProfileLink}>
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              GitHub
            </a>
          </li>
          <li><a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a></li>
        </ul>
        <button
          ref={introBtnRef}
          type="button"
          className={`${styles.introBtn} ${view === 'intro' ? styles.introBtnActive : ''}`}
          onClick={() => setView(view === 'intro' ? 'list' : 'intro')}
          aria-expanded={view === 'intro'}
        >
          {/* 两种文字叠在同一格里，按钮宽度取较长的那个，切换时不跳动 */}
          <span className={styles.introLabels}>
            <span className={view === 'intro' ? styles.labelHidden : ''} aria-hidden={view === 'intro'}>
              {t.introBtn} →
            </span>
            <span className={view === 'intro' ? '' : styles.labelHidden} aria-hidden={view !== 'intro'}>
              ← {t.collapse}
            </span>
          </span>
        </button>
      </aside>

      {/* ---- 右：写作索引 ⇄ 个人介绍（左右滑动切换） ---- */}
      <div className={`${styles.panel} ${view === 'intro' ? styles.panelIntro : ''}`}>
        {/* 写作索引：最新一篇 + 文章 / 随笔两栏 */}
        <section className={`${styles.view} ${styles.listView}`} inert={view !== 'list'} aria-hidden={view !== 'list'}>
          <div className={styles.scroll}>
            {latest && (
              <Link href={latest.href} className={styles.latest}>
                <span className={styles.latestMeta}>
                  <span className={styles.latestBadge}>{t.latest}</span>
                  <span className={latest.kind === 'note' ? styles.kindNote : styles.kindArticle}>
                    {latest.kind === 'note' ? t.note : t.article}
                  </span>
                  <span>{dotDate(latest.date)}</span>
                  {latest.hasVideo && <span>{t.video}</span>}
                </span>
                <span className={styles.latestTitle}>{latest.title}</span>
                {latest.excerpt && <span className={styles.latestExcerpt}>{latest.excerpt}</span>}
                <span className={styles.latestRead}>{t.read} →</span>
              </Link>
            )}

            <div className={styles.columns}>
              <Column
                label={t.article}
                total={totalArticles}
                href="/articles"
                items={articles.slice(0, PER_COLUMN)}
                more={Math.max(articles.length - PER_COLUMN, 0)}
                t={t}
              />
              <Column
                label={t.note}
                total={totalNotes}
                href="/notes"
                items={notes.slice(0, PER_COLUMN)}
                more={Math.max(notes.length - PER_COLUMN, 0)}
                t={t}
              />
            </div>
          </div>
        </section>

        {/* 个人介绍 */}
        <section
          className={`${styles.view} ${styles.introView}`}
          inert={view !== 'intro'}
          aria-hidden={view !== 'intro'}
          aria-label={t.introTitle}
        >
          <div className={styles.introHead}>
            <h2 className={styles.introTitle}>{t.introTitle}</h2>
            <button ref={backRef} type="button" className={styles.backBtn} onClick={() => setView('list')} aria-label={t.back} title={t.back}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 14 4 9l5-5" />
                <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
              </svg>
            </button>
          </div>

          <div className={styles.scroll}>
            <div className={styles.bio}>
              {INTRO.bio.map((p, i) => (
                <p key={i}>{p[language]}</p>
              ))}
            </div>

            <h3 className={styles.introSection}>{t.now}</h3>
            <ul className={styles.introList}>
              {INTRO.now.map((n) => (
                <li key={n.title.en}>
                  {n.href ? <Link href={n.href}>{n.title[language]} →</Link> : <span>{n.title[language]}</span>}
                </li>
              ))}
            </ul>

            <h3 className={styles.introSection}>{t.experience}</h3>
            <ul className={styles.introList}>
              {INTRO.experience.map((e) => (
                <li key={`${e.title.en}-${e.period}`} className={styles.expRow}>
                  <span>
                    {e.title[language]}
                    <span className={styles.expDetail}>{e.detail[language]}</span>
                  </span>
                  <span className={styles.expPeriod}>{e.period}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
