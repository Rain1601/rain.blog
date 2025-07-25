import { NextRequest, NextResponse } from 'next/server';
import { githubAPI } from '@/utils/github';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const year = searchParams.get('year');
    const search = searchParams.get('search');

    if (id) {
      // 获取单篇文章
      const post = await githubAPI.getPostById(id);
      return NextResponse.json({ post });
    }

    if (year) {
      // 按年份获取文章
      const posts = await githubAPI.getPostsByYear(year);
      return NextResponse.json({ posts });
    }

    if (search) {
      // 搜索文章
      const posts = await githubAPI.searchPosts(search);
      return NextResponse.json({ posts });
    }

    // 获取所有文章
    const posts = await githubAPI.getAllPosts();
    return NextResponse.json({ posts });

  } catch (error) {
    console.error('GitHub API请求失败:', error);
    return NextResponse.json(
      { error: '获取博客数据失败', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}