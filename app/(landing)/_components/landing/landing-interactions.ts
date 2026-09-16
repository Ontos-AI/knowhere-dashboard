// @ts-nocheck
import NumberFlow from "number-flow";

const readSiteLanguage = () => {
  const lang = document.documentElement.lang || document.body.dataset.language || "en";
  return lang.toLowerCase().startsWith("zh") ? "zh" : "en";
};

// Initializes the non-canvas landing-page integrations after React mounts.
export function initializeLandingInteractions(root) {
if (!(root instanceof Element)) return () => {};
(() => {
  'use strict';
  const $ = (selector, scope = root) => scope.querySelector(selector);
  const $$ = (selector, scope = root) => [...scope.querySelectorAll(selector)];

  const toast = $('.toast');
  let toastTimer;
  function showToast(message) {
    $('[data-toast-message]', toast).textContent = typeof localizeText === 'function' ? localizeText(message) : message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 6000);
  }
  $('.toast button').addEventListener('click', () => { toast.hidden = true; });
  $$('.prototype-link:not([href="#playground"])').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    showToast('Prototype only — destination not connected.');
  }));
  const unconnectedSalesLink = $('.sales-link[href="#prototype-notice"]');
  unconnectedSalesLink?.addEventListener('click', event => {
    event.preventDefault();
    showToast('Prototype only — sales form not connected.');
  });

  const zh = {
    'Skip to content': '跳至正文', 'Product': '产品', 'Integration': '集成', 'Benchmark': '评测', 'Pricing': '价格', 'View Docs': '查看文档', 'Try a sample document': '免费试用', 'Menu': '菜单', 'Close': '关闭',
    'DOCUMENT UNDERSTANDING FOR AI': '面向 AI 的文档理解', 'Turn complex documents into structured, traceable knowledge for AI.': '将复杂文档转化为可供 AI 使用的结构化、可追溯知识。', 'Extract text, tables, formulas, and document structure. Preserve visual context when it matters. Trace results back to the source.': '提取文本、表格、公式与文档结构；在视觉上下文重要时保留原貌，并让每项结果都能追溯至来源。', 'Explore with sample documents.': '使用示例文档探索。',
    'Original page': '原始页面', 'Document hierarchy': '文档层级', 'Structured content': '结构化内容', 'Source reference': '来源引用', 'Market overview': '市场概览', 'Findings': '发现', 'Source notes': '来源注释', 'Table · Findings': '表格 · 发现', 'Revenue drivers': '营收驱动因素', 'Section · Context': '章节 · 上下文', 'Regional outlook': '区域展望', 'Source located': '已定位来源', 'Page 12 · Region 03': '第 12 页 · 区域 03',
    '01 / PRODUCT': '01 / 产品', 'See what Knowhere returns to your agents.': '查看结构化文档输出。', 'Choose a prepared example to inspect the illustrative structured context shown to agents.': '将预设文档拖入工作台，查看 Knowhere 为智能体返回的结构化、可追溯内容。', 'Preset source documents': '预设来源文档', 'Choose a document to inspect.': '选择一份文档进行查看。', 'Drag a prepared document into the workspace. Local uploads are not available in this demo.': '将预设文档拖入工作台。本演示不支持本地上传。', 'Tesla Q4 2025 Update.pdf': '特斯拉 2025 年第四季度更新.pdf', 'Product strategy deck.pptx': '产品策略演示文稿.pptx', 'Financial model.xlsx': '财务模型.xlsx', 'Architectural atlas.pdf': '建筑图集.pdf', 'Drag ↗': '拖拽 ↗', 'Structured workspace': '结构化工作台', 'Awaiting preset document': '等待预设文档', 'Drop a preset document': '拖入一份预设文档', 'SOURCE': '来源', 'Document Data': '文档数据', 'Full Text': '完整文本', 'Document Outline': '文档大纲', 'Images': '图片', 'Drag a preset document here': '将预设文档拖到这里', 'Prepared examples only. Local file upload is not available in this prototype.': '仅可探索左侧提供的预设示例。', 'Clean text': '清洗后的文本', 'Structured text will appear after a preset document is dropped here.': '拖入预设文档后，结构化文本会显示在这里。', 'Parsed structure': '解析后的结构', 'Choose a preset document to inspect its sections, tables, and source regions.': '选择一份预设文档以查看其章节、表格和来源区域。', 'Extracted assets': '提取的资源', 'No extracted assets yet.': '尚未提取资源。', 'Quarterly update · 24 pages': '季度更新 · 24 页', 'Strategy deck · 38 slides': '策略演示文稿 · 38 张', 'Forecast model · 18 sheets': '预测模型 · 18 个工作表', 'Design atlas · 42 pages': '设计图集 · 42 页',
    '02 / SCOPE': '02 / 范围', 'Handle complex documents without losing structure or source context.': '应对每一种文档挑战。', 'Explore prepared examples across complex layouts, structures, and source-sensitive workflows.': '面向复杂文件、版式与检索工作流的企业级文档理解。', 'Prepared format examples': '多格式支持', 'Explore prepared document, presentation, spreadsheet, image, and technical-layout examples. Format availability is not confirmed.': '通过一个 API 处理文档、演示文稿、电子表格、图片和技术版式，支持 PDF、DOCX、XLSX、PPT、HTML 等 20 多种主要格式。', 'Agent-ready structure': '面向智能体的结构', 'Turn hierarchies, headings, tables, and formulas into structured content agents can navigate.': '将层级、标题、表格与公式转成智能体可导航的结构化内容。', 'Visual context and evidence': '视觉上下文与证据', 'Retain spatial relationships and link every result back to its page and source region.': '保留空间关系，并将每项结果关联回原始页面与来源区域。', 'API-first workflow': 'API 优先工作流', 'Return clean document output through one API for retrieval and downstream agent tools.': '通过一个 API 返回清晰文档输出，供检索和下游智能体工具使用。', 'Illustrative formats — support to be confirmed': '展示格式 — 支持范围待确认', 'Illustrative preview:': '示例预览：', 'deep document hierarchy': '深层文档层级', 'Format availability has not been confirmed.': '格式可用性尚未确认。',
    'Agent-oriented structure preview': '面向智能体的原生结构', 'Illustrates progressive disclosure and hierarchy for agent workflows; production behavior remains under evaluation.': '为智能体工程工作流原生设计渐进式呈现与层级记忆。', 'Formula and notation preview': '公式与化学结构识别', 'Prepared scientific-document examples illustrate formulas and notation; accuracy and availability remain under evaluation.': '从科研文档中提取数学公式（LaTeX/MathML）与化学结构。', 'Source review preview': '完整来源追溯', 'Prepared examples illustrate links between output and source regions; production traceability remains under evaluation.': '让每个提取元素都可追溯至来源，便于审计和核验 AI 生成内容。', 'Deployment planning preview': '本地化部署', 'Deployment options and enterprise workflow support are not confirmed in this prototype.': '支持面向冲突检测、合规审计与风险识别等企业长尾需求的本地部署。', 'Integration planning preview': 'API 优先设计', 'Interfaces, automation options, client libraries, and documentation availability are not confirmed.': '提供 RESTful API、Webhook、主流语言 SDK 与完整文档。',
    '03 / CAPABILITY': '03 / 能力', 'Content and context, understood.': '理解内容，也理解上下文。', 'Give agents structured content with the original page always within reach.': '为智能体提供结构化内容，并让原始页面始终触手可及。', 'Text Parse': '文本解析', 'Extract structure': '提取结构', 'Turn headings, paragraphs, tables, formulas, and document hierarchies into clean content for AI.': '将标题、段落、表格、公式与文档层级转化为供 AI 使用的清晰内容。', 'Hierarchy: Report → Findings → Table': '层级：报告 → 发现 → 表格', 'Vision Map': '视觉地图', 'Understand visual context': '理解视觉上下文', 'Keep the original page when layout, drawings, diagrams, or spatial relationships carry meaning.': '当版式、图纸、图表或空间关系承载含义时，保留原始页面。', 'Original page with spatial regions preserved': '保留空间区域的原始页面', 'Source Link': '来源链接', 'Keep every result traceable': '让每项结果都可追溯', 'Link extracted content and AI answers back to the exact page and source region for review.': '将提取内容和 AI 回答链接回准确页面与来源区域，便于核验。', 'Page 12 → Region 03 → Result': '第 12 页 → 区域 03 → 结果', 'Product vision · capability under evaluation': '能力状态待确认', 'Explore cross-document context': '连接跨文档知识', 'This product-vision card illustrates possible cross-document context; availability and behavior are unconfirmed.': '连接多份文档中重复出现的实体、概念和关系，用于检索及下游智能体工作流。', 'Prepared example · relationship preview': '文档 A · 实体 · 文档 B', 'STRUCTURE': '结构', 'Clean content': '清晰内容',
    '04 / INTEGRATION': '04 / 集成', 'Bring structured document context into your agent workflow.': '几分钟即可集成。', 'This conceptual flow illustrates document → structured context → agent task; interface details remain unconfirmed.': '发送一份文档，通过一个 API 获取结构化内容、文档层级和来源引用。', 'Prepare a document': '获取 API 密钥', 'Start with a prepared source whose structure and layout carry meaning.': '创建账户并生成安全的 API 密钥。', 'Review structured context': '提交文档', 'Inspect an illustrative result with hierarchy and source regions.': '将受支持的文档上传至处理 API。', 'Explore an agent task': '接收结果', 'See how structured context could support a downstream task.': '通过 API 获取结构化内容、文档层级和来源引用。', 'Illustrative flow · interface details unconfirmed': '示例代码 · API 细节待确认', 'Copy': '复制', 'Integration vision · availability unconfirmed': 'MCP 可用性 · 待确认', 'Explore a future tool connection.': '在你的 AI 工具中使用 Knowhere。', 'This visual is a product vision. Protocol, compatible tools, and availability are not confirmed.': '无需自建独立文档管线，即可将 Knowhere 连接到 Codex、Cursor 和其他 MCP 客户端。', 'Integration details pending →': '阅读 MCP 文档 →',
    '05 / EVIDENCE': '05 / 证据', 'Better retrieval starts with better document understanding.': '更好的检索，始于更好的文档理解。', 'Evaluate document understanding across structure, tables, source traceability, and downstream retrieval.': '从结构、表格、来源可追溯性和下游检索等维度评估文档理解。', 'Benchmark results pending verification.': '评测结果等待验证。', 'Overall': '总体', 'Document Structure': '文档结构', 'Tables': '表格', 'Source Traceability': '来源可追溯性', 'Downstream Retrieval': '下游检索', 'QUALITATIVE REVIEW': '定性评估', 'How accurate is the result?': '结果有多准确？', 'How much work does the agent need?': '智能体需要多少额外工作？', 'Can the answer be traced back to the source?': '答案能否追溯至来源？', 'Measure structure, retrieval, and source traceability together.': '将结构、检索与来源可追溯性一并衡量。',
    'EVALUATION FRAMEWORK': '对比 / 评估', 'How we evaluate document understanding.': '我们的对比。', 'This illustrative framework reviews structure preservation, visual context, source traceability, and agent usability. Quantitative results are not published in this prototype.': '在对 500 多个精选文档进行 50 项检索任务的基准测试中，Knowhere 旨在提升首次准确率和召回率，同时减少标记、代理循环与延迟。', 'Illustrative evaluation dimensions': '对比表现', 'Original document': '原始文档', 'Structured context example': '智能体 + Knowhere', 'Evaluation path A': '智能体 + Unstructured', 'Evaluation path B': '智能体 + MinerU', 'Evaluation path C': '智能体 + Markitdown', 'First-pass accuracy': '首次准确率', 'Source review': '召回率', 'Token use': '上下文用量', 'Agent steps': '代理循环', 'Review how structure is represented.': '从更清晰的结构开始。', 'Review whether visual context remains usable.': '检索更多关键内容。', 'Review the work required for agent use.': '减少标记与循环消耗。', 'Review links back to source regions.': '让答案始终关联来源。', 'Accuracy': '准确率', 'Efficiency': '效率', 'Traceability': '可追溯性', 'Evaluation dimension': '评估维度', 'Original document pipeline': '原始文档管道', 'Document structure': '文档结构', 'Baseline behavior remains to be validated.': '基线行为仍有待验证。', 'Review hierarchy, tables, and formulas in prepared examples.': '评估预置示例中的层级、表格与公式。', 'Visual context': '视觉上下文', 'Visual-context behavior remains to be validated.': '视觉上下文行为仍有待验证。', 'Review source-region links in prepared examples.': '评估预置示例中的来源区域链接。', 'Agent workflow': '智能体工作流', 'Agent-workflow behavior remains to be validated.': '智能体工作流行为仍有待验证。', 'Review whether prepared output is usable for an agent task.': '评估预置输出是否适用于智能体任务。',
    '06 / PRODUCT VISION': '06 / 产品愿景', 'POWERED BY KNOWHERE': '由 KNOWHERE 驱动', 'Product vision · BRAIN is a working name': '产品愿景 · BRAIN 为暂定名称', 'One memory. Every agent.': '一份记忆，每个智能体。', 'BRAIN turns your document knowledge into reusable memory that different agents can retrieve and share.': 'BRAIN 将你的文档知识转化为可复用的记忆，供不同智能体检索和共享。', 'Learn more': '了解更多', 'This prototype imagines document knowledge processed once and recalled by different tools.': '此原型设想：文档知识处理一次，即可被不同工具调用。', 'Product availability, storage boundaries, and client support are not yet confirmed.': '产品可用性、存储边界和客户端支持尚未确认。', 'KNOWHERE remains the document-understanding foundation for this vision.': 'KNOWHERE 仍是该愿景的文档理解基础。', 'DOCUMENT': '文档', 'Reusable memory': '可复用记忆', 'Other agents': '其他智能体', 'Process once → Store as reusable document memory → Connect through MCP or CLI → Source review from different agents': '处理一次 → 存为可复用文档记忆 → 通过 MCP 或 CLI 连接 → 从不同智能体中调用',
    '07 / PRICING': '07 / 价格', 'Illustrative units calculator.': '简单、透明的价格。', 'Pricing details are being confirmed.': '价格细节正在确认。', 'No price, unit, credit, or billing commitment is represented in this prototype.': '此原型不代表任何价格、计量单位、额度或结算承诺。', 'View pricing': '查看价格', '08 / ENTERPRISE': '08 / 企业版', 'Enterprise options · subject to confirmation': '企业版选项 · 待确认', 'Enterprise planning preview.': '需要更多控制力？', 'The options below are planning placeholders. Availability, architecture, service levels, and commercial terms are unconfirmed.': '私有化部署，设置自定义限额和 SLA，并为你的组织获得专属支持。', 'Talk to Sales': '联系销售', 'Deployment options pending': '私有化部署', 'Limits pending': '自定义限额', 'Processing options pending': '优先处理', 'Service terms pending': 'SLA 与支持', 'Commercial terms pending': '批量价格', 'Billing terms pending': '发票结算',
    '09 / FAQ': '09 / 常见问题', 'Questions, answered honestly.': '坦诚回答常见问题。', 'The answers below describe this interactive prototype only.': '以下产品细节以当前已发布文档为准。', 'Which file formats are supported?': '支持哪些文件格式？', 'When does Knowhere use visual understanding?': 'Knowhere 何时使用视觉理解？', 'Can every result be traced back to the source?': '每项结果都能追溯至来源吗？', 'Can Knowhere connect knowledge across multiple documents?': 'Knowhere 能连接多份文档中的知识吗？', 'How is page usage calculated?': '页面用量如何计算？', 'What happens when a job fails?': '任务失败时会怎样？', 'Can Knowhere be deployed on-premise?': 'Knowhere 可以私有化部署吗？', 'Expand': '展开', 'Collapse': '收起', 'Product details are being confirmed for this prototype. See the documentation for the current specification.': '此原型的产品细节仍在确认中。请参阅文档获取当前规格。',
    '10 / GET STARTED': '10 / 开始使用', 'Explore structured document context with a prepared example.': '让你的文档真正为 AI 所用。', 'Start with a sample document.': '从一份示例文档开始。', 'Docs': '文档', 'Contact': '联系', 'Prototype only — destinations and legal links are not connected. © 2026 KNOWHERE': '仅为原型 — 页面跳转和法律链接尚未连接。© 2026 KNOWHERE', 'Prototype only — destination not connected.': '仅为原型 — 目标页面尚未连接。', 'Prototype only — sales form not connected.': '仅为原型 — 销售表单尚未连接。', 'Copy unavailable — select the code manually.': '无法复制，请手动选择代码。', 'Copied': '已复制', 'Code copied to clipboard.': '代码已复制到剪贴板。', 'Language state: English.': '语言状态：英文。', 'Language state: Chinese.': '语言状态：中文。', 'Choose language': '选择语言', 'Language': '语言', 'Toggle comparison details': '展开或收起对比详情'
  };
  Object.assign(zh, {
    'PRODUCT': '产品', 'SCOPE': '范围', 'CAPABILITY': '能力', 'INTEGRATION': '集成',
    'PRODUCT VISION': '产品愿景', 'PRICING': '价格', 'ENTERPRISE': '企业版', 'FAQ': 'FAQ', 'GET STARTED': '开始使用',
    'SUPPORTED FORMATS': '支持的格式',
    '01 / Report': '01 / 报告', '↳ Findings': '↳ 发现', '↳ Source notes': '↳ 来源注释',
    '. Format availability has not been confirmed.': '。格式可用性尚未确认。', 'slides and visual sequence': '幻灯片与视觉序列', 'tables, formulas, and cells': '表格、公式和单元格', 'layout and spatial context': '版式与空间上下文',
    'REPORT': '报告', 'Hierarchy': '层级', 'VISUAL CONTEXT': '视觉上下文', 'SOURCE TRACE': '来源追溯', 'RELATIONSHIPS': '关系', 'Status unconfirmed': '状态待确认',
    '05 / PRODUCT VISION': '05 / 产品愿景', '06 / PRICING': '06 / 价格', '07 / ENTERPRISE': '07 / 企业版', '08 / FAQ': '08 / 常见问题', '09 / GET STARTED': '09 / 开始使用',
    'Campaign summary': '活动摘要', 'Revenue model': '营收模型', 'Building section': '建筑剖面', 'Page 12': '第 12 页', 'Slide 08': '第 08 张', 'Sheet 04': '工作表 04', 'Page 21': '第 21 页'
    , 'Document structure': '文档结构', 'Review hierarchy, tables, and reading order.': '评估文档层级、表格与阅读顺序。', 'Retrieval quality': '检索质量', 'Review whether agents can use the output with less cleanup.': '评估智能体能否减少清理工作并直接使用输出。', 'Source traceability': '来源可追溯性', 'Review whether answers return to the original page and region.': '评估答案能否返回原始页面与对应区域。',
    'documents': '份文档',
    'Adjust the control to explore demo units. This prototype does not represent prices, billing, or commercial terms.': '只为实际处理的页面付费。无复杂套餐、无最低消费、无长期承诺。', 'Pay as you go · Prototype · no commercial terms': '按使用量演示 · 原型 · 不代表商业条款',
    'Page credits': '页面额度', 'Pages to process': '处理页数', 'Number of pages': '待处理页数', 'Demo input': '投入金额', 'pages': '页', 'Estimated cost': '预估费用', 'Estimated cost ($0.015 per page)': '预估费用（每页 $0.015）', 'Illustrative demo output': '预计可处理数量', 'Budget': '预算', 'Prototype · no commercial terms': '每 100 页 $1.50',
    'Prepared example A': '100 页 PDF', 'Prepared example B': '500 页文档', 'document': '份文档', 'Commercial status': '付费承诺', 'Terms pending': '无最低消费',
    'Image placeholder': '图片占位', 'Brain powered by KNOWHERE.': '由 KNOWHERE 驱动的 Brain',
    'Process document context once, then make it available to each agent that needs it.': '文档上下文处理一次，即可供每个需要它的智能体使用。', 'Shared retrieval': '共享检索', 'Give different agents the right document context for the task at hand.': '为不同智能体提供与当前任务匹配的文档上下文。', 'Keep every retrieved result connected to the original document source.': '让每个检索结果持续关联原始文档来源。'
,
    'Original file': '原始文件',
    'Document map': '文档地图',
    'Theme → file → section → pages': '主题 → 文件 → 章节 → 页面',
    'Choose a document theme': '选择文档主题',
    'Q4 growth & outlook': '第四季度增长与展望',
    'Regional performance': '区域表现',
    'Operating efficiency': '运营效率',
    'Cross-document relationship': '跨文档关系',
    'Back to document map': '返回文档地图',
    'Interactive document scan and source traceability demonstration': '交互式文档扫描与来源追溯演示',
    'Try a sample document': '体验示例文档',
    'See what Knowhere returns to your agents.': '查看 Knowhere 向智能体返回什么。',
    'Choose a prepared example to inspect the illustrative structured context shown to agents.': '选择预置示例，查看向智能体展示的示意性结构化上下文。',
    'Prepared examples only. Local file upload is not available in this prototype.': '仅提供预置示例。此原型不支持上传本地文件。',
    'Handle complex documents without losing structure or source context.': '处理复杂文档，同时保留结构与来源上下文。',
    'Explore prepared examples across complex layouts, structures, and source-sensitive workflows.': '通过预置示例探索复杂版式、结构与重视来源的工作流。',
    'Prepared format examples': '预置格式示例',
    'Explore prepared document, presentation, spreadsheet, image, and technical-layout examples. Format availability is not confirmed.': '探索预置的文档、演示稿、表格、图片与技术版式示例。格式可用性尚未确认。',
    'Agent-oriented structure preview': '面向智能体的结构预览',
    'Illustrates progressive disclosure and hierarchy for agent workflows; production behavior remains under evaluation.': '展示面向智能体工作流的渐进式呈现与层级；生产行为仍在评估中。',
    'Formula and notation preview': '公式与符号预览',
    'Prepared scientific-document examples illustrate formulas and notation; accuracy and availability remain under evaluation.': '预置科研文档示例展示公式与符号；准确性和可用性仍在评估中。',
    'Source review preview': '来源复核预览',
    'Prepared examples illustrate links between output and source regions; production traceability remains under evaluation.': '预置示例展示输出与来源区域的关联；生产环境可追溯性仍在评估中。',
    'Deployment planning preview': '部署规划预览',
    'Deployment options and enterprise workflow support are not confirmed in this prototype.': '此原型尚未确认部署选项与企业工作流支持。',
    'Integration planning preview': '接入规划预览',
    'Interfaces, automation options, client libraries, and documentation availability are not confirmed.': '接口、自动化选项、客户端库与文档可用性尚未确认。',
    'Product vision · capability under evaluation': '产品愿景 · 能力评估中',
    'Explore cross-document context': '探索跨文档上下文',
    'This product-vision card illustrates possible cross-document context; availability and behavior are unconfirmed.': '此产品愿景卡展示潜在的跨文档上下文；可用性与行为尚未确认。',
    'Prepared example · relationship preview': '预置示例 · 关系预览',
    'Bring structured document context into your agent workflow.': '将结构化文档上下文接入智能体工作流。',
    'This conceptual flow illustrates document → structured context → agent task; interface details remain unconfirmed.': '此概念流程展示文档 → 结构化上下文 → 智能体任务；接口细节尚未确认。',
    'Prepare a document': '准备文档',
    'Start with a prepared source whose structure and layout carry meaning.': '从结构与版式承载含义的预置来源开始。',
    'Review structured context': '查看结构化上下文',
    'Inspect an illustrative result with hierarchy and source regions.': '查看包含层级与来源区域的示意结果。',
    'Explore an agent task': '探索智能体任务',
    'See how structured context could support a downstream task.': '查看结构化上下文如何支持下游任务。',
    'Illustrative flow · interface details unconfirmed': '示意流程 · 接口细节待确认',
    'Integration vision · availability unconfirmed': '接入愿景 · 可用性待确认',
    'Explore a future tool connection.': '探索未来工具连接。',
    'This visual is a product vision. Protocol, compatible tools, and availability are not confirmed.': '此视觉模块属于产品愿景。协议、兼容工具与可用性尚未确认。',
    'Integration details pending →': '接入细节待确认 →',
    'EVALUATION FRAMEWORK': '评估框架',
    'How we evaluate document understanding.': '我们如何评估文档理解质量。',
    'This illustrative framework reviews structure preservation, visual context, source traceability, and agent usability. Quantitative results are not published in this prototype.': '此示意框架评估结构保留、视觉上下文、来源可追溯性与智能体可用性。此原型不发布量化结果。',
    'Illustrative evaluation dimensions': '示意评估维度',
    'Structured context example': '结构化上下文示例',
    'Evaluation path A': '评估路径 A',
    'Evaluation path B': '评估路径 B',
    'Evaluation path C': '评估路径 C',
    'Context size': '上下文规模',
    'Review time': '复核时间',
    'Agent steps': '智能体步骤',
    'Structure review': '结构复核',
    'Visual review': '视觉复核',
    'Source review': '来源复核',
    'Review how structure is represented.': '评估结构如何表达。',
    'Review whether visual context remains usable.': '评估视觉上下文是否仍可用。',
    'Review the work required for agent use.': '评估智能体使用所需工作。',
    'Review links back to source regions.': '评估返回来源区域的关联。',
    'Evaluation matrix': '评估矩阵',
    'Illustrative criteria · validation pending': '示意标准 · 等待验证',
    'Prototype example': '原型示例',
    'Review status': '复核状态',
    'Retrieval outcome review': '检索结果复核',
    'Context efficiency review': '上下文效率复核',
    'Prepared': '预置',
    'Pending': '待确认',
    'BRAIN · Product vision preview.': 'BRAIN · 产品愿景预览。',
    'This preview imagines reusable document context across agent tasks. Availability and architecture are unconfirmed.': '此预览构想在智能体任务间复用文档上下文。可用性与架构尚未确认。',
    'Reusable context vision': '可复用上下文愿景',
    'Illustrates possible context reuse; production behavior is unconfirmed.': '展示潜在的上下文复用；生产行为尚未确认。',
    'Shared retrieval vision': '共享检索愿景',
    'Illustrates possible context sharing across tasks; availability is unconfirmed.': '展示任务间潜在的上下文共享；可用性尚未确认。',
    'Source review vision': '来源复核愿景',
    'Illustrates possible source review; architecture and behavior are unconfirmed.': '展示潜在的来源复核；架构与行为尚未确认。',
    'Illustrative units calculator.': '示意单位计算器。',
    'Adjust the control to explore demo units. This prototype does not represent prices, billing, or commercial terms.': '调整控件以探索演示单位。此原型不代表价格、计费或商业条款。',
    'Demo input': '演示输入',
    'Illustrative demo output': '示意演示输出',
    'Prototype · no commercial terms': '原型 · 不代表商业条款',
    'Prepared example A': '预置示例 A',
    'Prepared example B': '预置示例 B',
    'Commercial status': '商业状态',
    'Terms pending': '条款待确认',
    'demo units': '演示单位',
    'demo points': '演示点数',
    'Illustrative only': '仅作示意',
    'Enterprise planning preview.': '企业规划预览。',
    'The options below are planning placeholders. Availability, architecture, service levels, and commercial terms are unconfirmed.': '以下选项均为规划占位。可用性、架构、服务级别与商业条款尚未确认。',
    'Deployment options pending': '部署选项待确认',
    'Limits pending': '限额待确认',
    'Processing options pending': '处理选项待确认',
    'Service terms pending': '服务条款待确认',
    'Commercial terms pending': '商业条款待确认',
    'Billing terms pending': '计费条款待确认',
    'Explore structured document context with a prepared example.': '通过预置示例探索结构化文档上下文。',
    'What can I explore in this prototype?': '此原型可以体验什么？',
    'Can I upload my own file?': '可以上传自己的文件吗？',
    'What do the prepared outputs show?': '预置输出展示什么？',
    'Can I try the real product from this page?': '可以从此页面真实试用产品吗？',
    'Does this calculator show real pricing?': '此计算器展示真实定价吗？',
    'Are the integration options available?': '接入选项已经可用吗？',
    'Are enterprise and BRAIN options available?': '企业选项与 BRAIN 已经可用吗？',
    'The answers below describe this interactive prototype only.': '以下回答仅描述此交互式原型。',
    'prepared_source_preview': '预置来源预览',
    'Prepared document': '预置文档',
    'Illustrative': '示意',
    'Source-region preview': '来源区域预览',
    'Visual-context preview': '视觉上下文预览',
    'prepared_result_preview': '预置结果预览',
    'demo_config': '演示配置',
    'Example agent': '示例智能体',
    'Illustrative structure': '示意结构',
    'Source preview': '来源预览',
    'A prepared example illustrating sections, tables, and source-region references.': '展示章节、表格与来源区域引用的预置示例。',
    'A prepared example illustrating narrative sections, notes, charts, and slide references.': '展示叙事章节、备注、图表与幻灯片引用的预置示例。',
    'A prepared example illustrating sheets, cell ranges, and formula relationships.': '展示工作表、单元格范围与公式关系的预置示例。',
    'A prepared example illustrating drawings, labels, spatial relationships, and region references.': '展示图纸、标注、空间关系与区域引用的预置示例。',
    'You can explore four prepared documents, their illustrative structured views, and the existing product-vision modules.': '你可以体验四个预置文档、其示意性结构化视图，以及现有产品愿景模块。',
    'No local files are accepted or processed; the Playground uses prepared examples only.': '不接收或处理本地文件；体验区仅使用预置示例。',
    'They demonstrate possible document data, text, outline, structure, images, and source-region views—not production results.': '它们展示可能的文档数据、文本、大纲、结构、图片与来源区域视图，并非生产结果。',
    'Not yet. This page is an interactive prototype; access and availability require confirmation with the team.': '暂时不能。此页面是交互式原型；访问方式与可用性需向团队确认。',
    'No. It is an illustrative units demo and does not represent prices, billing, credits, or commercial terms.': '不是。它是示意单位演示，不代表价格、计费、额度或商业条款。',
    'Not confirmed. The integration cards, code, and connection panel are conceptual previews.': '尚未确认。接入卡片、代码与连接面板均为概念预览。',
    'Not confirmed. Enterprise options and BRAIN are product-vision previews with architecture and availability pending.': '尚未确认。企业选项与 BRAIN 均为产品愿景预览，架构和可用性待定。',
    'Operating highlights': '运营亮点', 'Financial tables': '财务表格', 'Positioning': '市场定位', 'GTM plan': '市场进入计划', 'Launch metrics': '发布指标',
    'Assumptions': '假设条件', 'Scenario analysis': '情景分析', 'Site context': '场地环境', 'Material schedule': '材料明细表',
    'Page 02': '第 02 页', 'Page 04': '第 04 页', 'Page 07': '第 07 页', 'Page 34': '第 34 页',
    'Slide 03': '第 03 张', 'Slide 12': '第 12 张', 'Slide 28': '第 28 张', 'Sheet 01': '工作表 01', 'Sheet 12': '工作表 12',
    'image-1 · earnings chart': '图片 1 · 收益图表', 'image-2 · delivery map': '图片 2 · 交付地图', 'table-3 · regional summary': '表格 3 · 区域摘要',
    'image-1 · market map': '图片 1 · 市场地图', 'image-2 · product architecture': '图片 2 · 产品架构', 'chart-3 · launch funnel': '图表 3 · 发布漏斗',
    'table-1 · revenue forecast': '表格 1 · 营收预测', 'table-2 · sensitivity analysis': '表格 2 · 敏感性分析', 'chart-1 · cash runway': '图表 1 · 现金周期',
    'image-1 · site plan': '图片 1 · 总平面图', 'image-2 · building section': '图片 2 · 建筑剖面', 'image-3 · material board': '图片 3 · 材料板',
    'Built for every document challenge.': '应对每一种文档挑战。',
    'Enterprise-grade features designed to handle the most complex document parsing scenarios.': '面向最复杂文档解析场景的企业级能力。',
    'Multi-format support': '多格式支持',
    'Process documents, presentations, spreadsheets, images, Markdown, JSON, and text through a unified API.': '通过统一 API 处理文档、演示文稿、电子表格、图片、Markdown、JSON 和文本。',
    'Agentic-Native Structure': '面向智能体的原生结构',
    'Progressive disclosure and hierarchical memory natively designed for agentic engineering workflows.': '为智能体工程工作流原生设计渐进式呈现与层级记忆。',
    'Formula & Chemical Recognition': '公式与化学结构识别',
    'Full Provenance Tracing': '完整来源追溯',
    'On-premise Deployment': '本地化部署',
    'Supports local deployment for enterprise needs including conflict detection, compliance auditing, and risk identification.': '支持面向冲突检测、合规审计和风险识别等企业需求的本地部署。',
    'API First Design': 'API 优先设计',
    'RESTful API with webhooks, SDK examples, and detailed documentation.': '提供 RESTful API、Webhook、SDK 示例与详细文档。',
    'Integrate in minutes.': '几分钟即可集成。',
    'Send a document. Get structured content, document hierarchy, and source references through one API.': '发送一份文档，通过一个 API 获取结构化内容、文档层级和来源引用。',
    'Get your API key': '获取 API 密钥',
    'Sign up and generate your secure API key from the dashboard.': '注册并从控制台生成安全的 API 密钥。',
    'Submit a job': '提交任务',
    'Send a URL or upload a file to the processing queue.': '发送 URL 或将文件上传至处理队列。',
    'Receive results': '接收结果',
    'Get structured JSON data via webhook or polling.': '通过 Webhook 或轮询获取结构化 JSON 数据。',
    'MCP server available': 'MCP 服务已可用',
    'MCP server available for Cursor, VS Code, Claude, and Codex.': 'MCP 服务支持 Cursor、VS Code、Claude 和 Codex。',
    'Read the MCP docs →': '阅读 MCP 文档 →',
    'COMPARISON / EVALUATION': '对比 / 评估',
    'How we compare.': '我们的对比。',
    'Comparison performance': '对比表现',
    'Agent + Knowhere': '智能体 + Knowhere',
    'Agent + Unstructured': '智能体 + Unstructured',
    'Agent + MinerU': '智能体 + MinerU',
    'Agent + Markitdown': '智能体 + Markitdown',
    'Token used': 'Token 用量', 'Time used': '耗时', 'Agent loops': '智能体循环',
    'First-time accuracy': '首次准确率', 'Accuracy with feedback': '反馈后准确率', 'Recall': '召回率',
    'Hierarchy, tables, and formulas remain addressable.': '层级、表格和公式保持可定位。',
    'Original page and source regions stay linked.': '原始页面与来源区域持续关联。',
    'Structured output is ready for agent use.': '结构化输出可直接供智能体使用。',
    'Capability matrix': '能力矩阵', 'Published product comparison': '官网公开产品对比',
    'Knowhere': 'Knowhere', 'Others': '其他方案', 'Yes': '是', 'Bad': '较弱', 'No': '不支持', 'Limited': '有限',
    'Page-native visual understanding': '页面原生视觉理解',
    'Simple, transparent pricing.': '简单、透明的定价。',
    'Pay only for what you use. No hidden fees, no complex tiers.': '只为实际使用量付费，没有隐藏费用，也没有复杂套餐。',
    'Adjust your processing budget to estimate page capacity.': '调整处理预算，以估算可处理页数。',
    'Processing budget': '处理预算', 'Estimated processing capacity': '预计可处理页数',
    '$1.50 per 100 pages': '每 100 页 1.50 美元', 'Budget': '预算', 'Estimated budget': '预估预算', '100-page PDFs': '100 页 PDF',
    '500-page documents': '500 页文档', 'Commitment': '最低消费', 'No minimum': '无最低消费',
    'Drag the ruler to model your page volume and budget.': '拖动刻尺，估算页面用量与预算。',
    '100 pages': '100 页', '5,000 pages': '5,000 页', '10,000 pages': '10,000 页',
    'CUSTOM SOLUTIONS': '定制解决方案', 'Need custom solutions?': '需要定制解决方案？',
    'Get custom limits, SLAs, and dedicated support for your enterprise needs.': '获取定制限额、SLA 和满足企业需求的专属支持。',
    'Contact Sales': '联系销售', 'Custom rate limits': '自定义速率限制', 'Priority processing': '优先处理',
    'Dedicated support channel': '专属支持渠道', 'Custom SLA agreements': '定制 SLA 协议',
    'Volume discounts': '批量折扣', 'Invoice billing': '发票结算',
    'Frequently asked questions.': '常见问题。', 'Frequently Asked Questions': '常见问题',
    'When am I charged?': '何时扣费？',
    'Page credits are deducted when a job completes successfully. Failed jobs do not consume credits.': '任务成功完成时扣除页面额度；失败的任务不消耗额度。',
    'Do unused pages roll over?': '未使用的页面额度会结转吗？',
    'Page credits expire 3 months after purchase.': '页面额度在购买 3 个月后到期。',
    'Can I get a refund?': '可以退款吗？',
    'Contact team@knowhereto.ai for refund requests within 14 days of purchase.': '如需退款，请在购买后 14 天内联系 team@knowhereto.ai。',
    'What payment methods are accepted?': '接受哪些付款方式？',
    'We accept all major credit cards through Stripe: Visa, Mastercard, American Express, and more.': '我们通过 Stripe 接受主流信用卡，包括 Visa、Mastercard、American Express 等。',
    'Structure': '结构', 'Ask about this document...': '询问这份文档……',
    'Extract document\nstructure': '提取文档\n结构', 'Clean AI-ready content': '清晰的 AI 就绪内容',
    'Turn document hierarchy, tables, and formulas into clean, structured content for AI.': '将文档层级、表格和公式转化为清晰、可供 AI 使用的结构化内容。',
    'Understand visual\ncontext': '理解视觉\n上下文', 'Original visual context': '原始视觉上下文',
    'Keep pages, diagrams, and layout context available when visual relationships matter.': '当视觉关系承载含义时，保留页面、图表和版式上下文。',
    'Trace every\nresult back': '追溯每项\n结果', 'Page and region source': '页面与区域来源',
    'Link every extracted answer back to its original page, region, and source document.': '将每项提取结果关联回原始页面、区域和来源文档。',
    'Product Vision': '产品愿景', 'Explore cross-document\ncontext': '探索跨文档\n上下文',
    'Capability under evaluation': '能力评估中',
    'This card illustrates possible cross-document context; availability and behavior are unconfirmed.': '此卡片展示潜在的跨文档上下文；可用性与具体行为尚未确认。',
    'Resources': '资源', 'Company': '公司', 'Status': '状态',
    'Prototype page · © 2026 KNOWHERE': '原型页面 · © 2026 KNOWHERE',
    'Feature': '功能',
    'Comparison': '对比', 'Playground': '在线体验', 'GitHub': 'GitHub', 'Blog': '博客', 'Get API Key': '获取 API 密钥',
    'From document input to agent-ready output.': '从文档输入到面向智能体的输出。',
    'A unified pipeline captures text and visual context, builds document structure, and returns traceable output for agents.': '统一处理流程捕获文本与视觉上下文，构建文档结构，并向智能体返回可追溯结果。',
    'Document Input': '文档输入', 'Upload a document in any supported format.': '上传任意受支持格式的文档。', 'Document received': '文档已接收',
    'Text & Visual Capture': '文本与视觉捕获', 'Read native text or apply OCR while preserving every original page.': '读取原生文本或执行 OCR，同时保留每一张原始页面。', 'Content captured': '内容已捕获',
    'Structure & Understanding': '结构与理解', 'Build document structure through Text Parse and Vision Map.': '通过文本解析与视觉地图构建文档结构。', 'Document mapped': '文档已映射',
    'Agent-ready Output': '面向智能体的输出', 'Return structured, navigable, and source-linked context.': '返回结构化、可导航且关联来源的上下文。', 'Structured context ready': '结构化上下文已生成',
    'Upload a PDF, DOCX, XLSX, presentation, image, or other supported document.': '上传 PDF、DOCX、XLSX、演示文稿、图片或其他受支持的文档。',
    'Read native text or apply OCR while preserving every original page and visual region.': '读取原生文本或执行 OCR，同时保留每一张原始页面及视觉区域。',
    'Build hierarchy, tables, formulas, and relationships through Text Parse and Vision Map.': '通过文本解析与视觉地图构建层级、表格、公式和关系。',
    'Return structured JSON, a navigable document map, and source-linked pages for agents.': '向智能体返回结构化 JSON、可导航文档地图和关联来源的页面。',
    'UNDERSTANDING': '理解能力', 'TRUST': '可信度', 'INFRASTRUCTURE': '基础设施',
    'Page-native Vision Map': '页面原生视觉地图',
    'Preserve original pages as visual sources of truth, keeping layouts, diagrams, drawings, and spatial relationships available for agents to inspect on demand.': '将原始页面保留为视觉事实源，让智能体可以按需查看版式、图表、图纸及空间关系。',
    'Original pages & visual regions': '原始页面与视觉区域',
    'Choose a document to inspect its page-native visual map.': '选择一份文档，查看其页面原生视觉地图。',
    'Original source · visual region preserved': '原始来源 · 视觉区域已保留',
    'Everything you need to know about visual understanding, credits, and billing.': '关于视觉理解、页面额度与计费，你需要了解的一切。',
    'Knowhere uses Text Parse for clean electronic content and Vision Map when layouts, drawings, diagrams, scans, or spatial relationships carry meaning. Both remain connected through the same document map, so agents can retrieve text or reopen the original page as needed.': '对于干净的电子内容，Knowhere 使用文本解析；当版式、图纸、图表、扫描内容或空间关系承载含义时，则使用视觉地图。两者都连接在同一张文档地图中，智能体可以根据需要检索文本或重新打开原始页面。',
    'Transform unstructured documents into clean, structured data.': '将非结构化文档转化为清晰的结构化数据。',
    'Extract tables, formulas, and layouts with pixel-perfect precision.': '以像素级精度提取表格、公式和版式。',
    'Start Free Trial': '免费试用',
    'Turn any document into RAG-ready chunks.': '将任意文档转化为可直接用于 RAG 的内容块。',
    'Grab a file below and experience Knowhere turn messy documents into clean & structured JSON.': '选择下方文件，体验 Knowhere 如何将杂乱文档转化为清晰、结构化的 JSON。',
    'Multi-format Support': '多格式支持',
    'Process 20+ major file formats: PDF, DOCX, XLSX, PPT, HTML, Images, and more with unified API.': '通过统一 API 处理 PDF、DOCX、XLSX、PPT、HTML、图片等 20 多种主要文件格式。',
    'Supports local deployment for enterprise long-tail needs: conflict detection, compliance auditing, risk identification, and more.': '支持本地部署，满足冲突检测、合规审计、风险识别等企业长尾需求。',
    'RESTful API with webhooks, comprehensive SDKs for all major languages, and detailed documentation.': '提供 RESTful API、Webhook、覆盖主流语言的完整 SDK 和详细文档。',
    'Connect Knowhere to your workflow with a simple API, webhooks, and MCP.': '通过简洁的 API、Webhook 和 MCP，将 Knowhere 接入你的工作流。',
    'Send a URL or upload a file to our processing queue.': '发送 URL 或上传文件至我们的处理队列。',
    'File Size Limits': '文件大小限制', 'Need higher limits? Contact': '需要更高限额？请联系',
    'for enterprise pricing with custom limits.': '获取提供定制限额的企业定价。',
    'PROCESS': '处理流程', 'Watch Your Data Transform': '查看数据如何完成转化',
    'Our intelligent pipeline processes documents through multiple stages to deliver high-quality results.': '智能处理管线通过多个阶段解析文档，输出高质量结果。',
    'File Formats': '文件格式', 'Formula Accuracy': '公式准确率', 'RAG Top-K Boost': 'RAG Top-K 提升',
    'Input': '输入', 'Upload document (PDF, DOCX, XLSX, etc.).': '上传文档（PDF、DOCX、XLSX 等）。', 'Document received': '文档已接收',
    'OCR & Detection': 'OCR 与检测', 'Extract text, detect tables, formulas, images.': '提取文本，并检测表格、公式和图片。', 'Content detected': '内容已识别',
    'Structure Analysis': '结构分析', 'Analyze layout, relationships, hierarchies.': '分析版式、关系和层级。', 'Structure mapped': '结构已映射',
    'JSON Output': 'JSON 输出', 'Clean, structured data for AI consumption.': '输出供 AI 使用的清晰结构化数据。', 'Structured JSON ready': '结构化 JSON 已生成',
    'Ready to get started?': '准备好开始了吗？',
    'No credit card required': '无需信用卡', 'Free 14-day trial': '14 天免费试用', 'Cancel anytime': '可随时取消',
    'Book A Demo': '预约演示',
    'Hierarchy construction': '层级构建', 'Complex merged cells': '复杂合并单元格', 'Table boundary detection': '表格边界检测',
    'Hierarchical memory & progressive disclosure': '层级记忆与渐进式呈现', 'Vectorless RAG & hybrid RAG': '无向量 RAG 与混合 RAG',
    'All': '全部', 'Structures': '结构', 'Tables': '表格', 'Interpretability': '可解释性', 'Downstream': '下游应用',
    'Agent': '智能体', 'Output': '输出', 'Trace': '追溯', 'Document outline': '文档大纲', 'Awaiting document': '等待文档',
    'Open menu': '打开菜单', 'Everything you need to know about credits, billing, and refunds.': '了解页面额度、计费与退款的常见问题。',
    'Turn complex documents into context your agents can use.': '将复杂文档转化为智能体可用的上下文。',
    'Knowhere preserves structure, visual context, and source links, giving agents information they can navigate, retrieve, and verify.': 'Knowhere 保留结构、视觉上下文与来源链接，为智能体提供可导航、可检索、可验证的信息。',
    'Read the docs': '阅读文档',
    'From complex documents to agent-ready context.': '从复杂文档到面向智能体的上下文。',
    'Turn PDFs, spreadsheets, presentations, and scans into structured, navigable data without losing layouts, visual regions, or source links.': '将 PDF、电子表格、演示文稿和扫描件转化为结构化、可导航的数据，同时保留版式、视觉区域与来源链接。',
    'A document pipeline that keeps context connected.': '一条让上下文始终保持关联的文档处理流程。',
    'Ingest documents': '接收文档',
    'Upload PDFs, spreadsheets, presentations, scans, and other supported formats.': '上传 PDF、电子表格、演示文稿、扫描件及其他受支持格式。',
    'Capture every page': '捕获每一页',
    'Extract text and visual regions while preserving the original page layout.': '提取文本和视觉区域，同时保留原始页面版式。',
    'Map document structure': '映射文档结构',
    'Identify headings, tables, formulas, layouts, and relationships across the document.': '识别文档中的标题、表格、公式、版式与关系。',
    'Return traceable context': '返回可追溯上下文',
    'Receive structured JSON, navigable document maps, and source-linked pages for agents.': '为智能体返回结构化 JSON、可导航文档地图及关联来源的页面。',
    'Built for documents that plain text cannot capture.': '专为纯文本无法捕捉的文档而构建。',
    'Page-native understanding': '页面原生理解',
    'Preserve layouts, diagrams, and spatial relationships so agents can inspect the original page when text is not enough.': '保留版式、图表与空间关系，让智能体在文本不足时查看原始页面。',
    'Agent-ready structure': '面向智能体的结构',
    'Turn flat text into hierarchical context that agents can scan first and expand when needed.': '将扁平文本转化为层级上下文，供智能体先浏览、再按需展开。',
    'Formula recognition': '公式识别',
    'Extract mathematical formulas and chemical structures in formats agents and downstream systems can use.': '以智能体和下游系统可用的格式提取数学公式与化学结构。',
    'Source-level tracing': '来源级追溯',
    'Trace extracted content back to its page and source region for easier verification.': '将提取内容追溯至对应页面与来源区域，便于核验。',
    'On-premise deployment': '本地部署',
    'Deploy Knowhere locally when document privacy, compliance requirements, or infrastructure control matters.': '当文档隐私、合规要求或基础设施控制至关重要时，在本地部署 Knowhere。',
    'API-first integration': 'API 优先集成',
    'Connect Knowhere to existing workflows through REST APIs, webhooks, SDKs, or MCP.': '通过 REST API、Webhook、SDK 或 MCP，将 Knowhere 接入现有工作流。',
    'See how Knowhere handles complex documents differently.': '了解 Knowhere 如何以不同方式处理复杂文档。',
    'Compare how different approaches handle document structure, complex layouts, visual context, and source tracing.': '比较不同方案如何处理文档结构、复杂版式、视觉上下文与来源追溯。',
    'Document hierarchy': '文档层级', 'Table boundaries': '表格边界', 'Source tracing': '来源追溯',
    'Progressive context': '渐进式上下文', 'Visual understanding': '视觉理解',
    'Add document understanding to your workflow in minutes.': '几分钟内为你的工作流加入文档理解能力。',
    'Submit a document through the API, receive structured results, and connect them to your existing agent workflow.': '通过 API 提交文档、接收结构化结果，并将其接入现有的智能体工作流。',
    'Send a document, receive structured results, and connect them to the tools your agents already use.': '发送文档、接收结构化结果，并将其连接到智能体已经使用的工具。',
    'Use Knowhere through MCP': '通过 MCP 使用 Knowhere',
    'Bring structured document context into Cursor, VS Code, Claude, or Codex.': '将结构化文档上下文带入 Cursor、VS Code、Claude 或 Codex。',
    'Create an API key': '创建 API 密钥', 'Generate your API key from the developer dashboard.': '从开发者控制台生成 API 密钥。',
    'Submit a document': '提交文档', 'Send a file URL or upload a supported document.': '发送文件 URL 或上传受支持的文档。',
    'Receive structured results': '接收结构化结果', 'Retrieve structured JSON through webhooks or polling.': '通过 Webhook 或轮询获取结构化 JSON。',
    'Start free trial': '免费试用', 'Book a demo': '预约演示',
    'Need custom limits or deployment support?': '需要定制限额或部署支持？',
    'Custom limits, deployment, support, and SLAs.': '自定义限额、部署、支持及 SLA。',
    'Talk to our team': '联系我们的团队',
    'Support requirements': '支持需求', 'SLA requirements': 'SLA 需求', 'Commercial terms': '商业条款',
    'Discuss throughput limits for your production traffic.': '根据生产流量讨论合适的吞吐上限。',
    'Plan priority handling for time-sensitive workloads.': '规划时间敏感任务的优先处理方式。',
    'Review managed, dedicated, or self-hosted options.': '评估托管、专属或私有化部署方案。',
    'Align support channels and response expectations.': '明确支持渠道与响应预期。',
    'Define your uptime and service-level needs.': '明确可用性与服务等级需求。',
    'Discuss billing and terms for your usage.': '根据使用规模讨论结算方式与条款。',
    'Ready to build with better document context?': '准备好使用更好的文档上下文进行构建了吗？',
    'Connect your agent workflow and see how Knowhere handles documents that plain text pipelines miss.': '连接你的智能体工作流，看看 Knowhere 如何处理纯文本管线容易遗漏的文档。',
    '>_Product': '>_产品', '>_Process': '>_流程', '>_Capabilities': '>_能力',
    '>_Comparison': '>_对比', '>_Integration': '>_集成', '>_Pricing': '>_价格',
    '>_Enterprise': '>_企业版', '>_Faq': '>_常见问题',
    'Works with common file formats, including': '支持常见文件格式，包括',
    'DOCX, PDF, JPG, PPTX, XLSX, CSV, PNG, MD, JSON, and TXT.': 'DOCX、PDF、JPG、PPTX、XLSX、CSV、PNG、MD、JSON 和 TXT。',
    'Support for': '即将支持',
    'EPUB, HTML, XML, MP4, MP3, and skills.md': 'EPUB、HTML、XML、MP4、MP3 和 skills.md',
    'is coming soon.': '。',
    'Raw Docs': '原始文档', 'token used': 'Token 用量', 'time used (s)': '耗时（秒）', 'agent loops': '智能体循环',
    'time used': '耗时', 'first-time acc': '首次准确率', 'acc with user feedback': '含用户反馈的准确率', 'recall': '召回率',
    'On a benchmark of 50 retrieval tasks across 500+ curated documents, Knowhere achieved significantly higher first-pass accuracy and recall than raw document pipelines, while using fewer tokens, fewer agent loops, and lower latency.': '在对 500 多份精选文档执行 50 项检索任务的基准测试中，Knowhere 的首次准确率和召回率显著高于原始文档管线，同时使用更少的 Token、更少的智能体循环，并实现更低的延迟。',
    'Top-K boost ~10%+ in production': '生产环境中 Top-K 提升约 10%+', '50%+ token savings on graphs': '图谱构建节省 50%+ Token',
    'Read the MCP docs': '阅读 MCP 文档', 'Deployment options': '部署选项',
    '© 2026 Knowhere API. Allrights reserved': '© 2026 Knowhere API。保留所有权利。',
    'Main navigation': '主导航', 'Mobile navigation': '移动端导航', 'Footer links': '页脚链接',
    'Knowhere, back to top': 'Knowhere，返回页面顶部',
    'Interactive four-stage document processing pipeline from original document to RAG structure': '从原始文档到 RAG 结构的四阶段交互式文档处理流程',
    'Interactive document scan and source traceability demonstration': '交互式文档扫描与来源追溯演示',
    'Preset documents': '预设文档', 'Structured document workspace': '结构化文档工作台',
    'Structured document views': '结构化文档视图', 'Document connections': '文档连接',
    'Traceable output status': '可追溯输出状态', 'Agent configuration': '智能体配置',
    'Data transformation stages': '数据转换阶段', 'Data transformation image placeholder': '数据转换图片占位',
    'Illustrative formats': '示意格式', 'Illustrative document pipeline comparison': '示意文档处理流程对比',
    'Compared document processing tools': '参与对比的文档处理工具',
    'Document understanding capability matrix': '文档理解能力矩阵', 'Code examples': '代码示例',
    'Close notification': '关闭通知',
    'See how Knowhere turns documents into structured, traceable context.': '查看 Knowhere 如何将文档转化为结构化、可追溯的上下文。',
    'Explore page-level evidence, text content, and spreadsheet tables across PDF, Word, and Excel.': '探索 PDF 页面溯源、Word 文本内容和 Excel 表格提取。',
    'Choose a file format': '选择文件格式',
    'View all supported formats': '查看全部支持格式',
    'Q4 performance summary': '第四季度业绩摘要',
    'Q4 performance': '第四季度业绩',
    'summary': '摘要',
    'Regional': '区域',
    'performance': '表现',
    'Operating': '运营',
    'efficiency': '效率',
    'Q4 Market Update.pdf': '第四季度市场更新.pdf',
    'Financial Summary.pdf': '财务摘要.pdf',
    'Regional review.pdf': '区域回顾.pdf',
    'EMEA forecast.xlsx': 'EMEA 预测.xlsx',
    'APAC briefing.pptx': '亚太地区简报.pptx',
    'Operating model.pdf': '运营模型.pdf',
    'Automation Review.xlsx': '自动化回顾.xlsx',
    'Source-backed context': '有来源支撑的上下文',
    'AI-generated brief': 'AI 生成摘要',
    'Synthesized from': '综合自',
    'source region': '个来源区域',
    'source regions': '个来源区域',
    'across': '涉及',
    'From ingestion to structured output, every step keeps the document connected to its original source.': '从接收文档到输出结构化结果，每一步都让内容与原始来源保持关联。',
    'Works with common document, presentation,': '支持常见的文档、演示文稿、',
    'spreadsheet, image, and text formats:': '电子表格、图片与文本格式：',
    'Support for EPUB, HTML, XML, MP4,': '即将支持 EPUB、HTML、XML、MP4、',
    'MP3, and SKILL.md is': 'MP3 和 SKILL.md，',
    'coming soon.': '敬请期待。',
    'Compare document understanding across structure, accuracy, and traceability.': '从结构、准确性与可追溯性维度对比文档理解能力。',
    'See how Knowhere and other document-processing tools compare across efficiency, accuracy, structure, and source tracing.': '比较 Knowhere 与其他文档处理工具在效率、准确性、结构和来源追溯方面的表现。',
    'Typical document parsers': '常见文档解析器',
    'Supported': '支持',
    'Not supported': '不支持',
    'Get an API key': '获取 API 密钥',
    'Sign up and generate your API key from the dashboard.': '注册并从控制台生成 API 密钥。',
    'Get structured JSON through webhook or polling.': '通过 Webhook 或轮询获取结构化 JSON。',
  });
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  const headingSourceText = new WeakMap();
  $$('[data-heading-primary]').forEach(heading => headingSourceText.set(heading, heading.textContent.trim()));
  let activeLanguage = 'en';
  let storyReady = false;
  let headingEmphasisReady = false;
  let pricingReady = false;
  function localizeText(value) {
    if (activeLanguage !== 'zh') return value;
    const sourceCountMatch = value.match(/^(\d+) source regions?$/);
    if (sourceCountMatch) return `${sourceCountMatch[1]} 个来源区域`;
    const documentCountMatch = value.match(/^(\d+) documents?$/);
    if (documentCountMatch) return `${documentCountMatch[1]} 份文档`;
    return zh[value] || value.replaceAll('Illustrative only — no real endpoint', '仅作示意 — 非真实接口');
  }
  function translatePage() {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (parent.closest('script, style, [data-pricing-pages], [data-pricing-price], [data-pricing-pdf], [data-pricing-large], .ai-output-report, .text-reveal, .text-reveal-content, [translate="no"], [data-no-translate]')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      const original = originalText.get(node);
      const leading = original.match(/^\s*/)[0];
      const trailing = original.match(/\s*$/)[0];
      const key = original.trim();
      node.nodeValue = `${leading}${localizeText(key)}${trailing}`;
    });
    $$('[aria-label], [title], [placeholder], [alt]').forEach(element => {
      if (element.closest('.ai-output-report, .text-reveal, .text-reveal-content, [translate="no"], [data-no-translate]')) return;
      if (!originalAttributes.has(element)) originalAttributes.set(element, new Map());
      const attributes = originalAttributes.get(element);
      ['aria-label', 'title', 'placeholder', 'alt'].forEach(attribute => {
        if (!element.hasAttribute(attribute)) return;
        if (!attributes.has(attribute)) attributes.set(attribute, element.getAttribute(attribute));
        element.setAttribute(attribute, localizeText(attributes.get(attribute)));
      });
    });
  }
  function setLanguage(language) {
    const isChinese = language === 'zh';
    activeLanguage = language;
    document.body.dataset.language = language;

    translatePage();
    if (storyReady) renderStoryCanvas();
    if (headingEmphasisReady) refreshHeadingEmphasis();
    if (pricingReady) syncPricingCalculator();
  }
  addEventListener('knowhere-language-change', event => setLanguage(event.detail.language));
  setLanguage(readSiteLanguage());

  $('.skip-link')?.addEventListener('click', () => {
    setTimeout(() => $('#main')?.focus({ preventScroll: true }), 0);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !toast.hidden) toast.hidden = true;
  });
  function setupTabs(tablist, onChange) {
    if (!tablist) return;
    const tabs = $$('[role="tab"]', tablist);
    if (!tabs.length) return;
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(index));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); activate(next); tabs[next].focus(); }
      });
    });
    function activate(index) {
      const activeControl = tabs[index].getAttribute('aria-controls');
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      const panelIds = new Set(tabs.map(tab => tab.getAttribute('aria-controls')));
      panelIds.forEach(id => {
        const panel = root.querySelector(`#${CSS.escape(id)}`);
        if (panel && panel.getAttribute('role') === 'tabpanel') panel.hidden = id !== activeControl;
      });
      if (onChange) onChange(tabs[index], index);
    }
    activate(Math.max(0, tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true')));
  }
  const tablists = $$('.tabs[role="tablist"]');
  tablists.forEach(tablist => setupTabs(tablist));

  $$('[data-hero-source]').forEach(button => button.addEventListener('click', () => {
    $$('[data-hero-source]').forEach(item => item.classList.toggle('is-active', item === button));
    $('[data-hero-coordinate]').textContent = `${localizeText('Page 12')} · ${activeLanguage === 'zh' ? '区域' : 'Region'} ${button.dataset.heroSource}`;
  }));

  $$('.format-chips button').forEach(button => {
    button.addEventListener('click', () => {
      $$('.format-chips button').forEach(item => item.classList.toggle('is-active', item === button));
    });
  });

  $('.copy-code')?.addEventListener('click', async event => {
    const copyButton = event.currentTarget;
    const selected = $('.code-card [role="tab"][aria-selected="true"]');
    const code = $(`#${selected.getAttribute('aria-controls')} code`).textContent;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const field = document.createElement('textarea');
        field.value = code;
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.append(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        if (!copied) throw new Error('Copy command was rejected');
      }
      copyButton.textContent = localizeText('Copied');
      $('[data-copy-live]').textContent = localizeText('Code copied to clipboard.');
      setTimeout(() => { copyButton.textContent = localizeText('Copy'); }, 2000);
    } catch {
      showToast('Copy unavailable — select the code manually.');
    }
  });

  $$('.faq-list details').forEach(details => {
    const summary = $('summary', details);
    const syncExpanded = () => summary.setAttribute('aria-expanded', String(details.open));
    let closeTimer;
    const finishClosing = () => {
      if (!details.classList.contains('is-closing')) return;
      clearTimeout(closeTimer);
      details.open = false;
      details.classList.remove('is-closing');
      syncExpanded();
    };
    summary.addEventListener('click', event => {
      if (!details.open) return;
      event.preventDefault();
      if (details.classList.contains('is-closing')) {
        clearTimeout(closeTimer);
        details.classList.remove('is-closing');
        return;
      }
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        details.open = false;
        syncExpanded();
        return;
      }
      details.classList.add('is-closing');
      closeTimer = setTimeout(finishClosing, 260);
    });
    details.addEventListener('transitionend', event => {
      if (event.pseudoElement === '::details-content' && event.propertyName === 'block-size') {
        finishClosing();
      }
    });
    details.addEventListener('toggle', syncExpanded);
    syncExpanded();
  });

  const storyContent = {
    structure: { heading: 'Ingest documents', summary: 'Upload PDFs, spreadsheets, presentations, scans, and other supported formats.' },
    visual: { heading: 'Capture every page', summary: 'Extract text and visual regions while preserving the original page layout.' },
    source: { heading: 'Map document structure', summary: 'Identify headings, tables, formulas, layouts, and relationships across the document.' },
    relations: { heading: 'Return traceable context', summary: 'Receive structured JSON, navigable document maps, and source-linked pages for agents.' }
  };
  function renderStoryCanvas() {
    storyCards.forEach(card => {
      const content = storyContent[card.dataset.story];
      $('[data-story-heading]', card).textContent = localizeText(content.heading);
      $('[data-story-summary]', card).textContent = localizeText(content.summary);
    });
  }
  const storyCards = $$('.story-card');
  storyReady = true;
  renderStoryCanvas();

  function replaceHeadingText(heading, text) {
    const emphasis = heading.dataset.headingPrimary
      ? { phrase: heading.dataset.headingPrimary, className: 'heading-primary' }
      : null;
    const phraseIndex = emphasis ? text.indexOf(emphasis.phrase) : -1;
    if (phraseIndex < 0) {
      heading.replaceChildren(document.createTextNode(text));
      return;
    }
    const phrase = document.createElement('span');
    phrase.className = emphasis.className;
    phrase.textContent = emphasis.phrase;
    heading.replaceChildren(
      document.createTextNode(text.slice(0, phraseIndex)),
      phrase,
      document.createTextNode(text.slice(phraseIndex + emphasis.phrase.length))
    );
  }
  function refreshHeadingEmphasis() {
    $$('[data-heading-primary]').forEach(heading => replaceHeadingText(
      heading,
      localizeText(headingSourceText.get(heading) || heading.textContent.trim())
    ));
  }
  headingEmphasisReady = true;
  refreshHeadingEmphasis();

  const enteringText = $$([
    '#main p',
    '#main h3',
    '#main li',
    '#main blockquote',
    '#main .button-row',
    '#main .format-chips',
    '#main .tabs',
    '#main summary'
  ].join(',')).filter(element => (
    !element.closest('[hidden], #top, #playground')
    && !element.closest('.converging-helix-controls')
    && !element.closest('.story-card, .formats-secondary-grid .format-feature')
    && !element.closest([
      '.format-orbit-copy',
      '#comparison .comparison-chart',
      '#integration .integration-grid',
      '#pricing .pricing-calculator',
      '#pricing .pricing-file-limits',
      '#enterprise .enterprise-metric',
      '#faq .faq-list'
    ].join(', '))
    && !element.matches('.section-no')
  ));
  const reducedTextMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  enteringText.forEach(element => element.classList.add('text-enter'));
  if (reducedTextMotion || !('IntersectionObserver' in window)) {
    enteringText.forEach(element => element.classList.add('is-text-visible'));
  } else {
    const textEnterObserver = new IntersectionObserver(entries => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = `${Math.min(index * 25, 100)}ms`;
        entry.target.classList.add('is-text-visible');
        textEnterObserver.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -20% 0px' });
    enteringText.forEach(element => textEnterObserver.observe(element));
  }

  const enteringCardGroups = [
    $('#capabilities .story-card-stack'),
    $('#formats .formats-secondary-grid'),
    $('#enterprise .enterprise-metrics')
  ].filter(Boolean);
  enteringCardGroups.forEach(group => {
    [...group.children].forEach((card, index) => {
      card.classList.add('card-enter');
      card.style.setProperty('--card-enter-delay', `${index * 60}ms`);
    });
  });
  const showCardGroup = group => {
    [...group.children].forEach(card => card.classList.add('is-card-visible'));
  };
  if (reducedTextMotion || !('IntersectionObserver' in window)) {
    enteringCardGroups.forEach(showCardGroup);
  } else {
    const cardEnterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        showCardGroup(entry.target);
        cardEnterObserver.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -20% 0px' });
    enteringCardGroups.forEach(group => cardEnterObserver.observe(group));
  }

  const enteringContent = $$([
    '#comparison .comparison-chart',
    '#integration .integration-grid',
    '#pricing .pricing-calculator',
    '#faq .faq-list'
  ].join(', '));
  const pricingFileLimits = $('#pricing .pricing-file-limits');
  enteringContent.forEach(content => content.classList.add('content-enter'));
  pricingFileLimits?.classList.add('content-enter');
  const showContent = content => {
    content.classList.add('is-content-visible');
    if (content.matches('#pricing .pricing-calculator')) {
      pricingFileLimits?.classList.add('is-content-visible');
    }
  };
  if (reducedTextMotion || !('IntersectionObserver' in window)) {
    enteringContent.forEach(showContent);
  } else {
    const contentEnterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        showContent(entry.target);
        contentEnterObserver.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -20% 0px' });
    enteringContent.forEach(content => contentEnterObserver.observe(content));
  }

const pricingPages = $('#pricing-pages');
const pricingPageCount = $('#pricing-page-count');
const pricingRangeHandle = $('[data-pricing-range-handle]');
const pricingRangeBudget = $('[data-pricing-range-budget]');
const pricingRangeControl = pricingRangeHandle.parentElement;
function pricingNumberFlow(host) {
  let flow = host.querySelector('number-flow');
  if (!(flow instanceof NumberFlow)) {
    flow = new NumberFlow();
    host.replaceChildren(flow);
  }
  return flow;
}
function syncPricingNumber(host, { locales, format, prefix = '', suffix = '', value }) {
  const flow = pricingNumberFlow(host);
  flow.locales = locales;
  flow.format = format;
  flow.numberPrefix = prefix;
  flow.numberSuffix = suffix;
  const hydrate = !flow.hasAttribute('data-pricing-ready');
  if (hydrate) flow.animated = false;
  flow.update(value);
  if (hydrate) {
    flow.animated = true;
    flow.setAttribute('data-pricing-ready', '');
  }
}
function syncPricingCalculator() {
  const pages = Number(pricingPages.value);
  const amount = (pages / 100) * 1.5;
  const rangeMin = Number(pricingPages.min);
  const rangeMax = Number(pricingPages.max);
  const locale = activeLanguage === 'zh' ? 'zh-CN' : 'en-US';
  const pageLabel = `${pages.toLocaleString(locale)} ${localizeText('pages')}`;
  const pdfCount = Math.floor(pages / 100);
  const largeDocumentCount = Math.floor(pages / 500);
  const integerFormat = { maximumFractionDigits: 0 };
  const priceFormat = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  pricingPageCount.value = String(pages);
  pricingPageCount.style.setProperty('--pricing-page-digits', String(Math.max(4, String(pages).length)));
  $$('[data-pricing-price]').forEach(element => {
    syncPricingNumber(element, {
      locales: locale,
      format: priceFormat,
      prefix: '$',
      value: amount,
    });
  });
  syncPricingNumber($('[data-pricing-pdf]'), {
    locales: locale,
    format: integerFormat,
    suffix: ` ${localizeText(pdfCount === 1 ? 'document' : 'documents')}`,
    value: pdfCount,
  });
  syncPricingNumber($('[data-pricing-large]'), {
    locales: locale,
    format: integerFormat,
    suffix: ` ${localizeText(largeDocumentCount === 1 ? 'document' : 'documents')}`,
    value: largeDocumentCount,
  });
  const progress = `${((pages - rangeMin) / (rangeMax - rangeMin)) * 100}%`;
  pricingRangeControl.style.setProperty('--pricing-progress', progress);
  pricingRangeHandle.style.setProperty('--pricing-progress', progress);
  pricingRangeBudget.style.setProperty('--pricing-progress', progress);
  pricingPages.setAttribute('aria-label', localizeText('Pages to process'));
  pricingPages.setAttribute('aria-valuetext', pageLabel);
}
pricingPages.addEventListener('input', syncPricingCalculator);
pricingPageCount.addEventListener('input', () => {
  if (!pricingPageCount.value || !pricingPageCount.validity.valid) return;
  pricingPages.value = pricingPageCount.value;
  syncPricingCalculator();
});
pricingPageCount.addEventListener('blur', () => {
  const step = Number(pricingPages.step);
  const pages = Math.round(Number(pricingPageCount.value) / step) * step;
  pricingPages.value = String(Math.min(Number(pricingPages.max), Math.max(Number(pricingPages.min), pages)));
  syncPricingCalculator();
});
pricingPageCount.addEventListener('keydown', event => {
  if (event.key === 'Enter') pricingPageCount.blur();
});
const pricingControlCard = pricingRangeHandle.closest('.pricing-control-card');
let pricingDragPointer = null;
let pricingDragOffset = 0;
function syncPricingFromPointer(clientX) {
  const bounds = pricingRangeHandle.parentElement.getBoundingClientRect();
  const rangeMin = Number(pricingPages.min);
  const rangeMax = Number(pricingPages.max);
  const rangeStep = Number(pricingPages.step) || 1;
  const ratio = Math.max(0, Math.min(1, (clientX - pricingDragOffset - bounds.left) / bounds.width));
  const nextValue = rangeMin + Math.round(((rangeMax - rangeMin) * ratio) / rangeStep) * rangeStep;
  pricingPages.value = String(nextValue);
  pricingPages.dispatchEvent(new Event('input', { bubbles: true }));
}
pricingControlCard.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  pricingDragPointer = event.pointerId;
  if (pricingRangeHandle.contains(event.target)) {
    const handleBounds = pricingRangeHandle.getBoundingClientRect();
    pricingDragOffset = event.clientX - (handleBounds.left + handleBounds.width / 2);
  } else {
    pricingDragOffset = 0;
    syncPricingFromPointer(event.clientX);
  }
  pricingRangeHandle.classList.add('is-dragging');
  document.documentElement.classList.add('is-pricing-dragging');
  pricingControlCard.setPointerCapture(event.pointerId);
  pricingPages.focus({ preventScroll: true });
  event.preventDefault();
});
pricingControlCard.addEventListener('pointermove', event => {
  if (event.pointerId !== pricingDragPointer) return;
  if (event.pointerType === 'mouse' && (event.buttons & 1) === 0) {
    finishPricingDrag(event);
    return;
  }
  event.preventDefault();
  syncPricingFromPointer(event.clientX);
});
function finishPricingDrag(event) {
  if (pricingDragPointer === null) return;
  const pointerId = event?.pointerId ?? pricingDragPointer;
  if (pointerId !== pricingDragPointer) return;
  pricingDragPointer = null;
  pricingRangeHandle.classList.remove('is-dragging');
  document.documentElement.classList.remove('is-pricing-dragging');
  if (pricingControlCard.hasPointerCapture(pointerId)) {
    pricingControlCard.releasePointerCapture(pointerId);
  }
}
pricingControlCard.addEventListener('pointerup', finishPricingDrag);
pricingControlCard.addEventListener('pointercancel', finishPricingDrag);
pricingControlCard.addEventListener('lostpointercapture', finishPricingDrag);
addEventListener('blur', () => finishPricingDrag());
pricingReady = true;
syncPricingCalculator();

  $$('[data-title-tiles]').forEach(tileCanvas => {
    const title = tileCanvas.parentElement;
    const tileContext = tileCanvas.getContext('2d');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let tileWidth = 0;
    let tileHeight = 0;
    let tileDpr = 1;
    let tileCell = 3;
    let titleTiles = [];
    let tileFrame = 0;
    let tileVisible = true;
    let tileLastDraw = 0;
    let tileTime = 0;
    let tileRebuildFrame = 0;
    const tilePointer = { active: false, rawX: 0, rawY: 0, x: 0, y: 0, previousX: 0, previousY: 0, speed: 0 };
    const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
    const smoothstep = (value, edge0, edge1) => {
      const amount = clamp((value - edge0) / (edge1 - edge0), 0, 1);
      return amount * amount * (3 - 2 * amount);
    };

    function titleTextNode() {
      return [...title.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
    }

    function buildTitleTileMask() {
      const textNode = titleTextNode();
      if (!textNode) return;
      const bounds = title.getBoundingClientRect();
      tileWidth = Math.max(1, Math.round(bounds.width));
      tileHeight = Math.max(1, Math.round(bounds.height));
      tileDpr = Math.min(devicePixelRatio || 1, 2);
      tileCanvas.width = Math.round(tileWidth * tileDpr);
      tileCanvas.height = Math.round(tileHeight * tileDpr);
      tileContext.setTransform(tileDpr, 0, 0, tileDpr, 0, 0);
      tileCell = Math.max(2, Math.round(tileWidth / 280));

      const mask = document.createElement('canvas');
      mask.width = tileWidth;
      mask.height = tileHeight;
      const maskContext = mask.getContext('2d', { willReadFrequently: true });
      const styles = getComputedStyle(title);
      maskContext.fillStyle = '#000';
      maskContext.textAlign = 'left';
      maskContext.textBaseline = 'middle';
      maskContext.font = `${styles.fontStyle} ${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
      if ('letterSpacing' in maskContext) maskContext.letterSpacing = styles.letterSpacing;

      const source = textNode.nodeValue;
      const range = document.createRange();
      const lines = [];
      [...source].forEach((character, index) => {
        if (!character.trim()) return;
        range.setStart(textNode, index);
        range.setEnd(textNode, index + character.length);
        const rect = range.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        let line = lines.find(item => Math.abs(item.top - rect.top) < 3);
        if (!line) {
          line = { top: rect.top, bottom: rect.bottom, left: rect.left, start: index, end: index };
          lines.push(line);
        }
        line.top = Math.min(line.top, rect.top);
        line.bottom = Math.max(line.bottom, rect.bottom);
        line.left = Math.min(line.left, rect.left);
        line.start = Math.min(line.start, index);
        line.end = Math.max(line.end, index);
      });
      lines.forEach(line => {
        const text = source.slice(line.start, line.end + 1).trim();
        maskContext.fillText(text, line.left - bounds.left, (line.top + line.bottom) / 2 - bounds.top);
      });
      range.detach?.();

      const pixels = maskContext.getImageData(0, 0, tileWidth, tileHeight).data;
      titleTiles = [];
      for (let y = tileCell / 2; y < tileHeight; y += tileCell) {
        for (let x = tileCell / 2; x < tileWidth; x += tileCell) {
          const pixelX = Math.min(tileWidth - 1, Math.floor(x));
          const pixelY = Math.min(tileHeight - 1, Math.floor(y));
          if (pixels[(pixelY * tileWidth + pixelX) * 4 + 3] < 96) continue;
          titleTiles.push({
            x,
            y,
            seed: Math.random(),
            spark: Math.random() > 0.92,
            lit: 0
          });
        }
      }
      drawTitleTiles(performance.now(), false);
    }

    function drawTitleTiles(now, animate = true) {
      tileContext.clearRect(0, 0, tileWidth, tileHeight);
      if (animate && !reducedMotion.matches) tileTime += 0.02;
      const previousX = tilePointer.x;
      const previousY = tilePointer.y;
      if (tilePointer.active) {
        tilePointer.x += (tilePointer.rawX - tilePointer.x) * 0.42;
        tilePointer.y += (tilePointer.rawY - tilePointer.y) * 0.42;
      }
      const movement = Math.hypot(tilePointer.x - previousX, tilePointer.y - previousY);
      tilePointer.speed = tilePointer.speed * 0.88 + movement * 0.12;
      const reach = clamp(tileHeight * 0.42 + tilePointer.speed, 46, tileHeight * 0.72);

      titleTiles.forEach(tile => {
        let pointerLight = 0;
        if (tilePointer.active && !reducedMotion.matches) {
          const dx = tile.x - tilePointer.x;
          const dy = tile.y - tilePointer.y;
          const distance = Math.hypot(dx, dy);
          const angle = Math.atan2(dy, dx);
          const wobble = 1 + 0.18 * Math.sin(angle * 3 + tileTime * 1.4) + 0.1 * Math.sin(angle * 5 - tileTime);
          pointerLight = smoothstep(1 - distance / Math.max(1, reach * wobble), 0, 1);
        }
        tile.lit += (pointerLight - tile.lit) * (pointerLight > tile.lit ? 0.2 : 0.035);
        const u = tile.x / Math.max(1, tileWidth);
        const v = tile.y / Math.max(1, tileHeight);
        const flow = (
          Math.sin((u * 1.8 + tileTime * 0.12) * Math.PI * 2) +
          0.7 * Math.sin((v * 2.2 - u + tileTime * 0.08) * Math.PI * 2 + 1.4) +
          0.45 * Math.cos((u * 3.1 + v * 2.4 - tileTime * 0.06) * Math.PI * 2)
        );
        const wave = smoothstep(flow, 0.15, 1.55);
        const brightness = Math.max(wave * 0.68, tile.lit);
        const breathing = 0.5 + 0.5 * Math.sin(tile.seed * Math.PI * 2 + tileTime * 1.2);
        const baseSize = 0.28 + breathing * 0.08;
        const size = tileCell * (baseSize + (0.9 - baseSize) * brightness);
        const half = size / 2;
        tileContext.fillStyle = `rgba(255,255,255,${(0.08 + brightness * 0.44).toFixed(3)})`;
        tileContext.fillRect(tile.x - half, tile.y - half, size, size);
        if (tile.spark && tile.lit > 0.5 && Math.sin(now * 0.018 + tile.seed * 30) > 0.82) {
          const sparkSize = size * 1.45;
          tileContext.fillStyle = `rgba(255,255,255,${(tile.lit * 0.5).toFixed(3)})`;
          tileContext.fillRect(tile.x - sparkSize / 2, tile.y - sparkSize / 2, sparkSize, sparkSize);
        }
      });
    }

    function animateTitleTiles(now) {
      tileFrame = 0;
      if (!tileVisible || reducedMotion.matches || document.hidden) return;
      if (now - tileLastDraw >= 32) {
        drawTitleTiles(now);
        tileLastDraw = now;
      }
      tileFrame = requestAnimationFrame(animateTitleTiles);
    }

    function startTitleTiles() {
      if (!tileFrame && tileVisible && !reducedMotion.matches && !document.hidden) {
        tileFrame = requestAnimationFrame(animateTitleTiles);
      }
    }

    function scheduleTitleTileRebuild() {
      cancelAnimationFrame(tileRebuildFrame);
      tileRebuildFrame = requestAnimationFrame(buildTitleTileMask);
    }

    addEventListener('pointermove', event => {
      if (!tileVisible) return;
      const bounds = title.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const nearTitle = x >= -40 && y >= -40 && x <= bounds.width + 40 && y <= bounds.height + 40;
      if (!nearTitle) {
        tilePointer.active = false;
        return;
      }
      if (!tilePointer.active) {
        tilePointer.x = x;
        tilePointer.y = y;
      }
      tilePointer.rawX = x;
      tilePointer.rawY = y;
      tilePointer.active = true;
    }, { passive: true });
    document.addEventListener('pointerleave', () => { tilePointer.active = false; });
    document.addEventListener('visibilitychange', startTitleTiles);
    reducedMotion.addEventListener?.('change', () => {
      if (reducedMotion.matches) {
        cancelAnimationFrame(tileFrame);
        tileFrame = 0;
        drawTitleTiles(performance.now(), false);
      } else startTitleTiles();
    });
    new ResizeObserver(scheduleTitleTileRebuild).observe(title);
    new MutationObserver(scheduleTitleTileRebuild).observe(title, { characterData: true, childList: true, subtree: true });
    new IntersectionObserver(entries => {
      tileVisible = entries[0]?.isIntersecting ?? false;
      if (tileVisible) startTitleTiles();
      else {
        cancelAnimationFrame(tileFrame);
        tileFrame = 0;
      }
    }, { rootMargin: '120px' }).observe(title);
    document.fonts?.ready.then(scheduleTitleTileRebuild);
    scheduleTitleTileRebuild();
  });

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .08 });
  $$('.reveal').forEach(section => revealObserver.observe(section));
})();

  return () => {};

(() => {
    'use strict';

    const svg = document.getElementById('hero-b-hourglass');
    if (!svg) return;

    const DATA = [
      { label: 'VISITORS', value: 4200 },
      { label: 'SIGN-UPS', value: 1900 },
      { label: 'ACTIVATED', value: 960 },
      { label: 'RETAINED', value: 540 },
      { label: 'PAYING', value: 310 }
    ];
    const WIRE = {
      FAINTDATA: 'var(--mist-white-600)',
      RAMP: [
        'var(--mist-white-500)',
        'var(--mist-white-600)',
        'var(--mist-white-700)',
        'var(--mist-white-950)',
        'var(--coral-signal-500)'
      ]
    };
    const NS = 'http://www.w3.org/2000/svg';
    const el = (parent, tag, attrs) => {
      const node = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
      parent.appendChild(node);
      return node;
    };
    const rnd = (i, k) => Math.abs(((i * 73856093) ^ (k * 19349663)) % 1000) / 1000;

    function render() {
      svg.querySelectorAll(':scope > :not(title):not(desc)').forEach(node => node.remove());
      const centerX = 185;
      const stageY = index => 34 + index * 64;
      const maxValue = Math.max(...DATA.map(stage => stage.value));
      const widthFor = value => value / maxValue * 290;
      const tickCounts = DATA.map(stage => Math.max(1, Math.round(stage.value / 40)));
      const stageTracks = [Array.from({ length: tickCounts[0] }, (_, index) => index)];
      const selectEvenly = (previous, count) => Array.from(
        { length: Math.min(count, previous.length) },
        (_, index) => previous[Math.min(previous.length - 1, Math.floor((index + .5) * previous.length / count))]
      );

      for (let stage = 1; stage < DATA.length; stage += 1) {
        stageTracks.push(selectEvenly(stageTracks[stage - 1], tickCounts[stage]));
      }

      const visualOrders = stageTracks.map((tracks, stage) => stage === 0
        ? [...tracks]
        : [...tracks].sort((a, b) =>
          rnd(a + 1, stage * 29 + 7) - rnd(b + 1, stage * 29 + 7) || a - b
        )
      );
      const positions = visualOrders.map((tracks, stage) => {
        const halfWidth = widthFor(DATA[stage].value) / 2;
        return new Map(tracks.map((trackId, rank) => [
          trackId,
          centerX - halfWidth
            + (rank + .5) / tracks.length * halfWidth * 2
            + (rnd(trackId + 1, stage + 3) - .5) * 3
        ]));
      });
      const lastStageByTrack = new Map(stageTracks[0].map(trackId => [trackId, 0]));
      stageTracks.forEach((tracks, stage) =>
        tracks.forEach(trackId => lastStageByTrack.set(trackId, stage))
      );

      DATA.forEach((stage, index) => {
        const halfWidth = widthFor(stage.value) / 2;
        el(svg, 'line', {
          x1: centerX - halfWidth - 5,
          y1: stageY(index),
          x2: centerX + halfWidth + 5,
          y2: stageY(index),
          class: 'hero-b-stage-rail hero-b-fade',
          style: `animation-delay:${.12 + index * .1}s`
        });
      });

      stageTracks[0].forEach(trackId => {
        const lastStage = lastStageByTrack.get(trackId);
        if (lastStage === DATA.length - 1) return;
        const x = positions[lastStage].get(trackId);
        const y = stageY(lastStage);
        const direction = rnd(trackId + 5, lastStage + 17) > .5 ? 1 : -1;
        const drift = direction * (8 + rnd(trackId + 9, lastStage + 23) * 22);
        const drop = 22 + rnd(trackId + 13, lastStage + 31) * 18;
        const endX = x + drift;
        const endY = y + drop;
        const d = `M${x} ${y} C${x} ${y + 10} ${x + drift * .45} ${y + drop * .72} ${endX} ${endY}`;
        const motionStyle = `--exit-duration:${4.2 + rnd(trackId + 1, 53) * 3}s;--exit-delay:${trackId * .037}s`;
        el(svg, 'path', {
          d, class: 'hero-b-exit', 'data-track': trackId, style: motionStyle
        });
        el(svg, 'circle', {
          cx: endX, cy: endY, r: .7, class: 'hero-b-exit-dot', 'data-track': trackId, style: motionStyle
        });
        const hit = el(svg, 'path', {
          d, fill: 'none', stroke: 'transparent', 'stroke-width': 8,
          class: 'hero-b-hit', 'data-track': trackId
        });
        const title = el(hit, 'title', {});
        title.textContent = `Unit ${trackId + 1} · exits after ${DATA[lastStage].label}`;
      });

      stageTracks[0].forEach(trackId => {
        const lastStage = lastStageByTrack.get(trackId);
        if (lastStage === 0) return;
        let d = `M${positions[0].get(trackId)} ${stageY(0)}`;
        for (let stage = 1; stage <= lastStage; stage += 1) {
          const x0 = positions[stage - 1].get(trackId);
          const x1 = positions[stage].get(trackId);
          const y0 = stageY(stage - 1);
          const y1 = stageY(stage);
          const midY = (y0 + y1) / 2;
          d += ` C${x0} ${midY} ${x1} ${midY} ${x1} ${y1}`;
        }
        el(svg, 'path', {
          d, stroke: 'var(--mist-white-700)', pathLength: 1, class: 'hero-b-flow-motion',
          style: `--flow-duration:${6.4 + rnd(trackId + 1, 41) * 2.8}s;--flow-delay:${.65 + trackId * .095}s`
        });
        el(svg, 'path', {
          d, fill: 'none', stroke: WIRE.FAINTDATA, 'stroke-width': .7, opacity: .45,
          pathLength: 1, class: 'hero-b-flow hero-b-draw', 'data-track': trackId,
          style: `animation-delay:${.2 + trackId * .006}s;animation-duration:${.65 + lastStage * .18}s`
        });
        const hit = el(svg, 'path', {
          d, fill: 'none', stroke: 'transparent', 'stroke-width': 10,
          class: 'hero-b-hit', 'data-track': trackId
        });
        const title = el(hit, 'title', {});
        title.textContent = `Unit ${trackId + 1} · about 40 people · reaches ${DATA[lastStage].label}`;
      });

      DATA.forEach((stage, index) => {
        const y = stageY(index);
        const rampColor = WIRE.RAMP[Math.min(index, WIRE.RAMP.length - 1)];
        stageTracks[index].forEach((trackId, rank) => {
          const x = positions[index].get(trackId);
          const tick = el(svg, 'rect', {
            x: x - .55, y: y - 6, width: 1.1, height: 12, fill: rampColor,
            opacity: .6 + rnd(trackId + 2, index + 5) * .4,
            class: 'hero-b-tick hero-b-fade', 'data-track': trackId,
            style: `animation-delay:${index * .12 + rank * .004}s;cursor:crosshair`
          });
          const title = el(tick, 'title', {});
          title.textContent = `Unit ${trackId + 1} · ${stage.label} · about 40 people`;
        });

      });
    }

    const focusTrack = trackId => {
      svg.querySelectorAll('.hero-b-flow, .hero-b-exit, .hero-b-tick, .hero-b-exit-dot').forEach(node =>
        node.classList.toggle('is-active', node.getAttribute('data-track') === trackId)
      );
    };
    const clearTrack = () => svg.querySelectorAll('.is-active').forEach(node => node.classList.remove('is-active'));

    svg.addEventListener('pointerover', event => {
      const target = event.target.closest?.('[data-track]');
      if (target) focusTrack(target.getAttribute('data-track'));
    });
    svg.addEventListener('pointerout', event => {
      const from = event.target.closest?.('[data-track]');
      if (!from) return;
      const to = event.relatedTarget?.closest?.('[data-track]');
      if (to?.getAttribute('data-track') === from.getAttribute('data-track')) return;
      clearTrack();
    });

    let hasRendered = false;
    const observer = new IntersectionObserver(entries => {
      const isVisible = entries[0].isIntersecting;
      if (isVisible && !hasRendered) {
        render();
        hasRendered = true;
      }
      svg.classList.toggle('is-running', isVisible);
    }, { threshold: .3 });
    observer.observe(svg);
    svg.addEventListener('click', render);
  })();

  // Canvas animations are initialized once by initializeLandingCanvases.
  return () => {};

(() => {
    'use strict';

    const hero = document.getElementById('top');
    const canvas = document.getElementById('hero-b-pixel-field');
    const copy = hero?.querySelector('.hero-copy');
    const visual = hero?.querySelector('.hero-visual');
    const tooltip = document.getElementById('hero-b-pixel-tooltip');
    const header = document.querySelector('.kh-site-header');
    const ctx = canvas?.getContext('2d');
    if (!hero || !canvas || !copy || !visual || !tooltip || !ctx) return;
    if (canvas.dataset.heroCanvasOwned === 'true') return;
    const colorToken = (property, fallback) => getComputedStyle(document.documentElement)
      .getPropertyValue(property).trim() || fallback;

    const SETTINGS = Object.freeze({
      cellSize: 6,
      fieldScale: 1,
      densityThreshold: .14,
      ambientStrength: 1.4,
      randomness: .075,
      motionSpeed: 1.22,
      trailDecay: .925,
      brushRadius: 10,
      interactionStrength: .19,
      fadeStart: .58,
      fadeSoftness: .28,
      gridOpacity: .022,
      inkColor: colorToken('--mist-white-950', '#1B1C1A'),
      accentColor: colorToken('--coral-signal-500', '#FF634A'),
      paperColor: colorToken('--white-100', '#FFFFFF'),
      seed: 17
    });
    const mainColor = stop => getComputedStyle(document.documentElement)
      .getPropertyValue(`--main-${stop}`).trim();
    const STAGE_COLORS = [
      mainColor(800),
      mainColor(600),
      colorToken('--coral-signal-400', '#FF897D'),
      colorToken('--coral-signal-500', '#FF634A'),
      colorToken('--mineral-green-300', '#23D6B1')
    ];
    const LAYER_COLORS = STAGE_COLORS.slice(1);
    let mainTextureColor = mainColor(400);
    const syncMainPalette = () => {
      STAGE_COLORS[0] = mainColor(800);
      STAGE_COLORS[1] = mainColor(600);
      LAYER_COLORS[0] = STAGE_COLORS[1];
      mainTextureColor = mainColor(400);
    };
    addEventListener('main-palette-change', syncMainPalette);
    const DATA = [
      { count: 168, width: 1 },
      { count: 96, width: .46 },
      { count: 64, width: .23 },
      { count: 36, width: .1 },
      { count: 14, width: .035 }
    ];
    const LAYERS = [
      { label: 'ORIGINAL DOCUMENT', detail: 'Pages · layouts · evidence' },
      { label: 'PAGE IMAGES', detail: 'Full-page visual originals' },
      { label: 'LIGHTWEIGHT NOTES', detail: 'Page topic · chapter location' },
      { label: 'CHAPTER MAP', detail: 'Navigate · open source on demand' }
    ];
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const unitCounts = DATA.map(stage => stage.count);
    const selectEvenly = (previous, count) => Array.from(
      { length: Math.min(count, previous.length) },
      (_, index) => previous[Math.min(previous.length - 1, Math.floor((index + .5) * previous.length / count))]
    );
    const stageTracks = [Array.from({ length: unitCounts[0] }, (_, index) => index)];
    for (let stage = 1; stage < DATA.length; stage += 1) {
      stageTracks.push(selectEvenly(stageTracks[stage - 1], unitCounts[stage]));
    }
    const lastStageByTrack = new Map(stageTracks[0].map(trackId => [trackId, 0]));
    stageTracks.forEach((tracks, stage) => tracks.forEach(trackId => lastStageByTrack.set(trackId, stage)));

    let width = 0;
    let height = 0;
    let scanExtension = 0;
    let dpr = 1;
    let cell = SETTINGS.cellSize;
    let cols = 0;
    let rows = 0;
    let heat = new Float32Array(0);
    let unitHitAreas = [];
    let hoveredTrack = null;
    let hoveredLayer = null;
    let hoverFlowLayer = null;
    let hoverFlowStarted = 0;
    let clickFlowLayer = null;
    let clickFlowStarted = 0;
    let selectedLayer = null;
    let morphFromLayer = null;
    let morphToLayer = null;
    let morphStarted = -1;
    let pointerX = -1;
    let pointerY = -1;
    let previousX = -1;
    let previousY = -1;
    let visible = true;
    let intro = 0;
    let lastFrame = 0;
    let frameId = 0;
    let animationTime = 0;
    const MORPH_DURATION = .46;
    const MORPH_POINT_COUNT = 680;
    const scatterDefaults = { position: 76, spread: 12, density: 30, contrast: 50 };
    const scatterControls = { ...scatterDefaults };

    const hash = (x, y) => {
      const value = Math.sin(x * 127.1 + y * 311.7 + SETTINGS.seed * .13) * 43758.5453;
      return value - Math.floor(value);
    };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const heroHeight = Math.max(1, Math.round(hero.getBoundingClientRect().height));
      const gridTail = width < 768 ? 90 : Math.min(148, Math.max(128, width * .1));
      scanExtension = Math.max(0, height - heroHeight - gridTail);
      dpr = Math.min(devicePixelRatio || 1, 2);
      cell = SETTINGS.cellSize;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / cell) + 1;
      rows = Math.ceil(height / cell) + 1;
      heat = new Float32Array(cols * rows);
    }

    function buildLayout() {
      const canvasRect = canvas.getBoundingClientRect();
      const visualRect = visual.getBoundingClientRect();
      const visualLeft = visualRect.left - canvasRect.left;
      const visualTop = visualRect.top - canvasRect.top;
      const centerX = width < 1100
        ? visualLeft + visualRect.width * .5
        : visualLeft + visualRect.width * .35;
      const maxWidth = (width < 1100
        ? visualRect.width * .96
        : Math.min(width * .92, 1080)) * SETTINGS.fieldScale;
      const stageSpan = width < 768
        ? visualRect.height * .86
        : Math.min(visualRect.height * .98, 580) * 1.2;
      const isDesktopLayout = width >= 768;
      const navHeight = header?.getBoundingClientRect().height || 68;
      const topY = isDesktopLayout
        ? navHeight + 2
        : visualTop + Math.max(18, visualRect.height * .018);
      const stageGap = stageSpan / (DATA.length - 1);
      const visualOrders = stageTracks.map(tracks => [...tracks]);
      const positions = visualOrders.map((tracks, stage) => {
        const isFullWidthStage = isDesktopLayout && stage === 0;
        const stageWidth = isFullWidthStage ? width + cell * 2 : maxWidth * DATA[stage].width;
        const stageCenter = isFullWidthStage ? width / 2 : centerX;
        const jitter = SETTINGS.randomness * cell * 4;
        const columns = Math.max(2, Math.min(tracks.length, Math.floor(stageWidth / cell)));
        const layerRows = Math.max(1, Math.ceil(tracks.length / columns));
        return new Map(tracks.map((trackId, rank) => [trackId, {
          x: stageCenter - stageWidth / 2
            + ((rank % columns) + .5) / columns * stageWidth
            + Math.sin(trackId * .61 + stage * 1.73) * cell * .62
            + (hash(trackId + 3, stage + 11) - .5) * jitter,
          y: (Math.floor(rank / columns) - (layerRows - 1) / 2) * cell
        }]));
      });
      return { centerX, maxWidth, topY, stageGap, positions, visualLeft, visualWidth: visualRect.width, isDesktopLayout };
    }

    function pointOnSegment(layout, trackId, stage, progress) {
      const origin = layout.positions[stage].get(trackId);
      const destination = layout.positions[stage + 1].get(trackId);
      const eased = progress * progress * (3 - 2 * progress);
      const bend = (hash(trackId + 37, stage + 211) - .5) * cell * 4.2;
      const flutter = Math.sin(progress * Math.PI * 2 + hash(trackId + 61, stage + 229) * Math.PI * 2)
        * cell * .45 * Math.sin(progress * Math.PI);
      return {
        x: origin.x + (destination.x - origin.x) * eased
          + Math.sin(progress * Math.PI) * bend + flutter,
        y: layout.topY + layout.stageGap * stage + origin.y
          + (layout.stageGap + destination.y - origin.y) * progress
      };
    }

    function createPixelShape(layerIndex) {
      const pixels = new Map();
      const add = (x, y, alpha = 1) => {
        const key = `${x},${y}`;
        const current = pixels.get(key);
        if (!current || current.alpha < alpha) pixels.set(key, { x, y, alpha });
      };
      const line = (x0, y0, x1, y1, alpha = 1) => {
        const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
        for (let step = 0; step <= steps; step += 1) {
          const progress = steps ? step / steps : 0;
          add(Math.round(x0 + (x1 - x0) * progress), Math.round(y0 + (y1 - y0) * progress), alpha);
        }
      };
      const rect = (x, y, w, h, alpha = 1) => {
        line(x, y, x + w, y, alpha);
        line(x + w, y, x + w, y + h, alpha);
        line(x + w, y + h, x, y + h, alpha);
        line(x, y + h, x, y, alpha);
      };
      const node = (x, y, size = 3, alpha = 1) => {
        for (let row = 0; row < size; row += 1) {
          for (let column = 0; column < size; column += 1) add(x + column, y + row, alpha);
        }
      };

      if (layerIndex === 0) {
        line(2, 8, 2, 27);
        line(2, 8, 11, 8);
        line(11, 8, 14, 4);
        line(14, 4, 23, 4);
        line(23, 4, 26, 8);
        line(26, 8, 32, 8);
        line(32, 8, 32, 27);
        line(32, 27, 2, 27);
        line(2, 12, 32, 12, .72);
        for (let y = 14; y < 27; y += 1) {
          for (let x = 4; x < 31; x += 1) {
            if ((x * 3 + y * 5) % 7 < 2) add(x, y, .32 + hash(x + 1301, y + 1321) * .28);
          }
        }
      } else if (layerIndex === 1) {
        rect(4, 3, 22, 27, .42);
        rect(7, 5, 22, 27, .58);
        rect(10, 7, 22, 27, 1);
        rect(13, 11, 16, 13, .82);
        line(13, 23, 19, 17, .88);
        line(19, 17, 23, 21, .88);
        line(23, 21, 29, 14, .88);
        node(15, 13, 3, .92);
        for (let x = 13; x < 30; x += 3) add(x, 28, .5);
      } else if (layerIndex === 2) {
        rect(5, 3, 25, 31, 1);
        line(23, 3, 30, 10, .72);
        line(23, 3, 23, 10, .72);
        line(23, 10, 30, 10, .72);
        const lengths = [15, 18, 13, 19, 16, 11];
        lengths.forEach((length, row) => {
          node(9, 14 + row * 3, 2, .78);
          line(13, 14 + row * 3, 13 + length, 14 + row * 3, row === 0 ? .9 : .58);
        });
        for (let x = 8; x < 27; x += 2) add(x, 8, .34);
      } else {
        const connections = [
          [17, 4, 17, 10], [17, 10, 8, 16], [17, 10, 26, 16],
          [8, 16, 5, 25], [8, 16, 13, 25], [26, 16, 22, 25], [26, 16, 30, 25],
          [13, 25, 17, 31], [22, 25, 17, 31]
        ];
        connections.forEach(([x0, y0, x1, y1], index) => {
          line(x0, y0, x1, y1, index < 3 ? .84 : .56);
          line(x0 + 1, y0, x1 + 1, y1, .28);
        });
        [[15, 2], [15, 9], [6, 15], [24, 15], [3, 24], [11, 24], [20, 24], [28, 24], [15, 30]].forEach(
          ([x, y], index) => node(x, y, index === 0 || index === 8 ? 5 : 4, index < 4 ? 1 : .78)
        );
      }
      const basePixels = [...pixels.values()];
      const densePixels = new Map();
      const addDense = (x, y, alpha) => {
        const key = `${x},${y}`;
        const current = densePixels.get(key);
        if (!current || current.alpha < alpha) densePixels.set(key, { x, y, alpha });
      };
      const denseOffsets = [
        { value: 0, alpha: 1 },
        { value: 1 / 3, alpha: .78 },
        { value: 2 / 3, alpha: .62 }
      ];
      basePixels.forEach(point => {
        denseOffsets.forEach(offsetX => denseOffsets.forEach(offsetY => {
          addDense(
            point.x + offsetX.value,
            point.y + offsetY.value,
            point.alpha * Math.min(offsetX.alpha, offsetY.alpha)
          );
        }));
      });
      return [...densePixels.values()];
    }

    const PIXEL_SHAPES = LAYERS.map((_, layerIndex) => createPixelShape(layerIndex));

    function normalizeMorphPoints(points) {
      if (points.length === MORPH_POINT_COUNT) return points;
      if (points.length > MORPH_POINT_COUNT) {
        return Array.from({ length: MORPH_POINT_COUNT }, (_, index) => points[
          Math.min(points.length - 1, Math.floor((index + .5) * points.length / MORPH_POINT_COUNT))
        ]);
      }
      return Array.from({ length: MORPH_POINT_COUNT }, (_, index) => {
        const point = points[index % points.length];
        return { ...point, alpha: point.alpha * (index < points.length ? 1 : .08) };
      });
    }

    function funnelMorphPoints(layout) {
      const points = [];
      stageTracks[0].forEach(trackId => {
        const lastStage = lastStageByTrack.get(trackId);
        for (let stage = 0; stage < lastStage; stage += 1) {
          for (let sample = 0; sample < 4; sample += 1) {
            const point = pointOnSegment(layout, trackId, stage, sample / 4);
            points.push({ ...point, alpha: .56 + hash(trackId + 1409, stage * 7 + sample) * .38 });
          }
        }
      });
      return normalizeMorphPoints(points);
    }

    function modeMorphPoints(layout, layerIndex) {
      if (layerIndex === null) return funnelMorphPoints(layout);
      const shape = PIXEL_SHAPES[layerIndex];
      const centerY = layout.topY + layout.stageGap * 2.02;
      const shapeScale = width < 768 ? 1.48 : 1.68;
      const shapeCenterX = 17;
      const shapeCenterY = 18;
      return normalizeMorphPoints(shape.map(point => ({
        x: layout.centerX + (point.x - shapeCenterX) * cell * shapeScale,
        y: centerY + (point.y - shapeCenterY) * cell * shapeScale,
        alpha: point.alpha
      })));
    }

    function morphState(time) {
      if (morphStarted < 0) return { from: selectedLayer, to: selectedLayer, progress: 1 };
      const linear = Math.max(0, Math.min(1, (time - morphStarted) / MORPH_DURATION));
      const progress = linear * linear * (3 - 2 * linear);
      return { from: morphFromLayer, to: morphToLayer, progress };
    }

    function funnelOpacityAt(time) {
      const state = morphState(time);
      if (state.from === null && state.to === null) return 1;
      if (state.from === null) return 1 - state.progress;
      if (state.to === null) return state.progress;
      return 0;
    }

    function layerCardVisibility(layerIndex, time) {
      const state = morphState(time);
      if (state.from === null && state.to === null) return 1;
      if (state.from === null) {
        return layerIndex === state.to
          ? 1 - Math.min(1, state.progress / .36)
          : 1 - state.progress;
      }
      if (state.to === null) return Math.max(0, Math.min(1, (state.progress - .28) / .72));
      if (layerIndex === state.from) return 1 - state.progress;
      return 0;
    }

    function shapeCardPresentation(time) {
      const state = morphState(time);
      if (state.from === null && state.to === null) return { layerIndex: null, visibility: 0 };
      const elapsed = Math.max(0, time - morphStarted);
      if (state.from === null) {
        const progress = reducedMotion
          ? state.progress
          : Math.max(0, Math.min(1, (elapsed - .16) / .36));
        return { layerIndex: state.to, visibility: 1 - (1 - progress) ** 3 };
      }
      if (state.to === null) {
        const progress = reducedMotion
          ? state.progress
          : Math.max(0, Math.min(1, elapsed / .22));
        return { layerIndex: state.from, visibility: 1 - progress ** 2 };
      }
      return { layerIndex: state.to, visibility: state.progress };
    }

    function mixHexColor(from, to, progress) {
      const read = color => [1, 3, 5].map(index => parseInt(color.slice(index, index + 2), 16));
      const fromRgb = read(from);
      const toRgb = read(to);
      return `rgb(${fromRgb.map((value, index) => Math.round(value + (toRgb[index] - value) * progress)).join(',')})`;
    }

    function drawModeMorph(layout, time) {
      if (morphStarted < 0 && selectedLayer === null) return;
      const state = morphState(time);
      const fromPoints = modeMorphPoints(layout, state.from);
      const toPoints = modeMorphPoints(layout, state.to);
      const fromColor = state.from === null ? STAGE_COLORS[0] : LAYER_COLORS[state.from];
      const toColor = state.to === null ? STAGE_COLORS[0] : LAYER_COLORS[state.to];
      const opacity = state.from === null ? state.progress : state.to === null ? 1 - state.progress : 1;
      const color = mixHexColor(fromColor, toColor, state.progress);
      const targetIsShape = state.to !== null;
      const bounds = targetIsShape ? toPoints.reduce((result, point) => ({
        minX: Math.min(result.minX, point.x),
        maxX: Math.max(result.maxX, point.x),
        minY: Math.min(result.minY, point.y),
        maxY: Math.max(result.maxY, point.y)
      }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }) : null;
      const flowTime = reducedMotion ? 0 : time;
      for (let index = 0; index < MORPH_POINT_COUNT; index += 1) {
        const from = fromPoints[index];
        const to = toPoints[index];
        let flow = 0;
        if (targetIsShape) {
          const horizontal = (to.x - bounds.minX) / Math.max(1, bounds.maxX - bounds.minX);
          const vertical = (to.y - bounds.minY) / Math.max(1, bounds.maxY - bounds.minY);
          const route = horizontal * .3 + vertical * .7 + hash(index + 1553, state.to + 1571) * .035;
          const phase = ((flowTime * .48 - route) % 1 + 1) % 1;
          if (phase < .18) flow = Math.sin(phase / .18 * Math.PI);
        }
        drawPixel(
          from.x + (to.x - from.x) * state.progress,
          from.y + (to.y - from.y) * state.progress,
          (from.alpha + (to.alpha - from.alpha) * state.progress) * opacity * (.72 + flow * .46),
          flow > 0 ? mixHexColor(color, colorToken('--mist-white-900', '#2E2E2C'), flow * .11) : color
        );
      }
    }

    function drawShapeAnnotation(layout, time) {
      const presentation = shapeCardPresentation(time);
      if (presentation.layerIndex === null || presentation.visibility <= .001) return;

      const layerIndex = presentation.layerIndex;
      const layer = LAYERS[layerIndex];
      const color = LAYER_COLORS[layerIndex];
      const points = modeMorphPoints(layout, layerIndex);
      const bounds = points.reduce((result, point) => ({
        minX: Math.min(result.minX, point.x),
        maxX: Math.max(result.maxX, point.x),
        minY: Math.min(result.minY, point.y),
        maxY: Math.max(result.maxY, point.y)
      }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
      const shapeCenterY = (bounds.minY + bounds.maxY) / 2;
      const visibility = presentation.visibility;
      const cardWidth = width < 768 ? 188 : 244;
      const cardHeight = width < 768 ? 82 : 96;
      const rightInset = width < 768 ? 12 : 18;
      const rightLimit = Math.min(
        width - cardWidth - rightInset,
        layout.visualLeft + layout.visualWidth - cardWidth - 12
      );
      const targetX = Math.min(bounds.maxX + cell * 4.4, rightLimit);
      const targetY = Math.max(layout.topY + cell, shapeCenterY - cardHeight / 2);
      const cardX = targetX + (1 - visibility) * cell * 3.2;
      const cardY = targetY + (1 - visibility) * cell * .8;
      const lineStart = bounds.maxX + cell * 1.15;
      const lineEnd = cardX;
      const lineWidth = Math.max(20, lineEnd - lineStart) * visibility;

      ctx.save();
      ctx.globalAlpha = visibility;
      ctx.fillStyle = color;
      ctx.fillRect(lineStart, shapeCenterY + .5, lineWidth, 1);
      ctx.fillRect(lineStart - 2, shapeCenterY - 1.5, 4, 4);

      ctx.translate(cardX + cardWidth / 2, cardY + cardHeight / 2);
      const scale = .94 + visibility * .06;
      ctx.scale(scale, scale);
      ctx.translate(-cardWidth / 2, -cardHeight / 2);

      ctx.globalAlpha = .97 * visibility;
      ctx.fillStyle = SETTINGS.paperColor;
      ctx.fillRect(0, 0, cardWidth, cardHeight);
      ctx.globalAlpha = .075 * visibility;
      ctx.fillStyle = color;
      ctx.fillRect(1, 1, cardWidth - 2, cardHeight - 2);

      ctx.globalAlpha = .68 * visibility;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(.5, .5, cardWidth - 1, cardHeight - 1);
      ctx.globalAlpha = .98 * visibility;
      ctx.fillStyle = color;
      ctx.fillRect(1, 1, 4, cardHeight - 2);
      ctx.fillRect(cardWidth - 15, 11, 6, 6);

      const textX = width < 768 ? 15 : 18;
      ctx.textBaseline = 'alphabetic';
      ctx.globalAlpha = .54 * visibility;
      ctx.font = '600 8px "Geist", "Frex Sans GB VF", sans-serif';
      ctx.fillText(`LAYER 0${layerIndex + 1} / 04 · ACTIVE VIEW`, textX, 18);

      ctx.globalAlpha = visibility;
      ctx.font = `600 ${width < 768 ? 11 : 12}px "Geist", "Frex Sans GB VF", sans-serif`;
      ctx.fillText(layer.label, textX, width < 768 ? 38 : 42);
      ctx.globalAlpha = .68 * visibility;
      ctx.font = '500 9px "Geist", "Frex Sans GB VF", sans-serif';
      ctx.fillText(layer.detail, textX, width < 768 ? 54 : 59);

      const statusY = cardHeight - 14;
      ctx.globalAlpha = .48 * visibility;
      ctx.font = '600 7px "Geist", "Frex Sans GB VF", sans-serif';
      ctx.fillText('LIVE DATA PASS', textX, statusY + 2);
      for (let index = 0; index < 7; index += 1) {
        const phase = ((time * 1.15 - index * .11) % 1 + 1) % 1;
        const pulse = phase < .3 ? Math.sin(phase / .3 * Math.PI) : 0;
        ctx.globalAlpha = (.18 + pulse * .7) * visibility;
        ctx.fillRect(cardWidth - 16 - index * 8, statusY - 4, 4, 4);
      }
      ctx.restore();
    }

    function toggleLayerShape(layerIndex) {
      const nextLayer = selectedLayer === layerIndex ? null : layerIndex;
      if (nextLayer === null) {
        clickFlowLayer = null;
        hoverFlowLayer = null;
      } else {
        clickFlowLayer = layerIndex;
        clickFlowStarted = animationTime;
      }
      morphFromLayer = selectedLayer;
      morphToLayer = nextLayer;
      morphStarted = reducedMotion ? animationTime - MORPH_DURATION : animationTime;
      selectedLayer = nextLayer;
      if (hoveredLayer === layerIndex) {
        const action = nextLayer === layerIndex ? 'Click to return to data funnel' : 'Click to view pixel form';
        tooltip.textContent = action;
      }
    }

    function deposit(x, y, amount, radius) {
      const centerColumn = x / cell;
      const centerRow = y / cell;
      const reach = Math.ceil(radius * 1.7);
      const divisor = 2 * radius * radius * .2;
      for (let dy = -reach; dy <= reach; dy += 1) {
        for (let dx = -reach; dx <= reach; dx += 1) {
          const column = (centerColumn + dx) | 0;
          const row = (centerRow + dy) | 0;
          if (column < 0 || row < 0 || column >= cols || row >= rows) continue;
          const distanceX = column + .5 - centerColumn;
          const distanceY = row + .5 - centerRow;
          const weight = Math.exp(-(distanceX ** 2 + distanceY ** 2) / divisor);
          if (weight < .02) continue;
          const index = row * cols + column;
          heat[index] = Math.min(1.15, heat[index] + amount * weight);
        }
      }
    }

    function heatAt(x, y) {
      const column = Math.max(0, Math.min(cols - 1, Math.floor(x / cell)));
      const row = Math.max(0, Math.min(rows - 1, Math.floor(y / cell)));
      return heat[row * cols + column] || 0;
    }

    function drawPixel(x, y, alpha = 1, color = SETTINGS.inkColor) {
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = color;
      ctx.fillRect(
        Math.round(x / cell) * cell + 1,
        Math.round(y / cell) * cell + 1,
        cell - 3,
        cell - 3
      );
    }

    function easeOutCubic(value) {
      const clamped = Math.max(0, Math.min(1, value));
      return 1 - (1 - clamped) ** 3;
    }

    function entranceAt(layout, y, salt = 0) {
      if (reducedMotion) return 1;
      const span = Math.max(1, layout.stageGap * (DATA.length - 1));
      const verticalProgress = Math.max(0, Math.min(1, (y - layout.topY) / span));
      const threshold = intro * 1.42 - verticalProgress * .92 - hash(salt + 19, 71) * .12;
      return easeOutCubic(threshold / .18);
    }

    function drawGrid(time) {
      const gridEntrance = reducedMotion ? 1 : .2 + easeOutCubic(intro * 1.65) * .8;
      ctx.strokeStyle = `rgba(0,0,0,${SETTINGS.gridOpacity * gridEntrance})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += cell) {
        ctx.moveTo(x + .5, 0);
        ctx.lineTo(x + .5, height);
      }
      for (let y = 0; y <= height; y += cell) {
        ctx.moveTo(0, y + .5);
        ctx.lineTo(width, y + .5);
      }
      ctx.stroke();

      ctx.fillStyle = mainTextureColor;
      for (let row = 0; row < rows; row += 3) {
        for (let column = 0; column < cols; column += 3) {
          const texture = hash(column + 2111, row + 2131);
          if (texture < .72) continue;
          const wave = reducedMotion ? 0 : Math.sin(column * .13 + row * .17 + time * .12) * .5 + .5;
          ctx.globalAlpha = (.008 + texture * .012 + wave * .006) * gridEntrance;
          ctx.fillRect(column * cell + 1, row * cell + 1, 1, 1);
        }
      }
      ctx.globalAlpha = 1;
    }

    const SCAN_TRAIL_ROWS = 8;
    const SCAN_TRANSIT = 0;
    const SCAN_HEAD_ALPHA = .72;
    const SCAN_TRAIL_ALPHA = .56;
    const SCAN_GRID_UNIT = 6;

    const scanRevealTargets = [header, copy, visual].filter(Boolean);

    function scanState() {
      const scan = (intro - .067) / .933;
      const clamped = Math.max(0, Math.min(1, scan));
      const progress = clamped * clamped * (3 - 2 * clamped);
      return {
        scan,
        progress,
        headY: SCAN_TRANSIT + (height - SCAN_TRANSIT) * progress
      };
    }

    function syncScanReveal() {
      if (reducedMotion) return;
      const { scan, headY } = scanState();
      const lineY = canvas.getBoundingClientRect().top + headY;
      const states = scanRevealTargets.map(element => {
        const rect = element.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (lineY - rect.top) / Math.max(1, rect.height)));
        return { element, progress };
      });
      states.forEach(({ element, progress }) => {
        element.style.opacity = progress > 0 ? '1' : '0';
        element.style.clipPath = `inset(0 0 ${(1 - progress) * 100}% 0)`;
        if (scan >= 1) element.style.willChange = 'auto';
      });
    }

    function drawScanTrail() {
      if (reducedMotion) return;
      const { scan, headY } = scanState();
      if (scan <= 0 || scan >= 1) return;
      const fadeOut = scan < .9 ? 1 : Math.max(0, 1 - (scan - .9) / .1);
      const headRow = Math.round(headY / SCAN_GRID_UNIT);
      if (headRow < 1) return;
      const firstRow = Math.max(0, headRow - SCAN_TRAIL_ROWS);
      const trailCols = Math.ceil(width / SCAN_GRID_UNIT) + 1;

      ctx.lineWidth = 1;
      ctx.strokeStyle = STAGE_COLORS[0];
      ctx.globalAlpha = 1;

      for (let r = firstRow; r <= headRow; r += 1) {
        const dist = headRow - r;
        const rowFade = Math.pow(1 - dist / (SCAN_TRAIL_ROWS + 1), 1.12);
        const isHead = dist === 0;
        const maxAlpha = (isHead ? SCAN_HEAD_ALPHA : SCAN_TRAIL_ALPHA) * rowFade * fadeOut;
        if (maxAlpha <= .02) continue;
        const y = r * SCAN_GRID_UNIT + .5;

        let segStart = 0;
        while (segStart < trailCols) {
          const segHash = hash(r * 53, segStart * 31 + dist * 7);
          const segEnd = Math.min(trailCols - 1, segStart + 1 + Math.floor(segHash * 6));
          const stagger = easeOutCubic(Math.min(1, Math.max(0, (scan - segHash * .16) / .45)));
          const broken = !isHead && hash(r * 97, segStart * 23 + dist * 11) < .17;
          const alpha = broken ? 0 : maxAlpha * (.5 + hash(r * 71, segStart * 17) * .5) * stagger;
          if (alpha >= .02) {
            ctx.globalAlpha = Math.min(1, alpha);
            const x0 = segStart * SCAN_GRID_UNIT + .5;
            const x1 = (segEnd + 1) * SCAN_GRID_UNIT + .5;
            ctx.beginPath();
            ctx.moveTo(x0, y);
            ctx.lineTo(x1, y);
            ctx.stroke();
          }
          segStart = segEnd + 1;
        }

        if (!isHead) {
          const bandBottom = (r + 1) * SCAN_GRID_UNIT + .5;
          for (let c = 0; c < trailCols; c += 1) {
            if (hash(r * 43, c * 7 + dist * 19) < .48) continue;
            const alpha = maxAlpha * (.18 + hash(r * 31, c * 13) * .38);
            if (alpha < .02) continue;
            ctx.globalAlpha = Math.min(1, alpha);
            const x = c * SCAN_GRID_UNIT + .5;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, bandBottom);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    function drawConvergingDivider() {
      const heroRect = hero.getBoundingClientRect();
      const heroProgress = -heroRect.top / Math.max(1, heroRect.height);
      const rawProgress = Math.max(0, Math.min(1, (heroProgress - .06) / .62));
      const scrollProgress = reducedMotion
        ? (rawProgress > 0 ? 1 : 0)
        : rawProgress * rawProgress * (3 - 2 * rawProgress);
      const dataHeight = height - scanExtension;
      const dividerY = Math.floor((dataHeight - cell) / cell) * cell;
      const squareCount = Math.ceil(width / cell) + 1;
      const requestedScatterTop = Math.floor((dataHeight - 32) * scatterControls.position / 100 / cell) * cell + cell * 10 + 32;
      const scatterTop = Math.min(dividerY - cell * 9, requestedScatterTop);
      const scatterHeight = Math.max(cell * 2, Math.min(
        cell * 8,
        dividerY - scatterTop - cell,
        Math.floor(dataHeight * scatterControls.spread / 100 / cell) * cell
      ));
      const scatterDensity = scatterControls.density / 100;
      const scatterContrast = scatterControls.contrast / 100;
      const lineY = Math.round((scatterTop + scatterHeight * .5) / cell) * cell;
      const lineColumnCount = cols;
      const lineStartX = 0;
      const mergeProgress = easeOutCubic((scrollProgress - .58) / .34);

      ctx.fillStyle = SETTINGS.inkColor;
      for (let index = 0; index < squareCount; index += 1) {
        const prominence = hash(index + 61, 601);
        if (prominence >= scatterDensity) continue;
        const delay = hash(index + 17, 541) * .16;
        const localProgress = easeOutCubic(Math.max(0, Math.min(1, (scrollProgress - delay) / (1 - delay))));
        const startX = Math.floor(hash(index + 31, 563) * cols) * cell;
        const startY = scatterTop + Math.floor(hash(index + 47, 587) * scatterHeight / cell) * cell;
        const targetColumn = Math.round(index / Math.max(1, squareCount - 1) * (lineColumnCount - 1));
        const targetX = lineStartX + targetColumn * cell;
        const arc = Math.sin(localProgress * Math.PI)
          * Math.sin(index * 1.17)
          * cell * 1.4;
        const x = Math.round((startX + (targetX - startX) * localProgress) / cell) * cell;
        const y = Math.round((startY + (lineY - startY) * localProgress + arc) / cell) * cell;
        const restingAlpha = scatterContrast * (.4 + hash(index + 79, 619) * .6);
        ctx.globalAlpha = (restingAlpha * (1 - localProgress) + localProgress * .24) * (1 - mergeProgress);
        ctx.fillRect(x, y, cell - 1, cell - 1);
      }
      for (let column = 0; column < lineColumnCount; column += 1) {
        const tone = .16 + hash(column + 193, 641) * .04;
        ctx.globalAlpha = mergeProgress * tone;
        ctx.fillRect(lineStartX + column * cell + 1, lineY + 1, cell - 3, cell - 3);
      }
      ctx.globalAlpha = 1;
    }

    function rotationalTone(layout, x, stagePosition, time, baseColor) {
      const clampedStage = Math.max(0, Math.min(DATA.length - 1, stagePosition));
      const lowerStage = Math.min(DATA.length - 2, Math.floor(clampedStage));
      const stageMix = clampedStage - lowerStage;
      const firstWidth = layout.isDesktopLayout ? width : layout.maxWidth;
      const widthAt = stageIndex => stageIndex === 0
        ? firstWidth
        : layout.maxWidth * DATA[stageIndex].width;
      const localWidth = widthAt(lowerStage) + (widthAt(lowerStage + 1) - widthAt(lowerStage)) * stageMix;
      const firstCenter = layout.isDesktopLayout ? width / 2 : layout.centerX;
      const localCenter = clampedStage < 1
        ? firstCenter + (layout.centerX - firstCenter) * clampedStage
        : layout.centerX;
      const horizontal = Math.max(-1.25, Math.min(1.25, (x - localCenter) / Math.max(cell * 3, localWidth * .5)));
      const rotation = time * .78 + clampedStage * 1.08;
      const lightCenter = Math.sin(rotation) * .58;
      const shadowCenter = -lightCenter * .88;
      const highlight = Math.exp(-(((horizontal - lightCenter) / .34) ** 2));
      const shadow = Math.exp(-(((horizontal - shadowCenter) / .48) ** 2));
      const rim = Math.max(0, Math.abs(horizontal) - .7) / .55;
      return {
        alpha: Math.max(.56, Math.min(1.24, .68 + highlight * .54 - shadow * .08 - rim * .06)),
        color: mixHexColor(baseColor, STAGE_COLORS[0], shadow * .045 + rim * .025)
      };
    }

    function drawDataStream(layout, time, funnelOpacity = 1) {
      const dataAlpha = Math.max(.32, Math.min(1, SETTINGS.ambientStrength * .76));
      const unitAlpha = Math.max(.46, Math.min(.96, 1.12 - SETTINGS.densityThreshold));
      const trailAlpha = .05 + (SETTINGS.trailDecay - .75) / .22 * .08;
      unitHitAreas = [];

      ctx.save();
      ctx.font = '600 9px "Geist", "Frex Sans GB VF", sans-serif';
      ctx.textBaseline = 'bottom';

      DATA.forEach((stage, stageIndex) => {
        const y = layout.topY + layout.stageGap * stageIndex;
        const isFullWidthStage = layout.isDesktopLayout && stageIndex === 0;
        const stageWidth = isFullWidthStage ? width : layout.maxWidth * stage.width;
        const stageCenter = isFullWidthStage ? width / 2 : layout.centerX;
        const boundaryActive = hoveredLayer === stageIndex || hoveredLayer === stageIndex - 1;
        const railX = stageCenter - stageWidth / 2 - cell;
        if (!isFullWidthStage) {
          ctx.globalAlpha = (boundaryActive ? .32 : .16) * funnelOpacity;
          ctx.fillStyle = STAGE_COLORS[stageIndex];
          ctx.fillRect(railX, y + cell * .72, stageWidth + cell * 2, boundaryActive ? 2 : 1);
          ctx.globalAlpha = (boundaryActive ? .68 : .38) * funnelOpacity;
          ctx.fillRect(railX, y + cell * .48, cell * .45, cell * .45);
          ctx.fillRect(railX + stageWidth + cell * 1.55, y + cell * .48, cell * .45, cell * .45);
        }
      });

      stageTracks[0].forEach(trackId => {
        const lastStage = lastStageByTrack.get(trackId);
        if (lastStage < 1) return;
        for (let stage = 0; stage < lastStage; stage += 1) {
          const layerColor = LAYER_COLORS[stage];
          const sampleCount = Math.max(6, Math.round(layout.stageGap / cell));
          for (let sample = 0; sample < sampleCount; sample += 1) {
            const gapChance = stage === 0
              ? .01 + hash(trackId + 83, stage + 271) * .03
              : stage <= 2
                ? .015 + hash(trackId + 83, stage + 271) * .035
                : .02 + hash(trackId + 83, stage + 271) * .06;
            if (hash(trackId * 97 + sample, stage + 293) < gapChance) continue;
            const segmentProgress = sample / sampleCount;
            const point = pointOnSegment(layout, trackId, stage, segmentProgress);
            const streamProgress = (stage + segmentProgress) / lastStage;
            const channelOffset = hash(trackId + 101, stage + 307);
            const channelSpeed = .11 + hash(trackId + 127, stage + 331) * .24;
            const pulseWindow = .1 + hash(trackId + 149, stage + 353) * .23;
            const travelScale = .72 + hash(trackId + 173, stage + 379) * .55;
            const phase = ((time * SETTINGS.motionSpeed * channelSpeed
              - streamProgress * travelScale + channelOffset) % 1 + 1) % 1;
            const pulse = !reducedMotion && phase < pulseWindow
              ? Math.sin(phase / pulseWindow * Math.PI) * (.55 + hash(trackId + 197, sample + 397) * .45)
              : 0;
            const reveal = entranceAt(layout, point.y, trackId + stage * 109 + sample);
            const tone = rotationalTone(layout, point.x, stage + segmentProgress, time, layerColor);
            drawPixel(
              point.x,
              point.y,
              (trailAlpha * (.6 + hash(trackId + 211, sample + 419) * .8) + pulse * .84)
                * tone.alpha * reveal * funnelOpacity,
              tone.color
            );
          }
        }
      });

      DATA.forEach((stage, stageIndex) => {
        if (stageIndex === 0) return;
        stageTracks[stageIndex].forEach(trackId => {
          const position = layout.positions[stageIndex].get(trackId);
          const x = position.x;
          const y = layout.topY + layout.stageGap * stageIndex + position.y;
          const nodeSpeed = .09 + hash(trackId + 227, stageIndex + 431) * .13;
          const stagePhase = ((time * nodeSpeed + hash(trackId + 251, stageIndex + 457)) % 1 + 1) % 1;
          const stageGlow = !reducedMotion && stagePhase < .22
            ? Math.sin(stagePhase / .22 * Math.PI) * .16
            : 0;
          const reveal = entranceAt(layout, y, trackId + stageIndex * 137);
          const tone = rotationalTone(layout, x, stageIndex, time, STAGE_COLORS[stageIndex]);
          drawPixel(
            x,
            y,
            (Math.max(.9, unitAlpha * dataAlpha) + stageGlow + heatAt(x, y) * .3)
              * tone.alpha * reveal * funnelOpacity,
            tone.color
          );
          unitHitAreas.push({ x, y, trackId, stageIndex });
        });
      });

      stageTracks[0].forEach(trackId => {
        const lastStage = lastStageByTrack.get(trackId);
        if (lastStage >= DATA.length - 1) return;
        const origin = layout.positions[lastStage].get(trackId);
        const originX = origin.x;
        const originY = layout.topY + layout.stageGap * lastStage + origin.y;
        const side = trackId % 2 ? 1 : -1;
        const progress = reducedMotion ? .62 : (time * (.1 + SETTINGS.motionSpeed * .06) + (trackId % 8) / 8) % 1;
        const distance = cell * (6 + trackId % 4);
        const dropoutY = originY + layout.stageGap * .48 * progress;
        drawPixel(
          originX + side * distance * progress,
          dropoutY,
          (1 - progress) * .28 * entranceAt(layout, dropoutY, trackId + 401) * funnelOpacity
        );
      });

      LAYERS.forEach((layer, layerIndex) => {
        const layerProgress = layerIndex === 0 && layout.isDesktopLayout ? .72 : .5;
        const y = layout.topY + layout.stageGap * (layerIndex + layerProgress);
        const isSelected = selectedLayer === layerIndex;
        const isActive = hoveredLayer === layerIndex || isSelected;
        const cardWidth = width < 768 ? 152 : 176;
        const cardHeight = 48;
        const cardX = Math.min(width - cardWidth - 16, layout.visualLeft + layout.visualWidth - cardWidth - 12);
        const cardY = y - cardHeight / 2;
        const funnelBoundaryX = stageTracks[layerIndex + 1].reduce((rightEdge, trackId) => {
          const point = pointOnSegment(layout, trackId, layerIndex, layerProgress);
          return Math.max(rightEdge, point.x);
        }, layout.centerX);
        const lineEnd = cardX;
        const lineStart = Math.min(funnelBoundaryX + cell * 1.25, lineEnd - 28);
        const labelReveal = entranceAt(layout, y, layerIndex + 701);
        const cardVisibility = layerCardVisibility(layerIndex, time);
        const cardOffsetX = (1 - cardVisibility) * cell * 1.8;

        ctx.globalAlpha = (isActive ? .72 : .2) * labelReveal * cardVisibility;
        ctx.fillStyle = isActive ? LAYER_COLORS[layerIndex] : SETTINGS.inkColor;
        ctx.fillRect(lineStart, y + .5, Math.max(28, lineEnd - lineStart) * cardVisibility, 1);
        ctx.fillRect(lineStart - 2, y - 1, 4, 4);

        ctx.globalAlpha = .94 * labelReveal * cardVisibility;
        ctx.fillStyle = SETTINGS.paperColor;
        ctx.fillRect(cardX + cardOffsetX, cardY, cardWidth, cardHeight);
        if (isActive) {
          ctx.globalAlpha = (isSelected ? .11 : .07) * labelReveal * cardVisibility;
          ctx.fillStyle = LAYER_COLORS[layerIndex];
          ctx.fillRect(cardX + cardOffsetX + 1, cardY + 1, cardWidth - 2, cardHeight - 2);
        }
        ctx.globalAlpha = (isSelected ? .62 : isActive ? .46 : .14) * labelReveal * cardVisibility;
        ctx.strokeStyle = isActive ? LAYER_COLORS[layerIndex] : SETTINGS.inkColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(cardX + cardOffsetX + .5, cardY + .5, cardWidth - 1, cardHeight - 1);
        ctx.globalAlpha = (isSelected ? .96 : isActive ? .78 : .34) * labelReveal * cardVisibility;
        ctx.fillStyle = LAYER_COLORS[layerIndex];
        ctx.fillRect(cardX + cardOffsetX + 1, cardY + 1, 3, cardHeight - 2);

        const textX = cardX + cardOffsetX + 14;
        ctx.textBaseline = 'alphabetic';
        ctx.globalAlpha = (isActive ? 1 : .88) * labelReveal * cardVisibility;
        ctx.fillStyle = isActive ? LAYER_COLORS[layerIndex] : SETTINGS.inkColor;
        ctx.font = '600 10px "Geist", "Frex Sans GB VF", sans-serif';
        ctx.fillText(layer.label, textX, cardY + 20);
        ctx.globalAlpha = (isActive ? .76 : .52) * labelReveal * cardVisibility;
        ctx.font = '500 9px "Geist", "Frex Sans GB VF", sans-serif';
        ctx.fillText(layer.detail, textX, cardY + 35);
      });
      drawShapeAnnotation(layout, time);
      ctx.restore();
    }

    function drawGridFlowPass(layout, time, layerIndex, started) {
      if (layerIndex === null) return false;
      const top = layout.topY + layout.stageGap * layerIndex + cell * .5;
      const bottom = top + layout.stageGap - cell;
      const firstRow = Math.ceil(top / cell);
      const lastRow = Math.floor(bottom / cell);
      const centerColumn = layout.centerX / cell;
      const maxColumnDistance = Math.max(centerColumn, cols - centerColumn);
      const age = time - started;
      const duration = 1.85;

      if (reducedMotion && hoveredLayer === null) return false;
      if (!reducedMotion && (age < 0 || age > duration)) return false;
      ctx.fillStyle = LAYER_COLORS[layerIndex];

      for (let row = firstRow; row <= lastRow; row += 1) {
        for (let column = 0; column < cols; column += 1) {
          const distance = Math.abs(column + .5 - centerColumn) / maxColumnDistance;
          const rowDrift = Math.sin(row * .82 + column * .16) * .045
            + Math.sin(row * 1.71 - column * .08) * .025;
          const cellJitter = (hash(column + layerIndex * 37, row + 719) - .5) * .11;
          const delay = distance * .68 + rowDrift + cellJitter;
          let envelope = .58;

          if (!reducedMotion) {
            const localAge = age - delay;
            if (localAge <= 0) continue;
            const enter = easeOutCubic(localAge / .16);
            const fade = 1 - easeOutCubic((localAge - .38) / .62);
            envelope = enter * fade;
            if (envelope <= .01) continue;
          }

          const variation = .62 + hash(column + 811, row + layerIndex * 53) * .38;
          ctx.globalAlpha = envelope * variation * .16;
          ctx.fillRect(column * cell + 1, row * cell + 1, cell - 3, cell - 3);
        }
      }
      ctx.globalAlpha = 1;
      return true;
    }

    function drawHoverGridFlow(layout, time) {
      if (clickFlowLayer !== null) {
        if (drawGridFlowPass(layout, time, clickFlowLayer, clickFlowStarted)) return;
        clickFlowLayer = null;
      }
      drawGridFlowPass(layout, time, hoverFlowLayer, hoverFlowStarted);
    }

    function updateHoveredTrack(x, y, clientX, clientY) {
      const layout = buildLayout();
      const stagePosition = (y - layout.topY) / layout.stageGap;
      const layerIndex = Math.floor(stagePosition);
      const isInsidePipeline = x >= layout.visualLeft - cell * 2
        && x <= layout.visualLeft + layout.visualWidth
        && layerIndex >= 0
        && layerIndex < LAYERS.length;
      const visibleLayer = selectedLayer === null || selectedLayer === layerIndex;
      const nextHoveredLayer = isInsidePipeline && visibleLayer ? layerIndex : null;
      if (nextHoveredLayer !== null && nextHoveredLayer !== hoveredLayer) {
        hoverFlowLayer = nextHoveredLayer;
        hoverFlowStarted = performance.now() / 1000;
      }
      hoveredLayer = nextHoveredLayer;
      hero.classList.toggle('is-data-layer-hovered', hoveredLayer !== null);

      hoveredTrack = null;
      if (hoveredLayer === null) {
        tooltip.classList.remove('is-visible');
        return;
      }
      const action = selectedLayer === hoveredLayer ? 'Click to return to data funnel' : 'Click to view pixel form';
      tooltip.textContent = action;
      tooltip.style.left = `${Math.min(innerWidth - 240, clientX)}px`;
      tooltip.style.top = `${Math.min(innerHeight - 70, clientY)}px`;
      tooltip.classList.add('is-visible');
    }

    function frame(milliseconds) {
      const delta = lastFrame ? Math.min(.04, (milliseconds - lastFrame) / 1000) : 0;
      lastFrame = milliseconds;
      if (visible) {
        intro = Math.min(1, intro + delta / 1.2);
        syncScanReveal();
        const time = reducedMotion ? 0 : milliseconds / 1000;
        animationTime = milliseconds / 1000;
        const layout = buildLayout();
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = SETTINGS.paperColor;
        ctx.fillRect(0, 0, width, height);
        ctx.save();
        // Keep the page background solid; the funnel and scan layers render separately.
        drawScanTrail();
        drawHoverGridFlow(layout, milliseconds / 1000);
        drawConvergingDivider();
        const funnelOpacity = funnelOpacityAt(animationTime);
        drawModeMorph(layout, animationTime);
        drawDataStream(layout, time, funnelOpacity);
        ctx.globalAlpha = 1;
        ctx.restore();
        const decay = reducedMotion ? .84 : Math.pow(SETTINGS.trailDecay, Math.max(.2, delta * 60));
        for (let index = 0; index < heat.length; index += 1) {
          heat[index] *= decay;
          if (heat[index] < .003) heat[index] = 0;
        }
      }
      frameId = requestAnimationFrame(frame);
    }

    hero.addEventListener('pointermove', event => {
      if (!finePointer) return;
      const rect = canvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      if (previousX >= 0) {
        const dx = pointerX - previousX;
        const dy = pointerY - previousY;
        const steps = Math.max(1, Math.min(30, Math.round(Math.hypot(dx, dy) / (cell * .75))));
        for (let index = 1; index <= steps; index += 1) {
          const progress = index / steps;
          deposit(previousX + dx * progress, previousY + dy * progress, SETTINGS.interactionStrength, SETTINGS.brushRadius);
        }
      }
      previousX = pointerX;
      previousY = pointerY;
      updateHoveredTrack(pointerX, pointerY, event.clientX, event.clientY);
    });

    hero.addEventListener('pointerleave', () => {
      hoveredTrack = null;
      hoveredLayer = null;
      hoverFlowLayer = null;
      hero.classList.remove('is-data-layer-hovered');
      previousX = -1;
      previousY = -1;
      tooltip.classList.remove('is-visible');
    });

    hero.addEventListener('pointerdown', event => {
      if (event.target.closest?.('a, button')) return;
      const rect = canvas.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const layout = buildLayout();
      const clickedLayer = Math.floor((localY - layout.topY) / layout.stageGap);
      const clickedDataRegion = localX >= layout.visualLeft - cell * 2
        && localX <= layout.visualLeft + layout.visualWidth
        && clickedLayer >= 0
        && clickedLayer < LAYERS.length;
      if (clickedDataRegion) {
        toggleLayerShape(selectedLayer !== null ? selectedLayer : clickedLayer);
      }
    });

    new ResizeObserver(resize).observe(hero);
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (!visible) tooltip.classList.remove('is-visible');
    }, { threshold: 0 }).observe(hero);

    resize();
    frameId = requestAnimationFrame(frame);
    addEventListener('pagehide', () => cancelAnimationFrame(frameId), { once: true });
  })();

