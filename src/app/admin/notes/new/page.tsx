import { requireAdminPage } from '@/utils/admin-auth';
import NoteEditor from '../NoteEditor';

/** 今天的日期（按东八区） */
function today(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date());
}

export default async function NewNotePage() {
  await requireAdminPage();
  return (
    <NoteEditor
      initial={{ date: today(), tags: [], draft: false, body: '' }}
    />
  );
}
