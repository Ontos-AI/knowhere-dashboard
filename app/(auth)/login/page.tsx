import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginPageShell } from "@/app/(auth)/login/_components/login-page-shell";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth");
  const title = t("metaTitle");
  const description = t("metaDescription");

  return {
    title,
    description,
    alternates: {
      canonical: "https://knowhereto.ai/login",
    },
    openGraph: {
      title,
      description,
      url: "https://knowhereto.ai/login",
      siteName: "Knowhere",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function LoginPage() {
  return <LoginPageShell />;
}
