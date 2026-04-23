import { PixelButton } from "@app/_(landing)/_components/pixel/pixel-button";
import { PixelCard } from "@app/_(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@app/_(landing)/_components/pixel/pixel-heading";
import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";
import Link from "next/link";

type PrimaryCapability = {
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  tags: readonly string[];
};

const primaryCapability: PrimaryCapability = {
  eyebrow: "Main shift",
  icon: Search,
  title: "Browse-first grounding",
  description: "Preview, reopen, and inspect the evidence surface before the agent answers.",
  tags: ["preview", "chunks", "raw files"],
};

const KNOWHERE_CLAW_PACKAGE_NAME = "@ontos-ai/knowhere-claw";
const KNOWHERE_CLAW_PACKAGE_URL = "https://www.npmjs.com/package/@ontos-ai/knowhere-claw";
const KNOWHERE_CLAWHUB_SKILL_NAME = "Knowhere";
const KNOWHERE_CLAWHUB_SKILL_URL = "https://clawhub.ai/ErickThoughts/clawhub-knowhere";

const installSteps = [
  `openclaw plugins install ${KNOWHERE_CLAW_PACKAGE_NAME}`,
  'openclaw config set plugins.entries.knowhere.config.apiKey "sk_..."',
  "openclaw plugins enable knowhere",
] as const;

export function OpenClawPluginSection() {
  return (
    <section className="relative overflow-hidden border-y-2 border-pixel-border bg-pixel-bg py-14 md:py-24">
      <div className="pointer-events-none absolute inset-0 pixel-grid-bg opacity-40" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <div className="max-w-2xl">
            <div className="mb-5 flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="border-2 border-pixel-fg bg-pixel-green px-2.5 py-1 font-pixel text-[9px] uppercase tracking-[0.16em] text-pixel-bg sm:px-3 sm:text-[10px] sm:tracking-[0.18em]">
                New
              </span>
              <span className="border-2 border-pixel-border bg-pixel-bg px-2.5 py-1 font-pixel text-[9px] uppercase tracking-[0.16em] text-pixel-muted sm:px-3 sm:text-[10px] sm:tracking-[0.18em]">
                Knowhere x OpenClaw
              </span>
            </div>

            <PixelHeading
              as="h2"
              size="lg"
              className="mb-5 max-w-3xl text-center leading-[1.2] sm:leading-relaxed lg:text-left"
            >
              <span className="block sm:inline">GROUND</span>{" "}
              <span className="inline-flex items-center gap-[0.18em] whitespace-nowrap">
                <span
                  role="img"
                  aria-label="Lobster"
                  className="mb-0.5 translate-y-[-0.04em] text-[1.5em] leading-none sm:mb-1 sm:text-[2em]"
                >
                  🦞
                </span>
                OPENCLAW
              </span>{" "}
              <span className="block sm:inline">
                WITH <span className="text-pixel-green">KNOWHERE</span>
              </span>
            </PixelHeading>

            <p className="mb-6 max-w-2xl font-sans text-sm leading-7 text-pixel-muted sm:text-base md:text-lg">
              We added a page for the{" "}
              <Link
                href={KNOWHERE_CLAW_PACKAGE_URL}
                target="_blank"
                rel="noreferrer"
                className="break-all font-mono underline decoration-current underline-offset-4 transition-colors hover:text-pixel-fg sm:break-normal"
              >
                {KNOWHERE_CLAW_PACKAGE_NAME}
              </Link>{" "}
              package: install it, ground OpenClaw, and inspect evidence before answering.
            </p>

            <p className="mb-6 max-w-2xl font-sans text-sm leading-7 text-pixel-muted md:text-base">
              Also live on ClawHub as{" "}
              <Link
                href={KNOWHERE_CLAWHUB_SKILL_URL}
                target="_blank"
                rel="noreferrer"
                className="font-mono underline decoration-current underline-offset-4 transition-colors hover:text-pixel-fg"
              >
                {KNOWHERE_CLAWHUB_SKILL_NAME}
              </Link>
              .
            </p>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
              <PixelButton variant="primary" asChild className="w-full sm:w-auto">
                <Link href="/claw">More details</Link>
              </PixelButton>
            </div>

            <PrimaryCapabilityCard capability={primaryCapability} />
          </div>

          <PixelCard accent className="overflow-hidden p-0">
            <div className="border-b-2 border-pixel-border bg-[#151515] px-4 py-3 sm:px-5">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border border-white/10 bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full border border-white/10 bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full border border-white/10 bg-[#28c840]" />
                </div>
                <Link
                  href={KNOWHERE_CLAW_PACKAGE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-pixel text-[10px] uppercase tracking-[0.14em] text-[#f6efe3] underline decoration-current underline-offset-4 transition-opacity hover:opacity-80 break-all sm:ml-3 sm:break-normal"
                >
                  {KNOWHERE_CLAW_PACKAGE_NAME}
                </Link>
              </div>
            </div>

            <div className="space-y-5 bg-[#111111] px-4 py-5 text-[#f6efe3] sm:px-5 sm:py-6">
              <div>
                <p className="mb-3 font-pixel text-[10px] uppercase tracking-[0.14em] text-[#f2a93b]">
                  Quick install
                </p>
                <div className="space-y-3">
                  {installSteps.map((command, index) => (
                    <div
                      key={command}
                      className="rounded-[8px] border border-white/10 bg-white/5 px-3 py-3 shadow-[4px_4px_0_rgba(0,0,0,0.35)] sm:px-4"
                    >
                      <p className="mb-2 font-pixel text-[10px] uppercase tracking-[0.14em] text-[#7cd8a2]">
                        Step {index + 1}
                      </p>
                      <code className="block max-w-full overflow-x-auto font-mono text-xs leading-6 sm:text-sm">
                        {command}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[8px] border border-[#7cd8a2]/40 bg-[#18241c] px-3 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.35)] sm:px-4">
                <p className="mb-2 font-pixel text-[10px] uppercase tracking-[0.14em] text-[#7cd8a2]">
                  Why it matters
                </p>
                <p className="text-sm leading-6 text-[#d7d2c7] font-sans">
                  OpenClaw keeps the agent loop. Knowhere adds high-fidelity parsing, chunk
                  structure, preview paths, and raw result files that agents can inspect when the
                  answer depends on tables, images, or layout-heavy PDFs.
                </p>
              </div>
            </div>
          </PixelCard>
        </div>
      </div>
    </section>
  );
}

function PrimaryCapabilityCard({ capability }: { capability: PrimaryCapability }) {
  const Icon = capability.icon;

  return (
    <PixelCard accent accentColor="green" className="overflow-hidden p-0">
      <div className="border-b-2 border-pixel-border bg-[#f4ecdd] px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-pixel-green">
            {capability.eyebrow}
          </p>
          <div className="flex h-10 w-10 items-center justify-center border-2 border-pixel-border bg-pixel-bg text-pixel-green">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <h3 className="max-w-xl font-sans text-[clamp(1.35rem,2.6vw,2rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-pixel-fg">
          {capability.title}
        </h3>
        <p className="mt-3 max-w-xl font-sans text-sm leading-7 text-pixel-muted sm:text-base sm:leading-8">
          {capability.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {capability.tags.map((tag) => (
            <span
              key={tag}
              className="border-2 border-pixel-border bg-[#f8f3ea] px-3 py-1 font-mono text-xs text-pixel-fg shadow-[3px_3px_0_var(--pixel-shadow)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-4 font-sans text-sm leading-7 text-pixel-muted">
          This is the behavior users feel first when the plugin is present.
        </p>
      </div>
    </PixelCard>
  );
}
