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
    <section className="overflow-hidden border border-[#e4e4e7] bg-white">
      <div className="overflow-x-auto overflow-y-hidden [scrollbar-color:#e4e4e7_#f4f4f5] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-[#e4e4e7] [&::-webkit-scrollbar-track]:bg-[#f4f4f5]">
        <table className="min-w-[963px] w-full table-fixed border-collapse">
          <colgroup>
            <col style={{ width: "calc((100% - 60px) / 4)" }} />
            <col style={{ width: "calc((100% - 60px) / 4)" }} />
            <col style={{ width: "calc((100% - 60px) / 4)" }} />
            <col style={{ width: "calc((100% - 60px) / 4)" }} />
            <col style={{ width: 60 }} />
          </colgroup>
          <thead>
            <tr className="border-b border-[#f4f4f5]">
              <th className="h-11 px-4 text-left text-sm font-medium leading-5 text-[#9f9fa9]">
                {t("maskedSecret")}
              </th>
              <th className="h-11 px-4 text-left text-sm font-medium leading-5 text-[#9f9fa9]">
                {t("endpointUrl")}
              </th>
              <th className="h-11 px-4 text-left text-sm font-medium leading-5 text-[#9f9fa9]">
                {t("status")}
              </th>
              <th className="h-11 px-4 text-left text-sm font-medium leading-5 text-[#9f9fa9]">
                {t("createdAt")}
              </th>
              <th className="sticky right-0 z-10 h-11 w-[60px] border-l border-[#f4f4f5] bg-white p-0" />
            </tr>
          </thead>
          <tbody>
            {secrets.map((secret) => (
              <tr key={secret.id} className="border-b border-[#f4f4f5] last:border-b-0">
                <td className="h-[52px] px-4">
                  <div className="inline-flex max-w-full items-center bg-[#f5f3ff] px-2 py-1">
                    <code className="block truncate font-mono-readable text-sm leading-5 text-[#4d179a]">
                      {secret.secret_masked}
                    </code>
                  </div>
                </td>
                <td className="h-[52px] px-4 text-sm leading-5 text-[#09090b]">
                  <span className="block truncate">
                    {secret.endpoint?.trim() || t("defaultEndpoint")}
                  </span>
                </td>
                <td className="h-[52px] px-4">
                  <span
                    className={cn(
                      "text-sm font-medium leading-5",
                      secret.status === "active" ? "text-[#00bc7d]" : "text-[#fd9a00]"
                    )}
                  >
                    {secret.status === "active" ? t("statusActive") : t("statusRevoked")}
                  </span>
                </td>
                <td className="h-[52px] whitespace-nowrap px-4 text-sm leading-5 text-[#09090b]">
                  {formatDate({
                    date: secret.created_at,
                    format: "short",
                    locale,
                    timeZone,
                  })}
                </td>
                <td className="sticky right-0 z-10 h-[52px] w-[60px] border-l border-[#f4f4f5] bg-white p-0">
                  <button
                    type="button"
                    onClick={() => onRevoke(secret.id)}
                    className="flex h-[52px] w-[60px] items-center justify-center transition-colors hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f22fe]/25 focus-visible:ring-inset"
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
