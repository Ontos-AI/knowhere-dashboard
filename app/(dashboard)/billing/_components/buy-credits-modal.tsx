"use client";

import {
  useBuyCreditsPackage,
  usePriceConfigs,
} from "@app/(dashboard)/billing/_hooks/use-subscription";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { cn } from "@lib/utils";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MIN_CREDITS_PURCHASE = 1;
const PRESET_AMOUNTS = [20, 50, 100, 500];

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
    if (isCustom && customInputRef.current) {
      customInputRef.current.focus();
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
    setAmountParam(String(amount));
  };

  const handleCustomSelect = () => {
    setIsCustom(true);
    setSelectedAmount(null);
    setCustomAmountStr("");
    setAmountParam(null);
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setCustomAmountStr(value);
      const num = Number(value);
      if (value && !Number.isNaN(num) && num >= MIN_CREDITS_PURCHASE) {
        setAmountParam(value);
      } else {
        setAmountParam(null);
      }
    }
  };

  const multiplier = packages.length > 0 ? packages[0].credits_amount : 1;

  const getDisplayAmount = () => {
    if (isCustom) return customAmountStr === "" ? "0" : customAmountStr;
    if (selectedAmount) return selectedAmount.toString();
    return "0";
  };

  const displayAmount = getDisplayAmount();
  const currentAmountNum = isCustom ? Number.parseFloat(customAmountStr) : selectedAmount || 0;
  const creditsToBuy = Number.isNaN(currentAmountNum)
    ? 0
    : Math.floor(currentAmountNum * multiplier);
  const quantity = Number.isNaN(currentAmountNum) ? 0 : Math.floor(currentAmountNum);
  const isValid = isCustom
    ? !Number.isNaN(currentAmountNum) && currentAmountNum >= MIN_CREDITS_PURCHASE
    : !!selectedAmount;

  const handlePurchase = () => {
    if (!isValid || packages.length === 0) {
      if (packages.length === 0) toast.error(t("priceConfigNotFound"));
      return;
    }

    const priceId = packages[0].price_id;
    buyMutation.mutate(
      { priceId, quantity },
      {
        onSuccess: (response) => {
          if (response.checkout_url) {
            window.location.href = response.checkout_url;
          } else {
            toast.error(t("checkoutFailed"));
          }
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
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px] gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("title")}</DialogTitle>
          <DialogDescription className="text-base pt-2">{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 space-y-8">
          <div className="text-6xl font-bold tracking-tighter">
            ${Number(displayAmount).toFixed(2)}
          </div>

          <div className="flex flex-wrap justify-center gap-2 w-full">
            {isFetching ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                {PRESET_AMOUNTS.map((amount) => {
                  const isSelected = !isCustom && selectedAmount === amount;
                  return (
                    <Button
                      key={amount}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "w-[70px]",
                        isSelected
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-transparent"
                      )}
                      onClick={() => handlePresetSelect(amount)}
                    >
                      ${amount}
                    </Button>
                  );
                })}
                <Button
                  variant={isCustom ? "default" : "outline"}
                  className={cn(
                    "w-[80px]",
                    isCustom
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-transparent"
                  )}
                  onClick={handleCustomSelect}
                >
                  {t("custom")}
                </Button>
              </>
            )}
          </div>

          <div
            className={cn(
              "w-full max-w-[200px] grid transition-[grid-template-rows] duration-300 ease-out",
              isCustom ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}
          >
            <div className="overflow-hidden">
              <div
                className={cn(
                  "pt-4 px-1 transition-all duration-300",
                  isCustom ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                )}
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    ref={customInputRef}
                    type="text"
                    placeholder={t("amountPlaceholder")}
                    value={customAmountStr}
                    onChange={handleCustomInputChange}
                    className="pl-7"
                    tabIndex={isCustom ? 0 : -1}
                  />
                </div>
                <p
                  className={cn(
                    "text-xs text-destructive mt-2 text-center h-4 transition-opacity duration-200",
                    !isValid && customAmountStr !== "" ? "opacity-100" : "opacity-0"
                  )}
                >
                  {t("minPurchaseError", { amount: MIN_CREDITS_PURCHASE })}
                </p>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  {creditsToBuy > 0
                    ? t("creditsEstimate", { credits: creditsToBuy.toLocaleString() })
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            className="h-10"
            disabled={buyMutation.isPending}
          >
            {t("cancel")}
          </Button>
          <Button
            className="h-10 min-w-[150px]"
            disabled={
              (!isCustom && !selectedAmount) || (isCustom && !isValid) || buyMutation.isPending
            }
            onClick={handlePurchase}
          >
            {buyMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("processing")}
              </>
            ) : (
              t("purchase")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
