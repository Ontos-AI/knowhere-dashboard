import {
  ClawSectionHeading,
  ClawStripedOverlay,
  OpenClawMark,
} from "@app/(landing)/claw/_components/claw-primitives";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import Image from "next/image";
import { useId } from "react";

type WorkflowTagProps = {
  children: string;
};

const WorkflowTagFileIcon = () => {
  return (
    <svg
      aria-hidden="true"
      className="size-5 text-current"
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
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[#52525c] bg-[#3f3f46] px-[10px] py-1 font-sans text-sm leading-5 text-[#9f9fa9] min-[640px]:gap-2 min-[640px]:rounded-lg min-[640px]:px-3 min-[640px]:py-2 min-[640px]:max-[767px]:gap-1 min-[640px]:max-[767px]:rounded-lg min-[640px]:max-[767px]:px-[10px] min-[640px]:max-[767px]:py-[6px] min-[640px]:max-[767px]:text-xs min-[640px]:max-[767px]:leading-5 min-[768px]:max-[768px]:gap-1 min-[768px]:max-[768px]:rounded-lg min-[768px]:max-[768px]:px-[10px] min-[768px]:max-[768px]:py-[6px] min-[768px]:max-[768px]:text-xs min-[768px]:max-[768px]:leading-5 min-[769px]:gap-1 min-[769px]:rounded-lg min-[769px]:px-[10px] min-[769px]:py-[6px] min-[769px]:text-xs min-[769px]:leading-5">
      <WorkflowTagFileIcon />
      {children}
    </span>
  );
};

const StructuredStatusCheckIcon = () => {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="none"
      viewBox="0 0 22 22"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 8V6H20V4H19V3H18V2H16V1H14V0H8V1H6V2H4V3H3V4H2V6H1V8H0V14H1V16H2V18H3V19H4V20H6V21H8V22H14V21H16V20H18V19H19V18H20V16H21V14H22V8H21ZM16.5 10.5H15.5V11.5H14.5V12.5H13.5V13.5H12.5V14.5H11.5V15.5H10.5V16.5H8.5V15.5H7.5V14.5H6.5V13.5H5.5V12.5H4.5V10.5H5.5V9.5H7.5V10.5H8.5V11.5H10.5V10.5H11.5V9.5H12.5V8.5H13.5V7.5H14.5V6.5H16.5V7.5H17.5V9.5H16.5V10.5Z"
        fill="#00D492"
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
        <div className="relative flex h-14 w-full items-center gap-[10px] overflow-hidden rounded-t-[24px] border-b border-[#ffd6a8] bg-[#ffedd4] px-5 font-sans text-base font-bold leading-6 text-[#f54a00] after:absolute after:inset-y-0 after:right-0 after:w-1 after:bg-[#f54a00] after:content-[''] sm:h-[72px] sm:px-8 sm:py-[10px] sm:text-[18px] sm:leading-[26px]">
          <KnowhereIcon className="size-5 text-current" name="state-x" />
          UNSTRUCTURED
        </div>
        <div className="relative flex h-10 w-full items-center gap-2 border-b border-[#ffd6a8] bg-[#ffedd4] px-5 font-sans text-sm leading-6 sm:h-[50px] sm:gap-3 sm:px-[30px] sm:text-[18px] sm:leading-[26px]">
          <p className="shrink-0 font-semibold text-[#ff8904] sm:text-[18px]">Raw source:</p>
          <p className="truncate text-[#71717b]">Tesla-Q4-2025-Update.pdf</p>
        </div>
      </div>
      <div className="relative hidden h-12 items-center justify-between border-b border-[#ffd6a8] bg-[#fff7ed] pl-0 pr-5 min-[640px]:max-[767px]:flex min-[768px]:max-[768px]:flex min-[769px]:flex">
        <ClawStripedOverlay tint="orange" />
        <div className="relative flex h-full items-center">
          <div className="inline-flex h-full items-center gap-2 border-r-4 border-[#f54a00] border-l border-b border-[#ff8904] bg-[#fff7ed] px-5 font-sans text-base font-bold leading-6 text-[#f54a00]">
            <KnowhereIcon className="size-5 text-current" name="state-x" />
            UNSTRUCTURED
          </div>
        </div>
        <p className="relative font-sans text-sm leading-6 text-[#ff8904]">
          Raw source: <span className="text-[#71717b]">Tesla-Q4-2025-Update.pdf</span>
        </p>
      </div>
    </>
  );
};

