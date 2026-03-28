export interface ProductItem {
  id: string;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  coverGradient: string;
  /** Colors for animated gradient blobs [blob1, blob2, blob3, blob4] */
  blobColors: string[];
  /** Background color behind the blobs */
  blobBg: string;
  techStack: string[];
  link?: string;
  github?: string;
}

export const productData: ProductItem[] = [
  {
    id: 'rain-blog',
    title: {
      zh: '个人博客',
      en: 'Personal Blog',
    },
    description: {
      zh: '基于 Next.js 15 构建的个人博客平台，支持 GitHub 内容源、MDX、代码高亮、在线 Python 运行等功能。',
      en: 'A personal blog platform built with Next.js 15, featuring GitHub content source, MDX, syntax highlighting, and in-browser Python execution.',
    },
    coverGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    blobColors: ['#4a7cf7', '#9b6dff', '#f0a0c0', '#e8d5f5'],
    blobBg: '#0e1525',
    techStack: ['Next.js', 'TypeScript', 'Material-UI', 'Pyodide'],
    link: 'https://rain.blog',
    github: 'https://github.com/Rain1601/rain.blog',
  },
  {
    id: 'uteki',
    title: {
      zh: 'Uteki — 智能饮水追踪',
      en: 'Uteki — Smart Hydration Tracker',
    },
    description: {
      zh: '一款帮助用户追踪每日饮水量的 iOS 应用，支持智能提醒、数据统计和健康分析。',
      en: 'An iOS app that helps users track daily water intake with smart reminders, statistics, and health insights.',
    },
    coverGradient: 'linear-gradient(135deg, #0d4b4a 0%, #1a6b5a 50%, #2d8f6f 100%)',
    blobColors: ['#34d399', '#60d5f7', '#a7f3d0', '#fbbf24'],
    blobBg: '#0a1f1a',
    techStack: ['Swift', 'SwiftUI', 'HealthKit', 'CloudKit'],
  },
  {
    id: 'project-three',
    title: {
      zh: '更多项目开发中…',
      en: 'More Projects Coming…',
    },
    description: {
      zh: '持续探索新的技术方向，更多作品即将上线。',
      en: 'Continuously exploring new tech directions. More works coming soon.',
    },
    coverGradient: 'linear-gradient(135deg, #2d2d3a 0%, #3d3548 50%, #4a3f5c 100%)',
    blobColors: ['#c084fc', '#f472b6', '#818cf8', '#fcd34d'],
    blobBg: '#1a1525',
    techStack: ['Coming Soon'],
  },
];

export const sectionTitles = {
  zh: {
    title: '构建有意义的产品',
    subtitle: '每一个项目都是一次探索与表达',
  },
  en: {
    title: 'Building things\nthat matter.',
    subtitle: 'Each project is an exploration and expression.',
  },
};
