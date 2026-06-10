export interface ProductHighlight {
  title: { zh: string; en: string };
  desc: { zh: string; en: string };
}

export interface ProductDemo {
  url: string;
  title: { zh: string; en: string };
  desc: { zh: string; en: string };
}

export interface ProductArchitecture {
  title: { zh: string; en: string };
  desc: { zh: string; en: string };
  stages: Array<{
    label: string;
    title: { zh: string; en: string };
    desc: { zh: string; en: string };
  }>;
  capabilities: Array<{
    title: { zh: string; en: string };
    items: { zh: string[]; en: string[] };
  }>;
}

/** A single utility listed inside a "tools" product card */
export interface ProductTool {
  id: string;
  name: { zh: string; en: string };
  desc: { zh: string; en: string };
  /** Primary external link (download / open / try) */
  link?: string;
  /** Label for the primary link, defaults to "Open / 打开" if absent */
  linkLabel?: { zh: string; en: string };
  github?: string;
}

export interface ProductItem {
  id: string;
  title: { zh: string; en: string };
  /** Short positioning sentence shown directly under the title in hero center */
  tagline?: { zh: string; en: string };
  description: { zh: string; en: string };
  coverGradient: string;
  /** Colors for animated gradient blobs [blob1, blob2, blob3, blob4] */
  blobColors: string[];
  /** Background color behind the blobs */
  blobBg: string;
  techStack: string[];
  link?: string;
  github?: string;
  /** Logo SVG path */
  logo?: string;
  /** Demo video URL (YouTube, Bilibili, or direct mp4) */
  demoVideo?: string;
  /** Interactive web demo URL */
  interactiveDemo?: ProductDemo;
  /** Visual architecture section */
  architecture?: ProductArchitecture;
  /** Detail page highlights */
  highlights?: ProductHighlight[];
  /** When present, this card renders a tools grid instead of a standard project hero */
  tools?: ProductTool[];
}

