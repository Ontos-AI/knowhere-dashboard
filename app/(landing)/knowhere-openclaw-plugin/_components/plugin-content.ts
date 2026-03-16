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
  code: string;
};

export type FinancialRow = {
  metric: string;
  q12024: string;
  q42025: string;
};

export const inputFormats = ["PDF", "DOCX", "XLSX", "PPT"] as const;

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
    step: "Step 1",
    title: "Install the plugin",
    description:
      "Add the packaged runtime to OpenClaw so the bundled tools and the `knowhere` skill are available.",
    code: "openclaw plugins install @ontos/knowhere-claw",
  },
  {
    step: "Step 2",
    title: "Set your Knowhere API key",
    description:
      "Point the plugin at your Knowhere account. The config can also fall back to `KNOWHERE_API_KEY`.",
    code: 'openclaw config set plugins.entries.knowhere.config.apiKey "sk_..."',
  },
  {
    step: "Step 3",
    title: "Enable it in OpenClaw",
    description:
      "Turn the entry on and let the agent runtime load the plugin plus its bundled usage guidance.",
    code: "openclaw plugins enable knowhere",
  },
] as const;

export const pluginResponsibilities = [
  "Register the `knowhere_*` tools.",
  "Optionally auto-ingest supported attachments.",
  "Persist extracted Knowhere result packages by scope.",
  "Expose browse-first path, chunk, context, and raw-file access back to agents.",
  "Inject compact document status context when `autoGrounding` is enabled.",
] as const;

export const browseWorkflow = [
  "Read `manifest.json` to understand the package.",
  "Preview the stored document before answering.",
  "Grep for the exact concept, metric, or entity you need.",
  "Reopen `hierarchy.json`, `kb.csv`, or chunk HTML when the answer depends on structure.",
] as const;

export const runtimeSurfaces = [
  {
    title: "Tools",
    description: "Explicit ingest, browse, raw-file read, preview, job, and cleanup operations.",
  },
  {
    title: "Hooks",
    description: "Background attachment ingest plus prompt-time document and status injection.",
  },
  {
    title: "Skill",
    description:
      "Bundled `knowhere` guidance so agents know when to preview, grep, and reopen files.",
  },
] as const;

export const scopeModes = [
  {
    title: "session",
    description: "Keep documents local to one chat or run.",
  },
  {
    title: "agent",
    description: "Share stored packages across the same agent identity.",
  },
  {
    title: "global",
    description: "Expose one shared document memory across OpenClaw.",
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

export const configSnippet = `{
  plugins: {
    load: {
      paths: ["/absolute/path/to/knowhere-openclaw-plugin"],
    },
    entries: {
      knowhere: {
        enabled: true,
        config: {
          apiKey: "sk_...",
          scopeMode: "session",
          autoGrounding: true,
        },
      },
    },
  },
}`;

export const storageTree = `<scope>/
  index.json
  documents/
    <docId>/
      metadata.json
      browse-index.json
      result/
        manifest.json
        chunks.json
        hierarchy.json
        full.md`;
