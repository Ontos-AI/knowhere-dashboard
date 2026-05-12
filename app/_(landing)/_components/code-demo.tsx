"use client";

import { PixelBadge } from "@app/_(landing)/_components/pixel/pixel-badge";
import { PixelHeading } from "@app/_(landing)/_components/pixel/pixel-heading";
import { useState } from "react";

type Token = {
  type: "keyword" | "string" | "number" | "comment" | "function" | "operator" | "text";
  value: string;
};

function highlightPython(code: string): Token[] {
  const tokens: Token[] = [];
  const keywords =
    /\b(import|from|def|class|if|elif|else|for|while|return|yield|try|except|finally|with|as|in|is|and|or|not|True|False|None|print)\b/g;
  const strings = /(["'])(?:(?=(\\?))\2.)*?\1/g;
  const numbers = /\b\d+\.?\d*\b/g;
  const comments = /#.*/g;
  const functions = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g;

  let lastIndex = 0;
  const matches: Array<{ index: number; length: number; type: Token["type"]; value: string }> = [];

  // Collect all matches
  let match: RegExpExecArray | null = null;

  match = strings.exec(code);
  while (match !== null) {
    matches.push({ index: match.index, length: match[0].length, type: "string", value: match[0] });
    match = strings.exec(code);
  }

  match = comments.exec(code);
  while (match !== null) {
    matches.push({ index: match.index, length: match[0].length, type: "comment", value: match[0] });
    match = comments.exec(code);
  }

  match = keywords.exec(code);
  while (match !== null) {
    matches.push({ index: match.index, length: match[0].length, type: "keyword", value: match[0] });
    match = keywords.exec(code);
  }

  match = numbers.exec(code);
  while (match !== null) {
    matches.push({ index: match.index, length: match[0].length, type: "number", value: match[0] });
    match = numbers.exec(code);
  }

  match = functions.exec(code);
  while (match !== null) {
    matches.push({
      index: match.index,
      length: match[1].length,
      type: "function",
      value: match[1],
    });
    match = functions.exec(code);
  }

  // Sort by index
  matches.sort((a, b) => a.index - b.index);

  // Remove overlapping matches (keep the first one)
  const filtered: typeof matches = [];
  let maxEnd = 0;
  for (const m of matches) {
    if (m.index >= maxEnd) {
      filtered.push(m);
      maxEnd = m.index + m.length;
    }
  }

  // Build tokens
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

function highlightBash(code: string): Token[] {
  const tokens: Token[] = [];
  const keywords = /\b(curl|wget|echo|cat|grep|sed|awk|cd|ls|mkdir|rm|cp|mv)\b/g;
  const strings = /(["'])(?:(?=(\\?))\2.)*?\1/g;
  const comments = /#.*/g;
  const flags = /\s(-[a-zA-Z]|--[a-zA-Z-]+)/g;

  let lastIndex = 0;
  const matches: Array<{ index: number; length: number; type: Token["type"]; value: string }> = [];

  // Collect all matches
  let match: RegExpExecArray | null = null;

  match = strings.exec(code);
  while (match !== null) {
    matches.push({ index: match.index, length: match[0].length, type: "string", value: match[0] });
    match = strings.exec(code);
  }

  match = comments.exec(code);
  while (match !== null) {
    matches.push({ index: match.index, length: match[0].length, type: "comment", value: match[0] });
    match = comments.exec(code);
  }

  match = keywords.exec(code);
  while (match !== null) {
    matches.push({ index: match.index, length: match[0].length, type: "keyword", value: match[0] });
    match = keywords.exec(code);
  }

  match = flags.exec(code);
  while (match !== null) {
    matches.push({
      index: match.index + 1,
      length: match[1].length,
      type: "operator",
      value: match[1],
    });
    match = flags.exec(code);
  }

  // Sort by index
  matches.sort((a, b) => a.index - b.index);

  // Remove overlapping matches
  const filtered: typeof matches = [];
  let maxEnd = 0;
  for (const m of matches) {
    if (m.index >= maxEnd) {
      filtered.push(m);
      maxEnd = m.index + m.length;
    }
  }

  // Build tokens
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

function SyntaxHighlighter({ code, language }: { code: string; language: "python" | "bash" }) {
  const tokens = language === "python" ? highlightPython(code) : highlightBash(code);

  return (
    <>
      {tokens.map((token, i) => {
        let className = "";
        switch (token.type) {
          case "keyword":
            className = "text-[#0070C1]"; // Deep blue for light background
            break;
          case "string":
            className = "text-[#A31515]"; // Deep red for light background
            break;
          case "number":
            className = "text-[#098658]"; // Deep green for light background
            break;
          case "comment":
            className = "text-[#6A737D]"; // Gray for light background
            break;
          case "function":
            className = "text-[#795E26]"; // Deep brown for light background
            break;
          case "operator":
            className = "text-[#AF00DB]"; // Deep purple for light background
            break;
          case "text":
            className = "text-[#24292E]"; // Dark gray/black for light background
            break;
        }
        return (
          <span key={`${token.type}-${token.value}-${i}`} className={className}>
            {token.value}
          </span>
        );
      })}
    </>
  );
}

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

export function CodeDemo() {
  const [activeTab, setActiveTab] = useState<CodeTab>("python");
  const [copied, setCopied] = useState(false);
  const codeByTab: Record<CodeTab, string> = {
    python: pythonCode,
    node: nodeCode,
    curl: curlCode,
  };
  const codeTabLabelMap: Record<CodeTab, string> = {
    python: "PYTHON",
    node: "NODE.JS",
    curl: "CURL",
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentCode = codeByTab[activeTab];

  return (
    <section className="py-16 md:py-24 bg-pixel-bg">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="min-w-0">
            <PixelHeading as="h3" className="mb-4">
              INTEGRATE IN MINUTES
            </PixelHeading>
            <p className="text-base text-pixel-muted font-sans mb-6 md:mb-8">
              Our API is designed to be intuitive and easy to use. Whether you&apos;re using Python,
              Node.js, or raw cURL, you can get started with just a few lines of code.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <PixelBadge color="green" className="shrink-0">
                  1
                </PixelBadge>
                <div>
                  <h3 className="font-pixel text-[10px] mb-1 leading-relaxed text-[var(--pixel-fg)] font-bold">
                    GET YOUR API KEY
                  </h3>
                  <p className="text-sm text-pixel-muted font-sans">
                    Sign up and generate your secure API key from the dashboard.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <PixelBadge color="green" className="shrink-0">
                  2
                </PixelBadge>
                <div>
                  <h3 className="font-pixel text-[10px] mb-1 leading-relaxed text-[var(--pixel-fg)] font-bold">
                    SUBMIT A JOB
                  </h3>
                  <p className="text-sm text-pixel-muted font-sans">
                    Send a URL or upload a file to our processing queue.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <PixelBadge color="green" className="shrink-0">
                  3
                </PixelBadge>
                <div>
                  <h3 className="font-pixel text-[10px] mb-1 leading-relaxed text-[var(--pixel-fg)] font-bold">
                    RECEIVE RESULTS
                  </h3>
                  <p className="text-sm text-pixel-muted font-sans">
                    Get structured JSON data via webhook or polling.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0 min-w-0 max-w-full">
            {/* macOS Window - Brutalist Style */}
            <div className="border-4 border-pixel-fg bg-white overflow-hidden max-w-full shadow-[12px_12px_0_#000]">
              {/* macOS Window Header */}
              <div className="flex items-center px-4 py-3 bg-white border-b-4 border-pixel-fg">
                {/* macOS Traffic Lights */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57] border-2 border-pixel-fg" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border-2 border-pixel-fg" />
                  <div className="w-3 h-3 rounded-full bg-[#28CA42] border-2 border-pixel-fg" />
                </div>
              </div>

              {/* Tab Bar */}
              <div className="flex items-center justify-between px-2 py-2 bg-[#f8f6f0] border-b-2 border-pixel-border">
                <div className="flex items-center gap-1">
                  {(["python", "node", "curl"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`font-pixel text-[9px] px-3 py-1.5 border-2 border-pixel-fg transition-colors ${
                        activeTab === tab
                          ? "bg-pixel-green text-white shadow-[3px_3px_0_#000]"
                          : "bg-white text-pixel-fg hover:bg-pixel-border"
                      }`}
                    >
                      {codeTabLabelMap[tab]}
                    </button>
                  ))}
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => copyToClipboard(currentCode)}
                  className="font-pixel text-[8px] text-pixel-fg mr-1 hover:text-pixel-green transition-colors"
                >
                  {copied ? "✓ COPIED" : "COPY"}
                </button>
              </div>

              {/* Code Content */}
              <div className="p-4 bg-[#f8f6f0] overflow-x-auto">
                <pre className="font-mono text-xs md:text-sm leading-relaxed">
                  <SyntaxHighlighter
                    code={currentCode}
                    language={activeTab === "python" ? "python" : "bash"}
                  />
                  <span className="inline-block w-[4px] h-[18px] bg-[#24292E] ml-1 translate-y-[3px] animate-pixel-blink" />
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
