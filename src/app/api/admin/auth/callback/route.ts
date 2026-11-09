import { NextRequest, NextResponse } from 'next/server';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  STATE_COOKIE,
  adminLogin,
  createSessionToken,
} from '@/utils/admin-auth';

function fail(request: NextRequest, error: string) {
  const response = NextResponse.redirect(new URL(`/admin/login?error=${error}`, request.url));
  response.cookies.delete({ name: STATE_COOKIE, path: '/api/admin/auth' });
  return response;
}

/** GitHub 授权回调：校验 state → 换 token → 查用户名 → 只放行管理员 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const expectedState = request.cookies.get(STATE_COOKIE)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return fail(request, 'state');
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
        client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
        code,
        redirect_uri: new URL('/api/admin/auth/callback', request.url).toString(),
      }),
      cache: 'no-store',
    });
    const { access_token: accessToken } = (await tokenRes.json()) as { access_token?: string };
    if (!accessToken) return fail(request, 'oauth');

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'Rain-Blog-Admin',
      },
      cache: 'no-store',
    });
    const user = (await userRes.json()) as { login?: string };
    if (!user.login) return fail(request, 'oauth');

    if (user.login.toLowerCase() !== adminLogin().toLowerCase()) {
      return fail(request, 'forbidden');
    }

    const response = NextResponse.redirect(new URL('/admin', request.url));
    response.cookies.delete({ name: STATE_COOKIE, path: '/api/admin/auth' });
    response.cookies.set(SESSION_COOKIE, createSessionToken(user.login), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    console.error('GitHub 登录失败:', error);
    return fail(request, 'oauth');
  }
}
