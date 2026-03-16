import { OpenClawShellDemo } from "@/app/(landing)/claw/_components/openclaw-shell-demo";
import { installCards } from "@/app/(landing)/claw/_components/plugin-content";
import { SectionIntro } from "@/app/(landing)/claw/_components/section-intro";

export function IntegrationSection() {
  return (
    <section id="integration" className="bg-pixel-bg py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Integration Guide"
          title={
            <>
              Install it in OpenClaw
              <br />
              in three commands.
            </>
          }
          description="Follow the same rhythm as a developer-tool homepage: read the steps once, copy the commands in order, and replace the API key only in step 02."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="max-w-xl">
            <div className="border-t border-pixel-border pt-6">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-pixel-green">
                Package
              </p>
              <p className="mt-3 font-mono text-sm text-pixel-fg sm:text-base">
                @ontos/knowhere-claw
              </p>
              <p className="mt-4 font-sans text-sm leading-7 text-pixel-muted sm:text-base sm:leading-8">
                No config wall, no runtime internals, and no extra surface to learn. Install the
                package, attach the API key, then enable the plugin.
              </p>
            </div>

            <ol className="mt-8 divide-y divide-pixel-border">
              {installCards.map((card) => (
                <li key={card.title} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex gap-4">
                    <span className="w-8 shrink-0 pt-1 font-mono text-sm text-pixel-green">
                      {card.step}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-sans text-xl font-semibold leading-tight tracking-[-0.02em] text-pixel-fg">
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

          <div className="space-y-6">
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
