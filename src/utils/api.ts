import { BlogPost } from './github';

/**
 * 客户端API工具函数
 * 通过Next.js API路由调用GitHub API，确保环境变量在服务器端可用
 */

const API_BASE = '/api/github';

/**
 * 获取所有博客文章
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${API_BASE}/posts`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '获取文章失败');
    }
    
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('获取所有文章失败:', error);
    throw error;
  }
}

/**
 * 根据ID获取单篇文章
 */
export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${API_BASE}/posts?id=${encodeURIComponent(id)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '获取文章失败');
    }
    
    const data = await response.json();
    return data.post || null;
  } catch (error) {
    console.error('获取文章失败:', error);
    throw error;
  }
}

/**
 * 根据年份获取文章
 */
export async function getPostsByYear(year: string): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${API_BASE}/posts?year=${encodeURIComponent(year)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '获取文章失败');
    }
    
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('获取年份文章失败:', error);
    throw error;
  }
}

/**
 * 搜索文章
 */
export async function searchPosts(query: string): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${API_BASE}/posts?search=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '搜索失败');
    }
    
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('搜索文章失败:', error);
    throw error;
  }
}

/**
 * 获取统计信息
 */
export async function getStats(): Promise<{
  totalPosts: number;
  years: string[];
  latestPost?: BlogPost;
}> {
  try {
    const response = await fetch(`${API_BASE}/stats`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '获取统计信息失败');
    }
    
    const data = await response.json();
    return data.stats || { totalPosts: 0, years: [] };
  } catch (error) {
    console.error('获取统计信息失败:', error);
    throw error;
  }
}