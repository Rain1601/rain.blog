'use client';

import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { InteractiveCodeBlock } from '@/components/InteractiveCodeBlock';

export default function HomePage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        {/* Hero Section - 全屏高度 */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-pink-600/20 animate-gradient-x"></div>
          
          {/* Floating orbs for visual interest */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          
          <div className="relative w-full max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-blue-600 dark:from-white dark:via-blue-400 dark:to-blue-600 mb-12 leading-tight animate-fade-in-up">
                在浏览器中
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  运行Python
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-16 leading-relaxed animate-fade-in-up animation-delay-200">
                无需安装，无需配置。直接在浏览器中编写和运行Python代码，探索编程的乐趣。
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animation-delay-400">
                <Link 
                  href="/blog"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px 32px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderRadius: '50px',
                    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)',
                    textDecoration: 'none',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    transform: 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    开始学习
                    <svg style={{ width: '20px', height: '20px', marginLeft: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                
                <a 
                  href="#demo"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px 32px',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderRadius: '50px',
                    border: '2px solid #d1d5db',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    transform: 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.borderColor = '#60a5fa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    体验Demo
                    <svg style={{ width: '20px', height: '20px', marginLeft: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </a>
              </div>
              
              {/* 向下滚动提示 */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* 增加间距的分隔区域 */}
        <div className="h-32"></div>

        {/* Features Section - 优化间距 */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-32">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
                为什么选择
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"> PyBlog</span>
                ？
              </h2>
              <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                基于Pyodide技术，在浏览器中提供完整的Python运行环境
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {/* Feature card 1 - 极简设计 */}
              <div className="group relative">
                <div className="relative h-full bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="inline-flex p-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg mb-8">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">即时执行</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      无需安装Python环境，代码在浏览器中直接运行，结果立即显示
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature card 2 - 极简设计 */}
              <div className="group relative">
                <div className="relative h-full bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="inline-flex p-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-8">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">丰富的库</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      支持NumPy、Pandas、Matplotlib等主流数据科学库
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature card 3 - 极简设计 */}
              <div className="group relative">
                <div className="relative h-full bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="inline-flex p-5 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl shadow-lg mb-8">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">交互学习</h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      边学边练，通过实际代码运行加深理解
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 增加间距的分隔区域 */}
        <div className="h-32"></div>

        {/* Demo Section - 优化间距 */}
        <section id="demo" className="py-24 relative bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-slate-800/30">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
                立即体验
              </h2>
              <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                试试下面的Python代码，感受在浏览器中编程的乐趣
              </p>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-pink-600/20 blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* 模拟编辑器标题栏 */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">main.py</span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">Python 3.11</span>
                  </div>
                </div>
                <InteractiveCodeBlock
                  code={`# 欢迎来到PyBlog！
print("🐍 Hello, Python!")

# 基础数据分析示例
import random

# 生成随机数据
data = [random.randint(1, 100) for _ in range(10)]
print(f"随机数据: {data}")

# 计算统计信息
print(f"平均值: {sum(data) / len(data):.2f}")
print(f"最大值: {max(data)}")
print(f"最小值: {min(data)}")

# 简单的数据可视化
print("\\n📊 数据可视化:")
for i, value in enumerate(data):
    bar = "█" * (value // 5)
    print(f"数据{i+1:2d}: {value:3d} {bar}")

print("\\n🎉 试试修改代码，看看会发生什么！")`}
                  height={450}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 增加间距的分隔区域 */}
        <div className="h-32"></div>

        {/* CTA Section - 简化设计，优化间距 */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl opacity-10"></div>
          
          <div className="relative max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 mb-8">
              准备好开始学习了吗？
            </h2>
            <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-16 max-w-3xl mx-auto">
              探索更多教程和交互式代码示例，开启你的Python编程之旅
            </p>
            
            <Link
              href="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '20px 48px',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                borderRadius: '50px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                textDecoration: 'none',
                border: 'none',
                transition: 'all 0.3s ease',
                transform: 'scale(1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)';
              }}
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              浏览所有教程
              <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
