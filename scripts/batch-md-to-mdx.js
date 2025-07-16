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

// 解析Front Matter
function parseFrontMatter(content) {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (match) {
    const frontMatter = match[1];
    const body = match[2];
    
    const metadata = {};
    frontMatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        let value = valueParts.join(':').trim();
        
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''));
        } else if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value === 'true' || value === 'false') {
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
  
  // 转换交互式代码块
  mdxContent = mdxContent.replace(
    /```(\w+)\s*<!--\s*interactive\s*-->([\s\S]*?)```/g,
    (match, language, code) => {
      return `<InteractiveCodeBlock
  code={\`${code.trim()}\`}
/>`;
    }
  );
  
  if (mdxContent.includes('<InteractiveCodeBlock')) {
    mdxContent = `import { InteractiveCodeBlock } from '@/components/InteractiveCodeBlock';\n\n${mdxContent}`;
  }
  
  return mdxContent;
}

// 递归获取所有Markdown文件
function getAllMarkdownFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.md') || item.endsWith('.markdown')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

async function batchConvert() {
  console.log('📁 批量 Markdown 转 MDX 工具\n');
  
  const inputPath = await ask('输入 Markdown 文件或文件夹路径: ');
  
  if (!fs.existsSync(inputPath)) {
    console.error('❌ 路径不存在!');
    rl.close();
    return;
  }
  
  let markdownFiles = [];
  const stat = fs.statSync(inputPath);
  
  if (stat.isDirectory()) {
    markdownFiles = getAllMarkdownFiles(inputPath);
    console.log(`📋 找到 ${markdownFiles.length} 个 Markdown 文件`);
  } else if (inputPath.endsWith('.md') || inputPath.endsWith('.markdown')) {
    markdownFiles = [inputPath];
  } else {
    console.error('❌ 请提供 Markdown 文件或包含 Markdown 文件的文件夹!');
    rl.close();
    return;
  }
  
  if (markdownFiles.length === 0) {
    console.log('⚠️ 没有找到 Markdown 文件');
    rl.close();
    return;
  }
  
  console.log('\n📋 将要转换的文件:');
  markdownFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });
  
  const shouldContinue = await ask('\n是否继续转换? (y/n): ');
  if (shouldContinue.toLowerCase() !== 'y') {
    rl.close();
    return;
  }
  
  const defaultCategory = await ask('默认分类 (tutorial/ai/web-dev/data/tools/thoughts): ') || 'tutorial';
  const defaultAuthor = await ask('默认作者: ') || 'Rain';
  
  const results = {
    success: [],
    failed: [],
    skipped: []
  };
  
  for (const filePath of markdownFiles) {
    try {
      console.log(`\n🔄 处理: ${path.basename(filePath)}`);
      
      const markdownContent = fs.readFileSync(filePath, 'utf8');
      const { metadata, body } = parseFrontMatter(markdownContent);
      
      // 生成slug（从文件名）
      const slug = path.basename(filePath, path.extname(filePath))
        .toLowerCase()
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      // 检查是否已存在
      const configPath = path.join(__dirname, '../src/content/blog/config.ts');
      const configContent = fs.readFileSync(configPath, 'utf8');
      
      if (configContent.includes(`'${slug}':`)) {
        console.log(`⚠️ 文章 '${slug}' 已存在，跳过`);
        results.skipped.push(filePath);
        continue;
      }
      
      const title = metadata.title || path.basename(filePath, path.extname(filePath));
      const excerpt = metadata.description || metadata.excerpt || `从 ${path.basename(filePath)} 转换的文章`;
      const tags = Array.isArray(metadata.tags) ? metadata.tags : ['Markdown'];
      const category = metadata.category || defaultCategory;
      const readTime = metadata.readTime || '10分钟';
      const date = metadata.date || new Date().toISOString().split('T')[0];
      const author = metadata.author || defaultAuthor;
      
      // 转换内容
      const mdxContent = convertMarkdownToMDX(body);
      
      // 创建MDX文件
      const outputPath = path.join(__dirname, '../src/content/blog/posts', `${slug}.mdx`);
      fs.writeFileSync(outputPath, mdxContent);
      
      // 更新配置文件
      let newConfigContent = fs.readFileSync(configPath, 'utf8');
      
      const newPostConfig = `  '${slug}': {
    title: '${title}',
    excerpt: '${excerpt}',
    tags: [${tags.map(tag => `'${tag}'`).join(', ')}],
    date: '${date}',
    readTime: '${readTime}',
    category: '${category}',
    published: true,
    author: '${author}',
  },`;
      
      const insertPoint = newConfigContent.indexOf('};', newConfigContent.indexOf('export const blogPosts:'));
      newConfigContent = newConfigContent.slice(0, insertPoint) + newPostConfig + '\n' + newConfigContent.slice(insertPoint);
      fs.writeFileSync(configPath, newConfigContent);
      
      // 更新MDX工具文件
      const mdxUtilPath = path.join(__dirname, '../src/utils/mdx.ts');
      let mdxUtilContent = fs.readFileSync(mdxUtilPath, 'utf8');
      
      const importLine = `  '${slug}': () => import('@/content/blog/posts/${slug}.mdx'),`;
      const importInsertPoint = mdxUtilContent.indexOf('} as const;');
      mdxUtilContent = mdxUtilContent.slice(0, importInsertPoint) + importLine + '\n' + mdxUtilContent.slice(importInsertPoint);
      fs.writeFileSync(mdxUtilPath, mdxUtilContent);
      
      console.log(`✅ 成功转换: ${slug}`);
      results.success.push({ filePath, slug });
      
    } catch (error) {
      console.error(`❌ 转换失败 ${filePath}:`, error.message);
      results.failed.push({ filePath, error: error.message });
    }
  }
  
  // 显示结果统计
  console.log('\n📊 转换结果统计:');
  console.log(`✅ 成功: ${results.success.length}`);
  console.log(`❌ 失败: ${results.failed.length}`);
  console.log(`⚠️ 跳过: ${results.skipped.length}`);
  
  if (results.success.length > 0) {
    console.log('\n🎉 成功转换的文章:');
    results.success.forEach(({ slug }) => {
      console.log(`- http://localhost:3001/posts/${slug}`);
    });
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ 转换失败的文件:');
    results.failed.forEach(({ filePath, error }) => {
      console.log(`- ${filePath}: ${error}`);
    });
  }
  
  // 询问是否删除原始文件
  if (results.success.length > 0) {
    const shouldDelete = await ask('\n🗑️ 是否删除成功转换的原始 Markdown 文件? (y/n): ');
    if (shouldDelete.toLowerCase() === 'y') {
      results.success.forEach(({ filePath }) => {
        fs.unlinkSync(filePath);
        console.log(`🗑️ 删除: ${filePath}`);
      });
    }
  }
  
  rl.close();
}

batchConvert().catch(console.error); 