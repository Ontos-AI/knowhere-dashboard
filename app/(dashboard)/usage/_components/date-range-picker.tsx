"use client";

import { Calendar } from "@components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { cn } from "@lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { useTranslations } from "next-intl";
import * as React from "react";
import type { DateRange, DayButton, OnSelectHandler } from "react-day-picker";

type DatePickerWithRangeProps = {
  className?: string;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
};

const COMPACT_CALENDAR_BREAKPOINT = 640;

const formatRangeLabel = (date: DateRange | undefined, fallback: string) => {
  if (!date?.from) {
    return fallback;
  }

  if (!date.to) {
    return format(date.from, "MMM dd,yyyy");
  }

  return `${format(date.from, "MMM dd,yyyy")} - ${format(date.to, "MMM dd,yyyy")}`;
};

const buildOrderedDateRange = (startDate: Date, endDate: Date): DateRange => {
  if (endDate.getTime() < startDate.getTime()) {
    return {
      from: endDate,
      to: startDate,
    };
  }

  return {
    from: startDate,
    to: endDate,
  };
};

const RangeCalendarDayButton = ({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) => {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "flex size-8 items-center justify-center rounded-[8px] border-0 bg-transparent p-0 text-[14px] font-normal leading-5 tracking-normal text-[#09090b] outline-none transition-colors hover:bg-[#f4f4f5] focus-visible:ring-0 data-[selected-single=true]:bg-[#7008e7] data-[selected-single=true]:text-white data-[range-start=true]:bg-[#7008e7] data-[range-start=true]:text-white data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-[#f5f3ff] data-[range-middle=true]:text-[#2f0d68] data-[range-end=true]:bg-[#7008e7] data-[range-end=true]:text-white dark:text-[#fafafa] dark:hover:bg-[#27272a] dark:data-[range-middle=true]:bg-[#3f2a5f] dark:data-[range-middle=true]:text-[#ddd6fe]",
        className
      )}
      {...props}
    />
  );
};

export function DatePickerWithRange({ className, date, setDate }: DatePickerWithRangeProps) {
  const t = useTranslations("Usage");
  const [isCompactCalendar, setIsCompactCalendar] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [draftDate, setDraftDate] = React.useState<DateRange | undefined>(date);
  const [hasStartedDraftRange, setHasStartedDraftRange] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${COMPACT_CALENDAR_BREAKPOINT - 1}px)`);
    const updateCalendarLayout = () => {
      setIsCompactCalendar(window.innerWidth < COMPACT_CALENDAR_BREAKPOINT);
    };

    updateCalendarLayout();
    mediaQuery.addEventListener("change", updateCalendarLayout);

    return () => mediaQuery.removeEventListener("change", updateCalendarLayout);
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setDraftDate(date);
      setHasStartedDraftRange(false);
      return;
    }

    setDraftDate(date);
    setHasStartedDraftRange(false);
  };

  const handleSelect: OnSelectHandler<DateRange | undefined> = (_nextDate, triggerDate) => {
    if (!hasStartedDraftRange || !draftDate?.from) {
      setDraftDate({
        from: triggerDate,
        to: undefined,
      });
      setHasStartedDraftRange(true);
      setOpen(true);
      return;
    }

    const completedRange = buildOrderedDateRange(draftDate.from, triggerDate);

    setDraftDate(completedRange);
    setDate(completedRange);
    setHasStartedDraftRange(false);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 w-full max-w-[222px] items-center gap-1.5 border border-[#e4e4e7] bg-white pl-[10px] pr-3 text-left dark:border-[#3f3f46] dark:bg-[#18181b] sm:h-8 sm:max-w-[224px] lg:max-w-[238px]",
            className
          )}
        >
          {date?.from ? (
            <>
              <span className="truncate font-mono-display text-[12px] font-light leading-4 text-[#27272a] dark:text-[#fafafa]">
                {format(date.from, "MMM dd,yyyy")}
              </span>
              <span className="font-mono-display text-[14px] font-light leading-5 text-[#9f9fa9]">
                -
              </span>
              <span className="truncate font-mono-display text-[12px] font-light leading-4 text-[#27272a] dark:text-[#fafafa]">
                {format(date.to ?? date.from, "MMM dd,yyyy")}
              </span>
            </>
          ) : (
            <span className="truncate font-mono-display text-[12px] font-light leading-4 text-[#27272a] dark:text-[#fafafa]">
              {formatRangeLabel(date, t("pickDate"))}
            </span>
          )}
          <span className="ml-auto flex size-4 shrink-0 items-center justify-center">
            <Image
              src="/icons/usage/calendar.svg"
              alt=""
              aria-hidden
              width={10.67}
              height={12.15}
              className="h-[12.15px] w-[10.67px] dark:invert"
            />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[248px] rounded-none border-[#f4f4f5] bg-white p-3 text-[#09090b] shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)] backdrop-blur-0 dark:border-[#3f3f46] dark:bg-[#18181b] dark:text-[#fafafa] sm:w-auto"
      >
        <Calendar
          initialFocus
          mode="range"
          fixedWeeks
          defaultMonth={draftDate?.from ?? date?.from}
          selected={draftDate}
          onSelect={handleSelect}
          numberOfMonths={isCompactCalendar ? 1 : 2}
          className="bg-white p-0 dark:bg-[#18181b] [--cell-size:32px]"
          classNames={{
            root: "w-fit",
            months: "flex flex-col gap-4 md:flex-row",
            month: "flex w-full flex-col gap-4 sm:w-[224px]",
            nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between",
            button_previous:
              "flex size-8 items-center justify-center rounded-md border-0 p-0 text-[#09090b] hover:bg-transparent dark:text-[#fafafa]",
            button_next:
              "flex size-8 items-center justify-center rounded-md border-0 p-0 text-[#09090b] hover:bg-transparent dark:text-[#fafafa]",
            month_caption: "relative flex h-8 w-full items-center justify-center px-8",
            caption_label: "text-[14px] font-medium leading-5 text-[#09090b] dark:text-[#fafafa]",
            weekdays: "mt-4 flex",
            weekday:
              "flex h-[21px] w-8 items-center justify-center rounded-md text-[12px] font-normal leading-4 text-[#9f9fa9]",
            week: "mt-2 flex w-full",
            day: "relative size-8 p-0 text-center",
            range_start: "rounded-l-[8px]",
            range_middle: "rounded-none",
            range_end: "rounded-r-[8px]",
            today: "text-[#09090b] dark:text-[#fafafa]",
            outside: "text-[#09090b] opacity-50 dark:text-[#fafafa]",
            disabled: "text-[#9f9fa9] opacity-50",
          }}
          components={{
            DayButton: RangeCalendarDayButton,
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
