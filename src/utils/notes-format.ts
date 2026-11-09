/**
 * 随笔 markdown 的读写格式，公开页面和后台共用。
 *
 * 文件位置：notes/YYYY/MM/YYYY-MM-DD-slug.md
 * front matter 是简单的 `key: value` 一行一个（不是完整 YAML）：
 *   date: 2026-11-05
 *   title: 可选
 *   tags: [AI, Coding agent]
 *   video / poster / link / linkTitle: 可选
 *   draft: true            （草稿，不在 /notes 显示）
 */

export interface NoteFields {
  title?: string;
  date: string;
  tags: string[];
  link?: string;
  linkTitle?: string;
  video?: string;
  poster?: string;
  draft: boolean;
  body: string;
}

const FRONT_MATTER = /^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/;

export function parseNoteMarkdown(raw: string): NoteFields {
  const match = raw.match(FRONT_MATTER);
  const meta: Record<string, string> = {};
  if (match) {
    for (const line of match[1].split('\n')) {
      const i = line.indexOf(':');
      if (i === -1) continue;
      let value = line.slice(i + 1).trim();
      if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
      meta[line.slice(0, i).trim()] = value;
    }
  }
  const opt = (key: string) => meta[key] || undefined;
  const tags = (meta.tags ?? '').replace(/^\[|\]$/g, '');
  return {
    title: opt('title'),
    date: meta.date ?? '',
    tags: tags ? tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
    link: opt('link'),
    linkTitle: opt('linkTitle'),
    video: opt('video'),
    poster: opt('poster'),
    draft: meta.draft === 'true',
    body: (match ? raw.slice(match[0].length) : raw).trim(),
  };
}

/** front matter 值不能换行；逗号会被当成标签分隔符，所以从标签里去掉 */
const clean = (v: string) => v.replace(/[\r\n]+/g, ' ').trim();

export function serializeNote(note: NoteFields): string {
  const lines = [`date: ${clean(note.date)}`];
  if (note.title?.trim()) lines.push(`title: ${clean(note.title)}`);
  const tags = note.tags.map((t) => clean(t).replace(/,/g, ' ')).filter(Boolean);
  if (tags.length) lines.push(`tags: [${tags.join(', ')}]`);
  for (const key of ['video', 'poster', 'link', 'linkTitle'] as const) {
    const value = note[key]?.trim();
    if (value) lines.push(`${key}: ${clean(value)}`);
  }
  if (note.draft) lines.push('draft: true');
  return `---\n${lines.join('\n')}\n---\n${note.body.trim()}\n`;
}

export function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());
}

/** 新随笔的文件路径；slug 只保留小写字母数字和连字符，空的话用时分秒 */
export function newNotePath(date: string, slug: string): string {
  const [year, month] = date.split('-');
  const safe = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  const suffix = safe || new Date().toTimeString().slice(0, 8).replace(/:/g, '');
  return `notes/${year}/${month}/${date}-${suffix}.md`;
}
