# 博客内容管理

这个目录用于管理博客内容，支持动态配置标签、分类和文章元数据。

## 目录结构

```
src/content/blog/
├── config.ts          # 博客配置文件
├── README.md          # 说明文档
├── posts/             # 博客文章目录
│   ├── python-basics.mdx
│   ├── openai-integration.mdx
│   └── data-analysis.mdx
└── templates/         # 文章模板
    └── post-template.mdx
```

## 配置说明

### 1. 标签配置 (tagConfig)

在 `config.ts` 中可以配置标签的颜色和描述：

```typescript
'Python': { color: '#3776ab', description: 'Python编程语言' }
```

### 2. 分类配置 (categoryConfig)

配置文章分类：

```typescript
'tutorial': { name: '教程', description: '技术教程和指南', icon: '📚' }
```

### 3. 文章配置 (blogPosts)

每篇文章的元数据配置：

```typescript
'article-slug': {
  title: '文章标题',
  excerpt: '文章摘要',
  tags: ['标签1', '标签2'],
  date: '2024-01-15',
  readTime: '15分钟',
  category: 'tutorial',
  published: true,
  author: 'Rain',
}
```

## 添加新文章

### 方法1: 直接创建MDX文件
1. 在 `posts/` 目录下创建 `.mdx` 文件
2. 在 `config.ts` 的 `blogPosts` 中添加文章配置
3. 确保 `published: true` 以发布文章

### 方法2: 使用脚本创建
```bash
npm run new-post
```

### 方法3: 从Markdown转换
```bash
# 单个文件转换
npm run md-to-mdx

# 批量转换
npm run batch-md-to-mdx
```

## 标签管理

- 所有可用标签在 `tagConfig` 中定义
- 支持自定义颜色和描述
- 标签会自动按字母顺序排列

## 分类管理

- 文章按分类组织
- 每个分类有名称、描述和图标
- 支持按分类筛选文章

## 功能特性

- ✅ 动态标签配置
- ✅ 文章分类管理
- ✅ 发布状态控制
- ✅ 文章搜索
- ✅ 按日期排序
- ✅ 按分类筛选
- ✅ 标签颜色自定义
- ✅ Markdown转MDX支持
- ✅ Front Matter解析
- ✅ 批量文件处理
- ✅ 交互式代码块转换

## Markdown转换功能

### 支持的格式

1. **标准Markdown语法**: 标题、段落、列表、链接、图片、代码块等
2. **Front Matter**: YAML格式的文章元数据
3. **交互式代码块**: 使用 `<!-- interactive -->` 注释标记

### 示例Front Matter

```yaml
---
title: "文章标题"
description: "文章描述"
author: "作者"
date: "2024-01-20"
tags: ["标签1", "标签2"]
category: "tutorial"
readTime: "10分钟"
---
```

### 交互式代码块

```python <!-- interactive -->
import numpy as np
print("这会被转换为可执行的代码块")
```

### 使用命令

```bash
# 转换单个Markdown文件
npm run md-to-mdx

# 批量转换文件夹中的所有Markdown文件
npm run batch-md-to-mdx

# 创建新的MDX文章
npm run new-post
``` 