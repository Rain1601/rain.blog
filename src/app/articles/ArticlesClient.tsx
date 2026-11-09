'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/Layout';
import styles from './page.module.css';

export interface ArticleCard {
  id: string;
  title: string;
  /** YYYY-MM-DD，部分旧文章只有 YYYY-MM */
  date: string;
  excerpt: string;
  topics: string[];
}

/** 精选「书」里放最新的几篇 */
const BOOK_SIZE = 5;
/** 往后翻一页的时长（与 CSS .turnOut 一致），动画事件没触发时用它兜底 */
const TURN_MS = 700;
/** 回到开头：每页翻回的时长（与 CSS .turnBack 一致）和相邻两页的间隔 */
const BACK_MS = 520;
/** 精选卡片背后最多叠几层书页 */
const MAX_SHEETS = 2;
const BACK_STAGGER_MS = 120;

const translations = {
  zh: {
    title: '文章',
    desc: '长文、拆解与译文。',
    topics: '主题',
    all: '全部',
    featured: '精选 · 文章',
    article: '文章',
    remaining: '还有',
    unit: '篇',
    lastOne: '已是最后一篇',
    next: '下一篇',
    restart: '回到开头',
    allArticles: '全部文章',
    empty: '没有找到符合条件的文章。',
    index: '目录',
    search: '搜索文章…',
    clearSearch: '清除搜索',
  },
  en: {
    title: 'Articles',
    desc: 'Long-form writing, breakdowns, and translations.',
    topics: 'Topics',
    all: 'All',
    featured: 'Featured · Article',
    article: 'Article',
    remaining: '',
    unit: 'more',
    lastOne: 'Last one',
    next: 'Next',
    restart: 'Back to start',
    allArticles: 'All articles',
    empty: 'No matching articles.',
    index: 'Contents',
    search: 'Search articles…',
    clearSearch: 'Clear search',
  },
};

const dotDate = (date: string) => date.slice(0, 10).replace(/-/g, '.');

/** 精选卡片里的一页 */
function Page({ article, label }: { article: ArticleCard; label: string }) {
  return (
    <>
      <div className={styles.cardHead}>
        <span className={styles.cardType}>{label}</span>
        <span>{dotDate(article.date)}</span>
      </div>
      <div className={styles.cardBody}>
        <h3 className={`${styles.featuredTitle} ${styles.clamp2}`}>{article.title}</h3>
        {article.excerpt && <p className={`${styles.featuredExcerpt} ${styles.clamp2}`}>{article.excerpt}</p>}
        {article.topics.length > 0 && <div className={styles.topicLine}>{article.topics.join(' · ')}</div>}
      </div>
    </>
  );
}

