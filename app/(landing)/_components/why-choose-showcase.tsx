"use client";

import { LandingBrand } from "@app/(landing)/_components/landing-brand";
import {
  type WhyChooseCompetitorId,
  whyChooseProducts,
} from "@app/(landing)/_components/landing-home-data";
import { LandingUnstructuredBrand } from "@app/(landing)/_components/landing-unstructured-brand";
import { StatefulTab } from "@app/(landing)/_components/stateful-tab";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import { cn } from "@lib/utils";
import { useState } from "react";

const monoDisplayClassName = "font-[family-name:var(--font-mono-display)]";
const whyChooseTabTone = {
  selectedBg: "#71717b",
  selectedBorder: "#52525c",
  selectedText: "#fafafa",
  enabledBg: "#e4e4e7",
  enabledText: "#09090b",
  hoverBg: "#d4d4d8",
  hoverBorder: "#a1a1aa",
  activeBg: "#a1a1aa",
  activeBorder: "#71717b",
} as const;

const cardStripePattern = (color: string) => ({
  backgroundImage: `repeating-linear-gradient(-45deg, ${color} 0 1px, transparent 1px 7px)`,
});

const MarkitdownBrand = () => (
  <div className="flex h-10 shrink-0 items-center gap-2">
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-xs font-bold text-white">
      M
    </span>
    <span className="whitespace-nowrap font-sans text-lg font-normal leading-7 text-zinc-950">
      Markitdown
    </span>
  </div>
);

export const WhyChooseShowcase = () => {
  const [activeId, setActiveId] = useState<WhyChooseCompetitorId>("unstructured");
  const activeProduct =
    whyChooseProducts.find((product) => product.id === activeId) ?? whyChooseProducts[0];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-px px-12 max-[639px]:px-4 min-[640px]:max-[767px]:px-12">
        {whyChooseProducts.map((product) => (
          <StatefulTab
            active={activeId === product.id}
            key={product.id}
            className={cn(monoDisplayClassName, "focus-visible:ring-[#7f22fe]")}
            onClick={() => setActiveId(product.id)}
            tone={whyChooseTabTone}
          >
            {product.tabLabel}
          </StatefulTab>
        ))}
      </div>

      <div className="mt-[8px] grid grid-cols-2 border-t border-zinc-100 pl-12 max-[639px]:grid-cols-1 max-[639px]:pl-0 min-[640px]:max-[767px]:grid-cols-1 min-[640px]:max-[767px]:pl-0">
        <div className="flex flex-col gap-6 py-6 pr-12 max-[639px]:px-4 max-[639px]:pr-4 min-[640px]:max-[767px]:px-12 min-[640px]:max-[767px]:pr-12">
          <p className="max-w-[306px] text-sm leading-5 text-zinc-500 max-[639px]:max-w-none max-[639px]:text-base max-[639px]:leading-6 min-[640px]:max-[767px]:max-w-none min-[769px]:max-w-[328px]">
            {activeProduct.description}
          </p>
          <div className="flex flex-col">
            {activeProduct.advantages.map((advantage) => (
              <div key={advantage} className="flex items-center gap-4 py-2.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#009966] border-r-4 bg-[#00bc7d] text-white">
                  <KnowhereIcon className="size-5 shrink-0 text-current" name="check-pix" />
                </div>
                <span className="text-base font-bold leading-6 text-zinc-950">{advantage}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-l border-zinc-100 max-[639px]:border-l-0 max-[639px]:border-t min-[640px]:max-[767px]:border-l-0 min-[640px]:max-[767px]:border-t">
          <div className="flex flex-col items-center gap-6 pb-12 pt-10 text-center max-[639px]:px-4 min-[640px]:max-[767px]:px-12">
            <h3 className="max-w-[320px] px-8 text-sm font-bold leading-5 text-zinc-950 max-[639px]:px-0 min-[640px]:max-[767px]:px-0">
              {activeProduct.headline}
            </h3>
            <div className="grid w-full grid-cols-2 gap-px bg-transparent max-[639px]:grid-cols-1">
              {activeProduct.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex min-h-[169px] flex-col items-center justify-center border border-zinc-700 bg-zinc-600 text-center text-[#5ee9b5]"
                  style={cardStripePattern("rgba(63,63,70,0.5)")}
                >
                  <span
                    className={cn(
                      "text-[30px] font-semibold leading-10 max-[639px]:text-[20px] max-[639px]:leading-8",
                      monoDisplayClassName
                    )}
                  >
                    {metric.value}
                  </span>
                  <span
                    className={cn(
                      "mt-3 max-w-[165px] text-xs leading-5 text-zinc-400 max-[639px]:text-[11px] max-[639px]:leading-4 font-sans"
                    )}
                  >
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 max-[639px]:flex-col max-[639px]:gap-4">
              <LandingBrand />
              <span className="flex size-8 items-center justify-center rounded-full bg-zinc-100 text-xs text-zinc-400">
                VS
              </span>
              {activeProduct.id === "unstructured" ? (
                <LandingUnstructuredBrand />
              ) : (
                <MarkitdownBrand />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
