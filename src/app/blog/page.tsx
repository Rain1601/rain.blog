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
    <Layout
      title="博客文章"
      description="探索Python编程、数据科学和AI的交互式文章"
    >
      <div className="space-y-8">
        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            博客文章
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            探索Python编程的世界，学习数据分析、人工智能和Web开发
          </p>
        </div>

        {/* 标签筛选器 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            按标签筛选文章
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTag === null
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              全部 ({allPosts.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {tag} ({getPostsByTag(tag).length})
              </button>
            ))}
          </div>
          {selectedTag && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              显示标签为 "{selectedTag}" 的文章 ({displayPosts.length} 篇)
            </p>
          )}
        </div>

        {/* 文章列表 */}
        <div className="grid gap-6">
          {displayPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                {/* 文章元数据 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <time dateTime={post.date}>📅 {post.date}</time>
                    <span>⏱️ {post.readTime}</span>
                  </div>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                
                {/* 文章标题 */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                
                {/* 文章摘要 */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                
                {/* 阅读链接 */}
                <Link
                  href={`/posts/${post.slug}`}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  阅读全文 →
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        {/* 空状态 */}
        {displayPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              没有找到符合条件的文章
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              请尝试选择其他标签或清除筛选条件
            </p>
          </div>
        )}
        
        {/* 统计信息 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            🚀 内容统计
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {allPosts.length}
              </div>
              <div className="text-blue-800 dark:text-blue-200">篇文章</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {allTags.length}
              </div>
              <div className="text-purple-800 dark:text-purple-200">个标签</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {getPostsByTag('Python').length}
              </div>
              <div className="text-green-800 dark:text-green-200">Python教程</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {getPostsByTag('AI').length}
              </div>
              <div className="text-orange-800 dark:text-orange-200">AI相关</div>
            </div>
          </div>
          <p className="mt-4 text-blue-800 dark:text-blue-200">
            我们正在准备更多精彩的Python教程和实践项目，敬请期待！
          </p>
        </div>
      </div>
    </Layout>
  );
} 