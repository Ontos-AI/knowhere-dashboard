"use client";

import { cn } from "@lib/utils";
import { useEffect, useRef, useState } from "react";

type ClawCopyButtonProps = {
  className?: string;
  value: string;
};

export const ClawCopyButton = ({ className, value }: ClawCopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      className={cn(
        "inline-flex h-9 w-[72px] items-center justify-center rounded-full bg-[#27272a] px-0 py-2 text-[12px] leading-5 text-[#a684ff] transition-colors hover:bg-[#18181b]",
        className
      )}
      onClick={handleCopy}
      type="button"
    >
      {copied ? "COPIED" : "COPY"}
    </button>
  );
};
