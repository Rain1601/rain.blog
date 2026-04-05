export interface ProductHighlight {
  title: { zh: string; en: string };
  desc: { zh: string; en: string };
}

export interface ProductItem {
  id: string;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  coverGradient: string;
  /** Colors for animated gradient blobs [blob1, blob2, blob3, blob4] */
  blobColors: string[];
  /** Background color behind the blobs */
  blobBg: string;
  techStack: string[];
  link?: string;
  github?: string;
  /** Detail page highlights */
  highlights?: ProductHighlight[];
}

export const productData: ProductItem[] = [
  {
    id: 'uteki',
    title: {
      zh: 'Uteki — AI 量化交易平台',
      en: 'Uteki — AI Quantitative Trading',
    },
    description: {
      zh: '开源 AI 量化交易平台，7-Gate Agentic Pipeline 系统化公司分析，多数据库降级架构保障弹性，统一 LLM 适配器支持 7 家模型供应商。结构化编排保证质量可预测，ReAct 在每个节点保留灵活性。',
      en: 'Open-source AI quantitative trading platform. 7-Gate Agentic Pipeline for systematic company analysis, multi-database degradation architecture for resilience, unified LLM adapter supporting 7 model providers. Structured orchestration ensures predictable quality while ReAct preserves flexibility at each node.',
    },
    coverGradient: 'linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #112d4e 100%)',
    blobColors: ['#3b82f6', '#6366f1', '#0ea5e9', '#8b5cf6'],
    blobBg: '#070e1a',
    techStack: ['FastAPI', 'React', 'Flutter', 'PostgreSQL', 'ClickHouse', 'Qdrant'],
    github: 'https://github.com/Rain1601/uteki.open',
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
    id: 'sumi',
    title: {
      zh: 'Sumi — 音频数字人',
      en: 'Sumi — Audio Digital Human',
    },
    description: {
      zh: '基于 AI 的实时语音交互数字人，支持自然对话、情感识别与多语言语音合成，打造拟人化的声音交互体验。',
      en: 'AI-powered real-time voice interaction digital human with natural conversation, emotion recognition, and multilingual speech synthesis for human-like voice experiences.',
    },
    coverGradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #4a1942 100%)',
    blobColors: ['#c084fc', '#f472b6', '#a78bfa', '#fb923c'],
    blobBg: '#120a1e',
    techStack: ['Coming Soon'],
  },
  {
    id: 'coming-soon',
    title: {
      zh: '更多项目开发中…',
      en: 'More Projects Coming…',
    },
    description: {
      zh: '持续探索新的技术方向，更多作品即将上线。',
      en: 'Continuously exploring new tech directions. More works coming soon.',
    },
    coverGradient: 'linear-gradient(135deg, #2d2d3a 0%, #3d3548 50%, #4a3f5c 100%)',
    blobColors: ['#64748b', '#94a3b8', '#475569', '#78716c'],
    blobBg: '#1a1825',
    techStack: ['Coming Soon'],
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
