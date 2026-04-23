import { PixelButton } from "@app/_(landing)/_components/pixel/pixel-button";
import { PixelCard } from "@app/_(landing)/_components/pixel/pixel-card";
import Link from "next/link";
import {
  contextTraits,
  heroCards,
  inputFormats,
  KNOWHERE_CLAW_PACKAGE_NAME,
  KNOWHERE_CLAW_PACKAGE_URL,
  KNOWHERE_CLAWHUB_SKILL_NAME,
  KNOWHERE_CLAWHUB_SKILL_URL,
} from "@/app/_(landing)/claw/_components/plugin-content";

export function HeroSection() {
  return (
    <section
      id="plugin-overview"
      className="relative overflow-hidden bg-pixel-bg pb-16 pt-28 sm:pb-20 sm:pt-32 md:pb-24 md:pt-40"
    >
      <div className="pointer-events-none absolute inset-0 pixel-grid-bg opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-48 w-[min(880px,94vw)] rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2.5 sm:mb-8 sm:gap-3">
            <span className="border-2 border-pixel-fg bg-pixel-green px-3 py-1 font-pixel text-[10px] uppercase tracking-[0.18em] text-pixel-bg">
              Knowhere API
            </span>
            <span className="border-2 border-pixel-fg bg-pixel-bg px-3 py-1 font-pixel text-[10px] uppercase tracking-[0.18em] text-pixel-fg">
              OpenClaw Plugin
            </span>
            <Link
              href={KNOWHERE_CLAW_PACKAGE_URL}
              target="_blank"
              rel="noreferrer"
              className="border-2 border-pixel-border bg-pixel-bg px-3 py-1 font-mono text-xs text-pixel-muted underline decoration-current underline-offset-4 transition-colors hover:text-pixel-fg"
            >
              {KNOWHERE_CLAW_PACKAGE_NAME}
            </Link>
            <Link
              href={KNOWHERE_CLAWHUB_SKILL_URL}
              target="_blank"
              rel="noreferrer"
              className="border-2 border-pixel-border bg-[#f8f3ea] px-3 py-1 font-mono text-xs text-pixel-fg underline decoration-current underline-offset-4 transition-colors hover:text-pixel-green"
            >
              ClawHub: {KNOWHERE_CLAWHUB_SKILL_NAME}
            </Link>
          </div>

          <h1 className="text-[clamp(2.4rem,13vw,7rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-pixel-fg font-sans sm:leading-[0.95] sm:tracking-[-0.04em]">
            Your docs
          </h1>

          <div className="my-5 flex flex-wrap items-center justify-center gap-2.5 sm:my-6 sm:gap-3">
            {inputFormats.map((format) => (
              <span
                key={format}
                className="rounded-[10px] border-2 border-pixel-border bg-white px-3 py-2 font-mono text-xs font-medium text-pixel-fg shadow-[3px_3px_0_var(--pixel-shadow)] sm:px-4 sm:text-sm sm:shadow-[4px_4px_0_var(--pixel-shadow)]"
              >
                {format}
              </span>
            ))}
          </div>

          <h2 className="mx-auto max-w-5xl text-[clamp(2rem,11vw,6.4rem)] font-semibold leading-[1] tracking-[-0.03em] text-pixel-fg font-sans sm:leading-[0.96] sm:tracking-[-0.04em]">
            become <span className="text-pixel-red">OpenClaw-native</span>
            <br />
            <span className="text-pixel-green">context</span> with grounded retrieval
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-pixel-muted font-sans sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
            The plugin uses Knowhere for parsing and job orchestration, stores the returned result
            package inside OpenClaw-managed local storage, and gives agents a browse-first path to
            previews, chunks, hierarchy, and raw files before they answer.
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <PixelButton variant="primary" className="w-full sm:w-auto" asChild>
              <Link href="#integration">See integration guide</Link>
            </PixelButton>
            <PixelButton variant="secondary" className="w-full sm:w-auto" asChild>
              <Link href="/login">Get API key</Link>
            </PixelButton>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
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

        <div className="mt-10 grid gap-4 sm:mt-12 lg:mt-14 lg:grid-cols-3">
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
              <div className="p-5 sm:p-6">
                <p className="mb-3 font-pixel text-[10px] uppercase tracking-[0.16em] text-pixel-green">
                  {card.eyebrow}
                </p>
                <h3 className="mb-4 text-xl font-semibold leading-tight tracking-[-0.02em] text-pixel-fg font-sans sm:text-2xl">
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