(() => {
    'use strict';

    const canvas = document.querySelector('[data-format-globe]');
    const stage = canvas?.closest('.format-orbit-stage--thread-globe');
    if (!canvas || !stage || canvas.dataset.formatGlobeOwned === 'true') return;

    const context = canvas.getContext('2d');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ringRotations = [
      [0, 0, 0],
      [0.92, 0.10, 0.56],
      [-0.78, 0.38, -0.68],
      [0.22, 1.05, 1.16]
    ];
    const movingDashRingIndex = 2;
    const formatLabels = ['.docx', '.pdf', '.jpg', '.pptx', '.xlsx', '.csv', '.png', '.md', '.json', '.txt'];
    const colorToken = (property, fallback) => getComputedStyle(document.documentElement)
      .getPropertyValue(property).trim() || fallback;
    const formatLabelColors = [
      colorToken('--mineral-green-500', '#19A88B'),
      colorToken('--mineral-green-600', '#12846C'),
      colorToken('--mineral-green-400', '#1DBE9D'),
      colorToken('--deep-teal-300', '#208C8A'),
      colorToken('--mineral-green-300', '#23D6B1'),
      colorToken('--deep-teal-200', '#2FBAB8'),
      colorToken('--mineral-green-200', '#27EFC6')
    ];
    const particles = Array.from({ length: 10 }, (_, index) => ({
      ring: index % ringRotations.length,
      phase: (index * 0.61803398875) % 1,
      speed: 0.012 + (index % 4) * 0.003,
      radius: index % 5 === 0 ? 3.4 : 2.1,
      label: formatLabels[index],
      color: formatLabelColors[index % formatLabelColors.length]
    }));

    let width = 1;
    let height = 1;
    let pointerX = 0;
    let pointerY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let pointerLocalX = 0;
    let pointerLocalY = 0;
    let pointerInside = false;
    let visible = true;
    let frameId = 0;
    let startTime = performance.now();
    let introStartedAt = reducedMotion ? startTime : null;
    let introComplete = reducedMotion;
    let activeLabelColor = particles[0].color;
    const introRingDuration = 1200;
    const introRingStagger = 140;

    function easeInOutSine(progress) {
      return -(Math.cos(Math.PI * progress) - 1) / 2;
    }

    function getRingIntroState(ringIndex, now) {
      if (introComplete || reducedMotion) return { reveal: 1, headOpacity: 0 };
      if (introStartedAt === null) return { reveal: 0, headOpacity: 0 };
      const raw = Math.max(0, Math.min(1, (
        now - introStartedAt - ringIndex * introRingStagger
      ) / introRingDuration));
      return {
        reveal: easeInOutSine(raw),
        headOpacity: raw > 0.82 ? Math.max(0, (1 - raw) / 0.18) : 1
      };
    }

    function colorWithAlpha(color, alpha) {
      const [red, green, blue] = [1, 3, 5].map(index => parseInt(color.slice(index, index + 2), 16));
      return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    function activeLabelColorWithAlpha(alpha) {
      return colorWithAlpha(activeLabelColor, alpha);
    }

    function rotate(point, rotation) {
      let [x, y, z] = point;
      const [rx, ry, rz] = rotation;
      let cosine = Math.cos(rx);
      let sine = Math.sin(rx);
      [y, z] = [y * cosine - z * sine, y * sine + z * cosine];
      cosine = Math.cos(ry);
      sine = Math.sin(ry);
      [x, z] = [x * cosine + z * sine, -x * sine + z * cosine];
      cosine = Math.cos(rz);
      sine = Math.sin(rz);
      [x, y] = [x * cosine - y * sine, x * sine + y * cosine];
      return [x, y, z];
    }

    function pointOnRing(ringIndex, angle, elapsed) {
      let point = [Math.cos(angle), Math.sin(angle), 0];
      if (ringIndex === 0) return point;
      point = rotate(point, ringRotations[ringIndex]);
      point = rotate(point, [tiltX, elapsed * 0.00008 + tiltY, 0]);
      return point;
    }

    function project(point, radius) {
      const perspective = 1 + point[2] * 0.08;
      return {
        x: width * 0.5 + point[0] * radius * perspective,
        y: height * 0.5 + point[1] * radius * perspective,
        z: point[2]
      };
    }

    function drawTraceHead(ringIndex, ringRadius, reveal, opacity, elapsed, segments) {
      if (reveal <= 0 || opacity <= 0) return;
      const tailStart = Math.max(0, reveal - 0.16);
      const firstSegment = Math.floor(tailStart * segments);
      const lastSegment = Math.ceil(reveal * segments);
      const tailLength = Math.max(0.001, reveal - tailStart);

      context.save();
      context.shadowColor = activeLabelColorWithAlpha(0.55);
      context.shadowBlur = 5;
      for (let index = firstSegment; index < lastSegment; index += 1) {
        const start = Math.max(index / segments, tailStart);
        const end = Math.min((index + 1) / segments, reveal);
        if (end <= start) continue;
        const strength = Math.max(0, Math.min(1, (end - tailStart) / tailLength));
        const pointA = project(pointOnRing(ringIndex, start * Math.PI * 2, elapsed), ringRadius);
        const pointB = project(pointOnRing(ringIndex, end * Math.PI * 2, elapsed), ringRadius);
        context.beginPath();
        context.moveTo(pointA.x, pointA.y);
        context.lineTo(pointB.x, pointB.y);
        context.lineWidth = 1 + strength * 1.1;
        context.strokeStyle = activeLabelColorWithAlpha((0.12 + strength * 0.88) * opacity);
        context.stroke();
      }
      context.restore();
    }

    function draw(elapsed, now = performance.now()) {
      context.clearRect(0, 0, width, height);
      const radius = Math.min(width, height) * 0.42;
      const radiusForRing = ringIndex => ringIndex === 0 ? radius : radius * 1.06;
      const segments = 180;
      const ringIntroStates = ringRotations.map((_, ringIndex) => getRingIntroState(ringIndex, now));

      if (!introComplete && ringIntroStates.every(state => state.reveal >= 1)) {
        introComplete = true;
      }

      ringRotations.forEach((_, ringIndex) => {
        const ringRadius = radiusForRing(ringIndex);
        const introState = ringIntroStates[ringIndex];
        if (introState.reveal <= 0) return;
        if (ringIndex === movingDashRingIndex) {
          context.save();
          context.beginPath();
          const visibleSegments = Math.ceil(segments * introState.reveal);
          for (let index = 0; index <= visibleSegments; index += 1) {
            const angle = Math.min(index / segments, introState.reveal) * Math.PI * 2;
            const point = project(pointOnRing(ringIndex, angle, elapsed), ringRadius);
            if (index === 0) context.moveTo(point.x, point.y);
            else context.lineTo(point.x, point.y);
          }
          context.setLineDash([7, 5]);
          context.lineDashOffset = reducedMotion ? 0 : -(elapsed * 0.028) % 12;
          context.lineWidth = 1.1;
          context.strokeStyle = activeLabelColorWithAlpha(0.78);
          context.stroke();
          context.restore();
          drawTraceHead(ringIndex, ringRadius, introState.reveal, introState.headOpacity, elapsed, segments);
          return;
        }

        const visibleSegments = Math.ceil(segments * introState.reveal);
        for (let index = 0; index < visibleSegments; index += 1) {
          const angleA = index / segments * Math.PI * 2;
          const angleB = Math.min((index + 1) / segments, introState.reveal) * Math.PI * 2;
          const pointA = project(pointOnRing(ringIndex, angleA, elapsed), ringRadius);
          const pointB = project(pointOnRing(ringIndex, angleB, elapsed), ringRadius);
          const colorPhase = ringIndex === 0
            ? 0.88
            : (elapsed * 0.000055 + ringIndex * 0.21) % 1;
          const normalized = index / segments;
          const distance = Math.min(Math.abs(normalized - colorPhase), 1 - Math.abs(normalized - colorPhase));
          const colorStrength = Math.max(0, 1 - distance / 0.12);
          const depthAlpha = 0.22 + (pointA.z + 1) * 0.16;

          context.beginPath();
          context.moveTo(pointA.x, pointA.y);
          context.lineTo(pointB.x, pointB.y);
          context.lineWidth = colorStrength > 0 ? 1.25 : 0.75;
          context.strokeStyle = colorStrength > 0
            ? activeLabelColorWithAlpha(0.18 + colorStrength * 0.78)
            : `rgba(0, 0, 0, ${depthAlpha})`;
          context.stroke();
        }
        drawTraceHead(ringIndex, ringRadius, introState.reveal, introState.headOpacity, elapsed, segments);
      });

      const particlePoints = particles.map((particle, index) => {
        const phase = reducedMotion
          ? particle.phase
          : (particle.phase + elapsed * 0.001 * particle.speed) % 1;
        const point = pointOnRing(particle.ring, phase * Math.PI * 2, elapsed);
        const introAlpha = Math.max(0, Math.min(1, (ringIntroStates[particle.ring].reveal - 0.72) / 0.28));
        return { ...project(point, radiusForRing(particle.ring)), ...particle, index, introAlpha };
      }).sort((a, b) => a.z - b.z);

      const hoveredParticle = pointerInside
        ? particlePoints.reduce((closest, particle) => {
            if (particle.introAlpha < 0.9) return closest;
            const distance = Math.hypot(particle.x - pointerLocalX, particle.y - pointerLocalY);
            if (distance > 12 || (closest && distance >= closest.distance)) return closest;
            return { particle, distance };
          }, null)?.particle
        : null;

      if (hoveredParticle) activeLabelColor = hoveredParticle.color;

      particlePoints.forEach(particle => {
        if (particle.introAlpha <= 0) return;
        const isHovered = hoveredParticle?.index === particle.index;
        const isColored = isHovered || particle.index === 0 || particle.index === 5;
        context.beginPath();
        context.arc(particle.x, particle.y, isHovered ? 4.8 : particle.radius, 0, Math.PI * 2);
        context.fillStyle = isColored
          ? colorWithAlpha(particle.color, (0.62 + (particle.z + 1) * 0.16) * particle.introAlpha)
          : `rgba(0, 0, 0, ${(0.22 + (particle.z + 1) * 0.20) * particle.introAlpha})`;
        context.fill();
      });

      if (hoveredParticle) {
        context.save();
        context.font = '500 15px "Geist", "Frex Sans GB VF", sans-serif';
        context.textBaseline = 'middle';
        const textWidth = context.measureText(hoveredParticle.label).width;
        const labelWidth = textWidth + 12;
        const preferredX = hoveredParticle.x + 10;
        const labelX = preferredX + labelWidth > width - 4
          ? hoveredParticle.x - labelWidth - 10
          : preferredX;
        const labelY = Math.max(4, Math.min(height - 28, hoveredParticle.y - 12));
        context.fillStyle = hoveredParticle.color;
        context.fillRect(labelX, labelY, labelWidth, 24);
        const frameX = labelX - 2;
        const frameY = labelY - 2;
        const frameWidth = labelWidth + 4;
        const frameHeight = 28;
        const cornerLength = 7;
        context.beginPath();
        context.moveTo(frameX + cornerLength, frameY + 0.5);
        context.lineTo(frameX + 0.5, frameY + 0.5);
        context.lineTo(frameX + 0.5, frameY + cornerLength);
        context.moveTo(frameX + cornerLength, frameY + frameHeight - 0.5);
        context.lineTo(frameX + 0.5, frameY + frameHeight - 0.5);
        context.lineTo(frameX + 0.5, frameY + frameHeight - cornerLength);
        context.moveTo(frameX + frameWidth - cornerLength, frameY + 0.5);
        context.lineTo(frameX + frameWidth - 0.5, frameY + 0.5);
        context.lineTo(frameX + frameWidth - 0.5, frameY + cornerLength);
        context.moveTo(frameX + frameWidth - cornerLength, frameY + frameHeight - 0.5);
        context.lineTo(frameX + frameWidth - 0.5, frameY + frameHeight - 0.5);
        context.lineTo(frameX + frameWidth - 0.5, frameY + frameHeight - cornerLength);
        context.strokeStyle = hoveredParticle.color;
        context.lineWidth = 1;
        context.stroke();
        context.fillStyle = colorToken('--white-100', '#FFFFFF');
        context.fillText(hoveredParticle.label, labelX + 6, labelY + 12);
        context.restore();
      }

      stage.style.cursor = hoveredParticle ? 'pointer' : 'crosshair';
    }

    function frame(now) {
      tiltX += (pointerY - tiltX) * 0.055;
      tiltY += (pointerX - tiltY) * 0.055;
      draw(now - startTime, now);
      if (!reducedMotion && visible) frameId = requestAnimationFrame(frame);
    }

    function resize() {
      const rect = stage.getBoundingClientRect();
      const pixelRatio = Math.min(devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const now = performance.now();
      draw(now - startTime, now);
    }

    stage.addEventListener('pointermove', event => {
      const rect = stage.getBoundingClientRect();
      pointerInside = true;
      pointerLocalX = event.clientX - rect.left;
      pointerLocalY = event.clientY - rect.top;
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.7;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.5;
      if (reducedMotion) {
        tiltX = pointerY;
        tiltY = pointerX;
        draw(0, performance.now());
      }
    });

    stage.addEventListener('pointerleave', () => {
      pointerInside = false;
      pointerX = 0;
      pointerY = 0;
      stage.style.cursor = 'crosshair';
    });

    addEventListener('main-palette-change', () => draw(reducedMotion ? 0 : performance.now() - startTime));

    new ResizeObserver(resize).observe(stage);
    new IntersectionObserver(entries => {
      const nextVisible = entries[0].isIntersecting;
      if (nextVisible && introStartedAt === null) introStartedAt = performance.now();
      if (nextVisible && !visible && !reducedMotion) {
        visible = true;
        if (introStartedAt === null) introStartedAt = performance.now();
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(frame);
      } else {
        visible = nextVisible;
        if (!visible) cancelAnimationFrame(frameId);
      }
    }, { threshold: 0 }).observe(stage);

    resize();
    if (!reducedMotion) frameId = requestAnimationFrame(frame);
    addEventListener('pagehide', () => cancelAnimationFrame(frameId), { once: true });
  })();
  return () => {};
}
