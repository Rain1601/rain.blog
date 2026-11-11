'use client';

import React, { useState } from 'react';
import styles from './MarkdownRenderer.module.css';
import LinkTag from './LinkTag';
import ImageViewer from './ImageViewer';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

interface ParsedElement {
  type: string;
  content: string;
  annotation?: string;
  level?: number;
  language?: string;
  items?: string[];
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [imageViewer, setImageViewer] = useState<{ src: string; alt: string; isOpen: boolean }>({
    src: '',
    alt: '',
    isOpen: false
  });

  // 处理图片点击
  const handleImageClick = (src: string, alt: string) => {
    setImageViewer({ src, alt, isOpen: true });
  };

  // 关闭图片查看器
  const closeImageViewer = () => {
    setImageViewer(prev => ({ ...prev, isOpen: false }));
  };


  // 移除YAML front matter
  const removeFrontMatter = (markdown: string): string => {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    return markdown.replace(frontMatterRegex, '');
  };

  // 解析Markdown内容
  const parseMarkdown = (markdown: string): ParsedElement[] => {
    // 先移除front matter
    const cleanMarkdown = removeFrontMatter(markdown);

    // 处理可能的换行符问题
    let normalizedMarkdown = cleanMarkdown;
    if (!normalizedMarkdown.includes('\n')) {
      // 尝试用其他换行符分割
      if (normalizedMarkdown.includes('\\n')) {
        normalizedMarkdown = normalizedMarkdown.replace(/\\n/g, '\n');
      } else if (normalizedMarkdown.includes('\r\n')) {
        normalizedMarkdown = normalizedMarkdown.replace(/\r\n/g, '\n');
      } else if (normalizedMarkdown.includes('\r')) {
        normalizedMarkdown = normalizedMarkdown.replace(/\r/g, '\n');
      }
    }

    const lines = normalizedMarkdown.split('\n');
    const elements: ParsedElement[] = [];
    let currentCodeBlock: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let currentList: string[] = [];
    let inList = false;
    let currentTable: string[] = [];
    let inTable = false;

    console.log('=== PARSING MARKDOWN ===');
    console.log('Original markdown length:', markdown.length);
    console.log('Clean markdown length:', cleanMarkdown.length);
    console.log('Normalized markdown length:', normalizedMarkdown.length);
    console.log('Total lines:', lines.length);
    if (lines.length <= 5) {
      console.log('Lines content:', lines);
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 代码块处理
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          // 开始代码块
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
          currentCodeBlock = [];
        } else {
          // 结束代码块
          inCodeBlock = false;
          elements.push({
            type: 'code',
            content: currentCodeBlock.join('\n'),
            language: codeLanguage
          });
          currentCodeBlock = [];
          codeLanguage = '';
        }
        continue;
      }

      // 在代码块内
      if (inCodeBlock) {
        currentCodeBlock.push(line);
        continue;
      }

      const comment = line.trim().match(/^<!--\s*rain-comment:\s*(.+?)\s*-->$/);
      if (comment) {
        const previous = elements[elements.length - 1];
        const paragraph = previous?.type === 'break' ? elements[elements.length - 2] : previous;
        if (inTable || inList || paragraph?.type !== 'paragraph') {
          throw new Error('rain-comment 必须紧跟在正文段落后面');
        }
        paragraph.annotation = comment[1];
        continue;
      }

      // 表格处理 - 更宽松的检测
      if (line.includes('|')) {
        const pipeCount = line.split('|').length - 1;
        console.log(`Line ${i}: Contains |, pipe count: ${pipeCount}, line: "${line}"`);

        if (pipeCount >= 2) {
          console.log(`Line ${i}: Detected as table row (${pipeCount} pipes)`);
          if (!inTable) {
            inTable = true;
            console.log('Starting table collection');
          }
          currentTable.push(line);
          continue;
        }
      }

