import { ComparisonShowcase } from "@app/(landing)/_components/comparison-showcase";
import { HeroPlayground } from "@app/(landing)/_components/hero-playground";
import { IntegrateCodePanel } from "@app/(landing)/_components/integrate-code-panel";
import { LandingBrand } from "@app/(landing)/_components/landing-brand";
import { LandingHeader } from "@app/(landing)/_components/landing-header";
import {
  type ChallengeCard,
  challengeCards,
  comingSoonFormats,
  comparisonHighlights,
  enterpriseItems,
  type FormatChip,
  faqItems,
  fileLimits,
  integrationSteps,
  type MetricCard,
  pricingExamples,
  supportedFormats,
  type TransformStep,
  transformMetrics,
  transformSteps,
} from "@app/(landing)/_components/landing-home-data";
import { WhyChooseShowcase } from "@app/(landing)/_components/why-choose-showcase";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import { cn } from "@lib/utils";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

const sectionFrameClassName =
  "overflow-hidden border-b border-l border-r border-zinc-200 bg-[#fafafa]";
const sectionPaddingClassName = "px-[48px] max-[639px]:px-[18px] min-[640px]:max-[767px]:px-[46px]";
const heroSectionPaddingClassName = "px-16 max-[639px]:px-5";
const landingCanvasWidthClassName =
  "mx-auto flex w-full flex-col min-[768px]:max-w-[768px] min-[769px]:max-w-[976px] [&>*+*]:-mt-px";
const footerPaddingClassName =
  "px-12 py-6 max-[639px]:px-[18px] max-[639px]:py-[18px] min-[640px]:max-[767px]:px-[46px] min-[640px]:max-[767px]:py-6";
const monoDisplayClassName = "font-[family-name:var(--font-mono-display)]";
const monoReadableClassName = "font-[family-name:var(--font-mono-readable)]";
const accentClassName = "font-[family-name:var(--font-accent)]";
// const geistSansClassName = "font-[family-name:var(--font-geist-sans)]";
// const anuphanClassName = "font-[family-name:var(--font-anuphan)]";
const mobileActionLinkClassName = "h-[52px] px-7 text-[18px] leading-6";
const challengeCardHeightClassNames = [
  "min-[769px]:min-h-[214px]",
  "min-[769px]:min-h-[214px]",
  "min-[769px]:min-h-[194px]",
  "min-[769px]:min-h-[194px]",
  "min-[769px]:min-h-[214px]",
  "min-[769px]:min-h-[214px]",
] as const;

const stripePattern = (color: string, thickness = 1, size = 8): CSSProperties => ({
  backgroundImage: `repeating-linear-gradient(-45deg, transparent 0 ${size - thickness}px, ${color} ${size - thickness}px ${size}px)`,
});

const dotPattern = (color: string): CSSProperties => ({
  backgroundImage: `radial-gradient(${color} 1.1px, transparent 1.1px)`,
  backgroundSize: "16px 16px",
});

const cardStripePattern = (color: string): CSSProperties => ({
  backgroundImage: `repeating-linear-gradient(-45deg, ${color} 0 1px, transparent 1px 7px)`,
});

type ActionLinkProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  className?: string;
  external?: boolean;
};

const ActionLink = ({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  external = false,
}: ActionLinkProps) => {
  const sizeClassName = size === "sm" ? "h-16 px-7 text-base" : "h-[72px] px-9 text-xl";

  const variantClassName =
    variant === "primary"
      ? "border border-b-[6px] border-[#7f22fe] bg-[#8e51ff] text-[#f5f3ff] [--btn-bottom:6px] hover:border-[#7008e7] hover:bg-[#7f22fe] hover:border-b-[8px] hover:[--btn-bottom:8px] active:border-[#7008e7] active:bg-[#7008e7] active:border-b-[6px] active:[--btn-bottom:6px]"
      : "border-x-2 border-t-2 border-b-[6px] border-zinc-200 bg-[#fafaf9] text-zinc-800 [--btn-bottom:6px] hover:border-zinc-200 hover:bg-[#f5f5f4] hover:border-b-[8px] hover:[--btn-bottom:8px] active:border-[#e7e5e4] active:bg-[#e7e5e4] active:border-b-[6px] active:[--btn-bottom:6px]";

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-center rounded-full transition-[background-color,border-color,border-bottom-width]",
        monoDisplayClassName,
        sizeClassName,
        variantClassName,
        className
      )}
      rel={external ? "noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      <span className="inline-flex h-full translate-y-1 items-center pb-[var(--btn-bottom)] font-semibold transition-[padding-bottom,transform] duration-150 ease-out">
        {children}
      </span>
    </Link>
  );
};

const SectionTitle = ({
  title,
  description,
  className,
  descriptionClassName,
}: {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  descriptionClassName?: string;
}) => (
  <div
    className={cn(
      "flex flex-col items-start gap-2 px-[48px] max-[639px]:px-[18px] min-[640px]:max-[767px]:px-[46px]",
      className
    )}
  >
    <h2 className="text-left text-[30px] font-bold leading-9 text-zinc-950 max-[639px]:text-[22px] max-[639px]:leading-8">
      {title}
    </h2>
    {description ? (
      <p className={cn("max-w-[1080px] text-base leading-6 text-zinc-500", descriptionClassName)}>
        {description}
      </p>
    ) : null}
  </div>
);

