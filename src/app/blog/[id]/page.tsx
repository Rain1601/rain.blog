import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { githubAPI } from '@/utils/github';
import { clip, plainText } from '@/utils/text';
import PostClient from './PostClient';

/**
 * 文章详情：构建时为每篇文章生成静态页面，之后每 5 分钟重新生成；
 * 新发布、还没生成过的文章会在第一次访问时生成（期间显示 loading.tsx 的骨架）。
 * 静态页面可以被列表里的 <Link> 预取，点击后几乎立即打开。
 */
export const revalidate = 300;

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const posts = await githubAPI.getAllPosts();
  return posts.map((post) => ({ id: post.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const post = await githubAPI.getPostById(id);
  if (!post) return { title: "Rain's Blog" };
  return {
    title: `${post.title} - Rain`,
    description: clip(post.summary || plainText(post.content), 160),
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { id } = await params;
  const posts = await githubAPI.getAllPosts(); // 已按日期倒序
  const idx = posts.findIndex((p) => p.id === id);
  if (idx < 0) notFound();

  const post = posts[idx];
  const next = posts[idx + 1];
  const index = posts.map((p) => ({ id: p.id, title: p.title, year: p.year }));
  const translation = post.language && post.translationPath
    ? posts.find((p) =>
        p.path === post.translationPath &&
        p.translationPath === post.path &&
        p.language && p.language !== post.language
      )
    : undefined;

  return (
    <PostClient
      key={post.id}
      post={post}
      index={index}
      nextPost={next ? { id: next.id, title: next.title, year: next.year } : null}
      translation={translation?.language ? { id: translation.id, language: translation.language } : null}
    />
  );
}
