"use client";

import {
  CALCULATOR_DEFAULT_PAGES,
  CALCULATOR_MAX_PAGES,
  CALCULATOR_MIN_PAGES,
  CALCULATOR_STEP_PAGES,
  CALCULATOR_TICKS,
  costForPages,
  EXAMPLE_PAGE_COUNTS,
  formatPageCount,
  PAGE_RATE_LABEL,
} from "@app/(landing)/pricing/_components/pricing-data";
import { MoveHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { type CSSProperties, useState } from "react";

const clampPageCount = (value: number): number => {
  const rounded = Math.round(value / CALCULATOR_STEP_PAGES) * CALCULATOR_STEP_PAGES;
  return Math.min(CALCULATOR_MAX_PAGES, Math.max(CALCULATOR_MIN_PAGES, rounded));
};

export const PricingCalculator = () => {
  const t = useTranslations("Pricing.calculator");
  const [pages, setPages] = useState(CALCULATOR_DEFAULT_PAGES);
  const [input, setInput] = useState(String(CALCULATOR_DEFAULT_PAGES));
  const progress =
    ((pages - CALCULATOR_MIN_PAGES) / (CALCULATOR_MAX_PAGES - CALCULATOR_MIN_PAGES)) * 100;
  const estimated = costForPages(pages);

  const updatePages = (value: number) => {
    const next = clampPageCount(value);
    setPages(next);
    setInput(String(next));
  };

  return (
    <section
      id="calculator"
      className="section calculator-section"
      aria-labelledby="calculator-title"
    >
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="section-no">{t("sectionNo")}</p>
            <h2 id="calculator-title">{t("title")}</h2>
          </div>
          <p>{t("description")}</p>
        </div>
        <div className="calculator">
          <div className="calculator-top">
            <div className="estimated">
              <span>{t("estimatedCost", { pageRate: PAGE_RATE_LABEL })}</span>
              <output aria-live="polite" className="total">
                {estimated}
              </output>
            </div>
            <div className="calculator-config">
              <label htmlFor="page-count">{t("pageCountLabel")}</label>
              <div className="page-input">
                <input
                  id="page-count"
                  type="number"
                  min={CALCULATOR_MIN_PAGES}
                  max={CALCULATOR_MAX_PAGES}
                  step={CALCULATOR_STEP_PAGES}
                  value={input}
                  style={{ "--page-digits": Math.max(3, input.length) } as CSSProperties}
                  onChange={(event) => {
                    const value = event.target.value;
                    setInput(value);
                    const count = Number(value);
                    if (
                      count >= CALCULATOR_MIN_PAGES &&
                      count <= CALCULATOR_MAX_PAGES &&
                      count % CALCULATOR_STEP_PAGES === 0
                    ) {
                      setPages(count);
                    }
                  }}
                  onBlur={() => updatePages(Number(input) || CALCULATOR_MIN_PAGES)}
                />
              </div>
            </div>
          </div>
          <div className="ruler-wrap" style={{ "--progress": `${progress}%` } as CSSProperties}>
            <div className="ruler">
              <div className="ruler-fill" />
              <div className="ruler-ticks" />
              <span className="ruler-line" />
              <span className="ruler-budget" aria-hidden="true">
                {estimated}
              </span>
              <span className="ruler-handle">
                <MoveHorizontal size={18} aria-hidden="true" />
              </span>
              <input
                aria-label={t("rangeAria")}
                aria-valuetext={t("rangeValue", {
                  pages: formatPageCount(pages),
                  cost: estimated,
                })}
                type="range"
                min={CALCULATOR_MIN_PAGES}
                max={CALCULATOR_MAX_PAGES}
                step={CALCULATOR_STEP_PAGES}
                value={pages}
                onChange={(event) => updatePages(Number(event.target.value))}
              />
            </div>
            <div className="ruler-labels">
              <span>{t("minLabel")}</span>
              {CALCULATOR_TICKS.map((tick) => (
                <span key={tick}>{formatPageCount(tick)}</span>
              ))}
              <span>{t("maxLabel")}</span>
            </div>
          </div>
          <dl className="calculator-facts" aria-live="polite">
            <div>
              <dt>{t("facts.monthly")}</dt>
              <dd>{estimated}</dd>
            </div>
            <div>
              <dt>{t("facts.report")}</dt>
              <dd>{costForPages(EXAMPLE_PAGE_COUNTS.report)}</dd>
            </div>
            <div>
              <dt>{t("facts.contracts")}</dt>
              <dd>{costForPages(EXAMPLE_PAGE_COUNTS.contracts)}</dd>
            </div>
            <div>
              <dt>{t("facts.volume")}</dt>
              <dd>{costForPages(EXAMPLE_PAGE_COUNTS.volume)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};
