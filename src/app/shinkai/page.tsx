'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/Layout';
import DeepSeaCanvas from '@/components/DeepSeaCanvas';
import styles from './page.module.css';

const translations = {
  zh: {
    eyebrow: 'SHINKAI · 深海',
    title: '深海',
    tagline:
      '从宏观主题出发，沿产业链潜到深处，找出真正值得长期持有的优质公司。',
    description:
      '世界秩序、宏观变化、资金流向是水面。问题不在表层 —— 要往下沉。',
    back: '← 返回',
  },
  en: {
    eyebrow: 'SHINKAI · DEEP SEA',
    title: 'Shinkai',
    tagline:
      'Start from macro themes, descend along the supply chain, surface companies worth holding for the long run.',
    description:
      'World order, macro shifts, capital flows — these are the surface. The signal lives below.',
    back: '← Back',
  },
};

export default function ShinkaiPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className={styles.page}>
      <DeepSeaCanvas className={styles.canvas} />
      <main className={styles.content}>
        <span className={styles.eyebrow}>{t.eyebrow}</span>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.tagline}>{t.tagline}</p>
        <p className={styles.description}>{t.description}</p>
      </main>
      <Link href="/about" className={styles.back}>
        {t.back}
      </Link>
    </div>
  );
}
