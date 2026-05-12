import { TokenSection } from "@app/design-system/_components/token-section";
import { Badge } from "@components/ui/badge";
import { Button, type ButtonProps, buttonVariants } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { ChatMessage } from "@components/ui/chat-message";
import { Chip } from "@components/ui/chip";
import { CodeBlock } from "@components/ui/code-block";
import { ComparisonPanel } from "@components/ui/comparison-panel";
import { FeatureBlock } from "@components/ui/feature-block";
import { HeaderButton } from "@components/ui/header-button";
import { IconButton } from "@components/ui/icon-button";
import {
  KNOWHERE_MESSAGE_ICON_NAMES,
  KNOWHERE_MODEL_ICON_NAMES,
  KNOWHERE_PIXEL_ICON_NAMES,
  KNOWHERE_REGULAR_ICON_NAMES,
  KNOWHERE_STATE_ICON_NAMES,
  KnowhereIcon,
} from "@components/ui/knowhere-icon";
import {
  CheckListItem,
  ContentListItem,
  DataListItem,
  QuestionListItem,
  SimpleListItem,
  StepListItem,
  TerminalListItem,
} from "@components/ui/list-item";
import { MessageButton } from "@components/ui/message-button";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Tag } from "@components/ui/tag";
import { ThemeSwitch } from "@components/ui/theme-switch";
import { Tip } from "@components/ui/tip";
import { TipsList } from "@components/ui/tips-list";
import { cn } from "@lib/utils";
import { Fragment } from "react";

const codeTabs = [
  {
    code: `# pip install knowhere-python-sdk
import knowhere

client = knowhere.Knowhere(api_key="sk_...")

result = client.parse(url="https://arxiv.org/pdf/1706.03762.pdf")
print(result.statistics.total_chunks)
print(result.full_markdown[:200])`,
    label: "Python",
    value: "python",
  },
  {
    code: `// npm install @ontos-ai/knowhere-sdk
import Knowhere from "@ontos-ai/knowhere-sdk";

const client = new Knowhere({ apiKey: "sk_..." });
const result = await client.parse({
  url: "https://arxiv.org/pdf/1706.03762.pdf",
});

console.log(result.textChunks.length);
console.log(result.textChunks[0]?.content);`,
    label: "Node.js",
    value: "node",
  },
  {
    code: `curl -X POST https://api.knowhereto.ai/v1/jobs \\
  --oauth2-bearer "$KNOWHERE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"source_type":"url"}'`,
    label: "CURL",
    value: "curl",
  },
] as const;

const tableTips = [
  "Boost Top-K by ~10%+ in production data when applying RAG pipelines to parsed data.",
  "Automatically recognize and construct hierarchical data structures such as multi-index headers.",
  "Accurately handle merged cells in both document files and tables.",
  "Naturally enables vectorless RAG and hybrid RAG.",
  "Save 50%+ tokens when developing graphs.",
] as const;

const iconRows = [
  { icons: KNOWHERE_REGULAR_ICON_NAMES, label: "regular" },
  { icons: KNOWHERE_PIXEL_ICON_NAMES, label: "pixel" },
  { icons: KNOWHERE_MODEL_ICON_NAMES, label: "model" },
  { icons: KNOWHERE_STATE_ICON_NAMES, label: "state" },
  { icons: KNOWHERE_MESSAGE_ICON_NAMES, label: "message" },
] as const;

const buttonStateMatrix = [
  { label: "enabled", state: "enabled" },
  { label: "hover", state: "hover" },
  { label: "active", state: "active" },
  { label: "disabled", state: "disabled" },
] as const;

const buttonPreviewConfigs = [
  { label: "Primary / large", size: "lg", variant: "default" },
  { label: "Primary / medium", size: "default", variant: "default" },
  { label: "Secondary / large", size: "lg", variant: "secondary" },
  { label: "Secondary / medium", size: "default", variant: "secondary" },
] as const satisfies Array<{
  label: string;
  size: NonNullable<ButtonProps["size"]>;
  variant: NonNullable<ButtonProps["variant"]>;
}>;

type ButtonPreviewConfig = (typeof buttonPreviewConfigs)[number];

const buttonStateClassMap: Record<
  (typeof buttonStateMatrix)[number]["state"],
  Record<(typeof buttonPreviewConfigs)[number]["variant"], string>
> = {
  enabled: {
    default: "",
    secondary: "",
  },
  hover: {
    default: "border-[#7008E7] border-b-[8px] bg-[#7F22FE]",
    secondary: "border-b-[8px] bg-stone-100",
  },
  active: {
    default: "border-[#7008E7] border-b-[6px] bg-[#7008E7] pb-0",
    secondary: "border-b-[6px] bg-stone-200 pb-0",
  },
  disabled: {
    default: "border-stone-200 bg-stone-300 text-stone-400",
    secondary: "border-stone-200 bg-stone-300 text-stone-400",
  },
};

