'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { getAllPosts, getAllTags, getPostsByTag } from '@/utils/posts';

export default function BlogPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const allPosts = getAllPosts();
  const allTags = getAllTags();
  const displayPosts = selectedTag ? getPostsByTag(selectedTag) : allPosts;
  
  // 计算每个标签的文章数
  const getTagCount = (tag: string) => {
    return getPostsByTag(tag).length;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-900">
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          {/* 极简页头 */}
          <header className="mb-20 animate-fade-in-down">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              博客文章
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
              探索Python编程、数据分析和人工智能的精彩世界
            </p>
          </header>

          {/* 极简标签筛选器 */}
          <div className="mb-16 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">筛选：</span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTag === null
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                全部 ({allPosts.length})
              </button>
              
              {allTags.map((tag) => {
                const count = getTagCount(tag);
                const isSelected = selectedTag === tag;
                
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {tag} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* 极简文章列表 */}
          <div className="space-y-12">
            {displayPosts.map((post, index) => (
              <article
                key={post.id}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link href={`/posts/${post.slug}`} className="block">
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <time>{post.date}</time>
                        <span>·</span>
                        <span>{post.readTime}</span>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h2>
                      
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-sm text-gray-500 dark:text-gray-400"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          阅读更多 →
                        </span>
                      </div>
                    </div>
                    
                    {/* 简约的装饰元素 */}
                    <div className="hidden md:block w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
                      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400 dark:text-gray-600">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  
                  {/* 分隔线 */}
                  {index < displayPosts.length - 1 && (
                    <div className="mt-12 h-px bg-gray-200 dark:bg-gray-800"></div>
                  )}
                </Link>
              </article>
            ))}
          </div>
          
          {/* 空状态 - 极简设计 */}
          {displayPosts.length === 0 && (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                没有找到文章
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                试试选择其他标签
              </p>
              <button
                onClick={() => setSelectedTag(null)}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                查看全部文章
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 