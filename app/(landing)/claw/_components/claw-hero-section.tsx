import { ClawActionButton } from "@app/(landing)/claw/_components/claw-action-button";
import {
  type ClawFeatureCard,
  clawFeatureCards,
  heroCapabilityTags,
  heroFileBadges,
} from "@app/(landing)/claw/_components/claw-content";
import { clawHeroDesign } from "@app/(landing)/claw/_components/claw-hero-design";
import {
  ClawStripedOverlay,
  FileFormatBadge,
  OpenClawMark,
} from "@app/(landing)/claw/_components/claw-primitives";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import { cn } from "@lib/utils";
import Image from "next/image";

const monoHeadlineClassName =
  "font-mono-readable text-[22px] font-bold leading-[1.2] tracking-[-1px] text-[#09090b] min-[640px]:text-[42px] min-[640px]:leading-[42px] min-[640px]:max-[767px]:text-[32px] min-[640px]:max-[767px]:leading-[1.2] min-[768px]:max-[768px]:text-[36px] min-[768px]:max-[768px]:leading-[1.2] min-[769px]:text-[36px] min-[769px]:leading-[1.2]";

type FeatureCardProps = {
  card: ClawFeatureCard;
};

const FeatureCard = ({ card }: FeatureCardProps) => {
  return (
    <article className="relative flex h-full min-h-[260px] flex-col gap-4 overflow-hidden px-5 py-6 min-[640px]:gap-8 min-[640px]:px-16 min-[640px]:py-10 min-[640px]:max-[767px]:gap-8 min-[640px]:max-[767px]:px-5 min-[640px]:max-[767px]:py-7 min-[768px]:max-[768px]:gap-8 min-[768px]:max-[768px]:px-10 min-[768px]:max-[768px]:py-7 min-[769px]:gap-8 min-[769px]:px-12 min-[769px]:py-8">
      {card.withStripes ? <ClawStripedOverlay tint="pink" /> : null}
      <div className="relative space-y-3 min-[768px]:max-[768px]:space-y-3 min-[769px]:space-y-3">
        <div
          className="flex h-12 w-12 items-center justify-center min-[640px]:max-[767px]:h-10 min-[640px]:max-[767px]:w-10 min-[768px]:max-[768px]:h-10 min-[768px]:max-[768px]:w-10 min-[769px]:h-10 min-[769px]:w-10"
          style={{
            backgroundColor: card.iconSurfaceColor,
            boxShadow: `inset 0 0 0 1px ${card.iconBorderColor}`,
            color: card.iconColor,
          }}
        >
          <KnowhereIcon
            className="size-6 text-current min-[640px]:max-[767px]:size-5 min-[768px]:max-[768px]:size-5 min-[769px]:size-5"
            name={card.icon}
          />
        </div>
        <p
          className="font-sans text-sm leading-6 tracking-normal min-[640px]:text-base min-[640px]:max-[767px]:text-sm min-[640px]:max-[767px]:leading-[22px] min-[768px]:max-[768px]:text-base min-[768px]:max-[768px]:leading-6 min-[769px]:text-base min-[769px]:leading-6"
          style={{ color: card.iconColor }}
        >
          {card.label}
        </p>
      </div>
      <div className="relative space-y-[6px] min-[640px]:space-y-4 min-[768px]:max-[768px]:space-y-2 min-[769px]:space-y-2">
        <h3 className="text-lg font-bold leading-7 text-[#09090b] min-[640px]:text-[20px] min-[640px]:max-[767px]:text-base min-[640px]:max-[767px]:leading-6 min-[768px]:max-[768px]:text-base min-[768px]:max-[768px]:leading-6 min-[769px]:text-base min-[769px]:leading-6">
          {card.title}
        </h3>
        <p className="max-w-none text-base leading-6 text-[#52525c] min-[640px]:text-sm min-[640px]:leading-5 min-[640px]:max-[767px]:text-xs min-[640px]:max-[767px]:leading-4 min-[768px]:max-[768px]:max-w-[170px] min-[768px]:max-[768px]:text-xs min-[768px]:max-[768px]:leading-4 min-[769px]:max-w-[232px] min-[769px]:text-xs min-[769px]:leading-4">
          {card.description}
        </p>
      </div>
    </article>
  );
};

