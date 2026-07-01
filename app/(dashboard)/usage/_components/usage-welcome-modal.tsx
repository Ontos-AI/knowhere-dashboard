"use client";

import { DashboardActionButton } from "@app/(dashboard)/_components/dashboard-action-button";
import { dashboardDialogDesign } from "@app/(dashboard)/_components/dashboard-dialog-design";
import { useUsageWelcome } from "@app/(dashboard)/usage/_hooks/use-usage-welcome";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@components/ui/dialog";
import { useToast } from "@hooks/use-toast";
import { trackFeatureUsage } from "@lib/posthog";
import { cn } from "@lib/utils";
import { copyToClipboard } from "@utils/format";
import {
  Check,
  Copy,
  ExternalLink,
  KeyRound,
  Link2,
  Loader2,
  TerminalSquare,
  X,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Highlight, themes } from "prism-react-renderer";
import { useId, useState } from "react";
import { env } from "@/lib/env";

type WelcomeCodeTab = "curl" | "python" | "node" | "go";

const SAMPLE_PDF_URL = "https://arxiv.org/pdf/1706.03762.pdf";
const DOCUMENTATION_URL = "https://docs.knowhereto.ai/";

const codeTabConfig: Array<{
  id: WelcomeCodeTab;
  label: string;
  language: "bash" | "go" | "javascript" | "python";
}> = [
  { id: "python", label: "Python", language: "python" },
  { id: "node", label: "Node.js", language: "javascript" },
  { id: "curl", label: "cURL", language: "bash" },
  { id: "go", label: "Go", language: "go" },
];

const buildCodeByTab = ({
  apiBaseUrl,
  apiKey,
}: {
  apiBaseUrl: string;
  apiKey: string;
}): Record<WelcomeCodeTab, string> => ({
  curl: `curl -X POST ${apiBaseUrl}/v1/jobs \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "source_type": "url",
    "source_url": "${SAMPLE_PDF_URL}",
    "parsing_params": {
      "model": "base",
      "ocr_enabled": true
    }
  }'`,
  python: `# pip install knowhere-python-sdk
import knowhere

client = knowhere.Knowhere(
    api_key="${apiKey}",
    base_url="${apiBaseUrl}",
)

result = client.parse(url="${SAMPLE_PDF_URL}")

print(result.statistics.total_chunks)
print(result.full_markdown[:200])`,
  node: `// npm install @ontos-ai/knowhere-sdk
import Knowhere from "@ontos-ai/knowhere-sdk";

const client = new Knowhere({
  apiKey: "${apiKey}",
  baseURL: "${apiBaseUrl}",
});

const result = await client.parse({
  url: "${SAMPLE_PDF_URL}",
});

console.log("Text chunks:", result.textChunks.length);
console.log(result.textChunks[0]?.content);`,
  go: `package main

import (
  "bytes"
  "fmt"
  "io"
  "net/http"
)

func main() {
  body := []byte(\`{
    "source_type": "url",
    "source_url": "${SAMPLE_PDF_URL}",
    "parsing_params": {
      "model": "base",
      "ocr_enabled": true
    }
  }\`)

  req, _ := http.NewRequest("POST", "${apiBaseUrl}/v1/jobs", bytes.NewBuffer(body))
  req.Header.Set("Authorization", "Bearer ${apiKey}")
  req.Header.Set("Content-Type", "application/json")

  resp, _ := http.DefaultClient.Do(req)
  defer resp.Body.Close()

  result, _ := io.ReadAll(resp.Body)
  fmt.Println(string(result))
}`,
});

