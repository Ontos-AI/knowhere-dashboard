"use client";

import {
  LandingTrackedAnchor,
  LandingTrackedLink,
} from "@app/(landing)/_components/landing-tracked-link";
import { CheckCircleFill } from "@app/(landing)/pricing/_components/check-circle-fill";
import { HeroDataStream } from "@app/(landing)/pricing/_components/hero-data-stream";
import { PixelCard } from "@app/(landing)/pricing/_components/pixel-card";
import { PricingCalculator } from "@app/(landing)/pricing/_components/pricing-calculator";
import {
  BILLABLE_PACK_PAGES,
  ENTERPRISE_FEATURE_KEYS,
  FAQ_ITEM_IDS,
  FAQ_ITEM_KEYS,
  FINAL_CTA_BENEFIT_KEYS,
  PACK_PRICE_LABEL,
  PAGE_RATE_LABEL,
  PRICING_CONTACT_HREF,
  PRICING_DOCS_HREF,
  PRICING_LOGIN_HREF,
  STANDARD_FILE_LIMITS,
} from "@app/(landing)/pricing/_components/pricing-data";
import { useTranslations } from "next-intl";
import "@app/(landing)/pricing/_components/pricing-page.css";

export const PricingHome = () => {
  const t = useTranslations("Pricing");

  return (
    <div className="kh-pricing">
      <a className="skip-link" href="#overview">
        {t("skipToContent")}
      </a>
      <main>
        <section id="overview" className="overview" aria-labelledby="hero-title">
          <HeroDataStream />
          <div className="hero-copy">
            <h1 id="hero-title">
              {t("hero.titleLine1", {
                packPrice: PACK_PRICE_LABEL,
                packPages: BILLABLE_PACK_PAGES,
              })}
              <br />
              <span>
                {t("hero.titleLine2", {
                  packPrice: PACK_PRICE_LABEL,
                  packPages: BILLABLE_PACK_PAGES,
                })}
              </span>
            </h1>
            <p className="lede">{t("hero.lede")}</p>
            <div className="rate-rules">
              <div className="rate-stat rate-rule">
                <p>
                  <CheckCircleFill size={20} /> {t("hero.noCard")}
                </p>
              </div>
              <div className="rate-stat rate-rule">
                <p>
                  <CheckCircleFill size={20} /> {t("hero.noSubscription")}
                </p>
              </div>
              <div className="rate-promises rate-rule">
                <p>
                  <CheckCircleFill size={20} /> {t("hero.noMinimum")}
                </p>
              </div>
            </div>
          </div>
          <div className="rate-card">
            <LandingTrackedLink
              className="button"
              ctaId="start_free_trial"
              href={PRICING_LOGIN_HREF}
              sourceSection="overview"
            >
              {t("hero.cta")}
            </LandingTrackedLink>
          </div>
        </section>

        <PricingCalculator />

        <section id="how-it-works" className="section shell" aria-labelledby="how-title">
          <div className="section-heading">
            <div>
              <p className="section-no">{t("how.sectionNo")}</p>
              <h2 id="how-title">{t("how.title")}</h2>
            </div>
            <p>{t("how.description")}</p>
          </div>
          <div className="billing-matrix">
            <article className="billing-card" aria-labelledby="billing-plan-title">
              <div className="billing-card-top">
                <header className="billing-card-heading">
                  <h3 id="billing-plan-title">{t("how.planTitle")}</h3>
                  <p className="billing-plan-copy">{t("how.planCopy")}</p>
                  <div className="billing-plan-price">
                    <p className="billing-plan-primary">
                      {PACK_PRICE_LABEL} <span>{t("how.planUnit")}</span>
                    </p>
                    <p className="billing-plan-equivalent">
                      {t("how.planEquivalent", { pageRate: PAGE_RATE_LABEL })}
                    </p>
                  </div>
                </header>
                <aside className="billing-custom" aria-labelledby="billing-custom-title">
                  <div className="billing-custom-heading">
                    <h4 id="billing-custom-title">{t("how.customTitle")}</h4>
                  </div>
                  <div className="billing-custom-copy">
                    <p>{t("how.customCopy")}</p>
                    <LandingTrackedAnchor
                      ctaId="contact_sales"
                      href={PRICING_CONTACT_HREF}
                      sourceSection="how"
                    >
                      {t("how.customCta")}
                    </LandingTrackedAnchor>
                  </div>
                </aside>
              </div>
              <section className="billing-rows" aria-labelledby="billing-rules-title">
                <p className="sr-only" id="billing-rules-title">
                  {t("how.rulesTitle")}
                </p>
                <section className="billing-row" aria-labelledby="billing-rule-title">
                  <div className="billing-row-copy">
                    <h4 id="billing-rule-title">{t("how.billableTitle")}</h4>
                    <p>{t("how.billableCopy")}</p>
                  </div>
                  <div className="billing-row-charge">
                    <p className="billing-row-price">
                      {PAGE_RATE_LABEL}{" "}
                      <span className="billing-row-unit">{t("how.billableUnit")}</span>
                    </p>
                  </div>
                </section>
                <section className="billing-row" aria-labelledby="billing-completed-title">
                  <div className="billing-row-copy">
                    <h4 id="billing-completed-title">{t("how.completedTitle")}</h4>
                    <p>{t("how.completedCopy")}</p>
                  </div>
                  <div className="billing-row-charge">
                    <p className="billing-row-result billing-row-success">
                      {t("how.completedResult")}
                    </p>
                  </div>
                </section>
                <section className="billing-row" aria-labelledby="billing-failed-title">
                  <div className="billing-row-copy">
                    <h4 id="billing-failed-title">{t("how.failedTitle")}</h4>
                    <p>{t("how.failedCopy")}</p>
                  </div>
                  <div className="billing-row-charge">
                    <p className="billing-row-price">{t("how.failedPrice")}</p>
                  </div>
                </section>
              </section>
            </article>
          </div>
        </section>

        <section id="enterprise" className="section shell" aria-labelledby="limits-title">
          <div className="section-heading">
            <div>
              <p className="section-no">{t("limits.sectionNo")}</p>
              <h2 id="limits-title">{t("limits.title")}</h2>
            </div>
            <p>{t("limits.description")}</p>
          </div>
          <div className="limits-layout">
            <section className="limits-table" aria-labelledby="standard-limits-title">
              <h3 id="standard-limits-title">{t("limits.tableTitle")}</h3>
              <table>
                <thead>
                  <tr>
                    <th scope="col">{t("limits.formatColumn")}</th>
                    <th scope="col">{t("limits.sizeColumn")}</th>
                  </tr>
                </thead>
                <tbody>
                  {STANDARD_FILE_LIMITS.map((limit) => (
                    <tr key={limit.extension}>
                      <th scope="row">
                        {t(`limits.formats.${limit.key}`)}
                        <small>{limit.extension}</small>
                      </th>
                      <td>{limit.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <PixelCard variant="pink" className="enterprise-card">
              <div className="enterprise-card-top">
                <h3>{t("enterprise.title")}</h3>
                <p>{t("enterprise.description")}</p>
              </div>
              <div className="enterprise-card-features">
                <ul>
                  {ENTERPRISE_FEATURE_KEYS.map((key) => (
                    <li key={key}>
                      <CheckCircleFill size={20} />
                      <div>
                        <strong>{t(`enterprise.features.${key}.title`)}</strong>
                        <p>{t(`enterprise.features.${key}.copy`)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="enterprise-card-action">
                <LandingTrackedAnchor
                  className="button"
                  ctaId="contact_sales"
                  href={PRICING_CONTACT_HREF}
                  sourceSection="enterprise"
                >
                  {t("enterprise.cta")}
                </LandingTrackedAnchor>
              </div>
            </PixelCard>
          </div>
        </section>

        <section id="faq" className="section shell faq-section" aria-labelledby="faq-title">
          <div className="faq-layout">
            <div className="faq-heading">
              <p className="section-no">{t("faq.sectionNo")}</p>
              <h2 id="faq-title">{t("faq.title")}</h2>
            </div>
            <div className="faq-list">
              {FAQ_ITEM_KEYS.map((key, index) => (
                <details key={key} id={FAQ_ITEM_IDS[key]} {...(index === 0 ? { open: true } : {})}>
                  <summary>
                    {t(`faq.items.${key}.question`)}
                    <span className="faq-plus" aria-hidden="true" />
                  </summary>
                  <p>{t(`faq.items.${key}.answer`)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta" id="final-cta" aria-labelledby="final-title">
          <div className="final-cta-inner">
            <div className="final-cta-copy">
              <h2 id="final-title">{t("cta.title")}</h2>
              <p className="final-cta-description">{t("cta.description")}</p>
              <div className="final-cta-actions">
                <LandingTrackedLink
                  className="button"
                  ctaId="start_free_trial"
                  href={PRICING_LOGIN_HREF}
                  sourceSection="final_cta"
                >
                  {t("cta.primary")}
                </LandingTrackedLink>
                <LandingTrackedLink
                  className="button button-secondary"
                  ctaId="view_docs"
                  external
                  href={PRICING_DOCS_HREF}
                  sourceSection="final_cta"
                >
                  {t("cta.secondary")}
                </LandingTrackedLink>
              </div>
            </div>
            <div className="final-cta-detail">
              <ul className="final-cta-benefits">
                {FINAL_CTA_BENEFIT_KEYS.map((key) => (
                  <li key={key}>
                    <CheckCircleFill size={20} />
                    <span>{t(`cta.benefits.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
