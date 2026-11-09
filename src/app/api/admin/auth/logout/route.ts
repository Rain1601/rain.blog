import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/utils/admin-auth';

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url), 303);
  response.cookies.delete({ name: SESSION_COOKIE, path: '/' });
  return response;
}
