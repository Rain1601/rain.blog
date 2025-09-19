'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getAllPosts, getStats } from '@/utils/api';
import { BlogPost } from '@/utils/github';
import { useLanguage } from '@/components/Layout';
import styles from './page.module.css';

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

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);
  const { language } = useLanguage();
  const [stats, setStats] = useState<{
    totalPosts: number;
    years: string[];
    latestPost?: BlogPost;
  }>({ totalPosts: 0, years: [] });


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

  // 加载数据
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [postsData, statsData] = await Promise.all([
        getAllPosts(),
        getStats()
      ]);

      setPosts(postsData);
      setFilteredPosts(postsData);
      setStats(statsData);
    } catch (err) {
      console.error('加载数据失败:', err);
      setError('无法从GitHub仓库加载博客数据，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadData();
  }, []);


  // 搜索和筛选功能
  useEffect(() => {
    let filtered = posts;

    // 年份筛选
    if (selectedYear !== 'all') {
      filtered = filtered.filter(post => post.year === selectedYear);

      // 月份筛选
      if (selectedMonth !== 'all') {
        filtered = filtered.filter(post => post.month === selectedMonth);
      }
    }

    // 搜索过滤
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedYear, selectedMonth, posts]);

  // 处理月份选择
  const handleMonthSelect = (year: string, month: string) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setHoveredYear(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.skeleton} style={{ width: '300px', height: '48px', margin: '0 auto' }} />
          <div className={styles.skeleton} style={{ width: '400px', height: '24px', margin: '16px auto' }} />
        </div>
        <div className={styles.timeline}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.timelineItem}>
              <div className={styles.timelineMarker}></div>
              <div className={styles.skeleton} style={{ width: '100%', height: '120px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>

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
            <span className={styles.searchIcon}>🔍</span>
          </div>

        {/* 年份筛选 - 带数量显示和月份下拉 */}
        {stats.years.length > 0 && (
          <div className={styles.yearFilter}>
            <button
              className={`${styles.filterChip} ${selectedYear === 'all' ? styles.active : ''}`}
              onClick={() => {
                setSelectedYear('all');
                setSelectedMonth('all');
              }}
            >
              {t.all}({posts.length})
            </button>
            {stats.years.map((year) => (
              <div
                key={year}
                className={styles.yearChipWrapper}
                onMouseEnter={() => setHoveredYear(year)}
                onMouseLeave={() => setHoveredYear(null)}
              >
                <button
                  className={`${styles.filterChip} ${selectedYear === year ? styles.active : ''}`}
                  onClick={() => {
                    setSelectedYear(year);
                    setSelectedMonth('all');
                  }}
                >
                  {year}{language === 'zh' ? t.year : ''}({yearCounts[year] || 0})
                </button>

                {/* 月份下拉菜单 */}
                {hoveredYear === year && yearMonthStats[year] && (
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

        {/* 时间线内容 */}
        <section className={styles.timeline}>
        {filteredPosts.map((post) => {
          const isChinese = containsChinese(post.title);
          return (
            <article key={post.id} className={styles.timelineItem}>
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