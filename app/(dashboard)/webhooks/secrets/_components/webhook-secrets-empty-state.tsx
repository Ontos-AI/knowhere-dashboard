import Image from "next/image";

type WebhookSecretsEmptyStateProps = {
  actionLabel?: string;
  description: string;
  onAction?: () => void;
  title: string;
};

const secondaryButtonClassName =
  "inline-flex h-9 items-center justify-center gap-1 border border-[#f4f4f5] border-b-4 bg-white px-3 pb-0.5 font-mono-display text-xs font-medium leading-5 text-[#27272a] transition-[transform,border-width,background-color] hover:border-b-[6px] hover:bg-[#fafafa] active:translate-y-[2px] active:border-b-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f22fe]/25 disabled:cursor-not-allowed disabled:border-[#e4e4e7] disabled:bg-[#f4f4f5] disabled:text-[#a1a1a1]";

export const WebhookSecretsEmptyState = ({
  actionLabel,
  description,
  onAction,
  title,
}: WebhookSecretsEmptyStateProps) => {
  return (
    <section className="flex min-h-[294px] w-full flex-col items-center justify-center gap-6 border border-[#e4e4e7] bg-white px-6 py-12 text-center">
      <Image
        src="/icons/webhooks/empty-state-webhook.svg"
        alt=""
        aria-hidden
        width={62}
        height={58}
        className="h-16 w-16"
      />

      <div className="flex flex-col items-center gap-1.5">
        <h2 className="text-base font-semibold leading-6 text-[#09090b]">{title}</h2>
        <p className="text-sm leading-5 text-[#a1a1a1]">{description}</p>
      </div>

      {actionLabel && onAction ? (
        <button type="button" className={secondaryButtonClassName} onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
};
