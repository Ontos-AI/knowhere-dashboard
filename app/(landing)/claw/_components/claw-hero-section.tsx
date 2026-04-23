import {
  type ClawFeatureCard,
  clawFeatureCards,
  heroCapabilityTags,
  heroFileBadges,
} from "@app/(landing)/claw/_components/claw-content";
import {
  ClawActionButton,
  ClawStripedOverlay,
  FileFormatBadge,
  OpenClawMark,
} from "@app/(landing)/claw/_components/claw-primitives";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import { cn } from "@lib/utils";

const monoHeadlineClassName =
  "font-mono-display text-[22px] font-bold leading-[1.2] tracking-[-1px] text-[#09090b] sm:text-[42px] sm:leading-[42px] lg:text-[48px] lg:leading-[1.2]";

type FeatureCardProps = {
  card: ClawFeatureCard;
};

const FeatureCard = ({ card }: FeatureCardProps) => {
  return (
    <article className="relative flex min-h-[260px] flex-col gap-4 overflow-hidden border border-[#e4e4e7] px-5 py-6 sm:gap-8 sm:px-16 sm:py-10 lg:h-[392px] lg:px-14 xl:h-auto xl:min-h-[352px] xl:px-16">
      {card.withStripes ? <ClawStripedOverlay tint="pink" /> : null}
      <div className="relative space-y-4">
        <div
          className="flex h-12 w-12 items-center justify-center border-b border-r border-t border-l-4"
          style={{
            backgroundColor: card.iconSurfaceColor,
            borderColor: card.iconBorderColor,
            color: card.iconColor,
          }}
        >
          <KnowhereIcon className="size-6 text-current" name={card.icon} />
        </div>
        <p
          className="font-mono-display text-sm leading-6 tracking-normal sm:text-base"
          style={{ color: card.iconColor }}
        >
          {card.label}
        </p>
      </div>
      <div className="relative space-y-[6px] sm:space-y-4">
        <h3 className="text-lg font-bold leading-7 text-[#09090b] sm:text-[20px]">{card.title}</h3>
        <p className="max-w-none text-base leading-6 text-[#52525c] sm:text-sm sm:leading-5 lg:max-w-[229px] xl:max-w-[298px]">
          {card.description}
        </p>
      </div>
    </article>
  );
};

export const ClawHeroSection = () => {
  return (
    <section className="border border-[#e4e4e7] bg-[#fafafa] scroll-mt-20" id="overview">
      <div className="border-b border-[#ede9fe] bg-[#fef2f2] py-10 sm:py-16">
        <div className="flex flex-col gap-8 px-5 sm:gap-12 sm:px-16">
          <div className="space-y-5 text-center sm:space-y-8 lg:pt-3">
            <div className="space-y-[10px] sm:space-y-2">
              <div className="flex flex-wrap items-center justify-center gap-x-[10px] gap-y-2.5 sm:gap-10">
                <p className={monoHeadlineClassName}>Your docs</p>
                <div className="flex flex-wrap items-center justify-center gap-[10px]">
                  {heroFileBadges.map((badge) => (
                    <FileFormatBadge key={badge.label} {...badge} />
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:gap-5">
                <p className={monoHeadlineClassName}>become</p>
                <span className="inline-flex items-center gap-1.5">
                  <OpenClawMark className="h-7 w-8 sm:h-[50px] sm:w-[56px]" />
                  <span className="font-mono-display text-[24px] font-bold leading-8 tracking-[-1px] text-[#e7000b] sm:text-[48px] sm:leading-[1.2]">
                    OpenClaw-native
                  </span>
                </span>
                <span className={cn(monoHeadlineClassName, "flex items-center gap-1.5")}>
                  <span aria-hidden="true">📝</span>
                  <span className="text-[#c800de]">context</span>
                </span>
              </div>
              <p className={cn(monoHeadlineClassName, "w-full")}>with grounded retrieval</p>
            </div>

            <p className="mx-auto max-w-none font-mono-display text-base font-light leading-6 tracking-[-0.5px] text-[#52525c] lg:max-w-[1120px] lg:text-lg lg:leading-[1.5]">
              The plugin uses Knowhere for parsing and job orchestration, stores the returned result
              package inside OpenClaw-managed local storage, and gives agents a browse-first path to
              previews, chunks, hierarchy, and raw files before they answer.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 lg:flex-row lg:justify-center">
            <ClawActionButton className="w-fit lg:w-auto lg:max-w-none" href="#integration">
              See integration guide
            </ClawActionButton>
            <ClawActionButton
              className="w-fit lg:w-auto lg:max-w-none"
              href="/login"
              variant="secondary"
            >
              Get API key
            </ClawActionButton>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pb-2 text-center text-[12px] leading-5 sm:gap-[10px] sm:pb-8 sm:text-sm xl:px-16 xl:pb-0 xl:text-base xl:leading-5">
            {heroCapabilityTags.map((tag) => (
              <p
                className="font-mono-display tracking-normal whitespace-nowrap"
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

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {clawFeatureCards.map((card) => (
          <FeatureCard card={card} key={card.label} />
        ))}
      </div>
    </section>
  );
};
