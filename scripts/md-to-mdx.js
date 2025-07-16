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

// 解析Markdown文件的前置数据（Front Matter）
function parseFrontMatter(content) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (match) {
    const frontMatter = match[1];
    const body = match[2];
    
    // 简单解析YAML格式的前置数据
    const metadata = {};
    frontMatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        let value = valueParts.join(':').trim();
        
        // 处理不同的数据类型
        if (value.startsWith('[') && value.endsWith(']')) {
          // 数组格式 [tag1, tag2]
          value = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''));
        } else if (value.startsWith('"') && value.endsWith('"')) {
          // 字符串格式 "value"
          value = value.slice(1, -1);
        } else if (value === 'true' || value === 'false') {
          // 布尔值
          value = value === 'true';
        }
        
        metadata[key.trim()] = value;
      }
    });
    
    return { metadata, body };
  }
  
  return { metadata: {}, body: content };
}

// 转换Markdown为MDX
function convertMarkdownToMDX(markdownContent) {
  let mdxContent = markdownContent;
  
  // 转换交互式代码块（如果有特殊标记的话）
  mdxContent = mdxContent.replace(
    /```(\w+)\s*<!--\s*interactive\s*-->([\s\S]*?)```/g,
    (match, language, code) => {
      return `<InteractiveCodeBlock
  code={\`${code.trim()}\`}
/>`;
    }
  );
  
  // 添加必要的导入（如果使用了交互式代码块）
  if (mdxContent.includes('<InteractiveCodeBlock')) {
    mdxContent = `import { InteractiveCodeBlock } from '@/components/InteractiveCodeBlock';\n\n${mdxContent}`;
  }
  
  return mdxContent;
}

async function convertMdToMdx() {
  console.log('📄 Markdown 转 MDX 工具\n');
  
  const inputPath = await ask('输入 Markdown 文件路径: ');
  
  if (!fs.existsSync(inputPath)) {
    console.error('❌ 文件不存在!');
    rl.close();
    return;
  }
  
  if (!inputPath.endsWith('.md') && !inputPath.endsWith('.markdown')) {
    console.error('❌ 请提供 .md 或 .markdown 文件!');
    rl.close();
    return;
  }
  
  const markdownContent = fs.readFileSync(inputPath, 'utf8');
  const { metadata, body } = parseFrontMatter(markdownContent);
  
  console.log('📋 检测到的元数据:');
  console.log(JSON.stringify(metadata, null, 2));
  
  // 获取文章信息
  const slug = await ask('\n文章 slug (URL路径): ') || path.basename(inputPath, path.extname(inputPath));
  const title = await ask('文章标题: ') || metadata.title || '未命名文章';
  const excerpt = await ask('文章摘要: ') || metadata.description || metadata.excerpt || '';
  const tagsInput = await ask('标签 (用逗号分隔): ') || (Array.isArray(metadata.tags) ? metadata.tags.join(', ') : '');
  const category = await ask('分类 (tutorial/ai/web-dev/data/tools/thoughts): ') || metadata.category || 'tutorial';
  const readTime = await ask('预计阅读时间: ') || metadata.readTime || '10分钟';
  
  const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
  const today = metadata.date || new Date().toISOString().split('T')[0];
  
  // 转换Markdown内容为MDX
  const mdxContent = convertMarkdownToMDX(body);
  
  // 创建MDX文件
  const outputPath = path.join(__dirname, '../src/content/blog/posts', `${slug}.mdx`);
  fs.writeFileSync(outputPath, mdxContent);
  console.log(`✅ 创建 MDX 文件: ${outputPath}`);
  
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
    author: '${metadata.author || 'Rain'}',
  },`;
  
  // 检查是否已存在
  if (configContent.includes(`'${slug}':`)) {
    const shouldOverwrite = await ask(`⚠️  文章 '${slug}' 已存在，是否覆盖? (y/n): `);
    if (shouldOverwrite.toLowerCase() !== 'y') {
      console.log('❌ 取消操作');
      rl.close();
      return;
    }
    
    // 替换现有配置
    const regex = new RegExp(`\\s*'${slug}':\\s*{[^}]*},?\\n?`, 'g');
    configContent = configContent.replace(regex, '');
  }
  
  // 添加新配置
  const insertPoint = configContent.indexOf('};', configContent.indexOf('export const blogPosts:'));
  configContent = configContent.slice(0, insertPoint) + newPostConfig + '\n' + configContent.slice(insertPoint);
  
  fs.writeFileSync(configPath, configContent);
  console.log(`✅ 更新配置文件`);
  
  // 更新MDX工具文件
  const mdxUtilPath = path.join(__dirname, '../src/utils/mdx.ts');
  let mdxUtilContent = fs.readFileSync(mdxUtilPath, 'utf8');
  
  if (!mdxUtilContent.includes(`'${slug}':`)) {
    const importLine = `  '${slug}': () => import('@/content/blog/posts/${slug}.mdx'),`;
    const importInsertPoint = mdxUtilContent.indexOf('} as const;');
    mdxUtilContent = mdxUtilContent.slice(0, importInsertPoint) + importLine + '\n' + mdxUtilContent.slice(importInsertPoint);
    
    fs.writeFileSync(mdxUtilPath, mdxUtilContent);
    console.log(`✅ 更新 MDX 工具文件`);
  }
  
  console.log(`\n🎉 转换完成！`);
  console.log(`📝 MDX 文件: ${outputPath}`);
  console.log(`🌐 访问地址: http://localhost:3001/posts/${slug}`);
  
  // 询问是否删除原始Markdown文件
  const shouldDelete = await ask('\n🗑️  是否删除原始 Markdown 文件? (y/n): ');
  if (shouldDelete.toLowerCase() === 'y') {
    fs.unlinkSync(inputPath);
    console.log('✅ 已删除原始文件');
  }
  
  rl.close();
}

convertMdToMdx().catch(console.error); 