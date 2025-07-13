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

  return (
    <Layout>
      <div className="max-w-content mx-auto px-4 py-8">
        <div className="space-y-16">
          {/* Hero Section - 简化设计 */}
          <div className="text-center py-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[var(--text-primary)] mb-6 leading-tight">
              交互式编程博客
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-8 leading-relaxed max-w-2xl mx-auto">
              在浏览器中直接运行Python代码，探索编程、数据分析和AI的精彩世界
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span>Python 3.11</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span>实时执行</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                <span>无需安装</span>
              </div>
            </div>
          </div>

          {/* 标签筛选器 - 简化设计 */}
          <div className="animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 md:mb-0">
                最新文章
              </h2>
              <div className="text-sm text-[var(--text-secondary)]">
                共 {displayPosts.length} 篇文章
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  selectedTag === null
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]'
                }`}
              >
                全部
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    selectedTag === tag
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            {selectedTag && (
              <div className="mb-8 p-4 bg-[var(--accent-soft)] border border-[var(--accent)]/20 rounded-lg animate-fade-in">
                <p className="text-sm text-[var(--accent)]">
                  显示标签为 "{selectedTag}" 的文章
                </p>
              </div>
            )}
          </div>

          {/* 文章列表 */}
          <div className="animate-slide-up">
            {displayPosts.length > 0 ? (
              <div className="space-y-8">
                {displayPosts.map((post, index) => (
                  <article
                    key={post.id}
                    className="pb-8 border-b border-[var(--border)] last:border-b-0 group"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* 文章信息 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <time 
                            dateTime={post.date}
                            className="text-sm text-[var(--text-muted)]"
                          >
                            {post.date}
                          </time>
                          <span className="text-[var(--text-muted)]">•</span>
                          <span className="text-sm text-[var(--text-muted)]">
                            {post.readTime}
                          </span>
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-3 leading-tight group-hover:text-[var(--accent)] transition-colors duration-200">
                          <Link href={`/posts/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className="px-2 py-1 text-xs font-medium bg-[var(--bg-secondary)] text-[var(--text-muted)] rounded hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-all duration-200"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                          
                          <Link
                            href={`/posts/${post.slug}`}
                            className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium text-sm transition-colors duration-200"
                          >
                            阅读全文 →
                          </Link>
                        </div>
                      </div>
                      
                      {/* 交互式标识 */}
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <span>可运行代码</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* 空状态 */
              <div className="text-center py-16 animate-fade-in">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                  没有找到相关文章
                </h3>
                <p className="text-[var(--text-secondary)] mb-6">
                  没有找到标签为 "{selectedTag}" 的文章
                </p>
                <button
                  onClick={() => setSelectedTag(null)}
                  className="btn btn-primary"
                >
                  清除筛选
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 