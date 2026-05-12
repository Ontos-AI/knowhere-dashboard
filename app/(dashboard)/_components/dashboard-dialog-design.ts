type BuyCreditsDisplayAmountOptions = {
  readonly customAmount: string;
  readonly fallbackAmount: number;
  readonly isCustom: boolean;
  readonly selectedAmount: number | null;
};

type UsageWelcomeDialogClassNames = {
  readonly codeIconTag: string;
  readonly codePanelFrame: string;
  readonly codeTitleFrame: string;
  readonly codeTitleText: string;
};

type DashboardActionButtonClassNames = {
  readonly dialogSize: string;
};

type DashboardDialogDesign = {
  readonly actionButton: DashboardActionButtonClassNames;
  readonly formatBuyCreditsDisplayAmount: (options: BuyCreditsDisplayAmountOptions) => string;
  readonly usageWelcome: UsageWelcomeDialogClassNames;
};

function getBuyCreditsDisplayAmount(options: BuyCreditsDisplayAmountOptions): number {
  if (!options.isCustom) {
    return options.selectedAmount ?? options.fallbackAmount;
  }

  if (options.customAmount.trim().length === 0) {
    return options.selectedAmount ?? options.fallbackAmount;
  }

  const parsedAmount: number = Number.parseFloat(options.customAmount);

  if (!Number.isFinite(parsedAmount)) {
    return options.selectedAmount ?? options.fallbackAmount;
  }

  return parsedAmount;
}

const formatBuyCreditsDisplayAmount = (options: BuyCreditsDisplayAmountOptions): string => {
  const amount: number = getBuyCreditsDisplayAmount(options);

  return `$${amount.toFixed(2)}`;
};

export const dashboardDialogDesign: DashboardDialogDesign = {
  actionButton: {
    dialogSize:
      "h-12 justify-start gap-1 border-b-4 border-l border-r border-t px-3 pb-0.5 pt-0 leading-5 transition-colors sm:h-9",
  },
  formatBuyCreditsDisplayAmount,
  usageWelcome: {
    codeIconTag:
      "absolute left-0 top-0 flex size-10 items-center justify-center border border-[#ddd6fe] border-l-[4px] bg-[#ede9fe] min-[375px]:size-10 sm:size-12 lg:size-12",
    codePanelFrame:
      "px-4 pb-[38px] pt-0 min-[375px]:pb-[38px] min-[375px]:pl-[78px] min-[375px]:pr-[46px] sm:pb-10 sm:pl-20 sm:pr-12 sm:pt-0 lg:pb-10 lg:pl-20 lg:pr-12 lg:pt-0",
    codeTitleFrame:
      "relative px-0 pb-4 pl-16 pr-4 pt-[14px] min-[375px]:pl-[78px] min-[375px]:pr-[46px] sm:border-b-0 sm:pb-4 sm:pl-20 sm:pr-12 sm:pt-4 lg:pb-4 lg:pl-20 lg:pr-12 lg:pt-4",
    codeTitleText:
      "text-[14px] font-medium leading-[22px] text-[#09090b] sm:pl-0 sm:text-[14px] sm:leading-[22px] lg:pl-0 lg:text-[16px] lg:leading-6",
  },
} as const;
