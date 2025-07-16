export interface BlogConfig {
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
  readTime: string;
  category: string;
  published: boolean;
  author?: string;
  coverImage?: string;
}

// 标签配置 - 支持动态配置
export const tagConfig = {
  // 技术标签
  'Python': { color: '#3776ab', description: 'Python编程语言' },
  'JavaScript': { color: '#f7df1e', description: 'JavaScript编程语言' },
  'TypeScript': { color: '#3178c6', description: 'TypeScript编程语言' },
  'React': { color: '#61dafb', description: 'React前端框架' },
  'Next.js': { color: '#000000', description: 'Next.js全栈框架' },
  'Node.js': { color: '#339933', description: 'Node.js运行时' },
  
  // AI/机器学习标签
  'AI': { color: '#ff6b35', description: '人工智能' },
  'OpenAI': { color: '#412991', description: 'OpenAI API和工具' },
  '机器学习': { color: '#ff9500', description: '机器学习技术' },
  '深度学习': { color: '#e74c3c', description: '深度学习技术' },
  
  // 数据分析标签
  '数据分析': { color: '#2ecc71', description: '数据分析技术' },
  'pandas': { color: '#150458', description: 'Pandas数据处理库' },
  'numpy': { color: '#013243', description: 'NumPy数值计算库' },
  '可视化': { color: '#9b59b6', description: '数据可视化' },
  
  // 学习标签
  '基础': { color: '#3498db', description: '基础教程' },
  '教程': { color: '#1abc9c', description: '教程类文章' },
  '进阶': { color: '#e67e22', description: '进阶技术' },
  '最佳实践': { color: '#34495e', description: '最佳实践指南' },
  
  // Web开发标签
  '前端': { color: '#ff4757', description: '前端开发' },
  '后端': { color: '#5f27cd', description: '后端开发' },
  '全栈': { color: '#00d2d3', description: '全栈开发' },
  'API': { color: '#ff6348', description: 'API开发' },
  
  // 工具标签
  'Git': { color: '#f05032', description: 'Git版本控制' },
  'Docker': { color: '#2496ed', description: 'Docker容器化' },
  'Linux': { color: '#fcc624', description: 'Linux系统' },
} as const;

// 分类配置
export const categoryConfig = {
  'tutorial': { name: '教程', description: '技术教程和指南', icon: '📚' },
  'ai': { name: 'AI/ML', description: '人工智能和机器学习', icon: '🤖' },
  'web-dev': { name: 'Web开发', description: '前端后端全栈开发', icon: '🌐' },
  'data': { name: '数据科学', description: '数据分析和可视化', icon: '📊' },
  'tools': { name: '工具', description: '开发工具和效率', icon: '🛠️' },
  'thoughts': { name: '思考', description: '技术思考和心得', icon: '💭' },
} as const;

// 博客文章配置
export const blogPosts: Record<string, BlogConfig> = {
  'python-basics': {
    title: 'Python基础教程',
    excerpt: '学习Python的基础语法，包括变量、数据类型、控制结构等核心概念。适合编程初学者。',
    tags: ['Python', '基础', '教程'],
    date: '2024-01-15',
    readTime: '15分钟',
    category: 'tutorial',
    published: true,
    author: 'Rain',
  },
  'openai-integration': {
    title: '使用OpenAI API进行文本生成',
    excerpt: '深入学习如何在Python中使用OpenAI API进行文本生成、聊天对话等AI功能，包含实际代码示例。',
    tags: ['OpenAI', 'AI', 'API', 'Python'],
    date: '2024-01-16',
    readTime: '20分钟',
    category: 'ai',
    published: true,
    author: 'Rain',
  },
  'data-analysis': {
    title: '数据分析入门',
    excerpt: '使用pandas和numpy进行数据分析，包括数据清洗、统计分析和可视化技术。',
    tags: ['数据分析', 'pandas', 'numpy', '可视化', 'Python'],
    date: '2024-01-17',
    readTime: '25分钟',
    category: 'data',
    published: true,
    author: 'Rain',
  },
};

// 获取标签的颜色和描述
export function getTagInfo(tag: string) {
  return tagConfig[tag as keyof typeof tagConfig] || { 
    color: '#6b7280', 
    description: tag 
  };
}

// 获取分类信息
export function getCategoryInfo(category: string) {
  return categoryConfig[category as keyof typeof categoryConfig] || {
    name: category,
    description: category,
    icon: '📝'
  };
}

// 获取所有可用标签
export function getAllAvailableTags(): string[] {
  return Object.keys(tagConfig).sort();
}

// 获取所有可用分类
export function getAllAvailableCategories(): string[] {
  return Object.keys(categoryConfig);
} 