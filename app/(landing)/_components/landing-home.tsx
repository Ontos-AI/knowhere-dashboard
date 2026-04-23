import { LandingBrand } from "@app/(landing)/_components/landing-brand";
import {
  type ChallengeCard,
  type ComparisonStatus,
  challengeCards,
  comingSoonFormats,
  comparisonHighlights,
  comparisonRows,
  comparisonTabs,
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
  whyChooseBenefits,
} from "@app/(landing)/_components/landing-home-data";
import { LandingThemeToggle } from "@app/(landing)/_components/landing-theme-toggle";
import { LandingUnstructuredBrand } from "@app/(landing)/_components/landing-unstructured-brand";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import { cn } from "@lib/utils";
import {
  Bot,
  Braces,
  Check,
  CheckCircle2,
  CreditCard,
  Files,
  Minus,
  Plus,
  SearchCheck,
  ServerCog,
  Sigma,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

const sectionFrameClassName = "overflow-hidden border border-zinc-200 bg-[#fafafa]";
const sectionPaddingClassName = "px-5 xs:px-[18px] sm:px-16";
const heroSectionPaddingClassName = "px-5 xs:px-5 sm:px-[62px] md:px-[62px] lg:px-16";
const landingHeaderCanvasWidthClassName =
  "mx-auto flex h-12 w-full max-w-[260px] items-center xs:max-w-none lg:h-16 2xl:max-w-[1536px]";
const landingCanvasWidthClassName = "w-full max-w-[260px] xs:max-w-none 2xl:max-w-[1280px]";
const footerPaddingClassName = "p-5 xs:p-5 sm:px-[62px] sm:py-8 md:px-16";
const comparisonTableGridClassName =
  "min-w-[720px] grid grid-cols-[1.35fr_0.9fr_0.9fr] lg:min-w-[860px]";
const monoDisplayClassName = "font-[family-name:var(--font-mono-display)]";
const monoReadableClassName = "font-[family-name:var(--font-mono-readable)]";
const accentClassName = "font-[family-name:var(--font-accent)]";
const mobileActionLinkClassName = "h-[52px] px-7 text-xl";

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

const processCardIconAssetMap = {
  doc: "/icons/knowhere/process-document.svg",
} as const;

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
      ? "border border-b-[6px] border-[#7f22fe] bg-[#8e51ff] pb-1 text-[#f5f3ff]"
      : "border-x-2 border-t-2 border-b-[6px] border-zinc-200 bg-[#fafafa] pb-1 text-zinc-800";

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-transform hover:-translate-y-0.5",
        monoDisplayClassName,
        sizeClassName,
        variantClassName,
        className
      )}
      rel={external ? "noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      <span className="font-semibold">{children}</span>
    </Link>
  );
};

