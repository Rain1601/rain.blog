'use client';

import { RefObject, useEffect, useState } from 'react';
import { useLanguage } from '@/components/Layout';
import styles from './TableOfContents.module.css';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({
  articleRef,
  visible,
  readingMode,
}: {
  articleRef: RefObject<HTMLElement | null>;
  visible: boolean;
  readingMode: boolean;
}) {
  const { language } = useLanguage();
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const elements = articleRef.current?.querySelectorAll<HTMLElement>('h1, h2, h3');
    if (!elements) return;
    const counts = new Map<string, number>();
    const items = Array.from(elements, (element, index) => {
      const base = element.id || element.textContent?.trim().toLowerCase().replace(/\s+/g, '-') || `heading-${index}`;
      const count = (counts.get(base) ?? 0) + 1;
      counts.set(base, count);
      const id = count === 1 ? base : `${base}-${count}`;
      element.id = id;
      return { id, text: element.textContent ?? '', level: Number(element.tagName.slice(1)) };
    });
    setHeadings(items);

    const observer = new IntersectionObserver((entries) => {
      const first = entries.find((entry) => entry.isIntersecting);
      if (first) setActiveId(first.target.id);
    }, { rootMargin: '-100px 0px -60% 0px' });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [articleRef]);

  const goTo = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileOpen(false);
  };

  if (headings.length === 0) return null;

  const contents = (
    <ul className={styles.tocList}>
      {headings.map((heading) => (
        <li key={heading.id} className={`${styles.tocItem} ${styles[`level${heading.level}`]} ${activeId === heading.id ? styles.active : ''}`}>
          <a href={`#${heading.id}`} onClick={(event) => goTo(event, heading.id)} title={heading.text}>
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <nav className={`${styles.toc} ${visible ? '' : styles.tocHidden} ${readingMode ? styles.tocReadingHidden : ''}`} aria-label={language === 'zh' ? '本文目录' : 'Article contents'}>
        {contents}
      </nav>
      <div className={`${styles.tocButton} ${readingMode ? styles.tocReadingHidden : ''}`}>
        <button
          type="button"
          className={styles.tocToggle}
          aria-label={language === 'zh' ? '本文目录' : 'Article contents'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-article-contents"
          onClick={() => setMobileOpen((open) => !open)}
        />
        <nav id="mobile-article-contents" className={`${styles.tocPanel} ${mobileOpen ? styles.tocPanelOpen : ''}`} aria-label={language === 'zh' ? '本文目录' : 'Article contents'}>
          <div className={styles.tocHeader}>{language === 'zh' ? '本文目录' : 'Contents'}</div>
          {contents}
        </nav>
      </div>
    </>
  );
}
