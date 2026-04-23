"use client";

import { Button } from "@components/ui/button";
import type { KnowhereIconName } from "@components/ui/knowhere-icon";
import { Tag } from "@components/ui/tag";
import { cn } from "@lib/utils";
import { Plus } from "lucide-react";
import { type ComponentProps, useEffect, useState } from "react";

export type StepListItemProps = ComponentProps<"div"> & {
  description: string;
  step: number | string;
  title: string;
};

export const StepListItem = ({
  className,
  description,
  step,
  title,
  ...props
}: StepListItemProps) => (
  <div
    className={cn("relative overflow-hidden border border-violet-100 bg-violet-50 pb-4", className)}
    {...props}
  >
    <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:repeating-linear-gradient(125deg,rgba(167,139,250,0.25)_0px,rgba(167,139,250,0.25)_16px,transparent_16px,transparent_48px)]" />
    <div className="relative border-b border-violet-100 bg-white pb-6 pl-20 pr-6 pt-5">
      <div className="absolute left-0 top-0 flex size-14 items-center justify-center bg-violet-400 font-mono text-lg font-bold text-violet-50">
        {step}
      </div>
      <div className="font-mono text-xl font-semibold capitalize leading-7 text-violet-700">
        {title}
      </div>
      <p className="mt-1 font-mono text-sm font-light leading-5 text-zinc-500">{description}</p>
    </div>
  </div>
);

export type CheckListItemProps = ComponentProps<"div"> & {
  icon?: KnowhereIconName;
  text: string;
};

export const CheckListItem = ({
  className,
  icon = "check",
  text,
  ...props
}: CheckListItemProps) => (
  <div className={cn("flex items-center gap-6 py-3", className)} {...props}>
    <Tag icon={icon} variant="status" />
    <p className="min-w-0 flex-1 text-lg font-semibold leading-7 text-zinc-950">{text}</p>
  </div>
);

export type DataListItemProps = ComponentProps<"div"> & {
  description: string;
  label: string;
};

export const DataListItem = ({ className, description, label, ...props }: DataListItemProps) => (
  <div
    className={cn(
      "relative flex items-center gap-10 overflow-hidden border border-amber-200 bg-[linear-gradient(127deg,#fee685_1%,#fffbeb_19%)] px-8 py-6",
      className
    )}
    {...props}
  >
    <div className="font-mono text-3xl font-semibold leading-9 text-orange-700">{label}</div>
    <p className="min-w-0 flex-1 font-mono text-xl leading-7 text-amber-600">{description}</p>
    <Plus className="absolute right-5 top-5 size-3 text-amber-700" />
  </div>
);

export type ContentListItemProps = ComponentProps<"div"> & {
  description: string;
  step?: number | string;
  title: string;
};

export const ContentListItem = ({
  className,
  description,
  step = 1,
  title,
  ...props
}: ContentListItemProps) => (
  <div className={cn("flex items-start gap-6 py-6", className)} {...props}>
    <Tag value={step} variant="count" />
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div className="text-lg font-bold leading-7 text-zinc-950">{title}</div>
      <p className="text-base leading-6 text-zinc-500">{description}</p>
    </div>
  </div>
);

export type QuestionListItemProps = ComponentProps<"div"> & {
  answer: string;
  question: string;
};

export const QuestionListItem = ({
  answer,
  className,
  question,
  ...props
}: QuestionListItemProps) => (
  <div
    className={cn("flex items-center gap-8 border-y border-zinc-100 px-16 py-6", className)}
    {...props}
  >
    <div className="flex size-12 items-center justify-center border border-b border-l border-r-4 border-t border-violet-200 bg-violet-100 font-mono text-3xl font-black leading-7 text-violet-400">
      ?
    </div>
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div className="text-2xl font-semibold leading-8 text-zinc-950">{question}</div>
      <p className="text-base leading-6 text-zinc-700">{answer}</p>
    </div>
  </div>
);

export type TerminalListItemProps = ComponentProps<"div"> & {
  command: string;
};

export const TerminalListItem = ({ className, command, ...props }: TerminalListItemProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
  };

  return (
    <div
      className={cn(
        "relative flex h-[72px] items-center gap-6 overflow-hidden border border-zinc-950 bg-zinc-800 pl-8 pr-24 py-4",
        className
      )}
      {...props}
    >
      <div className="min-w-0 flex-1 overflow-hidden font-mono text-base leading-6 text-sky-500">
        <span className="text-emerald-500">$</span> {command}
      </div>
      <Button
        className="absolute right-[9px] top-1/2 -translate-y-1/2"
        onClick={handleCopy}
        size="copy-cli"
        type="button"
        variant="copy-cli"
      >
        {copied ? "Copied" : "COPY"}
      </Button>
    </div>
  );
};

export type SimpleListItemProps = ComponentProps<"div"> & {
  description: string;
  tagLabel: string;
};

export const SimpleListItem = ({
  className,
  description,
  tagLabel,
  ...props
}: SimpleListItemProps) => (
  <div
    className={cn(
      "flex items-center gap-12 overflow-hidden border border-zinc-200 px-16 py-10",
      className
    )}
    {...props}
  >
    <Tag value={tagLabel} variant="text" />
    <p className="min-w-0 flex-1 text-base leading-6 text-zinc-600">{description}</p>
  </div>
);
