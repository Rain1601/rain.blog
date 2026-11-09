'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import type { AboutContent, AboutExperience, AboutProject, Bilingual, BilingualList } from '@/content/about/default';
import { saveAboutAction } from '../actions';
import styles from '../admin.module.css';

/* ---------- 小组件 ---------- */

function BiInput({ label, value, onChange, multiline }: {
  label: string;
  value: Bilingual;
  onChange: (v: Bilingual) => void;
  multiline?: boolean;
}) {
  const Tag = multiline ? 'textarea' : 'input';
  const cls = multiline ? styles.textarea : styles.input;
  return (
    <div className={styles.grid2}>
      {(['zh', 'en'] as const).map((lang) => (
        <label key={lang} className={styles.field}>
          <span className={styles.label}>{label} · {lang === 'zh' ? '中文' : 'English'}</span>
          <Tag className={cls} rows={multiline ? 3 : undefined} value={value[lang]} onChange={(e) => onChange({ ...value, [lang]: e.target.value })} />
        </label>
      ))}
    </div>
  );
}

/** 列表按行编辑：一行一项，空行忽略 */
function BiLines({ label, value, onChange, rows = 4 }: {
  label: string;
  value: BilingualList;
  onChange: (v: BilingualList) => void;
  rows?: number;
}) {
  return (
    <div className={styles.grid2}>
      {(['zh', 'en'] as const).map((lang) => (
        <label key={lang} className={styles.field}>
          <span className={styles.label}>{label} · {lang === 'zh' ? '中文' : 'English'}</span>
          <textarea
            className={styles.textarea}
            rows={rows}
            value={value[lang].join('\n')}
            onChange={(e) => onChange({ ...value, [lang]: e.target.value.split('\n') })}
          />
        </label>
      ))}
    </div>
  );
}

function ItemHead({ index, count, onMove, onRemove }: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className={styles.itemHead}>
      <span>#{index + 1}</span>
      <span>
        <button type="button" className={styles.iconBtn} disabled={index === 0} onClick={() => onMove(index - 1)}>上移</button>
        <button type="button" className={styles.iconBtn} disabled={index === count - 1} onClick={() => onMove(index + 1)}>下移</button>
        <button type="button" className={styles.iconBtn} onClick={onRemove}>删除</button>
      </span>
    </div>
  );
}

const move = <T,>(list: T[], from: number, to: number): T[] => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const emptyBi = (): Bilingual => ({ zh: '', en: '' });

/** 保存前去掉列表里的空行 */
const trimLines = (v: BilingualList): BilingualList => ({
  zh: v.zh.map((s) => s.trim()).filter(Boolean),
  en: v.en.map((s) => s.trim()).filter(Boolean),
});

/* ---------- 编辑器 ---------- */