const StatsItem = ({
  icon,
  leading,
  trailing,
  leadingClassName,
}: {
  icon: ReactNode;
  leading: string;
  trailing: string;
  leadingClassName?: string;
}) => (
  <div className="flex h-20 items-center justify-center gap-3 px-4 text-center max-[639px]:h-16 max-[639px]:gap-[14px] min-[769px]:gap-4 min-[769px]:px-6">
    <div className="flex size-5 items-center justify-center text-[#8e51ff] min-[769px]:size-6">
      {icon}
    </div>
    <div
      className={cn(
        "flex items-center gap-2 text-[14px] leading-5 max-[639px]:gap-[10px] max-[639px]:text-base max-[639px]:leading-6 min-[769px]:gap-3 min-[769px]:text-[16px] min-[769px]:leading-6",
        monoDisplayClassName
      )}
    >
      <span className={cn("font-medium text-zinc-800", leadingClassName)}>{leading}</span>
      <span className="font-light text-zinc-700">{trailing}</span>
    </div>
  </div>
);

const CornerLines = ({ color }: { color: string }) => (
  <>
    <span
      className="pointer-events-none absolute left-0 top-0 size-[9px] border-l-2 border-t-2"
      style={{ borderColor: color }}
    />
    <span
      className="pointer-events-none absolute right-0 top-0 size-[9px] -scale-x-100 border-l-2 border-t-2"
      style={{ borderColor: color }}
    />
    <span
      className="pointer-events-none absolute bottom-0 left-0 size-[9px] -scale-y-100 border-l-2 border-t-2"
      style={{ borderColor: color }}
    />
    <span
      className="pointer-events-none absolute bottom-0 right-0 size-[9px] -scale-x-100 -scale-y-100 border-l-2 border-t-2"
      style={{ borderColor: color }}
    />
  </>
);

const FormatBadge = ({
  chip,
  muted = false,
  value,
}: {
  chip: FormatChip;
  muted?: boolean;
  value?: string;
}) => (
  <div className="flex flex-col items-center gap-4">
    <div
      className="relative overflow-hidden border px-3 py-2 max-[639px]:px-[10px] max-[639px]:py-1 min-[640px]:max-[767px]:px-[10px] min-[640px]:max-[767px]:py-1.5"
      style={{
        backgroundColor: chip.tone.background,
        borderColor: chip.tone.border,
      }}
    >
      <div className="absolute inset-0 opacity-40" style={stripePattern(chip.tone.border, 1, 10)} />
      <span
        className={cn("relative text-[18px] leading-6", monoDisplayClassName)}
        style={{ color: chip.tone.text }}
      >
        {chip.label}
      </span>
      <CornerLines color={muted ? "#d4d4d8" : chip.tone.border} />
    </div>
    {value ? <span className="text-[18px] leading-7 text-[#e60076] font-sans">{value}</span> : null}
  </div>
);

const NumberBadge = ({ number }: { number: string }) => (
  <div className="flex size-10 items-center justify-center border-b border-l border-r-4 border-t border-[#ddd6ff] bg-[#ede9fe] text-[#a684ff]">
    <span className={cn("text-[18px] font-bold leading-7", monoDisplayClassName)}>{number}</span>
  </div>
);

const HighlightRow = ({ text }: { text: string }) => {
  const [metric, ...parts] = text.split(" ");

  return (
    <div className="relative flex items-center justify-between border border-[#fde68a] bg-[#fffbeb]">
      <div className="flex min-h-[72px] flex-1 items-center max-[639px]:min-h-[60px]">
        <div className="relative flex min-h-[72px] w-[115px] flex-none items-center justify-center overflow-hidden border-r border-[#fde68a] bg-[#fff7db] max-[639px]:min-h-[60px] max-[639px]:w-[78px]">
          <div className="absolute inset-0 opacity-50" style={dotPattern("#fde68a")} />
          <span
            className={cn(
              "relative text-[24px] font-bold leading-8 text-[#ea580c] max-[639px]:text-[20px] max-[639px]:leading-7",
              monoDisplayClassName
            )}
          >
            {metric}
          </span>
        </div>
        <div
          className={cn(
            "px-5 py-4 text-[20px] leading-7 text-[#ea580c] max-[639px]:px-4 max-[639px]:py-3 max-[639px]:text-base max-[639px]:leading-6 font-sans"
          )}
        >
          {parts.join(" ")}
        </div>
      </div>
      <span className="absolute right-4 top-4 text-[#f7b955]">
        <Plus className="size-4" />
      </span>
    </div>
  );
};

const ChallengeIcon = ({ card }: { card: ChallengeCard }) => {
  const iconPathByType: Record<ChallengeCard["icon"], string> = {
    agentic: "/icons/landing/challenges/1.svg",
    formula: "/icons/landing/challenges/2.svg",
    format: "/icons/landing/challenges/3.svg",
    trace: "/icons/landing/challenges/4.svg",
    deploy: "/icons/landing/challenges/5.svg",
    api: "/icons/landing/challenges/6.svg",
  };

  return (
    <Image
      alt=""
      aria-hidden="true"
      className="size-5"
      height={20}
      src={iconPathByType[card.icon]}
      width={20}
    />
  );
};

