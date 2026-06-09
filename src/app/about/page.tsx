'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/Layout';
import styles from './page.module.css';

const translations = {
  zh: {
    role: '投研 Agent | Agent Research | Agent Engineering',
    description: '开发，思考，投资，睡觉。',
    intro: [
      '专注于投研 Agent、Agent Research 与 Agent Engineering，关注 AI Agent 如何在复杂信息环境中完成研究、推理与决策支持。',
      '目前在阿里云智能从事后端应用开发与 Agent 系统建设。长期以投资研究为核心场景，构建面向个人投资者与复杂宏观问题的智能投研系统。我的项目包括 Uteki、Shinkai 与 Suimyaku：Uteki 面向公司研究与投资决策，Shinkai 从宏观主题出发探索产业链与优质公司发现，Suimyaku 关注世界秩序、宏观变化与资金分配逻辑。',
    ],
    copyEmail: '复制邮箱',
    emailCopied: '已复制!',
    location: '杭州',
    toggleBtn: '个人经历',
    toggleClose: '收起',
    portfolio: '作品集',
    experience: '个人经历',
    projects: '个人项目',
    skills: '技能兴趣',
    present: '至今',
  },
  en: {
    role: 'Investment Research Agent | Agent Research | Agent Engineering',
    description: 'Dev, Think, Invest, Sleep.',
    intro: [
      'Focused on Investment Research Agents, Agent Research, and Agent Engineering, with an interest in how AI Agents can conduct research, reasoning, and decision support in complex information environments.',
      'Currently at Alibaba Cloud Intelligence, working on backend application development and Agent systems. I use investment research as my core scenario, building intelligent research systems for individual investors and complex macro questions. My projects include Uteki, Shinkai, and Suimyaku: Uteki focuses on company research and investment decisions, Shinkai starts from macro themes to explore industry chains and high-quality companies, and Suimyaku studies world order, macro shifts, and capital allocation.',
    ],
    copyEmail: 'Copy Email',
    emailCopied: 'Copied!',
    location: 'Hangzhou',
    toggleBtn: 'Background',
    toggleClose: 'Close',
    portfolio: 'Portfolio',
    experience: 'Background',
    projects: 'Projects',
    skills: 'Skills & Interests',
    present: 'Present',
  }
};

