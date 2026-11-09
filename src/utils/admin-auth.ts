import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * 后台鉴权：GitHub OAuth 登录，只放行 ADMIN_GITHUB_LOGIN（默认 Rain1601）。
 *
 * 流程：/api/admin/auth/login → GitHub 授权 → /api/admin/auth/callback
 *   → 用 code 换 token → 查 /user 拿到 login → 是管理员就下发签名 cookie。
 * GitHub 返回的 access token 只用来查一次身份，不保存。
 *
 * 环境变量：
 *   GITHUB_OAUTH_CLIENT_ID / GITHUB_OAUTH_CLIENT_SECRET  OAuth App 凭据
 *   ADMIN_SECRET          cookie 签名密钥（随机长字符串，改了会让所有登录失效）
 *   ADMIN_GITHUB_LOGIN    可选，默认 Rain1601
 */

export const SESSION_COOKIE = 'rain_admin';
export const STATE_COOKIE = 'rain_admin_oauth_state';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 天

export function adminLogin(): string {
  return process.env.ADMIN_GITHUB_LOGIN || 'Rain1601';
}

/** 缺哪些环境变量；为空表示后台可用 */
export function missingAuthEnv(): string[] {
  return ['GITHUB_OAUTH_CLIENT_ID', 'GITHUB_OAUTH_CLIENT_SECRET', 'ADMIN_SECRET'].filter(
    (key) => !process.env[key]
  );
}

function sign(payload: string): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error('ADMIN_SECRET 未配置');
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function newOAuthState(): string {
  return randomBytes(16).toString('base64url');
}

/** token 格式：login.expires.signature（GitHub 用户名只含字母数字和连字符，不会有点号） */
export function createSessionToken(login: string): string {
  const payload = `${login}.${Math.floor(Date.now() / 1000) + SESSION_MAX_AGE}`;
  return `${payload}.${sign(payload)}`;
}

/** 校验通过返回用户名，否则 null */
export function verifySessionToken(token: string | undefined): string | null {
  if (!token || !process.env.ADMIN_SECRET) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [login, expires, signature] = parts;
  if (!safeEqual(signature, sign(`${login}.${expires}`))) return null;
  if (Number(expires) <= Date.now() / 1000) return null;
  if (login.toLowerCase() !== adminLogin().toLowerCase()) return null;
  return login;
}

export async function currentAdmin(): Promise<string | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** 页面里用：未登录直接跳登录页 */
export async function requireAdminPage(): Promise<string> {
  const login = await currentAdmin();
  if (!login) redirect('/admin/login');
  return login;
}

/** server action 里用：未登录抛错 */
export async function requireAdminAction(): Promise<void> {
  if (!(await currentAdmin())) throw new Error('未登录或登录已过期，请刷新页面重新登录');
}