const FieldLabel = ({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-1.5 text-[12px] leading-[18px] text-[#09090b] lg:gap-2 lg:text-[14px] lg:leading-5">
      <span className="text-[#71717b] [&_svg]:size-[14px] lg:[&_svg]:size-4">{icon}</span>
      <span>{children}</span>
    </div>
  );
};

export const UsageWelcomeModal = () => {
  const t = useTranslations("UsageWelcome");
  const toast = useToast();
  const tabsId = useId();
  const { apiKey, dismiss, hasProvisionError, isDismissing, isOpen, isProvisioning } =
    useUsageWelcome();
  const [activeTab, setActiveTab] = useState<WelcomeCodeTab>("python");
  const apiBaseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  const canDismiss = Boolean(apiKey) || hasProvisionError;
  const codeByTab = apiKey
    ? buildCodeByTab({
        apiBaseUrl,
        apiKey,
      })
    : null;
  const currentCode = codeByTab ? codeByTab[activeTab] : "";

  const handleCopyApiKey = async () => {
    if (!apiKey) {
      return;
    }

    const isCopied = await copyToClipboard(apiKey);

    if (!isCopied) {
      toast.error(t("copyKeyFailed"));
      return;
    }

    toast.success(t("copyKeySuccess"));
    trackFeatureUsage("usage_welcome_copy_api_key");
  };

  const handleCopyCode = async () => {
    if (!currentCode) {
      return;
    }

    const isCopied = await copyToClipboard(currentCode);

    if (!isCopied) {
      toast.error(t("copyCodeFailed"));
      return;
    }

    toast.success(t("copyCodeSuccess"));
    trackFeatureUsage("usage_welcome_copy_sample_code", { tab: activeTab });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && canDismiss) {
          dismiss();
        }
      }}
    >
      <DialogContent className="w-screen max-w-none gap-0 rounded-none border-[#e4e4e7] bg-[#fafafa] p-0 shadow-none [&>button]:hidden sm:w-[560px] sm:max-w-[560px] lg:max-w-[724px]">
        <div className="max-h-[100dvh] overflow-y-auto">
          <div className="px-4 pb-8 pt-5 min-[375px]:px-[46px] min-[375px]:pb-[38px] min-[375px]:pt-[38px] sm:px-12 sm:pb-10 sm:pt-10 lg:px-12 lg:py-10">
            <div className="flex items-start justify-between gap-6 sm:gap-[30px]">
              <div className="min-w-0 flex-1 sm:max-w-[408px] lg:max-w-none">
                <DialogTitle className="text-[18px] font-bold leading-[26px] text-[#09090b] sm:text-[18px] sm:leading-[26px] sm:tracking-normal lg:text-[20px] lg:leading-7">
                  {t("title")}
                </DialogTitle>
                <DialogDescription className="mt-0.5 max-w-[34rem] text-[12px] leading-[18px] text-[#71717b] sm:mt-1 sm:max-w-[408px] sm:text-[12px] sm:leading-[18px] lg:mt-1.5 lg:max-w-[34rem] lg:text-[14px] lg:leading-5">
                  {t("descriptionPrefix")}{" "}
                  <span className="font-medium text-[#7f22fe]">{t("freeCredits")}</span>{" "}
                  {t("descriptionSuffix")}
                </DialogDescription>
              </div>

              <button
                type="button"
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-[#52525c] transition-colors hover:bg-[#f4f4f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e51ff]/25 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => {
                  if (canDismiss) {
                    dismiss();
                  }
                }}
                aria-label={t("close")}
                disabled={!canDismiss || isDismissing}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-[30px] space-y-[30px] sm:mt-10 sm:space-y-10 lg:mt-10 lg:space-y-8">
              <div className="space-y-[6px]">
                <FieldLabel icon={<Link2 className="h-4 w-4" strokeWidth={1.85} />}>
                  {t("baseUrl")}
                </FieldLabel>
                <div className="flex h-10 items-center border border-[#e4e4e7] bg-white px-[10px] font-mono-readable text-[12px] leading-[14px] text-[#9f9fa9] sm:h-10 sm:px-[10px] sm:py-0 sm:text-[12px] sm:leading-[14px] lg:text-[14px] lg:leading-5">
                  {apiBaseUrl}
                </div>
              </div>

              <div className="space-y-[6px]">
                <FieldLabel icon={<KeyRound className="h-4 w-4" strokeWidth={1.85} />}>
                  {t("apiKey")}
                </FieldLabel>
                <div className="border border-[#e4e4e7] bg-white px-[10px] py-[10px] font-mono-readable text-[12px] leading-[14px] text-[#09090b] min-[375px]:min-h-[34px] sm:min-h-10 sm:px-[10px] sm:py-3 sm:text-[12px] sm:leading-[14px] lg:text-[14px] lg:leading-5">
                  {apiKey ? (
                    <span className="break-all">{apiKey}</span>
                  ) : isProvisioning ? (
                    <span className="inline-flex items-center gap-2 text-[#71717b]">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("creatingKey")}
                    </span>
                  ) : (
                    <span className="text-[#71717b]">{t("apiKeyUnavailable")}</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <DashboardActionButton
                    type="button"
                    variant="secondary"
                    size="dialog"
                    className="h-9 min-w-[105px] sm:min-w-[129px] lg:min-w-[111px]"
                    onClick={() => {
                      void handleCopyApiKey();
                    }}
                    disabled={!apiKey || isDismissing}
                  >
                    <Copy className="h-4 w-4" strokeWidth={1.8} />
                    <span>{t("copyKey")}</span>
                  </DashboardActionButton>

                  {hasProvisionError ? (
                    <p className="text-[13px] leading-5 text-[#b91c1c] sm:text-[12px] sm:leading-[18px]">
                      {t("provisionError")}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="border-y border-[#e6defe] bg-[#f5f3ff]">
            <div className={dashboardDialogDesign.usageWelcome.codeTitleFrame}>
              <div className={dashboardDialogDesign.usageWelcome.codeIconTag}>
                <TerminalSquare
                  className="h-3 w-3 text-[#7f22fe] sm:h-5 sm:w-5 lg:h-4 lg:w-4"
                  strokeWidth={1.8}
                />
              </div>
              <p className={dashboardDialogDesign.usageWelcome.codeTitleText}>{t("codeTitle")}</p>
            </div>

            <div className={dashboardDialogDesign.usageWelcome.codePanelFrame}>
              <div className="overflow-hidden bg-[#27272a]">
                <div className="relative flex items-start gap-[10px] border-b border-[#3f3f46] px-[14px] py-[14px] sm:flex-wrap sm:items-center sm:gap-3 sm:px-4 sm:py-4 lg:gap-2">
                  <div
                    className="flex min-w-0 flex-nowrap items-center gap-[6px] overflow-x-auto pr-16 sm:flex-wrap sm:pr-0"
                    role="tablist"
                    aria-label={t("codeTabs")}
                  >
                    {codeTabConfig.map((tab) => {
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
                    className="absolute right-[14px] top-1/2 inline-flex -translate-y-1/2 items-center rounded-full bg-[#27272a] px-[14px] py-[6px] font-mono-display text-[12px] leading-4 text-[#a684ff] transition-colors hover:bg-[#3f3f46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a684ff] sm:static sm:ml-auto sm:h-9 sm:translate-y-0 sm:px-4 sm:py-2 sm:text-[14px] sm:leading-5 lg:h-auto lg:px-4 lg:py-2 lg:text-[12px] lg:leading-4"
                    onClick={() => {
                      void handleCopyCode();
                    }}
                    disabled={!currentCode}
                  >
                    {isProvisioning ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    <span>{t("copyCode")}</span>
                  </button>
                </div>

                <div
                  id={`${tabsId}-${activeTab}-panel`}
                  role="tabpanel"
                  aria-labelledby={`${tabsId}-${activeTab}-tab`}
                  className="overflow-x-auto p-[14px] sm:px-4 sm:py-4 lg:px-5 lg:py-5"
                >
                  {currentCode ? (
                    <Highlight
                      code={currentCode}
                      language={
                        codeTabConfig.find((tab) => tab.id === activeTab)?.language ?? "bash"
                      }
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
                  ) : (
                    <div className="flex min-h-[220px] items-center justify-center text-center text-[13px] leading-5 text-[#a1a1aa]">
                      {isProvisioning ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <span>{t("codeUnavailable")}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pb-0 pt-[38px] min-[375px]:px-[22px] min-[375px]:pb-0 min-[375px]:pt-[38px] sm:px-12 sm:pb-0 sm:pt-10 lg:px-12 lg:py-10">
            <DashboardActionButton
              asChild
              variant="primary"
              size="dialog"
              className={cn(
                "h-12 w-full justify-center min-[375px]:w-full sm:mx-auto sm:h-12 sm:w-[320px] sm:max-w-none sm:justify-center lg:max-w-[320px]",
                (!canDismiss || isDismissing) && "pointer-events-none opacity-60"
              )}
            >
              <Link
                href={DOCUMENTATION_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  if (canDismiss) {
                    dismiss();
                  }
                }}
              >
                <span>{t("viewDocumentation")}</span>
                <ExternalLink className="h-5 w-5" strokeWidth={2} />
              </Link>
            </DashboardActionButton>

            <button
              type="button"
              className="hidden"
              onClick={() => {
                if (canDismiss) {
                  dismiss();
                }
              }}
              disabled={!canDismiss || isDismissing}
            >
              <Check className="h-4 w-4" strokeWidth={1.8} />
              <span>{t("dismiss")}</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