export default function AboutPage() {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { language } = useLanguage();
  const email = 'rain1104@foxmail.com';
  const t = translations[language];

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className={styles.container}>
      {/* GitHub Profile 两栏布局 → 展开后变紧凑居中头部 */}
      <div className={`${styles.profileLayout} ${expanded ? styles.profileExpanded : ''}`}>
        {/* 左侧边栏 — 头像 + 信息 */}
        <aside className={styles.sidebar}>
          <Image
            src="/images/head.jpg"
            alt="Rain"
            width={180}
            height={180}
            className={styles.avatar}
          />
          <h1 className={styles.name}>陈小宇 / Rain</h1>
          <p className={styles.role}>{t.role}</p>
          <p className={styles.description}>{t.description}</p>

          <div className={styles.sidebarLinks}>
            <div className={styles.sidebarLinkItem}>
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072zm-1.06 1.06a3.5 3.5 0 00-4.95 0L8 7.05l2.474-2.525a3.5 3.5 0 000-4.95z"/>
                <path d="M8 9a2 2 0 100-4 2 2 0 000 4z"/>
              </svg>
              <span>{t.location}</span>
            </div>
            <button onClick={handleCopyEmail} className={styles.sidebarLinkItem}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>{copied ? t.emailCopied : email}</span>
            </button>
            <a
              href="https://github.com/Rain1601"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sidebarLinkItem}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </aside>

        {/* 右侧内容区 — 自我介绍 */}
        <main className={styles.content}>
          <div className={styles.introText}>
            {t.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className={styles.toggleWrap}>
            <button className={`${styles.toggleBtn} ${expanded ? styles.toggleBtnActive : ''}`} onClick={() => setExpanded(!expanded)}>
              <span>{expanded ? t.toggleClose : t.toggleBtn}</span>
              <svg
                className={`${styles.toggleArrow} ${expanded ? styles.toggleArrowOpen : ''}`}
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {!expanded && (
              <Link href="/product" className={styles.navBtn}>
                <span>{t.portfolio}</span>
                <svg className={styles.navArrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            )}
          </div>
        </main>
      </div>

      {/* Resume — expandable (full width below) */}
      <div className={`${styles.resumeWrapper} ${expanded ? styles.resumeOpen : ''}`}>
        <div className={styles.resume}>

          {/* 教育 & 工作合并为「个人经历」单一 section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.experience}</h2>
            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <h3 className={styles.entryTitle}>
                  {language === 'zh' ? '西安交通大学' : "Xi'an Jiaotong University"}
                </h3>
                <span className={styles.entryDate}>2020.09 - 2023.07</span>
              </div>
              <p className={styles.entrySubtitle}>
                {language === 'zh' ? '软件工程 硕士 | 电信学部' : 'M.S. Software Engineering'}
              </p>
            </div>
            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <h3 className={styles.entryTitle}>
                  {language === 'zh' ? '西安交通大学' : "Xi'an Jiaotong University"}
                </h3>
                <span className={styles.entryDate}>2016.09 - 2020.06</span>
              </div>
              <p className={styles.entrySubtitle}>
                {language === 'zh' ? '软件工程 本科 | 软件学院' : 'B.S. Software Engineering'}
              </p>
            </div>
            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <h3 className={styles.entryTitle}>
                  {language === 'zh' ? '阿里云智能' : 'Alibaba Cloud Intelligence'}
                </h3>
                <span className={styles.entryDate}>2023.07 - {t.present}</span>
              </div>
              <p className={styles.entrySubtitle}>
                {language === 'zh' ? '营销数字人' : 'Digital Sales'}
              </p>
            </div>
          </section>

          {/* Personal Projects */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.projects}</h2>
            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <h3 className={styles.entryTitle}>
                  {language === 'zh' ? '雨滴 Uteki - 智能投资交易平台' : 'Uteki - Intelligent Investment Platform'}
                </h3>
                <span className={styles.entryDate}>2025.05 - {t.present}</span>
              </div>
              <p className={styles.entryDesc}>
                {language === 'zh'
                  ? '基于 Multi-Agent 架构的智能投研与交易分析系统，通过多 Agent 协同与可追溯推理，模拟专业投资机构的决策流程'
                  : 'Multi-Agent intelligent investment research system simulating professional decision-making with traceable reasoning'}
              </p>
              <ul className={styles.entryList}>
                <li>{language === 'zh'
                  ? '设计 Lead Agent + 专业 Sub-Agent 分层体系，通过结构化上下文（中间结论 + 置信度 + 约束条件）在 Agent 间传递状态'
                  : 'Lead Agent + specialized Sub-Agent hierarchy with structured context passing (conclusions + confidence + constraints)'}</li>
                <li>{language === 'zh'
                  ? '构建基于 ReAct 的决策闭环，通过 Tool Registry 实现 20+ 数据工具的统一编排与按需调用'
                  : 'ReAct-based decision loop with Tool Registry for 20+ data tools orchestration'}</li>
                <li>{language === 'zh'
                  ? '支持 S&P 500 成分股自动化批量分析与投资报告生成，构建推理过程的记录、回放与评估体系'
                  : 'Automated S&P 500 analysis with investment report generation and reasoning trace system'}</li>
              </ul>
            </div>
          </section>

          {/* Skills */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.skills}</h2>
            <div className={styles.skillTags}>
              <span className={styles.skillTag}>Multi-Agent</span>
              <span className={styles.skillTag}>ReAct</span>
              <span className={styles.skillTag}>Tool Calling</span>
              <span className={styles.skillTag}>Context Engineering</span>
              <span className={styles.skillTag}>Java</span>
              <span className={styles.skillTag}>Python</span>
              <span className={styles.skillTag}>TypeScript</span>
              <span className={styles.skillTag}>Next.js</span>
              <span className={styles.skillTag}>vLLM</span>
              <span className={styles.skillTag}>RAG</span>
            </div>
            <p className={styles.skillDesc}>
              {language === 'zh'
                ? '关注 Multi-Agent / ReAct / Tool Calling / Context Engineering 等 AI 前沿方向，持续跟进 AI 前沿模型与工程实践，并将其应用于实时语音对话与企业级 Agent 系统。'
                : 'Focused on Multi-Agent / ReAct / Tool Calling / Context Engineering, applying cutting-edge AI practices to real-time voice dialogue and enterprise Agent systems.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
