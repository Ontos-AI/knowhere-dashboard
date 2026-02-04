"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/better-auth-client";

export default function MagicLinkCallbackPage() {
  const router = useRouter();
  const toast = useToast();
  const session = authClient.useSession();
  const t = useTranslations("Auth");

  useEffect(() => {
    // Wait for session to sync
    if (session.isPending) return;

    if (session.data?.user) {
      // Session successfully synced, redirect to usage page
      toast.success(t("magicLinkLoginSuccess"));
      router.push("/usage");
    } else {
      // No session found after sync, redirect back to login
      toast.error(t("magicLinkLoginFailed"));
      router.push("/login?error=magic");
    }
  }, [session.isPending, session.data, toast, router, t]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p>{t("processingMagicLink")}</p>
      </div>
    </div>
  );
}
