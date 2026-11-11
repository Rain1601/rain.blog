'use client';

import { useEffect, useMemo, useState } from 'react';
import { Note } from '@/utils/github';
import { useLanguage } from '@/components/Layout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import styles from './page.module.css';

const translations = {
  zh: {
    title: '随笔',
    subtitle: '随手记下的想法、发现与片段',
    empty: '还没有随笔。',
    noMatch: '没有符合条件的随笔。',
    sample: '示例数据 · 内容仓库还没有 notes/ 目录',
    expand: '展开全文',
    collapse: '收起',
    syncFrom: '随笔内容实时同步自',
    githubRepo: 'GitHub 仓库',
    search: '搜索随笔…',
    time: '时间',
    tags: '标签',
    all: '全部',
    clear: '清除筛选',
    count: (n: number) => `${n} 条`,
    month: (y: string, m: number) => `${y} 年 ${m} 月`,
    monthShort: (m: number) => `${m} 月`,
  },
  en: {
    title: 'Notes',
    subtitle: 'Thoughts, findings, and fragments, written as they come',
    empty: 'No notes yet.',
    noMatch: 'No notes match these filters.',
    sample: 'Sample data · the content repo has no notes/ folder yet',
    expand: 'Read more',
    collapse: 'Show less',
    syncFrom: 'Notes synced from',
    githubRepo: 'GitHub Repository',
    search: 'Search notes…',
    time: 'Date',
    tags: 'Tags',
    all: 'All',
    clear: 'Clear filters',
    count: (n: number) => `${n} ${n === 1 ? 'note' : 'notes'}`,
    month: (y: string, m: number) =>
      `${new Date(2000, m - 1).toLocaleString('en-US', { month: 'short' })} ${y}`,
    monthShort: (m: number) => new Date(2000, m - 1).toLocaleString('en-US', { month: 'short' }),
  },
};

/** 超过这个字数的随笔默认折叠 */
const COLLAPSE_THRESHOLD = 280;

function formatDate(date: string) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return { day: date, year: '' };
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return { day: `${mm}.${dd}`, year: String(d.getFullYear()) };
}

/** YYYY-MM，用于按月筛选 */
const monthKey = (date: string) => date.slice(0, 7);

/** 从网址读筛选条件，刷新或分享链接时能还原 */
function readParams() {
  if (typeof window === 'undefined') return { q: '', month: '', tag: '' };
  const p = new URLSearchParams(window.location.search);
  return { q: p.get('q') ?? '', month: p.get('month') ?? '', tag: p.get('tag') ?? '' };
}

