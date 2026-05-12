type ClawHeroDesign = {
  readonly contextMarker: {
    readonly iconSrc: string;
    readonly iconClassName: string;
  };
};

export const clawHeroDesign: ClawHeroDesign = {
  contextMarker: {
    iconSrc: "/icons/knowhere/context-memo.svg",
    iconClassName:
      "h-7 w-7 shrink-0 min-[640px]:h-9 min-[640px]:w-9 min-[640px]:max-[767px]:h-8 min-[640px]:max-[767px]:w-8 min-[768px]:max-[768px]:h-8 min-[768px]:max-[768px]:w-8 min-[769px]:h-9 min-[769px]:w-9",
  },
} as const;
