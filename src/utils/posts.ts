import { Post, PostMetadata } from '@/types/post';

// 文章数据配置
const postsConfig: Record<string, PostMetadata> = {
  'python-basics': {
    title: 'Python基础教程',
    excerpt: '学习Python的基础语法，包括变量、数据类型、控制结构等核心概念。',
    tags: ['Python', '基础', '教程'],
    date: '2024-01-15',
    readTime: '15分钟',
  },
  'openai-integration': {
    title: '使用OpenAI API进行文本生成',
    excerpt: '学习如何在Python中使用OpenAI API进行文本生成、聊天对话等AI功能。',
    tags: ['OpenAI', 'AI', 'API', '文本生成'],
    date: '2024-01-16',
    readTime: '20分钟',
  },
  'data-analysis': {
    title: '数据分析入门',
    excerpt: '使用pandas和numpy进行数据分析，包括数据清洗、统计分析和可视化。',
    tags: ['数据分析', 'pandas', 'numpy', '可视化'],
    date: '2024-01-17',
    readTime: '25分钟',
  },
};

export function getAllPosts(): Post[] {
  return Object.entries(postsConfig).map(([slug, metadata]) => ({
    id: slug,
    slug,
    ...metadata,
  }));
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  Object.values(postsConfig).forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function getPostMetadata(slug: string): PostMetadata | null {
  return postsConfig[slug] || null;
}

export function getPostsByCategory(category: string): Post[] {
  const categoryMap: Record<string, string[]> = {
    'ai': ['AI', 'OpenAI', '机器学习', '深度学习'],
    'data': ['数据分析', 'pandas', 'numpy', '可视化'],
    'basic': ['基础', '教程', 'Python'],
    'advanced': ['高级', '进阶', '性能优化'],
  };
  
  const categoryTags = categoryMap[category.toLowerCase()] || [];
  return getAllPosts().filter(post => 
    post.tags.some(tag => categoryTags.includes(tag))
  );
} 