"use client";

import { KnowhereIcon } from "@components/ui/knowhere-icon";
import { cn } from "@lib/utils";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";

export const ThemeSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "group inline-flex h-9 w-14 shrink-0 items-center rounded-full bg-zinc-800 p-1 shadow-xs transition-[background-color,box-shadow] data-[state=checked]:bg-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="flex size-7 items-center justify-center rounded-full bg-white text-primary-dark shadow-xs transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0">
      <KnowhereIcon className="size-4 group-data-[state=checked]:hidden" name="theme-dark" />
      <KnowhereIcon className="hidden size-4 group-data-[state=checked]:block" name="theme-light" />
    </SwitchPrimitive.Thumb>
  </SwitchPrimitive.Root>
));
ThemeSwitch.displayName = "ThemeSwitch";