export default function NotesClient({ notes, isSample }: { notes: Note[]; isSample: boolean }) {
  const { language } = useLanguage();
  const t = translations[language];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState('');
  const [tag, setTag] = useState('');

  // 首次加载时从网址还原筛选条件
  useEffect(() => {
    const p = readParams();
    setQuery(p.q);
    setMonth(p.month);
    setTag(p.tag);
  }, []);

  // 筛选条件写回网址（replaceState，不产生历史记录）
  useEffect(() => {
    const p = new URLSearchParams();
    if (query.trim()) p.set('q', query.trim());
    if (month) p.set('month', month);
    if (tag) p.set('tag', tag);
    const qs = p.toString();
    const next = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(null, '', next);
    }
  }, [query, month, tag]);

  // 侧栏数据：按年分组的月份，以及标签计数
  const { years, tagCounts } = useMemo(() => {
    const byYear: Record<string, Record<string, number>> = {};
    const tags: Record<string, number> = {};
    for (const n of notes) {
      const key = monthKey(n.date);
      const year = key.slice(0, 4);
      byYear[year] ??= {};
      byYear[year][key] = (byYear[year][key] ?? 0) + 1;
      for (const tg of n.tags) tags[tg] = (tags[tg] ?? 0) + 1;
    }
    return {
      years: Object.keys(byYear)
        .sort((a, b) => b.localeCompare(a))
        .map((year) => ({
          year,
          months: Object.entries(byYear[year]).sort((a, b) => b[0].localeCompare(a[0])),
        })),
      tagCounts: Object.entries(tags).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    };
  }, [notes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes.filter(
      (n) =>
        (!month || monthKey(n.date) === month) &&
        (!tag || n.tags.includes(tag)) &&
        (!q || [n.title, n.body, n.titleEn, n.bodyEn].some((value) => value?.toLowerCase().includes(q)))
    );
  }, [notes, query, month, tag]);

  const hasFilter = Boolean(query.trim() || month || tag);
  const clearAll = () => {
    setQuery('');
    setMonth('');
    setTag('');
  };
  const toggleTag = (value: string) => setTag((cur) => (cur === value ? '' : value));
  const toggleMonth = (value: string) => setMonth((cur) => (cur === value ? '' : value));

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* ---- 侧栏：标题 + 搜索 / 时间 / 标签（手机端在顶部） ---- */}
        <aside className={styles.sidebar}>
          <header className={styles.header}>
            <h1 className={styles.title}>
              {t.title}
              {language === 'zh' && <span className={styles.titleEn}>Notes</span>}
            </h1>
            <p className={styles.subtitle}>
              {t.subtitle}
              {notes.length > 0 && ` · ${t.count(notes.length)}`}
            </p>
            {isSample && <p className={styles.sampleBadge}>{t.sample}</p>}
          </header>

          {notes.length > 0 && (
          <>
            <div className={styles.searchBox}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
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
            </div>

            <section className={styles.sideSection}>
              <h2 className={styles.sideTitle}>{t.time}</h2>
              <ul className={styles.monthList}>
                {years.map(({ year, months }) => (
                  <li key={year}>
                    <span className={styles.yearLabel}>{year}</span>
                    <ul>
                      {months.map(([key, count]) => (
                        <li key={key}>
                          <button
                            className={`${styles.sideItem} ${month === key ? styles.sideItemActive : ''}`}
                            onClick={() => toggleMonth(key)}
                            aria-pressed={month === key}
                          >
                            <span>{t.monthShort(Number(key.slice(5, 7)))}</span>
                            <span className={styles.sideCount}>{count}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>

            {tagCounts.length > 0 && (
              <section className={styles.sideSection}>
                <h2 className={styles.sideTitle}>{t.tags}</h2>
                <div className={styles.tagCloud}>
                  {tagCounts.map(([value, count]) => (
                    <button
                      key={value}
                      className={`${styles.tagChip} ${tag === value ? styles.tagChipActive : ''}`}
                      onClick={() => toggleTag(value)}
                      aria-pressed={tag === value}
                    >
                      {value}
                      <span className={styles.sideCount}>{count}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
          )}
        </aside>

        {/* ---- 时间流 ---- */}
        <div className={styles.main}>
          {hasFilter && (
            <div className={styles.filterBar}>
              <span>
                {t.count(filtered.length)}
                {month && ` · ${t.month(month.slice(0, 4), Number(month.slice(5, 7)))}`}
                {tag && ` · #${tag}`}
                {query.trim() && ` · “${query.trim()}”`}
              </span>
              <button className={styles.clearBtn} onClick={clearAll}>{t.clear}</button>
            </div>
          )}

          {notes.length === 0 ? (
            <p className={styles.empty}>{t.empty}</p>
          ) : filtered.length === 0 ? (
            <p className={styles.empty}>{t.noMatch}</p>
          ) : (
            <ol className={styles.stream}>
              {filtered.map((note) => {
                const { day, year } = formatDate(note.date);
                const english = language === 'en' ? note.bodyEn : undefined;
                const body = english || note.body;
                const title = english ? note.titleEn : note.title;
                const linkTitle = english ? note.linkTitleEn || note.linkTitle : note.linkTitle;
                const isLong = body.length > COLLAPSE_THRESHOLD;
                const isOpen = !isLong || expanded[note.id];
                return (
                  <li key={note.id} id={note.id} className={styles.note}>
                    <a href={`#${note.id}`} className={styles.date} aria-label={note.date}>
                      <span className={styles.day}>{day}</span>
                      <span className={styles.year}>{year}</span>
                    </a>

                    <div className={styles.rail}>
                      <span className={styles.dot} aria-hidden="true" />
                    </div>

                    <div className={styles.content}>
                      {title && <h2 className={styles.noteTitle} lang={english ? 'en' : 'zh'}>{title}</h2>}

                      <div className={`${styles.body} ${isOpen ? '' : styles.bodyCollapsed}`} lang={english ? 'en' : 'zh'}>
                        <MarkdownRenderer content={body} />
                      </div>
                      {isLong && (
                        <button
                          className={styles.toggle}
                          onClick={() => setExpanded((s) => ({ ...s, [note.id]: !s[note.id] }))}
                        >
                          {isOpen ? t.collapse : t.expand}
                        </button>
                      )}

                      {note.video && (
                        <video
                          className={styles.video}
                          src={note.video}
                          poster={note.poster}
                          controls
                          playsInline
                          preload="none"
                        />
                      )}

                      {note.link && (
                        <a
                          href={note.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.attachment}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                            <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                            <path d="M9 13h6M9 17h4" />
                          </svg>
                          <span className={styles.attachmentTitle}>{linkTitle || note.link}</span>
                          <span className={styles.attachmentArrow} aria-hidden="true">↗</span>
                        </a>
                      )}

                      {note.tags.length > 0 && (
                        <div className={styles.tags}>
                          {note.tags.map((value) => (
                            <button
                              key={value}
                              className={`${styles.tag} ${tag === value ? styles.tagActive : ''}`}
                              onClick={() => toggleTag(value)}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>

      <footer className={styles.footer}>
        <span>{t.syncFrom}</span>
        <a
          href="https://github.com/Rain1601/rain.blog.repo/tree/main/notes"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.githubRepo}
        </a>
      </footer>
    </div>
  );
}
