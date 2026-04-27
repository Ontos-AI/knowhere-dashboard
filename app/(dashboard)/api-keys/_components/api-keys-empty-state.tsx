import Image from "next/image";

type ApiKeysEmptyStateProps = {
  actionLabel?: string;
  description: string;
  onAction?: () => void;
  title: string;
};

const secondaryButtonClassName =
  "inline-flex h-9 items-center justify-center gap-1 border border-[#f4f4f5] border-b-4 bg-white px-3 pb-0.5 font-mono-display text-xs font-medium leading-5 text-[#27272a] transition-[transform,border-width,background-color] hover:border-b-[6px] hover:bg-[#fafafa] active:translate-y-[2px] active:border-b-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f22fe]/25 sm:w-[122px] sm:border-b-[3px] sm:pb-px sm:hover:border-b-[5px] lg:w-auto lg:border-b-4 lg:pb-0.5 lg:hover:border-b-[6px]";

export const ApiKeysEmptyState = ({
  actionLabel,
  description,
  onAction,
  title,
}: ApiKeysEmptyStateProps) => {
  return (
    <section className="flex min-h-[294px] w-full flex-col items-center justify-center gap-6 border border-[#e4e4e7] bg-white px-6 py-12 text-center sm:min-h-[280px] lg:min-h-[294px]">
      <Image
        src="/icons/api-keys/empty-state-key.svg"
        alt=""
        aria-hidden
        width={64}
        height={64}
        className="h-16 w-16"
      />
      <div className="flex flex-col items-center gap-1.5">
        <h2 className="text-base font-semibold leading-6 text-[#09090b]">{title}</h2>
        <p className="text-sm leading-5 text-[#a1a1a1] sm:text-xs sm:leading-[18px] lg:text-sm lg:leading-5">
          {description}
        </p>
      </div>
      {actionLabel && onAction ? (
        <button type="button" className={secondaryButtonClassName} onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
};
