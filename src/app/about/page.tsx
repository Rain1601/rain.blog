'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/components/Layout';
import styles from './page.module.css';

const translations = {
  zh: {
    role: '后端应用开发 | Agent 开发',
    description: '写代码，做交易，以及睡觉。',
    copyEmail: '复制邮箱',
    emailCopied: '已复制!',
    location: '杭州',
    toggleBtn: '工作经历',
    toggleClose: '收起',
    education: '教育经历',
    experience: '工作经历',
    projects: '个人项目',
    skills: '技能兴趣',
    present: '至今',
  },
  en: {
    role: 'Backend Dev | Agent Dev',
    description: 'Code, Trade And Sleep.',
    copyEmail: 'Copy Email',
    emailCopied: 'Copied!',
    location: 'Hangzhou',
    toggleBtn: 'Experience',
    toggleClose: 'Close',
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
      {/* Profile — transitions between centered and compact */}
      <div className={`${styles.profile} ${expanded ? styles.profileCompact : ''}`}>
        <div className={styles.profileMain}>
          <Image
            src="/images/head.jpg"
            alt="Rain"
            width={96}
            height={96}
            className={styles.avatar}
          />
          <div className={styles.profileText}>
            <h1 className={styles.name}>陈小宇 / Rain</h1>
            <p className={styles.role}>{t.role}</p>
            {/* Description — hidden when compact */}
            <p className={styles.description}>{t.description}</p>
          </div>
        </div>

        <div className={styles.profileLinks}>
          <button onClick={handleCopyEmail} className={styles.linkBtn}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span>{copied ? t.emailCopied : email}</span>
          </button>
          <a
            href="https://github.com/Rain1601"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkBtn}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Toggle Button */}
      <div className={styles.toggleWrap}>
        <button className={styles.toggleBtn} onClick={() => setExpanded(!expanded)}>
          <span>{expanded ? t.toggleClose : t.toggleBtn}</span>
          <svg
            className={`${styles.toggleArrow} ${expanded ? styles.toggleArrowOpen : ''}`}
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>

      {/* Resume — expandable */}
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
                    {language === 'zh' ? '智能外呼 | 应用开发' : 'AI Outbound Call | App Dev'}
                  </span>
                  <span className={styles.subEntryDate}>2024.11 -</span>
                </div>
                <ul className={styles.entryList}>
                  <li>{language === 'zh'
                    ? '主导智能外呼 AI 链路升级，设计新一代处理链路，覆盖 ASR、NLP 对话、TTS、外呼任务调度等关键环节'
                    : 'Led AI outbound call pipeline upgrade, covering ASR, NLP dialogue, TTS, and task scheduling'}</li>
                  <li>{language === 'zh'
                    ? '主导 Agent 平台化建设，升级为可配置、可扩展的 Agent 平台架构，支持多业务域同时通话'
                    : 'Led Agent platform development, upgrading to configurable and extensible architecture'}</li>
                  <li>{language === 'zh'
                    ? '系统稳定支撑 2,000+ 并发通话，首句响应延迟控制在极低水平'
                    : 'System stably supports 2,000+ concurrent calls with ultra-low first-response latency'}</li>
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
                    ? '负责核心系统开发与稳定性保障，覆盖运营后台、票证、展商、云上峰会与内容审核等系统'
                    : 'Led core system development, covering operations, ticketing, exhibitor, and content review systems'}</li>
                  <li>{language === 'zh'
                    ? '担任 2025 年技术 PM，协调多团队，活动期间系统可用性 99.9%+'
                    : '2025 Tech PM, coordinating multiple teams, 99.9%+ system availability during events'}</li>
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
                    ? '负责规则中心模块迁移开发，市场系统开发迭代，市场报名参会客户到线索的构建和下发'
                    : 'Led rule center module migration, market system development, and lead construction pipeline'}</li>
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
                  ? '基于 Multi-Agent 架构构建的面向个人投资者的智能投研与交易分析平台。'
                  : 'An intelligent investment research and trading platform built on Multi-Agent architecture.'}
              </p>
              <ul className={styles.entryList}>
                <li>{language === 'zh'
                  ? 'Lead Agent + 专业 Sub-Agent 分层体系，通过结构化 Context 在 Agent 间传递状态'
                  : 'Lead Agent + specialized Sub-Agent hierarchy with structured context passing'}</li>
                <li>{language === 'zh'
                  ? '基于 ReAct 实现决策闭环，构建 Tool Registry 支持 20+ 工具按需调用'
                  : 'ReAct-based decision loop with Tool Registry supporting 20+ tools on demand'}</li>
                <li>{language === 'zh'
                  ? '支持 S&P 500 成分股 500+ 标的自动化批量分析，输出结构化投资报告'
                  : 'Automated analysis of 500+ S&P 500 constituents with structured investment reports'}</li>
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
            </div>
            <p className={styles.skillDesc}>
              {language === 'zh'
                ? '关注 Multi-Agent / ReAct / Tool Calling / Context Engineering 等 AI 前沿方向，长期跟进 AI 一线产品与工程实践。'
                : 'Focused on Multi-Agent / ReAct / Tool Calling / Context Engineering and other cutting-edge AI directions.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
