import { DashboardActionButton } from "@app/(dashboard)/_components/dashboard-action-button";
import Image from "next/image";

type ApiKeysEmptyStateProps = {
  actionLabel?: string;
  description: string;
  onAction?: () => void;
  title: string;
};

export const ApiKeysEmptyState = ({
  actionLabel,
  description,
  onAction,
  title,
}: ApiKeysEmptyStateProps) => {
  return (
    <section className="flex min-h-[272px] w-full flex-col items-center justify-center gap-[22px] border border-[#e4e4e7] bg-white px-6 py-[46px] text-center dark:border-[#3f3f46] dark:bg-[#18181b] sm:min-h-[280px] sm:gap-[22px] sm:py-[46px] lg:min-h-[294px] lg:gap-6 lg:py-12">
      <Image
        src="/icons/api-keys/empty-state-key.svg"
        alt=""
        aria-hidden
        width={64}
        height={64}
        className="h-16 w-16"
      />
      <div className="flex flex-col items-center gap-1 sm:gap-1 lg:gap-1.5">
        <h2 className="text-xs font-semibold leading-[18px] text-[#09090b] dark:text-[#fafafa] sm:text-sm sm:leading-[22px] lg:text-base lg:leading-6">
          {title}
        </h2>
        <p className="text-xs leading-[14px] text-[#a1a1a1] dark:text-[#a1a1a1] sm:leading-[18px] lg:text-sm lg:leading-5">
          {description}
        </p>
      </div>
      {actionLabel && onAction ? (
        <DashboardActionButton
          type="button"
          variant="secondary"
          size="compact"
          className="w-[122px] sm:w-[122px] lg:w-auto"
          onClick={onAction}
        >
          {actionLabel}
        </DashboardActionButton>
      ) : null}
    </section>
  );
};
