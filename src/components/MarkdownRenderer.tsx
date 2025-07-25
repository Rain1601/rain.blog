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
  
  // 解析Markdown内容
  const parseMarkdown = (markdown: string): ParsedElement[] => {
    const lines = markdown.split('\n');
    const elements: ParsedElement[] = [];
    let currentCodeBlock: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let currentList: string[] = [];
    let inList = false;

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

    return elements;
  };

  // 处理内联样式
  const processInlineStyles = (text: string) => {
    return text
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

  // 渲染元素
  const renderElement = (element: ParsedElement, index: number) => {
    switch (element.type) {
      case 'heading':
        const HeadingTag = `h${element.level || 1}` as keyof JSX.IntrinsicElements;
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