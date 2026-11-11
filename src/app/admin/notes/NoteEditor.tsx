'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { NoteFields } from '@/utils/notes-format';
import { deleteNoteAction, saveNoteAction } from '../actions';
import styles from '../admin.module.css';

interface Props {
  initial: NoteFields;
  /** 编辑已有随笔时有值 */
  path?: string;
  sha?: string;
}

/** 与公开页 /notes 的锚点 id 规则一致 */
const publicAnchor = (path: string) =>
  path.replace(/^notes\//, '').replace(/\.mdx?$/, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

export default function NoteEditor({ initial, path, sha: initialSha }: Props) {
  const router = useRouter();
  const isNew = !path;
  const [fields, setFields] = useState<NoteFields>(initial);
  const [tagsText, setTagsText] = useState(initial.tags.join(', '));
  const [slug, setSlug] = useState('');
  const [sha, setSha] = useState(initialSha);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  // 有未保存的修改时，离开页面前提醒
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const update = <K extends keyof NoteFields>(key: K, value: NoteFields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    setDirty(true);
    setStatus(null);
  };

  const save = (draft: boolean) => {
    const tags = tagsText.split(/[,，]/).map((t) => t.trim()).filter(Boolean);
    startTransition(async () => {
      const result = await saveNoteAction({ path, sha, slug, fields: { ...fields, tags, draft } });
      if (!result.ok) {
        setStatus({ kind: 'error', text: result.error });
        return;
      }
      setDirty(false);
      setFields((f) => ({ ...f, tags, draft }));
      if (isNew) {
        router.replace(`/admin/notes/edit?path=${encodeURIComponent(result.path)}&saved=${draft ? 'draft' : 'published'}`);
        return;
      }
      setSha(result.sha);
      setStatus({ kind: 'success', text: draft ? '已存为草稿（不会在随笔页显示）' : '已发布，随笔页已更新' });
    });
  };

  const remove = () => {
    if (!path || !sha) return;
    if (!window.confirm('确定删除这条随笔？会从内容仓库里删除这个文件（git 历史里仍可找回）。')) return;
    startTransition(async () => {
      const result = await deleteNoteAction(path, sha);
      if (!result.ok) {
        setStatus({ kind: 'error', text: result.error });
        return;
      }
      setDirty(false);
      router.push('/admin');
      router.refresh();
    });
  };

  // 新建后跳转过来时，显示一次保存结果
  useEffect(() => {
    const saved = new URLSearchParams(window.location.search).get('saved');
    if (saved) {
      setStatus({ kind: 'success', text: saved === 'draft' ? '已存为草稿（不会在随笔页显示）' : '已发布，随笔页已更新' });
    }
  }, []);

  const tags = tagsText.split(/[,，]/).map((t) => t.trim()).filter(Boolean);

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <Link href="/admin" className={styles.crumb}>← 后台</Link>
          <h1 className={styles.title} style={{ marginTop: '0.25rem' }}>
            {isNew ? '新随笔' : '编辑随笔'}
            {!isNew && fields.draft && <span className={styles.badge} style={{ marginLeft: '0.625rem', verticalAlign: 'middle' }}>草稿</span>}
          </h1>
        </div>
        {path && !fields.draft && !dirty && (
          <a href={`/notes#${publicAnchor(path)}`} target="_blank" rel="noopener noreferrer" className={styles.crumb}>
            在随笔页查看 ↗
          </a>
        )}
      </div>

      {status && <div className={status.kind === 'error' ? styles.error : styles.success}>{status.text}</div>}

      <div className={styles.editor}>
        <div>
          <div className={styles.grid2}>
            <label className={styles.field}>
              <span className={styles.label}>日期</span>
              <input type="date" className={styles.input} value={fields.date} onChange={(e) => update('date', e.target.value)} />
            </label>
            {isNew ? (
              <label className={styles.field}>
                <span className={styles.label}>短名称（文件名，可选）</span>
                <input className={styles.input} value={slug} placeholder="claude-codex" onChange={(e) => { setSlug(e.target.value); setDirty(true); }} />
              </label>
            ) : (
              <div className={styles.field}>
                <span className={styles.label}>文件</span>
                <span className={styles.hint} style={{ lineHeight: '38px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{path}</span>
              </div>
            )}
          </div>

          <label className={styles.field}>
            <span className={styles.label}>中文标题（可选）</span>
            <input className={styles.input} value={fields.title ?? ''} onChange={(e) => update('title', e.target.value)} />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>中文正文（Markdown）</span>
            <textarea
              className={`${styles.textarea} ${styles.bodyArea}`}
              value={fields.body}
              onChange={(e) => update('body', e.target.value)}
              placeholder="想到什么写什么……"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>英文标题（可选）</span>
            <input className={styles.input} value={fields.titleEn ?? ''} onChange={(e) => update('titleEn', e.target.value)} />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>英文正文（Markdown）</span>
            <textarea
              className={`${styles.textarea} ${styles.bodyArea}`}
              value={fields.bodyEn ?? ''}
              onChange={(e) => update('bodyEn', e.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>标签</span>
            <input className={styles.input} value={tagsText} placeholder="AI, Coding agent" onChange={(e) => { setTagsText(e.target.value); setDirty(true); }} />
            <span className={styles.hint}>用逗号分隔</span>
          </label>

          <div className={styles.grid2}>
            <label className={styles.field}>
              <span className={styles.label}>视频地址</span>
              <input className={styles.input} value={fields.video ?? ''} placeholder="/notes/xxx.mp4 或外链" onChange={(e) => update('video', e.target.value)} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>视频封面</span>
              <input className={styles.input} value={fields.poster ?? ''} placeholder="/notes/xxx.jpg" onChange={(e) => update('poster', e.target.value)} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>附件链接</span>
              <input className={styles.input} value={fields.link ?? ''} placeholder="https://…" onChange={(e) => update('link', e.target.value)} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>中文附件名称</span>
              <input className={styles.input} value={fields.linkTitle ?? ''} placeholder="Codex Agents.md · 2026.11.04" onChange={(e) => update('linkTitle', e.target.value)} />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>英文附件名称（可选）</span>
              <input className={styles.input} value={fields.linkTitleEn ?? ''} onChange={(e) => update('linkTitleEn', e.target.value)} />
            </label>
          </div>
        </div>

        <aside className={styles.preview}>
          <div className={styles.previewLabel}>预览</div>
          <div className={styles.previewMeta}>{fields.date}{tags.length > 0 && ` · ${tags.join(' · ')}`}</div>
          {fields.title && <h2 style={{ fontSize: '1.125rem', color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>{fields.title}</h2>}
          <div className={styles.previewBody}>
            {fields.body.trim() ? <MarkdownRenderer content={fields.body} /> : <p className={styles.muted}>正文预览会显示在这里</p>}
          </div>
          {fields.bodyEn?.trim() && (
            <div className={styles.previewBody} lang="en">
              <div className={styles.previewLabel}>English</div>
              {fields.titleEn && <h2>{fields.titleEn}</h2>}
              <MarkdownRenderer content={fields.bodyEn} />
            </div>
          )}
          {fields.video && (
            <video className={styles.previewMedia} src={fields.video} poster={fields.poster} controls playsInline preload="none" />
          )}
          {fields.link && (
            <div className={styles.card} style={{ marginTop: '0.75rem', marginBottom: 0, padding: '0.625rem 0.875rem', fontSize: '0.875rem' }}>
              附件 · {fields.linkTitle || fields.link}
            </div>
          )}
        </aside>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnPrimary} disabled={pending} onClick={() => save(false)}>
          {pending ? '保存中…' : isNew || fields.draft ? '发布' : '更新'}
        </button>
        <button className={styles.btn} disabled={pending} onClick={() => save(true)}>
          {!isNew && !fields.draft ? '撤回为草稿' : '存为草稿'}
        </button>
        {dirty && <span className={styles.muted}>有未保存的修改</span>}
        <span className={styles.spacer} />
        {!isNew && (
          <button className={styles.btnDanger} disabled={pending} onClick={remove}>删除</button>
        )}
      </div>
    </div>
  );
}
