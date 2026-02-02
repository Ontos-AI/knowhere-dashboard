"use client";

import { LandingPage } from "@app/(landing)/_components/landing-page";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations("Common");

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/usage");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  // 如果已登录，useEffect 会处理跳转
  if (isAuthenticated) return null;

  return <LandingPage />;
}
