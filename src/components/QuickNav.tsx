'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/utils/github';
import { getAllPosts } from '@/utils/api';
import { useLanguage } from '@/components/Layout';
import styles from './QuickNav.module.css';

// 月份名称映射
const monthNames = {
  zh: ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  en: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
};

export default function QuickNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [groupedPosts, setGroupedPosts] = useState<Record<string, BlogPost[]>>({});
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const { language } = useLanguage();

  // 加载文章数据
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getAllPosts();
        // 按日期降序排序
        const sortedPosts = data.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setPosts(sortedPosts);

        // 按年月分组
        const grouped: Record<string, BlogPost[]> = {};
        sortedPosts.forEach(post => {
          const key = `${post.year}-${post.month.padStart(2, '0')}`;
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(post);
        });
        setGroupedPosts(grouped);
      } catch (error) {
        console.error('Failed to load posts:', error);
      }
    };

    loadPosts();
  }, []);

  // 鼠标进入时延迟打开
  const handleMouseEnter = () => {
    // 清除可能存在的关闭定时器
    if (hoverTimer) {
      clearTimeout(hoverTimer);
    }
    // 延迟200ms打开
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 200);
    setHoverTimer(timer);
  };

  // 鼠标离开后延迟关闭
  const handleMouseLeave = () => {
    // 清除可能存在的打开定时器
    if (hoverTimer) {
      clearTimeout(hoverTimer);
    }
    // 延迟300ms关闭
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 300);
    setHoverTimer(timer);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    };
  }, [hoverTimer]);

  // 格式化月份显示
  const formatMonth = (key: string) => {
    const [year, month] = key.split('-');
    const monthNum = parseInt(month);
    const monthName = monthNames[language][monthNum];
    return language === 'zh' ? `${year}年${monthName}` : `${monthName} ${year}`;
  };

  return (
    <>
      {/* 触发按钮 */}
      <div
        className={styles.trigger}
        onMouseEnter={handleMouseEnter}
      >
        <span className={styles.triggerText}>
          {language === 'zh' ? '快速导航' : 'Quick Nav'}
        </span>
        <svg
          className={styles.triggerIcon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>

      {/* 毛玻璃遮罩 */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* 侧边栏面板 */}
      <div
        className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.sidebarHeader}>
          <h3>{language === 'zh' ? '文章目录' : 'Articles'}</h3>
          <span className={styles.postCount}>
            {posts.length} {language === 'zh' ? '篇' : 'posts'}
          </span>
        </div>

        <div className={styles.sidebarContent}>
          {Object.keys(groupedPosts)
            .sort((a, b) => b.localeCompare(a))
            .map(key => (
              <div key={key} className={styles.monthGroup}>
                <div className={styles.monthHeader}>
                  {formatMonth(key)}
                  <span className={styles.monthCount}>
                    ({groupedPosts[key].length})
                  </span>
                </div>
                <div className={styles.postList}>
                  {groupedPosts[key].map(post => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className={styles.postItem}
                      title={post.title}
                    >
                      <span className={styles.postDate}>
                        {new Date(post.date).getDate()}
                      </span>
                      <span className={styles.postTitle}>
                        {post.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}