export type FormatTone = {
  background: string;
  border: string;
  text: string;
  numberBg?: string;
};

export type FormatChip = {
  label: string;
  tone: FormatTone;
};

export type IntegrationStep = {
  number: string;
  title: string;
  description: string;
};

export type ComparisonStatus = "yes" | "bad" | "no";

export type ComparisonCategory = "Structures" | "Tables" | "Interpretability" | "Downstream";

export type ComparisonTab = "All" | ComparisonCategory;

export type ComparisonRow = {
  category: ComparisonCategory;
  feature: string;
  knowhere: ComparisonStatus;
  others: ComparisonStatus;
  description?: string;
  emphasize?: boolean;
  knowhereStripe?: boolean;
  othersStripe?: boolean;
  callout?: boolean;
};

export type ChallengeCard = {
  title: string;
  description: string;
  icon: "agentic" | "adaptive" | "format" | "trace" | "deploy" | "api";
  tone: FormatTone;
};

export type TransformStep = {
  number: string;
  title: string;
  description: string;
  tone: FormatTone;
};

export type MetricCard = {
  value: string;
  label: string;
  tone: FormatTone;
  stripe?: boolean;
};

export type PriceExample = {
  value: string;
  label: string;
};

export type WhyChooseCompetitorId = "unstructured" | "markitdown";

export type WhyChooseMetric = {
  value: string;
  label: string;
};

export type WhyChooseProduct = {
  id: WhyChooseCompetitorId;
  tabLabel: string;
  description: string;
  advantages: string[];
  headline: string;
  metrics: WhyChooseMetric[];
};

