/**
 * About 页的内容结构。线上内容存在内容仓库根目录的 about.json，
 * 后台 /admin/about 编辑后写回那里；读取失败或文件不存在时用这里的默认值。
 */

export interface Bilingual {
  zh: string;
  en: string;
}

export interface BilingualList {
  zh: string[];
  en: string[];
}

export interface AboutExperience {
  title: Bilingual;
  subtitle: Bilingual;
  start: string;
  /** 空字符串表示「至今」 */
  end: string;
}

export interface AboutProject {
  title: Bilingual;
  start: string;
  end: string;
  desc: Bilingual;
  bullets: BilingualList;
}

export interface AboutContent {
  name: string;
  email: string;
  github: string;
  location: Bilingual;
  role: Bilingual;
  description: Bilingual;
  intro: BilingualList;
  experience: AboutExperience[];
  projects: AboutProject[];
  skills: { tags: string[]; desc: Bilingual };
}

export const DEFAULT_ABOUT: AboutContent = {
  name: '陈小宇 / Rain',
  email: 'rain1104@foxmail.com',
  github: 'https://github.com/Rain1601',
  location: { zh: '杭州', en: 'Hangzhou' },
  role: {
    zh: '投研 Agent | Agent Research | Agent Engineering',
    en: 'Investment Research Agent | Agent Research | Agent Engineering',
  },
  description: { zh: '开发，思考，投资，睡觉。', en: 'Dev, Think, Invest, Sleep.' },
  intro: {
    zh: [
      '专注于投研 Agent、Agent Research 与 Agent Engineering，关注 AI Agent 如何在复杂信息环境中完成研究、推理与决策支持。',
      '目前在阿里云智能从事后端应用开发与 Agent 系统建设。长期以投资研究为核心场景，构建面向个人投资者与复杂宏观问题的智能投研系统。我的项目包括 Uteki、Shinkai 与 Suimyaku：Uteki 面向公司研究与投资决策，Shinkai 从宏观主题出发探索产业链与优质公司发现，Suimyaku 关注世界秩序、宏观变化与资金分配逻辑。',
    ],
    en: [
      'Focused on Investment Research Agents, Agent Research, and Agent Engineering, with an interest in how AI Agents can conduct research, reasoning, and decision support in complex information environments.',
      'Currently at Alibaba Cloud Intelligence, working on backend application development and Agent systems. I use investment research as my core scenario, building intelligent research systems for individual investors and complex macro questions. My projects include Uteki, Shinkai, and Suimyaku: Uteki focuses on company research and investment decisions, Shinkai starts from macro themes to explore industry chains and high-quality companies, and Suimyaku studies world order, macro shifts, and capital allocation.',
    ],
  },
  experience: [
    {
      title: { zh: '西安交通大学', en: "Xi'an Jiaotong University" },
      subtitle: { zh: '软件工程 硕士 | 电信学部', en: 'M.S. Software Engineering' },
      start: '2020.09',
      end: '2023.07',
    },
    {
      title: { zh: '西安交通大学', en: "Xi'an Jiaotong University" },
      subtitle: { zh: '软件工程 本科 | 软件学院', en: 'B.S. Software Engineering' },
      start: '2016.09',
      end: '2020.06',
    },
    {
      title: { zh: '阿里云智能', en: 'Alibaba Cloud Intelligence' },
      subtitle: { zh: '营销数字人', en: 'Digital Sales' },
      start: '2023.07',
      end: '',
    },
  ],
  projects: [
    {
      title: { zh: '雨滴 Uteki - 智能投资交易平台', en: 'Uteki - Intelligent Investment Platform' },
      start: '2025.05',
      end: '',
      desc: {
        zh: '基于 Multi-Agent 架构的智能投研与交易分析系统，通过多 Agent 协同与可追溯推理，模拟专业投资机构的决策流程',
        en: 'Multi-Agent intelligent investment research system simulating professional decision-making with traceable reasoning',
      },
      bullets: {
        zh: [
          '设计 Lead Agent + 专业 Sub-Agent 分层体系，通过结构化上下文（中间结论 + 置信度 + 约束条件）在 Agent 间传递状态',
          '构建基于 ReAct 的决策闭环，通过 Tool Registry 实现 20+ 数据工具的统一编排与按需调用',
          '支持 S&P 500 成分股自动化批量分析与投资报告生成，构建推理过程的记录、回放与评估体系',
        ],
        en: [
          'Lead Agent + specialized Sub-Agent hierarchy with structured context passing (conclusions + confidence + constraints)',
          'ReAct-based decision loop with Tool Registry for 20+ data tools orchestration',
          'Automated S&P 500 analysis with investment report generation and reasoning trace system',
        ],
      },
    },
  ],
  skills: {
    tags: ['Multi-Agent', 'ReAct', 'Tool Calling', 'Context Engineering', 'Java', 'Python', 'TypeScript', 'Next.js', 'vLLM', 'RAG'],
    desc: {
      zh: '关注 Multi-Agent / ReAct / Tool Calling / Context Engineering 等 AI 前沿方向，持续跟进 AI 前沿模型与工程实践，并将其应用于实时语音对话与企业级 Agent 系统。',
      en: 'Focused on Multi-Agent / ReAct / Tool Calling / Context Engineering, applying cutting-edge AI practices to real-time voice dialogue and enterprise Agent systems.',
    },
  },
};

const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
const bi = (v: unknown, fallback: Bilingual = { zh: '', en: '' }): Bilingual => {
  const o = (v ?? {}) as Partial<Bilingual>;
  return { zh: str(o.zh, fallback.zh), en: str(o.en, fallback.en) };
};
const list = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
const biList = (v: unknown, fallback: BilingualList = { zh: [], en: [] }): BilingualList => {
  const o = (v ?? {}) as Partial<BilingualList>;
  return { zh: o.zh ? list(o.zh) : fallback.zh, en: o.en ? list(o.en) : fallback.en };
};
const arr = (v: unknown): Record<string, unknown>[] => (Array.isArray(v) ? v.filter((x) => x && typeof x === 'object') : []);

/** 把 about.json（或后台提交的数据）规整成完整结构，缺的字段用默认值补 */
export function normalizeAbout(input: unknown): AboutContent {
  const o = (input ?? {}) as Record<string, unknown>;
  const d = DEFAULT_ABOUT;
  const skills = (o.skills ?? {}) as Record<string, unknown>;
  return {
    name: str(o.name, d.name),
    email: str(o.email, d.email),
    github: str(o.github, d.github),
    location: bi(o.location, d.location),
    role: bi(o.role, d.role),
    description: bi(o.description, d.description),
    intro: biList(o.intro, d.intro),
    experience: Array.isArray(o.experience)
      ? arr(o.experience).map((e) => ({
          title: bi(e.title),
          subtitle: bi(e.subtitle),
          start: str(e.start),
          end: str(e.end),
        }))
      : d.experience,
    projects: Array.isArray(o.projects)
      ? arr(o.projects).map((p) => ({
          title: bi(p.title),
          start: str(p.start),
          end: str(p.end),
          desc: bi(p.desc),
          bullets: biList(p.bullets),
        }))
      : d.projects,
    skills: {
      tags: Array.isArray(skills.tags) ? list(skills.tags) : d.skills.tags,
      desc: bi(skills.desc, d.skills.desc),
    },
  };
}
