"use client";

import { PixelBadge } from "@app/(landing)/_components/pixel/pixel-badge";
import { PixelHeading } from "@app/(landing)/_components/pixel/pixel-heading";
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
            className = "text-[#569CD6]"; // VS Code blue
            break;
          case "string":
            className = "text-[#CE9178]"; // VS Code orange
            break;
          case "number":
            className = "text-[#B5CEA8]"; // VS Code light green
            break;
          case "comment":
            className = "text-[#6A9955]"; // VS Code green
            break;
          case "function":
            className = "text-[#DCDCAA]"; // VS Code yellow
            break;
          case "operator":
            className = "text-[#C586C0]"; // VS Code purple
            break;
          case "text":
            className = "text-[#D4D4D4]"; // VS Code light gray
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

const pythonCode = `import requests

url = "https://api.knowhereto.ai/v1/jobs"
headers = {
    "Authorization": "Bearer ***REMOVED***",
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
  -H "Authorization: Bearer ***REMOVED***" \\
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
  const [activeTab, setActiveTab] = useState<"python" | "curl">("python");
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentCode = activeTab === "python" ? pythonCode : curlCode;

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
                <PixelBadge color="green">1</PixelBadge>
                <div>
                  <h3 className="font-pixel text-[10px] mb-1 leading-relaxed">GET YOUR API KEY</h3>
                  <p className="text-sm text-pixel-muted font-sans">
                    Sign up and generate your secure API key from the dashboard.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <PixelBadge color="green">2</PixelBadge>
                <div>
                  <h3 className="font-pixel text-[10px] mb-1 leading-relaxed">SUBMIT A JOB</h3>
                  <p className="text-sm text-pixel-muted font-sans">
                    Send a URL or upload a file to our processing queue.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <PixelBadge color="green">3</PixelBadge>
                <div>
                  <h3 className="font-pixel text-[10px] mb-1 leading-relaxed">RECEIVE RESULTS</h3>
                  <p className="text-sm text-pixel-muted font-sans">
                    Get structured JSON data via webhook or polling.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0 min-w-0 max-w-full">
            {/* Terminal Window */}
            <div className="pixel-border-double bg-pixel-fg overflow-hidden max-w-full">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b-2 border-pixel-border">
                {/* Tab Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("python")}
                    className={`font-pixel text-[10px] px-3 py-1 transition-none ${
                      activeTab === "python"
                        ? "text-pixel-green"
                        : "text-pixel-muted hover:text-pixel-bg"
                    }`}
                  >
                    PYTHON
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("curl")}
                    className={`font-pixel text-[10px] px-3 py-1 transition-none ${
                      activeTab === "curl"
                        ? "text-pixel-green"
                        : "text-pixel-muted hover:text-pixel-bg"
                    }`}
                  >
                    CURL
                  </button>
                </div>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={() => copyToClipboard(currentCode)}
                  className="font-pixel text-[8px] text-pixel-yellow hover:text-pixel-bg transition-none"
                >
                  {copied ? "COPIED!" : "COPY"}
                </button>
              </div>

              {/* Code Content */}
              <div className="p-4 overflow-x-auto">
                <pre className="font-mono text-xs md:text-sm leading-relaxed">
                  <SyntaxHighlighter
                    code={currentCode}
                    language={activeTab === "python" ? "python" : "bash"}
                  />
                  <span className="inline-block w-2 h-4 bg-[#D4D4D4] ml-1 animate-pixel-blink">
                    █
                  </span>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
