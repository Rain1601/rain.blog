'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/utils/github';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import TableOfContents from '@/components/TableOfContents';
import { useLanguage, useReadingMode, useSetArticleTranslation } from '@/components/Layout';
import styles from './page.module.css';

const translations = {
  zh: {
    back: '← 文章',
    published: '发布于',
    updated: '更新于',
    copyLink: '复制链接',
    copied: '已复制',
    viewOnGithub: 'GitHub',
    nextPost: '下一篇',
    source: '本文来源于',
    githubRepo: 'GitHub 仓库',
    contents: '本文目录',
    allArticles: '全部文章',
    comments: '文章批注',
    noComments: '本文暂无批注',
    showAll: '查看全部批注',
    collapse: '收起',
  },
  en: {
    back: '← Articles',
    published: 'Published',
    updated: 'Updated',
    copyLink: 'Copy link',
    copied: 'Copied',
    viewOnGithub: 'GitHub',
    nextPost: 'Next',
    source: 'Source:',
    githubRepo: 'GitHub Repository',
    contents: 'Contents',
    allArticles: 'All articles',
    comments: 'Article notes',
    noComments: 'No annotations for this article',
    showAll: 'Show all notes',
    collapse: 'Collapse',
  },
};

export interface PostIndexItem {
  id: string;
  title: string;
  year: string;
}

// 批注跟随：阅读线（视口高度的这个比例）经过哪段批注段落，就显示哪一条
const READING_LINE = 0.45;
const PANEL_TOP = 100;     // 与 .comments 的 top 一致
const PANEL_BOTTOM_GAP = 40;
const PEEK_DELAY_MS = 600; // 在灰色原文上停留这么久才展开全文

interface CommentPeek {
  text: string;
  top: number;
  right: number;
}

interface ArticleComment {
  id: string;
  text: string;
  excerpt: string;
}

