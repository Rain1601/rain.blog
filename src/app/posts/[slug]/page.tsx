'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { InteractiveCodeBlock } from '@/components/InteractiveCodeBlock';
import { getPostBySlug, getAllPosts } from '@/utils/posts';

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <Layout>
      <article className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-900">
        <div className="max-w-4xl mx-auto px-6 py-20">
          {/* 极简文章头部 */}
          <header className="mb-16 animate-fade-in-down">
            {/* 返回链接 */}
            <Link 
              href="/blog"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors mb-12 group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回博客
            </Link>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <time className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {post.date}
              </time>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readTime}
              </span>
            </div>
            
            {/* 标签 */}
            <div className="flex flex-wrap gap-3 mt-6">
              {post.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </header>

          {/* 文章内容 - 极简排版 */}
          <div className="prose prose-lg prose-gray dark:prose-invert max-w-none animate-fade-in-up">
            {/* 根据不同的文章渲染不同的内容 */}
            {post.slug === 'python-basics' && (
              <>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                  学习Python的基础语法，包括变量、数据类型、控制结构等核心概念。
                </p>
                
                <h2>变量和数据类型</h2>
                <p>Python是一种动态类型语言，你不需要声明变量的类型。让我们看一些例子：</p>
                
                <InteractiveCodeBlock
                  code={`# 变量赋值
name = "PyBlog"
age = 2024
pi = 3.14159
is_active = True

# 打印变量
print(f"名称: {name}")
print(f"年份: {age}")
print(f"圆周率: {pi}")
print(f"是否活跃: {is_active}")

# 类型检查
print(f"\\nname的类型: {type(name)}")
print(f"age的类型: {type(age)}")
print(f"pi的类型: {type(pi)}")
print(f"is_active的类型: {type(is_active)}")`}
                />
                
                <h2>列表和字典</h2>
                <p>Python提供了强大的数据结构来组织和管理数据：</p>
                
                <InteractiveCodeBlock
                  code={`# 列表
fruits = ["苹果", "香蕉", "橙子", "葡萄"]
print("水果列表:", fruits)
print(f"第一个水果: {fruits[0]}")
print(f"最后一个水果: {fruits[-1]}")

# 添加元素
fruits.append("西瓜")
print(f"\\n添加后: {fruits}")

# 字典
student = {
    "姓名": "小明",
    "年龄": 18,
    "成绩": {"数学": 95, "英语": 88, "物理": 92}
}

print(f"\\n学生信息: {student}")
print(f"姓名: {student['姓名']}")
print(f"数学成绩: {student['成绩']['数学']}")`}
                />
                
                <h2>控制流</h2>
                <p>使用条件语句和循环来控制程序的执行流程：</p>
                
                <InteractiveCodeBlock
                  code={`# 条件语句
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "D"

print(f"分数: {score}, 等级: {grade}")

# 循环
print("\\n1到10的平方:")
for i in range(1, 11):
    print(f"{i}² = {i**2}")

# 列表推导式
squares = [x**2 for x in range(1, 6)]
print(f"\\n前5个平方数: {squares}")`}
                />
                
                <h2>函数定义</h2>
                <p>函数是组织代码的基本单位：</p>
                
                <InteractiveCodeBlock
                  code={`# 定义函数
def greet(name, greeting="你好"):
    """向某人打招呼"""
    return f"{greeting}, {name}!"

# 使用函数
print(greet("小明"))
print(greet("Alice", "Hello"))

# 带有多个返回值的函数
def calculate_stats(numbers):
    """计算列表的统计信息"""
    return min(numbers), max(numbers), sum(numbers) / len(numbers)

data = [23, 45, 67, 89, 12, 56, 78, 90]
min_val, max_val, avg_val = calculate_stats(data)

print(f"\\n数据: {data}")
print(f"最小值: {min_val}")
print(f"最大值: {max_val}")
print(f"平均值: {avg_val:.2f}")`}
                />
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>💡 提示：</strong>尝试修改上面的代码，看看会发生什么！你可以改变变量值、添加新的条件分支，或者创建自己的函数。
                  </p>
                </div>
              </>
            )}
            
            {post.slug === 'openai-integration' && (
              <>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                  学习如何在Python中使用OpenAI API进行文本生成、聊天对话等AI功能。
                </p>
                
                <h2>安装和配置</h2>
                <p>首先，你需要安装OpenAI Python库。在实际项目中，你可以使用pip安装：</p>
                
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-6 font-mono text-sm">
                  pip install openai
                </div>
                
                <h2>基本使用示例</h2>
                <p>下面是一个简单的文本生成示例（注意：在浏览器环境中，我们使用模拟的API）：</p>
                
                <InteractiveCodeBlock
                  code={`# 模拟OpenAI API调用
class OpenAI:
    def __init__(self, api_key):
        self.api_key = api_key
    
    def complete(self, prompt, max_tokens=50):
        # 在实际使用中，这里会调用真实的API
        return f"[AI回复] 基于提示 '{prompt}' 生成的内容..."

# 创建客户端
client = OpenAI(api_key="your-api-key-here")

# 生成文本
prompt = "Python是一种"
response = client.complete(prompt)
print(f"提示: {prompt}")
print(f"生成: {response}")

# 更多示例
prompts = [
    "机器学习的定义是",
    "编程最佳实践包括",
    "数据分析的步骤有"
]

print("\\n更多生成示例:")
for p in prompts:
    print(f"\\n提示: {p}")
    print(f"生成: {client.complete(p)}")`}
                />
                
                <h2>构建对话系统</h2>
                <p>使用OpenAI API构建交互式对话系统：</p>
                
                <InteractiveCodeBlock
                  code={`# 对话系统示例
class ChatBot:
    def __init__(self):
        self.history = []
        
    def add_message(self, role, content):
        self.history.append({"role": role, "content": content})
        
    def get_response(self, user_input):
        self.add_message("user", user_input)
        # 模拟AI响应
        ai_response = f"我理解你说的 '{user_input}'。这是一个很好的问题！"
        self.add_message("assistant", ai_response)
        return ai_response
    
    def show_history(self):
        print("对话历史:")
        for msg in self.history:
            prefix = "用户" if msg["role"] == "user" else "AI"
            print(f"{prefix}: {msg['content']}")

# 创建聊天机器人
bot = ChatBot()

# 模拟对话
questions = [
    "什么是Python?",
    "如何学习编程?",
    "推荐一些学习资源"
]

for q in questions:
    print(f"\\n用户: {q}")
    response = bot.get_response(q)
    print(f"AI: {response}")

print("\\n" + "="*50)
bot.show_history()`}
                />
                
                <h2>实用技巧</h2>
                
                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 my-8 rounded-r-lg">
                  <h3 className="text-lg font-semibold mb-3">最佳实践</h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• 始终保护你的API密钥，不要在代码中硬编码</li>
                    <li>• 实现错误处理和重试机制</li>
                    <li>• 监控API使用量和成本</li>
                    <li>• 缓存常见请求以提高性能</li>
                  </ul>
                </div>
                
                <InteractiveCodeBlock
                  code={`# 错误处理示例
def safe_api_call(prompt):
    try:
        # 模拟API调用
        if len(prompt) == 0:
            raise ValueError("提示不能为空")
        if len(prompt) > 1000:
            raise ValueError("提示太长")
        
        # 模拟成功响应
        return {"status": "success", "data": f"处理了: {prompt}"}
    except ValueError as e:
        return {"status": "error", "message": str(e)}
    except Exception as e:
        return {"status": "error", "message": "未知错误"}

# 测试不同情况
test_cases = ["", "正常的提示", "x" * 1001]

for test in test_cases:
    result = safe_api_call(test)
    if result["status"] == "success":
        print(f"✅ 成功: {result['data']}")
    else:
        print(f"❌ 错误: {result['message']}")`}
                />
              </>
            )}
            
            {post.slug === 'data-analysis' && (
              <>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                  使用pandas和numpy进行数据分析，包括数据清洗、统计分析和可视化。
                </p>
                
                <h2>数据结构基础</h2>
                <p>让我们从创建和操作基本的数据结构开始：</p>
                
                <InteractiveCodeBlock
                  code={`# 创建示例数据
import random

# 生成销售数据
products = ["笔记本", "手机", "平板", "耳机", "键盘"]
months = ["1月", "2月", "3月", "4月", "5月", "6月"]

# 创建销售记录
sales_data = []
for month in months:
    for product in products:
        sales_data.append({
            "月份": month,
            "产品": product,
            "销量": random.randint(50, 200),
            "单价": random.randint(100, 5000),
        })

# 显示前5条记录
print("销售数据示例:")
for i, record in enumerate(sales_data[:5]):
    print(f"{i+1}. {record}")

# 计算总销售额
for record in sales_data:
    record["销售额"] = record["销量"] * record["单价"]

print(f"\\n数据总条数: {len(sales_data)}")`}
                />
                
                <h2>数据分析</h2>
                <p>对数据进行统计分析和汇总：</p>
                
                <InteractiveCodeBlock
                  code={`# 数据分析
# 按产品汇总
product_summary = {}
for record in sales_data:
    product = record["产品"]
    if product not in product_summary:
        product_summary[product] = {"总销量": 0, "总销售额": 0}
    product_summary[product]["总销量"] += record["销量"]
    product_summary[product]["总销售额"] += record["销售额"]

print("产品销售汇总:")
for product, summary in product_summary.items():
    avg_price = summary["总销售额"] / summary["总销量"]
    print(f"{product}: 总销量={summary['总销量']}, 总销售额={summary['总销售额']:,}, 平均单价={avg_price:.2f}")

# 按月份汇总
month_summary = {}
for record in sales_data:
    month = record["月份"]
    if month not in month_summary:
        month_summary[month] = 0
    month_summary[month] += record["销售额"]

print("\\n月度销售趋势:")
for month in months:
    sales = month_summary[month]
    bar = "█" * (sales // 50000)
    print(f"{month}: {sales:,} {bar}")`}
                />
                
                <h2>数据可视化</h2>
                <p>使用简单的文本图表来可视化数据：</p>
                
                <InteractiveCodeBlock
                  code={`# 创建简单的文本图表
def create_bar_chart(data, title, max_width=50):
    """创建文本条形图"""
    print(f"\\n{title}")
    print("=" * (max_width + 20))
    
    if not data:
        return
        
    max_value = max(data.values())
    
    for label, value in data.items():
        bar_width = int((value / max_value) * max_width)
        bar = "█" * bar_width
        print(f"{label:8} | {bar} {value:,}")

# 产品销量图表
product_sales = {p: s["总销量"] for p, s in product_summary.items()}
create_bar_chart(product_sales, "产品销量对比")

# 月度销售额图表
create_bar_chart(month_summary, "月度销售额趋势")

# 找出最佳销售组合
best_combo = max(sales_data, key=lambda x: x["销售额"])
print(f"\\n最佳销售记录:")
print(f"月份: {best_combo['月份']}, 产品: {best_combo['产品']}")
print(f"销量: {best_combo['销量']}, 单价: {best_combo['单价']}")
print(f"销售额: {best_combo['销售额']:,}")`}
                />
                
                <h2>数据清洗技巧</h2>
                
                <InteractiveCodeBlock
                  code={`# 数据清洗示例
# 创建包含问题的数据
messy_data = [
    {"name": "张三", "age": 25, "score": 85},
    {"name": "李四", "age": -5, "score": 92},  # 异常年龄
    {"name": "王五", "age": 30, "score": 150},  # 异常分数
    {"name": "", "age": 28, "score": 78},  # 空名字
    {"name": "赵六", "age": None, "score": 88},  # 缺失值
]

print("原始数据:")
for i, record in enumerate(messy_data):
    print(f"{i+1}. {record}")

# 数据清洗函数
def clean_record(record):
    """清洗单条记录"""
    # 处理名字
    if not record.get("name"):
        record["name"] = "未知"
    
    # 处理年龄
    age = record.get("age")
    if age is None or age < 0 or age > 100:
        record["age"] = 25  # 使用默认值
    
    # 处理分数
    score = record.get("score", 0)
    if score > 100:
        record["score"] = 100
    elif score < 0:
        record["score"] = 0
    
    return record

# 清洗数据
cleaned_data = [clean_record(record.copy()) for record in messy_data]

print("\\n清洗后的数据:")
for i, record in enumerate(cleaned_data):
    print(f"{i+1}. {record}")

# 数据质量报告
print("\\n数据质量报告:")
print(f"总记录数: {len(messy_data)}")
print(f"有效姓名: {sum(1 for r in messy_data if r.get('name'))}")
print(f"有效年龄: {sum(1 for r in messy_data if r.get('age') and 0 < r['age'] < 100)}")
print(f"有效分数: {sum(1 for r in messy_data if 0 <= r.get('score', -1) <= 100)}")`}
                />
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 my-8 rounded-r-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>📊 练习建议：</strong>尝试修改数据生成逻辑，创建不同类型的数据集，并进行自己的分析。你可以添加更多的产品类别、扩展时间范围，或者计算更复杂的统计指标。
                  </p>
                </div>
              </>
            )}
          </div>

          {/* 文章底部导航 */}
          <div className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回博客列表
              </Link>
              
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors group"
              >
                回到顶部
                <svg className="w-5 h-5 ml-2 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
}

 