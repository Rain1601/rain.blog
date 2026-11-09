/**
 * 后台写入内容仓库（Rain1601/rain.blog.repo）。仅在服务端使用。
 * 需要 GITHUB_TOKEN 对该仓库有 Contents 读写权限。
 * 读取一律 no-store，保证后台看到的是最新内容（不走公开页面的 5 分钟缓存）。
 */

const OWNER = 'Rain1601';
const REPO = 'rain.blog.repo';
const BRANCH = 'main';
const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

export interface RepoFile {
  path: string;
  sha: string;
  content: string;
}

/** 内容仓库是公开的：读取没有 token 也能用（限 60 次/小时），写入必须有 token */
function headers(forWrite = false): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  if (forWrite && !token) {
    throw new Error('未配置 GITHUB_TOKEN，无法写入内容仓库。请在 .env.local（本地）和 Vercel 环境变量里设置。');
  }
  return {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'Rain-Blog-Admin',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

async function failure(res: Response, action: string): Promise<Error> {
  let detail = '';
  try {
    detail = ((await res.json()) as { message?: string }).message ?? '';
  } catch {
    /* ignore */
  }
  if (res.status === 401) return new Error(`${action}失败：GITHUB_TOKEN 无效或已过期`);
  if ((res.status === 403 || res.status === 429) && res.headers.get('x-ratelimit-remaining') === '0') {
    const reset = Number(res.headers.get('x-ratelimit-reset')) * 1000;
    const when = reset ? new Date(reset).toLocaleTimeString('zh-CN', { timeZone: 'Asia/Shanghai' }) : '稍后';
    const hint = process.env.GITHUB_TOKEN ? '' : '（未配置 GITHUB_TOKEN 时每小时只有 60 次）';
    return new Error(`${action}失败：GitHub API 请求次数用完了${hint}，将在 ${when} 恢复`);
  }
  if (res.status === 403) return new Error(`${action}失败：GITHUB_TOKEN 没有内容仓库的写权限（${detail}）`);
  if (res.status === 409 || res.status === 422) {
    return new Error(`${action}失败：文件已被别处修改，请刷新后再保存（${detail}）`);
  }
  return new Error(`${action}失败：GitHub ${res.status} ${detail}`);
}

/** 读取单个文件，不存在返回 null */
export async function readFile(path: string): Promise<RepoFile | null> {
  const res = await fetch(`${API}/${encodePath(path)}?ref=${BRANCH}`, { headers: headers(), cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw await failure(res, '读取');
  const data = (await res.json()) as { path: string; sha: string; content: string };
  return { path: data.path, sha: data.sha, content: Buffer.from(data.content, 'base64').toString('utf8') };
}

/** 递归列出目录下的 .md 文件（不含内容），目录不存在返回 [] */
export async function listMarkdown(dir: string): Promise<{ path: string; sha: string }[]> {
  const res = await fetch(`${API}/${encodePath(dir)}?ref=${BRANCH}`, { headers: headers(), cache: 'no-store' });
  if (res.status === 404) return [];
  if (!res.ok) throw await failure(res, '读取目录');
  const items = (await res.json()) as { type: string; path: string; sha: string; name: string }[];
  const nested = await Promise.all(
    items.map(async (item) => {
      if (item.type === 'dir') return listMarkdown(item.path);
      if (item.type === 'file' && /\.mdx?$/.test(item.name)) return [{ path: item.path, sha: item.sha }];
      return [];
    })
  );
  return nested.flat();
}

/** 新建或更新文件。更新时必须带上读取时的 sha，防止覆盖别处的修改 */
export async function writeFile(path: string, content: string, message: string, sha?: string): Promise<string> {
  const res = await fetch(`${API}/${encodePath(path)}`, {
    method: 'PUT',
    headers: headers(true),
    cache: 'no-store',
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf8').toString('base64'),
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) throw await failure(res, '保存');
  const data = (await res.json()) as { content: { sha: string } };
  return data.content.sha;
}

export async function deleteFile(path: string, sha: string, message: string): Promise<void> {
  const res = await fetch(`${API}/${encodePath(path)}`, {
    method: 'DELETE',
    headers: headers(true),
    cache: 'no-store',
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  });
  if (!res.ok) throw await failure(res, '删除');
}