export const productData: ProductItem[] = [
  {
    id: 'uteki',
    title: {
      zh: 'Uteki 雨滴 — 投研 Agent',
      en: 'Uteki — Investment Research Agent',
    },
    tagline: {
      zh: '在标普 500 与纳斯达克里持续筛出值得长期持有的优质公司。',
      en: 'Continuously surfaces high-quality companies worth holding from the S&P 500 and Nasdaq.',
    },
    description: {
      zh: '开源 AI 量化交易平台，7-Gate Agentic Pipeline 系统化公司分析，多数据库降级架构保障弹性，统一 LLM 适配器支持 7 家模型供应商。结构化编排保证质量可预测，ReAct 在每个节点保留灵活性。',
      en: 'Open-source AI quantitative trading platform. 7-Gate Agentic Pipeline for systematic company analysis, multi-database degradation architecture for resilience, unified LLM adapter supporting 7 model providers. Structured orchestration ensures predictable quality while ReAct preserves flexibility at each node.',
    },
    coverGradient: 'linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #112d4e 100%)',
    blobColors: ['#3b82f6', '#6366f1', '#0ea5e9', '#8b5cf6'],
    blobBg: '#070e1a',
    techStack: ['FastAPI', 'React', 'Flutter', 'PostgreSQL', 'ClickHouse', 'Qdrant'],
    link: 'https://utekiapp.vercel.app/dashboard',
    github: 'https://github.com/Rain1601/uteki.open',
    logo: '/images/logo-uteki.svg',
    interactiveDemo: {
      url: 'https://utekiapp.vercel.app/dashboard',
      title: {
        zh: '交互式产品 Demo',
        en: 'Interactive Product Demo',
      },
      desc: {
        zh: '嵌入 Uteki Web 的预录流程回放，直接展示交易日报、宏观曲面、新闻时间线、智能体助理与公司研究台等核心页面。',
        en: 'Embedded Uteki Web replay showing the trading brief, macro surface, news timeline, agent assistant, and company research workspace.',
      },
    },
    architecture: {
      title: {
        zh: 'Agent 如何持续运行',
        en: 'How the Agent Keeps Running',
      },
      desc: {
        zh: 'Uteki 的重点不是生成一份报告，而是把投研任务变成可追踪、可回放、可评测的运行过程。',
        en: 'Uteki is not just a report generator. It turns investment research into a traceable, replayable, and evaluable runtime process.',
      },
      stages: [
        {
          label: '01',
          title: { zh: '任务拆解', en: 'Task Decomposition' },
          desc: {
            zh: 'Lead Agent 将投资问题拆成公司、行业、估值、风险和反证任务。',
            en: 'The Lead Agent decomposes an investment question into company, industry, valuation, risk, and counter-evidence tasks.',
          },
        },
        {
          label: '02',
          title: { zh: '工具执行', en: 'Tool Execution' },
          desc: {
            zh: 'Sub-Agents 调用行情、财务、新闻、向量检索和研究资料工具收集证据。',
            en: 'Sub-agents call market, financial, news, vector search, and research tools to collect evidence.',
          },
        },
        {
          label: '03',
          title: { zh: 'Trace 汇总', en: 'Trace Aggregation' },
          desc: {
            zh: '每一步保留输入、工具调用、输出、置信度、引用和错误信息。',
            en: 'Each step records inputs, tool calls, outputs, confidence, citations, and errors.',
          },
        },
        {
          label: '04',
          title: { zh: '评测与回放', en: 'Evaluation & Replay' },
          desc: {
            zh: '通过任务集、指标、人工反馈和历史回放持续改进 Agent 表现。',
            en: 'Task sets, metrics, human feedback, and replay are used to improve agent behavior over time.',
          },
        },
      ],
      capabilities: [
        {
          title: { zh: '可观测', en: 'Observable' },
          items: {
            zh: ['Step Trace', 'Tool Call Log', 'Latency / Cost', 'Failure Reason'],
            en: ['Step Trace', 'Tool Call Log', 'Latency / Cost', 'Failure Reason'],
          },
        },
        {
          title: { zh: '可评测', en: 'Evaluable' },
          items: {
            zh: ['Benchmark Tasks', 'Evidence Quality', 'Decision Consistency', 'Human Review'],
            en: ['Benchmark Tasks', 'Evidence Quality', 'Decision Consistency', 'Human Review'],
          },
        },
        {
          title: { zh: '可持续运行', en: 'Continuous' },
          items: {
            zh: ['Scheduled Runs', 'Retry / Degradation', 'Report Versioning', 'State Replay'],
            en: ['Scheduled Runs', 'Retry / Degradation', 'Report Versioning', 'State Replay'],
          },
        },
      ],
    },
    highlights: [
      {
        title: { zh: '7-Gate Agentic Pipeline', en: '7-Gate Agentic Pipeline' },
        desc: {
          zh: '业务解析 → 成长质量 → 护城河评估 → 管理层评估 → 逆向检验 → 估值 → 综合裁决。每个 Gate 独立执行 ReAct 循环，Gate 3 和 Gate 5 设有 Reflection 检查点检测矛盾。',
          en: 'Business → Growth → Moat → Management → Reverse Test → Valuation → Verdict. Each gate runs an independent ReAct loop. Gates 3 & 5 feature reflection checkpoints for contradiction detection.',
        },
      },
      {
        title: { zh: '多数据库降级架构', en: 'Multi-DB Degradation' },
        desc: {
          zh: 'PostgreSQL（事务）+ ClickHouse（亿级时序分析）+ Qdrant（向量）+ Redis（缓存）+ MinIO（对象存储）。三层分级：Critical → Important → Optional，ClickHouse 不可用时自动降级到 PostgreSQL。',
          en: 'PostgreSQL + ClickHouse (100M+ time-series) + Qdrant (vectors) + Redis (cache) + MinIO (objects). Three-tier graceful degradation: Critical → Important → Optional.',
        },
      },
      {
        title: { zh: '统一 LLM 适配器', en: 'Unified LLM Adapter' },
        desc: {
          zh: '一套接口适配 OpenAI、Claude、DeepSeek、Qwen、Gemini、MiniMax、Doubao 七家供应商。工具注册、上下文预算管理、流式输出，新增模型无需重构。',
          en: 'Single interface adapting 7 providers: OpenAI, Claude, DeepSeek, Qwen, Gemini, MiniMax, Doubao. Tool registry, context budget management, streaming output.',
        },
      },
      {
        title: { zh: '全栈全平台', en: 'Full-Stack Full-Platform' },
        desc: {
          zh: 'Python 后端（FastAPI）+ React 前端（13+ 页面）+ Flutter 移动端 + VitePress 文档站。162 个 Python 文件，领域驱动设计，六大业务域独立分层。',
          en: 'Python backend (FastAPI) + React frontend (13+ pages) + Flutter mobile + VitePress docs. 162 Python files, DDD architecture, 6 bounded contexts.',
        },
      },
    ],
  },
  {
    id: 'shinkai',
    title: {
      zh: 'Shinkai 深海 — 宏观投研',
      en: 'Shinkai — Macro Research',
    },
    tagline: {
      zh: '从宏观主题出发，沿产业链潜到深处，找出真正值得长期持有的优质公司。',
      en: 'From macro themes, descend through the supply chain to surface companies worth holding.',
    },
    description: {
      zh: '世界秩序、宏观变化、资金流向是水面 —— 问题不在表层，要往下沉。Shinkai 用 Agent 顺着产业链做深度研究，把宏观主题拆成可追踪的中观叙事和微观标的，每一层都保留证据与置信度。',
      en: 'World order, macro shifts, capital flows — these are the surface. The signal lives below. Shinkai uses agents to descend through supply chains, turning macro themes into traceable mid-scale narratives and bottom-up picks, preserving evidence and confidence at every layer.',
    },
    coverGradient: 'linear-gradient(135deg, #02060f 0%, #03090f 50%, #050d18 100%)',
    blobColors: ['#0a3a5c', '#155e75', '#0c4a6e', '#1e3a5f'],
    blobBg: '#02050c',
    techStack: ['Multi-Agent', 'ReAct', 'Context Engineering', 'GraphRAG', 'Python'],
    link: '/shinkai',
    github: 'https://github.com/Rain1601/shinkai',
  },
  {
    id: 'tools',
    title: {
      zh: '小工具',
      en: 'Small Tools',
    },
    tagline: {
      zh: '不是产品 —— 是给自己用的趁手家伙。',
      en: 'Not products — just tools I made for my own daily use.',
    },
    description: {
      zh: '在主线项目之外做的一些小东西。先取悦自己，能帮到你就更好。',
      en: 'Side utilities outside the main projects. Made to please myself first; happy if they help you too.',
    },
    coverGradient: 'linear-gradient(135deg, #1a1510 0%, #2d2418 50%, #3d3020 100%)',
    blobColors: ['#d97149', '#b9a37a', '#c89a6b', '#a87a4f'],
    blobBg: '#1a1510',
    techStack: [],
    tools: [
      {
        id: 'nemu',
        name: { zh: 'Nemu', en: 'Nemu' },
        desc: {
          zh: 'Mac 桌面任务清单，可把 TODO 分派给 Claude Agent 后台跑',
          en: 'Mac desktop task list — hands off TODOs to background Claude Agents',
        },
        link: 'https://github.com/Rain1601/Nemu/releases',
        linkLabel: { zh: '下载', en: 'Download' },
        github: 'https://github.com/Rain1601/Nemu',
      },
    ],
  },
];

export const sectionTitles = {
  zh: {
    title: '构建有意义的产品',
    subtitle: '每一个项目都是一次探索与表达',
  },
  en: {
    title: 'Building things\nthat matter.',
    subtitle: 'Each project is an exploration and expression.',
  },
};
