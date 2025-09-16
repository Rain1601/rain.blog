'use client';

import React, { useState, useEffect } from 'react';
import styles from './TableOfContents.module.css';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 获取所有标题元素
    const elements = document.querySelectorAll('h1, h2, h3');
    const tocItems: TOCItem[] = [];

    elements.forEach((elem) => {
      const id = elem.id || elem.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
      if (!elem.id) {
        elem.id = id;
      }

      tocItems.push({
        id,
        text: elem.textContent || '',
        level: parseInt(elem.tagName.substring(1))
      });
    });

    setHeadings(tocItems);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);

        if (visibleEntries.length > 0) {
          // 找到第一个进入视口的标题
          const firstVisible = visibleEntries[0];
          setActiveId(firstVisible.target.id);
        }
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: [0, 0.5, 1]
      }
    );

    const elements = document.querySelectorAll('h1, h2, h3');
    elements.forEach((elem) => observer.observe(elem));

    return () => {
      elements.forEach((elem) => observer.unobserve(elem));
    };
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className={styles.toc}>
      <div className={styles.tocHeader}>目录</div>
      <ul className={styles.tocList}>
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`${styles.tocItem} ${styles[`level${heading.level}`]} ${
              activeId === heading.id ? styles.active : ''
            }`}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              title={heading.text}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}