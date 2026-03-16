"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CopyableCommandCardProps = {
  step: string;
  title: string;
  description: string;
  command: string;
};

export const CopyableCommandCard = ({
  step,
  title,
  description,
  command,
}: CopyableCommandCardProps) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      timeoutRef.current = null;
    }, 1600);
  };

  return (
    <div className="rounded-[16px] border border-white/10 bg-black/15 p-4 shadow-[6px_6px_0_rgba(0,0,0,0.26)] sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-[#7cd8a2]/28 bg-[#162117] font-pixel text-[11px] tracking-[0.16em] text-[#7cd8a2]">
              {step}
            </div>

            <div className="min-w-0">
              <h3 className="font-sans text-lg font-semibold leading-tight tracking-[-0.02em] text-[#f6efe3] sm:text-xl">
                {title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-[#d7d2c7] font-sans sm:leading-7">
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-[10px] border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-[#f6efe3] transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7cd8a2]"
            aria-live="polite"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="overflow-hidden rounded-[12px] border border-[#7cd8a2]/16 bg-black/30">
          <div className="flex items-start gap-3 px-4 py-4">
            <span className="pt-0.5 font-mono text-sm text-[#7cd8a2]">$</span>
            <pre className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap break-all font-mono text-sm leading-7 text-[#f6efe3] lg:break-normal">
              <code>{command}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
