'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { useEffect, useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function Layout({ children, title, description }: LayoutProps) {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = [
    { name: '首页', href: '/' },
    { name: '博客', href: '/blog' },
    { name: 'OpenAI示例', href: '/posts/openai-integration' },
    { name: 'Python基础', href: '/posts/python-basics' },
    { name: '数据分析', href: '/posts/data-analysis' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                PyBlog
              </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  交互式Python博客
                </div>
              </div>
            </Link>

            {/* 桌面端导航 */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
              <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
              >
                  {item.name}
              </Link>
              ))}
            </div>

            {/* 右侧工具栏 */}
            <div className="flex items-center space-x-3">
              {/* 搜索按钮 */}
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>

              {/* 主题切换 */}
              {mounted && <ThemeToggle />}

              {/* 移动端菜单按钮 */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* 移动端菜单 */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-slate-700 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* 主要内容 */}
      <main>
          {children}
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* 品牌信息 */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">PyBlog</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
                基于Pyodide的交互式Python博客平台，让您在浏览器中直接运行Python代码，探索编程的乐趣。
              </p>
            </div>

            {/* 快速链接 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                快速链接
              </h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 技术栈 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                技术栈
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>Next.js 15</li>
                <li>Pyodide</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Monaco Editor</li>
              </ul>
            </div>
          </div>

          {/* 版权信息 */}
          <div className="border-t border-gray-200 dark:border-slate-700 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © 2024 PyBlog. 基于 Pyodide 构建的交互式Python学习平台.
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Powered by Pyodide
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 