import { LandingTrackedAnchor } from "@app/(landing)/_components/landing-tracked-link";
import {
  type CommandSegment,
  type IntegrationResource,
  type IntegrationStep,
  integrationResources,
  integrationSteps,
} from "@app/(landing)/claw/_components/claw-content";
import { ClawCopyButton } from "@app/(landing)/claw/_components/claw-copy-button";
import {
  ClawSectionHeading,
  ClawStripedOverlay,
} from "@app/(landing)/claw/_components/claw-primitives";
import { cn } from "@lib/utils";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

type ResourceLinkProps = {
  resource: IntegrationResource;
};

type ResourceAnchorProps = {
  ctaId: string;
  href: string;
  label: string;
};

const ResourceAnchor = ({ ctaId, href, label }: ResourceAnchorProps) => {
  return (
    <LandingTrackedAnchor
      className="inline-flex items-center font-mono-display text-base font-medium leading-6 text-[#7f22fe] underline decoration-solid underline-offset-2 min-[640px]:text-lg min-[640px]:leading-[26px] min-[640px]:max-[767px]:text-base min-[640px]:max-[767px]:leading-5 min-[768px]:max-[768px]:text-base min-[768px]:max-[768px]:leading-5 min-[769px]:text-base min-[769px]:leading-5"
      ctaId={ctaId}
      external
      href={href}
      sourceSection="claw_integration"
    >
      {label}
    </LandingTrackedAnchor>
  );
};

const ResourceLink = ({ resource }: ResourceLinkProps) => {
  return resource.variant === "package" ? (
    <ResourceAnchor
      ctaId="claw_npm_link"
      href="https://www.npmjs.com/package/@ontos-ai/knowhere-claw"
      label={resource.linkLabel}
    />
  ) : (
    <ResourceAnchor
      ctaId="claw_clawhub_link"
      href="https://www.clawhub.tools"
      label={resource.linkLabel}
    />
  );
};

const renderSegments = (segments: CommandSegment[]) => {
  return segments.map((segment) => (
    <span className={segment.className} key={`${segment.className}-${segment.text}`}>
      {segment.text}
    </span>
  ));
};

type IntegrationStepRowProps = {
  step: IntegrationStep;
};