      if (inTable && (line.trim() === '' || !line.includes('|'))) {
        // 表格结束
        console.log(`Line ${i}: Table ends, collected ${currentTable.length} rows`);
        console.log('Table content:', currentTable);
        inTable = false;
        elements.push({
          type: 'table',
          content: currentTable.join('\n')
        });
        currentTable = [];
        if (!line.includes('|')) {
          // 继续处理当前非表格行
        } else {
          continue;
        }
      }

      // 列表处理
      if (line.match(/^[-*+]\s+/)) {
        if (!inList) {
          inList = true;
          currentList = [];
        }
        currentList.push(line.replace(/^[-*+]\s+/, ''));
        continue;
      } else if (inList && line.trim() === '') {
        // 继续列表（空行）
        continue;
      } else if (inList) {
        // 结束列表
        inList = false;
        elements.push({
          type: 'list',
          content: '',
          items: [...currentList]
        });
        currentList = [];
      }

      // 标题处理
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)?.[0].length || 1;
        elements.push({
          type: 'heading',
          content: line.replace(/^#+\s*/, ''),
          level: level
        });
        continue;
      }

      // 引用处理
      if (line.startsWith('>')) {
        elements.push({
          type: 'quote',
          content: line.replace(/^>\s*/, '')
        });
        continue;
      }

      // 分割线
      if (line.match(/^[-_*]{3,}$/)) {
        elements.push({
          type: 'divider',
          content: ''
        });
        continue;
      }

      // 空行
      if (line.trim() === '') {
        if (elements.length > 0 && elements[elements.length - 1].type !== 'break') {
          elements.push({
            type: 'break',
            content: ''
          });
        }
        continue;
      }

      // 普通段落
      const annotated = line.trimEnd().match(/^(.+?)\s+<!--\s*rain-comment:\s*(.+?)\s*-->$/);
      elements.push({
        type: 'paragraph',
        content: annotated ? annotated[1] : line,
        annotation: annotated?.[2]
      });
    }

    // 处理未结束的列表
    if (inList && currentList.length > 0) {
      elements.push({
        type: 'list',
        content: '',
        items: currentList
      });
    }

    // 处理未结束的表格
    if (inTable && currentTable.length > 0) {
      console.log('Finishing unclosed table with', currentTable.length, 'rows');
      elements.push({
        type: 'table',
        content: currentTable.join('\n')
      });
    }

    console.log('=== PARSE COMPLETE ===');
    console.log('Total elements:', elements.length);
    elements.forEach((el, idx) => {
      if (el.type === 'table') {
        console.log(`Element ${idx}: TABLE with content:`, el.content.substring(0, 100));
      }
    });

    return elements;
  };

  // 生成唯一ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // 处理内联样式
  const processInlineStyles = (text: string) => {
    let processed = text;
    const linkPlaceholders: { [key: string]: string } = {};

    // 0. 先处理HTML格式的图片标签，保留原始style属性
    processed = processed.replace(/<img\s+([^>]*?)>/gi, (match, attrs) => {
      // 提取src, alt, style等属性
      const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
      const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
      const styleMatch = attrs.match(/style=["']([^"']+)["']/i);

      if (!srcMatch) return match; // 如果没有src，保持原样

      const src = srcMatch[1];
      const alt = altMatch ? altMatch[1] : '';
      const style = styleMatch ? styleMatch[1] : '';

      // 合并样式：保留原始style，补充必要的默认样式
      let finalStyle = style;
      if (!style.includes('max-width') && !style.includes('width')) {
        finalStyle += '; max-width: 100%; height: auto;';
      } else if (!style.includes('height')) {
        finalStyle += '; height: auto;';
      }

      return `<img src="${src}" alt="${alt}" style="${finalStyle.trim()}" />`;
    });

    // 1. 处理Markdown格式的图片 - 必须在链接之前处理
    processed = processed.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
      // 检查是否是无法访问的图片
      if (src.includes('wostatic.cn') || src.includes('camo.githubusercontent.com')) {
        // 尝试从 GitHub CAMO URL 解码原始链接
        let originalUrl = src;
        if (src.includes('camo.githubusercontent.com')) {
          try {
            const hexPart = src.split('/').pop();
            if (hexPart) {
              originalUrl = Buffer.from(hexPart, 'hex').toString('utf8');
            }
          } catch {
            // 解码失败，使用原URL
          }
        }

        return `<div style="
          border: 2px dashed #ccc;
          padding: 2rem;
          text-align: center;
          margin: 1rem 0;
          background: #f9f9f9;
          border-radius: 8px;
        ">
          <div style="margin-bottom: 1rem; color: #666;">
            🖼️ 图片暂时无法显示
          </div>
          <div style="font-size: 0.9rem; margin-bottom: 1rem; color: #888;">
            ${alt || '图片'}
          </div>
          <a href="${originalUrl}" target="_blank" style="
            color: var(--accent-primary);
            text-decoration: none;
            padding: 0.5rem 1rem;
            border: 1px solid var(--accent-primary);
            border-radius: 4px;
            display: inline-block;
            font-size: 0.9rem;
          ">
            点击查看原图
          </a>
        </div>`;
      }
      return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto;" />`;
    });

    // 2. 处理链接并用占位符替换
    processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, href) => {
      const id = `LINK_PLACEHOLDER_${generateId()}`;
      linkPlaceholders[id] = `<span class="enhanced-link" data-href="${href}">${text}</span>`;
      return id;
    });

    // 3. 处理其他内联样式
    processed = processed
      // 粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 斜体
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 内联代码
      .replace(/`(.*?)`/g, '<code>$1</code>');

    // 4. 还原链接占位符
    Object.keys(linkPlaceholders).forEach(id => {
      processed = processed.replace(id, linkPlaceholders[id]);
    });

    return processed;
  };

  // 渲染代码块
  const renderCodeBlock = (content: string, language?: string, key?: number) => (
    <CodeBlock key={key} content={content} language={language} />
  );

  // 渲染表格
  const renderTable = (content: string, index: number) => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 1) return null;

    console.log('Rendering table with styles:', styles.table);
    console.log('Table content:', content);
    console.log('Table lines:', lines);

    // 智能检测是否有分隔行
    const headerRowIndex = 0;
    let separatorRowIndex = -1;
    let dataStartIndex = 1;

    // 查找分隔行
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].match(/^\|?\s*[-:]+/) || lines[i].includes('---') || lines[i].includes('--')) {
        separatorRowIndex = i;
        dataStartIndex = i + 1;
        break;
      }
    }

    // 如果没有找到分隔行，假设第一行是表头，其余都是数据
    if (separatorRowIndex === -1) {
      dataStartIndex = 1;
    }

    const headers = lines[headerRowIndex].split('|').map(cell => cell.trim()).filter(cell => cell);
    const rows = lines.slice(dataStartIndex).map(line =>
      line.split('|').map(cell => cell.trim()).filter(cell => cell)
    );

    console.log('Headers:', headers);
    console.log('Rows:', rows);

    return (
      <div key={index} className={styles.table}>
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                {headers.map((header, i) => (
                  <th key={i}>
                    {renderHTMLWithEnhancedLinks(processInlineStyles(header))}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>
                      {renderHTMLWithEnhancedLinks(processInlineStyles(cell))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 渲染元素
  const renderElement = (element: ParsedElement, index: number) => {
    switch (element.type) {
      case 'heading':
        const HeadingTag = `h${element.level || 1}` as keyof React.JSX.IntrinsicElements;
        const headingClass = `h${element.level || 1}`;
        
        return (
          <HeadingTag
            key={index}
            className={styles[headingClass]}
            dangerouslySetInnerHTML={{
              __html: processInlineStyles(element.content)
            }}
          />
        );

      case 'paragraph':
        if (element.annotation) {
          return (
            <p key={index} className={styles.paragraph} data-rain-comment={element.annotation}>
              <span className={styles.annotatedText} dangerouslySetInnerHTML={{ __html: processInlineStyles(element.content) }} />
            </p>
          );
        }
        return (
          <p
            key={index}
            className={styles.paragraph}
            dangerouslySetInnerHTML={{
              __html: processInlineStyles(element.content)
            }}
          />
        );

      case 'code':
        return renderCodeBlock(element.content, element.language, index);

      case 'quote':
        return (
          <blockquote
            key={index}
            className={styles.blockquote}
            dangerouslySetInnerHTML={{
              __html: processInlineStyles(element.content)
            }}
          />
        );

      case 'list':
        return (
          <ul key={index} className={styles.list}>
            {element.items?.map((item, itemIndex) => (
              <li
                key={itemIndex}
                dangerouslySetInnerHTML={{
                  __html: processInlineStyles(item)
                }}
              />
            ))}
          </ul>
        );

      case 'divider':
        return <hr key={index} className={styles.divider} />;

      case 'break':
        return <div key={index} className={styles.break} />;

      case 'table':
        return renderTable(element.content, index);

      default:
        return null;
    }
  };

  // 后处理HTML，将增强链接转换为LinkTag组件
  const postProcessHTML = (htmlString: string) => {
    let processed = htmlString;

    console.log('===== POST PROCESS HTML START =====');
    console.log('HTML length:', htmlString.length);
    console.log('HTML preview (first 500 chars):', htmlString.substring(0, 500));
    console.log('Contains <code class=:', htmlString.includes('<code class='));
    console.log('Contains <pre>:', htmlString.includes('<pre>'));

    // 1. 处理增强链接
    processed = processed.replace(
      /<span class="enhanced-link" data-href="([^"]+)">([^<]+)<\/span>/g,
      (match, href, text) => {
        return `<enhanced-link href="${href}">${text}</enhanced-link>`;
      }
    );

    // 2. 处理HTML代码块 <pre><code class="language-xxx">...</code></pre>
    const preCodeMatches = processed.match(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g);
    if (preCodeMatches) {
      console.log('Found <pre><code> blocks:', preCodeMatches.length);
    }

    processed = processed.replace(
      /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
      (match, lang, code) => {
        console.log('Converting <pre><code> block with language:', lang);
        return `<code-block language="${lang}">${code}</code-block>`;
      }
    );

    // 3. 处理单独的<code class="language-xxx">...</code>（不在<pre>中）
    const codeMatches = processed.match(/<code class="language-(\w+)">([\s\S]*?)<\/code>/g);
    if (codeMatches) {
      console.log('Found standalone <code> blocks:', codeMatches.length);
    }

    processed = processed.replace(
      /<code class="language-(\w+)">([\s\S]*?)<\/code>/g,
      (match, lang, code) => {
        console.log('Converting standalone <code> block with language:', lang);
        return `<code-block language="${lang}">${code}</code-block>`;
      }
    );

    return processed;
  };

  // 将HTML字符串转换为React元素，处理增强链接和代码块
  const renderHTMLWithEnhancedLinks = (html: string) => {
    const processedHTML = postProcessHTML(html);

    // 分割HTML并处理增强链接和代码块
    const parts = processedHTML.split(/(<enhanced-link href="[^"]+">.*?<\/enhanced-link>|<code-block language="[^"]+">[\s\S]*?<\/code-block>)/g);

    return parts.map((part, index) => {
      // 处理增强链接
      const linkMatch = part.match(/<enhanced-link href="([^"]+)">([^<]+)<\/enhanced-link>/);
      if (linkMatch) {
        const [, href, text] = linkMatch;
        return (
          <LinkTag key={`enhanced-link-${index}`} href={href}>
            {text}
          </LinkTag>
        );
      }

      // 处理代码块
      const codeMatch = part.match(/<code-block language="([^"]+)">([\s\S]*?)<\/code-block>/);
      if (codeMatch) {
        const [, language, code] = codeMatch;
        // 解码HTML实体
        const decodedCode = code
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");

        return (
          <CodeBlock
            key={`code-${index}`}
            content={decodedCode.trim()}
            language={language}
          />
        );
      }

      // 对于普通HTML，使用dangerouslySetInnerHTML
      if (part.trim()) {
        return <span key={`html-${index}`} dangerouslySetInnerHTML={{ __html: part }} />;
      }

      return null;
    }).filter(Boolean);
  };


  // 检查是否是HTML内容 - 更准确的检测
  const hasHTMLTags = content.includes('<') && content.includes('>');
  const hasTableTag = content.includes('<table');
  const hasParagraphTag = /<(?:p|h1)(?:\s|>)/i.test(content);
  const isHTML = hasHTMLTags && (hasTableTag || hasParagraphTag);

  if (isHTML) {

    // 移除frontmatter (--- ... ---)
    let processedHTML = content;
    const frontMatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
    processedHTML = processedHTML.replace(frontMatterRegex, '');

    processedHTML = processedHTML.replace(
      /(<p\b[^>]*\bdata-rain-comment\b[^>]*>)([\s\S]*?)(<\/p>)/gi,
      (_, open, text, close) => `${open}<span class="${styles.annotatedText}">${text}</span>${close}`
    );

    // 包装表格以应用样式
    processedHTML = processedHTML.replace(
      /<table([^>]*)>/g,
      (match, attrs) => {
        return `<div class="${styles.table}" style="
          margin: 2rem 0;
          border-radius: 0;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(217, 113, 73, 0.3);
          background: #292524;
        ">
          <div class="${styles.tableWrapper}" style="overflow-x: auto;">
            <table${attrs} style="
              width: 100%;
              border-collapse: collapse;
              background: #292524;
              font-family: 'Times New Roman', 'SimSun', '宋体', serif;
            ">`;
      }
    );

    processedHTML = processedHTML.replace(
      /<\/table>/g,
      '</table></div></div>'
    );

    // 为表头添加样式
    processedHTML = processedHTML.replace(
      /<th([^>]*)>/g,
      '<th$1 style="' +
        'background: #3A3635;' +
        'color: #E7E5E4;' +
        'font-weight: 600;' +
        'padding: 14px 16px;' +
        'text-align: left;' +
        'border-right: 1px solid rgba(217, 113, 73, 0.2);' +
        'font-size: 0.95rem;' +
        'letter-spacing: 0.02em;' +
      '">'
    );

    // 为表格单元格添加样式，强制透明背景
    processedHTML = processedHTML.replace(
      /<td([^>]*)>/g,
      (match, attrs) => {
        return '<td' + attrs + ' style="' +
          'padding: 13px 16px;' +
          'border-bottom: 1px solid rgba(217, 113, 73, 0.3);' +
          'border-right: 1px solid rgba(217, 113, 73, 0.3);' +
          'color: #E7E5E4;' +
          'font-size: 0.95rem;' +
          'line-height: 1.6;' +
          'background: transparent !important;' +
          'background-color: transparent !important;' +
          'transition: background 0.2s ease;' +
        '">';
      }
    );

    // 清理表格单元格内的特殊样式标记
    processedHTML = processedHTML.replace(
      /<td([^>]*)>([\s\S]*?)<\/td>/g,
      (match, attrs, content) => {
        // 移除或规范化特殊的样式标记
        let cleanContent = content;

        // 处理可能的特殊格式（如加粗的星号标记）
        cleanContent = cleanContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // 移除零宽空格和特殊Unicode字符
        cleanContent = cleanContent.replace(/[\u200B\u200C\u200D\uFEFF]/g, '');

        // 清理多余的空白
        cleanContent = cleanContent.trim();

        return `<td${attrs}>${cleanContent}</td>`;
      }
    );

    // 处理tbody中的tr标签，移除所有斑马纹
    processedHTML = processedHTML.replace(
      /<tbody[^>]*>([\s\S]*?)<\/tbody>/g,
      (match) => {
        // 替换tbody内所有的tr标签
        return match.replace(/<tr[^>]*>/g, `<tr style="
          background: transparent !important;
          transition: background 0.2s ease;
        " onmouseover="this.style.background='rgba(255, 255, 255, 0.05)'" onmouseout="this.style.background='transparent'">`);
      }
    );

    // 处理thead中的tr标签（如果有）
    processedHTML = processedHTML.replace(
      /<thead[^>]*>([\s\S]*?)<\/thead>/g,
      (match) => {
        return match.replace(/<tr[^>]*>/g, '<tr style="background: transparent;">');
      }
    );

    // 最终处理：确保所有表格行都没有背景色
    processedHTML = processedHTML.replace(
      /<table[^>]*>([\s\S]*?)<\/table>/g,
      (tableMatch) => {
        // 处理每一行，确保背景透明
        let processedTable = tableMatch;

        // 替换所有tr标签，确保背景透明
        processedTable = processedTable.replace(/<tr[^>]*>/g, () => {
          // 无论是奇数行还是偶数行，都设置为透明
          return `<tr style="background: transparent !important; background-color: transparent !important;">`;
        });

        return processedTable;
      }
    );

    // 添加内联样式来强制覆盖所有表格行的背景和规范文本样式
    const styleOverride = `
      <style>
        .${styles.markdown} table tbody tr,
        .${styles.markdown} table tbody tr:nth-child(even),
        .${styles.markdown} table tbody tr:nth-child(odd),
        .${styles.markdown} table tr {
          background: transparent !important;
          background-color: transparent !important;
        }
        .${styles.markdown} table tbody tr:hover {
          background: rgba(255, 255, 255, 0.05) !important;
        }
        .${styles.markdown} table td {
          background: transparent !important;
          background-color: transparent !important;
        }
        /* 规范化表格中的特殊样式文本 */
        .${styles.markdown} table td strong {
          color: #D97149;
          font-weight: 600;
          background: transparent;
          padding: 0;
          border-radius: 0;
        }
        .${styles.markdown} table td code {
          background: rgba(217, 113, 73, 0.1);
          color: #E7E5E4;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.9em;
        }
      </style>
    `;

    // 如果是HTML，使用增强渲染处理链接和代码块
    const finalHTML = styleOverride + processedHTML;

    return (
      <>
        <div
          className={styles.markdown}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'IMG') {
              const img = target as HTMLImageElement;
              e.preventDefault();
              handleImageClick(img.src, img.alt || '');
            }
          }}
        >
          {renderHTMLWithEnhancedLinks(finalHTML)}
        </div>
        <ImageViewer
          src={imageViewer.src}
          alt={imageViewer.alt}
          isOpen={imageViewer.isOpen}
          onClose={closeImageViewer}
        />
      </>
    );
  }

  const elements = parseMarkdown(content);

  return (
    <>
      <div
        className={styles.markdown}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.tagName === 'IMG') {
            const img = target as HTMLImageElement;
            e.preventDefault();
            handleImageClick(img.src, img.alt || '');
          }
        }}
      >
        {elements.map((element, index) => {
          // 对于包含HTML内容的元素，使用增强处理
          if (element.type === 'paragraph' || element.type === 'heading') {
            const processedContent = processInlineStyles(element.content);

            // 如果包含增强链接，使用特殊处理
            if (processedContent.includes('enhanced-link')) {
              const TagName = element.type === 'heading' ?
                `h${element.level || 1}` as keyof React.JSX.IntrinsicElements : 'p';
              const className = element.type === 'heading' ?
                styles[`h${element.level || 1}`] : styles.paragraph;

              return (
                <TagName key={index} className={className} data-rain-comment={element.annotation}>
                  {element.annotation ? (
                    <span className={styles.annotatedText}>{renderHTMLWithEnhancedLinks(processedContent)}</span>
                  ) : renderHTMLWithEnhancedLinks(processedContent)}
                </TagName>
              );
            }
          }

          // 对于表格单元格内容的特殊处理 - 已在renderElement中处理

          // 使用原有的渲染逻辑
          return renderElement(element, index);
        })}
      </div>
      <ImageViewer
        src={imageViewer.src}
        alt={imageViewer.alt}
        isOpen={imageViewer.isOpen}
        onClose={closeImageViewer}
      />
    </>
  );
};

export default MarkdownRenderer;
