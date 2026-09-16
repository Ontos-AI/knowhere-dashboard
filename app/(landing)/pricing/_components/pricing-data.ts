import { siteChromeLinks } from "@components/site-chrome/links";

export const PRICING_CONTACT_HREF = "mailto:team@knowhereto.ai";
export const PRICING_LOGIN_HREF = siteChromeLinks.login;
export const PRICING_DOCS_HREF = siteChromeLinks.docs;

/** Live pay-as-you-go rate already used on Landing ($1.50 / 100 pages). */
export const BILLABLE_PAGE_RATE_USD = 0.015;
export const BILLABLE_PACK_PAGES = 100;

export const CALCULATOR_MIN_PAGES = 100;
export const CALCULATOR_MAX_PAGES = 10_000;
export const CALCULATOR_STEP_PAGES = 100;
export const CALCULATOR_DEFAULT_PAGES = 500;

export const CALCULATOR_TICKS = [2500, 5000, 7500] as const;

export const EXAMPLE_PAGE_COUNTS = {
  report: 100,
  contracts: 500,
  volume: 10_000,
} as const;

export const STANDARD_FILE_LIMITS = [
  { key: "pdf", extension: ".pdf", size: "100M" },
  { key: "docx", extension: ".docx", size: "50M" },
  { key: "xlsx", extension: ".xlsx", size: "50M" },
  { key: "pptx", extension: ".pptx", size: "100M" },
] as const;

export type StandardFileLimit = (typeof STANDARD_FILE_LIMITS)[number];

export const FAQ_ITEM_KEYS = [
  "billingRules",
  "creditTiming",
  "failedJobs",
  "creditExpiry",
  "payment",
  "refund",
  "taxes",
  "gettingStarted",
] as const;

export type FaqItemKey = (typeof FAQ_ITEM_KEYS)[number];

export const FAQ_ITEM_IDS: Partial<Record<FaqItemKey, string>> = {
  billingRules: "billing-rules",
  creditTiming: "credit-timing",
  failedJobs: "failed-jobs",
  creditExpiry: "credit-expiry",
};

export const ENTERPRISE_FEATURE_KEYS = ["volume", "deployment", "priority", "sla"] as const;

export const FINAL_CTA_BENEFIT_KEYS = ["trial", "custom", "noCard", "support"] as const;

export const formatUsd = (amount: number): string => {
  const fraction = amount.toString().split(".")[1] ?? "";
  const digits = Number.isInteger(amount) ? 2 : Math.max(2, Math.min(3, fraction.length));
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
};

export const formatPageCount = (pages: number): string => pages.toLocaleString("en-US");

export const costForPages = (pages: number): string => formatUsd(pages * BILLABLE_PAGE_RATE_USD);

export const PACK_PRICE_LABEL = formatUsd(BILLABLE_PAGE_RATE_USD * BILLABLE_PACK_PAGES);
export const PAGE_RATE_LABEL = formatUsd(BILLABLE_PAGE_RATE_USD);
