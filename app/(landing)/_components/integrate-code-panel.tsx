"use client";

import { trackLandingInteraction } from "@app/(landing)/_components/landing-tracked-link";
import { trackFeatureUsage } from "@lib/posthog";
import { cn } from "@lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";

const monoDisplayClassName = "font-[family-name:var(--font-mono-display)]";
const monoReadableClassName = "font-[family-name:var(--font-mono-readable)]";

type CodeTab = "python" | "node" | "curl";

const pythonCode = `# pip install knowhere-python-sdk
import knowhere

client = knowhere.Knowhere(api_key="sk_...")

result = client.parse(url="https://arxiv.org/pdf/1706.03762.pdf")

print(result.statistics.total_chunks)
print(result.full_markdown[:200])`;

const nodeCode = `// npm install @ontos-ai/knowhere-sdk
import Knowhere from "@ontos-ai/knowhere-sdk";

const client = new Knowhere({
  apiKey: "sk_...",
});

const result = await client.parse({
  url: "https://arxiv.org/pdf/1706.03762.pdf",
});

console.log("Text chunks:", result.textChunks.length);
console.log(result.textChunks[0]?.content);`;

const curlCode = `curl -X POST https://api.knowhereto.ai/v1/jobs \\
  --oauth2-bearer "$KNOWHERE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "source_type": "url",
    "source_url": "https://arxiv.org/pdf/1706.03762.pdf",
    "parsing_params": {
      "model": "base",
      "ocr_enabled": true
    }
  }'`;

const codeByTab = {
  python: pythonCode,
  node: nodeCode,
  curl: curlCode,
} satisfies Record<CodeTab, string>;

const codeTabLabelMap: Record<CodeTab, string> = {
  python: "Python",
  node: "Node.js",
  curl: "CURL",
};

export const IntegrateCodePanel = () => {
  const [activeTab, setActiveTab] = useState<CodeTab>("python");
  const [hasCopiedCode, setHasCopiedCode] = useState(false);
  const locale = useLocale();
  const t = useTranslations("Landing.integrationCode");
  const panelId = useId();

  useEffect(() => {
    if (!hasCopiedCode) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setHasCopiedCode(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [hasCopiedCode]);

  const currentCode = codeByTab[activeTab];

  const handleTabChange = (tab: CodeTab) => {
    setActiveTab(tab);
    setHasCopiedCode(false);
    trackLandingInteraction("integration_lang_tab", "integration", locale, { tab });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setHasCopiedCode(true);
    trackFeatureUsage("integration_code_copy", { tab: activeTab, locale });
    trackLandingInteraction("integration_copy", "integration", locale, { tab: activeTab });
  };

  return (
    <div className="min-w-0 overflow-hidden bg-zinc-800 text-zinc-50">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-[14px] py-[14px]">
        <div aria-label={t("tabListLabel")} className="flex items-center gap-2" role="tablist">
          {(["python", "node", "curl"] as const).map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                aria-controls={`${panelId}-${tab}-panel`}
                aria-selected={isActive}
                className={cn(
                  "px-3 py-2 text-xs leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a684ff]",
                  monoDisplayClassName,
                  isActive
                    ? "bg-zinc-50 text-zinc-950"
                    : "bg-zinc-700 text-zinc-50 hover:bg-zinc-600 active:bg-zinc-500"
                )}
                id={`${panelId}-${tab}-tab`}
                onClick={() => handleTabChange(tab)}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                type="button"
              >
                {codeTabLabelMap[tab]}
              </button>
            );
          })}
        </div>
        <button
          className={cn(
            "rounded-full px-4 py-2 text-xs leading-4 text-[#a684ff] transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a684ff]",
            monoDisplayClassName
          )}
          onClick={handleCopy}
          type="button"
        >
          {hasCopiedCode ? t("copied") : t("copy")}
        </button>
      </div>
      <div
        aria-labelledby={`${panelId}-${activeTab}-tab`}
        className="integrate-scrollbar-dark max-h-[520px] overflow-x-auto overflow-y-auto px-[14px] py-[14px]"
        id={`${panelId}-${activeTab}-panel`}
        role="tabpanel"
      >
        <pre
          className={cn(
            "min-w-0 break-words whitespace-pre-wrap text-xs leading-4 text-zinc-50 xl:min-w-[580px] xl:whitespace-pre",
            monoReadableClassName
          )}
        >
          <code>{currentCode}</code>
        </pre>
      </div>
      <style jsx>{`
        .integrate-scrollbar-dark {
          scrollbar-color: #52525b #27272a;
          scrollbar-width: thin;
        }

        .integrate-scrollbar-dark::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .integrate-scrollbar-dark::-webkit-scrollbar-track {
          background: #27272a;
          border-radius: 0;
        }

        .integrate-scrollbar-dark::-webkit-scrollbar-corner {
          background: #27272a;
        }

        .integrate-scrollbar-dark::-webkit-scrollbar-thumb {
          background: #52525b;
          border: none;
          border-radius: 0;
          opacity: 1;
          min-height: 28px;
          min-width: 28px;
          transition: background-color 160ms ease, opacity 160ms ease;
        }

        .integrate-scrollbar-dark::-webkit-scrollbar-thumb:hover {
          background: #71717a;
        }

        .integrate-scrollbar-dark::-webkit-scrollbar-thumb:active {
          background: #71717a;
          opacity: 0.6;
        }

        .integrate-scrollbar-dark:hover::-webkit-scrollbar-thumb:active {
          background: #71717a;
          opacity: 0.6;
        }

        .integrate-scrollbar-dark::-webkit-scrollbar-track:vertical {
          border-left: 1px solid #3f3f46;
        }

        .integrate-scrollbar-dark::-webkit-scrollbar-track:horizontal {
          border-top: 1px solid #3f3f46;
        }
      `}</style>
    </div>
  );
};
