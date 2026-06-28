import { ClawActionButton } from "@app/(landing)/claw/_components/claw-action-button";
import { changeItems } from "@app/(landing)/claw/_components/claw-content";
import {
  ClawStripedOverlay,
  KnowhereWordmark,
  OpenClawWordmark,
} from "@app/(landing)/claw/_components/claw-primitives";
import { cn } from "@lib/utils";
import Image from "next/image";

export const ClawCtaSection = () => {
  return (
    <section className="bg-white scroll-mt-20 shadow-[inset_0_0_0_1px_#e4e4e7]" id="docs">
      <div className="flex flex-col gap-8 pt-10 min-[640px]:gap-12 min-[640px]:pt-20 min-[640px]:max-[767px]:gap-9 min-[640px]:max-[767px]:pt-20 min-[768px]:max-[768px]:gap-9 min-[768px]:max-[768px]:pt-20 min-[769px]:gap-9 min-[769px]:pt-20">
        <div className="space-y-4 px-5 text-center min-[640px]:space-y-6 min-[640px]:px-16 min-[640px]:max-[767px]:space-y-4 min-[640px]:max-[767px]:px-12 min-[768px]:max-[768px]:space-y-4 min-[768px]:max-[768px]:px-12 min-[769px]:space-y-4 min-[769px]:px-12">
          <div className="space-y-2 min-[640px]:hidden">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
              <span className="font-sans text-[22px] font-bold leading-none text-[#09090b]">
                Bring
              </span>
              <KnowhereWordmark compact />
              <span className="font-sans text-[22px] font-bold leading-none text-[#09090b]">
                into
              </span>
            </div>
            <div className="flex items-center justify-center">
              <OpenClawWordmark compact textClassName="font-sans tracking-normal" />
            </div>
          </div>
          <div className="mx-auto hidden max-w-[700px] flex-wrap items-center justify-center gap-x-6 gap-y-4 min-[640px]:flex min-[640px]:max-[767px]:max-w-[544px] min-[640px]:max-[767px]:gap-x-8 min-[640px]:max-[767px]:gap-y-4 min-[768px]:max-[768px]:max-w-[560px] min-[768px]:max-[768px]:gap-x-4 min-[768px]:max-[768px]:gap-y-[18px] min-[769px]:max-w-none min-[769px]:gap-x-8">
            <span className="font-mono-readable text-[42px] font-bold leading-[42px] text-[#09090b] min-[640px]:max-[767px]:text-[32px] min-[640px]:max-[767px]:leading-[42px] min-[768px]:max-[768px]:text-[36px] min-[768px]:max-[768px]:leading-10 min-[769px]:text-[36px] min-[769px]:leading-[48px]">
              Bring
            </span>
            <span className="inline-flex w-[200px] items-center">
              <Image
                alt="Knowhere"
                className="h-auto w-full object-contain"
                height={84}
                src="/images/knowhere/logo.png"
                width={360}
              />
            </span>
            <span className="font-mono-readable text-[42px] font-bold leading-[42px] text-[#09090b] min-[640px]:max-[767px]:text-[32px] min-[640px]:max-[767px]:leading-[42px] min-[768px]:max-[768px]:text-[36px] min-[768px]:max-[768px]:leading-10 min-[769px]:text-[36px] min-[769px]:leading-[48px]">
              into
            </span>
            <OpenClawWordmark
              className="items-start min-[640px]:max-[767px]:basis-full min-[640px]:max-[767px]:justify-center min-[768px]:max-[768px]:basis-full min-[768px]:max-[768px]:justify-center"
              textClassName="font-sans tracking-normal min-[640px]:max-[767px]:text-[36px] min-[640px]:max-[767px]:leading-10 min-[768px]:max-[768px]:text-[36px] min-[768px]:max-[768px]:leading-10 min-[769px]:text-[36px] min-[769px]:leading-10"
            />
          </div>
          <p className="mx-auto max-w-[1120px] text-base leading-6 text-[#71717b] min-[640px]:text-2xl min-[640px]:leading-8 min-[640px]:max-[767px]:max-w-[544px] min-[640px]:max-[767px]:text-base min-[640px]:max-[767px]:leading-6 min-[768px]:max-[768px]:max-w-[680px] min-[768px]:max-[768px]:text-base min-[768px]:max-[768px]:leading-6 min-[769px]:max-w-[880px] min-[769px]:text-base min-[769px]:leading-6">
            Install the plugin, point it at your API key, and give OpenClaw a browse-first way to
            inspect documents before an agent answers.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-[10px] px-5 min-[640px]:flex-row min-[640px]:flex-wrap min-[640px]:items-start min-[640px]:gap-3 min-[640px]:px-16 min-[640px]:max-[767px]:items-center min-[640px]:max-[767px]:gap-3 min-[640px]:max-[767px]:px-12 min-[768px]:max-[768px]:items-center min-[768px]:max-[768px]:gap-4 min-[768px]:max-[768px]:px-12 min-[769px]:items-center min-[769px]:px-12">
          <ClawActionButton ctaId="get_api_key" href="/login" sourceSection="claw_cta">
            Get API key
          </ClawActionButton>
          <ClawActionButton
            ctaId="claw_integration_guide"
            href="#integration"
            sourceSection="claw_cta"
            variant="secondary"
          >
            Review install steps
          </ClawActionButton>
        </div>

        <p className="px-5 pb-[10px] text-center font-sans text-sm leading-[22px] text-[#27272a] min-[640px]:px-16 min-[640px]:pb-8 min-[640px]:text-lg min-[640px]:leading-[26px] min-[640px]:max-[767px]:mx-auto min-[640px]:max-[767px]:max-w-[560px] min-[640px]:max-[767px]:px-12 min-[640px]:max-[767px]:pb-6 min-[640px]:max-[767px]:text-sm min-[640px]:max-[767px]:leading-[18px] min-[768px]:max-[768px]:mx-auto min-[768px]:max-[768px]:max-w-[620px] min-[768px]:max-[768px]:px-12 min-[768px]:max-[768px]:pb-6 min-[768px]:max-[768px]:text-sm min-[768px]:max-[768px]:leading-5 min-[769px]:px-12 min-[769px]:pb-6 min-[769px]:text-sm min-[769px]:leading-5">
          PDFs, scanned files, tables, manifests, chunks, and raw result files stay reopenable
          instead of disappearing into one generated reply.
        </p>

        <div className="border-t border-[#f4f4f5]">
          <div className="border-y border-x border-y-[#ffe2e2] border-x-[#e4e4e7] bg-[#fef2f2] px-5 py-[14px] text-center min-[640px]:px-16 min-[640px]:py-6 min-[640px]:max-[767px]:px-12 min-[640px]:max-[767px]:py-4 min-[768px]:max-[768px]:px-12 min-[768px]:max-[768px]:py-4 min-[769px]:px-12 min-[769px]:py-4">
            <h2 className="text-lg font-bold leading-7 text-[#e7000b] min-[640px]:text-2xl min-[640px]:leading-8 min-[640px]:max-[767px]:text-lg min-[640px]:max-[767px]:leading-7 min-[768px]:max-[768px]:text-lg min-[768px]:max-[768px]:leading-7 min-[769px]:text-lg min-[769px]:leading-7">
              What changes inside OpenClaw
            </h2>
          </div>

          <div>
            {changeItems.map((item) => (
              <div
                className="relative flex flex-col items-start gap-4 border-b border-[#f4f4f5] px-5 py-6 min-[640px]:flex-row min-[640px]:items-center min-[640px]:gap-12 min-[640px]:px-16 min-[640px]:py-10 min-[640px]:max-[767px]:gap-8 min-[640px]:max-[767px]:px-12 min-[640px]:max-[767px]:py-8 min-[768px]:max-[768px]:gap-6 min-[768px]:max-[768px]:px-12 min-[768px]:max-[768px]:py-8 min-[769px]:gap-8 min-[769px]:px-12 min-[769px]:py-8"
                key={item.label}
              >
                <ClawStripedOverlay className="opacity-40" tint="red" />
                <div
                  className={cn(
                    "relative flex h-12 shrink-0 items-center justify-center border-r border-t border-b border-l-4 border-[#e4e4e7] bg-[#f4f4f5] px-6 py-3 font-mono-display text-base font-bold leading-6 text-[#09090b] min-[640px]:max-[767px]:h-auto min-[640px]:max-[767px]:px-5 min-[640px]:max-[767px]:py-[10px] min-[640px]:max-[767px]:text-sm min-[640px]:max-[767px]:leading-5 min-[768px]:max-[768px]:h-8 min-[768px]:max-[768px]:px-5 min-[768px]:max-[768px]:py-0 min-[768px]:max-[768px]:text-sm min-[768px]:max-[768px]:leading-5 min-[769px]:h-10 min-[769px]:px-5 min-[769px]:py-[10px] min-[769px]:text-sm min-[769px]:leading-5",
                    item.tagWidthClassName
                  )}
                >
                  {item.label}
                </div>
                <p className="relative flex-1 font-sans text-base leading-[22px] text-[#52525c] min-[640px]:text-sm min-[640px]:max-[767px]:leading-[18px] min-[768px]:max-[768px]:text-sm min-[768px]:max-[768px]:leading-5 min-[769px]:text-sm min-[769px]:leading-5">
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