export type FileLimit = {
  format: string;
  size: string;
  tone: FormatTone;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const supportedFormats: FormatChip[] = [
  { label: ".docx", tone: { background: "#dbeafe", border: "#bedbff", text: "#1c398e" } },
  { label: ".pdf", tone: { background: "#ffe2e2", border: "#ffc9c9", text: "#9f0712" } },
  { label: ".jpg", tone: { background: "#fae8ff", border: "#f6cfff", text: "#8a0194" } },
  { label: ".pptx", tone: { background: "#ffedd4", border: "#ffd6a8", text: "#9f2d00" } },
  { label: ".xlsx", tone: { background: "#d0fae5", border: "#a4f4cf", text: "#006045" } },
  { label: ".csv", tone: { background: "#cffafe", border: "#a5f3fc", text: "#155e75" } },
  { label: ".png", tone: { background: "#ede9fe", border: "#ddd6ff", text: "#5b21b6" } },
  { label: ".md", tone: { background: "#ecfccb", border: "#d9f99d", text: "#4d7c0f" } },
  { label: ".josn", tone: { background: "#fef3c6", border: "#fde68a", text: "#a16207" } },
  { label: ".txt", tone: { background: "#e0e7ff", border: "#c7d2fe", text: "#3730a3" } },
];

export const comingSoonFormats: FormatChip[] = [
  { label: ".epub", tone: { background: "#f4f4f5", border: "#d4d4d8", text: "#9f9fa9" } },
  { label: ".html", tone: { background: "#f4f4f5", border: "#d4d4d8", text: "#9f9fa9" } },
  { label: ".xml", tone: { background: "#f4f4f5", border: "#d4d4d8", text: "#9f9fa9" } },
  { label: ".mp4", tone: { background: "#f4f4f5", border: "#d4d4d8", text: "#9f9fa9" } },
  { label: ".mp3", tone: { background: "#f4f4f5", border: "#d4d4d8", text: "#9f9fa9" } },
  { label: ".skills.md", tone: { background: "#f4f4f5", border: "#d4d4d8", text: "#9f9fa9" } },
];

export const integrationSteps: IntegrationStep[] = [
  {
    number: "1",
    title: "GET YOUR API KEY",
    description: "Sign up and generate your secure API key from the dashboard.",
  },
  {
    number: "2",
    title: "SUBMIT A JOB",
    description: "Send a URL or upload a file to our processing queue.",
  },
  {
    number: "3",
    title: "RECEIVE RESULTS",
    description: "Get structured JSON data via webhook or polling.",
  },
];

export const comparisonHighlights = [
  ">10% Searching accuracy improvement in complex production data",
  "100% Traceability",
  "50%+ Token saving when developing knowledge graphs",
] as const;

export const comparisonTabs: ComparisonTab[] = [
  "All",
  "Structures",
  "Tables",
  "Interpretability",
  "Downstream",
];

export const comparisonRows: ComparisonRow[] = [
  {
    category: "Structures",
    feature: "Hierarchy construction",
    knowhere: "yes",
    others: "bad",
    description:
      "Automatically recognize and construct hierarchical data structures, such as multi-level section titles and multi-index headers",
  },
  {
    category: "Tables",
    feature: "Complex merged cells",
    knowhere: "yes",
    others: "bad",
    description: "Accurately handle multi-level merged cells in both doc files and tables",
    emphasize: true,
    knowhereStripe: true,
    othersStripe: true,
  },
  {
    category: "Tables",
    feature: "Table boundary detection",
    knowhere: "yes",
    others: "no",
    description: "Automatically separate tables in one table sheet based on boundary detection",
  },
  {
    category: "Interpretability",
    feature: "Source traceability",
    knowhere: "yes",
    others: "bad",
    description:
      "Trace each information piece to its original section in the raw source with clear boundary",
    emphasize: true,
    knowhereStripe: true,
    othersStripe: true,
  },
  {
    category: "Downstream",
    feature: "Hierarchical memory & progressive disclosure",
    knowhere: "yes",
    others: "no",
    description: "Naturally supports hierarchical memory and progressive disclosure",
  },
  {
    category: "Downstream",
    feature: "Vectorless RAG & hybrid RAG",
    knowhere: "yes",
    others: "no",
    description:
      "Produces cleaner hierarchies, clearer boundaries, and better grounding for retrieval and citation",
    emphasize: true,
    knowhereStripe: true,
    othersStripe: true,
  },
  {
    category: "Downstream",
    feature: "Top-K boost ~10%+ in production",
    knowhere: "yes",
    others: "no",
    description: "Boost Top-K by ~10%+ in production data when applying RAG pipelines",
  },
  {
    category: "Downstream",
    feature: "50%+ token savings on graphs",
    knowhere: "yes",
    others: "no",
    description: "Save 50%+ tokens when developing graphs",
    emphasize: true,
    knowhereStripe: true,
    othersStripe: true,
  },
];

export const whyChooseProducts: WhyChooseProduct[] = [
  {
    id: "unstructured",
    tabLabel: "Unstructured",
    description:
      "Unstructured is an open-source document processing tool that provides basic text extraction. While functional for simple documents, it struggles with complex table structures and loses important semantic information during parsing.",
    advantages: [
      "Open-source and community-driven development",
      "Basic text extraction for simple documents",
      "Supports multiple common file formats",
    ],
    headline: "Why Knowhere delivers superior document parsing for complex tables",
    metrics: [
      {
        value: "90%+",
        label: "Complex Table Parsing Accuracy",
      },
      {
        value: "Better",
        label: "Nested Table Detection",
      },
    ],
  },
  {
    id: "markitdown",
    tabLabel: "Markitdown",
    description:
      "Markitdown focuses on converting documents to Markdown format with a lightweight approach. However, it lacks the sophistication needed for complex document structures and often produces suboptimal results with tables and nested content.",
    advantages: [
      "Simple Markdown conversion workflow",
      "Lightweight and easy to integrate",
      "Good for basic text documents",
    ],
    headline: "Why Knowhere is the superior choice for markdown conversion",
    metrics: [
      {
        value: "95%+",
        label: "Structure Preservation",
      },
      {
        value: "98%+",
        label: "Content & Order Consistency",
      },
    ],
  },
];

export const challengeCards: ChallengeCard[] = [
  {
    title: "Agentic-Native Structure",
    description:
      "Progressive disclosure and hierarchical memory natively designed for agentic engineering workflows",
    icon: "agentic",
    tone: { background: "#ffe2e2", border: "#ffc9c9", text: "#e7000b" },
  },
  {
    title: "Formula & Chemical Recognition",
    description:
      "Extract mathematical formulas (LaTeX/MathML) and chemical structures with ~95% accuracy for scientific documents",
    icon: "adaptive",
    tone: { background: "#fef3c6", border: "#fde68a", text: "#d08700" },
  },
  {
    title: "Multi-format Support",
    description:
      "Process 20+ major file formats: PDF, DOCX, XLSX, PPT, HTML, Images, and more with unified API",
    icon: "format",
    tone: { background: "#d0fae5", border: "#a4f4cf", text: "#00bc7d" },
  },
  {
    title: "Full Provenance Tracing",
    description:
      "100% source traceability for every extracted element, making it easy to audit and verify AI-generated content",
    icon: "trace",
    tone: { background: "#dbeafe", border: "#bedbff", text: "#2b7fff" },
  },
  {
    title: "On-premise Deployment",
    description:
      "Supports local deployment for enterprise long-tail needs: conflict detection, compliance auditing, risk identification, and more",
    icon: "deploy",
    tone: { background: "#e0e7ff", border: "#c7d2fe", text: "#615fff" },
  },
  {
    title: "API First Design",
    description:
      "RESTful API with webhooks, comprehensive SDKs for all major languages, and detailed documentation",
    icon: "api",
    tone: { background: "#fae8ff", border: "#f6cfff", text: "#d100d7" },
  },
];

export const transformSteps: TransformStep[] = [
  {
    number: "1",
    title: "Input",
    description: "Upload document (PDF, DOCX, XLSX, etc.)",
    tone: { background: "#f5f3ff", border: "#ddd6ff", text: "#7c3aed", numberBg: "#a78bfa" },
  },
  {
    number: "2",
    title: "OCR & Detection",
    description: "Extract text, detect tables, formulas, images",
    tone: { background: "#eef2ff", border: "#c7d2fe", text: "#4338ca", numberBg: "#818cf8" },
  },
  {
    number: "3",
    title: "Structure Analysis",
    description: "Analyze layout, relationships, hierarchies",
    tone: { background: "#eff6ff", border: "#bfdbfe", text: "#2563eb", numberBg: "#60a5fa" },
  },
  {
    number: "4",
    title: "JSON Output",
    description: "Clean, structured data for AI consumption",
    tone: { background: "#f0f9ff", border: "#bae6fd", text: "#0284c7", numberBg: "#38bdf8" },
  },
];

export const transformMetrics: MetricCard[] = [
  {
    value: "20+",
    label: "File Formats",
    tone: { background: "#f5f3ff", border: "#ede9fe", text: "#7c3aed" },
    stripe: true,
  },
  {
    value: "~95%",
    label: "Formula Accuracy",
    tone: { background: "#eff6ff", border: "#dbeafe", text: "#3b82f6" },
  },
  {
    value: "100%",
    label: "Source Traceability",
    tone: { background: "#eef2ff", border: "#e0e7ff", text: "#6366f1" },
  },
  {
    value: ">10%",
    label: "RAG Top-K Boost",
    tone: { background: "#f0f9ff", border: "#dff2fe", text: "#0ea5e9" },
  },
];

export const pricingExamples: PriceExample[] = [
  { value: "$0.15", label: "100-page PDF" },
  { value: "$0.75", label: "500-page document" },
  { value: "$15", label: "10,000 pages" },
];

export const fileLimits: FileLimit[] = [
  {
    format: ".pdf",
    size: "100M",
    tone: { background: "#ffe2e2", border: "#ffc9c9", text: "#9f0712" },
  },
  {
    format: ".docx",
    size: "50M",
    tone: { background: "#dbeafe", border: "#bedbff", text: "#1c398e" },
  },
  {
    format: ".xlsx",
    size: "50M",
    tone: { background: "#d0fae5", border: "#a4f4cf", text: "#006045" },
  },
  {
    format: ".pptx",
    size: "100M",
    tone: { background: "#ffedd4", border: "#ffd6a8", text: "#9f2d00" },
  },
];

export const enterpriseItems = [
  "Custom rate limits",
  "Priority processing",
  "Dedicated support channel",
  "Custom SLA agreements",
  "Volume discounts",
  "Invoice billing",
] as const;

export const faqItems: FaqItem[] = [
  {
    question: "When am I charged?",
    answer:
      "Page credits are deducted when a job completes successfully. Failed jobs do not consume credits.",
  },
  {
    question: "Do unused pages roll over?",
    answer: "Page credits expire 3 months after purchase.",
  },
  {
    question: "Can I get a refund?",
    answer: "Contact team@knowhereto.ai for refund requests within 14 days of purchase.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major credit cards through Stripe: Visa, Mastercard, American Express, and more.",
  },
];
