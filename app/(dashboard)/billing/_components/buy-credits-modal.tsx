"use client";

import { DashboardActionButton } from "@app/(dashboard)/_components/dashboard-action-button";
import { dashboardDialogDesign } from "@app/(dashboard)/_components/dashboard-dialog-design";
import {
  useBuyCreditsPackage,
  usePriceConfigs,
} from "@app/(dashboard)/billing/_hooks/use-subscription";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@components/ui/dialog";
import { trackBuyCreditsClicked, trackCheckoutStarted } from "@lib/posthog";
import { cn } from "@lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MIN_CREDITS_PURCHASE = 1;
const PRESET_AMOUNTS = [20, 50, 100, 500];

type AmountOptionButtonProps = {
  isSelected: boolean;
  label: string;
  onClick: () => void;
};

const amountOptionBaseClassName =
  "flex h-9 w-[72px] items-center justify-center border px-6 text-[12px] leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e51ff]/25";

const AmountOptionButton = ({ isSelected, label, onClick }: AmountOptionButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        amountOptionBaseClassName,
        isSelected
          ? "border-[#5d0ec0] bg-[#7f22fe] font-bold text-[#f5f3ff]"
          : "border-[#e4e4e7] bg-white font-normal text-[#3f3f46] hover:bg-[#fafafa]"
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export function BuyCreditsModal() {
  const t = useTranslations("BuyCredits");
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: packages = [], isPending: isFetching } = usePriceConfigs("credits_package");
  const buyMutation = useBuyCreditsPackage();

  const [amountParam, setAmountParam] = useQueryState("amount");
  const urlAmount = amountParam !== null ? Number(amountParam) : null;
  const validUrlAmount =
    urlAmount !== null && !Number.isNaN(urlAmount) && urlAmount >= MIN_CREDITS_PURCHASE
      ? urlAmount
      : null;

  const isInitCustom = validUrlAmount !== null && !PRESET_AMOUNTS.includes(validUrlAmount);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(
    validUrlAmount !== null && PRESET_AMOUNTS.includes(validUrlAmount)
      ? validUrlAmount
      : PRESET_AMOUNTS[0]
  );
  const [isCustom, setIsCustom] = useState(isInitCustom);
  const [customAmountStr, setCustomAmountStr] = useState<string>(
    isInitCustom ? String(validUrlAmount) : ""
  );

  const customInputRef = useRef<HTMLInputElement>(null);
  const hasTrackedDeepLink = useRef(false);

  useEffect(() => {
    if (hasTrackedDeepLink.current) {
      return;
    }

    if (searchParams.get("buy") === "true") {
      trackBuyCreditsClicked("deep_link");
      hasTrackedDeepLink.current = true;
    }
  }, [searchParams]);

  useEffect(() => {
    if (isCustom) {
      customInputRef.current?.focus();
    }
  }, [isCustom]);

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("buy");
    params.delete("amount");
    const nextSearch = params.toString();
    router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname);
  };

  const handlePresetSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmountStr("");
    void setAmountParam(String(amount));
  };

  const handleCustomSelect = () => {
    setIsCustom(true);
    setCustomAmountStr("");
    void setAmountParam(null);
  };

  const handleCustomInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    if (nextValue === "" || /^\d*\.?\d*$/.test(nextValue)) {
      setCustomAmountStr(nextValue);
      const parsedValue = Number(nextValue);

      if (nextValue && !Number.isNaN(parsedValue) && parsedValue >= MIN_CREDITS_PURCHASE) {
        void setAmountParam(nextValue);
      } else {
        void setAmountParam(null);
      }
    }
  };

  const currentAmount = isCustom ? Number.parseFloat(customAmountStr) : (selectedAmount ?? 0);
  const safeAmount = Number.isNaN(currentAmount) ? 0 : currentAmount;
  const displayAmount: string = dashboardDialogDesign.formatBuyCreditsDisplayAmount({
    customAmount: customAmountStr,
    fallbackAmount: PRESET_AMOUNTS[0],
    isCustom,
    selectedAmount,
  });
  const quantity = Math.floor(safeAmount);
  const isValidSelection = isCustom
    ? !Number.isNaN(safeAmount) && safeAmount >= MIN_CREDITS_PURCHASE
    : selectedAmount !== null;
  const isPurchaseDisabled =
    isFetching || packages.length === 0 || !isValidSelection || buyMutation.isPending;

  const handlePurchase = () => {
    if (packages.length === 0) {
      toast.error(t("priceConfigNotFound"));
      return;
    }

    if (!isValidSelection) {
      return;
    }

    buyMutation.mutate(
      { priceId: packages[0].price_id, quantity },
      {
        onSuccess: (response) => {
          if (response.checkout_url) {
            trackCheckoutStarted("credits_package", {
              amount: safeAmount,
              session_id: response.session_id,
              price_id: packages[0].price_id,
            });
            window.location.href = response.checkout_url;
            return;
          }

          toast.error(t("checkoutFailed"));
        },
        onError: (error) => {
          console.error("Purchase failed:", error);
          toast.error(t("purchaseFailed"));
        },
      }
    );
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="w-screen max-w-none gap-0 rounded-none border-[#e4e4e7] bg-[#fafafa] p-0 shadow-none sm:w-[calc(100vw-2rem)] sm:max-w-[560px] [&>button]:hidden">
        <div className="flex flex-col gap-[34px] px-0 py-[22px] sm:gap-14 sm:py-10">
          <div className="mx-auto flex w-[331px] max-w-[calc(100vw-44px)] items-start justify-between gap-8 sm:w-[464px] sm:max-w-none">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-[20px] font-bold leading-[26px] text-[#09090b] sm:leading-7">
                {t("title")}
              </DialogTitle>
              <DialogDescription className="mt-0.5 max-w-[277px] text-[14px] leading-[18px] text-[#71717b] sm:mt-1 sm:max-w-[408px] sm:leading-5">
                {t("description")}
              </DialogDescription>
            </div>

            <DialogClose asChild>
              <button
                type="button"
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-[#3f3f46] transition-colors hover:bg-[#f4f4f5]"
                aria-label={t("cancel")}
              >
                <Image
                  src="/icons/common/close-dialog.svg"
                  alt=""
                  aria-hidden
                  width={8.87}
                  height={8.87}
                  className="h-[8.87px] w-[8.87px]"
                />
              </button>
            </DialogClose>
          </div>

          <div className="mx-auto flex w-[331px] max-w-[calc(100vw-44px)] flex-col gap-[22px] sm:w-[464px] sm:max-w-none sm:gap-10">
            <div className="flex items-center justify-center">
              <p className="text-center text-[42px] font-bold leading-[42px] tracking-normal text-black sm:text-[48px] sm:leading-[48px]">
                {displayAmount}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1.5 lg:gap-x-2">
              {PRESET_AMOUNTS.map((amount) => (
                <AmountOptionButton
                  key={amount}
                  isSelected={!isCustom && selectedAmount === amount}
                  label={`$${amount}`}
                  onClick={() => handlePresetSelect(amount)}
                />
              ))}
              <AmountOptionButton
                isSelected={isCustom}
                label={t("custom")}
                onClick={handleCustomSelect}
              />
            </div>

            {isCustom ? (
              <div className="flex w-full justify-center">
                <div className="relative w-full max-w-[207px] sm:max-w-[336px]">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] leading-4 text-[#18181b]">
                    $
                  </span>
                  <input
                    ref={customInputRef}
                    type="text"
                    inputMode="decimal"
                    value={customAmountStr}
                    onChange={handleCustomInputChange}
                    placeholder={t("amountPlaceholder")}
                    aria-invalid={customAmountStr !== "" && !isValidSelection}
                    className="h-10 w-full border border-[#a684ff] bg-white px-3 pl-8 text-[12px] leading-4 text-[#18181b] placeholder:text-[#9f9fa9] focus:outline-none"
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="mx-auto flex w-[331px] max-w-[calc(100vw-44px)] flex-col gap-1.5 sm:w-[464px] sm:max-w-none sm:flex-row sm:justify-end sm:gap-[6px] lg:gap-2">
            <DashboardActionButton
              type="button"
              variant="secondary"
              size="dialog"
              className="w-full justify-center sm:w-auto sm:min-w-[67px] sm:justify-start lg:min-w-[71px]"
              disabled={buyMutation.isPending}
              onClick={handleClose}
            >
              {t("cancel")}
            </DashboardActionButton>
            <DashboardActionButton
              type="button"
              variant="primary"
              size="dialog"
              className="w-full justify-center sm:w-auto sm:min-w-[169px] sm:justify-start lg:min-w-[173px]"
              disabled={isPurchaseDisabled}
              onClick={handlePurchase}
            >
              {buyMutation.isPending ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  {t("processing")}
                </>
              ) : (
                t("purchase")
              )}
            </DashboardActionButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
