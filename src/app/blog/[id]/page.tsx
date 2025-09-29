'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getPostById, getAllPosts } from '@/utils/api';
import { BlogPost } from '@/utils/github';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';
import styles from './page.module.css';

export default function GitHubBlogDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [nextPost, setNextPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // 加载文章数据和下一篇文章
  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const postData = await getPostById(id);

        if (!postData) {
          setError('文章不存在');
        } else {
          setPost(postData);

          // 获取所有文章以找到下一篇
          try {
            const allPosts = await getAllPosts();
            // 按日期排序（从新到旧）
            const sortedPosts = allPosts.sort((a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            // 找到当前文章的索引
            const currentIndex = sortedPosts.findIndex(p => p.id === id);

            // 获取下一篇文章（时间上更早的文章）
            if (currentIndex >= 0 && currentIndex < sortedPosts.length - 1) {
              setNextPost(sortedPosts[currentIndex + 1]);
            } else {
              setNextPost(null);
            }
          } catch (err) {
            console.error('获取下一篇文章失败:', err);
            // 不影响当前文章的显示
          }
        }
      } catch (err) {
        console.error('加载文章失败:', err);
        setError('无法加载文章内容，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPost();
    }
  }, [id]);

  // 复制链接
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      const [year, month] = dateString.split('-');
      const monthNames = [
        '1月', '2月', '3月', '4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月'
      ];
      return `${year}年${monthNames[parseInt(month) - 1]}`;
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error || '文章不存在'}
        </div>
        <Link href="/" className={styles.backButton}>
          ← 返回博客列表
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 导航栏 */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.backLink}>
          ← 返回博客列表
        </Link>
      </nav>

      {/* 文章头部 */}
      <header className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        
        <div className={styles.meta}>
          <time className={styles.date}>
            {formatDate(post.date)}
          </time>
          <span className={styles.divider}>·</span>
          <span className={styles.size}>
            {Math.round(post.size / 1024)} KB
          </span>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.copyButton}
            onClick={handleCopyLink}
            title="复制链接"
          >
            {copied ? '✓ 已复制' : '复制链接'}
          </button>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            在 GitHub 中查看
          </a>
        </div>
      </header>

      {/* 文章内容 */}
      <article className={styles.content}>
        <MarkdownRenderer content={post.content} />
      </article>

      {/* 右侧目录 */}
      <TableOfContents />

      {/* 底部操作 */}
      <footer className={styles.footer}>
        <Link href="/" className={styles.backButton}>
          ← 返回博客列表
        </Link>

        {nextPost && (
          <Link
            href={`/blog/${nextPost.id}`}
            className={`${styles.githubButton} ${styles.primary}`}
          >
            下一篇: {nextPost.title} →
          </Link>
        )}
      </footer>

      {/* 底部信息 */}
      <div className={styles.bottomInfo}>
        <p>
          本文来源于
          <a
            href="https://github.com/Rain1601/rain.blog.repo"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.repoLink}
          >
            GitHub 仓库
          </a>
        </p>
      </div>
    </div>
  );
}