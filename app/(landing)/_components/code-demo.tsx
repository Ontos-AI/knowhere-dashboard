"use client";

import { Button } from "@components/ui/button";
import { ScrollArea } from "@components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Check, Copy } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { useState } from "react";

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
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const CodeBlock = ({ code, language }: { code: string; language: string }) => (
    <Highlight theme={themes.vsDark} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          style={{ ...style, background: "transparent" }}
          className={`${className} font-mono text-xs md:text-sm leading-relaxed overflow-x-auto`}
        >
          {tokens.map((line, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: prism-react-renderer tokens don't have unique IDs
            <div key={`line-${i}`} {...getLineProps({ line })}>
              {line.map((token, tokenIndex) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: prism-react-renderer tokens don't have unique IDs
                <span key={`line-${i}-token-${tokenIndex}`} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="min-w-0">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 md:mb-6">
              Integrate in minutes, not days
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
              Our API is designed to be intuitive and easy to use. Whether you're using Python,
              Node.js, or raw cURL, you can get started with just a few lines of code.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <span className="font-bold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Get your API Key</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Sign up and generate your secure API key from the dashboard.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <span className="font-bold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Submit a Job</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Send a URL or upload a file to our processing queue.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <span className="font-bold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Receive Results</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Get structured JSON data via webhook or polling.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0 min-w-0 max-w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-xl md:rounded-2xl blur-lg md:blur-xl opacity-10 md:opacity-20" />
            <div className="relative bg-card border rounded-lg md:rounded-xl overflow-hidden shadow-xl md:shadow-2xl bg-[#1e1e1e] max-w-full">
              <Tabs defaultValue="python" className="w-full">
                <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-2.5 border-b border-white/10 bg-white/5">
                  <TabsList className="bg-white/5 border-0 h-auto">
                    <TabsTrigger
                      value="python"
                      className="text-gray-400 hover:text-gray-200 transition-colors py-2.5 px-4 min-h-[44px] touch-manipulation"
                    >
                      Python
                    </TabsTrigger>
                    <TabsTrigger
                      value="curl"
                      className="text-gray-400 hover:text-gray-200 transition-colors py-2.5 px-4 min-h-[44px] touch-manipulation"
                    >
                      cURL
                    </TabsTrigger>
                  </TabsList>
                  <div className="hidden md:flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/20" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
                    <div className="h-3 w-3 rounded-full bg-green-500/20" />
                  </div>
                </div>

                <TabsContent value="python" className="mt-0">
                  <div className="relative group">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 md:top-4 md:right-4 h-9 w-9 md:h-8 md:w-8 text-gray-400 hover:text-white hover:bg-white/10 md:opacity-0 md:group-hover:opacity-100 transition-all touch-manipulation active:scale-95 z-10"
                      onClick={() => copyToClipboard(pythonCode)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <ScrollArea className="h-[280px] md:h-[400px] w-full">
                      <div className="p-3 md:p-4">
                        <CodeBlock code={pythonCode} language="python" />
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>

                <TabsContent value="curl" className="mt-0">
                  <div className="relative group">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 md:top-4 md:right-4 h-9 w-9 md:h-8 md:w-8 text-gray-400 hover:text-white hover:bg-white/10 md:opacity-0 md:group-hover:opacity-100 transition-all touch-manipulation active:scale-95 z-10"
                      onClick={() => copyToClipboard(curlCode)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <ScrollArea className="h-[280px] md:h-[400px] w-full">
                      <div className="p-3 md:p-4">
                        <CodeBlock code={curlCode} language="bash" />
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