export default function PostClient({
  post,
  index,
  nextPost,
  translation,
}: {
  post: BlogPost;
  index: PostIndexItem[];
  nextPost: PostIndexItem | null;
  translation: { id: string; language: 'en' | 'zh' } | null;
}) {
  const { language } = useLanguage();
  const readingMode = useReadingMode();
  const setArticleTranslation = useSetArticleTranslation();
  const t = translations[language];
  const articleRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [sidebarView, setSidebarView] = useState<'contents' | 'articles'>('contents');
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);
  const [wide, setWide] = useState(false);
  const [followOffset, setFollowOffset] = useState(0);
  const [peek, setPeek] = useState<CommentPeek | null>(null);
  const commentsRef = useRef<HTMLElement>(null);
  const followCardRef = useRef<HTMLLIElement>(null);
  const peekTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    setArticleTranslation(translation && post.language
      ? { sourceId: post.id, targetId: translation.id, sourceLanguage: post.language }
      : { sourceId: post.id, targetId: null });
    return () => setArticleTranslation(null);
  }, [post.id, post.language, translation, setArticleTranslation]);

  const postsByYear = useMemo(() => {
    const grouped: Record<string, PostIndexItem[]> = {};
    for (const item of index) (grouped[item.year] ??= []).push(item);
    return Object.keys(grouped).sort((a, b) => Number(b) - Number(a))
      .map((year) => ({ year, posts: grouped[year] }));
  }, [index]);

  useEffect(() => {
    const paragraphs = articleRef.current?.querySelectorAll<HTMLElement>('[data-rain-comment]');
    if (!paragraphs) return;
    const found = Array.from(paragraphs, (paragraph, index) => {
      const id = `article-comment-${index + 1}`;
      paragraph.id = id;
      return {
        id,
        text: paragraph.dataset.rainComment ?? '',
        excerpt: paragraph.textContent?.trim() ?? '',
      };
    });
    setComments(found);
    setActiveComment(found[0]?.id ?? null);
  }, [post.content]);

  // 宽屏才有右侧固定批注栏；窄屏批注排在文末，始终全部展示
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1200px)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const following = wide && !showAllComments && comments.length > 0;

  // 跟随模式：随滚动找到当前在读的批注段落，并把批注卡片对齐到该段落旁边（限制在视口内）
  useEffect(() => {
    if (!following) {
      setFollowOffset(0);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const paragraphs = comments
        .map((comment) => document.getElementById(comment.id))
        .filter((el): el is HTMLElement => !!el);
      if (paragraphs.length === 0) return;
      const line = window.innerHeight * READING_LINE;
      let current = paragraphs[0];
      for (const el of paragraphs) {
        if (el.getBoundingClientRect().top <= line) current = el;
      }
      setActiveComment(current.id);
      const panelHeight = commentsRef.current?.offsetHeight ?? 0;
      const cardTop = followCardRef.current?.offsetTop ?? 0;
      const maxTop = Math.max(PANEL_TOP, window.innerHeight - panelHeight - PANEL_BOTTOM_GAP);
      const wanted = current.getBoundingClientRect().top - cardTop;
      setFollowOffset(Math.min(maxTop, Math.max(PANEL_TOP, wanted)) - PANEL_TOP);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    // 换了一条批注后卡片高度会变，重新对齐
    const observer = new ResizeObserver(schedule);
    if (commentsRef.current) observer.observe(commentsRef.current);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer.disconnect();
    };
  }, [following, comments]);

  // 长时间停在灰色原文上：在批注栏左侧展开整段原文（只有被截断时才需要）
  const closePeek = () => {
    window.clearTimeout(peekTimerRef.current);
    setPeek(null);
  };

  const startPeek = (event: React.MouseEvent<HTMLElement>, text: string) => {
    const el = event.currentTarget;
    window.clearTimeout(peekTimerRef.current);
    peekTimerRef.current = window.setTimeout(() => {
      if (el.scrollHeight <= el.clientHeight + 1) return;
      const rect = el.getBoundingClientRect();
      setPeek({ text, top: rect.top, right: window.innerWidth - rect.left + 16 });
    }, PEEK_DELAY_MS);
  };

  useEffect(() => {
    if (!peek) return;
    window.addEventListener('scroll', closePeek, { passive: true });
    return () => window.removeEventListener('scroll', closePeek);
  }, [peek]);

  useEffect(() => () => window.clearTimeout(peekTimerRef.current), []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? dateString : date.toLocaleDateString(
      language === 'zh' ? 'zh-CN' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };

  const onArticleClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('a, button')) return;
    const paragraph = target.closest<HTMLElement>('[data-rain-comment]');
    if (paragraph) setActiveComment(paragraph.id);
  };

  const goToComment = (id: string) => {
    setActiveComment(id);
    setShowAllComments(false);
    closePeek();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={`${styles.container} ${readingMode ? styles.readingMode : ''}`}>
      <nav className={styles.nav}>
        <Link href="/articles" className={styles.backLink}>{t.back}</Link>
      </nav>

      {index.length > 0 && (
        <>
          <div className={styles.sidebarSwitch} role="group" aria-label={language === 'zh' ? '左侧目录' : 'Left index'}>
            <button type="button" className={sidebarView === 'contents' ? styles.sidebarSwitchActive : ''} onClick={() => setSidebarView('contents')} aria-pressed={sidebarView === 'contents'}>{t.contents}</button>
            <button type="button" className={sidebarView === 'articles' ? styles.sidebarSwitchActive : ''} onClick={() => setSidebarView('articles')} aria-pressed={sidebarView === 'articles'}>{t.allArticles}</button>
          </div>
          <aside className={`${styles.sidebar} ${sidebarView === 'articles' ? '' : styles.sidebarHidden}`} aria-label={t.allArticles}>
              <nav className={styles.sidebarNav}>
                {postsByYear.map(({ year, posts: yearPosts }) => (
                  <div key={year} className={styles.sidebarGroup}>
                    <div className={styles.sidebarYearLabel}>
                      <span>{year}</span>
                      <span className={styles.sidebarCount}>{yearPosts.length}</span>
                    </div>
                    <ul className={styles.sidebarList}>
                      {yearPosts.map((item) => (
                        <li key={item.id} className={styles.sidebarItem}>
                          <Link href={`/blog/${item.id}`} className={`${styles.sidebarLink} ${item.id === post.id ? styles.sidebarLinkActive : ''}`} title={item.title}>
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
          </aside>
        </>
      )}

      <header className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <span>{t.published} {formatDate(post.date)}</span>
          {post.updated && <><span className={styles.divider}>/</span><span>{t.updated} {formatDate(post.updated)}</span></>}
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.copyButton} onClick={handleCopyLink}>{copied ? `✓ ${t.copied}` : t.copyLink}</button>
          <a href={post.url} target="_blank" rel="noopener noreferrer" className={styles.githubLink}>{t.viewOnGithub}</a>
        </div>
      </header>

      <article className={styles.content} ref={articleRef} onClick={onArticleClick}>
        <MarkdownRenderer content={post.content} />
      </article>

      <TableOfContents articleRef={articleRef} visible={sidebarView === 'contents'} readingMode={readingMode} />

      <aside
        ref={commentsRef}
        className={`${styles.comments} ${following ? styles.commentsFollow : ''}`}
        style={following ? { transform: `translateY(${followOffset}px)` } : undefined}
        aria-label={t.comments}
      >
        <div className={styles.commentsHead}>
          <h2 className={styles.commentsTitle}>{t.comments}</h2>
          {wide && comments.length > 0 && (
            <button
              type="button"
              className={styles.commentsCount}
              onClick={() => { closePeek(); setShowAllComments((v) => !v); }}
              aria-expanded={showAllComments}
              title={showAllComments ? t.collapse : t.showAll}
            >
              {showAllComments
                ? t.collapse
                : `${Math.max(1, comments.findIndex((c) => c.id === activeComment) + 1)} / ${comments.length}`}
            </button>
          )}
        </div>
        {comments.length === 0 ? (
          <p className={styles.noComments}>{t.noComments}</p>
        ) : (
          <ol className={styles.commentList}>
            {comments.map((comment, index) => {
              if (following && comment.id !== (activeComment ?? comments[0].id)) return null;
              return (
                <li key={comment.id} ref={following ? followCardRef : undefined}>
                  <button type="button" className={`${styles.commentButton} ${activeComment === comment.id ? styles.commentActive : ''}`} onClick={() => goToComment(comment.id)}>
                    <span className={styles.commentNumber}>{String(index + 1).padStart(2, '0')}</span>
                    <span
                      className={styles.commentExcerpt}
                      onMouseEnter={(event) => startPeek(event, comment.excerpt)}
                      onMouseLeave={closePeek}
                    >
                      {comment.excerpt}
                    </span>
                    <span className={styles.commentText}>{comment.text}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </aside>

      {peek && (
        <div className={styles.commentPeek} role="tooltip" style={{ top: peek.top, right: peek.right }}>
          {peek.text}
        </div>
      )}

      <footer className={styles.footer}>
        <Link href="/articles" className={styles.backButton}>{t.back}</Link>
        {nextPost && <Link href={`/blog/${nextPost.id}`} className={styles.githubButton}>{t.nextPost}: {nextPost.title} →</Link>}
      </footer>

      <div className={styles.bottomInfo}>
        <p>{t.source} <a href="https://github.com/Rain1601/rain.blog.repo" target="_blank" rel="noopener noreferrer" className={styles.repoLink}>{t.githubRepo}</a></p>
      </div>
    </div>
  );
}
