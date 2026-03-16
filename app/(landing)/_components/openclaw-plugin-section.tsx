import { PixelButton } from "@app/(landing)/_components/pixel/pixel-button";
import { PixelCard } from "@app/(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@app/(landing)/_components/pixel/pixel-heading";
import Link from "next/link";

const capabilities = [
  {
    title: "Browse-first grounding",
    description:
      "Let OpenClaw reopen previews, chunks, raw files, and hierarchy before it answers.",
  },
  {
    title: "Local result packages",
    description:
      "Store extracted Knowhere outputs inside OpenClaw-managed storage with scope-aware reuse.",
  },
  {
    title: "Agent-ready tools",
    description:
      "Register `knowhere_*` tools for ingest, grep, preview, raw-file reads, and cleanup flows.",
  },
] as const;

const installSteps = [
  "openclaw plugins install @ontos/knowhere-claw",
  'openclaw config set plugins.entries.knowhere.config.apiKey "sk_..."',
  "openclaw plugins enable knowhere",
] as const;

export function OpenClawPluginSection() {
  return (
    <section className="relative overflow-hidden border-y-2 border-pixel-border bg-pixel-bg py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 pixel-grid-bg opacity-40" />
      <div
        className="pointer-events-none absolute inset-x-0 top-12 mx-auto h-40 w-[min(720px,92vw)] rounded-full blur-3xl"
        style={{ background: "rgba(34, 197, 94, 0.12)" }}
      />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="border-2 border-pixel-fg bg-pixel-green px-3 py-1 font-pixel text-[10px] uppercase tracking-[0.18em] text-pixel-bg">
                New
              </span>
              <span className="border-2 border-pixel-border bg-pixel-bg px-3 py-1 font-pixel text-[10px] uppercase tracking-[0.18em] text-pixel-muted">
                Knowhere x OpenClaw
              </span>
            </div>

            <PixelHeading as="h2" size="lg" className="mb-5 max-w-3xl leading-relaxed">
              GROUND OPENCLAW WITH <span className="text-pixel-green">KNOWHERE</span>
            </PixelHeading>

            <p className="mb-6 max-w-2xl text-base leading-7 text-pixel-muted font-sans md:text-lg">
              We added a dedicated page for the{" "}
              <span className="font-mono">@ontos/knowhere-claw</span> package. It shows how Knowhere
              result packages become browse-first context inside OpenClaw, how to install the
              plugin, and how agents can answer with grounded citations instead of guesswork.
            </p>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
              <PixelButton variant="primary" asChild>
                <Link href="/knowhere-openclaw-plugin">More details</Link>
              </PixelButton>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {capabilities.map((capability) => (
                <PixelCard key={capability.title} className="h-full p-0">
                  <div className="p-5">
                    <p className="mb-2 font-pixel text-[10px] uppercase tracking-[0.14em] text-pixel-green">
                      Plugin
                    </p>
                    <h3 className="mb-3 font-mono text-lg font-semibold text-pixel-fg">
                      {capability.title}
                    </h3>
                    <p className="text-sm leading-6 text-pixel-muted font-sans">
                      {capability.description}
                    </p>
                  </div>
                </PixelCard>
              ))}
            </div>
          </div>

          <PixelCard accent className="overflow-hidden p-0">
            <div className="border-b-2 border-pixel-border bg-[#151515] px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border border-white/10 bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full border border-white/10 bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full border border-white/10 bg-[#28c840]" />
                <span className="ml-3 font-pixel text-[10px] uppercase tracking-[0.14em] text-[#f6efe3]">
                  @ontos/knowhere-claw
                </span>
              </div>
            </div>

            <div className="space-y-5 bg-[#111111] px-5 py-6 text-[#f6efe3]">
              <div>
                <p className="mb-3 font-pixel text-[10px] uppercase tracking-[0.14em] text-[#f2a93b]">
                  Quick install
                </p>
                <div className="space-y-3">
                  {installSteps.map((command, index) => (
                    <div
                      key={command}
                      className="rounded-[8px] border border-white/10 bg-white/5 px-4 py-3 shadow-[4px_4px_0_rgba(0,0,0,0.35)]"
                    >
                      <p className="mb-2 font-pixel text-[10px] uppercase tracking-[0.14em] text-[#7cd8a2]">
                        Step {index + 1}
                      </p>
                      <code className="block overflow-x-auto font-mono text-sm leading-6">
                        {command}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[8px] border border-[#7cd8a2]/40 bg-[#18241c] px-4 py-4 shadow-[4px_4px_0_rgba(0,0,0,0.35)]">
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
