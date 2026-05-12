import {
  ClawSectionHeading,
  ClawStripedOverlay,
  OpenClawMark,
} from "@app/(landing)/claw/_components/claw-primitives";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import Image from "next/image";
import { useId } from "react";

type WorkflowTagProps = {
  children: string;
};

const WorkflowTagFileIcon = () => {
  return (
    <svg
      aria-hidden="true"
      className="size-4 text-current"
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.5 2.5H11.5L15.5 6.5V16.5H6.5V2.5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11.5 2.5V6.5H15.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
};

const WorkflowTag = ({ children }: WorkflowTagProps) => {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-[#52525c] bg-[#3f3f46] px-[9px] py-1 font-sans text-[11px] leading-4 text-[#9f9fa9] min-[640px]:gap-2 min-[640px]:rounded-lg min-[640px]:px-3 min-[640px]:py-2 min-[640px]:max-[767px]:gap-1 min-[640px]:max-[767px]:rounded-lg min-[640px]:max-[767px]:px-[10px] min-[640px]:max-[767px]:py-[6px] min-[640px]:max-[767px]:text-xs min-[640px]:max-[767px]:leading-5 min-[768px]:max-[768px]:gap-1 min-[768px]:max-[768px]:rounded-lg min-[768px]:max-[768px]:px-[10px] min-[768px]:max-[768px]:py-[6px] min-[768px]:max-[768px]:text-xs min-[768px]:max-[768px]:leading-5 min-[769px]:gap-1 min-[769px]:rounded-lg min-[769px]:px-[10px] min-[769px]:py-[6px] min-[769px]:text-xs min-[769px]:leading-5">
      <WorkflowTagFileIcon />
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
};

type StatusIconProps = {
  className?: string;
};

const UnstructuredStatusIcon = ({ className }: StatusIconProps) => {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.33317 13.3334H6.6665V14.6667H5.99984V15.3334H3.33317V14.6667H2.6665V10.6667H3.33317V10.0001H3.99984V12.0001H5.33317V11.3334H6.6665V10.6667H7.99984V10.0001H9.33317V11.3334H8.6665V12.0001H7.33317V13.3334Z"
        fill="#F54A00"
      />
      <path
        d="M14.6665 6.00008V4.66675H13.9998V3.33341H13.3332V2.66675H12.6665V2.00008H11.3332V1.33341H9.99984V0.666748H5.99984V1.33341H4.6665V2.00008H3.33317V2.66675H2.6665V3.33341H1.99984V4.66675H1.33317V6.00008H0.666504V10.0001H1.33317V10.6667H1.99984V10.0001H2.6665V9.33341H4.6665V10.6667H5.99984V10.0001H7.33317V9.33341H6.6665V8.66675H5.33317V8.00008H7.33317V8.66675H8.6665V9.33341H9.99984V12.0001H9.33317V12.6667H7.99984V14.0001H7.33317V15.3334H9.99984V14.6667H11.3332V14.0001H12.6665V13.3334H13.3332V12.6667H13.9998V11.3334H14.6665V10.0001H15.3332V6.00008H14.6665ZM9.99984 4.66675H11.9998V5.33341H12.6665V6.66675H11.9998V6.00008H11.3332V5.33341H9.99984V4.66675ZM9.33317 6.00008H10.6665V7.33341H9.33317V6.00008ZM6.6665 6.66675H5.33317V5.33341H6.6665V6.66675ZM7.33317 5.33341V4.66675H6.6665V4.00008H5.33317V4.66675H3.99984V4.00008H4.6665V3.33341H7.33317V4.00008H7.99984V4.66675H8.6665V5.33341H7.33317Z"
        fill="#F54A00"
      />
    </svg>
  );
};

const StructuredStatusIcon = ({ className }: StatusIconProps) => {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6665 6.00008V4.66675H13.9998V3.33341H13.3332V2.66675H12.6665V2.00008H11.3332V1.33341H9.99984V0.666748H5.99984V1.33341H4.6665V2.00008H3.33317V2.66675H2.6665V3.33341H1.99984V4.66675H1.33317V6.00008H0.666504V10.0001H1.33317V11.3334H1.99984V12.6667H2.6665V13.3334H3.33317V14.0001H4.6665V14.6667H5.99984V15.3334H9.99984V14.6667H11.3332V14.0001H12.6665V13.3334H13.3332V12.6667H13.9998V11.3334H14.6665V10.0001H15.3332V6.00008H14.6665ZM11.6665 7.66675H10.9998V8.33341H10.3332V9.00008H9.6665V9.66675H8.99984V10.3334H8.33317V11.0001H7.6665V11.6667H6.33317V11.0001H5.6665V10.3334H4.99984V9.66675H4.33317V9.00008H3.6665V7.66675H4.33317V7.00008H5.6665V7.66675H6.33317V8.33341H7.6665V7.66675H8.33317V7.00008H8.99984V6.33341H9.6665V5.66675H10.3332V5.00008H11.6665V5.66675H12.3332V7.00008H11.6665V7.66675Z"
        fill="currentColor"
      />
    </svg>
  );
};

