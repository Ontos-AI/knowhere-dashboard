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

type LandingDataTranslate = (key: string) => string;

export const supportedFormats: FormatChip[] = [
  { label: ".docx", tone: { background: "#dbeafe", border: "#bedbff", text: "#1c398e" } },
  { label: ".pdf", tone: { background: "#ffe2e2", border: "#ffc9c9", text: "#9f0712" } },
  { label: ".jpg", tone: { background: "#fae8ff", border: "#f6cfff", text: "#8a0194" } },
  { label: ".pptx", tone: { background: "#ffedd4", border: "#ffd6a8", text: "#9f2d00" } },
  { label: ".xlsx", tone: { background: "#d0fae5", border: "#a4f4cf", text: "#006045" } },
  { label: ".csv", tone: { background: "#cffafe", border: "#a5f3fc", text: "#155e75" } },
  { label: ".png", tone: { background: "#ede9fe", border: "#ddd6ff", text: "#5b21b6" } },
  { label: ".md", tone: { background: "#ecfccb", border: "#d9f99d", text: "#4d7c0f" } },
  { label: ".json", tone: { background: "#fef3c6", border: "#fde68a", text: "#a16207" } },
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

export const getIntegrationSteps = (t: LandingDataTranslate): IntegrationStep[] => [
  {
    number: "1",
    title: t("integrationSteps.getApiKey.title"),
    description: t("integrationSteps.getApiKey.description"),
  },
  {
    number: "2",
    title: t("integrationSteps.submitJob.title"),
    description: t("integrationSteps.submitJob.description"),
  },
  {
    number: "3",
    title: t("integrationSteps.receiveResults.title"),
    description: t("integrationSteps.receiveResults.description"),
  },
];

export const getComparisonHighlights = (t: LandingDataTranslate): readonly string[] =>
  [
    t("comparisonHighlights.search"),
    t("comparisonHighlights.traceability"),
    t("comparisonHighlights.tokens"),
  ] as const;

export const comparisonTabs: ComparisonTab[] = [
  "All",
  "Structures",
  "Tables",
  "Interpretability",
  "Downstream",
];

export const getComparisonTabLabel = (t: LandingDataTranslate, tab: ComparisonTab): string => {
  const comparisonTabLabelKeyByTab = {
    All: "comparisonTabs.all",
    Structures: "comparisonTabs.structures",
    Tables: "comparisonTabs.tables",
    Interpretability: "comparisonTabs.interpretability",
    Downstream: "comparisonTabs.downstream",
  } as const satisfies Record<ComparisonTab, string>;

  return t(comparisonTabLabelKeyByTab[tab]);
};

export const getComparisonRows = (t: LandingDataTranslate): ComparisonRow[] => [
  {
    category: "Structures",
    feature: t("comparisonRows.hierarchy.feature"),
    knowhere: "yes",
    others: "bad",
    description: t("comparisonRows.hierarchy.description"),
  },
  {
    category: "Tables",
    feature: t("comparisonRows.mergedCells.feature"),
    knowhere: "yes",
    others: "bad",
    description: t("comparisonRows.mergedCells.description"),
    emphasize: true,
    knowhereStripe: true,
    othersStripe: true,
  },
  {
    category: "Tables",
    feature: t("comparisonRows.tableBoundaries.feature"),
    knowhere: "yes",
    others: "no",
    description: t("comparisonRows.tableBoundaries.description"),
  },
  {
    category: "Interpretability",
    feature: t("comparisonRows.traceability.feature"),
    knowhere: "yes",
    others: "bad",
    description: t("comparisonRows.traceability.description"),
    emphasize: true,
    knowhereStripe: true,
    othersStripe: true,
  },
  {
    category: "Downstream",
    feature: t("comparisonRows.memory.feature"),
    knowhere: "yes",
    others: "no",
    description: t("comparisonRows.memory.description"),
  },
  {
    category: "Downstream",
    feature: t("comparisonRows.rag.feature"),
    knowhere: "yes",
    others: "no",
    description: t("comparisonRows.rag.description"),
    emphasize: true,
    knowhereStripe: true,
    othersStripe: true,
  },
  {
    category: "Downstream",
    feature: t("comparisonRows.topK.feature"),
    knowhere: "yes",
    others: "no",
    description: t("comparisonRows.topK.description"),
  },
  {
    category: "Downstream",
    feature: t("comparisonRows.tokenSavings.feature"),
    knowhere: "yes",
    others: "no",
    description: t("comparisonRows.tokenSavings.description"),
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

export const getChallengeCards = (t: LandingDataTranslate): ChallengeCard[] => [
  {
    title: t("challengeCards.agentic.title"),
    description: t("challengeCards.agentic.description"),
    icon: "agentic",
    tone: { background: "#ffe2e2", border: "#ffc9c9", text: "#e7000b" },
  },
  {
    title: t("challengeCards.adaptive.title"),
    description: t("challengeCards.adaptive.description"),
    icon: "adaptive",
    tone: { background: "#fef3c6", border: "#fde68a", text: "#d08700" },
  },
  {
    title: t("challengeCards.format.title"),
    description: t("challengeCards.format.description"),
    icon: "format",
    tone: { background: "#d0fae5", border: "#a4f4cf", text: "#00bc7d" },
  },
  {
    title: t("challengeCards.trace.title"),
    description: t("challengeCards.trace.description"),
    icon: "trace",
    tone: { background: "#dbeafe", border: "#bedbff", text: "#2b7fff" },
  },
  {
    title: t("challengeCards.deploy.title"),
    description: t("challengeCards.deploy.description"),
    icon: "deploy",
    tone: { background: "#e0e7ff", border: "#c7d2fe", text: "#615fff" },
  },
  {
    title: t("challengeCards.api.title"),
    description: t("challengeCards.api.description"),
    icon: "api",
    tone: { background: "#fae8ff", border: "#f6cfff", text: "#d100d7" },
  },
];

export const getTransformSteps = (t: LandingDataTranslate): TransformStep[] => [
  {
    number: "1",
    title: t("transformSteps.input.title"),
    description: t("transformSteps.input.description"),
    tone: { background: "#f5f3ff", border: "#ddd6ff", text: "#7c3aed", numberBg: "#a78bfa" },
  },
  {
    number: "2",
    title: t("transformSteps.detection.title"),
    description: t("transformSteps.detection.description"),
    tone: { background: "#eef2ff", border: "#c7d2fe", text: "#4338ca", numberBg: "#818cf8" },
  },
  {
    number: "3",
    title: t("transformSteps.structure.title"),
    description: t("transformSteps.structure.description"),
    tone: { background: "#eff6ff", border: "#bfdbfe", text: "#2563eb", numberBg: "#60a5fa" },
  },
  {
    number: "4",
    title: t("transformSteps.output.title"),
    description: t("transformSteps.output.description"),
    tone: { background: "#f0f9ff", border: "#bae6fd", text: "#0284c7", numberBg: "#38bdf8" },
  },
];

export const getTransformMetrics = (t: LandingDataTranslate): MetricCard[] => [
  {
    value: "20+",
    label: t("transformMetrics.formats"),
    tone: { background: "#f5f3ff", border: "#ede9fe", text: "#7c3aed" },
    stripe: true,
  },
  {
    value: "~95%",
    label: t("transformMetrics.formula"),
    tone: { background: "#eff6ff", border: "#dbeafe", text: "#3b82f6" },
  },
  {
    value: "100%",
    label: t("transformMetrics.traceability"),
    tone: { background: "#eef2ff", border: "#e0e7ff", text: "#6366f1" },
  },
  {
    value: ">10%",
    label: t("transformMetrics.ragBoost"),
    tone: { background: "#f0f9ff", border: "#dff2fe", text: "#0ea5e9" },
  },
];

export const getPricingExamples = (t: LandingDataTranslate): PriceExample[] => [
  { value: "$1.50", label: t("pricingExamples.small") },
  { value: "$7.50", label: t("pricingExamples.medium") },
  { value: "$150", label: t("pricingExamples.large") },
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

export const getEnterpriseItems = (t: LandingDataTranslate): readonly string[] =>
  [
    t("enterpriseItems.rateLimits"),
    t("enterpriseItems.priority"),
    t("enterpriseItems.support"),
    t("enterpriseItems.sla"),
    t("enterpriseItems.discounts"),
    t("enterpriseItems.invoice"),
  ] as const;

export const getFaqItems = (t: LandingDataTranslate): FaqItem[] => [
  {
    question: t("faqItems.charged.question"),
    answer: t("faqItems.charged.answer"),
  },
  {
    question: t("faqItems.rollover.question"),
    answer: t("faqItems.rollover.answer"),
  },
  {
    question: t("faqItems.refund.question"),
    answer: t("faqItems.refund.answer"),
  },
  {
    question: t("faqItems.payment.question"),
    answer: t("faqItems.payment.answer"),
  },
];
