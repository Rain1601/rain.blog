'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAdminAction } from '@/utils/admin-auth';
import { CONTENT_CACHE_TAG } from '@/utils/content-cache';
import { deleteFile, readFile, writeFile } from '@/utils/github-write';
import { NoteFields, isValidDate, newNotePath, serializeNote } from '@/utils/notes-format';
import { AboutContent, normalizeAbout } from '@/content/about/default';

/**
 * 后台的写操作。每个 action 都先校验登录，再写内容仓库，最后让公开页面缓存失效。
 * 出错时返回 { error } 而不是 throw：生产环境下 server action 抛出的错误信息会被隐藏。
 */

export type ActionResult<T = object> = ({ ok: true } & T) | { ok: false; error: string };

function refreshPublicPages() {
  revalidateTag(CONTENT_CACHE_TAG);
  revalidatePath('/notes');
  revalidatePath('/about');
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function saveNoteAction(input: {
  /** 编辑已有随笔时传原路径和 sha；新建时都不传 */
  path?: string;
  sha?: string;
  slug?: string;
  fields: NoteFields;
}): Promise<ActionResult<{ path: string; sha: string }>> {
  try {
    await requireAdminAction();
    const { fields } = input;
    if (!isValidDate(fields.date)) return { ok: false, error: '日期格式应为 YYYY-MM-DD' };
    if (!fields.body.trim()) return { ok: false, error: '正文不能为空' };

    const path = input.path ?? newNotePath(fields.date, input.slug ?? '');
    if (!path.startsWith('notes/') || !path.endsWith('.md')) return { ok: false, error: '非法的文件路径' };

    if (!input.path && (await readFile(path))) {
      return { ok: false, error: `${path} 已存在，换一个短名称再试` };
    }

    const verb = input.path ? '更新' : '新增';
    const label = fields.draft ? '草稿' : '随笔';
    const sha = await writeFile(path, serializeNote(fields), `${verb}${label}: ${path}`, input.sha);
    refreshPublicPages();
    return { ok: true, path, sha };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

export async function deleteNoteAction(path: string, sha: string): Promise<ActionResult> {
  try {
    await requireAdminAction();
    if (!path.startsWith('notes/')) return { ok: false, error: '非法的文件路径' };
    await deleteFile(path, sha, `删除随笔: ${path}`);
    refreshPublicPages();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

export async function saveAboutAction(about: AboutContent, sha?: string): Promise<ActionResult<{ sha: string }>> {
  try {
    await requireAdminAction();
    const content = `${JSON.stringify(normalizeAbout(about), null, 2)}\n`;
    const newSha = await writeFile('about.json', content, '更新关于页', sha);
    refreshPublicPages();
    return { ok: true, sha: newSha };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}