const SkillLoadedCheckIcon = () => {
  return (
    <svg
      aria-hidden="true"
      className="h-[10px] w-4"
      fill="none"
      viewBox="0 0 19 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1.06066 5.06066L7.06066 11.0607L17.0607 1.06066" stroke="#C4B4FF" strokeWidth="3" />
    </svg>
  );
};

type WorkflowDividerArrowProps = {
  emphasis?: boolean;
};

const WorkflowDividerArrow = ({ emphasis = false }: WorkflowDividerArrowProps) => {
  const gradientId = useId();

  return (
    <svg
      aria-hidden="true"
      className={
        emphasis
          ? "h-10 w-[26px] opacity-50 sm:h-[46px] sm:w-[30px]"
          : "h-10 w-[26px] opacity-20 sm:h-[46px] sm:w-[30px]"
      }
      fill="none"
      viewBox="0 0 30 46"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15 3V38" stroke={`url(#${gradientId})`} strokeWidth="6" />
      <path d="M2 33L15 42L28 33" stroke="#F6339A" strokeWidth="6" />
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="15"
          x2="15"
          y1="3"
          y2="38"
        >
          <stop stopColor="#FAFAFA" />
          <stop offset="1" stopColor="#F6339A" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const WorkflowSourceHeader = () => {
  return (
    <>
      <div className="relative flex flex-col min-[640px]:max-[767px]:hidden min-[768px]:max-[768px]:hidden min-[769px]:hidden">
        <div className="relative flex h-[34px] w-full items-center gap-2 overflow-hidden rounded-t-[24px] border-b border-[#ffd6a8] bg-[#fff7ed] px-5 font-sans text-base font-bold leading-6 text-[#f54a00]">
          <ClawStripedOverlay className="opacity-70" tint="orange" />
          <UnstructuredStatusIcon className="relative h-4 w-4" />
          <span className="relative">UNSTRUCTURED</span>
        </div>
        <div className="relative flex h-10 w-full items-center gap-2 border-b border-[#ffd6a8] bg-[#fff7ed] px-[14px] font-sans text-sm leading-6">
          <ClawStripedOverlay className="opacity-70" tint="orange" />
          <p className="relative shrink-0 font-semibold text-[#ff8904]">Raw source:</p>
          <p className="relative truncate text-[#71717b]">Tesla-Q4-2025-Update.pdf</p>
        </div>
      </div>
      <div className="relative hidden h-12 items-center justify-between border-b border-[#ffd6a8] bg-[#fff7ed] pl-0 pr-0 min-[640px]:max-[767px]:flex min-[768px]:max-[768px]:flex min-[769px]:flex">
        <ClawStripedOverlay tint="orange" />
        <div className="relative flex h-full items-center">
          <div className="relative inline-flex h-full items-center gap-2.5 bg-[#ffedd4] pl-5 pr-7 font-sans text-base font-bold uppercase tracking-[0.02em] leading-6 text-[#f54a00] min-[640px]:max-[768px]:pl-[18px] after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-[#fed7aa] after:content-['']">
            <UnstructuredStatusIcon className="h-[14px] w-[14px] sm:h-4 sm:w-4" />
            UNSTRUCTURED
          </div>
        </div>
        <div className="relative inline-flex h-full max-w-[420px] items-center border-l border-[#ffcf9e] bg-[#fff0df] px-5">
          <p className="truncate font-sans text-sm leading-6 text-[#ff8904]">
            Raw source: <span className="text-[#71717b]">Tesla-Q4-2025-Update.pdf</span>
          </p>
        </div>
      </div>
    </>
  );
};

type UserBubbleProps = {
  count: string;
  isCompact?: boolean;
  text: string;
};

const UserBubble = ({ count, isCompact = false, text }: UserBubbleProps) => {
  const textSizeClassName = isCompact ? "text-sm leading-5" : "text-base leading-6";

  return (
    <div className="pl-12 min-[640px]:pl-20 min-[640px]:max-[767px]:pl-32 min-[768px]:max-[768px]:pl-20 min-[769px]:pl-32">
      <div
        className={`rounded-tl-[24px] rounded-bl-[24px] rounded-br-[24px] bg-[#a684ff] px-5 py-4 font-sans text-[#2f0d68] min-[640px]:rounded-tl-[32px] min-[640px]:rounded-bl-[32px] min-[640px]:rounded-br-[32px] min-[640px]:px-8 min-[640px]:py-6 min-[640px]:text-lg min-[640px]:leading-6 min-[640px]:max-[767px]:px-7 min-[640px]:max-[767px]:py-5 min-[640px]:max-[767px]:text-base min-[640px]:max-[767px]:leading-5 min-[768px]:max-[768px]:px-7 min-[768px]:max-[768px]:py-5 min-[768px]:max-[768px]:text-base min-[768px]:max-[768px]:leading-5 min-[769px]:px-7 min-[769px]:py-5 min-[769px]:text-base min-[769px]:leading-5 ${textSizeClassName}`}
      >
        {text}
      </div>
      <div className="mt-2 flex justify-end">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#71717b] bg-[#3f3f46] py-1.5 pl-3 pr-3.5 font-sans text-[14px] leading-5 text-[#fafafa] min-[640px]:gap-2 min-[640px]:px-3.5 min-[640px]:py-2">
          <KnowhereIcon className="h-4 w-4 text-current" name="search" />
          {count}
        </span>
      </div>
    </div>
  );
};

type AssistantBubbleProps = {
  emphasis: string;
  isLongEmphasis?: boolean;
  tags: string[];
  text: string;
};

const AssistantBubble = ({
  emphasis,
  isLongEmphasis = false,
  tags,
  text,
}: AssistantBubbleProps) => {
  const emphasisSizeClassName = isLongEmphasis ? "text-[26px]" : "text-[30px]";

  return (
    <div className="flex items-start gap-2 pr-3 min-[640px]:pr-20 min-[640px]:max-[767px]:pr-32 min-[768px]:max-[768px]:pr-20 min-[769px]:pr-32">
      <div className="relative flex h-14 w-14 flex-none items-center justify-center rounded-full border border-[#3f3f46] bg-[#18181b]">
        <OpenClawMark className="h-6 w-7" />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 self-stretch flex-col gap-5 rounded-tr-[24px] rounded-br-[24px] rounded-bl-[24px] bg-[#3f3f46] px-5 py-4 min-[640px]:min-h-[204px] min-[640px]:gap-8 min-[640px]:rounded-tr-[32px] min-[640px]:rounded-br-[32px] min-[640px]:rounded-bl-[32px] min-[640px]:px-8 min-[640px]:py-6 min-[640px]:max-[767px]:gap-6 min-[640px]:max-[767px]:px-7 min-[640px]:max-[767px]:py-5 min-[768px]:max-[768px]:gap-6 min-[768px]:max-[768px]:px-7 min-[768px]:max-[768px]:py-5 min-[769px]:gap-6 min-[769px]:px-7 min-[769px]:py-5">
        <p className="font-sans text-base leading-6 text-[#fafafa] min-[640px]:max-[767px]:text-base min-[640px]:max-[767px]:leading-5 min-[768px]:max-[768px]:text-base min-[768px]:max-[768px]:leading-5 min-[769px]:text-base min-[769px]:leading-5">
          {text}
        </p>
        <p
          className={`max-w-full break-words font-accent font-extrabold leading-none text-[#c4b4ff] min-[640px]:max-[767px]:text-[30px] min-[768px]:max-[768px]:text-[30px] min-[769px]:text-[30px] ${emphasisSizeClassName}`}
        >
          {emphasis}
        </p>
        <div className="flex min-w-0 max-w-full flex-wrap items-start gap-2">
          {tags.map((tag) => (
            <WorkflowTag key={tag}>{tag}</WorkflowTag>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ClawWorkflowSection = () => {
  return (
    <section className="bg-white scroll-mt-20 shadow-[inset_0_0_0_1px_#e4e4e7]" id="workflow">
      <div className="flex flex-col gap-8 py-10 min-[640px]:gap-12 min-[640px]:py-20 min-[640px]:max-[767px]:gap-9 min-[640px]:max-[767px]:py-14 min-[768px]:max-[768px]:gap-9 min-[768px]:max-[768px]:py-14 min-[769px]:gap-9 min-[769px]:py-14">
        <ClawSectionHeading
          description="This is the interaction model the plugin is built for: Knowhere extracts structure, OpenClaw stores the package, and the agent answers only after it has previewed or reopened the right evidence."
          eyebrow="Grounded Answer Flow"
          title={
            <>
              One dense report in. One grounded <span className="text-[#e7000b]">OpenClaw</span>{" "}
              answer out.
            </>
          }
        />

        <div className="space-y-2 px-[18px] min-[640px]:space-y-4 min-[640px]:px-16 min-[640px]:max-[767px]:space-y-[10px] min-[640px]:max-[767px]:px-12 min-[768px]:max-[768px]:space-y-[10px] min-[768px]:max-[768px]:px-12 min-[769px]:space-y-[10px] min-[769px]:px-12">
          <div className="overflow-hidden rounded-[24px] border border-[#ffd6a8] bg-white pb-8 min-[640px]:pb-0 min-[640px]:max-[767px]:rounded-[12px] min-[768px]:max-[768px]:rounded-[12px] min-[769px]:rounded-[12px]">
            <WorkflowSourceHeader />
            <div className="px-0 pb-0 pt-0 min-[640px]:px-8 min-[640px]:pb-8 min-[640px]:pt-6 min-[640px]:max-[767px]:px-6 min-[640px]:max-[767px]:pb-6 min-[640px]:max-[767px]:pt-6 min-[768px]:max-[768px]:px-6 min-[768px]:max-[768px]:pb-6 min-[768px]:max-[768px]:pt-6 min-[769px]:px-6 min-[769px]:pb-6 min-[769px]:pt-6">
              <div className="overflow-hidden rounded-none border-0 bg-white min-[640px]:rounded-[18px] min-[640px]:border min-[640px]:border-[#f4f4f5] min-[640px]:max-[767px]:rounded-[12px] min-[768px]:max-[768px]:rounded-[12px] min-[769px]:rounded-[12px]">
                <Image
                  alt="Tesla quarterly update document preview"
                  className="h-auto w-full"
                  height={2474}
                  priority
                  src="/images/openclaw/page-33.png"
                  width={4398}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pb-1 opacity-60 min-[640px]:gap-5 min-[640px]:pb-2 min-[640px]:max-[767px]:pb-0 min-[768px]:max-[768px]:pb-0 min-[769px]:pb-0">
            <WorkflowDividerArrow />
            <WorkflowDividerArrow emphasis />
            <WorkflowDividerArrow />
          </div>

          <div className="overflow-hidden rounded-[24px] border border-[#3f3f46] bg-[#27272a] min-[640px]:max-[767px]:rounded-[12px] min-[768px]:max-[768px]:rounded-[12px] min-[769px]:rounded-[12px]">
            <div className="min-[640px]:max-[767px]:hidden min-[768px]:max-[768px]:hidden min-[769px]:hidden">
              <div className="relative flex flex-col overflow-hidden border-b border-[#52525c] bg-[#3f3f46]">
                <div className="relative flex h-[34px] w-full items-center gap-2 bg-[#016630] px-5 font-sans text-base font-bold leading-6 text-[#d0fae5] shadow-[0_0_0_1px_#008236]">
                  <StructuredStatusIcon className="h-4 w-4" />
                  STRUCTURED
                </div>
                <div className="relative flex flex-col border-l border-[#52525c]">
                  <ClawStripedOverlay className="opacity-40" tint="violet" />
                  <div className="relative flex h-10 items-center justify-center gap-3">
                    <OpenClawMark className="h-5 w-[22px]" />
                    <span className="font-sans text-sm font-medium leading-5 text-[#ff6467]">
                      OpenClaw
                    </span>
                  </div>
                  <div className="relative flex h-10 items-center justify-center gap-[10px] border-t border-[#52525c] bg-[#52525c] px-4 font-sans text-sm leading-5 text-[#c4b4ff]">
                    <SkillLoadedCheckIcon />
                    knowhere skill loaded
                  </div>
                </div>
              </div>
            </div>
            <div className="relative hidden h-12 items-center justify-between overflow-hidden border-b border-[#52525c] bg-[#3f3f46] min-[640px]:max-[767px]:flex min-[768px]:max-[768px]:flex min-[769px]:flex">
              <ClawStripedOverlay className="opacity-55" tint="violet" />
              <div className="relative inline-flex h-full items-center self-stretch bg-[#166534] px-5 shadow-[0_0_0_1px_#15803d]">
                <ClawStripedOverlay className="opacity-35" tint="violet" />
                <div className="relative inline-flex items-center gap-2 font-sans text-base font-bold leading-6 text-[#00d492]">
                  <StructuredStatusIcon className="h-[14px] w-[14px] sm:h-4 sm:w-4" />
                  STRUCTURED
                </div>
              </div>
              <div className="relative flex h-full shrink-0 items-center gap-5 border-l border-[#52525c] pl-5">
                <ClawStripedOverlay className="opacity-20" tint="violet" />
                <div className="relative inline-flex items-center gap-[6px]">
                  <OpenClawMark className="h-[18px] w-5" />
                  <span className="font-sans text-sm font-medium leading-7 text-[#ff6467]">
                    OpenClaw
                  </span>
                </div>
                <div className="relative inline-flex h-full items-center gap-[10px] border-l border-[#52525c] bg-[#52525b] px-5 py-[10px] font-sans text-sm leading-7 text-[#c4b4ff]">
                  <SkillLoadedCheckIcon />
                  knowhere skill loaded
                </div>
              </div>
            </div>

            <ScrollAreaPrimitive.Root type="auto" className="relative overflow-hidden">
              <ScrollAreaPrimitive.Viewport className="h-full w-full">
                <div className="box-border w-[calc(100vw-38px)] space-y-6 px-2.5 pb-[14px] pt-[14px] min-[640px]:w-full min-[640px]:px-5 min-[640px]:pb-10 min-[640px]:pt-6 min-[640px]:max-[767px]:space-y-4 min-[640px]:max-[767px]:px-[14px] min-[640px]:max-[767px]:pb-8 min-[640px]:max-[767px]:pt-4 min-[768px]:max-[768px]:space-y-4 min-[768px]:max-[768px]:px-[14px] min-[768px]:max-[768px]:pb-8 min-[768px]:max-[768px]:pt-4 min-[769px]:space-y-4 min-[769px]:px-[14px] min-[769px]:pb-8 min-[769px]:pt-4">
                  <UserBubble
                    count="1"
                    text="Did Tesla's free cash flow go negative in any quarter? Show the supporting chunk."
                  />
                  <AssistantBubble
                    emphasis="−$2,535M"
                    tags={["manifest.json", "chunks.json", "page-33 / table-14"]}
                    text="Yes. Q1 2024 is the only negative quarter. Operating cash fell to $242M while CapEx stayed at $2,777M."
                  />
                  <UserBubble
                    count="3"
                    isCompact
                    text="What should I inspect if I want the raw source instead of the answer?"
                  />
                  <AssistantBubble
                    emphasis="preview → grep → read_result_file"
                    isLongEmphasis
                    tags={[
                      "knowhere_preview_document",
                      "knowhere_grep",
                      "knowhere_read_result_file",
                    ]}
                    text="Open the preview first, grep for the metric, then read the exact result file behind that chunk. The plugin keeps the path surface intact."
                  />
                </div>
              </ScrollAreaPrimitive.Viewport>
              <ScrollAreaPrimitive.ScrollAreaScrollbar
                orientation="vertical"
                className="z-30 flex w-2 touch-none select-none border-l border-[#3f3f46] bg-[#27272a]"
              >
                <ScrollAreaPrimitive.ScrollAreaThumb className="flex-1 rounded-none bg-[#52525b] transition-colors hover:bg-[#71717a] active:bg-[rgb(113_113_122_/_60%)]" />
              </ScrollAreaPrimitive.ScrollAreaScrollbar>
              <ScrollAreaPrimitive.ScrollAreaScrollbar
                orientation="horizontal"
                className="z-30 flex h-2 flex-col touch-none select-none border-t border-[#3f3f46] bg-[#27272a]"
              >
                <ScrollAreaPrimitive.ScrollAreaThumb className="flex-1 rounded-none bg-[#52525b] transition-colors hover:bg-[#71717a] active:bg-[rgb(113_113_122_/_60%)]" />
              </ScrollAreaPrimitive.ScrollAreaScrollbar>
              <ScrollAreaPrimitive.Corner className="bg-[#27272a]" />
            </ScrollAreaPrimitive.Root>
          </div>
        </div>
      </div>
    </section>
  );
};
