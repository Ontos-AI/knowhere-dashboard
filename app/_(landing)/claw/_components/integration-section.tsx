import Link from "next/link";
import { OpenClawShellDemo } from "@/app/_(landing)/claw/_components/openclaw-shell-demo";
import {
  installCards,
  KNOWHERE_CLAW_PACKAGE_NAME,
  KNOWHERE_CLAW_PACKAGE_URL,
  KNOWHERE_CLAWHUB_SKILL_NAME,
  KNOWHERE_CLAWHUB_SKILL_URL,
} from "@/app/_(landing)/claw/_components/plugin-content";
import { SectionIntro } from "@/app/_(landing)/claw/_components/section-intro";

export function IntegrationSection() {
  return (
    <section id="integration" className="bg-pixel-bg py-14 md:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Integration Guide"
          title={
            <>
              Install it in OpenClaw
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              in three commands.
            </>
          }
          description="Follow the same rhythm as a developer-tool homepage: read the steps once, copy the commands in order, and replace the API key only in step 02."
        />

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12">
          <div className="order-2 max-w-xl lg:order-1">
            <div className="border-t border-pixel-border pt-5 sm:pt-6">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-pixel-green">
                Package
              </p>
              <p className="mt-3 font-mono text-sm text-pixel-fg sm:text-base">
                <Link
                  href={KNOWHERE_CLAW_PACKAGE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all underline decoration-current underline-offset-4 transition-colors hover:text-pixel-green sm:break-normal"
                >
                  {KNOWHERE_CLAW_PACKAGE_NAME}
                </Link>
              </p>
              <p className="mt-4 font-sans text-sm leading-7 text-pixel-muted sm:text-base sm:leading-8">
                No config wall, no runtime internals, and no extra surface to learn. Install the
                package, attach the API key, then enable the plugin.
              </p>

              <p className="mt-6 font-mono text-xs uppercase tracking-[0.24em] text-pixel-green">
                ClawHub Skill
              </p>
              <p className="mt-3 font-mono text-sm text-pixel-fg sm:text-base">
                <Link
                  href={KNOWHERE_CLAWHUB_SKILL_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-current underline-offset-4 transition-colors hover:text-pixel-green"
                >
                  {KNOWHERE_CLAWHUB_SKILL_NAME}
                </Link>
              </p>
              <p className="mt-2 font-sans text-sm leading-7 text-pixel-muted sm:text-base sm:leading-8">
                If you install from ClawHub, look for the skill named Knowhere.
              </p>
            </div>

            <ol className="mt-8 divide-y divide-pixel-border">
              {installCards.map((card) => (
                <li key={card.title} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex gap-3 sm:gap-4">
                    <span className="w-7 shrink-0 pt-1 font-mono text-xs text-pixel-green sm:w-8 sm:text-sm">
                      {card.step}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-sans text-lg font-semibold leading-tight tracking-[-0.02em] text-pixel-fg sm:text-xl">
                        {card.title}
                      </h3>
                      <p className="mt-2 font-sans text-sm leading-7 text-pixel-muted sm:text-base sm:leading-8">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="order-1 space-y-5 sm:space-y-6 lg:order-2">
            <OpenClawShellDemo cards={installCards} />

            <div className="border-t border-dashed border-pixel-border pt-5">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-pixel-red">
                Only edit step 02
              </p>
              <p className="mt-3 font-sans text-sm leading-7 text-pixel-muted sm:text-base sm:leading-8">
                Everything else can be pasted exactly as shown. The API key line is the only place
                where you replace a value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
