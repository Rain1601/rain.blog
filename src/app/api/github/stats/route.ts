import { NextResponse } from 'next/server';
import { githubAPI } from '@/utils/github';

export async function GET() {
  try {
    const stats = await githubAPI.getStats();
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('获取统计信息失败:', error);
    return NextResponse.json(
      { error: '获取统计信息失败', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}