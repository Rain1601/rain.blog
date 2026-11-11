import { githubAPI } from '@/utils/github';
import { clip, plainText } from '@/utils/text';
import ArticlesClient, { ArticleCard } from './ArticlesClient';

// 5 分钟自动重新生成（与底层 fetch revalidate 一致）
export const revalidate = 300;

export default async function ArticlesPage() {
  const { posts } = await githubAPI.getFeed();

  const articles: ArticleCard[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    date: post.date,
    excerpt: clip(post.summary || plainText(post.content), 140),
    topics: Array.from(new Set([
      ...(post.tags ?? []),
      ...(post.categories ?? []),
    ].filter(Boolean))),
  }));

  return <ArticlesClient articles={articles} />;
}
