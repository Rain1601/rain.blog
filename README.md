# 📝 Rain's Blog - 个人技术博客平台

一个基于 Next.js 15 构建的现代化博客平台，支持 GitHub 仓库同步、交互式 Python 代码执行、MDX 内容渲染等功能。

## ✨ 核心特性

### 内容管理
- 📚 **GitHub 同步**: 自动从 GitHub 仓库 (Rain1601/rain.blog.repo) 同步博客内容
- 📝 **MDX 支持**: 使用 MDX 格式编写博客，支持 React 组件嵌入
- 🏷️ **YAML Front Matter**: 支持文章元数据解析（标题、日期、标签、分类等）
- 🔍 **全文搜索**: 实时搜索文章标题和内容
- 📅 **时间线视图**: 按年份和月份筛选文章

### 用户体验
- 🎨 **统一字体系统**: 英文使用 Times New Roman，中文使用宋体
- 📑 **固定目录导航**: 右侧固定目录，支持 1-3 级标题跳转和高亮
- 🎯 **动态导航栏**: 主页滚动时自动切换导航链接和搜索框
- 🌐 **多语言支持**: 中英文界面切换
- 📱 **响应式设计**: 完美适配桌面和移动设备

### 技术特色
- 🚀 **交互式 Python**: 基于 Pyodide 在浏览器中运行 Python 代码
- ⚡ **性能优化**: 静态生成、代码分割、懒加载
- 🔧 **TypeScript**: 完整的类型定义和开发体验
- 🎯 **错误边界**: 优雅的错误处理和降级

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **样式**: CSS Modules + 自定义主题系统
- **语言**: TypeScript
- **Python 运行时**: Pyodide (WebAssembly)
- **代码编辑器**: Monaco Editor
- **内容格式**: Markdown / MDX
- **数据源**: GitHub API
- **部署**: Vercel / Netlify

## 📦 支持的 Python 包

- **NumPy** - 科学计算
- **Pandas** - 数据分析
- **Matplotlib** - 数据可视化
- **SciPy** - 科学计算工具
- **SymPy** - 符号数学
- **Micropip** - 动态安装其他包

## 🚀 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- npm 或 yarn

### 安装和运行

```bash
# 克隆项目
git clone https://github.com/Rain1601/rain.blog.git
cd rain.blog

# 安装依赖
npm install

# 启动开发服务器 (端口 3001)
npm run dev

# 构建项目
npm run build

# 启动生产服务器
npm start
```

访问 [http://localhost:3001](http://localhost:3001) 查看应用。

## 📁 项目结构

```
rain.blog/
├── src/
│   ├── app/                           # Next.js App Router 页面
│   │   ├── blog/[id]/                # GitHub 博客详情页
│   │   ├── posts/[slug]/             # MDX 文章页面
│   │   ├── about/                    # 关于页面
│   │   ├── layout.tsx                # 根布局
│   │   ├── page.tsx                  # 主页（博客列表）
│   │   ├── page.module.css          # 主页样式
│   │   └── globals.css              # 全局样式
│   ├── components/                   # React 组件
│   │   ├── Layout.tsx                # 导航布局组件
│   │   ├── TableOfContents.tsx       # 文章目录组件
│   │   ├── MarkdownRenderer.tsx      # Markdown 渲染器
│   │   ├── InteractiveCodeBlock.tsx  # 交互式代码块
│   │   ├── CodeEditor.tsx            # Monaco 编辑器
│   │   └── ErrorBoundary.tsx         # 错误边界
│   ├── utils/                        # 工具函数
│   │   ├── github.ts                 # GitHub API 集成
│   │   ├── api.ts                    # API 路由处理
│   │   ├── pyodide.ts                # Pyodide 管理
│   │   └── mdx.ts                    # MDX 处理
│   └── content/blog/                 # 本地博客内容
│       ├── posts/                    # MDX 文章
│       └── config.ts                 # 博客配置
├── public/                           # 静态资源
├── mdx-components.tsx                # MDX 组件映射
├── next.config.ts                    # Next.js 配置
└── CLAUDE.md                         # AI 助手指南
```

## 📝 使用指南

### 写作指南

#### 创建 GitHub 同步文章

文章将自动从 `Rain1601/rain.blog.repo` 仓库同步，支持以下结构：
- `posts/年份/月份/文件名.md`
- 支持 YAML Front Matter 元数据

#### 创建本地 MDX 文章

在 `src/content/blog/posts/` 创建 `.mdx` 文件：

```mdx
---
title: "文章标题"
date: "2024-01-20"
tags: ["Python", "教程"]
categories: ["技术"]
author: "Rain"
summary: "文章摘要"
---

# 文章内容

这里是正文...
```

#### 使用交互式代码块

在 MDX 文件中使用 `InteractiveCodeBlock` 组件：

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

### 开发命令

```bash
# 创建新文章
npm run new-post

# 转换 MD 为 MDX
npm run md-to-mdx <file>

# 批量转换
npm run batch-md-to-mdx

# 代码检查
npm run lint

# 类型检查
npm run type-check
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

## 🔧 配置指南

### GitHub 仓库配置

在 `src/utils/github.ts` 中配置仓库信息：

```typescript
const GITHUB_OWNER = 'Rain1601';
const GITHUB_REPO = 'rain.blog.repo';
```

### 添加新的 Python 包

在 `src/utils/pyodide.ts` 中的 `loadPyodide` 函数中添加包：

```typescript
await pyodide.loadPackage(['numpy', 'pandas', 'matplotlib', 'new-package']);
```

### 自定义样式

项目使用 CSS 变量系统，在 `src/app/globals.css` 中修改：

```css
:root {
  --text-primary: #1a1a1a;
  --accent-primary: #d97149;
  --bg-primary: #faf8f4;
  /* 更多变量... */
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

1. **GitHub API 限制**
   - API 速率限制：60 次/小时（未认证）
   - 解决方案：添加 GitHub Token 或使用缓存

2. **Pyodide 加载失败**
   - 检查网络连接
   - 确保浏览器支持 WebAssembly
   - 清除浏览器缓存

3. **目录导航不工作**
   - 确保标题有正确的 ID
   - 检查 Intersection Observer 兼容性

4. **字体显示异常**
   - 确保系统安装了宋体字体
   - 检查 CSS 字体声明顺序

### 性能优化

1. **Pyodide优化**
   - 使用懒加载
   - 缓存Pyodide实例
   - 按需加载Python包

2. **构建优化**
   - 启用Next.js静态生成
   - 使用代码分割
   - 优化图片和静态资源

## 🌟 特色功能展示

### 动态导航栏
主页滚动时，导航链接自动切换为搜索框，优化屏幕空间利用。

### 智能目录
文章右侧固定目录，自动生成、滚动高亮、点击跳转。

### GitHub 同步
每 5 分钟自动同步 GitHub 仓库内容，保持博客实时更新。

## 📄 许可证

MIT License

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing`)
3. 提交更改 (`git commit -m 'feat: 添加新功能'`)
4. 推送分支 (`git push origin feature/amazing`)
5. 创建 Pull Request

## 📮 联系方式

- GitHub: [@Rain1601](https://github.com/Rain1601)
- 博客仓库: [rain.blog.repo](https://github.com/Rain1601/rain.blog.repo)
- Issues: [提交问题](https://github.com/Rain1601/rain.blog/issues)

---

*Built with ❤️ by Rain | Powered by Next.js & Pyodide*
