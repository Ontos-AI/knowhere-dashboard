"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/better-auth-client";

export default function GitHubCallbackPage() {
  const router = useRouter();
  const toast = useToast();
  const session = authClient.useSession();
  const t = useTranslations("Auth");

  useEffect(() => {
    if (session.isPending) return;
    if (session.data?.user) {
      toast.success(t("githubLoginSuccess"));
      router.push("/usage");
    } else {
      toast.error(t("githubLoginFailed"));
      router.push("/login?error=oauth");
    }
  }, [session.isPending, session.data, toast, router, t]);

  return (
    <div className="landing-tone min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p>{t("processingGithubLogin")}</p>
      </div>
    </div>
  );
}
