'use client';

import Link from 'next/link';
import { useTheme } from './ThemeProvider';
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
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-200">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 bg-[var(--bg-elevated)]/95 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-button transition-all duration-200 group-hover:scale-105">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-white dark:border-neutral-900 animate-pulse-soft" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-display font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200">
                  PyBlog
                </span>
                <div className="text-xs text-[var(--text-muted)] font-medium">
                  交互式编程博客
                </div>
              </div>
            </Link>

            {/* 桌面端导航链接 */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="
                    px-3 py-2 rounded-md text-sm font-medium
                    text-[var(--text-secondary)] 
                    hover:text-[var(--text-primary)]
                    hover:bg-[var(--bg-secondary)]
                    transition-all duration-200
                    relative group
                  "
                >
                  {item.name}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--accent)] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* 右侧控制区域 */}
            <div className="flex items-center space-x-3">
              {/* 搜索按钮 */}
              <button className="hidden md:flex items-center space-x-2 px-3 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md transition-all duration-200 group">
                <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text-primary)]">搜索</span>
                <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-secondary)] border border-[var(--border)] rounded">
                  ⌘K
                </kbd>
              </button>

              {/* 主题切换 */}
              {mounted && <ThemeToggle />}

              {/* 移动端菜单按钮 */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border)] transition-all duration-200"
              >
                <svg className="w-5 h-5 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--border)] bg-[var(--bg-elevated)] animate-fade-in">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="
                    block px-3 py-2 rounded-md text-base font-medium
                    text-[var(--text-secondary)] 
                    hover:text-[var(--text-primary)]
                    hover:bg-[var(--bg-secondary)]
                    transition-all duration-200
                  "
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* 主要内容区域 */}
      <main className="max-w-wide mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        {title && (
          <div className="mb-12 text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--text-primary)] mb-6 leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* 页面内容 */}
        <div className="animate-slide-up">
          {children}
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo和描述 */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <span className="text-lg font-display font-bold text-[var(--text-primary)]">PyBlog</span>
              </div>
              <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
                支持在浏览器中运行Python代码的现代博客平台，让编程学习变得更加直观和有趣。
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://twitter.com" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* 快速链接 */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">快速链接</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">博客</Link></li>
                <li><Link href="/posts/python-basics" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Python教程</Link></li>
                <li><Link href="/posts/data-analysis" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">数据分析</Link></li>
                <li><Link href="/posts/openai-integration" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">OpenAI集成</Link></li>
              </ul>
            </div>

            {/* 技术栈 */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">技术栈</h3>
              <ul className="space-y-2">
                <li><a href="https://pyodide.org/" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Pyodide</a></li>
                <li><a href="https://nextjs.org/" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Next.js</a></li>
                <li><a href="https://tailwindcss.com/" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Tailwind CSS</a></li>
                <li><a href="https://www.typescriptlang.org/" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">TypeScript</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[var(--border)] text-center">
            <p className="text-[var(--text-muted)] text-sm">
              © 2024 PyBlog. 让编程学习更加直观有趣的交互式博客平台。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 