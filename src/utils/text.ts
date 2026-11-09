/** markdown 转纯文本：去掉 front matter、代码块、图片、HTML、标题、列表符号和链接语法（正文里的连字符保留） */
export function plainText(markdown: string): string {
  return markdown
    .replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+.*$/gm, ' ')
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/[*_`|]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 超过 max 个字符时截断并加省略号 */
export function clip(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

/** 取第一句话（到第一个句号/问号/感叹号为止） */
export function firstSentence(text: string): string {
  const match = text.match(/^.*?[。！？!?](?=\s|$|[^。！？!?])/);
  return match ? match[0] : text;
}
