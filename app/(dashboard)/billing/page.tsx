"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";
import { useCredits } from "@hooks/use-credits";
import { CheckCircle2, CreditCard, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";
import { useAppConfigContext } from "@/providers/config-provider";

function BillingPageSkeleton() {
  return (
    <output className="container mx-auto py-10" aria-busy="true">
      <Skeleton className="h-9 w-64 mx-auto mb-10" />
      <Skeleton className="h-5 w-96 mx-auto" />
      <span className="sr-only">Loading billing information...</span>
    </output>
  );
}

function BillingContent() {
  const t = useTranslations("Pricing");
  const searchParams = useSearchParams();
  const { refetch: refreshCredits } = useCredits();
  const { billingEnabled } = useAppConfigContext();

  useEffect(() => {
    if (!billingEnabled) return;

    // Handle payment success/cancel callbacks
    if (searchParams.get("success") === "true") {
      // Refresh credits if it's a credit package purchase
      if (searchParams.get("type") === "credits_package") {
        refreshCredits();
      }
      toast.success(t("toast.success"));
    } else if (searchParams.get("canceled") === "true") {
      toast.error(t("toast.canceled"));
    }
  }, [billingEnabled, searchParams, t, refreshCredits]);

  if (!billingEnabled) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <CreditCard className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">{t("page.billingDisabledTitle")}</CardTitle>
            <CardDescription>{t("page.billingDisabledDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/usage">{t("buttons.returnToConsole")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/api-keys">{t("buttons.manageApiKeys")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";

  if (isSuccess) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100/80">
              <CheckCircle2 className="h-6 w-6 text-amber-700" />
            </div>
            <CardTitle className="text-2xl">{t("success.title")}</CardTitle>
            <CardDescription>{t("success.description")}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link href="/usage">{t("buttons.returnToConsole")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCanceled) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100/80">
              <XCircle className="h-6 w-6 text-rose-700" />
            </div>
            <CardTitle className="text-2xl">{t("canceled.title")}</CardTitle>
            <CardDescription>{t("canceled.description")}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild variant="outline">
              <Link href="/usage">{t("buttons.returnToConsole")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-10">{t("page.title")}</h1>
      <div className="text-center text-muted-foreground">{t("page.instruction")}</div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<BillingPageSkeleton />}>
      <BillingContent />
    </Suspense>
  );
}