export default function AboutEditor({ initial, sha: initialSha }: { initial: AboutContent; sha?: string }) {
  const [about, setAbout] = useState<AboutContent>(initial);
  const [tagsText, setTagsText] = useState(initial.skills.tags.join(', '));
  const [sha, setSha] = useState(initialSha);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const set = (patch: Partial<AboutContent>) => {
    setAbout((a) => ({ ...a, ...patch }));
    setDirty(true);
    setStatus(null);
  };

  const setExperience = (i: number, patch: Partial<AboutExperience>) =>
    set({ experience: about.experience.map((e, j) => (j === i ? { ...e, ...patch } : e)) });
  const setProject = (i: number, patch: Partial<AboutProject>) =>
    set({ projects: about.projects.map((p, j) => (j === i ? { ...p, ...patch } : p)) });

  const save = () => {
    const cleaned: AboutContent = {
      ...about,
      intro: trimLines(about.intro),
      projects: about.projects.map((p) => ({ ...p, bullets: trimLines(p.bullets) })),
      skills: { ...about.skills, tags: tagsText.split(/[,，]/).map((t) => t.trim()).filter(Boolean) },
    };
    startTransition(async () => {
      const result = await saveAboutAction(cleaned, sha);
      if (!result.ok) {
        setStatus({ kind: 'error', text: result.error });
        return;
      }
      setSha(result.sha);
      setAbout(cleaned);
      setDirty(false);
      setStatus({ kind: 'success', text: '已发布，关于页已更新' });
    });
  };

  return (
    <div className={`${styles.page} ${styles.narrow}`} style={{ maxWidth: 880 }}>
      <div className={styles.topbar}>
        <div>
          <Link href="/admin" className={styles.crumb}>← 后台</Link>
          <h1 className={styles.title} style={{ marginTop: '0.25rem' }}>编辑关于</h1>
        </div>
        <a href="/about" target="_blank" rel="noopener noreferrer" className={styles.crumb}>查看关于页 ↗</a>
      </div>

      {!sha && (
        <div className={styles.notice}>
          内容仓库里还没有 <code>about.json</code>，下面是关于页当前的内容。第一次发布时会创建这个文件。
        </div>
      )}
      {status && <div className={status.kind === 'error' ? styles.error : styles.success}>{status.text}</div>}

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>基本信息</h2>
        <div className={styles.grid3}>
          <label className={styles.field}>
            <span className={styles.label}>名字</span>
            <input className={styles.input} value={about.name} onChange={(e) => set({ name: e.target.value })} />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>邮箱</span>
            <input className={styles.input} value={about.email} onChange={(e) => set({ email: e.target.value })} />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>GitHub 链接</span>
            <input className={styles.input} value={about.github} onChange={(e) => set({ github: e.target.value })} />
          </label>
        </div>
        <BiInput label="城市" value={about.location} onChange={(location) => set({ location })} />
        <BiInput label="身份" value={about.role} onChange={(role) => set({ role })} />
        <BiInput label="一句话" value={about.description} onChange={(description) => set({ description })} />
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>自我介绍</h2>
        <BiLines label="段落（一行一段）" value={about.intro} rows={8} onChange={(intro) => set({ intro })} />
      </section>

      <section className={styles.card}>
        <div className={styles.sectionHead} style={{ marginTop: 0 }}>
          <h2 className={styles.cardTitle} style={{ margin: 0 }}>个人经历</h2>
          <button type="button" className={styles.btn} onClick={() => set({ experience: [...about.experience, { title: emptyBi(), subtitle: emptyBi(), start: '', end: '' }] })}>
            + 添加
          </button>
        </div>
        {about.experience.map((entry, i) => (
          <div key={i} className={styles.itemCard}>
            <ItemHead
              index={i}
              count={about.experience.length}
              onMove={(to) => set({ experience: move(about.experience, i, to) })}
              onRemove={() => set({ experience: about.experience.filter((_, j) => j !== i) })}
            />
            <BiInput label="学校 / 公司" value={entry.title} onChange={(title) => setExperience(i, { title })} />
            <BiInput label="专业 / 职位" value={entry.subtitle} onChange={(subtitle) => setExperience(i, { subtitle })} />
            <div className={styles.grid2}>
              <label className={styles.field}>
                <span className={styles.label}>开始</span>
                <input className={styles.input} value={entry.start} placeholder="2023.07" onChange={(e) => setExperience(i, { start: e.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>结束（留空 = 至今）</span>
                <input className={styles.input} value={entry.end} onChange={(e) => setExperience(i, { end: e.target.value })} />
              </label>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.card}>
        <div className={styles.sectionHead} style={{ marginTop: 0 }}>
          <h2 className={styles.cardTitle} style={{ margin: 0 }}>个人项目</h2>
          <button
            type="button"
            className={styles.btn}
            onClick={() => set({ projects: [...about.projects, { title: emptyBi(), start: '', end: '', desc: emptyBi(), bullets: { zh: [], en: [] } }] })}
          >
            + 添加
          </button>
        </div>
        {about.projects.map((project, i) => (
          <div key={i} className={styles.itemCard}>
            <ItemHead
              index={i}
              count={about.projects.length}
              onMove={(to) => set({ projects: move(about.projects, i, to) })}
              onRemove={() => set({ projects: about.projects.filter((_, j) => j !== i) })}
            />
            <BiInput label="项目名" value={project.title} onChange={(title) => setProject(i, { title })} />
            <div className={styles.grid2}>
              <label className={styles.field}>
                <span className={styles.label}>开始</span>
                <input className={styles.input} value={project.start} placeholder="2025.05" onChange={(e) => setProject(i, { start: e.target.value })} />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>结束（留空 = 至今）</span>
                <input className={styles.input} value={project.end} onChange={(e) => setProject(i, { end: e.target.value })} />
              </label>
            </div>
            <BiInput label="简介" value={project.desc} multiline onChange={(desc) => setProject(i, { desc })} />
            <BiLines label="要点（一行一条）" value={project.bullets} onChange={(bullets) => setProject(i, { bullets })} />
          </div>
        ))}
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>技能兴趣</h2>
        <label className={styles.field}>
          <span className={styles.label}>标签（逗号分隔）</span>
          <input className={styles.input} value={tagsText} onChange={(e) => { setTagsText(e.target.value); setDirty(true); setStatus(null); }} />
        </label>
        <BiInput label="说明" value={about.skills.desc} multiline onChange={(desc) => set({ skills: { ...about.skills, desc } })} />
      </section>

      <div className={styles.actions}>
        <button className={styles.btnPrimary} disabled={pending} onClick={save}>
          {pending ? '发布中…' : '发布'}
        </button>
        {dirty && <span className={styles.muted}>有未保存的修改</span>}
      </div>
    </div>
  );
}
