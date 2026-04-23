"use client";

import { useEffect, useRef, useState } from "react";
import type { InstallCard } from "@/app/_(landing)/claw/_components/plugin-content";

type Token = {
  type: "keyword" | "string" | "operator" | "path" | "text";
  value: string;
};

const tabLabels: Record<InstallCard["step"], string> = {
  "01": "INSTALL",
  "02": "API KEY",
  "03": "ENABLE",
};

function highlightShell(code: string): Token[] {
  const tokens: Token[] = [];
  const keywords = /\b(openclaw|plugins|install|config|set|enable)\b/g;
  const strings = /(["'])(?:(?=(\\?))\2.)*?\1/g;
  const paths = /\b[a-z]+(?:\.[a-zA-Z]+)+\b/g;
  const operators = /@ontos-ai\/knowhere-claw|\bknowhere\b/g;

  let lastIndex = 0;
  const matches: Array<{ index: number; length: number; type: Token["type"]; value: string }> = [];

  let match: RegExpExecArray | null = null;

  match = strings.exec(code);
  while (match !== null) {
    matches.push({ index: match.index, length: match[0].length, type: "string", value: match[0] });
    match = strings.exec(code);
  }

  match = operators.exec(code);
  while (match !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      type: "operator",
      value: match[0],
    });
    match = operators.exec(code);
  }

  match = keywords.exec(code);
  while (match !== null) {
    matches.push({ index: match.index, length: match[0].length, type: "keyword", value: match[0] });
    match = keywords.exec(code);
  }

  match = paths.exec(code);
  while (match !== null) {
    matches.push({ index: match.index, length: match[0].length, type: "path", value: match[0] });
    match = paths.exec(code);
  }

  matches.sort((a, b) => a.index - b.index);

  const filtered: typeof matches = [];
  let maxEnd = 0;
  for (const m of matches) {
    if (m.index >= maxEnd) {
      filtered.push(m);
      maxEnd = m.index + m.length;
    }
  }

  lastIndex = 0;
  for (const m of filtered) {
    if (m.index > lastIndex) {
      tokens.push({ type: "text", value: code.substring(lastIndex, m.index) });
    }
    tokens.push({ type: m.type, value: m.value });
    lastIndex = m.index + m.length;
  }

  if (lastIndex < code.length) {
    tokens.push({ type: "text", value: code.substring(lastIndex) });
  }

  return tokens;
}

function ShellSyntaxHighlighter({ code }: { code: string }) {
  const tokens = highlightShell(code);

  return (
    <>
      {tokens.map((token, index) => {
        let className = "text-[#24292E]";

        switch (token.type) {
          case "keyword":
            className = "text-[#0070C1]";
            break;
          case "string":
            className = "text-[#A31515]";
            break;
          case "operator":
            className = "text-[#098658]";
            break;
          case "path":
            className = "text-[#AF00DB]";
            break;
          case "text":
            className = "text-[#24292E]";
            break;
        }

        return (
          <span key={`${token.type}-${token.value}-${index}`} className={className}>
            {token.value}
          </span>
        );
      })}
    </>
  );
}

export function OpenClawShellDemo({ cards }: { cards: readonly InstallCard[] }) {
  const [activeStep, setActiveStep] = useState<InstallCard["step"]>(cards[0]?.step ?? "01");
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const activeCard = cards.find((card) => card.step === activeStep) ?? cards[0];

  const handleCopy = async () => {
    if (!activeCard) {
      return;
    }

    await navigator.clipboard.writeText(activeCard.command);
    setCopied(true);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      timeoutRef.current = null;
    }, 2000);
  };

  if (!activeCard) {
    return null;
  }

  return (
    <div className="relative min-w-0 max-w-full">
      <div className="max-w-full overflow-hidden border-[3px] border-pixel-fg bg-white shadow-[8px_8px_0_#000] sm:border-4 sm:shadow-[12px_12px_0_#000]">
        <div className="flex items-center gap-2 border-b-[3px] border-pixel-fg bg-white px-3 py-2.5 sm:gap-3 sm:border-b-4 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full border-2 border-pixel-fg bg-[#FF5F57] sm:h-3 sm:w-3" />
            <div className="h-2.5 w-2.5 rounded-full border-2 border-pixel-fg bg-[#FFBD2E] sm:h-3 sm:w-3" />
            <div className="h-2.5 w-2.5 rounded-full border-2 border-pixel-fg bg-[#28CA42] sm:h-3 sm:w-3" />
          </div>
          <span className="font-pixel text-[8px] uppercase tracking-[0.14em] text-pixel-fg sm:text-[9px] sm:tracking-[0.16em]">
            OpenClaw Shell
          </span>
        </div>

        <div className="flex flex-col gap-2 border-b-2 border-pixel-border bg-[#f8f6f0] px-2 py-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid grid-cols-3 gap-1 sm:flex sm:items-center sm:gap-1 sm:overflow-x-auto sm:pb-0">
            {cards.map((card) => (
              <button
                key={card.step}
                type="button"
                onClick={() => setActiveStep(card.step)}
                className={`min-h-11 border-2 border-pixel-fg px-1.5 py-1.5 font-pixel text-[8px] leading-[1.35] transition-colors sm:min-h-0 sm:shrink-0 sm:px-3 sm:text-[9px] ${
                  activeStep === card.step
                    ? "bg-pixel-green text-white shadow-[3px_3px_0_#000]"
                    : "bg-white text-pixel-fg hover:bg-pixel-border"
                }`}
              >
                <span className="block sm:inline">{card.step}</span>
                <span className="block sm:ml-1 sm:inline">{tabLabels[card.step]}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="mr-1 min-h-11 shrink-0 self-stretch border-2 border-pixel-fg bg-white px-3 font-pixel text-[8px] text-pixel-fg transition-colors hover:bg-pixel-border hover:text-pixel-green sm:min-h-0 sm:self-auto sm:border-0 sm:bg-transparent sm:px-0"
          >
            {copied ? "✓ COPIED" : "COPY"}
          </button>
        </div>

        <div className="border-b-2 border-pixel-border bg-[#fcfaf4] px-3 py-3 sm:px-4">
          <p className="font-pixel text-[9px] uppercase leading-relaxed tracking-[0.14em] text-pixel-fg">
            {activeCard.title}
          </p>
          <p className="mt-1 font-sans text-sm leading-6 text-pixel-muted">
            {activeCard.description}
          </p>
        </div>

        <div className="overflow-hidden bg-[#f8f6f0] p-3 sm:overflow-x-auto sm:p-4">
          <pre className="whitespace-pre-wrap break-all font-mono text-[10px] leading-5 sm:whitespace-pre sm:break-normal sm:text-xs sm:leading-relaxed md:text-sm">
            <span className="text-[#098658]">$ </span>
            <ShellSyntaxHighlighter code={activeCard.command} />
            <span className="ml-1 inline-block h-[18px] w-[4px] translate-y-[3px] animate-pixel-blink bg-[#24292E]" />
          </pre>
        </div>
      </div>
    </div>
  );
}
