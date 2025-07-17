import { notFound } from 'next/navigation';
import { getBlogConfig } from '@/utils/posts';
import PostPageClient from './PostPageClient';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 获取文章配置
  const config = getBlogConfig(slug);
  
  if (!config || !config.published) {
    notFound();
  }

  return <PostPageClient slug={slug} config={config} />;
}