'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/utils/github';
import { useLanguage } from '@/components/Layout';
import styles from './page.module.css';

interface ArticlesClientProps {
  initialPosts: BlogPost[];
  initialStats: {
    totalPosts: number;
    years: string[];
    latestPost?: BlogPost;
    tags: string[];
    categories: string[];
  };
}

// 语言文本配置
const translations = {
  zh: {
    searchPlaceholder: '搜索博客文章标题或内容...',
    all: '全部',
    year: '年',
    readMore: '阅读全文',
    showingResults: '显示',
    of: '/',
    articles: '篇文章',
    syncFrom: '博客内容实时同步自',
    githubRepo: 'GitHub 仓库',
    home: '首页',
    about: '关于我',
    january: '1月',
    february: '2月',
    march: '3月',
    april: '4月',
    may: '5月',
    june: '6月',
    july: '7月',
    august: '8月',
    september: '9月',
    october: '10月',
    november: '11月',
    december: '12月',
  },
  en: {
    searchPlaceholder: 'Search blog posts title or content...',
    all: 'All',
    year: '',
    readMore: 'Read More',
    showingResults: 'Showing',
    of: 'of',
    articles: 'posts',
    syncFrom: 'Blog content synced from',
    githubRepo: 'GitHub Repository',
    home: 'Home',
    about: 'About',
    january: 'Jan',
    february: 'Feb',
    march: 'Mar',
    april: 'Apr',
    may: 'May',
    june: 'Jun',
    july: 'Jul',
    august: 'Aug',
    september: 'Sep',
    october: 'Oct',
    november: 'Nov',
    december: 'Dec',
  }
};

// 月份映射
const monthNames = {
  zh: ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  en: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
};

// 检测文本是否包含中文
const containsChinese = (text: string): boolean => {
  return /[\u4e00-\u9fa5]/.test(text);
};

// 双段动效时长（与 CSS 对齐）
const EXIT_DURATION = 280;

