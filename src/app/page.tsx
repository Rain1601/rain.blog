import { githubAPI } from '@/utils/github';
import { withSampleNotes } from '@/content/notes/sample';
import { clip, firstSentence, plainText } from '@/utils/text';
import HomeClient, { HomeItem } from './HomeClient';

// 首页：左侧个人信息，右侧全部文章与随笔。5 分钟重新生成，后台发布后立即失效
export const revalidate = 300;

export default async function HomePage() {
  const [feed, rawNotes] = await Promise.all([githubAPI.getFeed(), githubAPI.getAllNotes()]);
  const { notes } = withSampleNotes(rawNotes);

  const items: HomeItem[] = [
    ...feed.posts.map((post) => ({
      kind: 'article' as const,
      key: `a-${post.id}`,
      title: post.title,
      excerpt: clip(post.summary || plainText(post.content), 120),
      date: post.date,
      href: `/blog/${post.id}`,
    })),
    ...notes.map((note) => {
      const text = plainText(note.body);
      // 随笔没有标题时，第一句话当标题，后面的当摘要
      const lead = note.title ? '' : firstSentence(text);
      return {
        kind: 'note' as const,
        key: `n-${note.id}`,
        title: note.title || clip(lead, 60),
        excerpt: clip(note.title ? text : text.slice(lead.length).trim(), 120),
        date: note.date,
        href: `/notes#${note.id}`,
        hasVideo: Boolean(note.video),
      };
    }),
  ].sort((a, b) => b.date.slice(0, 10).localeCompare(a.date.slice(0, 10)));

  return <HomeClient items={items} />;
}
