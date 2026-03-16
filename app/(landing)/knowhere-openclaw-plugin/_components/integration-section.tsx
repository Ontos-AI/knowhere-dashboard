import { PixelCard } from "@app/(landing)/_components/pixel/pixel-card";
import { CopyableCommandCard } from "@app/(landing)/knowhere-openclaw-plugin/_components/copyable-command-card";
import { installCards } from "@app/(landing)/knowhere-openclaw-plugin/_components/plugin-content";
import { SectionIntro } from "@app/(landing)/knowhere-openclaw-plugin/_components/section-intro";
import { ArrowRight, Package2, TerminalSquare } from "lucide-react";

export function IntegrationSection() {
  return (
    <section id="integration" className="relative overflow-hidden bg-pixel-bg py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 pixel-grid-bg opacity-20" />
      <div
        className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-44 w-[min(920px,92vw)] rounded-full blur-3xl"
        style={{ background: "rgba(34, 197, 94, 0.08)" }}
      />

      <div className="container relative z-10 mx-auto px-4">
        <SectionIntro
          eyebrow="Integration Guide"
          title={
            <>
              Install it in OpenClaw
              <br />
              in three commands.
            </>
          }
          description="This part should feel operational, not explanatory. Copy the commands in order, replace the API key once, and the plugin is ready inside OpenClaw."
        />

        <div className="mt-10 grid gap-6 xl:grid-cols-[0.84fr_1.16fr]">
          <PixelCard accent className="h-full overflow-hidden p-0">
            <div className="border-b-2 border-pixel-border bg-[#f4ecdd] px-5 py-4 sm:px-6">
              <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-pixel-green">
                Operator framing
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <div className="rounded-[14px] border-2 border-pixel-border bg-white px-4 py-4 shadow-[4px_4px_0_var(--pixel-shadow)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border-2 border-pixel-border bg-pixel-bg">
                    <Package2 className="h-5 w-5 text-pixel-green" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-pixel-red">
                      npm package
                    </p>
                    <p className="mt-1 truncate font-mono text-sm text-pixel-fg sm:text-base">
                      @ontos/knowhere-claw
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="mt-6 font-sans text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-pixel-fg">
                Three commands.
                <br />
                One loaded plugin.
              </h3>

              <p className="mt-4 max-w-[34rem] font-sans text-sm leading-7 text-pixel-muted sm:text-base sm:leading-8">
                No config wall, no runtime internals. Install the package, attach the API key, and
                enable the entry. That is the setup path this page needs to teach.
              </p>

              <div className="mt-6 space-y-3">
                {installCards.map((card, index) => (
                  <div
                    key={card.title}
                    className="flex items-start gap-3 rounded-[14px] border-2 border-pixel-border bg-[#f8f3ea] px-4 py-4 shadow-[4px_4px_0_var(--pixel-shadow)]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-pixel-fg bg-pixel-bg font-pixel text-[10px] tracking-[0.16em] text-pixel-fg">
                      {card.step}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm font-semibold uppercase text-pixel-fg">
                        {card.title}
                      </p>
                      <p className="mt-1 font-sans text-sm leading-7 text-pixel-muted">
                        {card.description}
                      </p>
                    </div>

                    {index < installCards.length - 1 ? (
                      <ArrowRight className="mt-1 hidden h-4 w-4 shrink-0 text-pixel-muted lg:block" />
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[14px] border-2 border-dashed border-pixel-border bg-[#f3eee5] px-4 py-4">
                <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-pixel-red">
                  Only edit one line
                </p>
                <p className="mt-2 font-sans text-sm leading-7 text-pixel-muted">
                  The second command is the only place you replace a value. Everything else can be
                  copied exactly as shown.
                </p>
              </div>
            </div>
          </PixelCard>

          <div className="overflow-hidden rounded-[20px] border-4 border-pixel-border bg-[#111111] shadow-[10px_10px_0_rgba(58,58,58,0.65)]">
            <div className="flex flex-wrap items-center gap-2 border-b-2 border-pixel-border bg-[#161616] px-4 py-3">
              <span className="h-3 w-3 rounded-full border border-black/10 bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full border border-black/10 bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full border border-black/10 bg-[#28c840]" />
              <div className="ml-2 flex items-center gap-2">
                <TerminalSquare className="h-4 w-4 text-[#7cd8a2]" />
                <span className="font-pixel text-[10px] uppercase tracking-[0.14em] text-[#7cd8a2]">
                  OpenClaw shell
                </span>
              </div>
              <span className="border border-white/10 bg-white/5 px-2 py-1 font-mono text-[11px] text-[#b8b1a3]">
                runtime setup
              </span>
            </div>

            <div className="bg-[radial-gradient(circle_at_top,rgba(124,216,162,0.11),transparent_34%),linear-gradient(180deg,#121212_0%,#0e0e0e_100%)] p-4 sm:p-5 md:p-6">
              <div className="space-y-4">
                {installCards.map((card) => (
                  <CopyableCommandCard
                    key={card.title}
                    step={card.step}
                    title={card.title}
                    description={card.description}
                    command={card.command}
                  />
                ))}
              </div>

              <div className="mt-5 rounded-[14px] border border-[#7cd8a2]/18 bg-[#152016] px-4 py-4 shadow-[6px_6px_0_rgba(0,0,0,0.24)]">
                <p className="font-pixel text-[10px] uppercase tracking-[0.14em] text-[#7cd8a2]">
                  Run order
                </p>
                <p className="mt-2 font-sans text-sm leading-7 text-[#d7d2c7]">
                  Execute them from top to bottom. Once step 03 is done, the plugin is available in
                  OpenClaw and the bundled knowhere skill can load with it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
