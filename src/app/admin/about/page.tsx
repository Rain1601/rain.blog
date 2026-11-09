import Link from 'next/link';
import { requireAdminPage } from '@/utils/admin-auth';
import { loadAbout } from '../data';
import AboutEditor from './AboutEditor';
import styles from '../admin.module.css';

export default async function AdminAboutPage() {
  await requireAdminPage();
  const result = await loadAbout();

  if (result.error || !result.data) {
    return (
      <div className={`${styles.page} ${styles.narrow}`}>
        <Link href="/admin" className={styles.crumb}>← 后台</Link>
        <div className={styles.error} style={{ marginTop: '1rem' }}>{result.error}</div>
      </div>
    );
  }

  return <AboutEditor initial={result.data.about} sha={result.data.sha} />;
}
