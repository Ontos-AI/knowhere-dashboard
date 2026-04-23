import Link from "next/link";
import { ctaOutcomes } from "@/app/_(landing)/claw/_components/plugin-content";

export function CTASection() {
  return (
    <section className="border-t border-pixel-border bg-[linear-gradient(180deg,#fafafa_0%,#f4efe6_100%)] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-pixel-green">
              Call to action
            </p>
            <h2 className="mt-4 font-sans text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-pixel-fg">
              Bring Knowhere into OpenClaw.
            </h2>
            <p className="mt-5 max-w-2xl font-sans text-base leading-8 text-pixel-muted md:text-lg">
              Install the plugin, point it at your API key, and give OpenClaw a browse-first way to
              inspect documents before an agent answers.
            </p>
            <p className="mt-4 max-w-2xl font-mono text-sm leading-7 text-pixel-muted">
              PDFs, scanned files, tables, manifests, chunks, and raw result files stay reopenable
              instead of disappearing into one generated reply.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/login"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-pixel-fg px-5 py-3 font-mono text-sm text-pixel-bg transition-colors hover:bg-pixel-green"
              >
                Get API key
              </Link>
              <Link
                href="#integration"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-pixel-border px-5 py-3 font-mono text-sm text-pixel-fg transition-colors hover:border-pixel-fg"
              >
                Review install steps
              </Link>
            </div>
          </div>

          <div className="border-t border-pixel-border pt-6">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-pixel-green">
              What changes inside OpenClaw
            </p>

            <div className="mt-5 space-y-5">
              {ctaOutcomes.map((item) => (
                <div
                  key={item.title}
                  className="border-b border-pixel-border pb-5 last:border-b-0 last:pb-0"
                >
                  <h3 className="font-mono text-sm font-semibold text-pixel-fg">{item.title}</h3>
                  <p className="mt-2 font-sans text-sm leading-7 text-pixel-muted sm:text-base sm:leading-8">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <blockquote className="mt-8 border-l-2 border-pixel-green pl-4 font-sans text-lg leading-8 tracking-[-0.02em] text-pixel-fg md:text-xl">
              "I found the supporting chunk, reopened the result file, and answered with the exact
              evidence instead of improvising."
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
