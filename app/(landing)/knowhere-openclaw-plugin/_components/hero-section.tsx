import { PixelButton } from "@app/(landing)/_components/pixel/pixel-button";
import { PixelCard } from "@app/(landing)/_components/pixel/pixel-card";
import {
  contextTraits,
  heroCards,
  inputFormats,
} from "@app/(landing)/knowhere-openclaw-plugin/_components/plugin-content";
import Link from "next/link";

export function HeroSection() {
  return (
    <section
      id="plugin-overview"
      className="relative overflow-hidden bg-pixel-bg pb-20 pt-32 md:pb-24 md:pt-40"
    >
      <div className="pointer-events-none absolute inset-0 pixel-grid-bg opacity-30" />
      <div
        className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-48 w-[min(880px,94vw)] rounded-full blur-3xl"
        style={{ background: "rgba(234, 179, 8, 0.12)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-40 mx-auto h-56 w-[min(740px,88vw)] rounded-full blur-3xl"
        style={{ background: "rgba(34, 197, 94, 0.1)" }}
      />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            <span className="border-2 border-pixel-fg bg-pixel-green px-3 py-1 font-pixel text-[10px] uppercase tracking-[0.18em] text-pixel-bg">
              Knowhere API
            </span>
            <span className="border-2 border-pixel-fg bg-pixel-bg px-3 py-1 font-pixel text-[10px] uppercase tracking-[0.18em] text-pixel-fg">
              OpenClaw Plugin
            </span>
            <span className="border-2 border-pixel-border bg-pixel-bg px-3 py-1 font-mono text-xs text-pixel-muted">
              @ontos/knowhere-claw
            </span>
          </div>

          <h1 className="text-[clamp(3.2rem,9vw,7rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-pixel-fg font-sans">
            Your docs
          </h1>

          <div className="my-6 flex flex-wrap items-center justify-center gap-3">
            {inputFormats.map((format) => (
              <span
                key={format}
                className="rounded-[10px] border-2 border-pixel-border bg-white px-4 py-2 font-mono text-sm font-medium text-pixel-fg shadow-[4px_4px_0_var(--pixel-shadow)]"
              >
                {format}
              </span>
            ))}
          </div>

          <h2 className="mx-auto max-w-5xl text-[clamp(2.8rem,8vw,6.4rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-pixel-fg font-sans">
            become <span className="text-pixel-red">OpenClaw-native</span>
            <br />
            <span className="text-pixel-green">context</span> with grounded retrieval
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-pixel-muted font-sans md:text-lg">
            The plugin uses Knowhere for parsing and job orchestration, stores the returned result
            package inside OpenClaw-managed local storage, and gives agents a browse-first path to
            previews, chunks, hierarchy, and raw files before they answer.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <PixelButton variant="primary" asChild>
              <Link href="#integration">See integration guide</Link>
            </PixelButton>
            <PixelButton variant="secondary" asChild>
              <Link href="/login">Get API key</Link>
            </PixelButton>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {contextTraits.map((trait) => (
              <span
                key={trait}
                className="border-2 border-pixel-border bg-pixel-bg px-3 py-1 font-pixel text-[10px] uppercase tracking-[0.14em] text-pixel-muted"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {heroCards.map((card, index) => (
            <PixelCard
              key={card.title}
              className="h-full p-0"
              style={
                index === 2
                  ? { borderColor: "var(--pixel-accent-green)" }
                  : { borderColor: "var(--pixel-border)" }
              }
            >
              <div className="p-6">
                <p className="mb-3 font-pixel text-[10px] uppercase tracking-[0.16em] text-pixel-green">
                  {card.eyebrow}
                </p>
                <h3 className="mb-4 text-2xl font-semibold leading-tight tracking-[-0.02em] text-pixel-fg font-sans">
                  {card.title}
                </h3>
                <p className="text-sm leading-7 text-pixel-muted font-sans">{card.description}</p>
              </div>
            </PixelCard>
          ))}
        </div>
      </div>
    </section>
  );
}
