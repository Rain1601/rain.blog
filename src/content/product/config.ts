export interface ProductItem {
  id: string;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  coverGradient: string;
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
    techStack: ['Coming Soon'],
  },
];

export const sectionTitles = {
  zh: {
    title: '作品集',
    subtitle: '我的项目与产品',
  },
  en: {
    title: 'Portfolio',
    subtitle: 'My Projects & Products',
  },
};
