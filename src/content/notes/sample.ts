import type { Note } from '@/utils/github';

// 本地开发时，内容仓库还没有 notes/ 的话用这条示例预览版式（生产环境不显示）
export const SAMPLE_NOTES: Note[] = [
  {
    id: 'sample',
    body:
      '最近修一个 Bug，Codex 6-Astra 折腾了 1 小时 40 分钟还没搞定，换 Claude Opus 5.5，30 分钟就修好了。\n\n' +
      '好奇之下，回头翻了翻 Codex 的排查过程，发现它在排查思路、防御编程和与人协作这三块，都走了比较多弯路。于是和 Opus 5.5 一起整理了一份系统提示词，更新后让 Codex 重新修复，这次在几乎无人参与的条件下花了 40 分钟修好。以及后面做其他需求和解 bug 时，也明显感觉比之前顺手了一些。\n\n' +
      '听说后面的 6.2 会改善防御性编程过重的问题，这份提示词可能很快就过时（用不到）了。不过这次排查和解决的过程挺有意思，分享一下～',
    date: '2026-11-05',
    tags: ['AI', 'Coding agent'],
    video: '/notes/2026-11-05-claude-codex.mp4',
    poster: '/notes/2026-11-05-claude-codex.jpg',
    url: '',
  },
  {
    id: 'sample-2',
    title: '（示例）上下文不是越多越好',
    body: '（示例随笔，用于本地预览筛选效果）给 agent 的信息，重要的是在对的时间给对的那一部分。',
    date: '2026-10-21',
    tags: ['Context'],
    url: '',
  },
  {
    id: 'sample-3',
    body: '（示例随笔，用于本地预览筛选效果）回看 Uteki 两年的记录，最值钱的可能是那些离开投研也成立的东西。',
    date: '2026-09-08',
    tags: ['AI', 'Uteki'],
    url: '',
  },
];

/** 本地开发且内容仓库还没有随笔时，用示例数据预览版式；生产环境原样返回 */
export function withSampleNotes(notes: Note[]): { notes: Note[]; isSample: boolean } {
  const isSample = notes.length === 0 && process.env.NODE_ENV === 'development';
  return { notes: isSample ? SAMPLE_NOTES : notes, isSample };
}
