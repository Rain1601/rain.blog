// 链接分析工具 - 识别网站类型并提供相应的图标和标签

export interface LinkInfo {
  domain: string;
  type: string;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}

// 网站类型配置
const SITE_CONFIGS: Record<string, Omit<LinkInfo, 'domain'>> = {
  // 技术类
  'github.com': {
    type: 'tech',
    label: 'GitHub',
    icon: '🐙',
    color: '#24292e',
    bgColor: '#f6f8fa'
  },
  'stackoverflow.com': {
    type: 'tech',
    label: 'Stack Overflow',
    icon: '📚',
    color: '#f48024',
    bgColor: '#fdf7e7'
  },
  'developer.mozilla.org': {
    type: 'docs',
    label: 'MDN',
    icon: '📖',
    color: '#000000',
    bgColor: '#f0f0f0'
  },
  'docs.python.org': {
    type: 'docs',
    label: 'Python Docs',
    icon: '🐍',
    color: '#3776ab',
    bgColor: '#e7f3ff'
  },
  'nodejs.org': {
    type: 'tech',
    label: 'Node.js',
    icon: '💚',
    color: '#339933',
    bgColor: '#e8f5e8'
  },
  'reactjs.org': {
    type: 'tech',
    label: 'React',
    icon: '⚛️',
    color: '#61dafb',
    bgColor: '#e8f8fd'
  },
  'nextjs.org': {
    type: 'tech',
    label: 'Next.js',
    icon: '▲',
    color: '#000000',
    bgColor: '#f0f0f0'
  },
  'tailwindcss.com': {
    type: 'tech',
    label: 'Tailwind CSS',
    icon: '💨',
    color: '#06b6d4',
    bgColor: '#e0f7fa'
  },

  // 博客/媒体类
  'medium.com': {
    type: 'blog',
    label: 'Medium',
    icon: '✍️',
    color: '#00ab6c',
    bgColor: '#e8f5f0'
  },
  'dev.to': {
    type: 'blog',
    label: 'DEV',
    icon: '👨‍💻',
    color: '#0a0a0a',
    bgColor: '#f5f5f5'
  },
  'hashnode.com': {
    type: 'blog',
    label: 'Hashnode',
    icon: '📝',
    color: '#2962ff',
    bgColor: '#e3f2fd'
  },
  'substack.com': {
    type: 'newsletter',
    label: 'Substack',
    icon: '📧',
    color: '#ff6719',
    bgColor: '#fff3e0'
  },

  // 学习/教育类
  'coursera.org': {
    type: 'education',
    label: 'Coursera',
    icon: '🎓',
    color: '#0056d3',
    bgColor: '#e3f2fd'
  },
  'udemy.com': {
    type: 'education',
    label: 'Udemy',
    icon: '📚',
    color: '#a435f0',
    bgColor: '#f3e5f5'
  },
  'khan academy.org': {
    type: 'education',
    label: 'Khan Academy',
    icon: '🏫',
    color: '#14bf96',
    bgColor: '#e0f2f1'
  },

  // 工具类
  'figma.com': {
    type: 'design',
    label: 'Figma',
    icon: '🎨',
    color: '#f24e1e',
    bgColor: '#ffeee8'
  },
  'notion.so': {
    type: 'productivity',
    label: 'Notion',
    icon: '📋',
    color: '#000000',
    bgColor: '#f7f7f7'
  },
  'trello.com': {
    type: 'productivity',
    label: 'Trello',
    icon: '📋',
    color: '#0079bf',
    bgColor: '#e3f2fd'
  },

  // 视频类
  'youtube.com': {
    type: 'video',
    label: 'YouTube',
    icon: '📺',
    color: '#ff0000',
    bgColor: '#ffebee'
  },
  'bilibili.com': {
    type: 'video',
    label: 'Bilibili',
    icon: '📺',
    color: '#00a1d6',
    bgColor: '#e1f5fe'
  },

  // 社交/论坛类
  'twitter.com': {
    type: 'social',
    label: 'Twitter',
    icon: '🐦',
    color: '#1da1f2',
    bgColor: '#e3f2fd'
  },
  'x.com': {
    type: 'social',
    label: 'X',
    icon: '✖️',
    color: '#000000',
    bgColor: '#f5f5f5'
  },
  'linkedin.com': {
    type: 'social',
    label: 'LinkedIn',
    icon: '💼',
    color: '#0077b5',
    bgColor: '#e3f2fd'
  },
  'reddit.com': {
    type: 'social',
    label: 'Reddit',
    icon: '🔴',
    color: '#ff4500',
    bgColor: '#fff3e0'
  },

  // 官方文档/规范
  'w3.org': {
    type: 'spec',
    label: 'W3C',
    icon: '🌐',
    color: '#005a9c',
    bgColor: '#e3f2fd'
  },
  'tc39.es': {
    type: 'spec',
    label: 'TC39',
    icon: '📋',
    color: '#f7df1e',
    bgColor: '#fffde7'
  },

  // 中文网站
  'zhihu.com': {
    type: 'social',
    label: '知乎',
    icon: '🤔',
    color: '#0084ff',
    bgColor: '#e3f2fd'
  },
  'juejin.cn': {
    type: 'blog',
    label: '掘金',
    icon: '⛏️',
    color: '#007fff',
    bgColor: '#e3f2fd'
  },
  'csdn.net': {
    type: 'blog',
    label: 'CSDN',
    icon: '💻',
    color: '#fc5531',
    bgColor: '#fff3e0'
  },
  'segmentfault.com': {
    type: 'tech',
    label: 'SegmentFault',
    icon: '🔧',
    color: '#009a61',
    bgColor: '#e8f5f0'
  },
  'cnblogs.com': {
    type: 'blog',
    label: '博客园',
    icon: '🌸',
    color: '#2e8b57',
    bgColor: '#f0f8f0'
  }
};

// 默认配置
const DEFAULT_CONFIG: Omit<LinkInfo, 'domain'> = {
  type: 'external',
  label: '外部链接',
  icon: '🔗',
  color: '#6b7280',
  bgColor: '#f9fafb'
};

/**
 * 从URL中提取域名
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * 分析链接并返回对应的信息
 */
export function analyzeLinkInfo(url: string): LinkInfo {
  const domain = extractDomain(url);

  // 精确匹配
  const config = SITE_CONFIGS[domain];
  if (config) {
    return { domain, ...config };
  }

  // 模糊匹配（包含关键词）
  const domainParts = domain.split('.');
  for (const [siteDomain, siteConfig] of Object.entries(SITE_CONFIGS)) {
    const siteParts = siteDomain.split('.');
    if (siteParts.some(part => domainParts.includes(part))) {
      return { domain, ...siteConfig };
    }
  }

  // 返回默认配置
  return { domain, ...DEFAULT_CONFIG };
}

/**
 * 检查是否为内部链接
 */
export function isInternalLink(url: string): boolean {
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.origin === window.location.origin;
  } catch {
    return !url.startsWith('http');
  }
}

/**
 * 格式化显示域名
 */
export function formatDisplayDomain(domain: string): string {
  // 移除常见前缀
  return domain.replace(/^(www|m|mobile)\./, '');
}