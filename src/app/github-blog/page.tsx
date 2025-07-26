'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllPosts, getStats } from '@/utils/api';
import { BlogPost } from '@/utils/github';
import styles from './page.module.css';

export default function GitHubBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [stats, setStats] = useState<{
    totalPosts: number;
    years: string[];
    latestPost?: BlogPost;
  }>({ totalPosts: 0, years: [] });

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
    }
    
    // 搜索过滤
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredPosts(filtered);
  }, [searchQuery, selectedYear, posts]);


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
    <div className={styles.container}>
      {/* 页面头部 */}
      <header className={styles.header}>
        {/* 统计信息 */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{stats.totalPosts}</span>
            <span className={styles.statLabel}>篇文章</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{stats.years.length}</span>
            <span className={styles.statLabel}>个年份</span>
          </div>
        </div>
      </header>

      {/* 搜索和筛选 */}
      <section className={styles.filterSection}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="搜索博客文章标题或内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        {/* 年份筛选 */}
        {stats.years.length > 0 && (
          <div className={styles.yearFilter}>
            <button
              className={`${styles.filterChip} ${selectedYear === 'all' ? styles.active : ''}`}
              onClick={() => setSelectedYear('all')}
            >
              全部
            </button>
            {stats.years.map((year) => (
              <button
                key={year}
                className={`${styles.filterChip} ${selectedYear === year ? styles.active : ''}`}
                onClick={() => setSelectedYear(year)}
              >
                {year}年
              </button>
            ))}
          </div>
        )}

        {/* 结果统计 */}
        {filteredPosts.length !== posts.length && (
          <p className={styles.resultCount}>
            显示 {filteredPosts.length} / {posts.length} 篇文章
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
        {filteredPosts.map((post) => (
          <article key={post.id} className={styles.timelineItem}>
            <div className={styles.timelineMarker}></div>
            <div className={styles.timelineContent}>
              <time className={styles.postDate}>
                {new Date(post.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <h2 className={styles.postTitle}>
                <Link href={`/github-blog/${post.id}`}>
                  {post.title}
                </Link>
              </h2>
              <p className={styles.postExcerpt}>
                {post.content.substring(0, 200)}...
              </p>
              <Link href={`/github-blog/${post.id}`} className={styles.readMore}>
                阅读全文 →
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* 底部信息 */}
      <footer className={styles.footer}>
        <p>博客内容实时同步自</p>
        <a
          href="https://github.com/Rain1601/rain.blog.repo"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
        >
          GitHub 仓库
        </a>
      </footer>
    </div>
  );
}