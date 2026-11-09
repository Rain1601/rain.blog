import type { Metadata } from 'next';
import './globals.css';
import Layout from '@/components/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';

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
    <html lang="zh-CN">
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