/** 精选：像一本书，背后叠着剩余篇数的书页，点「下一篇」翻页 */
function FeaturedBook({ articles, t }: { articles: ArticleCard[]; t: (typeof translations)['zh'] }) {
  const [cur, setCur] = useState(0); // 当前是第几篇（右侧信息按它显示）
  const [shown, setShown] = useState(0); // 底下实际展示的那一页
  const [stackIdx, setStackIdx] = useState(0); // 背后书页按它计算（回翻时一页页变厚）
  const [turn, setTurn] = useState<{ kind: 'out'; idx: number } | { kind: 'back'; pages: number[] } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const total = articles.length;
  const isLast = cur === total - 1;
  const remaining = total - 1 - cur;
  const target = articles[isLast ? 0 : cur + 1];

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const go = () => {
    if (turn || total < 2) return;
    if (isLast) {
      // 回到开头：像翻书一样，从倒数第二页到第一页依次从左边翻回来
      const pages = Array.from({ length: total - 1 }, (_, i) => total - 2 - i);
      setCur(0);
      setTurn({ kind: 'back', pages });
      timers.current = pages.map((idx, i) => setTimeout(() => setStackIdx(idx), i * BACK_STAGGER_MS + BACK_MS));
      timers.current.push(
        setTimeout(() => {
          setShown(0);
          setTurn(null);
        }, (pages.length - 1) * BACK_STAGGER_MS + BACK_MS + 40)
      );
    } else {
      // 当前页翻走，底下立刻换成下一篇
      setTurn({ kind: 'out', idx: cur });
      setCur(cur + 1);
      setShown(cur + 1);
      setStackIdx(cur + 1);
    }
  };

  // 往后翻：animationend 为主，计时器兜底（后台标签页里 animationend 可能不触发）
  useEffect(() => {
    if (turn?.kind !== 'out') return;
    const timer = setTimeout(() => setTurn(null), TURN_MS + 100);
    return () => clearTimeout(timer);
  }, [turn]);

  // 背后最多叠 2 层：只提示「后面还有」，不随篇数一直变厚
  const sheets = Math.min(total - 1 - stackIdx, MAX_SHEETS);

  return (
    <div className={styles.book}>
      {Array.from({ length: sheets }, (_, i) => (
        <div key={i} className={styles.sheet} style={{ '--i': sheets - i } as React.CSSProperties} aria-hidden="true" />
      ))}

      <div className={styles.featured}>
        <div className={styles.pageArea}>
          <Link href={`/blog/${articles[shown].id}`} className={styles.featuredMain}>
            <Page article={articles[shown]} label={t.featured} />
          </Link>
          {turn?.kind === 'out' && (
            <div className={`${styles.pageTurn} ${styles.turnOut}`} onAnimationEnd={() => setTurn(null)} aria-hidden="true">
              <Page article={articles[turn.idx]} label={t.featured} />
            </div>
          )}
          {/* 回翻：每一页错开一点时间从左边翻回来，后翻回的叠在上面 */}
          {turn?.kind === 'back' &&
            turn.pages.map((idx, i) => (
              <div
                key={idx}
                className={`${styles.pageTurn} ${styles.turnBack}`}
                style={{ animationDelay: `${i * BACK_STAGGER_MS}ms`, zIndex: 2 + i }}
                aria-hidden="true"
              >
                <Page article={articles[idx]} label={t.featured} />
              </div>
            ))}
        </div>

        {total > 1 && (
          <div className={styles.nextPanel}>
            <div>
              <div className={styles.remaining}>
                {isLast ? (
                  <>{t.lastOne}<b>{total}/{total}</b></>
                ) : (
                  <>{t.remaining}<b>{remaining} {t.unit}</b></>
                )}
              </div>
              <div className={styles.dots} aria-hidden="true">
                {articles.map((a, i) => (
                  <i key={a.id} className={i === cur ? styles.dotOn : ''} />
                ))}
              </div>
            </div>
            <button type="button" className={styles.nextBtn} onClick={go}>
              <span className={styles.nextLabel}>{isLast ? t.restart : t.next}</span>
              <span className={styles.nextTitle}>{target.title}</span>
              <span className={styles.nextArrow} aria-hidden="true">{isLast ? '↺' : '→'}</span>
              {/* 悬停显示完整标题 */}
              <span className={styles.nextTip} aria-hidden="true">{target.title}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArticlesClient({ articles }: { articles: ArticleCard[] }) {
  const { language } = useLanguage();
  const t = translations[language];
  const [topic, setTopic] = useState('');
  const [query, setQuery] = useState('');

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of articles) for (const tp of a.topics) counts[tp] = (counts[tp] ?? 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [articles]);

  // 主题 + 搜索（标题、摘要、主题）一起筛
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter(
      (a) =>
        (!topic || a.topics.includes(topic)) &&
        (!q || `${a.title}\n${a.excerpt}\n${a.topics.join(' ')}`.toLowerCase().includes(q))
    );
  }, [articles, topic, query]);

  // 左侧目录：按年份分组
  const indexByYear = useMemo(() => {
    const groups: { year: string; items: ArticleCard[] }[] = [];
    for (const a of filtered) {
      const year = a.date.slice(0, 4);
      const last = groups[groups.length - 1];
      if (last && last.year === year) last.items.push(a);
      else groups.push({ year, items: [a] });
    }
    return groups;
  }, [filtered]);
  const bookArticles = filtered.slice(0, BOOK_SIZE);

  return (
    <div className={styles.page}>
      {/* ---- 左：主题 ---- */}
      <aside className={styles.sidebar}>
        <h2 className={styles.sideTitle}>{t.topics}</h2>
        <ul className={styles.topicList}>
          <li>
            <button className={`${styles.topicItem} ${!topic ? styles.topicActive : ''}`} onClick={() => setTopic('')}>
              <span>{t.all}</span>
              <span className={styles.count}>{articles.length}</span>
            </button>
          </li>
          {topicCounts.map(([value, count]) => (
            <li key={value}>
              <button
                className={`${styles.topicItem} ${topic === value ? styles.topicActive : ''}`}
                onClick={() => setTopic((cur) => (cur === value ? '' : value))}
              >
                <span>{value}</span>
                <span className={styles.count}>{count}</span>
              </button>
            </li>
          ))}
        </ul>

        {indexByYear.length > 0 && (
          <nav className={styles.index} aria-label={t.index}>
            <h2 className={styles.sideTitle}>{t.index}</h2>
            {indexByYear.map(({ year, items }) => (
              <div key={year} className={styles.indexGroup}>
                <div className={styles.indexYear}>
                  {year}
                  <span className={styles.count}>{items.length}</span>
                </div>
                <ul className={styles.indexList}>
                  {items.map((a) => (
                    <li key={a.id}>
                      <Link href={`/blog/${a.id}`} className={styles.indexLink} title={a.title}>
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        )}
      </aside>

      {/* ---- 右：标题、精选、全部 ---- */}
      <main className={styles.main}>
        <header className={styles.hero}>
          <div>
            <h1 className={styles.title}>{t.title}</h1>
            <p className={styles.desc}>{t.desc}</p>
          </div>
          <div className={styles.searchBox}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className={styles.searchInput}
              placeholder={t.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t.search}
            />
            {query && (
              <button type="button" className={styles.searchClear} onClick={() => setQuery('')} aria-label={t.clearSearch}>
                ×
              </button>
            )}
          </div>
        </header>

        {filtered.length === 0 ? (
          <p className={styles.empty}>{t.empty}</p>
        ) : (
          <>
            {/* key 随主题和搜索变化：筛选条件变了就从第一页重新开始 */}
            <FeaturedBook key={`${topic}|${query.trim()}`} articles={bookArticles} t={t} />

            <h2 className={styles.sectionTitle}>
              {t.allArticles}
              <span className={styles.count}>{filtered.length}</span>
            </h2>
            <div className={styles.grid}>
              {filtered.map((a) => (
                <Link key={a.id} href={`/blog/${a.id}`} className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={styles.cardType}>{t.article}</span>
                    <span>{dotDate(a.date)}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={`${styles.cardTitle} ${styles.clamp2}`}>{a.title}</h3>
                    {a.excerpt && <p className={`${styles.cardExcerpt} ${styles.clamp2}`}>{a.excerpt}</p>}
                    {a.topics.length > 0 && <div className={styles.topicLine}>{a.topics.join(' · ')}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
