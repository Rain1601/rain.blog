import styles from './UtekiMark.module.css';

/**
 * Uteki 的动态插画：手绘墨线的三根 K 线 + 一枚放大镜（投研）。
 * 进场时 K 线依次"画"出来并轻轻起伏；放大镜则反复地画出 → 扫视 → 擦掉。
 * 线条颜色取页面的 --ink，白天黑夜都适用；减少动态效果时直接显示画好的静态图。
 */
export default function UtekiMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`${styles.mark} ${className}`}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      {/* K 线：影线 + 实体，路径故意带一点手抖 */}
      <g transform="translate(-6 0)">
      <g className={`${styles.candle} ${styles.c1}`}>
        <path className={styles.line} pathLength={1} style={{ ['--d' as string]: '0s' }} d="M28.5 38 C28.2 46, 28.8 54, 28.4 62 S28.6 80, 28.3 88" />
        <path className={`${styles.line} ${styles.body}`} pathLength={1} style={{ ['--d' as string]: '0.12s' }} d="M23.4 52.2 C26 51.6, 30.6 51.5, 33.6 52.4 C33.9 59, 33.5 66, 33.8 74.6 C30.8 75.4, 26.2 75.2, 23.2 74.4 C23.5 67, 23 59, 23.4 52.2 Z" />
      </g>
      <g className={`${styles.candle} ${styles.c2}`}>
        <path className={styles.line} pathLength={1} style={{ ['--d' as string]: '0.22s' }} d="M47.6 22 C47.9 32, 47.3 44, 47.7 56 S47.4 74, 47.8 82" />
        <path className={`${styles.line} ${styles.body} ${styles.bodyAccent}`} pathLength={1} style={{ ['--d' as string]: '0.34s' }} d="M42.2 33.6 C45 32.8, 50 32.9, 53 33.8 C53.4 43, 52.8 54, 53.2 66.2 C50.2 67, 45.2 66.9, 42.4 66 C42.7 55, 42 44, 42.2 33.6 Z" />
      </g>
      <g className={`${styles.candle} ${styles.c3}`}>
        <path className={styles.line} pathLength={1} style={{ ['--d' as string]: '0.44s' }} d="M66.4 46 C66.1 56, 66.7 66, 66.3 76 S66.5 90, 66.2 96" />
        <path className={`${styles.line} ${styles.body}`} pathLength={1} style={{ ['--d' as string]: '0.56s' }} d="M61.3 58.4 C64 57.7, 68.6 57.8, 71.5 58.6 C71.8 65, 71.3 73, 71.7 82.4 C68.7 83.1, 64 83, 61.1 82.2 C61.4 74, 61 66, 61.3 58.4 Z" />
      </g>
      </g>

      {/* 放大镜：镜框 + 手柄，循环地画出、停留扫视、擦掉 */}
      <g transform="translate(5 0)">
      <g className={styles.lens}>
        <path className={`${styles.line} ${styles.glass}`} pathLength={1} d="M84.8 47.6 C96.6 47.2, 105.4 56.4, 105 67.8 C104.6 79.4, 95.2 88.2, 84 87.6 C72.8 87.2, 64.6 78, 65 67 C65.4 56.2, 73.6 48, 84.8 47.6 Z" />
        <path className={`${styles.line} ${styles.handle}`} pathLength={1} d="M98.6 83.2 C101.8 86.6, 105.2 90.4, 109.4 95.2" />
      </g>
      </g>
    </svg>
  );
}
