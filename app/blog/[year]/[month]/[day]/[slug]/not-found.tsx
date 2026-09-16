import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function ArticleNotFound() {
  const t = await getTranslations("Blog");

  return (
    <div className="kb kb-standard kb-detail">
      <main id="article-main">
        <div className="kb-empty kb-shell">
          <h1>{t("notFoundTitle")}</h1>
          <p>{t("notFoundDescription")}</p>
          <Link className="kb-retry" href="/blog">
            {t("backToBlog")}
          </Link>
        </div>
      </main>
    </div>
  );
}