const ProcessCardIcon = ({
  name,
  className,
}: {
  name: "doc" | "api" | "json";
  className?: string;
}) => {
  if (name !== "doc") {
    return <KnowhereIcon className={className} name={name} />;
  }

  return (
    <span
      aria-hidden="true"
      className={cn("inline-block size-5 shrink-0 align-middle", className)}
      style={{
        backgroundColor: "currentColor",
        WebkitMaskImage: `url("${processCardIconAssetMap.doc}")`,
        maskImage: `url("${processCardIconAssetMap.doc}")`,
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
};

const HeaderLink = ({
  href,
  children,
  active = false,
}: {
  href: string;
  children: ReactNode;
  active?: boolean;
}) => (
  <Link
    href={href}
    className={cn(
      "relative flex h-12 items-center justify-center px-4 text-sm leading-5 text-zinc-950 transition-colors hover:bg-zinc-100/70 lg:h-16",
      active
        ? "font-semibold after:absolute after:bottom-[9px] after:left-4 after:right-4 after:h-px after:bg-zinc-950 lg:after:bottom-[13px]"
        : "font-light"
    )}
  >
    {children}
  </Link>
);

const SectionTitle = ({
  title,
  accent,
  description,
  className,
  descriptionClassName,
}: {
  title: ReactNode;
  accent?: ReactNode;
  description?: ReactNode;
  className?: string;
  descriptionClassName?: string;
}) => (
  <div className={cn("flex flex-col gap-3", className)}>
    <h2 className="text-[24px] font-bold leading-8 tracking-normal text-zinc-950 sm:text-[36px] sm:leading-10">
      {title}
      {accent ? <span className="text-[#7f22fe]"> {accent}</span> : null}
    </h2>
    {description ? (
      <p
        className={cn(
          "max-w-[1080px] text-base leading-6 text-zinc-500 sm:text-xl sm:leading-7",
          descriptionClassName
        )}
      >
        {description}
      </p>
    ) : null}
  </div>
);

const ProcessCard = ({
  icon,
  title,
  caption,
  className,
}: {
  icon: "doc" | "api" | "json";
  title: string;
  caption: string;
  className?: string;
}) => (
  <div
    className={cn(
      "relative flex shrink-0 flex-col overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100",
      className
    )}
  >
    <div
      className="absolute bottom-[-1px] left-[-1px] right-[-1px] h-[50px] opacity-40"
      style={stripePattern("#d4d4d8", 1, 9)}
    />
    <div className="relative z-10 flex h-[55px] w-full items-center justify-center gap-[14px] border-b border-zinc-200 bg-[#fafafa] px-6 sm:h-[70px] sm:gap-3 sm:px-10 lg:h-[78px]">
      <ProcessCardIcon className="size-5 text-zinc-950" name={icon} />
      <span
        className={cn(
          "whitespace-nowrap text-[20px] font-normal leading-7 tracking-normal text-zinc-950 xs:text-[14px] xs:leading-[18px] sm:text-[20px] sm:leading-7",
          monoDisplayClassName
        )}
      >
        {title}
      </span>
    </div>
    <div className="relative z-10 flex flex-1 items-center justify-center">
      <span
        className={cn(
          "whitespace-nowrap text-base font-medium leading-6 tracking-normal text-zinc-400 xs:text-[12px] xs:leading-[14px] sm:text-base sm:leading-6",
          monoDisplayClassName
        )}
      >
        {caption}
      </span>
    </div>
  </div>
);

const StatsItem = ({
  icon,
  leading,
  trailing,
}: {
  icon: ReactNode;
  leading: string;
  trailing: string;
}) => (
  <div className="flex h-16 items-center justify-center gap-4 px-4 xs:px-16 sm:h-20 sm:px-16 md:justify-start md:px-8 lg:px-16">
    <div className="flex size-6 items-center justify-center text-[#8e51ff]">{icon}</div>
    <div className={cn("flex items-center gap-3 text-lg leading-7", monoDisplayClassName)}>
      <span className="font-medium text-zinc-800">{leading}</span>
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
      className="relative overflow-hidden border px-3 py-1.5 sm:px-4 sm:py-2"
      style={{
        backgroundColor: chip.tone.background,
        borderColor: chip.tone.border,
      }}
    >
      <div className="absolute inset-0 opacity-40" style={stripePattern(chip.tone.border, 1, 10)} />
      <span
        className={cn("relative text-2xl leading-8", monoDisplayClassName)}
        style={{ color: chip.tone.text }}
      >
        {chip.label}
      </span>
      <CornerLines color={muted ? "#d4d4d8" : chip.tone.border} />
    </div>
    {value ? (
      <span className={cn("text-2xl leading-8 text-[#e60076]", monoDisplayClassName)}>{value}</span>
    ) : null}
  </div>
);

const NumberBadge = ({ number }: { number: string }) => (
  <div className="relative flex size-12 items-center justify-center overflow-hidden border border-[#ddd6ff] border-r-4 border-b border-l border-t-0 bg-[#ede9fe] text-[#a684ff]">
    <span className={cn("text-lg font-bold leading-7", monoDisplayClassName)}>{number}</span>
  </div>
);

const HighlightRow = ({ text }: { text: string }) => {
  const [metric, ...parts] = text.split(" ");

  return (
    <div className="flex items-center justify-between border border-[#fde68a] bg-[#fffbeb]">
      <div className="flex min-h-[72px] flex-1 items-center">
        <div className="relative flex min-h-[72px] w-[115px] flex-none items-center justify-center overflow-hidden border-r border-[#fde68a] bg-[#fff7db]">
          <div className="absolute inset-0 opacity-50" style={dotPattern("#fde68a")} />
          <span
            className={cn(
              "relative text-[30px] font-bold leading-9 text-[#ea580c]",
              monoDisplayClassName
            )}
          >
            {metric}
          </span>
        </div>
        <div className={cn("px-5 py-4 text-[20px] leading-7 text-[#ea580c]", monoDisplayClassName)}>
          {parts.join(" ")}
        </div>
      </div>
      <div className="flex h-full items-center justify-center px-4 text-[#f7b955] xs:px-5">
        <Plus className="size-5" />
      </div>
    </div>
  );
};

const ComparisonIndicator = ({ status }: { status: ComparisonStatus }) => {
  const map = {
    yes: {
      icon: <CheckCircle2 className="size-4" />,
      label: "Yes",
      color: "#10b981",
    },
    bad: {
      icon: <Minus className="size-4" />,
      label: "Bad",
      color: "#f59e0b",
    },
    no: {
      icon: <X className="size-4" />,
      label: "No",
      color: "#fb2c36",
    },
  } as const;

  const item = map[status];

  return (
    <span className="inline-flex items-center justify-center gap-2" style={{ color: item.color }}>
      {item.icon}
      <span className="text-base font-semibold leading-6">{item.label}</span>
    </span>
  );
};

const ChallengeIcon = ({ card }: { card: ChallengeCard }) => {
  const className = "size-5";
  const color = card.tone.text;

  switch (card.icon) {
    case "agentic":
      return <Bot className={className} style={{ color }} />;
    case "formula":
      return <Sigma className={className} style={{ color }} />;
    case "format":
      return <Files className={className} style={{ color }} />;
    case "trace":
      return <SearchCheck className={className} style={{ color }} />;
    case "deploy":
      return <ServerCog className={className} style={{ color }} />;
    case "api":
      return <Braces className={className} style={{ color }} />;
  }
};

const TransformStepCard = ({ step }: { step: TransformStep }) => (
  <div
    className="relative flex w-full flex-col overflow-hidden border"
    style={{
      backgroundColor: "#fafafa",
      borderColor: step.tone.border,
    }}
  >
    <div className="flex items-center gap-6 px-5 py-[14px]">
      <div
        className="flex h-12 w-12 flex-none items-center justify-center text-lg font-bold leading-7"
        style={{ backgroundColor: step.tone.text, color: "#fafafa" }}
      >
        <span className={monoDisplayClassName}>{step.number}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span
          className={cn("text-base font-bold leading-6 text-zinc-950", monoDisplayClassName)}
          style={{ color: step.tone.text }}
        >
          {step.title}
        </span>
        <span className={cn("text-base leading-6 text-zinc-500", monoDisplayClassName)}>
          {step.description}
        </span>
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
    className="flex min-h-[188px] flex-col items-center justify-center border px-6 text-center"
    style={{
      backgroundColor: card.tone.background,
      borderColor: card.tone.border,
      ...cardStripePattern(card.tone.border),
    }}
  >
    <span
      className={cn("text-[36px] font-semibold leading-10", monoReadableClassName)}
      style={{ color: card.tone.text }}
    >
      {card.value}
    </span>
    <span
      className={cn("mt-4 text-sm leading-5", monoDisplayClassName)}
      style={{ color: card.tone.text }}
    >
      {card.label}
    </span>
  </div>
);

const PricingBurst = () => (
  <div className="relative flex size-[190px] items-center justify-center sm:size-[298px]">
    <div
      className="absolute inset-0 bg-[#e60076]"
      style={{
        clipPath:
          "polygon(50% 0%, 62% 10%, 77% 5%, 82% 20%, 97% 18%, 94% 33%, 100% 50%, 90% 60%, 97% 77%, 82% 80%, 77% 95%, 62% 90%, 50% 100%, 38% 90%, 23% 95%, 18% 80%, 3% 77%, 10% 60%, 0% 50%, 6% 33%, 3% 18%, 18% 20%, 23% 5%, 38% 10%)",
      }}
    />
    <div className="absolute inset-3 opacity-25 sm:inset-[18px]" style={dotPattern("#fdf2f8")} />
    <div className="-rotate-[15deg] text-center text-[#fdf2f8]">
      <div
        className={cn(
          "text-[54px] font-extrabold leading-[54px] sm:text-[72px] sm:leading-[72px]",
          accentClassName
        )}
      >
        $1.5
      </div>
      <div
        className={cn(
          "mt-2 text-sm font-light leading-5 sm:mt-3 sm:text-base",
          monoDisplayClassName
        )}
      >
        per 1,000 pages
      </div>
    </div>
  </div>
);

const EnterpriseCheckItem = ({ label }: { label: string }) => (
  <div className="flex items-center gap-4 py-3 sm:gap-6">
    <div className="flex size-8 items-center justify-center rounded-full border border-[#009966] border-r-4 bg-[#00bc7d] text-white sm:size-12">
      <Check className="size-5 stroke-[3]" />
    </div>
    <span className="text-base font-semibold leading-7 text-zinc-950 sm:text-lg">{label}</span>
  </div>
);

const FaqRow = ({ question, answer }: { question: string; answer: string }) => (
  <div className="flex items-start gap-4 border border-zinc-100 px-5 py-6 xs:gap-6 xs:px-6 xs:py-6 md:px-16">
    <div className="flex size-8 flex-none items-center justify-center border border-[#ddd6ff] border-r-[3px] bg-[#ede9fe] text-[#a684ff] xs:size-12 xs:border-r-4">
      <span
        className={cn(
          "text-2xl font-black leading-6 xs:text-[30px] xs:leading-7",
          monoDisplayClassName
        )}
      >
        ?
      </span>
    </div>
    <div className="flex flex-col gap-1">
      <h3 className="text-xl font-semibold leading-7 text-zinc-950 sm:text-2xl sm:leading-8">
        {question}
      </h3>
      <p className="text-base leading-7 text-zinc-700">{answer}</p>
    </div>
  </div>
);

const FooterChip = ({ color, children }: { color: string; children: string }) => (
  <p
    className={cn(
      "text-sm leading-[18px] text-zinc-950 sm:text-xl sm:leading-7",
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
      <header className="w-full border-b border-zinc-200 bg-[#fafafa]">
        <div className={landingHeaderCanvasWidthClassName}>
          <div className="flex h-full w-32 flex-none items-center border-r-0 px-4 sm:border-r sm:border-zinc-200">
            <Link href="/" className="flex h-full w-full items-center">
              <LandingBrand size="header" className="mx-0 sm:hidden" />
              <LandingBrand size="nav" className="mx-0 hidden sm:flex lg:hidden" />
              <LandingBrand className="mx-0 hidden lg:flex" />
            </Link>
          </div>
          <div className="hidden min-w-0 flex-1 items-center justify-between pl-2 sm:flex">
            <nav className="flex h-full items-center">
              <HeaderLink href="#comparison" active>
                Comparison
              </HeaderLink>
              <HeaderLink href="#pricing">Pricing</HeaderLink>
              <HeaderLink href="https://docs.knowhereto.ai/">Docs</HeaderLink>
            </nav>
            <div className="ml-auto hidden items-center lg:flex">
              <div className="flex h-16 items-center justify-center gap-1 pl-4 pr-3 text-sm text-zinc-950">
                <span>English</span>
                <KnowhereIcon className="size-5 text-current" name="chevron-down" />
              </div>
              <LandingThemeToggle className="flex" />
            </div>
          </div>
          <div className="ml-auto flex h-full items-center sm:ml-0 lg:hidden">
            <LandingThemeToggle className="flex h-full w-[52px] sm:hidden" />
            <span className="flex h-full w-[52px] items-center justify-center text-zinc-950">
              <KnowhereIcon className="size-5 text-current" name="menu" />
            </span>
          </div>
          <ActionLink
            href="/login"
            size="sm"
            className="hidden h-full w-32 flex-none rounded-none px-0 text-base sm:inline-flex"
          >
            GET API KEY
          </ActionLink>
        </div>
      </header>

      <main className={cn("mx-auto flex flex-col [&>*+*]:-mt-px", landingCanvasWidthClassName)}>
        <section className={sectionFrameClassName}>
          <div className="border-b border-[#ede9fe] bg-[#f5f3ff] pb-10 pt-4 sm:pb-16 sm:pt-10 md:py-16">
            <div
              className={cn(
                "flex flex-col items-center gap-7 xs:gap-8 sm:gap-12",
                heroSectionPaddingClassName
              )}
            >
              <div className="flex w-full max-w-[934px] flex-col items-center overflow-hidden rounded-lg border border-zinc-200 bg-white px-5 py-3 sm:flex-row sm:items-center sm:gap-[18px] sm:px-0 sm:py-0 sm:pl-[30px] md:max-w-[644px] md:gap-0 md:pl-0 lg:max-w-[896px] xl:max-w-[934px]">
                <div className="flex w-full px-6 max-w-[188px] flex-wrap items-start justify-center gap-x-2 gap-y-1.5 py-[14px] text-center sm:w-[319px] sm:max-w-none sm:flex-none sm:justify-start sm:py-6 sm:text-left md:flex-1 md:py-[22px] lg:gap-y-2 lg:py-6">
                  <span
                    className={cn(
                      "text-sm font-semibold leading-[14px] tracking-[-1px] text-zinc-950 sm:text-base sm:leading-[22px] lg:text-lg lg:leading-6",
                      monoDisplayClassName
                    )}
                  >
                    Now live on
                  </span>
                  <span className="inline-flex size-4 items-center justify-center text-[#e7000b] sm:size-[18px]">
                    <Sparkles className="size-4 fill-current stroke-current" />
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold leading-[14px] tracking-[-1px] text-[#e7000b] sm:text-base sm:leading-[22px] lg:text-lg lg:leading-6",
                      monoDisplayClassName
                    )}
                  >
                    OpenClaw
                  </span>
                  <span
                    className={cn(
                      "mx-auto basis-full max-w-[188px] text-sm font-light leading-[18px] tracking-[-0.5px] text-zinc-600 sm:mx-0 sm:max-w-none sm:text-sm sm:leading-[22px] md:text-base lg:text-lg lg:leading-6",
                      monoDisplayClassName
                    )}
                  >
                    with an installable plugin and skill.
                  </span>
                </div>
                <div className="flex items-center justify-center pt-1 sm:h-full sm:w-[149px] sm:flex-none sm:gap-[10px] sm:pt-0 md:w-[171px] lg:w-[193px]">
                  <span className="hidden h-6 w-0 shrink-0 border-l border-zinc-200 sm:block" />
                  <Link
                    href="/claw"
                    className="flex min-w-0 items-center p-2 text-[#7008e7] sm:h-full sm:w-[139px] sm:flex-none md:w-[161px] lg:w-[183px]"
                  >
                    <span className="flex h-full w-full items-center justify-center gap-2 rounded-[4px] px-2 transition-colors hover:bg-[#f5f3ff] sm:pl-5 sm:pr-[14px] md:pl-8 md:pr-6">
                      <span className={cn("text-xl font-medium leading-7", monoDisplayClassName)}>
                        EXPLOR
                      </span>
                      <KnowhereIcon className="size-6 text-current" name="arrow-outward" />
                    </span>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col items-center gap-5 pt-3 text-center sm:gap-6 sm:pt-0">
                <span
                  className={cn(
                    "bg-zinc-200 px-3 py-0.5 text-sm font-light leading-[18px] text-zinc-700 sm:py-1 sm:text-2xl sm:leading-8",
                    monoDisplayClassName
                  )}
                >
                  [ API Platform ]
                </span>
                <h1
                  className={cn(
                    "max-w-[220px] text-[22px] font-bold leading-[1.2] tracking-[-1px] text-zinc-950 xs:max-w-[337px] sm:max-w-[640px] sm:text-[42px] md:text-[48px] lg:max-w-[1150px]",
                    monoDisplayClassName
                  )}
                >
                  Transform unstructured documents into{" "}
                  <span className="text-[#4f39f6]">clean</span>,{" "}
                  <span className="text-[#a800b7]">structured</span> data.
                </h1>
                <p
                  className={cn(
                    "max-w-[220px] text-base font-light leading-[24px] tracking-[-0.5px] text-zinc-600 xs:max-w-[335px] sm:max-w-[640px] sm:text-[22px] sm:leading-[1.5] md:text-2xl md:leading-9 lg:max-w-[1040px]",
                    monoDisplayClassName
                  )}
                >
                  Extract tables, formulas, and layouts with pixel-perfect precision.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-nowrap">
                <ActionLink
                  href="/login"
                  className={cn(mobileActionLinkClassName, "sm:h-[72px] sm:px-9")}
                >
                  Start Free Trial
                </ActionLink>
                <ActionLink
                  href="https://docs.knowhereto.ai/"
                  external
                  variant="secondary"
                  className={cn(mobileActionLinkClassName, "sm:h-[72px] sm:px-9")}
                >
                  View Docs
                </ActionLink>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-hidden border-b border-zinc-200 px-[18px] py-10 xs:px-5 sm:px-16 md:px-[43px] lg:px-16">
            <div className="flex w-max min-w-max flex-row items-center justify-start gap-0 md:min-w-0 md:w-full md:justify-center">
              <ProcessCard
                icon="doc"
                title="Document"
                caption="input"
                className="h-24 w-[143px] max-w-none text-nowrap sm:h-[120px] sm:w-[198px] sm:max-w-[198px] lg:w-[245px] lg:max-w-[245px]"
              />
              <div className="flex h-[98px] w-4 items-center sm:h-[120px] lg:w-auto lg:flex-1">
                <div className="w-full border-t border-dashed border-zinc-300" />
              </div>
              <ProcessCard
                icon="api"
                title="Processing"
                caption="API"
                className="h-[98px] w-[168px] max-w-none text-nowrap sm:h-[120px] sm:w-[226px] sm:max-w-[226px] lg:w-[245px] lg:max-w-[245px]"
              />
              <div className="flex h-[98px] w-4 items-center sm:h-[120px] lg:w-auto lg:flex-1">
                <div className="w-full border-t border-dashed border-zinc-300" />
              </div>
              <ProcessCard
                icon="json"
                title="Clean JOSN"
                caption="output"
                className="h-[98px] w-[168px] max-w-none text-nowrap sm:h-[120px] sm:w-[226px] sm:max-w-[226px] lg:w-[245px] lg:max-w-[245px]"
              />
            </div>
          </div>

          <div className="grid divide-y divide-zinc-200 bg-zinc-100 md:grid-cols-3 md:divide-x md:divide-y-0">
            <StatsItem
              icon={<CreditCard className="size-5" />}
              leading="No Card"
              trailing="Required"
            />
            <StatsItem
              icon={<SearchCheck className="size-5" />}
              leading="99.8%"
              trailing="Accuracy"
            />
            <StatsItem icon={<Zap className="size-5" />} leading="<200ms" trailing="Speed" />
          </div>
        </section>

        <section
          className={cn(
            sectionFrameClassName,
            "grid gap-12 py-16 sm:gap-16 sm:py-20 md:grid-cols-2 md:gap-x-[62px] md:gap-y-16 lg:gap-16",
            sectionPaddingClassName
          )}
        >
          <div className="flex flex-col gap-10">
            <SectionTitle title="Supported Formats" />
            <div className="flex flex-wrap gap-1.5 xs:gap-2">
              {supportedFormats.map((chip) => (
                <div
                  key={chip.label}
                  className="relative overflow-hidden border px-3 py-1.5 sm:px-4 sm:py-2"
                  style={{ backgroundColor: chip.tone.background, borderColor: chip.tone.border }}
                >
                  <div
                    className="absolute inset-0 opacity-50"
                    style={stripePattern(chip.tone.border, 1, 10)}
                  />
                  <span
                    className={cn("relative text-2xl leading-8", monoDisplayClassName)}
                    style={{ color: chip.tone.text }}
                  >
                    {chip.label}
                  </span>
                  <CornerLines color={chip.tone.border} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <SectionTitle title="Comming soon" />
            <div className="flex flex-wrap gap-1.5 xs:gap-2">
              {comingSoonFormats.map((chip) => (
                <div
                  key={chip.label}
                  className="relative overflow-hidden border px-3 py-1.5 sm:px-4 sm:py-2"
                  style={{ backgroundColor: chip.tone.background, borderColor: chip.tone.border }}
                >
                  <div
                    className="absolute inset-0 opacity-35"
                    style={stripePattern("#e4e4e7", 1, 10)}
                  />
                  <span
                    className={cn("relative text-2xl leading-8", monoDisplayClassName)}
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

        <section className={sectionFrameClassName}>
          <div className={cn("flex flex-col gap-12 pt-16 sm:pt-20", sectionPaddingClassName)}>
            <SectionTitle
              title="Integrate In Minutes"
              description="Real-world comparisons showing why developers choose Knowhere API"
            />
          </div>
          <div className="mt-8 grid border-t border-zinc-100 sm:mt-12 lg:grid-cols-[1fr_1.02fr]">
            <div
              className={cn(
                "flex min-w-0 flex-col justify-center py-4 xs:py-6",
                sectionPaddingClassName
              )}
            >
              {integrationSteps.map((step) => (
                <div key={step.number} className="flex w-full min-w-0 items-start gap-6 py-[14px]">
                  <NumberBadge number={step.number} />
                  <div className="flex min-w-0 flex-1 flex-col gap-1 pr-1">
                    <h3 className="text-base font-bold leading-6 text-zinc-950">{step.title}</h3>
                    <p className="w-full max-w-full text-base leading-6 text-zinc-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col justify-center px-5 py-6 xs:px-[18px] sm:px-16">
              <div className="min-w-0 bg-zinc-800 text-zinc-50">
                <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#fafafa] px-3 py-2 text-sm leading-5 text-zinc-950">
                      Python
                    </span>
                    <span className="bg-zinc-700 px-3 py-2 text-sm leading-5 text-zinc-50">
                      CURL
                    </span>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-4 py-2 text-sm leading-5 text-[#a684ff]",
                      monoReadableClassName
                    )}
                  >
                    Copy
                  </span>
                </div>
                <div className="overflow-x-auto px-4 py-4">
                  <pre
                    className={cn(
                      "min-w-0 break-words whitespace-pre-wrap text-sm leading-7 text-zinc-50 xl:min-w-[580px] xl:whitespace-pre",
                      monoReadableClassName
                    )}
                  >
                    <code>
                      <span className="text-[#51a2ff]">import</span> requests{"\n\n"}
                      url ={" "}
                      <span className="text-[#ff6467]">"https://api.knowhereto.ai/v1/jobs"</span>
                      {"\n"}
                      headers = {"{"}
                      {"\n"}
                      {"  "}
                      <span className="text-[#ff6467]">"Authorization"</span>:{" "}
                      <span className="text-[#ff6467]">"Bearer ***REMOVED***"</span>,{"\n"}
                      {"  "}
                      <span className="text-[#ff6467]">"Content-Type"</span>:{" "}
                      <span className="text-[#ff6467]">"application/json"</span>
                      {"\n"}
                      {"}"}
                      {"\n"}
                      payload = {"{"}
                      {"\n"}
                      {"  "}
                      <span className="text-[#ff6467]">"source_type"</span>:{" "}
                      <span className="text-[#ff6467]">"url"</span>,{"\n"}
                      {"  "}
                      <span className="text-[#ff6467]">"source_url"</span>:{" "}
                      <span className="text-[#ff6467]">"https://arxiv.org/pdf/1706.03762.pdf"</span>
                      ,{"\n"}
                      {"  "}
                      <span className="text-[#ff6467]">"parsing_params"</span>: {"{"}
                      {"\n"}
                      {"    "}
                      <span className="text-[#ff6467]">"model"</span>:{" "}
                      <span className="text-[#ff6467]">"base"</span>,{"\n"}
                      {"    "}
                      <span className="text-[#ff6467]">"ocr_enabled"</span>:{" "}
                      <span className="text-[#51a2ff]">True</span>
                      {"\n"}
                      {"  "}
                      {"}"}
                      {"\n"}
                      {"}"}
                      {"\n\n"}
                      response = requests.<span className="text-[#d08700]">post</span>(url,
                      headers=headers, json=payload){"\n"}
                      <span className="text-[#51a2ff]">print</span>(response.
                      <span className="text-[#d08700]">json</span>())
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="comparison"
          className={cn(
            sectionFrameClassName,
            "bg-[#fffbeb] py-16 sm:py-20",
            sectionPaddingClassName
          )}
        >
          <div className="flex flex-col gap-12">
            <SectionTitle
              title="How We Compare"
              description="Our API is designed to be intuitive and easy to use. Whether you're using Python, Node.js, or raw cURL, you can get started with just a few lines of code."
              descriptionClassName="text-[#ff8904]"
            />

            <div className="flex flex-col gap-2">
              {comparisonHighlights.map((item) => (
                <HighlightRow key={item} text={item} />
              ))}
            </div>

            <div className="overflow-x-auto">
              <div className="flex w-max flex-nowrap gap-px">
                {comparisonTabs.map((tab, index) => (
                  <div
                    key={tab}
                    className={cn(
                      "px-4 py-2 text-sm leading-5",
                      monoDisplayClassName,
                      index === 0
                        ? "border-b-4 border-[#d97706] bg-[#ff8904] text-[#fff7db]"
                        : "bg-[#fde68a] text-[#5b3716]"
                    )}
                  >
                    {tab}
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto border border-[#fde68a]">
              <div className={cn(comparisonTableGridClassName, "bg-[#fef3c6]")}>
                <div
                  className={cn(
                    "flex items-center justify-center border-r border-[#fde68a] px-6 py-4 text-sm leading-[18px] text-[#f97316] xs:text-xl xs:leading-8",
                    monoDisplayClassName
                  )}
                >
                  Feature
                </div>
                <div className="relative flex items-center justify-center gap-3 overflow-hidden border-r border-[#fde68a] px-6 py-4">
                  <div
                    className="absolute inset-0 opacity-40"
                    style={stripePattern("#fde68a", 1, 9)}
                  />
                  <div className="relative flex items-center gap-3">
                    <LandingBrand compact />
                  </div>
                </div>
                <div
                  className={cn(
                    "flex items-center justify-center px-6 py-4 text-sm leading-[18px] text-[#f97316] xs:text-xl xs:leading-8",
                    monoDisplayClassName
                  )}
                >
                  Others
                </div>
              </div>

              {comparisonRows.map((row, index) => (
                <div
                  key={row.feature}
                  className={cn(comparisonTableGridClassName, "border-t border-[#fde68a] bg-white")}
                >
                  <div className="relative border-r border-[#fde68a] px-6 py-6">
                    {row.emphasize ? (
                      <div
                        className="absolute inset-0 opacity-30"
                        style={stripePattern("#fde68a", 1, 8)}
                      />
                    ) : null}
                    <div className="relative flex items-center justify-between gap-4">
                      <span
                        className={cn(
                          "text-base leading-6 text-[#92400e] xs:text-[18px] xs:leading-8",
                          monoDisplayClassName
                        )}
                      >
                        {row.feature}
                      </span>
                      {index === 4 || index === 6 ? (
                        <span className="text-[#f59e0b]">
                          <Plus className="size-4" />
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center border-r border-[#fde68a] bg-[#fffbeb] px-6 py-6">
                    <div
                      className="absolute inset-0 opacity-25"
                      style={stripePattern("#fde68a", 1, 8)}
                    />
                    <div className="relative">
                      <ComparisonIndicator status={row.knowhere} />
                    </div>
                  </div>
                  <div className="flex items-center justify-center px-6 py-6">
                    <ComparisonIndicator status={row.others} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={sectionFrameClassName}>
          <div className={cn("flex flex-col gap-12 pt-16 sm:pt-20", sectionPaddingClassName)}>
            <SectionTitle
              title={
                <>
                  Why Choose <span className="text-[#7f22fe]">Knowhere</span>
                </>
              }
              description="Knowhere outperforms major competitors in key metrics"
            />

            <div className="flex flex-wrap gap-px">
              <div
                className={cn(
                  "border-b-4 border-zinc-600 bg-zinc-400 px-4 py-2 text-sm font-bold leading-5 text-zinc-50",
                  monoDisplayClassName
                )}
              >
                Unstructured
              </div>
              <div
                className={cn(
                  "bg-zinc-200 px-4 py-2 text-sm font-light leading-5 text-zinc-950",
                  monoDisplayClassName
                )}
              >
                Markitdown
              </div>
            </div>
          </div>

          <div className="mt-3 grid border-t border-zinc-100 lg:grid-cols-2">
            <div className={cn("flex flex-col gap-8 py-8 xs:py-10", sectionPaddingClassName)}>
              <p className="max-w-[510px] text-sm leading-5 text-zinc-500">
                Unstructured is an open-source document processing tool that provides basic text
                extraction. While functional for simple documents, it struggles with complex table
                structures and loses important semantic information during parsing.
              </p>
              <div className="flex flex-col">
                {whyChooseBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-4 py-3 xs:gap-6">
                    <div className="flex size-8 items-center justify-center rounded-full border border-[#009966] border-r-4 bg-[#00bc7d] text-white xs:size-12">
                      <Check className="size-5 stroke-[3]" />
                    </div>
                    <span className="text-[18px] font-semibold leading-7 text-zinc-950">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-100 lg:border-l lg:border-t-0">
              <div className="flex flex-col items-center gap-8 px-4 pb-10 pt-8 text-center xs:px-6 xs:pb-12 xs:pt-10 md:px-12">
                <h3 className="max-w-[420px] text-sm font-bold leading-5 text-zinc-950">
                  Why Knowhere delivers superior document parsing for complex tables
                </h3>
                <div className="grid w-full sm:grid-cols-2">
                  <div
                    className="flex min-h-[169px] flex-col items-center justify-center border border-zinc-700 bg-zinc-600 text-center text-[#5ee9b5]"
                    style={cardStripePattern("rgba(255,255,255,0.12)")}
                  >
                    <span
                      className={cn("text-[36px] font-semibold leading-10", monoReadableClassName)}
                    >
                      90%+
                    </span>
                    <span
                      className={cn(
                        "mt-3 max-w-[165px] text-sm leading-5 text-zinc-400",
                        monoDisplayClassName
                      )}
                    >
                      Complex Table Parsing Accuracy
                    </span>
                  </div>
                  <div
                    className="flex min-h-[169px] flex-col items-center justify-center border border-zinc-700 bg-zinc-600 text-center text-[#5ee9b5]"
                    style={cardStripePattern("rgba(255,255,255,0.12)")}
                  >
                    <span
                      className={cn("text-[36px] font-semibold leading-10", monoReadableClassName)}
                    >
                      Better
                    </span>
                    <span
                      className={cn(
                        "mt-3 max-w-[165px] text-sm leading-5 text-zinc-400",
                        monoDisplayClassName
                      )}
                    >
                      Nested Table Detection
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 xs:gap-6">
                  <LandingBrand compact className="sm:hidden" />
                  <LandingBrand className="hidden sm:flex" />
                  <span className="flex size-10 items-center justify-center rounded-full bg-zinc-100 text-base text-zinc-400">
                    VS
                  </span>
                  <LandingUnstructuredBrand />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={sectionFrameClassName}>
          <div className={cn("flex flex-col gap-12 pt-16 sm:pt-20", sectionPaddingClassName)}>
            <SectionTitle
              title={
                <>
                  Built For Every <span className="text-[#7f22fe]">Document Challenge</span>
                </>
              }
              description="Enterprise-grade features designed to handle the most complex document parsing scenarios"
            />
          </div>

          <div className="mt-8 grid border-y border-zinc-100 sm:mt-12 sm:grid-cols-2 xl:grid-cols-3">
            {challengeCards.map((card) => (
              <div
                key={card.title}
                className="relative border border-zinc-100 px-4 py-8 xs:px-6 xs:py-10 lg:px-16"
              >
                <div
                  className="absolute inset-0 opacity-35"
                  style={stripePattern("#f4f4f5", 1, 8)}
                />
                <div className="relative flex flex-col gap-6">
                  <div
                    className="flex size-10 items-center justify-center border"
                    style={{
                      backgroundColor: card.tone.background,
                      borderColor: card.tone.border,
                    }}
                  >
                    <ChallengeIcon card={card} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[18px] font-semibold leading-7 text-zinc-950">
                      {card.title}
                    </h3>
                    <p className="text-base leading-8 text-zinc-500">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={sectionFrameClassName}>
          <div className={cn("flex flex-col gap-12 py-16 sm:py-20", sectionPaddingClassName)}>
            <SectionTitle
              title={
                <>
                  Watch Your Data <span className="text-[#7f22fe]">Transform</span>
                </>
              }
              description="Our intelligent pipeline processes documents through multiple stages to deliver perfect results"
              descriptionClassName="text-zinc-600"
            />

            <div className="grid gap-8 border-y border-zinc-100 py-8 sm:gap-10 sm:py-10 lg:grid-cols-[448px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[1fr_0.95fr]">
              <div className="relative flex flex-col gap-5">
                {transformSteps.map((step, index) => (
                  <div key={step.number} className="relative">
                    <TransformStepCard step={step} />
                    {index < transformSteps.length - 1 ? (
                      <span className="absolute left-[43px] top-full flex h-5 w-2 items-center justify-center text-sm text-[#a684ff]">
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

        <section id="pricing" className={cn(sectionFrameClassName, "border-zinc-200 bg-[#fdf2f8]")}>
          <div className="flex flex-col gap-12 pt-16 sm:gap-16 sm:pt-20">
            <div
              className={cn(
                "flex flex-col items-center gap-3 text-center",
                sectionPaddingClassName
              )}
            >
              <h2 className="text-[24px] font-bold leading-8 sm:text-[36px] sm:leading-10">
                <span className="text-[#510424]">Simple,</span>
                <span className="text-[#e60076]"> Transparent Pricing</span>
              </h2>
              <p className="text-base leading-7 text-[#a3004c] sm:text-xl sm:leading-7">
                Pay only for what you use. No hidden fees, no complex tiers.
              </p>
            </div>

            <div
              className={cn(
                "grid items-center gap-8 pb-12 sm:gap-10 sm:pb-16 lg:grid-cols-[298px_1fr] lg:gap-20",
                sectionPaddingClassName
              )}
            >
              <div className="flex justify-center lg:justify-start">
                <PricingBurst />
              </div>
              <div
                className={cn(
                  "text-center text-[18px] leading-8 text-[#861043] sm:text-[26px] sm:leading-[34px] md:text-[30px] md:leading-9 lg:text-left",
                  monoDisplayClassName
                )}
              >
                <p>That&apos;s it. No complex tiers, no hidden fees.</p>
                <p className="mt-8">Purchase page credits anytime. No minimum, no commitment.</p>
              </div>
            </div>

            <div className="grid border-t border-[#fccee8] lg:grid-cols-3">
              {pricingExamples.map((example, index) => (
                <div
                  key={example.label}
                  className={cn(
                    "relative border-[#fccee8] px-6 py-8 text-center md:px-10",
                    index < pricingExamples.length - 1
                      ? "border-b lg:border-b-0 lg:border-r"
                      : "border-b"
                  )}
                >
                  <div
                    className="absolute inset-0 opacity-40"
                    style={stripePattern("#fccee8", 1, 8)}
                  />
                  <div className="relative flex items-center justify-center gap-3 text-[#e60076]">
                    <span className="text-[18px] font-semibold leading-7 sm:text-[24px] sm:leading-8">
                      {example.value}
                    </span>
                    <span
                      className={cn(
                        "text-[18px] leading-7 sm:text-2xl sm:leading-8",
                        monoDisplayClassName
                      )}
                    >
                      {example.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid border-t border-[#fccee8] lg:grid-cols-[1.35fr_2.65fr]">
              <div className="border-b border-[#fccee8] px-4 py-8 text-center xs:px-[18px] md:px-16 lg:border-b-0 lg:border-r lg:text-left">
                <div className="flex flex-col items-center gap-4 lg:items-start">
                  <h3 className="text-[24px] font-bold leading-8 text-[#510424] sm:text-[36px] sm:leading-10">
                    File Size Limits
                  </h3>
                  <p className="text-base leading-7 text-[#e60076] sm:text-xl sm:leading-8">
                    Need higher limits? Contact{" "}
                    <Link className="underline underline-offset-4" href="mailto:team@knowhereto.ai">
                      team@knowhereto.ai
                    </Link>{" "}
                    for enterprise pricing with custom limits.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 border-l-0 lg:grid-cols-4">
                {fileLimits.map((limit, index) => (
                  <div
                    key={limit.format}
                    className={cn(
                      "border-[#fccee8] px-6 py-10 text-center",
                      index < 2 && "border-b",
                      index % 2 === 0 && "border-r",
                      index < fileLimits.length - 1 && "lg:border-r",
                      "lg:border-b-0"
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
        </section>

        <section className={sectionFrameClassName}>
          <div
            className={cn(
              "flex flex-col items-center gap-6 pt-16 text-center sm:pt-20 lg:items-start lg:text-left",
              sectionPaddingClassName
            )}
          >
            <div className="flex flex-col items-center gap-3 lg:items-start">
              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <div className="relative overflow-hidden rounded-[4px] border border-[#ddd6ff] border-b-6 bg-[#ede9fe] px-3 pb-3 pt-2">
                  <div
                    className="absolute inset-0 opacity-40"
                    style={stripePattern("#ddd6ff", 1, 8)}
                  />
                  <span className="relative text-[36px] font-bold leading-10 text-[#5d0ec0]">
                    ENTERPRISE
                  </span>
                </div>
                <h2 className="text-[24px] font-bold leading-8 text-zinc-950 sm:text-[36px] sm:leading-10">
                  Need Custom <span className="text-[#7f22fe]">Solutions</span>?
                </h2>
              </div>
              <p className="text-base leading-7 text-zinc-600 sm:text-xl sm:leading-7">
                Get custom limits, SLAs, and dedicated support for your enterprise needs.
              </p>
            </div>
            <div className="flex justify-center lg:justify-start">
              <ActionLink
                href="mailto:team@knowhereto.ai"
                className={cn(mobileActionLinkClassName, "sm:h-[72px] sm:px-9 w-fit!")}
              >
                Contact Sales
              </ActionLink>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 border-t border-zinc-100 px-4 py-8 xs:px-[18px] sm:mt-12 sm:py-10 md:px-16">
            {enterpriseItems.map((item) => (
              <EnterpriseCheckItem key={item} label={item} />
            ))}
          </div>
        </section>

        <section className={sectionFrameClassName}>
          <div className={cn("flex flex-col gap-12 py-16 sm:py-20", sectionPaddingClassName)}>
            <SectionTitle
              title={
                <>
                  Frequently Asked <span className="text-[#7f22fe]">Questions</span>
                </>
              }
            />
            <div className="flex flex-col border border-zinc-100">
              {faqItems.map((faq) => (
                <FaqRow key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        <section className={cn(sectionFrameClassName, "py-16 text-center sm:py-20")}>
          <div className={cn("flex flex-col items-center gap-12", sectionPaddingClassName)}>
            <SectionTitle
              className="items-center"
              title={
                <>
                  Ready To Get <span className="text-[#7f22fe]">Started</span>?
                </>
              }
              description="Join thousands of developers building AI agents with the most accurate document parsing API"
              descriptionClassName="max-w-[980px] text-zinc-600 text-center"
            />

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-nowrap sm:gap-6">
              <ActionLink
                href="/login"
                className={cn(
                  mobileActionLinkClassName,
                  "w-fit text-[14px] leading-[26px] xs:text-xl xs:leading-7 sm:h-[72px] sm:w-fit sm:max-w-none sm:px-9"
                )}
              >
                Start Free Trial
              </ActionLink>
              <ActionLink
                href="mailto:team@knowhereto.ai"
                variant="secondary"
                className={cn(
                  mobileActionLinkClassName,
                  "w-fit text-[14px] leading-[26px] xs:text-xl xs:leading-7 sm:h-[72px] sm:w-fit sm:max-w-none sm:px-9"
                )}
              >
                Book A Demo
              </ActionLink>
            </div>

            <div className="flex w-full flex-col items-center gap-[10px] px-11 sm:gap-[10px] sm:px-[42px] md:px-11">
              <FooterChip color="#fb2c36">No credit card required</FooterChip>
              <FooterChip color="#efb100">Free 14-day trial</FooterChip>
              <FooterChip color="#00c951">Cancel anytime</FooterChip>
            </div>
          </div>
        </section>
      </main>

      <footer
        className={cn(
          "mx-auto flex flex-col items-center gap-3 border border-zinc-200 bg-[#fafafa] text-center sm:flex-row sm:justify-between sm:text-left",
          footerPaddingClassName,
          landingCanvasWidthClassName
        )}
      >
        <p className="order-1 text-xs leading-4 text-zinc-400 sm:order-2 sm:text-sm sm:leading-5">
          © 2026 Knowhere API. All rights reserved.
        </p>
        <LandingBrand compact className="order-2 sm:order-1" />
      </footer>
    </div>
  );
};
