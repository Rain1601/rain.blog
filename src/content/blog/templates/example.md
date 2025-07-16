---
title: "Markdown转MDX示例文章"
description: "这是一个演示如何使用Markdown编写博客文章的示例"
author: "Rain"
date: "2024-01-20"
tags: ["Markdown", "示例", "教程"]
category: "tutorial"
readTime: "5分钟"
---

# Markdown转MDX示例文章

## 介绍

这是一个演示如何使用Markdown格式编写博客文章的示例。该文件可以被自动转换为MDX格式。

## Front Matter支持

文件顶部的YAML格式前置数据会被自动解析：

- `title`: 文章标题
- `description`: 文章描述
- `author`: 作者
- `date`: 发布日期
- `tags`: 标签数组
- `category`: 分类
- `readTime`: 阅读时间

## 基本Markdown语法

### 标题

支持1-6级标题，使用`#`符号。

### 段落和换行

这是一个段落。段落之间用空行分隔。

这是另一个段落。

### 强调

- **粗体文本**
- *斜体文本*
- ~~删除线文本~~

### 列表

#### 无序列表
- 项目1
- 项目2
  - 子项目1
  - 子项目2

#### 有序列表
1. 第一项
2. 第二项
3. 第三项

### 链接和图片

[这是一个链接](https://example.com)

![图片描述](https://via.placeholder.com/300x200)

### 代码

#### 内联代码
使用 `print("Hello, World!")` 来输出文本。

#### 代码块
```python
def hello_world():
    print("Hello, World!")
    return "Hello, World!"

# 调用函数
result = hello_world()
```

#### 交互式代码块
如果要创建可执行的代码块，可以添加特殊注释：

```python <!-- interactive -->
# 这个代码块将被转换为交互式代码块
import numpy as np

arr = np.array([1, 2, 3, 4, 5])
print(f"数组: {arr}")
print(f"平均值: {np.mean(arr)}")
```

### 引用

> 这是一个引用块。
> 可以包含多行内容。
>
> 支持嵌套引用。

### 表格

| 功能 | 状态 | 说明 |
|------|------|------|
| Front Matter解析 | ✅ | 自动解析YAML前置数据 |
| 交互式代码块 | ✅ | 支持特殊注释标记 |
| 图片和链接 | ✅ | 标准Markdown语法 |
| 数学公式 | 🔄 | 计划支持 |

### 分割线

---

## 转换说明

### 自动转换功能

1. **Front Matter解析**: 自动提取文章元数据
2. **交互式代码块**: `<!-- interactive -->` 注释会被转换为React组件
3. **文件名处理**: 自动生成URL友好的slug
4. **配置更新**: 自动更新博客配置文件

### 使用方法

单个文件转换：
```bash
npm run md-to-mdx
```

批量转换：
```bash
npm run batch-md-to-mdx
```

## 注意事项

1. 确保Markdown文件使用UTF-8编码
2. Front Matter必须位于文件顶部
3. 图片路径建议使用绝对URL或相对于public目录的路径
4. 交互式代码块目前只支持Python

## 总结

通过这个Markdown转MDX系统，你可以：

- 📝 使用熟悉的Markdown语法编写文章
- 🔄 自动转换为MDX格式
- ⚡ 支持交互式代码执行
- 🏷️ 自动提取和配置元数据
- 📁 批量处理多个文件

这样既保持了Markdown的简洁性，又获得了MDX的强大功能！ 