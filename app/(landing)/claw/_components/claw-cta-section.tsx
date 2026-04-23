import { changeItems } from "@app/(landing)/claw/_components/claw-content";
import {
  ClawActionButton,
  ClawStripedOverlay,
  KnowhereWordmark,
  OpenClawWordmark,
} from "@app/(landing)/claw/_components/claw-primitives";
import { cn } from "@lib/utils";

export const ClawCtaSection = () => {
  return (
    <section className="border border-[#e4e4e7] bg-[#fafafa] scroll-mt-20" id="docs">
      <div className="flex flex-col gap-8 pt-10 sm:gap-12 sm:pt-20">
        <div className="space-y-4 px-5 text-center sm:space-y-6 sm:px-16">
          <div className="space-y-2 sm:hidden">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
              <span className="font-mono-display text-[22px] font-bold leading-none text-[#09090b]">
                Bring
              </span>
              <KnowhereWordmark compact />
              <span className="font-mono-display text-[22px] font-bold leading-none text-[#09090b]">
                into
              </span>
            </div>
            <div className="flex items-center justify-center">
              <OpenClawWordmark compact textClassName="font-sans tracking-normal" />
            </div>
          </div>
          <div className="mx-auto hidden max-w-[700px] flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:flex xl:max-w-none xl:gap-x-8">
            <span className="font-mono-display text-[42px] font-bold leading-[42px] text-[#09090b] lg:text-5xl lg:leading-[48px]">
              Bring
            </span>
            <KnowhereWordmark />
            <span className="font-mono-display text-[42px] font-bold leading-[42px] text-[#09090b] lg:text-5xl lg:leading-[48px]">
              into
            </span>
            <OpenClawWordmark className="items-start" textClassName="font-sans tracking-normal" />
          </div>
          <p className="mx-auto max-w-[1120px] text-base leading-6 text-[#71717b] sm:text-2xl sm:leading-8">
            Install the plugin, point it at your API key, and give OpenClaw a browse-first way to
            inspect documents before an agent answers.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-[10px] px-5 sm:flex-row sm:flex-wrap sm:items-start sm:gap-3 sm:px-16">
          <ClawActionButton href="/login">Get API key</ClawActionButton>
          <ClawActionButton href="#integration" variant="secondary">
            Review install steps
          </ClawActionButton>
        </div>

        <p className="px-5 pb-[10px] text-center font-mono-display text-sm leading-[22px] text-[#27272a] sm:px-16 sm:pb-8 sm:text-lg sm:leading-[26px] lg:text-[20px] lg:leading-7">
          PDFs, scanned files, tables, manifests, chunks, and raw result files stay reopenable
          instead of disappearing into one generated reply.
        </p>

        <div className="border-t border-[#f4f4f5]">
          <div className="border-b border-[#ffe2e2] bg-[#fef2f2] px-5 py-[14px] text-center sm:px-16 sm:py-6">
            <h2 className="text-lg font-bold leading-7 text-[#e7000b] sm:text-2xl sm:leading-8 2xl:text-4xl">
              What changes inside OpenClaw
            </h2>
          </div>

          <div>
            {changeItems.map((item) => (
              <div
                className="relative flex flex-col items-start gap-4 border-b border-[#f4f4f5] px-5 py-6 sm:flex-row sm:items-center sm:gap-12 sm:px-16 sm:py-10 xl:gap-8 2xl:gap-12"
                key={item.label}
              >
                <ClawStripedOverlay tint="red" />
                <div
                  className={cn(
                    "relative flex h-12 shrink-0 items-center justify-center border-r border-t border-b border-l-4 border-[#e4e4e7] bg-[#f4f4f5] px-6 py-3 font-mono-display text-base font-bold leading-6 text-[#09090b]",
                    item.tagWidthClassName
                  )}
                >
                  {item.label}
                </div>
                <p className="relative flex-1 font-mono-display text-base leading-[22px] text-[#52525c] sm:text-sm lg:text-base lg:leading-6">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
