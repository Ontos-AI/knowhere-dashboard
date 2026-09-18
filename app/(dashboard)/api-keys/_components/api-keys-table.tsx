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
        "relative h-6 w-9 rounded-full p-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19a88b]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? "bg-primary" : "bg-muted-foreground"
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
    <section className="overflow-hidden border border-border bg-card">
      <div className="overflow-x-auto overflow-y-hidden [scrollbar-color:hsl(var(--border))_hsl(var(--muted))] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-muted">
        <table className="w-[1224px] min-w-[1224px] table-fixed border-collapse">
          <colgroup>
            <col style={{ width: 120 }} />
            <col style={{ width: 336 }} />
            <col style={{ width: 160 }} />
            <col style={{ width: 240 }} />
            <col style={{ width: 160 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 88 }} />
          </colgroup>
          <thead>
            <tr className="border-b border-border">
              <th className="h-[38px] px-[14px] text-left text-xs font-medium leading-[18px] text-muted-foreground lg:h-11 lg:px-4 lg:text-sm lg:leading-5">
                {t("name")}
              </th>
              <th className="h-[38px] px-[14px] text-left text-xs font-medium leading-[18px] text-muted-foreground lg:h-11 lg:px-4 lg:text-sm lg:leading-5">
                {t("apiKey")}
              </th>
              <th className="h-[38px] px-[14px] text-left text-xs font-medium leading-[18px] text-muted-foreground lg:h-11 lg:px-4 lg:text-sm lg:leading-5">
                {t("status")}
              </th>
              <th className="h-[38px] px-[14px] text-left text-xs font-medium leading-[18px] text-muted-foreground lg:h-11 lg:px-4 lg:text-sm lg:leading-5">
                {t("created")}
              </th>
              <th className="h-[38px] px-[14px] text-left text-xs font-medium leading-[18px] text-muted-foreground lg:h-11 lg:px-4 lg:text-sm lg:leading-5">
                {t("lastUsed")}
              </th>
              <th className="h-[38px] px-[14px] text-left text-xs font-medium leading-[18px] text-muted-foreground lg:h-11 lg:px-4 lg:text-sm lg:leading-5">
                {t("expiration")}
              </th>
              <th className="h-[38px] p-0 lg:h-11" />
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((key) => {
              const apiKeyPreview = getApiKeyPreview(key);

              return (
                <tr
                  key={key.id}
                  className="border-b border-border last:border-b-0 dark:border-border"
                >
                  <td className="h-[52px] px-[14px] text-xs leading-[18px] text-foreground lg:px-4 lg:text-sm lg:leading-5">
                    {key.name}
                  </td>
                  <td className="h-[52px] px-[14px] lg:px-4">
                    <div className="inline-flex max-w-full items-center bg-[#caffee] px-[6px] py-0.5 lg:px-2 lg:py-1">
                      <code className="block truncate font-mono-readable text-xs leading-[18px] text-primary-dark lg:text-sm lg:leading-5">
                        {apiKeyPreview}
                      </code>
                    </div>
                  </td>
                  <td className="h-[52px] px-[14px] lg:px-4">
                    <div className="flex items-center gap-[6px] lg:gap-2">
                      <ToggleButton
                        checked={key.is_active}
                        label={`${key.name} ${key.is_active ? t("active") : t("disabled")}`}
                        onPressedChange={() => onToggle(key.id)}
                      />
                      <span
                        className={cn(
                          "text-xs font-medium leading-[18px] lg:text-sm lg:leading-5",
                          key.is_active ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {key.is_active ? t("active") : t("disabled")}
                      </span>
                    </div>
                  </td>
                  <td className="h-[52px] whitespace-nowrap px-[14px] text-xs leading-[18px] text-foreground lg:px-4 lg:text-sm lg:leading-5">
                    {formatDate({
                      date: key.created_at,
                      format: "short",
                      locale,
                      timeZone,
                    })}
                  </td>
                  <td className="h-[52px] whitespace-nowrap px-[14px] text-xs leading-[18px] text-foreground lg:px-4 lg:text-sm lg:leading-5">
                    {key.last_used_at
                      ? formatDate({
                          date: key.last_used_at,
                          format: "short",
                          locale,
                          timeZone,
                        })
                      : t("neverUsed")}
                  </td>
                  <td className="h-[52px] whitespace-nowrap px-[14px] text-xs leading-[18px] text-foreground lg:px-4 lg:text-sm lg:leading-5">
                    {isNeverExpiry(key.expires_at)
                      ? t("neverExpires")
                      : formatDate({
                          date: key.expires_at as string,
                          format: "short",
                          locale,
                          timeZone,
                        })}
                  </td>
                  <td className="h-[52px] p-0">
                    <button
                      type="button"
                      onClick={() => onDelete(key.id)}
                      className="flex h-[52px] w-12 items-center justify-center bg-card transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19a88b]/25 focus-visible:ring-inset dark:hover:bg-muted"
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
