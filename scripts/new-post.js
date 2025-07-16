#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function createNewPost() {
  console.log('🚀 创建新博客文章\n');
  
  const slug = await ask('文章 slug (URL路径，如: my-new-post): ');
  const title = await ask('文章标题: ');
  const excerpt = await ask('文章摘要: ');
  const tagsInput = await ask('标签 (用逗号分隔): ');
  const category = await ask('分类 (tutorial/ai/web-dev/data/tools/thoughts): ');
  const readTime = await ask('预计阅读时间 (如: 15分钟): ');
  
  const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
  const today = new Date().toISOString().split('T')[0];
  
  // 创建 MDX 文件
  const mdxPath = path.join(__dirname, '../src/content/blog/posts', `${slug}.mdx`);
  const mdxContent = `# ${title}

## 介绍

在这里写文章的介绍...

## 主要内容

### 小节1

内容...

\`\`\`python
# 代码示例
def example():
    print("Hello, World!")
\`\`\`

## 总结

总结文章的主要观点...

## 参考资料

- [参考链接](https://example.com)
`;

  fs.writeFileSync(mdxPath, mdxContent);
  console.log(`✅ 创建 MDX 文件: ${mdxPath}`);
  
  // 更新配置文件
  const configPath = path.join(__dirname, '../src/content/blog/config.ts');
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  const newPostConfig = `  '${slug}': {
    title: '${title}',
    excerpt: '${excerpt}',
    tags: [${tags.map(tag => `'${tag}'`).join(', ')}],
    date: '${today}',
    readTime: '${readTime}',
    category: '${category}',
    published: true,
    author: 'Rain',
  },`;
  
  // 在 blogPosts 对象中添加新文章
  const insertPoint = configContent.indexOf('};', configContent.indexOf('export const blogPosts:'));
  configContent = configContent.slice(0, insertPoint) + newPostConfig + '\n' + configContent.slice(insertPoint);
  
  fs.writeFileSync(configPath, configContent);
  console.log(`✅ 更新配置文件: ${configPath}`);
  
  // 更新 MDX 工具文件
  const mdxUtilPath = path.join(__dirname, '../src/utils/mdx.ts');
  let mdxUtilContent = fs.readFileSync(mdxUtilPath, 'utf8');
  
  // 添加新的 MDX 导入
  const importLine = `  '${slug}': () => import('@/content/blog/posts/${slug}.mdx'),`;
  const importInsertPoint = mdxUtilContent.indexOf('} as const;');
  mdxUtilContent = mdxUtilContent.slice(0, importInsertPoint) + importLine + '\n' + mdxUtilContent.slice(importInsertPoint);
  
  fs.writeFileSync(mdxUtilPath, mdxUtilContent);
  console.log(`✅ 更新 MDX 工具文件: ${mdxUtilPath}`);
  
  console.log(`\n🎉 新文章创建完成！`);
  console.log(`📝 编辑文章: ${mdxPath}`);
  console.log(`🌐 访问地址: http://localhost:3001/posts/${slug}`);
  
  rl.close();
}

createNewPost().catch(console.error); 