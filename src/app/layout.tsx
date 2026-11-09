import type { Metadata } from 'next';
import './globals.css';
import Layout from '@/components/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';
import { THEME_INIT_SCRIPT } from '@/utils/theme';

export const metadata: Metadata = {
  title: "Rain's Blog",
  description: 'A modern blog platform built with Next.js',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // data-theme 由下面的内联脚本在绘制前设置，和服务端输出不同是预期的
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 在页面绘制前确定白天/黑夜，避免打开时先闪一下浅色 */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        <ErrorBoundary>
          <Layout>
            {children}
          </Layout>
        </ErrorBoundary>
      </body>
    </html>
  );
}