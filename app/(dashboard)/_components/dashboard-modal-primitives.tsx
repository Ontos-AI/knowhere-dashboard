"use client";

import { DialogClose } from "@components/ui/dialog";
import { cn } from "@lib/utils";
import Image from "next/image";
import type { SVGProps } from "react";

export const dashboardDesktopModalContentClassName =
  "w-screen max-w-none gap-0 rounded-none border-[#e4e4e7] bg-[#fafafa] p-0 shadow-none sm:w-[calc(100vw-2rem)] sm:max-w-[560px] [&>button]:hidden";

export const dashboardDesktopFieldLabelClassName =
  "text-sm font-normal leading-[18px] text-[#09090b] lg:leading-5";

export const dashboardDesktopTextFieldClassName =
  "h-10 w-full rounded-none border border-[#e4e4e7] bg-white px-3 text-xs leading-4 text-[#27272a] shadow-none outline-none placeholder:text-[#9f9fa9] focus-visible:ring-2 focus-visible:ring-[#7f22fe]/20";

export const dashboardDesktopSecretFieldClassName =
  "min-h-[58px] w-full rounded-none border border-[#e4e4e7] bg-white px-3 py-2.5 text-xs leading-4 text-[#09090b] lg:min-h-[68px]";

export const DashboardDesktopDialogCloseButton = () => {
  return (
    <DialogClose asChild>
      <button
        type="button"
        className="flex size-6 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f22fe]/20"
      >
        <Image src="/icons/common/close-dialog.svg" alt="" aria-hidden width={9} height={9} />
        <span className="sr-only">Close</span>
      </button>
    </DialogClose>
  );
};

export const DashboardSuccessCircleIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 19 19"
      fill="none"
      aria-hidden="true"
      className={cn("size-6 shrink-0", props.className)}
      {...props}
    >
      <path
        fill="#00BC7D"
        d="M8.08075 13.7538L14.8038 7.03075L13.75 5.977L8.08075 11.6463L5.23075 8.79625L4.177 9.85L8.08075 13.7538ZM9.50175 19C8.18775 19 6.95267 18.7507 5.7965 18.252C4.64033 17.7533 3.63467 17.0766 2.7795 16.2218C1.92433 15.3669 1.24725 14.3617 0.74825 13.206C0.249417 12.0503 0 10.8156 0 9.50175C0 8.18775 0.249333 6.95267 0.748 5.7965C1.24667 4.64033 1.92342 3.63467 2.77825 2.7795C3.63308 1.92433 4.63833 1.24725 5.794 0.74825C6.94967 0.249417 8.18442 0 9.49825 0C10.8123 0 12.0473 0.249333 13.2035 0.748C14.3597 1.24667 15.3653 1.92342 16.2205 2.77825C17.0757 3.63308 17.7528 4.63833 18.2518 5.794C18.7506 6.94967 19 8.18442 19 9.49825C19 10.8123 18.7507 12.0473 18.252 13.2035C17.7533 14.3597 17.0766 15.3653 16.2218 16.2205C15.3669 17.0757 14.3617 17.7528 13.206 18.2518C12.0503 18.7506 10.8156 19 9.50175 19Z"
      />
    </svg>
  );
};

export const DashboardCopyIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 12.9167 15.4167"
      fill="none"
      aria-hidden="true"
      className={cn("size-5 shrink-0", props.className)}
      {...props}
    >
      <path
        fill="#71717B"
        d="M4.42313 12.5C4.00215 12.5 3.64583 12.3542 3.35417 12.0625C3.0625 11.7708 2.91667 11.4145 2.91667 10.9935V1.50646C2.91667 1.08549 3.0625 0.729167 3.35417 0.4375C3.64583 0.145833 4.00215 0 4.42313 0H11.4102C11.8312 0 12.1875 0.145833 12.4792 0.4375C12.7708 0.729167 12.9167 1.08549 12.9167 1.50646V10.9935C12.9167 11.4145 12.7708 11.7708 12.4792 12.0625C12.1875 12.3542 11.8312 12.5 11.4102 12.5H4.42313ZM4.42313 11.25H11.4102C11.4744 11.25 11.5331 11.2233 11.5865 11.1698C11.6399 11.1165 11.6667 11.0577 11.6667 10.9935V1.50646C11.6667 1.44229 11.6399 1.38354 11.5865 1.33021C11.5331 1.27674 11.4744 1.25 11.4102 1.25H4.42313C4.35896 1.25 4.30021 1.27674 4.24688 1.33021C4.1934 1.38354 4.16667 1.44229 4.16667 1.50646V10.9935C4.16667 11.0577 4.1934 11.1165 4.24688 11.1698C4.30021 11.2233 4.35896 11.25 4.42313 11.25ZM1.50646 15.4167C1.08549 15.4167 0.729167 15.2708 0.4375 14.9792C0.145833 14.6875 0 14.3312 0 13.9102V3.17313H1.25V13.9102C1.25 13.9744 1.27674 14.0331 1.33021 14.0865C1.38354 14.1399 1.44229 14.1667 1.50646 14.1667H9.74354V15.4167H1.50646Z"
      />
    </svg>
  );
};

export const DashboardWarningIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 21.2155 21.2155"
      fill="none"
      aria-hidden="true"
      className={cn("size-6 shrink-0", props.className)}
      {...props}
    >
      <path
        fill="#FF6900"
        d="M11.1808 15.104C11.3373 14.9475 11.4155 14.7564 11.4155 14.5307C11.4155 14.3051 11.3373 14.1141 11.1808 13.9578C11.0244 13.8014 10.8334 13.7233 10.6077 13.7233C10.3821 13.7233 10.1911 13.8014 10.0347 13.9578C9.87825 14.1141 9.8 14.3051 9.8 14.5307C9.8 14.7564 9.87825 14.9475 10.0347 15.104C10.1911 15.2603 10.3821 15.3385 10.6077 15.3385C10.8334 15.3385 11.0244 15.2603 11.1808 15.104ZM9.85775 11.6847H11.3577V5.68475H9.85775V11.6847ZM10.6077 21.2155L7.46725 18.1077H3.10775V13.7483L0 10.6077L3.10775 7.46725V3.10775H7.46725L10.6077 0L13.7483 3.10775H18.1077V7.46725L21.2155 10.6077L18.1077 13.7483V18.1077H13.7483L10.6077 21.2155ZM10.6077 19.1077L13.1077 16.6077H16.6077V13.1077L19.1077 10.6077L16.6077 8.10775V4.60775H13.1077L10.6077 2.10775L8.10775 4.60775H4.60775V8.10775L2.10775 10.6077L4.60775 13.1077V16.6077H8.10775L10.6077 19.1077Z"
      />
    </svg>
  );
};
