import { NextRequest, NextResponse } from 'next/server';
import { STATE_COOKIE, missingAuthEnv, newOAuthState } from '@/utils/admin-auth';

/** 跳转到 GitHub 授权页 */
export async function GET(request: NextRequest) {
  if (missingAuthEnv().length > 0) {
    return NextResponse.redirect(new URL('/admin/login?error=config', request.url));
  }

  const state = newOAuthState();
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', process.env.GITHUB_OAUTH_CLIENT_ID!);
  authorize.searchParams.set('redirect_uri', new URL('/api/admin/auth/callback', request.url).toString());
  authorize.searchParams.set('state', state);
  authorize.searchParams.set('allow_signup', 'false');
  // 不申请任何 scope：只需要读公开的用户名

  const response = NextResponse.redirect(authorize);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/admin/auth',
    maxAge: 600,
  });
  return response;
}
