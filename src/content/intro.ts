/**
 * 首页「个人介绍」面板的内容。
 */

export interface Bi {
  zh: string;
  en: string;
}

export const INTRO = {
  bio: [
    {
      zh: '我现在在字节跳动负责通用 Agent 开发，此前在阿里云负责智能外呼产品。我关心 Agent 如何工作：它如何循环、管理上下文、使用工具，以及如何从反馈里修正自己。',
      en: 'I develop general-purpose agents at ByteDance. Previously, I led work on an intelligent outbound calling product at Alibaba Cloud. I’m interested in how agents work: how they loop, manage context, use tools, and correct course from feedback.',
    },
    {
      zh: '过去两年以投研为场景做 Uteki，慢慢发现自己真正关心的不是某个垂类，而是 Agent 如何工作。',
      en: 'For two years I built Uteki around investment research, and realized what I care about is not one vertical but how agents work.',
    },
  ] as Bi[],

  now: [
    { title: { zh: 'Uteki 雨滴 — 投研 Agent', en: 'Uteki — Investment Research Agent' }, href: '/product' },
  ] as { title: Bi; href?: string }[],

  experience: [
    {
      title: { zh: '字节跳动', en: 'ByteDance' },
      detail: { zh: '通用 Agent 开发', en: 'General-purpose agent development' },
      period: { zh: '2026.07 — 至今', en: '2026.07 — Present' },
      logo: '/images/bytedance-brand.png',
    },
    {
      title: { zh: '阿里云', en: 'Alibaba Cloud' },
      detail: { zh: '智能外呼 · 睿呼宝', en: 'Intelligent outbound calling · Ruihubao' },
      period: { zh: '2023.07 — 2026.07', en: '2023.07 — 2026.07' },
      logo: '/images/aliyun-brand.png',
      href: 'https://www.aliyun.com/product/thirdsw/rcb',
    },
    { title: { zh: '西安交通大学', en: "Xi'an Jiaotong University" }, detail: { zh: '软件工程 硕士', en: 'M.S. Software Engineering' }, period: { zh: '2020 — 2023', en: '2020 — 2023' }, logo: '/images/xjtu-brand.png' },
    { title: { zh: '西安交通大学', en: "Xi'an Jiaotong University" }, detail: { zh: '软件工程 本科', en: 'B.S. Software Engineering' }, period: { zh: '2016 — 2020', en: '2016 — 2020' }, logo: '/images/xjtu-brand.png' },
  ] satisfies { title: Bi; detail: Bi; period: Bi; logo: string; href?: string }[],
};
