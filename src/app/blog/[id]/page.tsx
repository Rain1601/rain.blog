'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getPostById, getAllPosts } from '@/utils/api';
import { BlogPost } from '@/utils/github';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';
import { useLanguage } from '@/components/Layout';
import styles from './page.module.css';

const translations = {
  zh: {
    back: '← 返回',
    published: '发布于',
    updated: '更新于',
    copyLink: '复制链接',
    copied: '已复制',
    viewOnGithub: 'GitHub',
    nextPost: '下一篇',
    source: '本文来源于',
    githubRepo: 'GitHub 仓库',
    notFound: '文章不存在',
    loadError: '无法加载文章内容，请稍后重试',
  },
  en: {
    back: '← Back',
    published: 'Published',
    updated: 'Updated',
    copyLink: 'Copy link',
    copied: 'Copied',
    viewOnGithub: 'GitHub',
    nextPost: 'Next',
    source: 'Source:',
    githubRepo: 'GitHub Repository',
    notFound: 'Post not found',
    loadError: 'Failed to load post. Please try again later.',
  },
};

export default function GitHubBlogDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { language } = useLanguage();
  const t = translations[language];

  const [post, setPost] = useState<BlogPost | null>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [nextPost, setNextPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // 按年份分组文章（用于左侧目录）
  const postsByYear = useMemo(() => {
    const grouped: Record<string, BlogPost[]> = {};
    allPosts.forEach(p => {
      if (!grouped[p.year]) grouped[p.year] = [];
      grouped[p.year].push(p);
    });
    const sortedYears = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));
    return sortedYears.map(year => ({ year, posts: grouped[year] }));
  }, [allPosts]);

  useEffect(() => {
    if (post) {
      const originalTitle = document.title;
      document.title = `${post.title} - Rain`;
      return () => { document.title = originalTitle; };
    }
  }, [post]);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const postData = await getPostById(id);
        if (!postData) {
          setError(t.notFound);
        } else {
          setPost(postData);
          try {
            const postsData = await getAllPosts();
            const sorted = postsData.sort((a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setAllPosts(sorted);
            const idx = sorted.findIndex(p => p.id === id);
            setNextPost(idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null);
          } catch {
            // don't block current post
          }
        }
      } catch {
        setError(t.loadError);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadPost();
  }, [id, t.notFound, t.loadError]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(
        language === 'zh' ? 'zh-CN' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      );
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}><div className={styles.spinner} /></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error || t.notFound}</div>
        <Link href="/" className={styles.backLink}>{t.back}</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.backLink}>{t.back}</Link>
      </nav>

      {/* 左侧全部文章目录 */}
      {allPosts.length > 0 && (
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
                  {yearPosts.map((p) => (
                    <li key={p.id} className={styles.sidebarItem}>
                      <Link
                        href={`/blog/${p.id}`}
                        className={`${styles.sidebarLink} ${p.id === id ? styles.sidebarLinkActive : ''}`}
                        title={p.title}
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
      )}

      <header className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>

        <div className={styles.meta}>
          <span>{t.published} {formatDate(post.date)}</span>
          {post.updated && (
            <>
              <span className={styles.divider}>/</span>
              <span>{t.updated} {formatDate(post.updated)}</span>
            </>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.copyButton} onClick={handleCopyLink}>
            {copied ? `✓ ${t.copied}` : t.copyLink}
          </button>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            {t.viewOnGithub}
          </a>
        </div>
      </header>

      <article className={styles.content}>
        <MarkdownRenderer content={post.content} />
      </article>

      <TableOfContents />

      <footer className={styles.footer}>
        <Link href="/" className={styles.backButton}>{t.back}</Link>
        {nextPost && (
          <Link href={`/blog/${nextPost.id}`} className={styles.githubButton}>
            {t.nextPost}: {nextPost.title} →
          </Link>
        )}
      </footer>

      <div className={styles.bottomInfo}>
        <p>
          {t.source}
          <a
            href="https://github.com/Rain1601/rain.blog.repo"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.repoLink}
          >
            {t.githubRepo}
          </a>
        </p>
      </div>
    </div>
  );
}
