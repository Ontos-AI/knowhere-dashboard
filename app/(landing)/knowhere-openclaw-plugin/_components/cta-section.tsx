import { PixelButton } from "@app/(landing)/_components/pixel/pixel-button";
import { PixelCard } from "@app/(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@app/(landing)/_components/pixel/pixel-heading";
import { ctaOutcomes } from "@app/(landing)/knowhere-openclaw-plugin/_components/plugin-content";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="border-y-2 border-pixel-border bg-pixel-bg py-16 md:py-24">
      <div className="container mx-auto px-4">
        <PixelCard
          accent
          className="overflow-hidden p-0"
          style={{ borderColor: "var(--pixel-accent-green)" }}
        >
          <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
            <div className="border-b-2 border-pixel-border p-6 sm:p-8 lg:border-b-0 lg:border-r-2 lg:p-10">
              <p className="mb-4 font-pixel text-[10px] uppercase tracking-[0.16em] text-pixel-green">
                Call to action
              </p>
              <PixelHeading as="h2" size="lg" className="mb-5 leading-relaxed">
                BRING KNOWHERE INTO <span className="text-pixel-green">OPENCLAW</span>
              </PixelHeading>
              <p className="mb-8 max-w-2xl text-sm leading-7 text-pixel-muted font-sans sm:text-base sm:leading-8 md:text-lg">
                Install the plugin, point it at your Knowhere API key, and give OpenClaw agents a
                browse-first document memory instead of a blind guess. Complex tables, scanned PDFs,
                and layout-heavy files become inspectable evidence inside the agent loop.
              </p>

              <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                <PixelButton variant="primary" className="w-full sm:w-auto" asChild>
                  <Link href="/login">Get API key</Link>
                </PixelButton>
              </div>

              <div className="flex flex-wrap gap-3">
                {["Result packages", "Auto-grounding", "Path-aware browse", "Agent citations"].map(
                  (item) => (
                    <span
                      key={item}
                      className="border-2 border-pixel-border bg-pixel-bg px-3 py-1 font-pixel text-[10px] uppercase tracking-[0.14em] text-pixel-muted"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="bg-[#111111] p-6 text-[#f6efe3] sm:p-8 lg:p-10">
              <div className="rounded-[14px] border border-white/10 bg-white/5 p-4 shadow-[6px_6px_0_rgba(0,0,0,0.35)]">
                <p className="mb-3 font-pixel text-[10px] uppercase tracking-[0.16em] text-[#7cd8a2]">
                  What unlocks in OpenClaw
                </p>
                <div className="space-y-3">
                  {ctaOutcomes.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[10px] border border-white/10 bg-black/20 px-4 py-3"
                    >
                      <p className="font-mono text-sm font-semibold text-[#f6efe3]">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[#d7d2c7] font-sans">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-[14px] border border-[#7cd8a2]/35 bg-[#162117] p-5 shadow-[6px_6px_0_rgba(0,0,0,0.35)]">
                <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-[#7cd8a2]">
                  Expected agent outcome
                </p>
                <p className="mt-3 text-lg leading-8 tracking-[-0.01em] text-[#f6efe3] font-sans">
                  "I found the supporting chunk, reopened the result file, and answered with the
                  exact evidence instead of improvising."
                </p>
              </div>
            </div>
          </div>
        </PixelCard>
      </div>
    </section>
  );
}
