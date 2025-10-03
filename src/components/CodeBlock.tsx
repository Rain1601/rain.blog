'use client';

import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './CodeBlock.module.css';

interface CodeBlockProps {
  content: string;
  language?: string;
}

export default function CodeBlock({ content, language }: CodeBlockProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // 检测系统主题
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // 计算代码行数
  const lineCount = content.split('\n').length;

  // 语言映射 - 将常见语言名称映射到 Prism 支持的名称
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'rb': 'ruby',
    'sh': 'bash',
    'yml': 'yaml',
    'md': 'markdown',
    'txt': 'text',
  };

  const normalizedLanguage = language
    ? (languageMap[language.toLowerCase()] || language.toLowerCase())
    : 'text';

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        {language && (
          <span className={styles.codeLanguage}>{language.toUpperCase()}</span>
        )}
        <div className={styles.codeActions}>
          <span className={styles.lineCount}>{lineCount} lines</span>
          <button
            className={styles.collapseButton}
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? '展开代码' : '折叠代码'}
          >
            {isCollapsed ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 15l7-7 7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <SyntaxHighlighter
          language={normalizedLanguage}
          style={isDark ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: isDark ? '#1e1e1e' : '#fafafa',
            fontSize: '0.875rem',
            lineHeight: '1.6',
          }}
          codeTagProps={{
            style: {
              background: 'transparent',
            }
          }}
          showLineNumbers={false}
          wrapLines={false}
          useInlineStyles={true}
        >
          {content}
        </SyntaxHighlighter>
      )}
    </div>
  );
}
