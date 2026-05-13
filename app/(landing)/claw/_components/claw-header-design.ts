export const clawHeaderDesign = {
  desktopCtaButton:
    "hidden h-full items-center justify-center border-b-[6px] border-b-[#c10007] bg-[#e7000b] px-6 pb-1 pt-1 font-mono-readable text-sm font-semibold leading-5 text-[#fef2f2] transition-all hover:border-b-[8px] hover:border-b-[#9f0712] hover:bg-[#c10007] hover:pb-1.5 active:border-b-0 active:bg-[#9f0712] active:pb-1.5 min-[640px]:inline-flex",
  mobileMenu:
    "absolute left-0 right-0 top-full z-40 flex w-full flex-col border border-[#e4e4e7] bg-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-1px_rgba(0,0,0,0.06)] min-[640px]:hidden",
  mobileMenuItem:
    "flex h-12 w-full items-center border-b border-[#f4f4f5] px-5 text-sm leading-5 text-[#09090b] transition-colors last:h-[49px] last:border-b-0 hover:bg-[#fafafa]",
  mobileMenuItemActive: "font-semibold underline underline-offset-[3px]",
} as const;
