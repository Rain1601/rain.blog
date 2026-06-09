import { githubAPI } from '@/utils/github';
import ArticlesClient from './ArticlesClient';

// 5 分钟自动重新生成（与底层 fetch revalidate 一致）
export const revalidate = 300;

export default async function ArticlesPage() {
  const { posts, stats } = await githubAPI.getFeed();
  return <ArticlesClient initialPosts={posts} initialStats={stats} />;
}
