'use client';

import React from 'react';
import styles from './MarkdownRenderer.module.css';

interface MarkdownRendererProps {
  content: string;
}

interface ParsedElement {
  type: string;
  content: string;
  level?: number;
  language?: string;
  items?: string[];
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {

  // 移除YAML front matter
  const removeFrontMatter = (markdown: string): string => {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    return markdown.replace(frontMatterRegex, '');
  };

  // 解析Markdown内容
  const parseMarkdown = (markdown: string): ParsedElement[] => {
    // 先移除front matter
    const cleanMarkdown = removeFrontMatter(markdown);
    const lines = cleanMarkdown.split('\n');
    const elements: ParsedElement[] = [];
    let currentCodeBlock: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let currentList: string[] = [];
    let inList = false;
    let currentTable: string[] = [];
    let inTable = false;

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

      // 表格处理
      if (line.includes('|')) {
        // 检查是否是表格分隔行
        if (line.match(/^\|?\s*[-:]+\s*\|/)) {
          // 这是表格分隔行，继续收集表格
          if (!inTable) {
            inTable = true;
          }
          currentTable.push(line);
          continue;
        } else if (line.match(/^\|/)) {
          // 这是表格行
          if (!inTable) {
            inTable = true;
          }
          currentTable.push(line);
          continue;
        }
      } else if (inTable && line.trim() === '') {
        // 表格结束
        inTable = false;
        elements.push({
          type: 'table',
          content: currentTable.join('\n')
        });
        currentTable = [];
        continue;
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
      elements.push({
        type: 'paragraph',
        content: line
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
      elements.push({
        type: 'table',
        content: currentTable.join('\n')
      });
    }

    return elements;
  };

  // 处理内联样式
  const processInlineStyles = (text: string) => {
    return text
      // 图片 - 必须在链接之前处理，检查是否需要特殊处理
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
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
      })
      // 粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 斜体
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 内联代码
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  };

  // 渲染代码块
  const renderCodeBlock = (content: string, language?: string) => (
    <div className={styles.codeBlock}>
      {language && (
        <div className={styles.codeHeader}>
          <span className={styles.codeLanguage}>{language.toUpperCase()}</span>
        </div>
      )}
      <pre className={styles.codeContent}>
        <code>{content}</code>
      </pre>
    </div>
  );

  // 渲染表格
  const renderTable = (content: string, index: number) => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) return null;

    const headers = lines[0].split('|').map(cell => cell.trim()).filter(cell => cell);
    // Skip separator line (lines[1])
    const rows = lines.slice(2).map(line =>
      line.split('|').map(cell => cell.trim()).filter(cell => cell)
    );

    return (
      <div key={index} style={{ marginBottom: '2rem', overflow: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '2px solid #000000',
          fontFamily: '"Times New Roman", "SimSun", "宋体", serif'
        }}>
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i} style={{
                  padding: '1rem 1.5rem',
                  background: '#f5f5f5',
                  color: '#000000',
                  fontWeight: '600',
                  textAlign: 'left',
                  border: '1px solid #000000'
                }}>
                  <span dangerouslySetInnerHTML={{ __html: processInlineStyles(header) }} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    padding: '1rem 1.5rem',
                    border: '1px solid #000000',
                    color: '#000000',
                    backgroundColor: '#ffffff'
                  }}>
                    <span dangerouslySetInnerHTML={{ __html: processInlineStyles(cell) }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
        return (
          <div key={index}>
            {renderCodeBlock(element.content, element.language)}
          </div>
        );

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

  const elements = parseMarkdown(content);

  return (
    <div className={styles.markdown}>
      {elements.map((element, index) => renderElement(element, index))}
    </div>
  );
};

export default MarkdownRenderer;