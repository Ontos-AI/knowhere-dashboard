"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCredits } from '@/contexts/CreditsContext';

function BillingContent() {
    const t = useTranslations('Pricing');
    const searchParams = useSearchParams();
    const { refreshCredits } = useCredits();
    
    useEffect(() => {
        // Handle payment success/cancel callbacks
        if (searchParams.get("success") === "true") {
            // Refresh credits if it's a credit package purchase
            if (searchParams.get("type") === "credits_package") {
                refreshCredits();
            }
            toast.success(t('toast.success'));
        } else if (searchParams.get("canceled") === "true") {
            toast.error(t('toast.canceled'));
        }
    }, [searchParams, t, refreshCredits]);

    const isSuccess = searchParams.get("success") === "true";
    const isCanceled = searchParams.get("canceled") === "true";

    if (isSuccess) {
        return (
             <div className="flex min-h-[60vh] items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">{t('success.title')}</CardTitle>
                        <CardDescription>{t('success.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                         <Button asChild>
                            <Link href="/usage">{t('buttons.returnToConsole')}</Link>
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
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <CardTitle className="text-2xl">{t('canceled.title')}</CardTitle>
                        <CardDescription>{t('canceled.description')}</CardDescription>
                    </CardHeader>
                     <CardContent className="flex justify-center">
                         <Button asChild variant="outline">
                            <Link href="/usage">{t('buttons.returnToConsole')}</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold text-center mb-10">{t('page.title')}</h1>
             <div className="text-center text-muted-foreground">
                {t('page.instruction')}
             </div>
        </div>
    );
}

export default function BillingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BillingContent />
        </Suspense>
    )
}
