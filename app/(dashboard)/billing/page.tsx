"use client";

import { SubscriptionCard } from "@app/(dashboard)/billing/_components/subscription-card";
import { usePriceConfigs, useSubscription } from "@app/(dashboard)/billing/_hooks/use-subscription";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";
import { useCredits } from "@hooks/use-credits";
import { trackPaymentRedirectFromSearchParams } from "@lib/analytics/payment-redirect";
import type { Subscription } from "@server/external-api/subscriptions";
import { CheckCircle2, CreditCard, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useRef } from "react";
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

function BillingPlansSection() {
  const { data: plans = [], isPending } = usePriceConfigs("subscription");
  const { data: subscription } = useSubscription();

  if (isPending) {
    return (
      <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (plans.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <SubscriptionCard
          key={plan.id}
          plan={plan}
          currentSubscription={(subscription as Subscription | null | undefined) ?? null}
        />
      ))}
    </div>
  );
}

function BillingContent() {
  const t = useTranslations("Pricing");
  const searchParams = useSearchParams();
  const { refetch: refreshCredits } = useCredits();
  const { billingEnabled } = useAppConfigContext();
  const hasTrackedPaymentResult = useRef(false);

  useEffect(() => {
    if (!billingEnabled) return;

    if (hasTrackedPaymentResult.current) {
      return;
    }

    const isPaymentRedirect =
      searchParams.get("success") === "true" || searchParams.get("canceled") === "true";
    if (!isPaymentRedirect) {
      return;
    }

    hasTrackedPaymentResult.current = true;
    const result = trackPaymentRedirectFromSearchParams(searchParams);

    if (result.kind === "success") {
      void refreshCredits();
      toast.success(t("toast.success"));
      return;
    }

    if (result.kind === "canceled") {
      toast.error(t("toast.canceled"));
    }
  }, [billingEnabled, refreshCredits, searchParams, t]);

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
      <h1 className="text-3xl font-bold text-center mb-4">{t("page.title")}</h1>
      <p className="text-center text-muted-foreground">{t("page.instruction")}</p>
      <BillingPlansSection />
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
