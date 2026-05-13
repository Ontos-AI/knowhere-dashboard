import type { KnowhereIconName } from "@components/ui/knowhere-icon";

export type ClawNavItem = {
  href: string;
  isExternal?: boolean;
  label: string;
};

export const clawNavItems: ClawNavItem[] = [
  { href: "#overview", label: "Overview" },
  { href: "#workflow", label: "Workflow" },
  { href: "#integration", label: "Integration" },
  { href: "#docs", label: "Docs" },
];

export const homeNavItems: ClawNavItem[] = [
  { href: "#workflow", label: "Comparison" },
  { href: "#integration", label: "Pricing" },
  { href: "https://docs.knowhereto.ai/", isExternal: true, label: "Docs" },
];

export type HeroFileBadge = {
  backgroundColor: string;
  borderColor: string;
  cornerColor: string;
  label: string;
  stripeColor: string;
  textColor: string;
};

export const heroFileBadges: HeroFileBadge[] = [
  {
    backgroundColor: "#f5f3ff",
    borderColor: "#ede9fe",
    cornerColor: "#ddd6ff",
    label: ".pdf",
    stripeColor: "rgba(167, 139, 250, 0.18)",
    textColor: "#5d0ec0",
  },
  {
    backgroundColor: "#eff6ff",
    borderColor: "#dbeafe",
    cornerColor: "#8ec5ff",
    label: ".docx",
    stripeColor: "rgba(59, 130, 246, 0.16)",
    textColor: "#1c398e",
  },
  {
    backgroundColor: "#ecfdf5",
    borderColor: "#d0fae5",
    cornerColor: "#5ee9b5",
    label: ".xlsx",
    stripeColor: "rgba(16, 185, 129, 0.16)",
    textColor: "#006045",
  },
  {
    backgroundColor: "#fff7ed",
    borderColor: "#ffedd4",
    cornerColor: "#ffb86a",
    label: ".ppt",
    stripeColor: "rgba(249, 115, 22, 0.16)",
    textColor: "#9f2d00",
  },
];

export type HeroCapabilityTag = {
  accentColor: string;
  label: string;
  textColor: string;
};

export const heroCapabilityTags: HeroCapabilityTag[] = [
  { accentColor: "#615fff", label: "Browse-first", textColor: "#1e1a4d" },
  { accentColor: "#e12afb", label: "Path-aware", textColor: "#4b004f" },
  { accentColor: "#ff6900", label: "Chunk-backed", textColor: "#441306" },
  { accentColor: "#efb100", label: "Citation-ready", textColor: "#432004" },
  { accentColor: "#7ccf00", label: "OpenClaw-native", textColor: "#192e03" },
];

export type ClawFeatureCard = {
  description: string;
  icon: KnowhereIconName;
  iconBorderColor: string;
  iconColor: string;
  iconSurfaceColor: string;
  label: string;
  title: string;
  withStripes?: boolean;
};

export const clawFeatureCards: ClawFeatureCard[] = [
  {
    description:
      "Knowhere parses the document, OpenClaw stores the returned package locally, and agents can reopen the exact manifest, hierarchy, chunks, and raw files later.",
    icon: "download",
    iconBorderColor: "#fee685",
    iconColor: "#e17100",
    iconSurfaceColor: "#fef3c6",
    label: "Result packages",
    title: "Store once. Reopen anytime.",
  },
  {
    description:
      "The plugin registers `knowhere_*` tools for preview, grep, raw-file reads, cleanup, and explicit ingest flows instead of forcing everything through one opaque call.",
    icon: "tools",
    iconBorderColor: "#bedbff",
    iconColor: "#155dfc",
    iconSurfaceColor: "#dbeafe",
    label: "Tool surface",
    title: "Browse before the answer.",
  },
  {
    description:
      "When `autoGrounding` is enabled, OpenClaw can auto-ingest attachments and inject compact document availability or status context right into the agent loop.",
    icon: "doc",
    iconBorderColor: "#f6cfff",
    iconColor: "#c800de",
    iconSurfaceColor: "#fae8ff",
    label: "Auto-grounding",
    title: "Context arrives when it matters.",
    withStripes: true,
  },
];

export type IntegrationResource = {
  description: string;
  linkLabel: string;
  title: string;
  variant: "package" | "skill";
};

export const integrationResources: IntegrationResource[] = [
  {
    description:
      "No config wall, no runtime internals, and no extra surface to learn. Install the package, attach the API key, then enable the plugin.",
    linkLabel: "@ontos-ai/knowhere-claw",
    title: "Package",
    variant: "package",
  },
  {
    description: "If you install from ClawHub, look for the skill named Knowhere.",
    linkLabel: "Knowhere",
    title: "ClawHub Skill",
    variant: "skill",
  },
];

export type CommandSegment = {
  className: string;
  text: string;
};

export type IntegrationStep = {
  command: string;
  description: string;
  note?: string;
  segments: CommandSegment[];
  step: string;
  title: string;
};

export const integrationSteps: IntegrationStep[] = [
  {
    command: "openclaw plugins install @ontos-ai/knowhere-claw",
    description: "Add the packaged runtime so OpenClaw can load the bundled knowhere skill.",
    segments: [
      { className: "text-[#00c951]", text: "$ " },
      { className: "text-[#00a6f4]", text: "openclaw plugins install " },
      { className: "text-[#00c951]", text: "@ontos-ai/knowhere-claw" },
    ],
    step: "STEP 1",
    title: "Install package",
  },
  {
    command: 'openclaw config set plugins .entries.knowhere.config.apiKey "sk_..."',
    description: "Connect this OpenClaw instance to your Knowhere account.",
    note: "Everything else can be pasted exactly as shown. The API key line is the only place where you replace a value.",
    segments: [
      { className: "text-[#00c951]", text: "$ " },
      { className: "text-[#00a6f4]", text: "openclaw " },
      { className: "text-[#fafafa]", text: "config set " },
      { className: "text-[#00a6f4]", text: "plugins" },
      { className: "text-[#fafafa]", text: " .entries." },
      { className: "text-[#00c951]", text: "knowhere" },
      { className: "text-[#fafafa]", text: ".config.apiKey " },
      { className: "text-[#ff6467]", text: '"sk_..."' },
    ],
    step: "STEP 2",
    title: "Attach API key",
  },
  {
    command: "openclaw plugins enable knowhere",
    description: "Turn the entry on so agents can load the plugin inside the runtime.",
    segments: [
      { className: "text-[#00c951]", text: "$ " },
      { className: "text-[#00a6f4]", text: "openclaw plugins enable " },
      { className: "text-[#00c951]", text: "knowhere" },
    ],
    step: "STEP 3",
    title: "Enable plugin",
  },
];

export type ChangeItem = {
  description: string;
  label: string;
  tagWidthClassName: string;
};

export const changeItems: ChangeItem[] = [
  {
    description: "Preview, grep, raw-file reads, ingest, and cleanup become callable in one place.",
    label: "knowhere_* tools",
    tagWidthClassName: "2xl:w-[215px]",
  },
  {
    description: "Agents can reopen manifest, hierarchy, chunks, and raw files before answering.",
    label: "Browse-first evidence",
    tagWidthClassName: "2xl:w-[267px]",
  },
  {
    description: "Result packages stay reusable across session, agent, or global scopes.",
    label: "Scoped local storage",
    tagWidthClassName: "2xl:w-[257px]",
  },
];
