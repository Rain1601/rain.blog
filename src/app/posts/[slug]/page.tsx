import React from 'react';
import { notFound } from 'next/navigation';
import { getPostMetadata } from '@/utils/posts';
import { Layout } from '@/components/Layout';

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

  return (
    <Layout>
      <div className="max-w-article mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">
          {metadata.title}
        </h1>
        <p className="text-gray-600 mb-8">
          {metadata.excerpt}
        </p>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>这是一个测试页面，用于验证基本功能是否正常。</p>
          <p>文章slug: {slug}</p>
        </div>
      </div>
    </Layout>
  );
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const metadata = getPostMetadata(slug);
  
  if (!metadata) {
    return {
      title: '文章未找到',
      description: '请求的文章不存在',
    };
  }

  return {
    title: metadata.title,
    description: metadata.excerpt,
  };
}

export async function generateStaticParams() {
  return [
    { slug: 'python-basics' },
    { slug: 'openai-integration' },
    { slug: 'data-analysis' },
  ];
}

 