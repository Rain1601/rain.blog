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
  title: "Rain.Blog - 个人技术博客",
  description: "分享技术见解与编程经验的个人博客，探索Python、AI和Web开发的精彩世界",
  keywords: ["Python", "Blog", "AI", "Web开发", "编程", "技术分享", "个人博客"],
  authors: [{ name: "Rain" }],
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
