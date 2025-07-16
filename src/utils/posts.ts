import { Post, PostMetadata } from '@/types/post';
import { blogPosts, getTagInfo, getCategoryInfo, type BlogConfig } from '@/content/blog/config';

// 将BlogConfig转换为Post类型
function blogConfigToPost(slug: string, config: BlogConfig): Post {
  return {
    id: slug,
    slug,
    title: config.title,
    excerpt: config.excerpt,
    tags: config.tags,
    date: config.date,
    readTime: config.readTime,
  };
}

export function getAllPosts(): Post[] {
  return Object.entries(blogPosts)
    .filter(([, config]) => config.published) // 只返回已发布的文章
    .map(([slug, config]) => blogConfigToPost(slug, config));
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  Object.values(blogPosts).forEach(post => {
    if (post.published) {
      post.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
}

// 新增：搜索文章功能
export function searchPosts(query: string): Post[] {
  const searchLower = query.toLowerCase().trim();
  if (!searchLower) return [];
  
  return getAllPosts().filter(post => 
    post.title.toLowerCase().includes(searchLower) ||
    post.excerpt.toLowerCase().includes(searchLower) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
}

// 新增：综合搜索和标签筛选
export function searchAndFilterPosts(query: string = '', tag: string | null = null): Post[] {
  let posts = getAllPosts();
  
  // 标签筛选
  if (tag) {
    posts = posts.filter(post => 
      post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }
  
  // 文本搜索
  if (query.trim()) {
    const searchLower = query.toLowerCase().trim();
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.tags.some(t => t.toLowerCase().includes(searchLower))
    );
  }
  
  // 按时间排序（最新的在前）
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostMetadata(slug: string): PostMetadata | null {
  const config = blogPosts[slug];
  if (!config || !config.published) return null;
  
  return {
    title: config.title,
    excerpt: config.excerpt,
    tags: config.tags,
    date: config.date,
    readTime: config.readTime,
  };
}

export function getPostsByCategory(category: string): Post[] {
  return Object.entries(blogPosts)
    .filter(([, config]) => config.published && config.category === category)
    .map(([slug, config]) => blogConfigToPost(slug, config));
}

export function getPostBySlug(slug: string): Post | undefined {
  const config = blogPosts[slug];
  if (!config || !config.published) return undefined;
  
  return blogConfigToPost(slug, config);
}

// 新增：获取博客配置
export function getBlogConfig(slug: string): BlogConfig | undefined {
  return blogPosts[slug];
}

// 新增：获取所有分类
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  Object.values(blogPosts).forEach(post => {
    if (post.published) {
      categories.add(post.category);
    }
  });
  return Array.from(categories).sort();
}

// 新增：获取标签信息（包含颜色等）
export function getTagWithInfo(tag: string) {
  return {
    name: tag,
    ...getTagInfo(tag)
  };
}

// 新增：获取分类信息
export function getCategoryWithInfo(category: string) {
  return {
    slug: category,
    ...getCategoryInfo(category)
  };
}

// 新增：获取最新文章
export function getLatestPosts(limit: number = 5): Post[] {
  return getAllPosts()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

 