type UserBubbleProps = {
  count: string;
  text: string;
};

const UserBubble = ({ count, text }: UserBubbleProps) => {
  return (
    <div className="pl-12 min-[640px]:pl-20 min-[640px]:max-[767px]:pl-32 min-[768px]:max-[768px]:pl-20 min-[769px]:pl-32">
      <div className="rounded-tl-[32px] rounded-bl-[32px] rounded-br-[32px] bg-[#a684ff] px-5 py-4 font-sans text-sm leading-[18px] text-[#2f0d68] min-[640px]:px-8 min-[640px]:py-6 min-[640px]:text-lg min-[640px]:leading-6 min-[640px]:max-[767px]:px-7 min-[640px]:max-[767px]:py-5 min-[640px]:max-[767px]:text-base min-[640px]:max-[767px]:leading-5 min-[768px]:max-[768px]:px-7 min-[768px]:max-[768px]:py-5 min-[768px]:max-[768px]:text-base min-[768px]:max-[768px]:leading-5 min-[769px]:px-7 min-[769px]:py-5 min-[769px]:text-base min-[769px]:leading-5">
        {text}
      </div>
      <div className="mt-2 flex justify-end">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#71717b] bg-[#3f3f46] py-1.5 pl-[14px] pr-4 font-sans text-xl leading-7 text-[#fafafa] min-[640px]:gap-2 min-[640px]:px-4 min-[640px]:py-2 min-[640px]:max-[767px]:text-lg min-[640px]:max-[767px]:leading-6 min-[768px]:max-[768px]:text-lg min-[768px]:max-[768px]:leading-6 min-[769px]:text-lg min-[769px]:leading-6">
          <KnowhereIcon className="size-6 text-current" name="search" />
          {count}
        </span>
      </div>
    </div>
  );
};

type AssistantBubbleProps = {
  emphasis: string;
  tags: string[];
  text: string;
};