export default function ArticlesClient({ initialPosts, initialStats }: ArticlesClientProps) {
  const [posts] = useState<BlogPost[]>(initialPosts);
  const [error] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // chip 立即响应的"选中"状态
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  // 列表实际应用的"已生效"状态（exit 动画结束后才更新）
  const [appliedYear, setAppliedYear] = useState<string>('all');
  const [appliedMonth, setAppliedMonth] = useState<string>('all');
  const [isExiting, setIsExiting] = useState(false);
  // 每次切换 +1，附加到 article 的 key 上让全部 article 重新挂载触发 stagger
  // 注意：不能放在 <section> 的 key 上，否则 transition 中途卸载父节点会触发 React removeChild 错误
  const [renderTick, setRenderTick] = useState(0);
  const [openYear, setOpenYear] = useState<string | null>(null);
  const { language } = useLanguage();
  const [stats] = useState(initialStats);

  // 双段动效：先 exit，再切数据，新数据自带 enter stagger
  const applyFilter = (year: string, month: string) => {
    // chip 立即更新
    setSelectedYear(year);
    setSelectedMonth(month);
    // 已生效的目标过滤条件未变 → 无需动画
    if (year === appliedYear && month === appliedMonth) return;
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      setAppliedYear(year);
      setAppliedMonth(month);
      setRenderTick(t => t + 1);
      setIsExiting(false);
    }, EXIT_DURATION);
  };


  const t = translations[language];

  // 计算每年每月的文章数量
  const yearMonthStats = useMemo(() => {
    const stats: Record<string, Record<string, number>> = {};

    posts.forEach(post => {
      const year = post.year;
      const month = post.month;

      if (!stats[year]) {
        stats[year] = {};
      }

      const monthNum = parseInt(month);
      if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
        if (!stats[year][month]) {
          stats[year][month] = 0;
        }
        stats[year][month]++;
      }
    });

    return stats;
  }, [posts]);

  // 计算每年的文章总数
  const yearCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(post => {
      if (!counts[post.year]) {
        counts[post.year] = 0;
      }
      counts[post.year]++;
    });
    return counts;
  }, [posts]);

  // 当前展示的文章（基于 applied 状态 + 搜索）— 同步派生，无 useEffect 延迟
  const filteredPosts = useMemo(() => {
    let filtered = posts;
    if (appliedYear !== 'all') {
      filtered = filtered.filter(post => post.year === appliedYear);
      if (appliedMonth !== 'all') {
        filtered = filtered.filter(post => post.month === appliedMonth);
      }
    }
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts, appliedYear, appliedMonth, searchQuery]);

  // 按年份分组文章（用于侧边栏目录）
  const postsByYear = useMemo(() => {
    const grouped: Record<string, BlogPost[]> = {};
    filteredPosts.forEach(post => {
      if (!grouped[post.year]) {
        grouped[post.year] = [];
      }
      grouped[post.year].push(post);
    });
    // 按年份降序排列
    const sortedYears = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));
    return sortedYears.map(year => ({ year, posts: grouped[year] }));
  }, [filteredPosts]);

  // 处理月份选择
  const handleMonthSelect = (year: string, month: string) => {
    applyFilter(year, month);
    setOpenYear(null);
  };

  // 处理点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.yearChipWrapper}`)) {
        setOpenYear(null);
      }
    };

    if (openYear) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openYear]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>

        {/* 左侧文章目录 */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>
            {language === 'zh' ? '目录' : 'Index'}
          </div>
          <nav className={styles.sidebarNav}>
            {postsByYear.map(({ year, posts: yearPosts }) => (
              <div key={year} className={styles.sidebarGroup}>
                <div className={styles.sidebarYearLabel}>
                  <span>{year}</span>
                  <span className={styles.sidebarCount}>{yearPosts.length}</span>
                </div>
                <ul className={styles.sidebarList}>
                  {yearPosts.map((post) => (
                    <li key={post.id} className={styles.sidebarItem}>
                      <Link href={`/blog/${post.id}`} className={styles.sidebarLink} title={post.title}>
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* 筛选区域 */}
        <section className={styles.filterSection}>
          {/* 搜索框 */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>

        {/* 年份筛选 - 带数量显示和月份下拉 */}
        {stats.years.length > 0 && (
          <div className={styles.yearFilter}>
            <button
              className={`${styles.filterChip} ${selectedYear === 'all' ? styles.active : ''}`}
              onClick={() => applyFilter('all', 'all')}
            >
              {t.all}({posts.length})
            </button>
            {stats.years.map((year) => (
              <div
                key={year}
                className={styles.yearChipWrapper}
              >
                <button
                  className={`${styles.filterChip} ${selectedYear === year ? styles.active : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedYear === year) {
                      // 已选中该年份，切换月份下拉
                      setOpenYear(openYear === year ? null : year);
                    } else {
                      // 首次点击，仅选中年份
                      applyFilter(year, 'all');
                      setOpenYear(null);
                    }
                  }}
                >
                  {year}{language === 'zh' ? t.year : ''}({yearCounts[year] || 0})
                </button>

                {/* 月份下拉菜单 */}
                {openYear === year && yearMonthStats[year] && (
                  <div className={styles.monthDropdown}>
                    {Object.entries(yearMonthStats[year])
                      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                      .map(([month, count]) => {
                        const monthNum = parseInt(month);
                        const monthName = monthNames[language][monthNum];
                        return (
                          <button
                            key={month}
                            className={styles.monthItem}
                            onClick={() => handleMonthSelect(year, month)}
                          >
                            {monthName}({count})
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

          {/* 结果统计 */}
          {filteredPosts.length !== posts.length && (
            <p className={styles.resultCount}>
              {t.showingResults} {filteredPosts.length} {t.of} {posts.length} {t.articles}
            </p>
          )}
        </section>
        {/* 错误提示 */}
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {/* 时间线内容 — 双段动效：exit 淡出 → 切数据 → enter stagger
            section 自身保持挂载（避免 transition + unmount 撞车），
            article 的 key 含 renderTick → 每次切换全部 article 重新挂载，触发 CSS animation */}
        <section
          className={`${styles.timeline} ${isExiting ? styles.timelineExit : ''}`}
        >
        {filteredPosts.map((post) => {
          const isChinese = containsChinese(post.title);
          return (
            <article key={`${renderTick}-${post.id}`} className={styles.timelineItem}>
              <div className={styles.timelineMarker}></div>
              <div className={styles.timelineContent}>
                <time className={styles.postDate}>
                  {new Date(post.date).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <h2
                  className={styles.postTitle}
                  style={{
                    fontFamily: isChinese ? "'SongTi', '宋体', 'SimSun', serif" : "'Times New Roman', serif"
                  }}
                >
                  <Link href={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className={styles.postExcerpt}>
                  {post.summary || ''}
                </p>
                <Link href={`/blog/${post.id}`} className={styles.readMore}>
                  {t.readMore} →
                </Link>
              </div>
            </article>
          );
          })}
        </section>
      </div>

      {/* 底部信息 - 固定在页面底部 */}
      <footer className={styles.fixedFooter}>
        <span>{t.syncFrom}</span>
        <a
          href="https://github.com/Rain1601/rain.blog.repo"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
        >
          {t.githubRepo}
        </a>
      </footer>
    </div>
  );
}