import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { Chip } from "@components/ui/chip";
import type { KnowhereIconName } from "@components/ui/knowhere-icon";
import { cn } from "@lib/utils";
import Image from "next/image";
import type { ComponentProps } from "react";

type ChatAttachment = {
  icon?: KnowhereIconName;
  label: string;
};

export type ChatMessageProps = Omit<ComponentProps<"div">, "role"> & {
  attachments?: ChatAttachment[];
  emphasis?: string;
  messageRole: "assistant" | "user";
  step?: number | string;
};

export const ChatMessage = ({
  attachments = [],
  children,
  className,
  emphasis,
  messageRole,
  step,
  ...props
}: ChatMessageProps) => {
  if (messageRole === "user") {
    return (
      <div className={cn("flex w-full justify-end", className)} {...props}>
        <div className="flex w-full max-w-[1000px] flex-col items-end gap-2 pl-8 sm:pl-32">
          <div className="w-full rounded-bl-[32px] rounded-br-[32px] rounded-tl-[32px] bg-[#A684FF] px-8 py-6 text-[#2F0D68]">
            <div className="font-mono-display text-lg leading-6">{children}</div>
          </div>
          {step ? <Chip size="compact" value={step} variant="message" /> : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("flex w-full max-w-[1000px] items-start gap-2 pr-8 sm:pr-32", className)}
      {...props}
    >
      <Avatar className="size-14 border border-zinc-700 bg-zinc-900">
        <AvatarFallback className="bg-zinc-900">
          <Image
            alt=""
            className="size-7"
            height={28}
            src="/icons/knowhere/agent-avatar.svg"
            width={28}
          />
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 self-stretch flex-col gap-8 rounded-bl-[32px] rounded-br-[32px] rounded-tr-[32px] bg-zinc-700 px-8 py-6 text-zinc-50">
        <div className="w-full font-mono-display text-lg leading-6">{children}</div>
        {emphasis ? (
          <div className="w-full font-accent text-4xl font-extrabold leading-none text-[#C4B4FF]">
            {emphasis}
          </div>
        ) : null}
        {attachments.length ? (
          <div className="flex w-full flex-wrap gap-2">
            {attachments.map((attachment) => (
              <Chip
                className="text-zinc-400"
                icon={attachment.icon ?? "draft"}
                key={`${attachment.icon ?? "draft"}-${attachment.label}`}
                value={attachment.label}
                variant="pop"
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
