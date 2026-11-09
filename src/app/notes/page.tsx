import { githubAPI } from '@/utils/github';
import { withSampleNotes } from '@/content/notes/sample';
import NotesClient from './NotesClient';

// 5 分钟自动重新生成（与底层 fetch revalidate 一致）
export const revalidate = 300;

export default async function NotesPage() {
  const { notes, isSample } = withSampleNotes(await githubAPI.getAllNotes());
  return <NotesClient notes={notes} isSample={isSample} />;
}
