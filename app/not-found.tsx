import { SiteChrome } from "@components/site-chrome";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <SiteChrome page="not-found">
      {/* `id="top"` gives the footer's "back to top" mark a target, as it has on the landing page. */}
      <section className="kh-site-not-found" id="top">
        <p className="kh-not-found-eyebrow">{t("eyebrow")}</p>
        <h1 className="kh-not-found-title">{t("title")}</h1>
        <p className="kh-not-found-description">{t("description")}</p>
        <Link className="kh-not-found-action" href="/">
          {t("backHome")}
        </Link>
      </section>
    </SiteChrome>
  );
}
