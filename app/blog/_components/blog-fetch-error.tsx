"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type BlogFetchErrorProps = {
  readonly onRetry?: () => void;
};

export function BlogFetchError({ onRetry }: BlogFetchErrorProps) {
  const t = useTranslations("Blog");
  const router = useRouter();

  return (
    <div className="kb-empty kb-error" role="alert">
      <h3>{t("errorTitle")}</h3>
      <p>{t("errorDescription")}</p>
      <button onClick={() => (onRetry ? onRetry() : router.refresh())} type="button">
        {t("retry")}
      </button>
    </div>
  );
}
