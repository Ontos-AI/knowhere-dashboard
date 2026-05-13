"use client";

import { cn } from "@lib/utils";
import type { WebhookSecret } from "@server/external-api/webhook-secrets";
import { formatDate } from "@utils/format";
import Image from "next/image";
import { useTranslations } from "next-intl";

type WebhookSecretsTableProps = {
  locale: string;
  onRevoke: (id: string) => void;
  secrets: WebhookSecret[];
  timeZone: string;
};

export const WebhookSecretsTable = ({
  locale,
  onRevoke,
  secrets,
  timeZone,
}: WebhookSecretsTableProps) => {
  const t = useTranslations("Webhooks");

  return (
    <section className="overflow-hidden border border-[#e4e4e7] bg-white dark:border-[#3f3f46] dark:bg-[#18181b]">
      <div className="overflow-x-auto overflow-y-hidden [scrollbar-color:#e4e4e7_#f4f4f5] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-[#e4e4e7] [&::-webkit-scrollbar-track]:bg-[#f4f4f5]">
        <table className="w-[951px] min-w-[951px] table-fixed border-collapse">
          <colgroup>
            <col style={{ width: 230 }} />
            <col style={{ width: 209 }} />
            <col style={{ width: 160 }} />
            <col style={{ width: 304 }} />
            <col style={{ width: 48 }} />
          </colgroup>
          <thead>
            <tr className="border-b border-[#f4f4f5] dark:border-[#27272a]">
              <th className="h-[38px] px-[14px] text-left text-xs font-medium leading-[18px] text-[#9f9fa9] lg:h-11 lg:px-4 lg:text-sm lg:leading-5">
                {t("maskedSecret")}
              </th>
              <th className="h-[38px] px-[14px] text-left text-xs font-medium leading-[18px] text-[#9f9fa9] lg:h-11 lg:px-4 lg:text-sm lg:leading-5">
                {t("endpointUrl")}
              </th>
              <th className="h-[38px] px-[14px] text-left text-xs font-medium leading-[18px] text-[#9f9fa9] lg:h-11 lg:px-4 lg:text-sm lg:leading-5">
                {t("status")}
              </th>
              <th className="h-[38px] px-[14px] text-left text-xs font-medium leading-[18px] text-[#9f9fa9] lg:h-11 lg:px-4 lg:text-sm lg:leading-5">
                {t("createdAt")}
              </th>
              <th className="sticky right-0 z-10 h-[38px] w-12 border-l border-[#f4f4f5] bg-white p-0 dark:border-[#27272a] dark:bg-[#18181b] lg:h-11" />
            </tr>
          </thead>
          <tbody>
            {secrets.map((secret) => (
              <tr
                key={secret.id}
                className="border-b border-[#f4f4f5] last:border-b-0 dark:border-[#27272a]"
              >
                <td className="h-[52px] px-[14px] lg:px-4">
                  <div className="inline-flex max-w-full items-center bg-[#f5f3ff] px-[6px] py-0.5 lg:px-2 lg:py-1">
                    <code className="block truncate font-mono-readable text-xs leading-[18px] text-[#4d179a] lg:text-sm lg:leading-5">
                      {secret.secret_masked}
                    </code>
                  </div>
                </td>
                <td className="h-[52px] whitespace-nowrap px-[14px] text-xs leading-[18px] text-[#09090b] dark:text-[#fafafa] lg:px-4 lg:text-sm lg:leading-5">
                  <span>{secret.endpoint?.trim() || t("defaultEndpoint")}</span>
                </td>
                <td className="h-[52px] px-[14px] lg:px-4">
                  <span
                    className={cn(
                      "text-xs font-medium leading-[18px] lg:text-sm lg:leading-5",
                      secret.status === "active" ? "text-[#00bc7d]" : "text-[#fd9a00]"
                    )}
                  >
                    {secret.status === "active" ? t("statusActive") : t("statusRevoked")}
                  </span>
                </td>
                <td className="h-[52px] whitespace-nowrap px-[14px] text-xs leading-[18px] text-[#09090b] dark:text-[#fafafa] lg:px-4 lg:text-sm lg:leading-5">
                  {formatDate({
                    date: secret.created_at,
                    format: "short",
                    locale,
                    timeZone,
                  })}
                </td>
                <td className="sticky right-0 z-10 h-[52px] w-12 border-l border-[#f4f4f5] bg-white p-0 dark:border-[#27272a] dark:bg-[#18181b]">
                  <button
                    type="button"
                    onClick={() => onRevoke(secret.id)}
                    className="flex h-[52px] w-12 items-center justify-center transition-colors hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f22fe]/25 focus-visible:ring-inset dark:hover:bg-[#27272a]"
                    aria-label={t("revokeSecret")}
                  >
                    <Image
                      src="/icons/api-keys/delete-row.svg"
                      alt=""
                      aria-hidden
                      width={20}
                      height={20}
                      className="h-5 w-5"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