const AssistantBubble = ({ emphasis, tags, text }: AssistantBubbleProps) => {
  return (
    <div className="flex items-start gap-2 pr-3 min-[640px]:pr-20 min-[640px]:max-[767px]:pr-32 min-[768px]:max-[768px]:pr-20 min-[769px]:pr-32">
      <div className="relative flex h-14 w-14 flex-none items-center justify-center rounded-full border border-[#3f3f46] bg-[#18181b]">
        <OpenClawMark className="h-6 w-7" />
      </div>
      <div className="flex min-h-0 flex-1 self-stretch flex-col gap-5 rounded-tr-[32px] rounded-br-[32px] rounded-bl-[32px] bg-[#3f3f46] px-5 py-4 min-[640px]:min-h-[204px] min-[640px]:gap-8 min-[640px]:px-8 min-[640px]:py-6 min-[640px]:max-[767px]:gap-6 min-[640px]:max-[767px]:px-7 min-[640px]:max-[767px]:py-5 min-[768px]:max-[768px]:gap-6 min-[768px]:max-[768px]:px-7 min-[768px]:max-[768px]:py-5 min-[769px]:gap-6 min-[769px]:px-7 min-[769px]:py-5">
        <p className="font-sans text-[18px] leading-6 text-[#fafafa] min-[640px]:max-[767px]:text-base min-[640px]:max-[767px]:leading-5 min-[768px]:max-[768px]:text-base min-[768px]:max-[768px]:leading-5 min-[769px]:text-base min-[769px]:leading-5">
          {text}
        </p>
        <p className="font-accent text-4xl font-extrabold leading-none text-[#c4b4ff] min-[640px]:max-[767px]:text-[30px] min-[768px]:max-[768px]:text-[30px] min-[769px]:text-[30px]">
          {emphasis}
        </p>
        <div className="flex flex-wrap items-start gap-2">
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
    <section className="border border-[#e4e4e7] bg-[#fafafa] scroll-mt-20" id="workflow">
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

        <div className="space-y-3 px-5 min-[640px]:space-y-4 min-[640px]:px-16 min-[640px]:max-[767px]:space-y-[10px] min-[640px]:max-[767px]:px-12 min-[768px]:max-[768px]:space-y-[10px] min-[768px]:max-[768px]:px-12 min-[769px]:space-y-[10px] min-[769px]:px-12">
          <div className="overflow-hidden rounded-[24px] border border-[#ffd6a8] bg-white min-[640px]:max-[767px]:rounded-[12px] min-[768px]:max-[768px]:rounded-[12px] min-[769px]:rounded-[12px]">
            <WorkflowSourceHeader />
            <div className="px-3 pb-6 pt-4 min-[640px]:px-8 min-[640px]:pb-8 min-[640px]:pt-6 min-[640px]:max-[767px]:px-6 min-[640px]:max-[767px]:pb-6 min-[640px]:max-[767px]:pt-6 min-[768px]:max-[768px]:px-6 min-[768px]:max-[768px]:pb-6 min-[768px]:max-[768px]:pt-6 min-[769px]:px-6 min-[769px]:pb-6 min-[769px]:pt-6">
              <div className="overflow-hidden rounded-[18px] border border-[#f4f4f5] bg-white min-[640px]:max-[767px]:rounded-[12px] min-[768px]:max-[768px]:rounded-[12px] min-[769px]:rounded-[12px]">
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
                <div className="relative flex h-14 w-full items-center gap-[10px] border-r-4 border-[#008236] border-b border-[#008236] bg-[#016630] px-8 font-sans text-base font-bold leading-7 text-[#d0fae5]">
                  <StructuredStatusCheckIcon />
                  STRUCTURED
                </div>
                <div className="relative flex flex-col">
                  <ClawStripedOverlay className="opacity-40" tint="violet" />
                  <div className="relative flex h-10 items-center justify-center gap-3">
                    <OpenClawMark className="h-5 w-[22px]" />
                    <span className="font-sans text-sm font-medium leading-[26px] text-[#ff6467]">
                      OpenClaw
                    </span>
                  </div>
                  <div className="relative flex h-10 items-center justify-center gap-[10px] border-t border-[#52525c] bg-[#52525c] px-4 font-sans text-xs leading-[26px] text-[#c4b4ff]">
                    <SkillLoadedCheckIcon />
                    knowhere skill loaded
                  </div>
                </div>
              </div>
            </div>
            <div className="relative hidden h-12 items-center justify-between overflow-hidden border-b border-[#52525c] bg-[#3f3f46] min-[640px]:max-[767px]:flex min-[768px]:max-[768px]:flex min-[769px]:flex">
              <ClawStripedOverlay className="opacity-40" tint="violet" />
              <div className="relative inline-flex h-full items-center gap-2 border-x border-b border-[#52525c] px-5 py-[10px] font-sans text-base font-bold leading-6 text-[#00d492]">
                <StructuredStatusCheckIcon />
                STRUCTURED
              </div>
              <div className="relative flex h-full shrink-0 items-center gap-5 border-l border-[#52525c] pl-5">
                <div className="inline-flex items-center gap-[6px]">
                  <OpenClawMark className="h-[18px] w-5" />
                  <span className="font-sans text-sm font-medium leading-7 text-[#ff6467]">
                    OpenClaw
                  </span>
                </div>
                <div className="inline-flex h-full items-center gap-[10px] border-x border-[#52525c] px-5 py-[10px] font-sans text-sm leading-7 text-[#c4b4ff]">
                  <SkillLoadedCheckIcon />
                  knowhere skill loaded
                </div>
              </div>
            </div>

            <div className="overflow-x-auto overscroll-x-contain min-[640px]:max-[767px]:overflow-visible min-[768px]:max-[768px]:overflow-visible min-[769px]:overflow-visible">
              <div className="min-w-[339px] space-y-6 px-2.5 pb-[14px] pt-[14px] min-[640px]:min-w-0 min-[640px]:px-5 min-[640px]:pb-10 min-[640px]:pt-6 min-[640px]:max-[767px]:space-y-4 min-[640px]:max-[767px]:px-[14px] min-[640px]:max-[767px]:pb-8 min-[640px]:max-[767px]:pt-4 min-[768px]:max-[768px]:space-y-4 min-[768px]:max-[768px]:px-[14px] min-[768px]:max-[768px]:pb-8 min-[768px]:max-[768px]:pt-4 min-[769px]:space-y-4 min-[769px]:px-[14px] min-[769px]:pb-8 min-[769px]:pt-4">
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
                  text="What should I inspect if I want the raw source instead of the answer?"
                />
                <AssistantBubble
                  emphasis="preview → grep → read_result_file"
                  tags={["knowhere_preview_document", "knowhere_grep", "knowhere_read_result_file"]}
                  text="Open the preview first, grep for the metric, then read the exact result file behind that chunk. The plugin keeps the path surface intact."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
