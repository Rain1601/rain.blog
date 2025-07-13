# 🐍 PyBlog - 交互式Python博客平台

一个支持在浏览器中直接运行Python代码的现代博客平台，基于Next.js和Pyodide构建。

## ✨ 特性

- 🚀 **交互式代码块**: 基于Pyodide在浏览器中运行Python代码
- 📝 **MDX支持**: 使用MDX格式编写博客，支持React组件嵌入
- 🎨 **现代化设计**: 基于Tailwind CSS的响应式设计
- 🌙 **暗色主题**: 支持亮色/暗色主题切换
- 📱 **移动端优化**: 适配各种设备屏幕
- ⚡ **性能优化**: 懒加载、错误边界、代码分割
- 🔧 **开发友好**: TypeScript支持，完整的类型定义

## 🛠️ 技术栈

- **前端框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **Python运行时**: Pyodide
- **代码编辑器**: Monaco Editor
- **内容格式**: MDX
- **部署**: Vercel

## 📦 支持的Python包

- NumPy - 科学计算
- Pandas - 数据分析
- Matplotlib - 数据可视化
- SciPy - 科学计算工具
- Scikit-learn - 机器学习
- SymPy - 符号数学

## 🚀 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- npm 或 yarn

### 安装和运行

```bash
# 克隆项目
git clone <repository-url>
cd pyodide-blog

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 启动生产服务器
npm start
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
pyodide-blog/
├── src/
│   ├── app/                    # Next.js App Router页面
│   │   ├── blog/              # 博客页面
│   │   │   ├── page.tsx       # 博客列表
│   │   │   └── demo.mdx       # 示例MDX文章
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 首页
│   │   └── globals.css        # 全局样式
│   ├── components/            # React组件
│   │   ├── InteractiveCodeBlock.tsx  # 交互式代码块
│   │   ├── CodeEditor.tsx     # 代码编辑器
│   │   ├── OutputDisplay.tsx  # 输出显示
│   │   ├── Layout.tsx         # 页面布局
│   │   └── ErrorBoundary.tsx  # 错误边界
│   └── utils/                 # 工具函数
│       └── pyodide.ts         # Pyodide管理
├── public/                    # 静态资源
├── next.config.ts             # Next.js配置
├── tailwind.config.js         # Tailwind CSS配置
├── vercel.json               # Vercel部署配置
└── mdx-components.tsx         # MDX组件映射
```

## 📝 使用指南

### 创建交互式代码块

在MDX文件中使用`InteractiveCodeBlock`组件：

```mdx
import { InteractiveCodeBlock } from '@/components/InteractiveCodeBlock';

<InteractiveCodeBlock
  code={`print("Hello, Python!")
x = 10
y = 20
print(f"x + y = {x + y}")`}
  title="Python基础示例"
  description="这是一个基本的Python代码示例"
  height={300}
/>
```

### 组件属性

- `code`: 默认代码内容
- `height`: 编辑器高度（默认300px）
- `title`: 代码块标题
- `description`: 代码块描述
- `readOnly`: 是否只读（默认false）
- `enableClear`: 是否启用清空环境按钮（默认true）
- `enableReset`: 是否启用重置代码按钮（默认true）

### 创建新的MDX文章

1. 在 `src/app/blog/` 目录下创建新的 `.mdx` 文件
2. 添加文章元数据：

```mdx
export const metadata = {
  title: '文章标题',
  description: '文章描述',
  date: '2024-01-20',
  readTime: '5 分钟',
  tags: ['Python', 'Tutorial'],
};
```

3. 使用Layout组件包装内容：

```mdx
import { Layout } from '@/components/Layout';

<Layout title="文章标题" description="文章描述">
  
  # 文章内容
  
  这里是文章的正文内容...
  
</Layout>
```

## 🚀 部署

### 部署到Vercel

1. 连接GitHub仓库到Vercel
2. 配置项目设置：
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. 部署

详细部署说明请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 环境变量

项目不需要额外的环境变量配置。

## 🔧 开发指南

### 添加新的Python包

在 `src/utils/pyodide.ts` 中的 `loadPyodide` 函数中添加包：

```typescript
await pyodide.loadPackage(['numpy', 'pandas', 'matplotlib', 'new-package']);
```

### 自定义主题

在 `tailwind.config.js` 中修改主题配置：

```javascript
theme: {
  extend: {
    colors: {
      // 添加自定义颜色
    }
  }
}
```

### 添加新的MDX组件

在 `mdx-components.tsx` 中添加组件映射：

```typescript
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 现有组件...
    CustomComponent: ({ children }) => (
      <div className="custom-component">{children}</div>
    ),
    ...components,
  };
}
```

## 🐛 问题排除

### 常见问题

1. **Pyodide加载失败**
   - 检查网络连接
   - 确保浏览器支持WebAssembly
   - 查看浏览器控制台错误信息

2. **代码执行错误**
   - 检查Python语法
   - 确保使用的包已加载
   - 查看错误输出信息

3. **MDX文件无法访问**
   - 检查文件路径和扩展名
   - 确认MDX配置正确
   - 验证文件导入语法

### 性能优化

1. **Pyodide优化**
   - 使用懒加载
   - 缓存Pyodide实例
   - 按需加载Python包

2. **构建优化**
   - 启用Next.js静态生成
   - 使用代码分割
   - 优化图片和静态资源

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Pull Request和Issue！

## 📞 联系

如有问题或建议，请通过以下方式联系：

- 创建Issue
- 发送邮件
- 加入讨论组

---

*感谢使用PyBlog！让我们一起构建更好的交互式学习平台。*
