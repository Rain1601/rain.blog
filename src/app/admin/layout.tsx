import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "后台 · Rain's Blog",
  robots: { index: false, follow: false },
};

// 后台页面都依赖登录 cookie 和最新内容，不做静态生成
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
