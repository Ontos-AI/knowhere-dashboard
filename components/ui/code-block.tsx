"use client";

import { Button } from "@components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import { cn } from "@lib/utils";
import { type ComponentProps, useEffect, useState } from "react";

export type CodeTab = {
  code: string;
  label: string;
  value: string;
};

export type CodeBlockProps = ComponentProps<"div"> & {
  copyLabel?: string;
  copySuccessLabel?: string;
  defaultValue?: string;
  tabs: CodeTab[];
};

export const CodeBlock = ({
  className,
  copyLabel = "Copy",
  copySuccessLabel = "Copied",
  defaultValue,
  tabs,
  ...props
}: CodeBlockProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue ?? tabs[0]?.value ?? "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const currentTab = tabs.find((tab) => tab.value === activeTab) ?? tabs[0];

  const handleCopy = async () => {
    if (!currentTab) {
      return;
    }

    await navigator.clipboard.writeText(currentTab.code);
    setCopied(true);
  };

  if (!currentTab) {
    return null;
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-zinc-950 bg-zinc-800 text-zinc-50 shadow-lg",
        className
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-zinc-700 p-4">
        <Tabs className="flex-1" onValueChange={setActiveTab} value={currentTab.value}>
          <TabsList className="justify-start" variant="code">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} variant="code">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button onClick={handleCopy} size="copy-code" type="button" variant="copy-code">
          {copied ? copySuccessLabel : copyLabel}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-6 text-zinc-50">
        <code>{currentTab.code}</code>
      </pre>
    </div>
  );
};
