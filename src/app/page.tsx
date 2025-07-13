import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { InteractiveCodeBlock } from '@/components/InteractiveCodeBlock';

export default function Home() {
  return (
    <Layout
      title="PyBlog"
      description="在浏览器中运行Python代码的现代博客平台"
    >
      <div className="space-y-8">
        {/* 特性介绍 */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 特性介绍
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                交互式代码
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                基于Pyodide技术，在浏览器中直接运行Python代码，无需后端服务器
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                MDX支持
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                使用MDX格式编写文章，支持在Markdown中嵌入React组件
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                现代化设计
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                基于Tailwind CSS的现代化界面设计，支持暗色主题
              </p>
            </div>
          </div>
        </section>

        {/* 快速体验 */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            🔥 快速体验
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            试试下面的Python代码，直接在浏览器中运行：
          </p>
          
          <InteractiveCodeBlock
            code={`# 欢迎来到PyBlog！
print("Hello, PyBlog!")

# 尝试一些Python基础功能
import math
import random

# 生成一些随机数
numbers = [random.randint(1, 100) for _ in range(10)]
print(f"随机数列表: {numbers}")

# 计算统计信息
print(f"平均值: {sum(numbers) / len(numbers):.2f}")
print(f"最大值: {max(numbers)}")
print(f"最小值: {min(numbers)}")

# 尝试一些数学运算
print(f"圆周率: {math.pi:.6f}")
print(f"自然常数: {math.e:.6f}")`}
            title="Python基础示例"
            description="这是一个基本的Python代码示例，展示了随机数生成和基础数学运算"
            height={400}
          />
        </section>

        {/* 支持的功能 */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            📦 支持的Python包
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'NumPy', desc: '科学计算基础库' },
              { name: 'Pandas', desc: '数据分析和处理' },
              { name: 'Matplotlib', desc: '数据可视化' },
              { name: 'SciPy', desc: '科学计算工具' },
              { name: 'Scikit-learn', desc: '机器学习库' },
              { name: 'SymPy', desc: '符号数学计算' },
            ].map((pkg) => (
              <div key={pkg.name} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {pkg.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {pkg.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 开始使用 */}
        <section className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            🎯 开始使用
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            查看我们的博客文章，了解如何在MDX中使用交互式Python代码块
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/blog/demo"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              查看示例文章
            </Link>
            <Link
              href="/blog"
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              浏览所有文章
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
