import React from 'react';
import { notFound } from 'next/navigation';
import { getPostMetadata } from '@/utils/posts';
import { Layout } from '@/components/Layout';

// 错误组件
const ErrorComponent = ({ slug }: { slug: string }) => (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
    <div className="flex items-center space-x-2 mb-4">
      <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
        文章加载失败
      </h3>
    </div>
    <p className="text-red-700 dark:text-red-300 mb-4">
      无法加载文章内容 "{slug}.mdx"。这可能是由于以下原因：
    </p>
    <ul className="text-red-600 dark:text-red-400 text-sm space-y-1 list-disc list-inside">
      <li>文章文件不存在或已被移动</li>
      <li>文件路径配置错误</li>
      <li>MDX文件格式有误</li>
    </ul>
  </div>
);

// 动态导入MDX文件
const importMDX = async (slug: string) => {
  try {
    const mdxModule = await import(`../${slug}.mdx`);
    return mdxModule.default;
  } catch (error) {
    console.error(`Failed to load MDX file: ${slug}`, error);
    // 返回错误组件
    return () => <ErrorComponent slug={slug} />;
  }
};

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const metadata = getPostMetadata(slug);
  
  if (!metadata) {
    notFound();
  }

  // 直接获取MDX组件
  const MDXComponent = await importMDX(slug);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 文章头部 */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {metadata.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span>📅 {metadata.date}</span>
            <span>⏱️ {metadata.readTime}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {metadata.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            {metadata.excerpt}
          </p>
        </div>

        {/* 文章内容 */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MDXComponent />
        </div>
      </div>
    </Layout>
  );
}

 