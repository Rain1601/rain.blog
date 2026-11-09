/**
 * 首页「个人介绍」面板的内容。
 * bio 是根据对话整理的占位稿，待本人重写；经历来自原「关于」页的简历信息。
 */

export interface Bi {
  zh: string;
  en: string;
}

export const INTRO = {
  bio: [
    {
      zh: '我在阿里云做后端与 Agent 系统，业余时间研究 Agent 本身：它如何循环、如何管理上下文、如何使用工具、如何从反馈里修正自己。',
      en: 'I work on backend and agent systems at Alibaba Cloud, and spend my own time studying agents themselves: how they loop, manage context, use tools, and correct course from feedback.',
    },
    {
      zh: '过去两年以投研为场景做 Uteki，慢慢发现自己真正关心的不是某个垂类，而是 Agent 如何工作。接下来想做一个通用方向的 Agent。',
      en: 'For two years I built Uteki around investment research, and realized what I care about is not one vertical but how agents work. Next, I want to build a general-purpose agent.',
    },
  ] as Bi[],

  now: [
    { title: { zh: 'Uteki 雨滴 — 投研 Agent', en: 'Uteki — Investment Research Agent' }, href: '/product' },
    { title: { zh: '一个通用方向的 Agent（筹备中）', en: 'A general-purpose agent (in the works)' } },
  ] as { title: Bi; href?: string }[],

  experience: [
    { title: { zh: '阿里云智能', en: 'Alibaba Cloud Intelligence' }, detail: { zh: '后端与 Agent 系统', en: 'Backend and agent systems' }, period: '2023.07 —' },
    { title: { zh: '西安交通大学', en: "Xi'an Jiaotong University" }, detail: { zh: '软件工程 硕士', en: 'M.S. Software Engineering' }, period: '2020 — 2023' },
    { title: { zh: '西安交通大学', en: "Xi'an Jiaotong University" }, detail: { zh: '软件工程 本科', en: 'B.S. Software Engineering' }, period: '2016 — 2020' },
  ] as { title: Bi; detail: Bi; period: string }[],
};
