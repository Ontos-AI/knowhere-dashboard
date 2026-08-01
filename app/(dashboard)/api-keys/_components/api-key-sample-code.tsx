"use client";

import { DashboardCopyIcon } from "@app/(dashboard)/_components/dashboard-modal-primitives";
import { useToast } from "@hooks/use-toast";
import { buildCodeByTab, type SampleCodeTab, sampleCodeTabConfig } from "@lib/sample-code";
import { cn } from "@lib/utils";
import { copyToClipboard } from "@utils/format";
import { TerminalSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Highlight, themes } from "prism-react-renderer";
import { useId, useState } from "react";
import { env } from "@/lib/env";

const PLACEHOLDER_API_KEY = "YOUR_API_KEY";

export const ApiKeySampleCode = () => {
  const t = useTranslations("ApiKeys");
  const toast = useToast();
  const tabsId = useId();
  const [activeTab, setActiveTab] = useState<SampleCodeTab>("python");
  const apiBaseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  const codeByTab = buildCodeByTab({
    apiBaseUrl,
    apiKey: PLACEHOLDER_API_KEY,
  });
  const currentCode = codeByTab[activeTab];

  const handleCopyCode = async () => {
    const isCopied = await copyToClipboard(currentCode);

    if (!isCopied) {
      toast.error(t("copyCodeFailed"));
      return;
    }

    toast.success(t("copyCodeSuccess"));
  };

  return (
    <section className="overflow-hidden border border-[#e6defe] bg-[#f5f3ff]">
      <div className="flex items-center gap-2 px-4 pb-4 pt-[14px] lg:gap-3 lg:px-5 lg:pt-4">
        <div className="flex size-8 items-center justify-center border border-[#ddd6fe] bg-[#ede9fe] lg:size-9">
          <TerminalSquare className="h-3.5 w-3.5 text-[#7f22fe]" strokeWidth={1.8} />
        </div>
        <p className="text-[14px] font-medium leading-[22px] text-[#09090b] dark:text-[#fafafa] lg:text-[16px] lg:leading-6">
          {t("codeTitle")}
        </p>
      </div>

      <div className="px-4 pb-6 pt-0 lg:px-5 lg:pb-7">
        <div className="overflow-hidden bg-[#27272a]">
          <div className="relative flex items-start gap-[10px] border-b border-[#3f3f46] px-[14px] py-[14px] sm:flex-wrap sm:items-center sm:gap-3 sm:px-4 sm:py-4 lg:gap-2">
            <div
              className="flex min-w-0 flex-nowrap items-center gap-[6px] overflow-x-auto pr-16 sm:flex-wrap sm:pr-0"
              role="tablist"
              aria-label={t("codeTabs")}
            >
              {sampleCodeTabConfig.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    id={`${tabsId}-${tab.id}-tab`}
                    role="tab"
                    aria-controls={`${tabsId}-${tab.id}-panel`}
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    className={cn(
                      "min-h-[26px] shrink-0 px-[10px] py-[6px] font-mono-display text-[12px] leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a684ff] sm:min-h-9 sm:px-3 sm:py-2 sm:text-[14px] sm:leading-5 lg:min-h-8 lg:text-[12px] lg:leading-4",
                      isActive ? "bg-[#fafafa] text-[#09090b]" : "bg-[#3f3f46] text-[#fafafa]"
                    )}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="absolute right-[14px] top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-full bg-[#27272a] px-[14px] py-[6px] font-mono-display text-[12px] leading-4 text-[#a684ff] transition-colors hover:bg-[#3f3f46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a684ff] sm:static sm:ml-auto sm:h-9 sm:translate-y-0 sm:px-4 sm:py-2 sm:text-[14px] sm:leading-5 lg:h-auto lg:px-4 lg:py-2 lg:text-[12px] lg:leading-4"
              onClick={() => {
                void handleCopyCode();
              }}
            >
              <DashboardCopyIcon className="size-4" />
              <span>{t("copyCode")}</span>
            </button>
          </div>

          <div
            id={`${tabsId}-${activeTab}-panel`}
            role="tabpanel"
            aria-labelledby={`${tabsId}-${activeTab}-tab`}
            className="overflow-x-auto p-[14px] sm:px-4 sm:py-4 lg:px-5 lg:py-5"
          >
            <Highlight
              code={currentCode}
              language={sampleCodeTabConfig.find((tab) => tab.id === activeTab)?.language ?? "bash"}
              theme={themes.vsDark}
            >
              {({ className, getLineProps, getTokenProps, tokens }) => (
                <pre
                  className={cn(
                    className,
                    "min-w-max bg-transparent p-0 font-mono-readable text-[12px] leading-[18px] text-[#fafafa] sm:text-[14px] sm:leading-5 lg:text-[13px]"
                  )}
                >
                  {tokens.map((line, lineIndex) => (
                    <div key={`line-${lineIndex + 1}`} {...getLineProps({ line })}>
                      {line.map((token, tokenIndex) => (
                        <span
                          key={`token-${lineIndex + 1}-${tokenIndex + 1}`}
                          {...getTokenProps({ token })}
                        />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </div>
      </div>
    </section>
  );
};
