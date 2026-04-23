export type HeroCard = {
  eyebrow: string;
  title: string;
  description: string;
};

export type ChatMessage = {
  from: "user" | "agent";
  text: string;
  highlight?: string;
  reaction?: string;
  citations?: readonly string[];
};

export type InstallCard = {
  step: string;
  title: string;
  description: string;
  command: string;
};

export type FinancialRow = {
  metric: string;
  q12024: string;
  q42025: string;
};

export const inputFormats = ["PDF", "DOCX", "XLSX", "PPT"] as const;

export const KNOWHERE_CLAW_PACKAGE_NAME = "@ontos-ai/knowhere-claw";
export const KNOWHERE_CLAW_PACKAGE_URL = "https://www.npmjs.com/package/@ontos-ai/knowhere-claw";
export const KNOWHERE_CLAWHUB_SKILL_NAME = "Knowhere";
export const KNOWHERE_CLAWHUB_SKILL_URL = "https://clawhub.ai/ErickThoughts/clawhub-knowhere";

export const contextTraits = [
  "Browse-first",
  "Path-aware",
  "Chunk-backed",
  "Citation-ready",
  "OpenClaw-native",
] as const;

export const heroCards: readonly HeroCard[] = [
  {
    eyebrow: "Result packages",
    title: "Store once. Reopen anytime.",
    description:
      "Knowhere parses the document, OpenClaw stores the returned package locally, and agents can reopen the exact manifest, hierarchy, chunks, and raw files later.",
  },
  {
    eyebrow: "Tool surface",
    title: "Browse before the answer.",
    description:
      "The plugin registers `knowhere_*` tools for preview, grep, raw-file reads, cleanup, and explicit ingest flows instead of forcing everything through one opaque call.",
  },
  {
    eyebrow: "Auto-grounding",
    title: "Context arrives when it matters.",
    description:
      "When `autoGrounding` is enabled, OpenClaw can auto-ingest attachments and inject compact document availability or status context right into the agent loop.",
  },
] as const;

export const financialRows: readonly FinancialRow[] = [
  {
    metric: "Operating cash flow",
    q12024: "$242M",
    q42025: "$4,167M",
  },
  {
    metric: "Capital expenditures",
    q12024: "$2,777M",
    q42025: "$2,747M",
  },
  {
    metric: "Free cash flow",
    q12024: "−$2,535M",
    q42025: "$1,420M",
  },
] as const;

export const chatMessages: readonly ChatMessage[] = [
  {
    from: "user",
    text: "Did Tesla's free cash flow go negative in any quarter? Show the supporting chunk.",
    reaction: "👀",
  },
  {
    from: "agent",
    text: "Yes. Q1 2024 is the only negative quarter. Operating cash fell to $242M while CapEx stayed at $2,777M.",
    highlight: "−$2,535M",
    citations: ["manifest.json", "chunks.json", "page-33 / table-14"],
  },
  {
    from: "user",
    text: "What should I inspect if I want the raw source instead of the answer?",
    reaction: "🧭",
  },
  {
    from: "agent",
    text: "Open the preview first, grep for the metric, then read the exact result file behind that chunk. The plugin keeps the path surface intact.",
    highlight: "preview → grep → read_result_file",
    citations: ["knowhere_preview_document", "knowhere_grep", "knowhere_read_result_file"],
  },
] as const;

export const installCards: readonly InstallCard[] = [
  {
    step: "01",
    title: "Install package",
    description: "Add the packaged runtime so OpenClaw can load the bundled knowhere skill.",
    command: `openclaw plugins install ${KNOWHERE_CLAW_PACKAGE_NAME}`,
  },
  {
    step: "02",
    title: "Attach API key",
    description: "Connect this OpenClaw instance to your Knowhere account.",
    command: 'openclaw config set plugins.entries.knowhere.config.apiKey "sk_..."',
  },
  {
    step: "03",
    title: "Enable plugin",
    description: "Turn the entry on so agents can load the plugin inside the runtime.",
    command: "openclaw plugins enable knowhere",
  },
] as const;

export const ctaOutcomes = [
  {
    title: "knowhere_* tools",
    description: "Preview, grep, raw-file reads, ingest, and cleanup become callable in one place.",
  },
  {
    title: "Browse-first evidence",
    description: "Agents can reopen manifest, hierarchy, chunks, and raw files before answering.",
  },
  {
    title: "Scoped local storage",
    description: "Result packages stay reusable across session, agent, or global scopes.",
  },
] as const;
