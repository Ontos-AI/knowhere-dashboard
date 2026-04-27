"use client";

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

type ActionButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  variant: "primary" | "secondary";
};

const amountOptionBaseClassName =
  "flex h-9 w-[72px] items-center justify-center border px-6 text-[12px] leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e51ff]/25";

const actionButtonBaseClassName =
  "flex h-12 w-full items-center justify-center gap-1 border-b-[4px] border-l border-r border-t px-3 pb-[2px] pt-0 font-mono-display text-[12px] font-medium leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e51ff]/25 disabled:cursor-not-allowed disabled:border-[#e4e4e7] disabled:bg-[#f4f4f5] disabled:text-[#a1a1aa] sm:h-9 sm:w-auto";

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

const ActionButton = ({
  children,
  disabled = false,
  onClick,
  type = "button",
  variant,
}: ActionButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        actionButtonBaseClassName,
        variant === "primary"
          ? "border-[#7008e7] bg-[#7f22fe] text-[#f5f3ff] hover:bg-[#7008e7] sm:min-w-[173px]"
          : "border-[#f4f4f5] bg-white text-[#27272a] hover:bg-[#fafafa] sm:min-w-[71px]"
      )}
    >
      {children}
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
    setSelectedAmount(null);
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
  const displayAmount = isCustom ? customAmountStr || "0" : String(selectedAmount ?? 0);
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
                ${Number(displayAmount).toFixed(2)}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 sm:gap-2">
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

          <div className="mx-auto flex w-[331px] max-w-[calc(100vw-44px)] flex-col gap-1.5 sm:w-[464px] sm:max-w-none sm:flex-row sm:justify-end sm:gap-2">
            <ActionButton
              variant="secondary"
              disabled={buyMutation.isPending}
              onClick={handleClose}
            >
              {t("cancel")}
            </ActionButton>
            <ActionButton variant="primary" disabled={isPurchaseDisabled} onClick={handlePurchase}>
              {buyMutation.isPending ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  {t("processing")}
                </>
              ) : (
                t("purchase")
              )}
            </ActionButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
