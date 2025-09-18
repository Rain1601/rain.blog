'use client';

import React from 'react';
import styles from './LinkTag.module.css';
import { analyzeLinkInfo, isInternalLink, type LinkInfo } from '@/utils/linkAnalyzer';

interface LinkTagProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const LinkTag: React.FC<LinkTagProps> = ({ href, children, className = '' }) => {
  // 内部链接不显示标签
  if (isInternalLink(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  const linkInfo: LinkInfo = analyzeLinkInfo(href);

  return (
    <span className={styles.linkContainer}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} ${styles.enhancedLink}`}
      >
        {children}
      </a>
      <span
        className={styles.linkTag}
        style={{
          color: linkInfo.color,
          backgroundColor: linkInfo.bgColor,
          borderColor: linkInfo.color + '30' // 30% opacity for border
        }}
        title={`${linkInfo.label} - ${linkInfo.domain}`}
      >
        <span className={styles.linkIcon}>{linkInfo.icon}</span>
        <span className={styles.linkLabel}>{linkInfo.label}</span>
      </span>
    </span>
  );
};

export default LinkTag;