import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PyBlog - 支持Python交互代码的博客平台",
  description: "基于Pyodide和Next.js构建的现代博客平台，支持在浏览器中运行Python代码",
  keywords: ["Python", "Blog", "Pyodide", "Next.js", "Code", "Interactive"],
  authors: [{ name: "PyBlog Team" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <ErrorBoundary>
          <ThemeProvider defaultTheme="system" storageKey="pyblog-theme">
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
