import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 自定义标题组件 - 添加渐变色和更好的间距
    h1: ({ children }) => (
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: '800',
        marginBottom: '2rem',
        marginTop: '2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: '1.2'
      }}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 style={{
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        marginTop: '3rem',
        color: '#1f2937',
        borderLeft: '4px solid #667eea',
        paddingLeft: '1rem',
        lineHeight: '1.3'
      }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1rem',
        marginTop: '2rem',
        color: '#374151',
        lineHeight: '1.4'
      }}>
        {children}
      </h3>
    ),
    // 自定义段落组件 - 更好的行高和间距
    p: ({ children }) => (
      <p style={{
        marginBottom: '1.5rem',
        color: '#4b5563',
        lineHeight: '1.8',
        fontSize: '1.1rem',
        fontWeight: '400'
      }}>
        {children}
      </p>
    ),
    // 自定义代码块组件 - 现代化设计
    pre: ({ children }) => (
      <div style={{
        marginBottom: '2rem',
        marginTop: '1.5rem',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '1.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden'
      }}>
        <pre style={{
          fontFamily: '"Fira Code", "Monaco", "Cascadia Code", "Roboto Mono", monospace',
          fontSize: '0.95rem',
          lineHeight: '1.6',
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
    // 内联代码样式
    code: ({ children }) => (
      <code style={{
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        padding: '0.25rem 0.5rem',
        borderRadius: '6px',
        fontSize: '0.9rem',
        fontFamily: '"Fira Code", monospace',
        color: '#be123c',
        fontWeight: '500',
        border: '1px solid #e2e8f0'
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
        color: '#4b5563',
        lineHeight: '1.7'
      }}>
        <span style={{
          position: 'absolute',
          left: '0',
          top: '0.6rem',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}></span>
        {children}
      </li>
    ),
    // 自定义链接组件 - 悬浮效果
    a: ({ href, children }) => (
      <a 
        href={href} 
        style={{
          color: '#667eea',
          textDecoration: 'none',
          fontWeight: '500',
          borderBottom: '2px solid transparent',
          transition: 'all 0.3s ease',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}
        onMouseEnter={(e) => {
          const target = e.target as HTMLElement;
          target.style.borderBottomColor = '#667eea';
          target.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          const target = e.target as HTMLElement;
          target.style.borderBottomColor = 'transparent';
          target.style.transform = 'translateY(0)';
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    // 自定义引用组件 - 卡片式设计
    blockquote: ({ children }) => (
      <blockquote style={{
        marginBottom: '2rem',
        marginTop: '1.5rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderLeft: '4px solid #667eea',
        borderRadius: '0 12px 12px 0',
        fontStyle: 'italic',
        color: '#475569',
        fontSize: '1.1rem',
        lineHeight: '1.7',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '20px',
          width: '20px',
          height: '20px',
          background: '#667eea',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          "
        </div>
        {children}
      </blockquote>
    ),
    // 添加表格样式
    table: ({ children }) => (
      <div style={{
        marginBottom: '2rem',
        marginTop: '1.5rem',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: 'white'
        }}>
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th style={{
        padding: '1rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontWeight: '600',
        textAlign: 'left',
        fontSize: '0.95rem'
      }}>
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td style={{
        padding: '0.75rem 1rem',
        borderBottom: '1px solid #e5e7eb',
        color: '#4b5563',
        fontSize: '0.95rem'
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