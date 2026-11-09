import Link from 'next/link';
import { requireAdminPage } from '@/utils/admin-auth';
import { loadNotes } from './data';
import styles from './admin.module.css';

function preview(title: string | undefined, body: string): string {
  if (title) return title;
  const firstLine = body.split('\n').find((line) => line.trim()) ?? '';
  return firstLine.replace(/[#>*_`!\[\]]/g, '').trim() || '（空）';
}

export default async function AdminPage() {
  const login = await requireAdminPage();
  const notes = await loadNotes();

  return (
    <div className={`${styles.page} ${styles.narrow}`}>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.title}>后台</h1>
          <span className={styles.muted}>已登录：{login}</span>
        </div>
        <form action="/api/admin/auth/logout" method="post">
          <button type="submit" className={styles.btn}>退出登录</button>
        </form>
      </div>

      {notes.error && <div className={styles.error}>{notes.error}</div>}

      <div className={styles.sectionHead}>
        <h2>关于</h2>
      </div>
      <Link href="/admin/about" className={`${styles.card} ${styles.listItem}`} style={{ borderTop: '1px solid var(--border-medium)' }}>
        <span className={styles.listText}>编辑个人介绍、经历、项目与技能</span>
        <span className={styles.muted}>→</span>
      </Link>

      <div className={styles.sectionHead}>
        <h2>随笔 {notes.data && <span className={styles.muted}>· {notes.data.length}</span>}</h2>
        <Link href="/admin/notes/new" className={styles.btnPrimary}>+ 新随笔</Link>
      </div>

      {notes.data && (
        notes.data.length === 0 ? (
          <div className={`${styles.list} ${styles.empty}`}>还没有随笔，写下第一条吧。</div>
        ) : (
          <ul className={styles.list}>
            {notes.data.map((note) => (
              <li key={note.path}>
                <Link href={`/admin/notes/edit?path=${encodeURIComponent(note.path)}`} className={styles.listItem}>
                  <span className={styles.listDate}>{note.fields.date}</span>
                  <span className={styles.listText}>{preview(note.fields.title, note.fields.body)}</span>
                  {note.fields.draft && <span className={styles.badge}>草稿</span>}
                </Link>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}