const ButtonPreviewSwatch = ({
  size,
  state,
  variant,
}: {
  size: ButtonPreviewConfig["size"];
  state: (typeof buttonStateMatrix)[number]["state"];
  variant: ButtonPreviewConfig["variant"];
}) => {
  const isDisabled = state === "disabled";

  return (
    <div className="flex min-h-[92px] items-center justify-center rounded-2xl border border-border/70 bg-background/80 p-4">
      <button
        className={cn(
          buttonVariants({ size, variant }),
          buttonStateClassMap[state][variant],
          state === "disabled" ? "pointer-events-none" : undefined
        )}
        disabled={isDisabled}
        type="button"
      >
        Start Free Trial
      </button>
    </div>
  );
};

export const GenericComponentsShowcase = () => {
  return (
    <>
      <TokenSection
        eyebrow="Components"
        title="Buttons, tabs, tags, icons, and tip surfaces"
        description="These are the core reusable UI elements extracted from the new Figma component sheets. They live in `components/ui` and are the intended import surface for future pages."
      >
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Buttons, chips, and tags</CardTitle>
              <CardDescription>
                The copy, message, icon, and chip nodes are now separate primitives instead of
                squeezed into one generic button style.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.62fr)]">
                <div className="flex flex-wrap gap-3">
                  <Button size="lg">Start Free Trial</Button>
                  <Button size="lg" variant="secondary">
                    Talk to Sales
                  </Button>
                  <Button size="copy-cli" variant="copy-cli">
                    COPY
                  </Button>
                  <Button size="copy-code" variant="copy-code">
                    Copy
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
                    <p className="text-sm font-medium text-foreground">Compact actions</p>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <MessageButton>TEXT</MessageButton>
                      <IconButton />
                      <Chip value="text" variant="pop" />
                      <Chip value={1} variant="message" />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
                    <p className="text-sm font-medium text-foreground">Tooltip and theme</p>
                    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_168px] xl:grid-cols-1">
                      <Tip className="max-w-none justify-start text-left" align="start">
                        Boost Top-K by ~10%+ on production parsing pipelines.
                      </Tip>
                      <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                        <p className="text-sm text-muted-foreground">Theme switch</p>
                        <div className="mt-4 flex items-center gap-4">
                          <ThemeSwitch aria-label="Dark mode preview" />
                          <ThemeSwitch aria-label="Light mode preview" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">Button state matrix</p>
                  <Badge variant="outline">Figma 1:3788</Badge>
                </div>
                <div className="-mx-1 overflow-x-auto pb-2">
                  <div className="grid min-w-[1080px] grid-cols-[190px_repeat(4,minmax(192px,1fr))] gap-3 px-1">
                    <div />
                    {buttonStateMatrix.map((column) => (
                      <div
                        key={column.state}
                        className="rounded-xl bg-secondary/40 px-3 py-2 text-center"
                      >
                        <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                          {column.label}
                        </span>
                      </div>
                    ))}
                    {buttonPreviewConfigs.map((config) => (
                      <Fragment key={config.label}>
                        <div className="flex items-center rounded-xl bg-secondary/40 px-4 py-3">
                          <span className="text-sm font-medium text-foreground">
                            {config.label}
                          </span>
                        </div>
                        {buttonStateMatrix.map((column) => (
                          <ButtonPreviewSwatch
                            key={`${config.label}-${column.state}`}
                            size={config.size}
                            state={column.state}
                            variant={config.variant}
                          />
                        ))}
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
                <p className="text-sm font-medium text-foreground">Tag variants</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Tag value={1} variant="count" />
                  <Tag icon="download" variant="icon" />
                  <Tag variant="status" />
                  <Tag value=".pdf" variant="format" />
                  <Tag value="text" variant="text" />
                  <Tag value="STEP 1" variant="step" />
                  <Tag icon="mind" value="TEXT" variant="block" />
                  <Tag icon="download" variant="pixel-icon" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Icon set</CardTitle>
              <CardDescription>
                The Figma icon sheet now uses local SVG assets, grouped in the same rows as the
                design file.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {iconRows.map((row) => (
                <div key={row.label} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{row.label}</Badge>
                    <p className="text-xs text-muted-foreground">{row.icons.length} assets</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {row.icons.map((iconName) => (
                      <div
                        key={`${row.label}-${iconName}`}
                        className="flex items-center gap-3 rounded-xl border border-border/70 bg-secondary/30 p-3"
                      >
                        <div className="flex size-10 items-center justify-center rounded-lg bg-background shadow-2xs">
                          <KnowhereIcon className="size-5 text-foreground" name={iconName} />
                        </div>
                        <code className="text-xs text-muted-foreground">{iconName}</code>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Header buttons</CardTitle>
              <CardDescription>Text and icon variants from the header button node.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-end gap-4">
                <HeaderButton label="text" />
                <HeaderButton label="text" selected={true} />
                <HeaderButton variant="icon" />
                <HeaderButton selected={true} variant="icon" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code tabs</CardTitle>
              <CardDescription>For code samples and developer docs.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="python">
                <TabsList variant="code">
                  <TabsTrigger value="python" variant="code">
                    Python
                  </TabsTrigger>
                  <TabsTrigger value="node" variant="code">
                    Node.js
                  </TabsTrigger>
                  <TabsTrigger value="curl" variant="code">
                    CURL
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model tabs</CardTitle>
              <CardDescription>For emphasized model or mode selection.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="base">
                <TabsList variant="model">
                  <TabsTrigger value="base" variant="model">
                    Base
                  </TabsTrigger>
                  <TabsTrigger value="reasoning" variant="model">
                    Reasoning
                  </TabsTrigger>
                  <TabsTrigger value="vision" variant="model">
                    Vision
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </TokenSection>

      <TokenSection
        eyebrow="Conversation"
        title="Messages, code, and composable content rows"
        description="These components handle the more expressive parts of the product UI: assistant responses, command surfaces, onboarding steps, and structured explanation rows."
      >
        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Message patterns</CardTitle>
              <CardDescription>
                Shared chat surfaces for user prompts, assistant output, and attachment chips.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 bg-zinc-800 p-6">
              <ChatMessage messageRole="user" step={1}>
                Did Tesla&apos;s free cash flow go negative in any quarter? Show the supporting
                chunk.
              </ChatMessage>
              <ChatMessage
                attachments={[
                  { icon: "draft", label: "manifest.json" },
                  { icon: "draft", label: "chunks.json" },
                  { icon: "draft", label: "page-33 / table-14" },
                ]}
                emphasis="−$2,535M"
                messageRole="assistant"
              >
                Yes. Q1 2024 is the only negative quarter. Operating cash fell to $242M while CapEx
                stayed at $2,777M.
              </ChatMessage>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code and feature blocks</CardTitle>
              <CardDescription>
                The Figma block sheet maps cleanly to reusable code and information containers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock tabs={[...codeTabs]} />
              <FeatureBlock
                description="Sign up and generate your secure API key from the dashboard."
                icon="download"
                title="GET YOUR API KEY"
                tone="rose"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>List item variants</CardTitle>
              <CardDescription>
                Step rows, checklist rows, highlighted data rows, Q&A items, and shell commands are
                split into focused components instead of one overloaded catch-all.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <StepListItem
                description="Upload document (PDF, DOCX, XLSX, etc.)"
                step={1}
                title="Input"
              />
              <CheckListItem text="Open-source and community-driven development" />
              <DataListItem description="Nested table detection" label="Better" />
              <ContentListItem
                description="Automatically separate tables in one sheet based on boundary detection."
                step={2}
                title="Boundary-aware parsing"
              />
              <QuestionListItem
                answer="Use semantic extraction plus structure-aware chunking to retain provenance."
                question="How do we preserve section hierarchy for downstream RAG?"
              />
              <TerminalListItem command="openclaw plugins install @ontos-ai/knowhere-claw" />
              <SimpleListItem
                description="Save 50%+ tokens when developing graphs."
                tagLabel="Graph"
              />
            </CardContent>
          </Card>
        </div>
      </TokenSection>

      <TokenSection
        eyebrow="Sections"
        title="Comparison panels and long-form tips"
        description="A few nodes from the Figma library are really reusable section-level components. They are still shared, but they belong above the atomic primitive layer."
      >
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitive comparison</CardTitle>
              <CardDescription>
                This panel stays generic through props, so future landing and comparison pages can
                reuse it without duplicating layout code.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ComparisonPanel
                competitorDescription="Unstructured is functional for simple documents, but it struggles with complex table structures and loses semantic detail during parsing."
                competitorName="Unstructured"
                heading="Why Knowhere delivers superior document parsing for complex tables"
                highlights={[
                  "Open-source and community-driven development",
                  "Basic text extraction for simple documents",
                  "Supports multiple common file formats",
                ]}
                metricLabel="Nested Table Detection"
                metricValue="Better"
              />
              <ComparisonPanel
                competitorDescription="Markitdown focuses on Markdown conversion with a lightweight workflow, but it lacks robust handling for complex nested content."
                competitorName="Markitdown"
                heading="Why Knowhere is the superior choice for markdown conversion"
                highlights={[
                  "Simple Markdown conversion workflow",
                  "Lightweight and easy to integrate",
                  "Good for basic text documents",
                ]}
                metricLabel="Structure Preservation"
                metricValue="Deeper"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips content</CardTitle>
              <CardDescription>
                The text-only “table tips” node is exposed as a simple shared list component.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
              <div className="rounded-2xl border border-border/70 bg-secondary/30 p-6">
                <Badge variant="outline">components/ui/tips-list</Badge>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Use this for compact benefit stacks, parsing promises, and long-form helper copy.
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background p-6">
                <TipsList items={[...tableTips]} />
              </div>
            </CardContent>
          </Card>
        </div>
      </TokenSection>
    </>
  );
};
