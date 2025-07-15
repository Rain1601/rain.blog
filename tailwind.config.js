/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 基础色彩系统
        background: "#ffffff",
        foreground: "#0f172a",
        
        // 主要色彩 - 灰蓝色系
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe', 
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        
        // 中性色 - 温润灰色系
        neutral: {
          50: '#fafafa',
          100: '#f4f6f8',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        
        // 语义化色彩
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        
        // 代码块专用色彩
        code: {
          bg: '#f1f5f9',
          'bg-dark': '#1e293b',
          border: '#e2e8f0',
          'border-dark': '#475569',
          text: '#374151',
          'text-dark': '#f8fafc',
        },
        
        // 交互色彩
        accent: {
          50: '#dbeafe',
          100: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          soft: '#dbeafe',
          'soft-dark': '#1e40af',
        },
      },
      
      // 字体配置
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },
      
      // 字体大小系统
      fontSize: {
        'xs': '0.75rem',      // 12px - 标签、时间
        'sm': '0.875rem',     // 14px - 次要信息
        'base': '1rem',       // 16px - 正文
        'lg': '1.125rem',     // 18px - 小标题
        'xl': '1.25rem',      // 20px - 卡片标题
        '2xl': '1.5rem',      // 24px - 页面标题
        '3xl': '1.875rem',    // 30px - 文章标题
        '4xl': '2.25rem',     // 36px - 主标题
      },
      
      // 间距系统
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // 动画配置
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'scale-up': 'scaleUp 0.2s ease-out forwards',
        'bounce-gentle': 'bounceGentle 0.6s ease-out forwards',
        'loading-dots': 'loadingDots 1.5s infinite',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      // 关键帧定义
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
          '100%': { transform: 'translateY(0)' },
        },
        loadingDots: {
          '0%': { content: '"●○○"' },
          '33%': { content: '"○●○"' },
          '66%': { content: '"○○●"' },
          '100%': { content: '"●○○"' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      
      // 阴影系统
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
        'code': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'button': '0 2px 4px 0 rgba(59, 130, 246, 0.2)',
        'button-hover': '0 4px 12px 0 rgba(59, 130, 246, 0.3)',
        },
      
      // 边框圆角
      borderRadius: {
        'code': '8px',
        'button': '6px',
        'card': '12px',
      },
      
      // Typography增强
      typography: {
        DEFAULT: {
          css: {
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            pre: {
              backgroundColor: "var(--tw-prose-pre-bg)",
              border: "1px solid var(--tw-prose-pre-border)",
            },
            // 优化行高和间距
            lineHeight: '1.7',
            h1: {
              fontWeight: '700',
              fontSize: '1.875rem',
              marginBottom: '1rem',
            },
            h2: {
              fontWeight: '600',
              fontSize: '1.5rem',
              marginBottom: '0.75rem',
            },
            p: {
              marginBottom: '1rem',
            },
          },
        },
      },
      
      // 过渡效果
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      
      // 最大宽度系统
      maxWidth: {
        'prose': '65ch',           // 文章内容 - 约650px，最佳阅读宽度
        'content': '768px',        // 主要内容容器 - 更适中的宽度
        'article': '720px',        // 文章页面 - 专门为长文阅读优化
        'wide': '1024px',          // 宽屏布局 - 仪表板等
        'full': '1280px',          // 全宽布局 - 特殊页面
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
}; 