const TransformStepCard = ({ step }: { step: TransformStep }) => (
  <div
    className="relative flex w-full flex-col overflow-hidden border"
    style={{ borderColor: step.tone.border, backgroundColor: step.tone.background }}
  >
    <div
      className="absolute left-0 top-0 flex h-[48px] w-[48px] items-center justify-center max-[639px]:h-9 max-[639px]:w-9"
      style={{ backgroundColor: step.tone.numberBg }}
    >
      <span
        className={cn(
          "text-[16px] font-bold leading-none max-[767px]:text-[14px]",
          monoDisplayClassName
        )}
        style={{ color: "#ffffff" }}
      >
        {step.number}
      </span>
    </div>
    <div className="flex items-center gap-5 bg-white px-5 py-[14px] pl-[80px] max-[639px]:gap-4 max-[639px]:px-4 max-[639px]:pl-[48px]">
      <div className="flex flex-col gap-1">
        <span
          className="text-base font-bold leading-6 text-zinc-950 font-sans"
          style={{ color: step.tone.text }}
        >
          {step.title}
        </span>
        <span className="text-sm leading-5 text-zinc-500 font-sans">{step.description}</span>
      </div>
    </div>
    <div
      className="relative h-3 overflow-hidden border-t"
      style={{ borderColor: step.tone.border }}
    >
      <div className="absolute inset-0 opacity-40" style={stripePattern(step.tone.border, 1, 8)} />
    </div>
  </div>
);

const MetricPanel = ({ card }: { card: MetricCard }) => (
  <div
    className="flex min-h-full flex-col items-center justify-center border px-6 py-6 text-center"
    style={{
      backgroundColor: card.tone.background,
      borderColor: card.tone.border,
      ...(card.stripe ? cardStripePattern(card.tone.border) : {}),
    }}
  >
    <span
      className={cn(
        "text-[36px] font-semibold leading-10 max-[639px]:text-[20px] max-[639px]:leading-8",
        monoReadableClassName
      )}
      style={{ color: card.tone.text }}
    >
      {card.value}
    </span>
    <span
      className={cn("mt-4 text-sm leading-5 max-[639px]:text-xs max-[639px]:leading-4 font-sans")}
      style={{ color: card.tone.text }}
    >
      {card.label}
    </span>
  </div>
);

const PricingBurst = () => (
  <div className="relative flex size-[298px] items-center justify-center max-[639px]:size-[196px]">
    <Image
      alt=""
      aria-hidden
      className="absolute inset-0 h-full w-full object-contain"
      height={294}
      src="/icons/landing/pricing-star.svg"
      width={296}
    />
    <div className="-rotate-[15deg] text-center text-[#fdf2f8]">
      <div
        className={cn(
          "text-[65px] font-extrabold leading-[65px] min-[769px]:text-[72px] min-[769px]:leading-[72px] max-[639px]:text-[58px] max-[639px]:leading-[58px]",
          accentClassName
          // anuphanClassName
        )}
      >
        $1.5
      </div>
      <div
        className={cn(
          "mt-3 text-sm font-light leading-[18px] min-[769px]:text-base min-[769px]:leading-5 max-[639px]:text-sm"
          // geistSansClassName
        )}
      >
        per 1,000 pages
      </div>
    </div>
  </div>
);

const EnterpriseCheckItem = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 self-start py-2 pr-4">
    <div
      className="flex items-center justify-center rounded-full border border-[#009966] border-r-4 bg-[#00bc7d] text-white max-[639px]:w-[32px] max-[639px]:h-[32px] min-[640px]:max-[767px]:w-[36px] min-[640px]:max-[767px]:h-[36px] min-[769px]:w-[40px] min-[769px]:h-[40px]"
      style={{ flexShrink: 0 }}
    >
      <KnowhereIcon
        className="text-current max-[639px]:size-4 min-[640px]:max-[767px]:size-4.5 min-[769px]:size-5"
        name="check-pix"
      />
    </div>
    <span className="text-base font-semibold leading-6 text-zinc-950">{label}</span>
  </div>
);

const FaqRow = ({ question, answer }: { question: string; answer: string }) => (
  <div className="flex items-center gap-6 border-b border-zinc-100 px-12 py-5 first:border-t max-[639px]:items-start max-[639px]:gap-4 max-[639px]:px-4 max-[639px]:py-6">
    <div className="flex size-10 flex-none items-center justify-center border-b border-l border-r-4 border-t border-[#ddd6ff] bg-[#ede9fe] text-[#a684ff]">
      <span className={cn("text-[18px] font-black leading-7", monoDisplayClassName)}>?</span>
    </div>
    <div className="flex flex-col gap-1">
      <h3 className="text-base font-semibold leading-6 text-zinc-950 min-[769px]:text-xl min-[769px]:leading-7">
        {question}
      </h3>
      <p className="text-xs leading-4 text-zinc-700 max-[639px]:text-sm max-[639px]:leading-6">
        {answer}
      </p>
    </div>
  </div>
);

