import { Layout } from '@/components/Layout';

export default function TestPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            样式测试页面
          </h1>
          
          <div className="space-y-8">
            {/* 测试居中布局 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
                布局测试
              </h2>
              <p className="text-blue-700 dark:text-blue-300">
                这个区域应该居中显示，最大宽度为 4xl (896px)，并且有适当的内边距。
              </p>
            </div>

            {/* 测试按钮样式 */}
            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                按钮测试
              </h2>
              <div className="flex flex-wrap gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  主按钮
                </button>
                <button className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors">
                  次按钮
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  边框按钮
                </button>
              </div>
            </div>

            {/* 测试颜色系统 */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                颜色系统测试
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    主色调
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      <span className="text-gray-600 dark:text-gray-300">蓝色 600</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-700 rounded"></div>
                      <span className="text-gray-600 dark:text-gray-300">蓝色 700</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    灰度系统
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-900 dark:bg-white rounded"></div>
                      <span className="text-gray-600 dark:text-gray-300">主文本色</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-600 dark:bg-gray-300 rounded"></div>
                      <span className="text-gray-600 dark:text-gray-300">次文本色</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 测试卡片样式 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  卡片 1
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  这是一个测试卡片，用于验证卡片样式是否正确应用。
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  卡片 2
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  这是另一个测试卡片，验证响应式布局是否正常工作。
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  卡片 3
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  第三个测试卡片，展示暗色模式的效果。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 