export const ClawHeroSection = () => {
  return (
    <section className="bg-white scroll-mt-20 shadow-[inset_0_0_0_1px_#e4e4e7]" id="overview">
      <div className="border-x border-b border-[#e4e4e7] bg-[#fef2f2] py-10 min-[640px]:py-16 min-[640px]:max-[767px]:pb-14 min-[640px]:max-[767px]:pt-12 min-[768px]:max-[768px]:pb-[44px] min-[768px]:max-[768px]:pt-12 min-[769px]:pb-14 min-[769px]:pt-12">
        <div className="flex flex-col gap-8 px-5 min-[640px]:gap-12 min-[640px]:px-16 min-[640px]:max-[767px]:gap-9 min-[640px]:max-[767px]:px-12 min-[768px]:max-[768px]:gap-9 min-[768px]:max-[768px]:px-12 min-[769px]:gap-9 min-[769px]:px-12">
          <div className="space-y-5 text-center min-[640px]:space-y-8 min-[640px]:max-[767px]:space-y-7 min-[640px]:max-[767px]:pt-3 min-[768px]:max-[768px]:space-y-7 min-[769px]:space-y-7 min-[769px]:pt-3">
            <div className="space-y-[10px] min-[640px]:space-y-2 min-[768px]:max-[768px]:space-y-1">
              <div className="flex flex-wrap items-center justify-center gap-x-[10px] gap-y-2.5 min-[640px]:gap-10 min-[640px]:max-[767px]:gap-x-[10px] min-[640px]:max-[767px]:gap-y-[10px] min-[768px]:max-[768px]:gap-x-3 min-[768px]:max-[768px]:gap-y-[10px] min-[769px]:gap-[10px]">
                <p className={monoHeadlineClassName}>Your docs</p>
                <div className="flex flex-wrap items-center justify-center gap-[10px]">
                  {heroFileBadges.map((badge) => (
                    <FileFormatBadge key={badge.label} {...badge} />
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 min-[640px]:gap-5 min-[640px]:max-[767px]:gap-x-2 min-[640px]:max-[767px]:gap-y-2 min-[768px]:max-[768px]:gap-x-3 min-[768px]:max-[768px]:gap-y-2 min-[769px]:gap-x-3 min-[769px]:gap-y-2">
                <p className={monoHeadlineClassName}>become</p>
                <span className="inline-flex items-center gap-1.5">
                  <OpenClawMark className="h-7 w-8 min-[640px]:h-[50px] min-[640px]:w-[56px] min-[640px]:max-[767px]:h-[35px] min-[640px]:max-[767px]:w-[40px] min-[768px]:max-[768px]:h-[35px] min-[768px]:max-[768px]:w-[40px] min-[769px]:h-[35px] min-[769px]:w-[40px]" />
                  <span className="font-mono-readable text-[24px] font-bold leading-8 tracking-[-1px] text-[#e7000b] min-[640px]:text-[48px] min-[640px]:leading-[1.2] min-[640px]:max-[767px]:text-[36px] min-[640px]:max-[767px]:leading-[1.2] min-[768px]:max-[768px]:text-[36px] min-[768px]:max-[768px]:leading-[1.2] min-[769px]:text-[36px] min-[769px]:leading-[1.2]">
                    OpenClaw-native
                  </span>
                </span>
                <span
                  className={cn(
                    monoHeadlineClassName,
                    "flex items-center gap-1.5 min-[640px]:max-[767px]:basis-full min-[640px]:max-[767px]:justify-center min-[768px]:max-[768px]:basis-full min-[768px]:max-[768px]:justify-center"
                  )}
                >
                  <Image
                    alt=""
                    aria-hidden="true"
                    className={clawHeroDesign.contextMarker.iconClassName}
                    height={36}
                    src={clawHeroDesign.contextMarker.iconSrc}
                    width={36}
                  />
                  <span className="text-[#c800de]">context</span>
                </span>
              </div>
              <p className={cn(monoHeadlineClassName, "w-full")}>with grounded retrieval</p>
            </div>

            <p className="mx-auto max-w-none font-sans text-base font-normal leading-6 tracking-[-0.5px] text-[#52525c] min-[640px]:max-[767px]:max-w-[544px] min-[640px]:max-[767px]:text-base min-[640px]:max-[767px]:leading-6 min-[768px]:max-[768px]:max-w-[640px] min-[768px]:max-[768px]:text-base min-[768px]:max-[768px]:leading-6 min-[769px]:max-w-[860px] min-[769px]:text-base min-[769px]:leading-6">
              The plugin uses Knowhere for parsing and job orchestration, stores the returned result
              package inside OpenClaw-managed local storage, and gives agents a browse-first path to
              previews, chunks, hierarchy, and raw files before they answer.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 min-[640px]:max-[767px]:flex-row min-[640px]:max-[767px]:justify-center min-[640px]:max-[767px]:gap-3 min-[768px]:max-[768px]:flex-row min-[768px]:max-[768px]:justify-center min-[768px]:max-[768px]:gap-3 min-[769px]:flex-row min-[769px]:justify-center min-[769px]:gap-3">
            <ClawActionButton
              className="w-fit min-[640px]:max-[767px]:w-auto min-[768px]:max-[768px]:w-auto min-[769px]:w-auto"
              ctaId="claw_integration_guide"
              href="#integration"
              sourceSection="claw_hero"
            >
              See integration guide
            </ClawActionButton>
            <ClawActionButton
              className="w-fit min-[640px]:max-[767px]:w-auto min-[768px]:max-[768px]:w-auto min-[769px]:w-auto"
              ctaId="get_api_key"
              href="/login"
              sourceSection="claw_hero"
              variant="secondary"
            >
              Get API key
            </ClawActionButton>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pb-2 text-center text-[12px] leading-5 min-[640px]:gap-[10px] min-[640px]:pb-8 min-[640px]:text-sm min-[640px]:max-[767px]:mx-auto min-[640px]:max-[767px]:max-w-[520px] min-[640px]:max-[767px]:gap-x-[10px] min-[640px]:max-[767px]:gap-y-2 min-[640px]:max-[767px]:pb-0 min-[640px]:max-[767px]:text-sm min-[640px]:max-[767px]:leading-5 min-[768px]:max-[768px]:mx-auto min-[768px]:max-[768px]:max-w-[560px] min-[768px]:max-[768px]:gap-x-[10px] min-[768px]:max-[768px]:gap-y-2 min-[768px]:max-[768px]:pb-0 min-[768px]:max-[768px]:text-sm min-[768px]:max-[768px]:leading-5 min-[769px]:gap-[10px] min-[769px]:pb-0 min-[769px]:text-sm min-[769px]:leading-5">
            {heroCapabilityTags.map((tag) => (
              <p
                className={cn(
                  "font-mono-display tracking-normal whitespace-nowrap",
                  tag.label === "OpenClaw-native" ? "min-[768px]:max-[768px]:basis-full" : undefined
                )}
                key={tag.label}
                style={{ color: tag.textColor }}
              >
                <span style={{ color: tag.accentColor }}>{"{ "}</span>
                {tag.label}
                <span style={{ color: tag.accentColor }}>{" }"}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 border-b border-[#e4e4e7] divide-y divide-[#e4e4e7] min-[640px]:max-[767px]:grid-cols-3 min-[640px]:max-[767px]:divide-x min-[640px]:max-[767px]:divide-y-0 min-[768px]:max-[768px]:grid-cols-3 min-[768px]:max-[768px]:divide-x min-[768px]:max-[768px]:divide-y-0 min-[769px]:grid-cols-3 min-[769px]:divide-x min-[769px]:divide-y-0">
        {clawFeatureCards.map((card) => (
          <FeatureCard card={card} key={card.label} />
        ))}
      </div>
    </section>
  );
};
