import Link from 'next/link';
import { requireAdminPage } from '@/utils/admin-auth';
import { loadNote } from '../../data';
import NoteEditor from '../NoteEditor';
import styles from '../../admin.module.css';

export default async function EditNotePage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>;
}) {
  await requireAdminPage();
  const { path = '' } = await searchParams;
  const note = await loadNote(path);

  if (note.error || !note.data) {
    return (
      <div className={`${styles.page} ${styles.narrow}`}>
        <Link href="/admin" className={styles.crumb}>← 后台</Link>
        <div className={styles.error} style={{ marginTop: '1rem' }}>
          {note.error ?? `找不到随笔：${path}`}
        </div>
      </div>
    );
  }

  return <NoteEditor key={note.data.sha} initial={note.data.fields} path={note.data.path} sha={note.data.sha} />;
}
