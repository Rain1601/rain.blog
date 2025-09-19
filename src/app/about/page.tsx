'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

export default function AboutPage() {
  const [copied, setCopied] = useState(false);
  const email = 'rain1104@foxmail.com';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Avatar */}
        <Image
          src="/images/head.jpg"
          alt="Rain"
          width={120}
          height={120}
          className={styles.avatar}
        />

        {/* Name */}
        <h1 className={styles.name}>Rain</h1>

        {/* Title */}
        <p className={styles.title}>全栈开发工程师 · 技术探索者</p>

        {/* Description */}
        <p className={styles.description}>
          热爱编程与创新，专注于现代 Web 技术和人工智能领域的探索。
          通过代码创造价值，用技术连接世界。
        </p>

        {/* Contact Links */}
        <div className={styles.contactLinks}>
          <a
            href="https://github.com/Rain1601"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactButton}
            title="GitHub"
          >
            <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
          
          <button
            onClick={handleCopyEmail}
            className={styles.contactButton}
            title={copied ? '已复制!' : '复制邮箱'}
          >
            {copied ? (
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Email Text */}
        <p className={styles.email}>
          {copied ? 'Rain的邮箱已复制' : email}
        </p>
      </div>
    </div>
  );
}