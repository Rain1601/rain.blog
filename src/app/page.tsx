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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  Rain's Blog
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-16 leading-relaxed animate-fade-in-up animation-delay-200">
                这是一个个人博客，分享技术见解、编程经验和学习心得。
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
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
                核心特性
              </h2>
              <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                在浏览器中直接运行Python代码，探索编程的无限可能
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
              {/* Feature card 1 */}
              <div style={{ position: 'relative', transform: 'scale(1)', transition: 'transform 0.3s ease' }}
                   onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '24px',
                  padding: '40px',
                  boxShadow: '0 20px 40px -10px rgba(102, 126, 234, 0.3)',
                  border: 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                      display: 'inline-flex',
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '16px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      marginBottom: '32px'
                    }}>
                      <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>即时执行</h3>
                    <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.75' }}>
                      无需安装Python环境，代码在浏览器中直接运行，结果立即显示
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature card 2 */}
              <div style={{ position: 'relative', transform: 'scale(1)', transition: 'transform 0.3s ease' }}
                   onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '24px',
                  padding: '40px',
                  boxShadow: '0 20px 40px -10px rgba(240, 147, 251, 0.3)',
                  border: 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                      display: 'inline-flex',
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '16px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      marginBottom: '32px'
                    }}>
                      <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>丰富的库</h3>
                    <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.75' }}>
                      支持NumPy、Pandas、Matplotlib等主流数据科学库
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature card 3 */}
              <div style={{ position: 'relative', transform: 'scale(1)', transition: 'transform 0.3s ease' }}
                   onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                   onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  borderRadius: '24px',
                  padding: '40px',
                  boxShadow: '0 20px 40px -10px rgba(79, 172, 254, 0.3)',
                  border: 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                      display: 'inline-flex',
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '16px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      marginBottom: '32px'
                    }}>
                      <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>交互学习</h3>
                    <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.75' }}>
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

        {/* Demo Section - 极简设计 */}
        <section id="demo" style={{ padding: '80px 0' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>
                在线编辑器
              </h2>
              <p style={{ fontSize: '16px', color: '#6b7280' }}>
                快速体验Python编程
              </p>
            </div>
            
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
              overflow: 'hidden',
              border: '1px solid #e5e7eb'
            }}>
              <InteractiveCodeBlock
                code={`# 快速示例
import random

# 生成随机数据
data = [random.randint(1, 100) for _ in range(10)]
print("数据:", data)
print(f"平均值: {sum(data) / len(data):.2f}")

# 简单可视化
for i, value in enumerate(data):
    print(f"{i}: {'█' * (value // 10)}")`}
                height={300}
              />
            </div>
          </div>
        </section>


      </div>
    </Layout>
  );
}
