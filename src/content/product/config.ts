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
  /** Logo SVG path */
  logo?: string;
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
    logo: '/images/logo-uteki.svg',
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
      zh: 'Sumi — 实时语音 AI Agent',
      en: 'Sumi — Real-time Voice AI Agent',
    },
    description: {
      zh: '实时语音 AI Agent 平台，基于 LiveKit WebRTC 实现端到端低延迟语音交互。可插拔 ASR/TTS/NLP 供应商架构，声纹验证实现零注册说话人识别，混合记忆系统（结构化事实 + 向量语义检索）让 Agent 具备长期记忆能力。',
      en: 'Real-time voice AI agent platform built on LiveKit WebRTC for end-to-end low-latency voice interaction. Pluggable ASR/TTS/NLP provider architecture, voiceprint verification for zero-registration speaker identification, and hybrid memory (structured facts + vector semantic search) for long-term agent memory.',
    },
    coverGradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #4a1942 100%)',
    blobColors: ['#c084fc', '#f472b6', '#a78bfa', '#fb923c'],
    blobBg: '#120a1e',
    techStack: ['FastAPI', 'Next.js', 'LiveKit', 'WebRTC', 'ChromaDB', 'Supabase'],
    logo: '/images/logo-sumi.svg',
    highlights: [
      {
        title: { zh: '实时语音管线', en: 'Real-time Voice Pipeline' },
        desc: {
          zh: 'Browser → WebRTC → LiveKit → Silero VAD（本地语音检测）→ ASR → NLP → TTS → 回传。自适应打断检测（ML 模型区分真正打断与"嗯""哦"等回应词），通话级音频录制。',
          en: 'Browser → WebRTC → LiveKit → Silero VAD → ASR → NLP → TTS → playback. ML-based adaptive interruption detection (distinguishes real interruptions from backchannels like "uh-huh"), session audio recording.',
        },
      },
      {
        title: { zh: '声纹说话人验证', en: 'Voiceprint Speaker Verification' },
        desc: {
          zh: '零注册声纹识别，支持 CAM++/ERes2NetV2/ECAPA-TDNN/Resemblyzer 四种嵌入模型。实时验证说话人身份，无需预录音注册，ONNX 推理优化。',
          en: 'Zero-registration speaker verification with 4 embedding models: CAM++, ERes2NetV2, ECAPA-TDNN, Resemblyzer. Real-time identity verification without pre-enrollment, ONNX-optimized inference.',
        },
      },
      {
        title: { zh: '混合记忆系统', en: 'Hybrid Memory System' },
        desc: {
          zh: '结构化事实存储（SQLite 键值对，LLM 自动提取）+ ChromaDB 向量语义检索。对话上下文注入 Top-3 相关历史片段，让 Agent 具备跨会话长期记忆。',
          en: 'Structured fact store (SQLite key-value, LLM auto-extraction) + ChromaDB vector semantic search. Injects top-3 relevant past segments into conversation context for cross-session long-term memory.',
        },
      },
      {
        title: { zh: '可插拔供应商架构', en: 'Pluggable Provider Architecture' },
        desc: {
          zh: 'ASR：Paraformer / Whisper。NLP：Qwen / Claude / GPT / Gemini / DeepSeek。TTS：CosyVoice / OpenAI TTS。统一工厂模式，Agent 从数据库动态选择模型组合。',
          en: 'ASR: Paraformer / Whisper. NLP: Qwen / Claude / GPT / Gemini / DeepSeek. TTS: CosyVoice / OpenAI TTS. Unified factory pattern, agents dynamically select model combinations from database.',
        },
      },
    ],
  },
  {
    id: 'muses',
    title: {
      zh: 'Muses — AI 写作 Agent',
      en: 'Muses — AI Writing Agent',
    },
    description: {
      zh: '将文章当作代码的 AI 写作平台。Claude 对话式编辑 + 实时 Diff（红删/绿增）+ Accept/Reject 工作流，选中文本自动注入上下文，编辑记录支持一键回退。',
      en: 'AI writing platform that treats articles like code. Claude conversational editing + real-time diff (red delete / green add) + Accept/Reject workflow, text selection auto-injects context, edit history with one-click revert.',
    },
    coverGradient: 'linear-gradient(135deg, #1a1510 0%, #2d2418 50%, #3d3020 100%)',
    blobColors: ['#d97757', '#c4654a', '#a8845c', '#e8c9a0'],
    blobBg: '#1a1510',
    techStack: ['Next.js', 'FastAPI', 'TipTap', 'Claude API', 'SSE'],
    logo: '/images/logo-muses.svg',
    highlights: [
      {
        title: { zh: 'Claude 对话式编辑', en: 'Claude Conversational Editing' },
        desc: {
          zh: '右侧 Claude 面板智能判断对话/编辑模式。问问题直接回答，要求修改则输出完整新内容并触发 Accept/Reject 横幅。<article_edit> 标签协议实现精准意图识别。',
          en: 'Right-side Claude panel intelligently detects chat vs edit mode. Questions get direct answers, edit requests trigger Accept/Reject banner with full content diff via <article_edit> tag protocol.',
        },
      },
      {
        title: { zh: '实时 Diff 视图', en: 'Real-time Diff View' },
        desc: {
          zh: 'LCS 算法逐行对比新旧内容，红色删除线标记移除内容，绿色高亮标记新增内容。自动滚动到第一处变更，顶部显示 +N -M 变更统计。',
          en: 'LCS algorithm for line-by-line diff. Red strikethrough for deletions, green highlight for additions. Auto-scrolls to first change, shows +N -M change stats at top.',
        },
      },
      {
        title: { zh: '选区上下文注入', en: 'Selection Context Injection' },
        desc: {
          zh: '编辑器中选中文本后，选区内容自动持久化并显示在 Claude 面板。发送消息时选区作为上下文一同传递，发送后自动清除。底部状态栏实时显示 N lines selected。',
          en: 'Selected text persists and displays in Claude panel. Selection is sent as context with messages, auto-cleared after send. Status bar shows N lines selected in real-time.',
        },
      },
      {
        title: { zh: '编辑记录 + 回退', en: 'Edit History + Revert' },
        desc: {
          zh: '每次 Accept 操作记录为一条编辑历史，包含描述和 +/- 行数变化。底部状态栏累计显示总变更量，点击展开历史列表，支持一键回退到任意历史版本。',
          en: 'Each Accept creates a history record with description and +/- line changes. Status bar shows cumulative changes, click to expand history list with one-click revert to any version.',
        },
      },
    ],
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