const IntegrationStepRow = ({ step }: IntegrationStepRowProps) => {
  const stepNumber = step.step.replace("STEP ", "");

  return (
    <div className="relative px-5 py-6 min-[640px]:px-16 min-[640px]:py-8 min-[640px]:max-[767px]:px-12 min-[640px]:max-[767px]:py-8 min-[768px]:max-[768px]:px-12 min-[768px]:max-[768px]:py-8 min-[769px]:px-12 min-[769px]:py-8">
      <div className="relative flex min-h-0 flex-col gap-4">
        <div className="space-y-1 min-[640px]:max-[767px]:space-y-[2px] min-[768px]:max-[768px]:space-y-[2px] min-[769px]:space-y-[2px]">
          <h3 className="text-lg font-bold leading-7 text-[#09090b] min-[640px]:max-[767px]:text-base min-[640px]:max-[767px]:leading-6 min-[768px]:max-[768px]:text-base min-[768px]:max-[768px]:leading-6 min-[769px]:text-base min-[769px]:leading-6">
            <span className="text-[#09090b]">{stepNumber}. </span>
            {step.title}
          </h3>
          <p className="text-base leading-6 text-[#71717b] min-[640px]:text-sm min-[640px]:leading-[22px] min-[640px]:max-[767px]:text-sm min-[640px]:max-[767px]:leading-5 min-[768px]:max-[768px]:text-sm min-[768px]:max-[768px]:leading-5 min-[769px]:text-sm min-[769px]:leading-5">
            {step.description}
          </p>
          {step.note ? (
            <div className="flex max-w-[760px] items-start gap-[10px] pt-5 text-base leading-6 text-[#ff6467] min-[640px]:text-sm min-[640px]:leading-[22px] min-[640px]:max-[767px]:pt-4 min-[640px]:max-[767px]:text-base min-[640px]:max-[767px]:leading-6 min-[768px]:max-[768px]:pt-4 min-[768px]:max-[768px]:text-base min-[768px]:max-[768px]:leading-6 min-[769px]:text-base min-[769px]:leading-6">
              <span aria-hidden="true" className="text-base leading-6">
                ※
              </span>
              <p>{step.note}</p>
            </div>
          ) : null}
        </div>
        <div className="relative h-[72px] w-full max-w-full overflow-hidden border border-[#09090b] bg-[#27272a] min-[640px]:max-[767px]:h-[52px] min-[768px]:max-[768px]:h-[52px] min-[769px]:h-[52px]">
          <ScrollAreaPrimitive.Root type="auto" className="relative h-full w-full overflow-hidden">
            <ScrollAreaPrimitive.Viewport className="h-full w-full [&>div]:h-full">
              <div className="flex h-full min-w-max items-center pl-5 pr-[88px] min-[640px]:pl-8 min-[640px]:pr-24 min-[640px]:max-[767px]:px-6 min-[640px]:max-[767px]:pr-24 min-[768px]:max-[768px]:px-6 min-[768px]:max-[768px]:pr-24 min-[769px]:px-6 min-[769px]:pr-24">
                <code className="whitespace-nowrap font-mono-display text-base leading-6 tracking-normal min-[640px]:max-[767px]:text-sm min-[640px]:max-[767px]:leading-5 min-[768px]:max-[768px]:text-sm min-[768px]:max-[768px]:leading-5 min-[769px]:text-sm min-[769px]:leading-5">
                  {renderSegments(step.segments)}
                </code>
              </div>
            </ScrollAreaPrimitive.Viewport>
            <ScrollAreaPrimitive.ScrollAreaScrollbar
              orientation="horizontal"
              className="absolute bottom-0 left-0 right-0 z-30 flex h-2 flex-col touch-none select-none border-t border-[#3f3f46] bg-[#27272a]"
            >
              <ScrollAreaPrimitive.ScrollAreaThumb className="flex-1 rounded-none bg-[#52525b] transition-colors hover:bg-[#71717a] active:bg-[rgb(113_113_122_/_60%)]" />
            </ScrollAreaPrimitive.ScrollAreaScrollbar>
            <ScrollAreaPrimitive.Corner className="bg-[#27272a]" />
          </ScrollAreaPrimitive.Root>
          <div className="absolute right-[9px] top-1/2 -translate-y-1/2">
            <ClawCopyButton value={step.command} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ClawIntegrationSection = () => {
  return (
    <section className="bg-white scroll-mt-20 shadow-[inset_0_0_0_1px_#e4e4e7]" id="integration">
      <div className="flex flex-col gap-8 pt-10 min-[640px]:gap-12 min-[640px]:pt-20 min-[640px]:max-[767px]:gap-9 min-[640px]:max-[767px]:pt-14 min-[768px]:max-[768px]:gap-9 min-[768px]:max-[768px]:pt-14 min-[769px]:gap-9 min-[769px]:pt-14">
        <ClawSectionHeading
          className="!space-y-0 min-[640px]:!space-y-0 min-[769px]:!space-y-0"
          description="Follow the same rhythm as a developer-tool homepage: read the steps once, copy the commands in order, and replace the API key only in step 02."
          eyebrow="Integration Guide"
          eyebrowSpacingClassName="mb-[30px] min-[768px]:max-[768px]:mb-[34px] min-[769px]:mb-[36px]"
          title={
            <>
              Install it in <span className="text-[#e7000b]">OpenClaw</span> in three commands.
            </>
          }
        />

        <div className="space-y-0">
          {integrationResources.map((resource, index) => (
            <div
              className={cn(
                "border-t border-[#f4f4f5] px-5 py-6 min-[640px]:px-16 min-[640px]:py-10 min-[640px]:max-[767px]:px-12 min-[640px]:max-[767px]:py-8 min-[768px]:max-[768px]:px-12 min-[768px]:max-[768px]:py-8 min-[769px]:px-12 min-[769px]:py-8",
                index === integrationResources.length - 1 ? "border-b border-[#f4f4f5]" : ""
              )}
              key={resource.title}
            >
              <div className="space-y-3">
                <h3 className="text-lg font-bold leading-7 text-[#09090b] min-[640px]:text-2xl min-[640px]:leading-8 min-[640px]:max-[767px]:text-lg min-[640px]:max-[767px]:leading-7 min-[768px]:max-[768px]:text-lg min-[768px]:max-[768px]:leading-7 min-[769px]:text-lg min-[769px]:leading-7">
                  {resource.title}
                </h3>
                <ResourceLink resource={resource} />
                <p className="max-w-[1120px] text-base leading-6 text-[#71717b] min-[640px]:text-xl min-[640px]:leading-7 min-[640px]:max-[767px]:max-w-[544px] min-[640px]:max-[767px]:text-base min-[640px]:max-[767px]:leading-6 min-[768px]:max-[768px]:max-w-[680px] min-[768px]:max-[768px]:text-base min-[768px]:max-[768px]:leading-6 min-[769px]:max-w-[680px] min-[769px]:text-base min-[769px]:leading-6">
                  {resource.description}
                </p>
              </div>
            </div>
          ))}

          <div className="relative border-t border-[#ede9fe]">
            <ClawStripedOverlay className="opacity-40" tint="violet" />
            <div className="relative">
              {integrationSteps.map((step) => (
                <IntegrationStepRow key={step.step} step={step} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
