"use client";

import { Button } from "@components/ui/button";
import { trackBuyCreditsClicked } from "@lib/posthog";
import { Coins } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

type BuyCreditsDialogProps = {
  currentCredits?: number;
};

export function BuyCreditsDialog({ currentCredits = 0 }: BuyCreditsDialogProps) {
  const t = useTranslations("BuyCredits");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const openModalHref = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("buy", "true");
    const nextSearch = params.toString();
    return nextSearch ? `${pathname}?${nextSearch}` : pathname;
  }, [pathname, searchParams]);

  return (
    <Button variant="outline" className="gap-2" asChild>
      <Link href={openModalHref} onClick={() => trackBuyCreditsClicked("header")}>
        <Coins className="h-4 w-4" />
        <span>
          {currentCredits.toLocaleString()} {t("credits")}
        </span>
      </Link>
    </Button>
  );
}
