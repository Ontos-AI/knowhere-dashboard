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
  NpmLogo,
  OpenClawMark,
} from "@app/(landing)/claw/_components/claw-primitives";
import { cn } from "@lib/utils";

type ResourceLinkProps = {
  resource: IntegrationResource;
};

type ResourceAnchorProps = {
  href: string;
  label: string;
};

const ResourceAnchor = ({ href, label }: ResourceAnchorProps) => {
  return (
    <a
      className="inline-flex items-center gap-1 font-mono-display text-base font-medium leading-6 text-[#7f22fe] decoration-solid underline-offset-2 sm:text-lg sm:leading-[26px] lg:text-xl lg:leading-7"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <span aria-hidden="true">🔗</span>
      <span className="underline">{label}</span>
    </a>
  );
};

const ResourceLink = ({ resource }: ResourceLinkProps) => {
  if (resource.variant === "package") {
    return (
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <NpmLogo className="h-4 w-10 shrink-0 sm:h-6 sm:w-[60px]" />
        <ResourceAnchor
          href="https://www.npmjs.com/package/@ontos-ai/knowhere-claw"
          label={resource.linkLabel}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      <OpenClawMark className="h-4 w-[18px] shrink-0 sm:h-6 sm:w-[26.88px]" />
      <ResourceAnchor href="https://www.clawhub.tools" label={resource.linkLabel} />
    </div>
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
    <div className="relative border-x border-t border-[#ede9fe] last:border-b sm:grid sm:w-[578px] sm:grid-cols-[99px_457px] sm:gap-x-[22px] sm:border-x-0 sm:border-l lg:flex lg:w-auto lg:grid-cols-none lg:gap-x-0 xl:block xl:border-x xl:border-l-0 2xl:flex 2xl:border-x-0 2xl:border-l">
      <ClawStripedOverlay tint="violet" />
      <div className="relative flex h-[46px] w-[99px] items-center justify-center border-r-4 border-l border-b border-[#ede9fe] bg-[#f5f3ff] font-mono-display text-[18px] font-bold leading-[26px] text-[#a684ff] sm:hidden">
        {step.step}
      </div>
      <div className="relative hidden min-w-[108px] flex-none items-start sm:flex sm:min-w-0 sm:w-[99px] lg:min-w-[108px] lg:w-auto xl:hidden 2xl:flex">
        <div className="flex h-[46px] w-[99px] items-center justify-center border-r-4 border-[#c4b4ff] border-l border-b border-[#ede9fe] bg-[#f5f3ff] font-mono-display text-[18px] font-bold leading-[26px] text-[#a684ff] lg:h-auto lg:w-auto lg:px-5 lg:py-[10px] lg:text-lg lg:leading-7">
          {step.step}
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col gap-6 px-5 pb-6 pt-6 sm:w-[457px] sm:min-h-0 sm:gap-[22px] sm:px-0 sm:pb-0 sm:pt-[14px] lg:w-auto lg:min-h-[132px] lg:gap-6 lg:px-6 lg:pb-10 lg:pt-4 xl:px-16 xl:pt-8 2xl:px-6 2xl:pb-10 2xl:pt-4">
        <div className="space-y-1 sm:max-w-[395px] lg:max-w-[944px]">
          <h3 className="text-lg font-bold leading-7 text-[#09090b]">
            <span className="hidden text-[#71717b] xl:inline 2xl:hidden">{stepNumber}. </span>
            {step.title}
          </h3>
          <p className="text-base leading-6 text-[#71717b] sm:text-sm sm:leading-[22px] lg:text-base lg:leading-6">
            {step.description}
          </p>
          {step.note ? (
            <div className="flex max-w-[395px] items-start gap-2 pt-4 text-base leading-6 text-[#ff6467] sm:text-sm sm:leading-[22px] lg:gap-[10px] lg:pt-5 lg:text-base lg:leading-6">
              <span aria-hidden="true">※</span>
              <p>{step.note}</p>
            </div>
          ) : null}
        </div>
        <div className="relative h-[72px] w-full max-w-full overflow-hidden border border-[#09090b] bg-[#27272a]">
          <div className="h-full overflow-x-auto">
            <div className="flex h-full min-w-max items-center pl-5 pr-[88px] sm:pl-8 sm:pr-24 xl:pl-5 xl:pr-[88px] 2xl:pl-8 2xl:pr-24">
              <code className="whitespace-nowrap font-mono-display text-base leading-6 tracking-normal">
                {renderSegments(step.segments)}
              </code>
            </div>
          </div>
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
    <section className="border border-[#e4e4e7] bg-[#fafafa] scroll-mt-20" id="integration">
      <div className="flex flex-col gap-8 pt-10 sm:gap-12 sm:pt-20">
        <ClawSectionHeading
          description="Follow the same rhythm as a developer-tool homepage: read the steps once, copy the commands in order, and replace the API key only in step 02."
          eyebrow="Integration Guide"
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
                "border-t border-[#f4f4f5] px-5 py-6 sm:px-16 sm:py-10",
                index === integrationResources.length - 1 ? "border-b border-[#f4f4f5]" : ""
              )}
              key={resource.title}
            >
              <div className="space-y-4">
                <h3 className="text-lg font-bold leading-7 text-[#09090b] sm:text-2xl sm:leading-8">
                  {resource.title}
                </h3>
                <ResourceLink resource={resource} />
                <p className="max-w-[1120px] text-base leading-6 text-[#71717b] sm:text-xl sm:leading-7">
                  {resource.description}
                </p>
              </div>
            </div>
          ))}

          <div className="px-0 sm:px-0 sm:pl-[62px] lg:px-0 lg:pl-16 xl:px-16 2xl:px-0 2xl:pl-16">
            {integrationSteps.map((step) => (
              <IntegrationStepRow key={step.step} step={step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
