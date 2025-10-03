---
title: "Uteki改进计划"
date: "2025-09-30 02:37"
first_sync: "2025-10-02 21:31"
last_update: "2025-10-02 21:31"
tags: []
categories: []
author: "Muses"
summary: ""
---

<p></p><p>对于Uteki的<a target="_blank" rel="noopener noreferrer nofollow" href="http://localhost:3000/agent/chat">http://localhost:3000/agent/chat</a>后续的计划是</p><p>我需要使用multi-agent的架构来实现chat部分的research功能.</p><p>而multi-agent以一个lead-agent 和 多个不同职能的 sub-agent</p><p>lead-agent是核心, 也是这组agent的指挥者. 它的定位是领导, 懂得承接分析客户的需求, 和客户对话确定分析的要点和目标, 当确定的用户的根本目标后, 根据其下的sub-agent的职能进行拆解和分配任务. lead-agent自身具备总结概括提炼要点的能力和一些辅助展示的自定义工具 (待补充) .</p><p>对于Sub-Agent我们有:</p><h3>1. 基本面分析Agent: (Tools: PE Ratio/ EPS)</h3><p>基本面分析的主要内容：</p><p>## <strong>1. 财务报表分析</strong></p><p><strong>三大报表：</strong></p><p>- <strong>损益表</strong>：营收、成本、利润趋势</p><p>- <strong>资产负债表</strong>：资产质量、负债结构、净资产</p><p>- <strong>现金流量表</strong>：经营/投资/融资现金流</p><p><strong>关键指标：</strong></p><p>- ROE（净资产收益率）</p><p>- 毛利率、净利率</p><p>- 资产负债率</p><p>- 流动比率、速动比率</p><p>## <strong>2. 行业分析</strong></p><p>- 行业生命周期（成长期/成熟期/衰退期）</p><p>- 市场规模和增速</p><p>- 竞争格局（集中度、进入壁垒）</p><p>- 上下游议价能力</p><p>## <strong>3. 公司质地</strong></p><p>- <strong>商业模式</strong>：护城河宽度、定价权</p><p>- <strong>市场地位</strong>：市占率、品牌价值</p><p>- <strong>管理层</strong>：战略眼光、执行能力、诚信度</p><p>- <strong>研发能力</strong>：技术储备、创新能力</p><p>## <strong>4. 成长性分析</strong></p><p>- 历史增长率（营收、利润）</p><p>- 未来增长动力</p><p>- 产能扩张计划</p><p>- 新产品/新市场布局</p><p>## <strong>5. 估值分析</strong></p><p>- <strong>市盈率(PE)</strong>：股价/每股收益</p><p>- <strong>市净率(PB)</strong>：股价/每股净资产</p><p>- <strong>PEG</strong>：PE/增长率</p><p>- <strong>DCF模型</strong>：现金流折现</p><p>## <strong>6. 宏观因素</strong></p><p>- 经济周期位置</p><p>- 政策导向和监管环境</p><p>- 利率和汇率走势</p><p>- 国际贸易环境</p><p><strong>核心理念：</strong> 基本面分析就是判断公司的内在价值，寻找价格低于价值的投资机会。重点看公司是否有持续赚钱的能力。</p><h3>2. 图像内容分析Agent</h3><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://docs.claude.com/zh-CN/docs/build-with-claude/vision">https://docs.claude.com/zh-CN/docs/build-with-claude/vision</a> / <a target="_blank" rel="noopener noreferrer nofollow" href="https://platform.openai.com/docs/guides/images-vision?api-mode=responses&amp;format=base64-encoded#analyze-images">https://platform.openai.com/docs/guides/images-vision?api-mode=responses&amp;format=base64-encoded#analyze-images</a> / <a target="_blank" rel="noopener noreferrer nofollow" href="https://ai.google.dev/gemini-api/docs/image-understanding?hl=zh-cn">https://ai.google.dev/gemini-api/docs/image-understanding?hl=zh-cn</a></p><p>核心是分析K线形态和关键阻力位和支撑位</p><pre><code class="language-json">## K线分析核心要素

你说得对，形态和支撑阻力是核心。补充几个关键点：

### **1. 成交量配合**
- **放量突破**：真突破的确认信号
- **缩量调整**：健康回调
- **量价背离**：趋势可能反转
→ 没有量的配合，形态可靠性大打折扣

### **2. 趋势结构**
- **高点和低点的相对位置**
  - 上升：高点越来越高，低点越来越高
  - 下降：相反
- **趋势线**：连接波峰/波谷
→ 判断当前处于趋势的哪个阶段

### **3. 关键K线组合**
- **反转信号**：锤子线、吞没形态、启明星/黄昏星
- **持续信号**：红三兵、三只乌鸦
- **位置很重要**：同样形态在不同位置意义不同

### **4. 时间周期共振**
- 日线、周线、月线的支撑/阻力重合
- 多周期形态确认
→ 大周期决定方向，小周期找买卖点

### **5. 动态指标辅助**
- **均线系统**：特别是20/60/120日线
- **MACD**：背离信号
- **RSI**：超买超卖区域

**核心原则：**
- 支撑阻力是"战场"
- 形态是"战术"  
- 成交量是"弹药"
- 趋势是"战略方向"

**实战要点：** 宁可错过，不要做错。等待关键位置+明确形态+成交量确认，胜率会大幅提高。</code></pre><h3>3. 技术分析Agent</h3><p></p><h3>4. 宏观分析Agent</h3><p></p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://macrotrends.net/stocks/charts/NVDA/nvidia/pe-ratio">https://macrotrends.net/stocks/charts/NVDA/nvidia/pe-ratio</a></p><p>NVIDIA stock price PE ratio September 2025</p><p></p><p></p>