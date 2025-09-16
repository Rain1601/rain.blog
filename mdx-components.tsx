import type { MDXComponents } from 'mdx/types';
import React from 'react';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 中文技术文档标题样式
    h1: ({ children }) => {
      const id = typeof children === 'string'
        ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-\u4e00-\u9fa5]/g, '')
        : '';
      return (
        <h1 id={id} style={{
          fontSize: '2.25rem',
          fontWeight: '700',
          marginBottom: '2rem',
          marginTop: '2.5rem',
          color: 'var(--text-primary)',
          lineHeight: '1.3',
          fontFamily: '"Times New Roman", "SimSun", "宋体", serif',
          letterSpacing: '-0.02em',
          scrollMarginTop: '120px'
        }}>
          {children}
        </h1>
      );
    },
    h2: ({ children }) => {
      const id = typeof children === 'string'
        ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-\u4e00-\u9fa5]/g, '')
        : '';
      return (
        <h2 id={id} style={{
          fontSize: '1.875rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          marginTop: '3rem',
          color: 'var(--text-primary)',
          borderLeft: '4px solid var(--accent-primary)',
          paddingLeft: '1rem',
          lineHeight: '1.4',
          fontFamily: '"Times New Roman", "SimSun", "宋体", serif',
          letterSpacing: '-0.01em',
          scrollMarginTop: '120px'
        }}>
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = typeof children === 'string'
        ? children.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-\u4e00-\u9fa5]/g, '')
        : '';
      return (
        <h3 id={id} style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1rem',
          marginTop: '2.5rem',
          color: 'var(--text-primary)',
          lineHeight: '1.4',
          fontFamily: '"Times New Roman", "SimSun", "宋体", serif',
          letterSpacing: '0em',
          scrollMarginTop: '120px'
        }}>
          {children}
        </h3>
      );
    },
    // 中文段落优化 - 更好的行高和字体
    p: ({ children }) => (
      <p style={{
        marginBottom: '1.5rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.8',
        fontSize: '1rem',
        fontWeight: '400',
        fontFamily: '"Times New Roman", "SimSun", "宋体", serif',
        letterSpacing: '0.02em'
      }}>
        {children}
      </p>
    ),
        // 自定义代码块组件 - Material-UI风格
    pre: ({ children }) => (
      <div style={{
        marginBottom: '1.5rem',
        marginTop: '1rem',
        borderRadius: '8px',
        background: '#111827',
        padding: '1rem',
        border: '1px solid #1f2937',
        overflow: 'hidden',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.5)'
      }}>
        <pre style={{
          fontFamily: '"Fira Code", "Monaco", "Cascadia Code", "Roboto Mono", monospace',
          fontSize: '0.875rem',
          lineHeight: '1.4',
          color: '#e2e8f0',
          margin: '0',
          background: 'transparent',
          overflow: 'auto',
          whiteSpace: 'pre-wrap'
        }}>
        {children}
      </pre>
      </div>
    ),
    // 内联代码样式 - 暗色主题
    code: ({ children }) => (
      <code style={{
        background: '#1f2937',
        padding: '0.2rem 0.4rem',
        borderRadius: '4px',
        fontSize: '0.875rem',
        fontFamily: '"Fira Code", monospace',
        color: '#60a5fa',
        fontWeight: '500',
        border: '1px solid #374151'
      }}>
        {children}
      </code>
    ),
    // 自定义列表组件 - 更好的视觉效果
    ul: ({ children }) => (
      <ul style={{
        marginBottom: '1.5rem',
        paddingLeft: '0',
        listStyle: 'none'
      }}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol style={{
        marginBottom: '1.5rem',
        paddingLeft: '1.5rem',
        color: '#4b5563',
        lineHeight: '1.7'
      }}>
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li style={{
        marginBottom: '0.75rem',
        position: 'relative',
        paddingLeft: '1.5rem',
        color: 'var(--text-secondary)',
        lineHeight: '1.8',
        fontFamily: '"Times New Roman", "SimSun", "宋体", serif',
        fontSize: '1rem'
      }}>
        <span style={{
          position: 'absolute',
          left: '0',
          top: '0.6rem',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'var(--accent-primary)'
        }}></span>
        {children}
      </li>
    ),
    // 技术文档链接样式
    a: ({ href, children }) => (
      <a
        href={href}
        className="mdx-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    // 图片样式优化
    img: ({ src, alt, ...props }) => (
      <div style={{
        marginBottom: '2rem',
        marginTop: '1.5rem',
        textAlign: 'center'
      }}>
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            border: '1px solid var(--border-light)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
          {...props}
        />
        {alt && (
          <div style={{
            marginTop: '0.5rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic'
          }}>
            {alt}
          </div>
        )}
      </div>
    ),
    // 技术文档引用块样式
    blockquote: ({ children }) => (
      <blockquote style={{
        marginBottom: '2rem',
        marginTop: '1.5rem',
        padding: '1.25rem 1.5rem',
        background: 'var(--accent-lighter)',
        borderLeft: '4px solid var(--accent-primary)',
        borderRadius: '0 6px 6px 0',
        fontStyle: 'normal',
        color: 'var(--text-secondary)',
        fontSize: '1rem',
        lineHeight: '1.7',
        border: '1px solid var(--accent-light)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '16px',
          width: '16px',
          height: '16px',
          background: 'var(--accent-primary)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold'
        }}>
          i
        </div>
        {children}
      </blockquote>
    ),
    // 技术文档专用表格样式
    table: ({ children }) => (
      <div style={{
        marginBottom: '2.5rem',
        marginTop: '2rem',
        overflow: 'auto',
        maxWidth: '100%'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: '#ffffff',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          border: '2px solid #000000',
          fontFamily: '"Times New Roman", "SimSun", "宋体", serif'
        }}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead style={{
        backgroundColor: 'var(--accent-lighter)'
      }}>
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody>
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr>
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th style={{
        padding: '1rem 1.5rem',
        background: '#f5f5f5',
        color: '#000000',
        fontWeight: '600',
        textAlign: 'left',
        fontSize: '0.95rem',
        border: '1px solid #000000',
        fontFamily: '"Times New Roman", "SimSun", "宋体", serif',
        letterSpacing: '0.02em'
      }}>
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td style={{
        padding: '1rem 1.5rem',
        border: '1px solid #000000',
        color: '#000000',
        fontSize: '0.95rem',
        lineHeight: '1.7',
        verticalAlign: 'top',
        fontFamily: '"Times New Roman", "SimSun", "宋体", serif',
        backgroundColor: '#ffffff'
      }}>
        {children}
      </td>
    ),
    // 添加分割线样式
    hr: () => (
      <hr style={{
        margin: '3rem 0',
        border: 'none',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #667eea, transparent)',
        borderRadius: '1px'
      }} />
    ),
    ...components,
  };
} 