import { listMarkdown, readFile } from '@/utils/github-write';
import { NoteFields, parseNoteMarkdown } from '@/utils/notes-format';
import { AboutContent, DEFAULT_ABOUT, normalizeAbout } from '@/content/about/default';

/** 后台读取：直接读内容仓库最新版本（不走公开页面缓存），并带上 sha 供保存时校验 */

export interface AdminNote {
  path: string;
  sha: string;
  fields: NoteFields;
}

type Loaded<T> = { data: T; error?: undefined } | { data?: undefined; error: string };

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

export async function loadNotes(): Promise<Loaded<AdminNote[]>> {
  try {
    const files = await listMarkdown('notes');
    const notes = await Promise.all(
      files.map(async ({ path }) => {
        const file = await readFile(path);
        return file ? { path, sha: file.sha, fields: parseNoteMarkdown(file.content) } : null;
      })
    );
    return {
      data: notes
        .filter((n): n is AdminNote => n !== null)
        .sort((a, b) => b.fields.date.localeCompare(a.fields.date) || b.path.localeCompare(a.path)),
    };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function loadNote(path: string): Promise<Loaded<AdminNote | null>> {
  try {
    if (!path.startsWith('notes/')) return { data: null };
    const file = await readFile(path);
    return { data: file ? { path, sha: file.sha, fields: parseNoteMarkdown(file.content) } : null };
  } catch (error) {
    return { error: message(error) };
  }
}

export async function loadAbout(): Promise<Loaded<{ about: AboutContent; sha?: string }>> {
  try {
    const file = await readFile('about.json');
    if (!file) return { data: { about: DEFAULT_ABOUT } };
    return { data: { about: normalizeAbout(JSON.parse(file.content)), sha: file.sha } };
  } catch (error) {
    return { error: message(error) };
  }
}
