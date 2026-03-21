'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/Layout';
import styles from './page.module.css';

const translations = {
  zh: {
    role: '后端应用开发 | Agent 开发',
    description: '开发，思考，投资，睡觉。',
    intro: '目前在阿里云智能从事后端应用开发与 Agent 系统建设，专注于实时语音 Agent、Multi-Agent 架构与 Context Engineering 等方向。工作之余，我在构建一个面向个人投资者的智能投研平台 Uteki，探索 AI Agent 在交易决策中的应用。',
    copyEmail: '复制邮箱',
    emailCopied: '已复制!',
    location: '杭州',
    toggleBtn: '工作经历',
    toggleClose: '收起',
    articles: '我的文章',
    portfolio: '作品集',
    education: '教育经历',
    experience: '工作经历',
    projects: '个人项目',
    skills: '技能兴趣',
    present: '至今',
  },
  en: {
    role: 'Backend Dev | Agent Dev',
    description: 'Dev, Think, Invest, Sleep.',
    intro: 'Currently at Alibaba Cloud Intelligence, working on backend development and Agent systems — focused on real-time voice Agents, Multi-Agent architecture, and Context Engineering. Outside of work, I\'m building Uteki, an intelligent investment platform for individual investors, exploring AI Agent applications in trading decisions.',
    copyEmail: 'Copy Email',
    emailCopied: 'Copied!',
    location: 'Hangzhou',
    toggleBtn: 'Experience',
    toggleClose: 'Close',
    articles: 'Articles',
    portfolio: 'Portfolio',
    education: 'Education',
    experience: 'Experience',
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
            width={260}
            height={260}
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
          <p className={styles.introText}>{t.intro}</p>

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
            <Link href="/articles" className={styles.navBtn}>
              <span>{t.articles}</span>
              <svg className={styles.navArrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
            <Link href="/product" className={styles.navBtn}>
              <span>{t.portfolio}</span>
              <svg className={styles.navArrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </main>
      </div>

      {/* Resume — expandable (full width below) */}
      <div className={`${styles.resumeWrapper} ${expanded ? styles.resumeOpen : ''}`}>
        <div className={styles.resume}>

          {/* Education */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.education}</h2>
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
          </section>

          {/* Work Experience */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t.experience}</h2>
            <div className={styles.entry}>
              <div className={styles.entryHeader}>
                <h3 className={styles.entryTitle}>
                  {language === 'zh' ? '阿里云智能' : 'Alibaba Cloud Intelligence'}
                </h3>
                <span className={styles.entryDate}>2023.07 - {t.present}</span>
              </div>

              <div className={styles.subEntry}>
                <div className={styles.subEntryHeader}>
                  <span className={styles.subEntryTitle}>
                    {language === 'zh' ? '智能外呼 | 营销数字人' : 'AI Outbound Call | Digital Sales'}
                  </span>
                  <span className={styles.subEntryDate}>2024.11 -</span>
                </div>
                <p className={styles.entryDesc}>
                  {language === 'zh'
                    ? '基于通义大模型与语音实时识别合成能力，结合销售语料训练，向企业提供 7x24 小时自动化语音交互与销售服务'
                    : 'AI-powered outbound call product providing 7x24 automated voice interaction and sales services based on Tongyi LLM'}
                </p>
                <ul className={styles.entryList}>
                  <li>{language === 'zh'
                    ? '构建高并发实时语音交互能力，支撑日均 3.6 万+外呼，峰值 200 QPM，通过 vLLM + LLM Cache 将端到端延迟控制在 1.2~1.5s'
                    : 'Built high-concurrency real-time voice interaction, supporting 36K+ daily calls, 200 QPM peak, end-to-end latency 1.2~1.5s via vLLM + LLM Cache'}</li>
                  <li>{language === 'zh'
                    ? '基于 SFT 微调与高质量对话数据优化模型表达能力，结合提示词工程、函数调用与 RAG 构建对话策略体系'
                    : 'Optimized model expression via SFT fine-tuning, combined with prompt engineering, function calling, and RAG for dialogue strategy'}</li>
                  <li>{language === 'zh'
                    ? '构建"双VAD + 双路ASR"语音理解体系并引入降噪模型 Omni3，解决专有名词识别、环境噪音等问题'
                    : 'Built "Dual VAD + Dual ASR" voice understanding system with Omni3 denoising model for robust speech recognition'}</li>
                  <li>{language === 'zh'
                    ? '推动外呼系统由单一流程向可配置 Agent 平台升级，支持基于目标快速构建 Prompt、在线调试与版本管理'
                    : 'Drove upgrade from single-flow to configurable Agent platform with goal-based Prompt building and version management'}</li>
                </ul>
              </div>

              <div className={styles.subEntry}>
                <div className={styles.subEntryHeader}>
                  <span className={styles.subEntryTitle}>
                    {language === 'zh' ? '云栖大会 | 应用开发 & PM' : 'Apsara Conference | App Dev & PM'}
                  </span>
                </div>
                <ul className={styles.entryList}>
                  <li>{language === 'zh'
                    ? '主导核心系统开发与稳定性建设，涵盖运营后台、票证系统、展商系统、云上峰会与内容审核等模块'
                    : 'Led core system development including operations, ticketing, exhibitor, cloud summit and content review modules'}</li>
                  <li>{language === 'zh'
                    ? '担任 2024/2025 年技术 PM，协调多团队推进需求交付与变更管理，系统可用性 99.9%+'
                    : '2024/2025 Tech PM, coordinating multi-team delivery, 99.9%+ system availability'}</li>
                  <li>{language === 'zh'
                    ? '主导内容审核系统智能化升级，累计处理 800 万文件，自动化覆盖 95%，提升审核人效 70%'
                    : 'Led content review system AI upgrade, processed 8M files, 95% automation coverage, 70% efficiency improvement'}</li>
                </ul>
              </div>

              <div className={styles.subEntry}>
                <div className={styles.subEntryHeader}>
                  <span className={styles.subEntryTitle}>
                    {language === 'zh' ? '线索市场 | 应用开发' : 'Lead Market | App Dev'}
                  </span>
                  <span className={styles.subEntryDate}>2023.07 -</span>
                </div>
                <ul className={styles.entryList}>
                  <li>{language === 'zh'
                    ? '负责规则中心模块迁移开发与市场系统迭代，构建客户从报名到线索的自动化转化与分发链路'
                    : 'Led rule center migration and market system iteration, built automated lead conversion pipeline'}</li>
                </ul>
              </div>
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
