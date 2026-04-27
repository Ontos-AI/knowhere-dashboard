"use client";

import { cn } from "@lib/utils";
import type { APIKey } from "@server/external-api/api-keys";
import { formatDate } from "@utils/format";
import Image from "next/image";
import { useTranslations } from "next-intl";

type ApiKeysTableProps = {
  apiKeys: APIKey[];
  locale: string;
  onDelete: (keyId: string) => void;
  onToggle: (keyId: string) => void;
  timeZone: string;
};

const normalizeDateValue = (value: string) => {
  return /Z$|[+-]\d{2}:\d{2}$/.test(value) ? value : `${value}Z`;
};

const getApiKeyPreview = (key: APIKey) => {
  if (key.api_key) {
    const visiblePrefix = key.api_key.slice(0, 7);
    const visibleSuffix = key.api_key.slice(-4);
    const maskLength = Math.max(12, Math.min(25, key.api_key.length - 11));

    return `${visiblePrefix}${"•".repeat(maskLength)}${visibleSuffix}`;
  }

  return key.key_prefix || "sk_••••";
};

const isNeverExpiry = (expiresAt?: string) => {
  if (!expiresAt) {
    return true;
  }

  const parsedDate = new Date(normalizeDateValue(expiresAt));
  return !Number.isFinite(parsedDate.getTime()) || parsedDate.getFullYear() >= 9999;
};

const ToggleButton = ({
  checked,
  label,
  onPressedChange,
}: {
  checked: boolean;
  label: string;
  onPressedChange: () => void;
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onPressedChange}
      className={cn(
        "relative h-6 w-9 rounded-full p-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f22fe]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        checked ? "bg-[#00bc7d]" : "bg-[#9f9fa9]"
      )}
    >
      <span
        className={cn(
          "block h-4 w-4 rounded-full bg-white transition-transform",
          checked ? "translate-x-3" : "translate-x-0"
        )}
      />
    </button>
  );
};

