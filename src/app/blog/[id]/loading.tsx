import styles from './page.module.css';

/** 还没生成过的文章第一次打开时，先显示和正文版式一致的骨架，而不是空白转圈 */
export default function Loading() {
  return (
    <div className={styles.container} aria-busy="true" aria-label="Loading">
      <div className={styles.skeleton}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonMeta} />
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={styles.skeletonLine} style={{ width: `${92 - (i % 3) * 14}%` }} />
        ))}
      </div>
    </div>
  );
}