const FooterChip = ({ color, children }: { color: string; children: string }) => (
  <p
    className={cn(
      "text-sm leading-6 text-zinc-950 min-[769px]:text-[18px] min-[769px]:leading-8",
      monoDisplayClassName
    )}
  >
    <span style={{ color }}>{`{ `}</span>
    {children}
    <span style={{ color }}>{` }`}</span>
  </p>
);

export const LandingHome = () => {
  return (
    <div className="min-h-dvh bg-[#fafafa] text-[#09090b]">
      <LandingHeader />

      <main className={cn(landingCanvasWidthClassName, "max-[375px]:min-w-[320px]")}>
        <section className={sectionFrameClassName}>
          <div className="relative border-b border-[#ede9fe] bg-[#f5f3ff] pb-14 pt-12 max-[639px]:pb-11 max-[639px]:pt-4 min-[769px]:pb-[56px] min-[769px]:pt-[48px]">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: "radial-gradient(circle, #ddd6ff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div
              className={cn(
                "relative flex flex-col items-center gap-9 max-[639px]:gap-7",
                heroSectionPaddingClassName
              )}
            >
              <div className="flex w-full max-w-[934px] flex-row items-stretch overflow-hidden rounded-lg border border-zinc-200 bg-white max-[639px]:flex-col max-[639px]:items-center max-[639px]:gap-2 max-[639px]:px-5 max-[639px]:py-3">
                <div className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-1 px-7 py-5 text-left max-[639px]:justify-center max-[639px]:px-0 max-[639px]:py-0 max-[639px]:text-center">
                  <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 max-[639px]:max-w-[240px]">
                    <span className="text-[14px] font-bold leading-[22px] tracking-[-1px] text-zinc-950 min-[769px]:text-base min-[769px]:leading-6">
                      Now live on
                    </span>
                    <span className="inline-flex h-[18px] w-5 shrink-0 items-center justify-center">
                      <Image
                        alt=""
                        aria-hidden="true"
                        className="h-[18px] w-5"
                        height={18}
                        src="/icons/knowhere/openclaw-icon.svg"
                        width={20}
                      />
                    </span>
                    <span className="text-[14px] font-bold leading-[22px] tracking-[-1px] text-[#e7000b] min-[769px]:text-base min-[769px]:leading-6">
                      OpenClaw
                    </span>
                    <span
                      className={cn(
                        "text-[14px] font-normal leading-[22px] tracking-[-0.5px] text-zinc-600 min-[769px]:text-base min-[769px]:leading-6 font-sans"
                      )}
                    >
                      with an installable plugin and skill.
                    </span>
                  </div>
                </div>
                <div className="w-px shrink-0 bg-zinc-200 max-[639px]:hidden" />
                <Link
                  href="/claw"
                  className="flex min-w-[129px] items-center justify-center px-5 py-4 text-[#7008e7] transition-colors hover:bg-[#f5f3ff] min-[769px]:min-w-[168px] max-[639px]:min-w-0 max-[639px]:justify-center max-[639px]:rounded-full max-[639px]:px-4 max-[639px]:py-1.5"
                >
                  <span className="flex items-center gap-2">
                    <span className={cn("text-[16px] font-[600] leading-7", monoDisplayClassName)}>
                      EXPLOR
                    </span>
                    <KnowhereIcon className="size-3 text-current" name="arrow-outward" />
                  </span>
                </Link>
              </div>

              <div className="flex flex-col items-center gap-8">
                <div className="flex flex-col items-center gap-4 pt-6 text-center max-[639px]:gap-5 max-[639px]:pt-0">
                  <h1
                    className={cn(
                      "max-w-[640px] text-[32px] font-bold leading-[1.2] tracking-[-1px] text-zinc-950 max-[639px]:max-w-[335px] max-[639px]:text-[22px] max-[639px]:leading-[1.2] min-[769px]:max-w-[880px] min-[769px]:text-[36px]",
                      monoDisplayClassName
                    )}
                  >
                    Transform unstructured documents into{" "}
                    <span className="text-[#4f39f6]">clean</span>,{" "}
                    <span className="text-[#a800b7]">structured</span> data.
                  </h1>
                  <p
                    className={cn(
                      "max-w-[640px] text-base font-normal leading-[1.5] tracking-[-0.5px] text-zinc-600 max-[639px]:max-w-[320px] max-[639px]:leading-[1.5] min-[769px]:max-w-[780px] min-[769px]:text-[18px] font-sans"
                    )}
                  >
                    Extract tables, formulas, and layouts with pixel-perfect precision.
                  </p>
                </div>
              </div>

              <div className="flex flex-row items-center justify-center gap-2 max-[639px]:flex-col max-[639px]:gap-3">
                <ActionLink href="/login" className={cn(mobileActionLinkClassName, "w-fit")}>
                  Start Free Trial
                </ActionLink>
                <ActionLink
                  external
                  href="https://docs.knowhereto.ai/"
                  variant="secondary"
                  className={cn(mobileActionLinkClassName, "w-fit")}
                >
                  View Docs
                </ActionLink>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-zinc-200 max-[639px]:grid-cols-1 max-[639px]:divide-x-0 max-[639px]:divide-y">
            <StatsItem
              icon={
                <Image
                  alt=""
                  aria-hidden
                  className="size-5"
                  height={20}
                  src="/icons/landing/stats/1.svg"
                  width={20}
                />
              }
              leading="No Card"
              trailing="Required"
              leadingClassName="font-bold"
            />
            <StatsItem
              icon={
                <Image
                  alt=""
                  aria-hidden
                  className="size-5"
                  height={20}
                  src="/icons/landing/stats/2.svg"
                  width={20}
                />
              }
              leading="99.8%"
              trailing="Accuracy"
              leadingClassName="font-bold"
            />
            <StatsItem
              icon={
                <Image
                  alt=""
                  aria-hidden
                  className="size-5"
                  height={20}
                  src="/icons/landing/stats/3.svg"
                  width={20}
                />
              }
              leading="<200ms"
              trailing="Speed"
              leadingClassName="font-bold"
            />
          </div>

          <HeroPlayground />
        </section>

        <section
          className={cn(
            sectionFrameClassName,
            "grid grid-cols-2 gap-x-[46px] gap-y-[18px] pb-[56px] pt-[56px] max-[639px]:grid-cols-1 max-[639px]:gap-6 max-[639px]:pb-[38px] max-[639px]:pt-[38px] min-[640px]:max-[767px]:grid-cols-1 min-[640px]:max-[767px]:gap-y-8 min-[640px]:max-[767px]:pb-[54px] min-[640px]:max-[767px]:pt-[54px] min-[769px]:gap-x-12 min-[769px]:gap-y-5",
            sectionPaddingClassName,
            "border-y border-zinc-200"
          )}
        >
          <div className="flex flex-col items-start gap-8 max-[639px]:gap-6">
            <SectionTitle title="Supported Formats" className="px-0" />
            <div className="flex flex-wrap gap-x-1.5 gap-y-1 min-[769px]:gap-1.5">
              {supportedFormats.map((chip) => (
                <div
                  key={chip.label}
                  className="relative overflow-hidden border px-3 py-2 max-[639px]:px-[10px] max-[639px]:py-1 min-[640px]:max-[767px]:px-[10px] min-[640px]:max-[767px]:py-1.5"
                  style={{ backgroundColor: chip.tone.background, borderColor: chip.tone.border }}
                >
                  <div
                    className="absolute inset-0 opacity-50"
                    style={stripePattern(chip.tone.border, 1, 10)}
                  />
                  <span
                    className={cn("relative text-[18px] leading-6", monoDisplayClassName)}
                    style={{ color: chip.tone.text }}
                  >
                    {chip.label}
                  </span>
                  <CornerLines color={chip.tone.border} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8 pt-1 max-[639px]:gap-6 max-[639px]:pt-0 min-[640px]:max-[767px]:pt-0">
            <h3 className="text-base font-normal leading-6 text-zinc-950">Comming soon</h3>
            <div className="flex flex-wrap gap-x-1.5 gap-y-1 min-[769px]:gap-1.5">
              {comingSoonFormats.map((chip) => (
                <div
                  key={chip.label}
                  className="relative overflow-hidden border px-3 py-2 max-[639px]:px-[10px] max-[639px]:py-1 min-[640px]:max-[767px]:px-[10px] min-[640px]:max-[767px]:py-1.5"
                  style={{ backgroundColor: chip.tone.background, borderColor: chip.tone.border }}
                >
                  <div
                    className="absolute inset-0 opacity-35"
                    style={stripePattern("#e4e4e7", 1, 10)}
                  />
                  <span
                    className={cn("relative text-[18px] leading-6", monoDisplayClassName)}
                    style={{ color: chip.tone.text }}
                  >
                    {chip.label}
                  </span>
                  <CornerLines color="#d4d4d8" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={cn(sectionFrameClassName, "border-t border-zinc-200")}>
          <div
            className={cn(
              "flex flex-col gap-9 pt-14 max-[639px]:gap-6 max-[639px]:pt-9 border-b border-zinc-200"
            )}
          >
            <SectionTitle
              description="Real-world comparisons showing why developers choose Knowhere API"
              title="Integrate In Minutes"
            />

            <div className="grid grid-cols-2 gap-0 border-t border-zinc-100 max-[639px]:grid-cols-1 max-[639px]:gap-4 max-[639px]:pl-[18px] max-[639px]:pr-[18px] min-[640px]:max-[767px]:grid-cols-1 min-[640px]:max-[767px]:gap-6 min-[640px]:max-[767px]:pl-[46px] min-[640px]:max-[767px]:pr-[46px] min-[769px]:pl-[48px] min-[769px]:pr-0">
              <div className="flex min-w-0 flex-col justify-center py-6 pr-12 max-[639px]:pr-0 min-[640px]:max-[767px]:pr-0">
                {integrationSteps.map((step) => (
                  <div key={step.number} className="flex w-full min-w-0 items-start gap-5 py-4">
                    <NumberBadge number={step.number} />
                    <div className="flex min-w-0 flex-1 flex-col gap-1 pr-1">
                      <h3 className="text-base font-bold leading-6 text-zinc-950">{step.title}</h3>
                      <p className="w-full max-w-full text-sm leading-5 text-zinc-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <IntegrateCodePanel />
            </div>
          </div>
        </section>

        <section
          className={cn(sectionFrameClassName, "scroll-mt-20 bg-[#fffbeb] p-0")}
          id="comparison"
        >
          <div className="flex flex-col gap-[36px] pb-0 pl-[48px] pr-[48px] pt-[56px] max-[639px]:gap-[30px] max-[639px]:pl-[18px] max-[639px]:pr-[18px] max-[639px]:pt-[38px] min-[640px]:max-[767px]:gap-[34px] min-[640px]:max-[767px]:pl-[46px] min-[640px]:max-[767px]:pr-[46px] min-[640px]:max-[767px]:pt-[54px] min-[769px]:gap-[36px] min-[769px]:pl-[48px] min-[769px]:pr-[48px] min-[769px]:pt-[56px]">
            <SectionTitle
              description="Our API is designed to be intuitive and easy to use. Whether you're using Python, Node.js, or raw cURL, you can get started with just a few lines of code."
              descriptionClassName="text-[#ff8904]"
              title="How We Compare"
              className="px-0 max-[639px]:px-0 min-[640px]:max-[767px]:px-0"
            />

            <div className="flex flex-col gap-2">
              {comparisonHighlights.map((item) => (
                <HighlightRow key={item} text={item} />
              ))}
            </div>

            <ComparisonShowcase />
          </div>
        </section>

        <section className={cn(sectionFrameClassName, "border-y border-zinc-200")}>
          <div className="flex flex-col pt-[56px] pb-[14px] gap-[36px] min-[640px]:max-[767px]:pt-[54px] min-[640px]:max-[767px]:pb-[12px] min-[640px]:max-[767px]:gap-[34px] max-[639px]:pt-[38px] max-[639px]:pb-[18px] max-[639px]:gap-[30px]">
            <SectionTitle
              description="Knowhere outperforms major competitors in key metrics"
              title={
                <>
                  Why Choose <span className="text-[#7f22fe]">Knowhere</span>
                </>
              }
            />
            <WhyChooseShowcase />
          </div>
        </section>

        <section className={cn(sectionFrameClassName, "border-y border-zinc-200")}>
          <div className="flex flex-col pt-[56px] gap-[36px] min-[640px]:max-[767px]:pt-[54px] min-[640px]:max-[767px]:gap-[34px] max-[639px]:pt-[38px] max-[639px]:gap-[30px]">
            <SectionTitle
              description="Enterprise-grade features designed to handle the most complex document parsing scenarios"
              title={
                <>
                  Built For Every <span className="text-[#7f22fe]">Document Challenge</span>
                </>
              }
            />
          </div>

          <div className="mt-9 grid grid-cols-2 border-y border-zinc-100 max-[639px]:mt-6 max-[639px]:grid-cols-1">
            {challengeCards.map((card, index) => (
              <div
                key={card.title}
                className={cn(
                  "relative border-b border-l border-zinc-100 px-12 py-8 min-[769px]:px-12 min-[769px]:py-10 max-[639px]:px-4",
                  index % 2 === 1 && "border-r border-zinc-100"
                )}
              >
                <div
                  className="absolute inset-0 opacity-35"
                  style={stripePattern("#f4f4f5", 1, 8)}
                />
                <div className="relative flex h-full flex-col gap-[20px] max-[639px]:gap-[12px] min-[640px]:max-[767px]:gap-[18px]">
                  <div
                    className="flex size-10 items-center justify-center border"
                    style={{
                      backgroundColor: card.tone.background,
                      borderColor: card.tone.border,
                    }}
                  >
                    <ChallengeIcon card={card} />
                  </div>
                  <div className="flex max-w-[360px] flex-col gap-[6px] max-[639px]:gap-[4px] min-[640px]:max-[767px]:gap-[4px]">
                    <h3 className="text-base font-bold leading-6 text-zinc-950">{card.title}</h3>
                    <p className="text-sm leading-5 text-zinc-500">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={sectionFrameClassName}>
          <div className="flex flex-col gap-12 pb-[56px] pt-[56px] max-[639px]:gap-9 max-[639px]:pb-[38px] max-[639px]:pt-[38px] min-[640px]:max-[767px]:gap-9 min-[640px]:max-[767px]:pb-[54px] min-[640px]:max-[767px]:pt-[54px] min-[769px]:pb-[56px] min-[769px]:pt-[56px]">
            <SectionTitle
              description="Our intelligent pipeline processes documents through multiple stages to deliver perfect results"
              descriptionClassName="text-zinc-600"
              title={
                <>
                  Watch Your Data <span className="text-[#7f22fe]">Transform</span>
                </>
              }
            />

            <div className="grid grid-cols-2 gap-12 border-y border-zinc-100 max-[639px]:grid-cols-1 max-[639px]:gap-8 max-[639px]:pl-[18px] max-[639px]:pr-[18px] min-[640px]:max-[767px]:grid-cols-1 min-[640px]:max-[767px]:gap-8 min-[640px]:max-[767px]:pl-[46px] min-[640px]:max-[767px]:pr-[46px] min-[769px]:gap-16 min-[769px]:pl-[48px] min-[769px]:pr-[48px]">
              <div className="relative flex flex-col gap-[24px]">
                {transformSteps.map((step, index) => (
                  <div key={step.number} className="relative">
                    <TransformStepCard step={step} />
                    {index < transformSteps.length - 1 ? (
                      <span className="absolute left-5 top-full flex h-[24px] w-2 items-center justify-center text-sm text-[#a684ff]">
                        :
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-px">
                {transformMetrics.map((metric) => (
                  <MetricPanel key={metric.label} card={metric} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className={cn(sectionFrameClassName, "scroll-mt-20 bg-[#fdf2f8] m-0 p-0")}
          id="pricing"
        >
          <div className="flex flex-col gap-[36px] pb-0 pt-[56px] max-[639px]:gap-[30px] max-[639px]:pt-[38px] min-[640px]:max-[767px]:gap-[34px] min-[640px]:max-[767px]:pt-[54px] min-[769px]:gap-[36px] min-[769px]:pt-[56px] border-y border-zinc-200">
            <div
              className={cn(
                "flex flex-col items-center gap-3 text-center",
                sectionPaddingClassName
              )}
            >
              <h2 className="text-left text-[30px] font-bold leading-9 text-zinc-950 max-[639px]:text-[22px] max-[639px]:leading-8">
                <span className="text-[#510424]">Simple, </span>
                <span className="text-[#e60076]">Transparent Pricing</span>
              </h2>
              <p className="text-base leading-6 text-[#a3004c]">
                Pay only for what you use. No hidden fees, no complex tiers.
              </p>
            </div>

            <div className="flex flex-col gap-0">
              <div
                className={cn(
                  "grid grid-cols-[298px_1fr] items-center gap-14 pb-12 max-[639px]:grid-cols-1 max-[639px]:justify-items-center max-[639px]:gap-8 max-[639px]:pb-9 min-[769px]:grid-cols-[298px_1fr] min-[769px]:gap-20 min-[769px]:pb-16",
                  sectionPaddingClassName
                )}
              >
                <div className="flex justify-center min-[769px]:justify-start">
                  <PricingBurst />
                </div>
                <div
                  className={cn(
                    "text-left text-[26px] leading-[34px] text-[#861043] max-[639px]:max-w-[260px] max-[639px]:text-center max-[639px]:text-[18px] max-[639px]:leading-7 min-[769px]:text-left min-[769px]:text-[30px] min-[769px]:leading-9 font-sans"
                  )}
                >
                  <p>That&apos;s it. No complex tiers, no hidden fees.</p>
                  <p className="mt-8 max-[639px]:mt-6">
                    Purchase page credits anytime. No minimum, no commitment.
                  </p>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="grid grid-cols-3 border-y border-[#fccee8] max-[639px]:grid-cols-1 min-[769px]:grid-cols-[320px_1fr_1fr]">
                  {pricingExamples.map((example, index) => (
                    <div
                      key={example.label}
                      className={cn(
                        "relative min-h-[100px] border-[#fccee8] px-6 py-6 min-[769px]:px-12",
                        index < pricingExamples.length - 1
                          ? "min-[640px]:border-r max-[639px]:border-b"
                          : ""
                      )}
                    >
                      <div
                        className="absolute inset-0 opacity-40"
                        style={stripePattern("#fccee8", 1, 8)}
                      />
                      <div className="relative flex h-full flex-col items-start justify-center gap-1.5 text-left max-[639px]:items-center max-[639px]:text-center">
                        <span
                          className={cn(
                            "text-[20px] font-semibold leading-7 text-[#f6339a]",
                            accentClassName
                            // anuphanClassName
                          )}
                        >
                          {example.value}
                        </span>
                        <p className="text-sm leading-5 text-[#a3004c] font-sans">
                          {example.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-[256px_1fr] max-[639px]:grid-cols-1 min-[640px]:max-[767px]:grid-cols-1 min-[769px]:grid-cols-[320px_1fr]">
                  <div className="border-r border-[#fccee8] px-6 py-8 max-[639px]:border-b max-[639px]:border-r-0 max-[639px]:px-4 max-[639px]:py-6 min-[640px]:max-[767px]:border-b min-[640px]:max-[767px]:border-r-0 min-[640px]:max-[767px]:px-12 min-[640px]:max-[767px]:py-6 min-[769px]:border-b-0 min-[769px]:border-r min-[769px]:px-12 min-[769px]:py-7">
                    <div className="flex flex-col gap-4 items-start max-[639px]:items-center min-[640px]:max-[767px]:items-center">
                      <h3 className="text-[24px] font-bold leading-8 text-[#510424] max-[639px]:text-[22px] max-[639px]:leading-8 text-left min-[640px]:max-[767px]:text-left">
                        File Size Limits
                      </h3>
                      <p className="max-w-[228px] text-sm leading-5 text-[#f6339a] max-[639px]:max-w-[320px] max-[639px]:text-center min-[640px]:max-[767px]:max-w-none min-[640px]:max-[767px]:text-center">
                        Need higher limits? Contact team{" "}
                        <Link className="text-[#7f22fe]" href="mailto:team@knowhereto.ai">
                          @knowhereto.ai
                        </Link>{" "}
                        for enterprise pricing with custom limits.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 max-[639px]:grid-cols-2">
                    {fileLimits.map((limit, index) => (
                      <div
                        key={limit.format}
                        className={cn(
                          "border-[#fccee8] px-6 py-10 text-center flex flex-col items-center justify-center min-[769px]:min-h-full min-[769px]:gap-[14px] min-[640px]:max-[767px]:h-[120px] min-[640px]:max-[767px]:gap-[12px] max-[639px]:h-[110px] max-[639px]:gap-[10px]",
                          index < fileLimits.length - 1 && "min-[640px]:border-r",
                          index % 2 === 0 && "max-[639px]:border-r",
                          index < 2 && "max-[639px]:border-b"
                        )}
                      >
                        <FormatBadge
                          chip={{ label: limit.format, tone: limit.tone }}
                          value={limit.size}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={sectionFrameClassName}>
          <div
            className={cn(
              "flex flex-col items-start gap-5 pt-20 text-left max-[639px]:items-center max-[639px]:gap-6 max-[639px]:pt-9 max-[639px]:text-center",
              sectionPaddingClassName
            )}
          >
            <div className="flex flex-col items-start gap-2 max-[639px]:items-center">
              <div className="flex flex-wrap items-center gap-4 max-[639px]:flex-col max-[639px]:justify-center max-[639px]:gap-3">
                <div className="relative overflow-hidden rounded-[4px] border border-b-[6px] border-[#ddd6ff] bg-[#ede9fe] px-3 pb-2 pt-2">
                  <div
                    className="absolute inset-0 opacity-40"
                    style={stripePattern("#ddd6ff", 1, 8)}
                  />
                  <span className="relative text-[30px] font-bold leading-9 text-[#5d0ec0]">
                    ENTERPRISE
                  </span>
                </div>
                <h2 className="text-left text-[30px] font-bold leading-9 text-zinc-950 max-[639px]:text-[22px] max-[639px]:leading-8">
                  Need Custom <span className="text-[#7f22fe]">Solutions</span>?
                </h2>
              </div>
              <p className="text-base leading-6 text-zinc-600 max-[639px]:max-w-[330px]">
                Get custom limits, SLAs, and dedicated support for your enterprise needs.
              </p>
            </div>
            <div className="flex justify-center min-[769px]:justify-start">
              <ActionLink
                href="mailto:team@knowhereto.ai"
                className={mobileActionLinkClassName}
                external
              >
                Contact Sales
              </ActionLink>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 border-t border-zinc-100 px-12 py-7 max-[639px]:mt-5 max-[639px]:px-5 max-[639px]:py-2.5">
            {enterpriseItems.map((item) => (
              <EnterpriseCheckItem key={item} label={item} />
            ))}
          </div>
        </section>

        <section className={sectionFrameClassName}>
          <div className="flex flex-col gap-9 py-14 max-[639px]:gap-6 max-[639px]:py-9 border-y border-zinc-200">
            <SectionTitle
              title={
                <>
                  Frequently Asked <span className="text-[#7f22fe]">Questions</span>
                </>
              }
            />
            <div className="flex flex-col border-x border-zinc-100 max-[639px]:border-x-0">
              {faqItems.map((faq) => (
                <FaqRow key={faq.question} answer={faq.answer} question={faq.question} />
              ))}
            </div>
          </div>
        </section>

        <section
          className={cn(
            sectionFrameClassName,
            "py-[56px] text-center min-[640px]:max-[767px]:py-[54px] max-[639px]:py-[38px]"
          )}
        >
          <div
            className={cn(
              "flex flex-col items-center gap-[36px] min-[640px]:max-[767px]:gap-[34px] max-[639px]:gap-[30px]",
              sectionPaddingClassName
            )}
          >
            <SectionTitle
              className="items-center"
              description="Join thousands of developers building AI agents with the most accurate document parsing API"
              descriptionClassName="max-w-[980px] text-center text-base leading-6 text-zinc-600 max-[639px]:max-w-[320px]"
              title={
                <>
                  Ready To Get <span className="text-[#7f22fe]">Started</span>?
                </>
              }
            />

            <div className="flex flex-row items-center justify-center gap-2 max-[639px]:flex-col max-[639px]:gap-3">
              <ActionLink href="/login" className={cn(mobileActionLinkClassName, "w-fit")}>
                Start Free Trial
              </ActionLink>
              <ActionLink
                href="mailto:team@knowhereto.ai"
                variant="secondary"
                className={cn(mobileActionLinkClassName, "w-fit")}
                external
              >
                Book A Demo
              </ActionLink>
            </div>

            <div className="flex w-full flex-col items-center gap-[8px] pb-[8px]">
              <FooterChip color="#fb2c36">No credit card required</FooterChip>
              <FooterChip color="#efb100">Free 14-day trial</FooterChip>
              <FooterChip color="#00c951">Cancel anytime</FooterChip>
            </div>
          </div>
        </section>
      </main>

      <footer
        className={cn(
          "mx-auto flex w-full flex-row items-center justify-between gap-3 border border-zinc-200 bg-[#fafafa] text-left max-[639px]:flex-col max-[639px]:text-center min-[768px]:max-w-[768px] min-[769px]:max-w-[976px]",
          footerPaddingClassName
        )}
      >
        <LandingBrand size="header" />
        <p className="text-xs leading-4 text-zinc-400">© 2026 Knowhere API. All rights reserved.</p>
      </footer>
    </div>
  );
};