export const ApiKeysTable = ({
  apiKeys,
  locale,
  onDelete,
  onToggle,
  timeZone,
}: ApiKeysTableProps) => {
  const t = useTranslations("ApiKeys");

  return (
    <section className="overflow-hidden border border-[#e4e4e7] bg-white">
      <div className="overflow-x-auto overflow-y-hidden [scrollbar-color:#e4e4e7_#f4f4f5] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-[#e4e4e7] [&::-webkit-scrollbar-track]:bg-[#f4f4f5]">
        <table className="min-w-[1196px] w-full table-fixed border-collapse">
          <colgroup>
            <col style={{ width: "calc((100% - 60px) / 6)" }} />
            <col style={{ width: "calc((100% - 60px) / 6)" }} />
            <col style={{ width: "calc((100% - 60px) / 6)" }} />
            <col style={{ width: "calc((100% - 60px) / 6)" }} />
            <col style={{ width: "calc((100% - 60px) / 6)" }} />
            <col style={{ width: "calc((100% - 60px) / 6)" }} />
            <col style={{ width: 60 }} />
          </colgroup>
          <thead>
            <tr className="border-b border-[#f4f4f5]">
              <th className="h-11 px-4 text-left text-sm font-medium leading-5 text-[#9f9fa9] sm:h-[38px] sm:px-[14px] sm:text-xs sm:leading-[18px] lg:h-11 lg:px-4 lg:text-sm lg:leading-5">
                {t("name")}
              </th>
              <th className="h-11 px-4 text-left text-sm font-medium leading-5 text-[#9f9fa9] sm:h-[38px] sm:px-[14px] sm:text-xs sm:leading-[18px] lg:h-11 lg:px-4 lg:text-sm lg:leading-5">
                {t("apiKey")}
              </th>
              <th className="h-11 px-4 text-left text-sm font-medium leading-5 text-[#9f9fa9] sm:h-[38px] sm:px-[14px] sm:text-xs sm:leading-[18px] lg:h-11 lg:px-4 lg:text-sm lg:leading-5">
                {t("status")}
              </th>
              <th className="h-11 px-4 text-left text-sm font-medium leading-5 text-[#9f9fa9] sm:h-[38px] sm:px-[14px] sm:text-xs sm:leading-[18px] lg:h-11 lg:px-4 lg:text-sm lg:leading-5">
                {t("created")}
              </th>
              <th className="h-11 px-4 text-left text-sm font-medium leading-5 text-[#9f9fa9] sm:h-[38px] sm:px-[14px] sm:text-xs sm:leading-[18px] lg:h-11 lg:px-4 lg:text-sm lg:leading-5">
                {t("lastUsed")}
              </th>
              <th className="h-11 px-4 text-left text-sm font-medium leading-5 text-[#9f9fa9] sm:h-[38px] sm:px-[14px] sm:text-xs sm:leading-[18px] lg:h-11 lg:px-4 lg:text-sm lg:leading-5">
                {t("expiration")}
              </th>
              <th className="sticky right-0 z-10 h-11 w-[60px] border-l border-[#f4f4f5] bg-white p-0 sm:h-[38px] lg:h-11" />
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((key) => {
              const apiKeyPreview = getApiKeyPreview(key);

              return (
                <tr key={key.id} className="border-b border-[#f4f4f5] last:border-b-0">
                  <td className="h-[52px] px-4 text-sm leading-5 text-[#09090b] sm:px-[14px] sm:text-xs sm:leading-[18px] lg:px-4 lg:text-sm lg:leading-5">
                    {key.name}
                  </td>
                  <td className="h-[52px] px-4 sm:px-[14px] lg:px-4">
                    <div className="inline-flex max-w-full items-center bg-[#f5f3ff] px-2 py-1 sm:max-w-[259px] sm:px-[6px] sm:py-0.5 lg:max-w-full lg:px-2 lg:py-1">
                      <code className="block truncate font-mono-readable text-sm leading-5 text-[#4d179a] sm:text-xs sm:leading-[18px] lg:text-sm lg:leading-5">
                        {apiKeyPreview}
                      </code>
                    </div>
                  </td>
                  <td className="h-[52px] px-4 sm:px-[14px] lg:px-4">
                    <div className="flex items-center gap-2 sm:gap-[6px] lg:gap-2">
                      <ToggleButton
                        checked={key.is_active}
                        label={`${key.name} ${key.is_active ? t("active") : t("disabled")}`}
                        onPressedChange={() => onToggle(key.id)}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium leading-5 sm:text-xs sm:leading-[18px] lg:text-sm lg:leading-5",
                          key.is_active ? "text-[#00bc7d]" : "text-[#9f9fa9]"
                        )}
                      >
                        {key.is_active ? t("active") : t("disabled")}
                      </span>
                    </div>
                  </td>
                  <td className="h-[52px] whitespace-nowrap px-4 text-sm leading-5 text-[#09090b] sm:px-[14px] sm:text-xs sm:leading-[18px] lg:px-4 lg:text-sm lg:leading-5">
                    {formatDate({
                      date: key.created_at,
                      format: "short",
                      locale,
                      timeZone,
                    })}
                  </td>
                  <td className="h-[52px] whitespace-nowrap px-4 text-sm leading-5 text-[#09090b] sm:px-[14px] sm:text-xs sm:leading-[18px] lg:px-4 lg:text-sm lg:leading-5">
                    {key.last_used_at
                      ? formatDate({
                          date: key.last_used_at,
                          format: "short",
                          locale,
                          timeZone,
                        })
                      : t("neverUsed")}
                  </td>
                  <td className="h-[52px] whitespace-nowrap px-4 text-sm leading-5 text-[#09090b] sm:px-[14px] sm:text-xs sm:leading-[18px] lg:px-4 lg:text-sm lg:leading-5">
                    {isNeverExpiry(key.expires_at)
                      ? t("neverExpires")
                      : formatDate({
                          date: key.expires_at as string,
                          format: "short",
                          locale,
                          timeZone,
                        })}
                  </td>
                  <td className="sticky right-0 z-10 h-[52px] w-[60px] border-l border-[#f4f4f5] bg-white p-0">
                    <button
                      type="button"
                      onClick={() => onDelete(key.id)}
                      className="flex h-[52px] w-[60px] items-center justify-center transition-colors hover:bg-[#fafafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f22fe]/25 focus-visible:ring-inset"
                      aria-label={`${t("delete")} ${key.name}`}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
