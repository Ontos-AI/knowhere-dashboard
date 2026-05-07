"use client";

import { cn } from "@lib/utils";
import { type ReactNode, useEffect, useId, useState } from "react";

const monoDisplayClassName = "font-[family-name:var(--font-mono-display)]";
const monoReadableClassName = "font-[family-name:var(--font-mono-readable)]";

type CodeTab = "python" | "curl";

const pythonCode = `import requests

url = "https://api.knowhereto.ai/v1/jobs"
headers = {
  "Authorization": f"Bearer {KNOWHERE_API_KEY}",
  "Content-Type": "application/json"
}
payload = {
  "source_type": "url",
  "source_url": "https://arxiv.org/pdf/1706.03762.pdf",
  "parsing_params": {
    "model": "base",
    "ocr_enabled": True
  }
}

response = requests.post(url, headers=headers, json=payload)
print(response.json())`;

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
  curl: curlCode,
} satisfies Record<CodeTab, string>;

const codeMarkupByTab = {
  python: (
    <>
      <span className="text-[#51a2ff]">import</span> requests{"\n\n"}
      url = <span className="text-[#ff6467]">"https://api.knowhereto.ai/v1/jobs"</span>
      {"\n"}
      headers = {"{"}
      {"\n"}
      {"  "}
      <span className="text-[#ff6467]">"Authorization"</span>:{" "}
      <span className="text-[#ff6467]">
        f"Bearer {"{"}KNOWHERE_API_KEY{"}"}"
      </span>
      ,{"\n"}
      {"  "}
      <span className="text-[#ff6467]">"Content-Type"</span>:{" "}
      <span className="text-[#ff6467]">"application/json"</span>
      {"\n"}
      {"}"}
      {"\n"}
      payload = {"{"}
      {"\n"}
      {"  "}
      <span className="text-[#ff6467]">"source_type"</span>:{" "}
      <span className="text-[#ff6467]">"url"</span>,{"\n"}
      {"  "}
      <span className="text-[#ff6467]">"source_url"</span>:{" "}
      <span className="text-[#ff6467]">"https://arxiv.org/pdf/1706.03762.pdf"</span>,{"\n"}
      {"  "}
      <span className="text-[#ff6467]">"parsing_params"</span>: {"{"}
      {"\n"}
      {"    "}
      <span className="text-[#ff6467]">"model"</span>:{" "}
      <span className="text-[#ff6467]">"base"</span>,{"\n"}
      {"    "}
      <span className="text-[#ff6467]">"ocr_enabled"</span>:{" "}
      <span className="text-[#51a2ff]">True</span>
      {"\n"}
      {"  "}
      {"}"}
      {"\n"}
      {"}"}
      {"\n\n"}
      response = requests.<span className="text-[#d08700]">post</span>(url, headers=headers,
      json=payload)
      {"\n"}
      <span className="text-[#51a2ff]">print</span>(response.
      <span className="text-[#d08700]">json</span>())
    </>
  ),
  curl: (
    <>
      <span className="text-[#51a2ff]">curl</span> -X POST{" "}
      <span className="text-[#ff6467]">https://api.knowhereto.ai/v1/jobs</span> {"\\"}
      {"\n"}
      {"  "}
      <span className="text-[#d08700]">--oauth2-bearer</span>{" "}
      <span className="text-[#ff6467]">"$KNOWHERE_API_KEY"</span> {"\\"}
      {"\n"}
      {"  "}
      <span className="text-[#d08700]">-H</span>{" "}
      <span className="text-[#ff6467]">"Content-Type: application/json"</span> {"\\"}
      {"\n"}
      {"  "}
      <span className="text-[#d08700]">-d</span> <span className="text-[#ff6467]">'{"{"}</span>
      {"\n"}
      {"    "}
      <span className="text-[#ff6467]">"source_type"</span>:{" "}
      <span className="text-[#ff6467]">"url"</span>,{"\n"}
      {"    "}
      <span className="text-[#ff6467]">"source_url"</span>:{" "}
      <span className="text-[#ff6467]">"https://arxiv.org/pdf/1706.03762.pdf"</span>,{"\n"}
      {"    "}
      <span className="text-[#ff6467]">"parsing_params"</span>: {"{"}
      {"\n"}
      {"      "}
      <span className="text-[#ff6467]">"model"</span>:{" "}
      <span className="text-[#ff6467]">"base"</span>,{"\n"}
      {"      "}
      <span className="text-[#ff6467]">"ocr_enabled"</span>:{" "}
      <span className="text-[#51a2ff]">true</span>
      {"\n"}
      {"    "}
      {"}"}
      {"\n"}
      <span className="text-[#ff6467]">'{"}"}</span>
    </>
  ),
} satisfies Record<CodeTab, ReactNode>;

export const IntegrateCodePanel = () => {
  const [activeTab, setActiveTab] = useState<CodeTab>("python");
  const [copied, setCopied] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const currentCode = codeByTab[activeTab];

  const handleTabChange = (tab: CodeTab) => {
    setActiveTab(tab);
    setCopied(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
  };

  return (
    <div className="min-w-0 overflow-hidden bg-zinc-800 text-zinc-50">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-[14px] py-[14px]">
        <div
          aria-label="Integration code examples"
          className="flex items-center gap-2"
          role="tablist"
        >
          {(["python", "curl"] as const).map((tab) => {
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
                {tab === "python" ? "Python" : "CURL"}
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
          {copied ? "Copied" : "Copy"}
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
            "min-w-0 break-words whitespace-pre-wrap text-xs leading-5 text-zinc-50 xl:min-w-[580px] xl:whitespace-pre",
            monoReadableClassName
          )}
        >
          <code>{codeMarkupByTab[activeTab]}</code>
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
