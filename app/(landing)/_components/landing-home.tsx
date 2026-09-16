"use client";

import { CatenoidFieldTuner } from "@app/(landing)/_components/landing/catenoid-field-embed";
import { ProductStage } from "@app/(landing)/_components/landing/document-map";
import { EnterpriseIllustration } from "@app/(landing)/_components/landing/enterprise-illustrations";
import {
  CTA_HELIX_FALLBACK,
  ConvergingHelixEmbed,
} from "@app/(landing)/_components/landing/converging-helix-embed";
import { initializeLandingCanvases } from "@app/(landing)/_components/landing/landing-canvas";
import { initializeLandingInteractions } from "@app/(landing)/_components/landing/landing-interactions";
import ShinyText from "@app/(landing)/_components/landing/shiny-text";
import { LandingTrackedAnchor, LandingTrackedLink } from "@app/(landing)/_components/landing-tracked-link";
import { siteChromeNavigation } from "@components/site-chrome/links";
import { FooterGrid } from "@components/site-chrome/site-footer";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import "@app/(landing)/_components/landing.css";
import "remixicon/fonts/remixicon.css";

function SectionShinyText({ text }: { text: string }) {
  return (
    <ShinyText
      text={text}
      speed={2}
      delay={0}
      color="currentColor"
      shineColor="var(--figma-primary)"
      spread={120}
      direction="left"
      yoyo={false}
      pauseOnHover={false}
    />
  )
}

function TokenIcon({ src, className = '' }: { src: string; className?: string }) {
  return (
    <span
      className={`token-icon ${className}`.trim()}
      style={{ ['--token-icon-source' as string]: `url("${src}")` }}
      aria-hidden="true"
    />
  )
}

const structureTreeRows = [
  { label: 'Document map', level: 0, open: false },
  { label: 'Headings', level: 0, open: false },
  { label: 'Structure map', level: 0, open: true },
  { label: 'Annual report', level: 1, open: true },
  { label: 'Executive summary', level: 2, open: true },
  { label: 'Market findings', level: 3, leaf: true },
  { label: 'Revenue by region', level: 3, leaf: true },
  { label: 'Forecast formulas', level: 2, open: false },
  { label: 'Page relationships', level: 1, open: false },
  { label: 'Tables', level: 0, open: false },
  { label: 'Visual regions', level: 0, open: false },
]

function CapabilityTree({ className = '', rows }: { className?: string; rows: typeof structureTreeRows }) {
  return (
    <div className={`capability-figma-tree ${className}`.trim()}>
      {rows.map((row, rowIndex) => (
        <div className="capability-tree-row" data-level={row.level} key={row.label}>
          {Array.from({ length: row.level }, (_, depth) => (
            <span
              className="capability-tree-trail"
              style={{ ['--tree-depth' as string]: depth, ['--tree-bottom' as string]: (rows[rowIndex + 1]?.level ?? 0) > depth ? '-50%' : '50%' }}
              aria-hidden="true"
              key={depth}
            />
          ))}
          {row.level > 0 ? (
            <span
              className="capability-tree-branch"
              style={{ ['--tree-depth' as string]: row.level - 1 }}
              aria-hidden="true"
            />
          ) : null}
          <span className="capability-tree-leading"><TokenIcon src={row.leaf ? '/assets/process-checkbox.svg' : row.open ? '/assets/process-arrow-down.svg' : '/assets/process-arrow-right.svg'} /></span>
          <span className="capability-tree-label">{row.label}</span>
          <span className="capability-tree-actions"><TokenIcon src="/assets/process-check.svg" /><TokenIcon src="/assets/process-more.svg" /><TokenIcon src="/assets/process-action-arrow.svg" /></span>
        </div>
      ))}
    </div>
  )
}

function CapabilityCodeCard({ variant }: { variant: 'left' | 'center' | 'right' }) {
  const snippets = {
    left: [
      '// preserve page provenance',
      'const page = document.pages[12]',
      'const region = page.regions.revenue',
      'const source = region.source',
      'const bounds = region.boundingBox',
      'const content = region.content',
      'return { source, bounds, content }',
    ],
    center: [
      '// traceable document context',
      'const context = {',
      "  type: 'structured',",
      '  page: 12,',
      "  region: 'revenue',",
      "  source: 'annual-report.pdf',",
      "  path: 'tables/revenue-by-region'",
      '}',
      'return context.source',
    ],
    right: [
      '// return agent-ready context',
      'export function getContext(result) {',
      '  return {',
      '    content: result.content,',
      '    citations: result.sources,',
      '    documentMap: result.map',
      '  }',
      '}',
    ],
  }

  return (
    <div className={`capability-code-card capability-code-card--${variant}`}>
      <span className="capability-code-corner capability-code-corner--tl" />
      <span className="capability-code-corner capability-code-corner--tr" />
      <span className="capability-code-corner capability-code-corner--bl" />
      <span className="capability-code-corner capability-code-corner--br" />
      <code>
        {snippets[variant].map((line, index) => <span key={`${variant}-${index}`}>{line}</span>)}
      </code>
    </div>
  )
}

function CapabilityProductPreview({ story }: { story: string }) {
  if (story === 'structure') {
    return (
      <div className="capability-product-preview capability-product-preview--ingest" aria-hidden="true">
        <div className="capability-figma-upload">
          <span className="capability-corner capability-corner--top" />
          <div className="capability-upload-header"><div><strong>Ingest documents</strong><small>Add supported formats securely.</small></div><TokenIcon src="/assets/process-close.svg" /></div>
          <div className="capability-upload-drop"><img className="capability-upload-icon" src="/assets/process-upload-file.svg" alt="" /><div className="capability-upload-drop-copy"><strong>Drag and drop documents</strong><small>PDF, XLSX, PPTX, scans, and more</small></div><button type="button" tabIndex={-1}>Select file</button></div>
          <div className="capability-upload-files"><strong>Ingested files</strong><div><img className="capability-file-icon" src="/assets/process-upload-file.svg" alt="" /><span><b>Annual report.pdf</b><small>48 pages · Processing</small></span><button type="button" tabIndex={-1}>×</button></div><div><img className="capability-file-icon" src="/assets/process-upload-file.svg" alt="" /><span><b>Forecast.xlsx</b><small>6 sheets · Ready</small></span><button type="button" tabIndex={-1}>×</button></div></div>
          <div className="capability-upload-actions"><button type="button" tabIndex={-1}>Cancel</button><button type="button" tabIndex={-1}>Attach file</button></div>
        </div>
      </div>
    )
  }

  if (story === 'visual') {
    return (
      <div className="capability-product-preview capability-product-preview--capture" aria-hidden="true">
        <div className="capability-capture-stack">
          <article className="capability-capture-card capability-capture-card--table">
            <span className="capability-capture-corner capability-capture-corner--tl" /><span className="capability-capture-corner capability-capture-corner--tr" /><span className="capability-capture-corner capability-capture-corner--bl" /><span className="capability-capture-corner capability-capture-corner--br" />
            <header className="capability-capture-card-header"><strong>Tables</strong><p>Rows, columns, and headers stay connected to the page.</p></header>
            <div className="capability-capture-table">
              <div className="capability-capture-table-row capability-capture-table-row--head"><span>Region</span><span>Captured</span></div>
              <div className="capability-capture-table-row"><span>NA</span><span>48%</span></div>
              <div className="capability-capture-table-row"><span>EU</span><span>34%</span></div>
              <div className="capability-capture-table-row"><span>APAC</span><span>29%</span></div>
            </div>
          </article>

          <article className="capability-capture-card capability-capture-card--chart">
            <span className="capability-capture-corner capability-capture-corner--tl" /><span className="capability-capture-corner capability-capture-corner--tr" /><span className="capability-capture-corner capability-capture-corner--bl" /><span className="capability-capture-corner capability-capture-corner--br" />
            <header className="capability-capture-card-header"><strong>Charts</strong><p>Labels, legends, and visual relationships are preserved.</p></header>
            <div className="capability-capture-chart-title"><strong>Revenue by region</strong><span><i /> 2025</span></div>
            <div className="capability-capture-chart">
              <span style={{ ['--bar-height' as string]: '44%' }} /><span style={{ ['--bar-height' as string]: '62%' }} />
              <span style={{ ['--bar-height' as string]: '53%' }} /><span style={{ ['--bar-height' as string]: '76%' }} />
              <span style={{ ['--bar-height' as string]: '68%' }} /><span style={{ ['--bar-height' as string]: '84%' }} />
              <span style={{ ['--bar-height' as string]: '71%' }} /><span style={{ ['--bar-height' as string]: '92%' }} />
              <span style={{ ['--bar-height' as string]: '79%' }} /><span style={{ ['--bar-height' as string]: '88%' }} />
              <span style={{ ['--bar-height' as string]: '73%' }} /><span style={{ ['--bar-height' as string]: '96%' }} />
            </div>
          </article>

          <article className="capability-capture-card capability-capture-card--layout">
            <span className="capability-capture-corner capability-capture-corner--tl" /><span className="capability-capture-corner capability-capture-corner--tr" /><span className="capability-capture-corner capability-capture-corner--bl" /><span className="capability-capture-corner capability-capture-corner--br" />
            <header className="capability-capture-card-header"><strong>Layouts</strong><p>Text and visual regions retain their original positions.</p></header>
            <div className="capability-capture-layout-page">
              <span className="capability-capture-layout-heading" />
              <span className="capability-capture-layout-line capability-capture-layout-line--long" />
              <span className="capability-capture-layout-line" />
              <div className="capability-capture-layout-columns"><span /><span><i /><i /><i /></span></div>
              <span className="capability-capture-layout-line capability-capture-layout-line--long" />
              <span className="capability-capture-layout-line" />
            </div>
          </article>
        </div>
      </div>
    )
  }

  if (story === 'source') {
    return (
      <div className="capability-product-preview capability-product-preview--outline" aria-hidden="true">
        <CapabilityTree className="capability-figma-tree--focus" rows={structureTreeRows} />
      </div>
    )
  }

  return (
    <div className="capability-product-preview capability-product-preview--trace" aria-hidden="true">
      <div className="capability-code-cascade">
        <CapabilityCodeCard variant="left" />
        <span className="capability-code-connector capability-code-connector--left" />
        <CapabilityCodeCard variant="center" />
        <span className="capability-code-connector capability-code-connector--right" />
        <CapabilityCodeCard variant="right" />
      </div>
    </div>
  )
}

function FinalCtaHelix({ theme }: { theme: string }) {
  const accentColor = theme === 'dark' ? 'var(--mineral-green-600)' : 'var(--mineral-green-300)'
  const embedProps = { ...CTA_HELIX_FALLBACK, accentColor }

  return (
    <>
      <div className="converging-helix-pair" aria-hidden="true" style={{ ['--converging-helix-y' as string]: `${CTA_HELIX_FALLBACK.yPosition}px` }}>
        <ConvergingHelixEmbed {...embedProps} className="converging-helix-embed--left" />
        <ConvergingHelixEmbed {...embedProps} className="converging-helix-embed--right" mirror />
      </div>
    </>
  )
}

function LandingFooter() {
  const t = useTranslations("SiteChrome");
  const links = siteChromeNavigation("landing");

  return (
    <footer className="footer">
      <FooterGrid className="footer-flickering-grid" />
      <div className="footer-inner">
        <div className="footer-navigation">
          <Link className="footer-brand" href="#top" aria-label={t("backToTop")}>
            <Image
              src="/images/site-chrome/knowhere-footer-mark.svg"
              width={37}
              height={42}
              alt=""
              unoptimized
            />
          </Link>
          <div className="footer-navigation-content">
            <nav className="footer-links" aria-label={t("footerLinks")}>
              {links.map((item) => (
                <LandingTrackedLink
                  key={item.key}
                  href={item.href}
                  ctaId={item.ctaId}
                  external={item.external}
                  sourceSection="footer"
                >
                  {t(`nav.${item.key}`)}
                </LandingTrackedLink>
              ))}
            </nav>
            <p className="footer-copyright">{t("copyright", { year: new Date().getFullYear() })}</p>
          </div>
        </div>
        <span className="footer-wordmark" aria-hidden="true" />
      </div>
    </footer>
  );
}


export const LandingHome = () => {
  const t = useTranslations("Landing");
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    document.documentElement.classList.add("js");
    document.documentElement.classList.remove("no-js");
  }, []);

  useEffect(() => {
    const language = locale === "zh" ? "zh" : "en";
    document.body.dataset.language = language;
    window.dispatchEvent(new CustomEvent("knowhere-language-change", { detail: { language } }));
  }, [locale]);

  useEffect(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (navigation?.type === "reload" || navigation?.type === "back_forward") return undefined;
    const hash = window.location.hash;
    if (!hash) return undefined;
    let cancelled = false;
    let frame = 0;
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        if (window.location.hash === hash) {
          document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "instant" });
        }
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const cleanupCanvases = initializeLandingCanvases(root);
    const cleanupInteractions = initializeLandingInteractions(root);
    return () => {
      cleanupCanvases();
      cleanupInteractions();
    };
  }, [locale]);

  return (
<div className="landing-page" ref={rootRef}>
  <a className="skip-link" href="#main">{t("skipToContent")}</a>
  <main id="main" tabIndex={-1}>
    <section className="hero shell hero-b-layout" id="top" aria-labelledby="hero-title">
      <canvas id="hero-b-pixel-field" aria-hidden="true" />
      <div className="hero-copy">
        <h1 id="hero-title" data-heading-primary="agents can use">{t("hero.title")}</h1>
        <p className="lede">{t("hero.lede")}</p>
        <div className="button-row">
          <LandingTrackedLink className="button" ctaId="start_free_trial" href="/login" sourceSection="hero">{t("hero.startFreeTrial")}</LandingTrackedLink>
          <LandingTrackedLink className="button button-secondary" ctaId="view_docs" external href="https://docs.knowhereto.ai/" sourceSection="hero">{t("hero.readDocs")}</LandingTrackedLink>
        </div>
      </div>
      <div className="hero-visual" aria-label={t("hero.visualAria")}>
        <article className="hero-b-chart">
          <div className="hero-b-chart-shell" aria-hidden="true" />
        </article>
      </div>
    </section>
    <canvas className="hero-scan-overlay" aria-hidden="true" />
    <div className="hero-b-pixel-tooltip" id="hero-b-pixel-tooltip" role="status" aria-live="polite" />
    <section className="section shell" id="playground" aria-labelledby="playground-title">
      <ProductStage heading={(
        <div className="section-heading"><p className="section-no"><SectionShinyText text={t("product.sectionNo")} /></p><h2 id="playground-title"><SectionShinyText text={t("product.title")} /></h2><p>{t("product.description")}<a className="product-formats-link" href="#formats">{t("product.viewFormats")}</a></p></div>
      )} />
    </section>
    <div className="capabilities-scroll-track">
      <section className="section shell narrative reveal" id="capabilities" aria-labelledby="capabilities-title">
        <div className="capabilities-sticky">
          <div className="section-heading"><p className="section-no"><SectionShinyText text={t("process.sectionNo")} /></p><h2 id="capabilities-title"><SectionShinyText text={t("process.title")} /></h2><p>{t("process.description")}</p></div>
          <div className="narrative-grid">
            <div className="story-card-stack">
              <article className="story-canvas story-card" id="story-panel-structure" data-story="structure">
                <div className="capability-frame"><div className="capability-media" role="img" aria-label={t("process.stories.ingest.mediaAria")}><CapabilityProductPreview story="structure" /></div></div>
                <div className="capability-copy"><div className="capability-copy-main"><div className="capability-copy-title"><span className="capability-copy-index">01</span><h3 data-story-heading>{t("process.stories.ingest.title")}</h3></div><p data-story-summary>{t("process.stories.ingest.summary")}</p></div></div>
              </article>
              <article className="story-canvas story-card" id="story-panel-visual" data-story="visual">
                <div className="capability-frame"><div className="capability-media" role="img" aria-label={t("process.stories.capture.mediaAria")}><CapabilityProductPreview story="visual" /></div></div>
                <div className="capability-copy"><div className="capability-copy-main"><div className="capability-copy-title"><span className="capability-copy-index">02</span><h3 data-story-heading>{t("process.stories.capture.title")}</h3></div><p data-story-summary>{t("process.stories.capture.summary")}</p></div></div>
              </article>
              <article className="story-canvas story-card" id="story-panel-source" data-story="source">
                <div className="capability-frame"><div className="capability-media" role="img" aria-label={t("process.stories.map.mediaAria")}><CapabilityProductPreview story="source" /></div></div>
                <div className="capability-copy"><div className="capability-copy-main"><div className="capability-copy-title"><span className="capability-copy-index">03</span><h3 data-story-heading>{t("process.stories.map.title")}</h3></div><p data-story-summary>{t("process.stories.map.summary")}</p></div></div>
              </article>
              <article className="story-canvas story-card" id="story-panel-relations" data-story="relations">
                <div className="capability-frame"><div className="capability-media" role="img" aria-label={t("process.stories.return.mediaAria")}><CapabilityProductPreview story="relations" /></div></div>
                <div className="capability-copy"><div className="capability-copy-main"><div className="capability-copy-title"><span className="capability-copy-index">04</span><h3 data-story-heading>{t("process.stories.return.title")}</h3></div><p data-story-summary>{t("process.stories.return.summary")}</p></div></div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div className="formats-scroll-track">
      <section className="section shell reveal" id="formats" aria-labelledby="formats-title">
        <div className="section-heading"><p className="section-no"><SectionShinyText text={t("formats.sectionNo")} /></p><h2 id="formats-title"><SectionShinyText text={t("formats.title")} /></h2><p>{t("formats.description")}</p></div>
        <div className="formats-grid">
          <article className="format-feature format-feature--formats">
            <div className="format-orbit-layout format-intro-ready">
              <span className="format-orbit-halo format-orbit-halo--supported" aria-hidden="true" />
              <span className="format-orbit-halo format-orbit-halo--coming" aria-hidden="true" />
              <div className="format-orbit-copy format-orbit-copy--supported">
                <p>{t("formats.supportedIntro")}<br /> {t("formats.supportedIntroLineTwo")}</p>
                <p>{t("formats.supportedList")}</p>
              </div>
              <div className="format-orbit-stage format-orbit-stage--thread-globe" aria-label={t("formats.orbitAria")}>
                <canvas className="format-globe-canvas" data-format-globe aria-hidden="true" />
                <span className="format-orbit-ring format-orbit-ring--inner" aria-hidden="true" />
                <span className="format-orbit-ring format-orbit-ring--middle" aria-hidden="true" />
                <span className="format-orbit-ring format-orbit-ring--outer" aria-hidden="true" />
                <span className="format-orbit-center" aria-hidden="true">KNOWHERE</span>
                <div className="format-orbit-shell format-orbit-shell--inner">
                  <div className="format-chips format-orbit-track">
                    <span className="format-orbit-item" style={{['--orbit-x' as string]: '100%', ['--orbit-y' as string]: '50%'}}><span className="format-orbit-counter"><button type="button" className="format-orbit-chip" data-format="documents">PDF</button></span></span>
                    <span className="format-orbit-item" style={{['--orbit-x' as string]: '0%', ['--orbit-y' as string]: '50%'}}><span className="format-orbit-counter"><button type="button" className="format-orbit-chip" data-format="documents">DOCX</button></span></span>
                  </div>
                </div>
                <div className="format-orbit-shell format-orbit-shell--middle">
                  <div className="format-chips format-orbit-track">
                    <span className="format-orbit-item" style={{['--orbit-x' as string]: '100%', ['--orbit-y' as string]: '50%'}}><span className="format-orbit-counter"><button type="button" className="format-orbit-chip" data-format="presentations">PPTX</button></span></span>
                    <span className="format-orbit-item" style={{['--orbit-x' as string]: '25%', ['--orbit-y' as string]: '93.3%'}}><span className="format-orbit-counter"><button type="button" className="format-orbit-chip" data-format="data">XLSX</button></span></span>
                    <span className="format-orbit-item" style={{['--orbit-x' as string]: '25%', ['--orbit-y' as string]: '6.7%'}}><span className="format-orbit-counter"><button type="button" className="format-orbit-chip" data-format="data">CSV</button></span></span>
                  </div>
                </div>
                <div className="format-orbit-shell format-orbit-shell--outer">
                  <div className="format-chips format-orbit-track">
                    <span className="format-orbit-item" style={{['--orbit-x' as string]: '100%', ['--orbit-y' as string]: '50%'}}><span className="format-orbit-counter"><button type="button" className="format-orbit-chip" data-format="documents">Markdown</button></span></span>
                    <span className="format-orbit-item" style={{['--orbit-x' as string]: '25%', ['--orbit-y' as string]: '93.3%'}}><span className="format-orbit-counter"><button type="button" className="format-orbit-chip" data-format="visual">JPG / PNG</button></span></span>
                    <span className="format-orbit-item" style={{['--orbit-x' as string]: '25%', ['--orbit-y' as string]: '6.7%'}}><span className="format-orbit-counter"><button type="button" className="format-orbit-chip" data-format="data">TXT / JSON</button></span></span>
                  </div>
                </div>
              </div>
              <div className="format-orbit-copy format-orbit-copy--coming">
                <p>{t("formats.comingSoonLineOne")}<br />{t("formats.comingSoonLineTwo")} <span>{t("formats.comingSoon")}</span></p>
              </div>
            </div>
          </article>
          <div className="formats-secondary-scroll">
            <div className="formats-secondary-sticky">
              <div className="formats-secondary-viewport">
                <div className="formats-secondary-grid">
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-file-search-line" /></div><div><h3>{t("formats.features.pageNative.title")}</h3><p>{t("formats.features.pageNative.description")}</p></div></article>
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-node-tree" /></div><div><h3>{t("formats.features.agentReady.title")}</h3><p>{t("formats.features.agentReady.description")}</p></div></article>
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-flask-line" /></div><div><h3>{t("formats.features.formula.title")}</h3><p>{t("formats.features.formula.description")}</p></div></article>
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-route-line" /></div><div><h3>{t("formats.features.tracing.title")}</h3><p>{t("formats.features.tracing.description")}</p></div></article>
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-server-line" /></div><div><h3>{t("formats.features.onPrem.title")}</h3><p>{t("formats.features.onPrem.description")}</p></div></article>
                  <article className="format-feature"><div className="format-feature-icon" aria-hidden="true"><i className="ri-code-s-slash-line" /></div><div><h3>{t("formats.features.apiFirst.title")}</h3><p>{t("formats.features.apiFirst.description")}</p></div></article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <section className="section shell reveal" id="comparison" aria-labelledby="comparison-title">
      <div className="section-heading">
        <p className="section-no"><SectionShinyText text={t("comparison.sectionNo")} /></p>
        <h2 id="comparison-title"><SectionShinyText text={t("comparison.title")} /></h2>
        <p>{t("comparison.description")}</p>
      </div>
      <div className="comparison-frame" aria-label={t("comparison.frameAria")}>
        <div className="comparison-dashboard">
          <div className="comparison-chart">
            <div className="comparison-chart-header">
              <p className="comparison-chart-note">{t("comparison.performance")}</p>
              <div className="comparison-legend" aria-label={t("comparison.legendAria")}><span><i />{t("comparison.legend.rawDocs")}</span><span><i className="unstructured-key" />{t("comparison.legend.unstructured")}</span><span><i className="knowhere-key" />{t("comparison.legend.knowhere")}</span><span><i className="mineru-key" />{t("comparison.legend.mineru")}</span><span><i className="markitdown-key" />{t("comparison.legend.markitdown")}</span></div>
            </div>
            <div className="comparison-plot">
              <div className="comparison-axis-y comparison-axis-y--left" aria-hidden="true"><strong>{t("comparison.tokensUsed")}</strong><div className="comparison-axis-ticks"><span>2000</span><span>1500</span><span>1000</span><span>500</span><span>0</span></div></div>
              <div className="comparison-plot-body">
                <div className="comparison-metrics" aria-hidden="true">
                  <div className="comparison-metric"><i data-value={1630} style={{height: '81.5%'}} /><i data-value={1886} style={{height: '94.3%'}} /><i data-value={1574} style={{height: '78.7%'}} /><i data-value={1670} style={{height: '83.5%'}} /><i data-value={1503} style={{height: '75.15%'}} /></div>
                  <div className="comparison-metric"><i data-value="20.57" style={{height: '82.28%'}} /><i data-value="16.61" style={{height: '66.44%'}} /><i data-value="15.25" style={{height: '61%'}} /><i data-value="17.48" style={{height: '69.92%'}} /><i data-value="15.2" style={{height: '60.8%'}} /></div>
                  <div className="comparison-metric"><i data-value="2.61" style={{height: '52.2%'}} /><i data-value="2.34" style={{height: '46.8%'}} /><i data-value="2.14" style={{height: '42.8%'}} /><i data-value="2.20" style={{height: '44%'}} /><i data-value="2.18" style={{height: '43.6%'}} /></div>
                  <div className="comparison-metric"><i data-value="0.50" style={{height: '50%'}} /><i data-value="0.61" style={{height: '61%'}} /><i data-value="0.68" style={{height: '68%'}} /><i data-value="0.66" style={{height: '66%'}} /><i data-value="0.59" style={{height: '59%'}} /></div>
                  <div className="comparison-metric"><i data-value="0.53" style={{height: '53%'}} /><i data-value="0.69" style={{height: '69%'}} /><i data-value="0.79" style={{height: '79%'}} /><i data-value="0.64" style={{height: '64%'}} /><i data-value="0.54" style={{height: '54%'}} /></div>
                  <div className="comparison-metric"><i data-value="0.74" style={{height: '74%'}} /><i data-value="0.77" style={{height: '77%'}} /><i data-value="0.82" style={{height: '82%'}} /><i data-value="0.78" style={{height: '78%'}} /><i data-value="0.76" style={{height: '76%'}} /></div>
                </div>
                <div className="comparison-metric-labels"><span>{t("comparison.tokensUsed")}</span><span>{t("comparison.processingTime")}</span><span>{t("comparison.agentIterations")}</span><span>{t("comparison.firstPass")}</span><span>{t("comparison.afterFeedback")}</span><span>{t("comparison.recall")}</span></div>
              </div>
              <div className="comparison-axis-y comparison-axis-y--right" aria-hidden="true"><div className="comparison-axis-ticks"><span>25</span><span>20</span><span>15</span><span>10</span><span>5</span><span>0</span></div><strong>{t("comparison.processingTimeSeconds")}</strong></div>
              <div className="comparison-axis-y comparison-axis-y--right comparison-axis-y--outer" aria-hidden="true"><div className="comparison-axis-ticks"><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span></div><strong>{t("comparison.agentIterations")}</strong></div>
            </div>
          </div>
        </div>
        <div className="comparison-scoreboard is-expanded" role="group" aria-label={t("comparison.matrixAria")}>
          <div className="comparison-scoreboard-head"><strong>{t("comparison.matrix")}</strong></div>
          <div className="comparison-scoreboard-body" id="comparison-table" aria-hidden="false"><div className="comparison-scoreboard-grid">
              <div className="scoreboard-cell scoreboard-head-cell">{t("comparison.feature")}</div><div className="scoreboard-cell scoreboard-head-cell scoreboard-knowhere">{t("comparison.legend.knowhere")}</div><div className="scoreboard-cell scoreboard-head-cell">{t("comparison.typicalParsers")}</div>
              <div className="scoreboard-cell scoreboard-feature">{t("comparison.rows.hierarchy")}</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-fill" aria-hidden="true" />{t("comparison.supported")}</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--bad"><i className="ri-error-warning-fill" aria-hidden="true" />{t("comparison.limited")}</span></div>
              <div className="scoreboard-cell scoreboard-feature">{t("comparison.rows.mergedCells")}</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-fill" aria-hidden="true" />{t("comparison.supported")}</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--bad"><i className="ri-error-warning-fill" aria-hidden="true" />{t("comparison.limited")}</span></div>
              <div className="scoreboard-cell scoreboard-feature">{t("comparison.rows.boundaries")}</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-fill" aria-hidden="true" />{t("comparison.supported")}</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--no"><i className="ri-close-circle-fill" aria-hidden="true" />{t("comparison.notSupported")}</span></div>
              <div className="scoreboard-cell scoreboard-feature">{t("comparison.rows.tracing")}</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-fill" aria-hidden="true" />{t("comparison.supported")}</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--bad"><i className="ri-error-warning-fill" aria-hidden="true" />{t("comparison.limited")}</span></div>
              <div className="scoreboard-cell scoreboard-feature">{t("comparison.rows.progressive")}</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-fill" aria-hidden="true" />{t("comparison.supported")}</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--no"><i className="ri-close-circle-fill" aria-hidden="true" />{t("comparison.notSupported")}</span></div>
              <div className="scoreboard-cell scoreboard-feature">{t("comparison.rows.visual")}</div><div className="scoreboard-cell scoreboard-knowhere"><span className="scoreboard-mark scoreboard-mark--yes"><i className="ri-checkbox-circle-fill" aria-hidden="true" />{t("comparison.supported")}</span></div><div className="scoreboard-cell"><span className="scoreboard-mark scoreboard-mark--limited"><i className="ri-subtract-fill" aria-hidden="true" />{t("comparison.limited")}</span></div>
            </div></div>
        </div>
      </div>
    </section>
    <section className="section shell reveal" id="integration" aria-labelledby="integration-title">
      <div className="section-heading"><p className="section-no"><SectionShinyText text={t("integration.sectionNo")} /></p><h2 id="integration-title"><SectionShinyText text={t("integration.title")} /></h2><p>{t("integration.description")}</p></div>
      <div className="integration-grid">
        <ol className="steps"><li><div><h3><span className="integration-step-number">01</span>{t("integration.steps.key.title")}</h3><p>{t("integration.steps.key.description")}</p></div></li><li><div><h3><span className="integration-step-number">02</span>{t("integration.steps.submit.title")}</h3><p>{t("integration.steps.submit.description")}</p></div></li><li><div><h3><span className="integration-step-number">03</span>{t("integration.steps.results.title")}</h3><p>{t("integration.steps.results.description")}</p></div></li></ol>
        <div className="integration-plinth">
          <CatenoidFieldTuner />
        </div>
        <div className="code-card"><div className="code-head"><span>{t("integration.codeHead")}</span><button type="button" className="copy-code">{t("integration.copy")}</button></div><div className="tabs compact" role="tablist" aria-label={t("integration.codeAria")}><button role="tab" id="code-python" aria-selected="true" aria-controls="code-panel-python">Python</button><button role="tab" id="code-node" aria-selected="false" aria-controls="code-panel-node" tabIndex={-1}>Node.js</button><button role="tab" id="code-curl" aria-selected="false" aria-controls="code-panel-curl" tabIndex={-1}>cURL</button></div><div className="code-panels"><pre role="tabpanel" tabIndex={0} id="code-panel-python" aria-labelledby="code-python"><code>{`# Illustrative only — no real endpoint
result = knowhere.process("sample.pdf")
print(result.structure)`}</code></pre><pre role="tabpanel" tabIndex={0} id="code-panel-node" aria-labelledby="code-node"><code>{`// Illustrative only — no real endpoint
const result = await knowhere.process("sample.pdf")
console.log(result.structure)`}</code></pre><pre role="tabpanel" tabIndex={0} id="code-panel-curl" aria-labelledby="code-curl"><code>{`# Illustrative only — no real endpoint
curl -X POST "[endpoint-to-be-confirmed]" \\
  -F "file=@sample.pdf"`}</code></pre></div><p className="sr-only" aria-live="polite" data-copy-live /></div>
        <div className="mcp"><div className="mcp-copy"><h3>{t("integration.mcpTitle")}</h3><p>{t("integration.mcpDescription")}</p></div><LandingTrackedLink href="https://docs.knowhereto.ai/mcp" className="text-link" ctaId="view_mcp_docs" external sourceSection="integration">{t("integration.mcpLink")} <i className="ri-arrow-right-s-line" aria-hidden="true" /></LandingTrackedLink></div>
      </div>
    </section>
    <section className="section shell reveal" id="pricing" aria-labelledby="pricing-title">
      <div className="pricing-card">
        <div className="pricing-heading"><p className="section-no"><SectionShinyText text={t("pricing.sectionNo")} /></p><h2 id="pricing-title"><SectionShinyText text={t("pricing.title")} /></h2><p>{t("pricing.description")}</p></div>
        <div className="pricing-calculator">
          <div className="pricing-result-card">
            <div className="pricing-result-value">
              <div className="pricing-result-estimate">
                <span>{t("pricing.estimatedCost")}</span>
                <output data-pricing-price aria-live="polite">$9.00</output>
              </div>
              <div className="pricing-result-config">
                <label htmlFor="pricing-page-count">{t("pricing.pageCount")}</label>
                <div className="pricing-result-pages"><input id="pricing-page-count" type="number" min={100} max={10000} step={100} defaultValue={600} /></div>
              </div>
            </div>
          </div>
          <dl className="pricing-facts"><div><dt>{t("pricing.estimatedBudget")}</dt><dd data-pricing-price>$9.00</dd></div><div><dt>{t("pricing.pdfs")}</dt><dd data-pricing-pdf>6 documents</dd></div><div><dt>{t("pricing.largeDocs")}</dt><dd data-pricing-large>1 document</dd></div><div><dt>{t("pricing.commitment")}</dt><dd>{t("pricing.noMinimum")}</dd></div></dl>
          <div className="pricing-control-card"><label className="sr-only" htmlFor="pricing-pages">{t("pricing.pagesToProcess")}</label><div className="pricing-range-control" style={{['--pricing-progress' as string]: '5.0505%'}}>
            <div className="pricing-range-ticks" aria-hidden="true">
              {Array.from({ length: 81 }, (_, index) => <span key={index} className={`pricing-range-tick${index % 20 === 0 ? ' is-major' : index % 4 === 0 ? ' is-medium' : ''}`} style={{ left: `${index * 1.25}%` }} />)}
            </div>
            <span className="pricing-range-selection" aria-hidden="true" /><span className="pricing-range-handle" data-pricing-range-handle style={{['--pricing-progress' as string]: '5.0505%'}} aria-hidden="true"><span className="pricing-range-handle-visual"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12H21M7 8L3 12L7 16M17 8L21 12L17 16" /></svg></span></span><span className="pricing-range-budget" data-pricing-range-budget style={{['--pricing-progress' as string]: '5.0505%'}}><strong data-pricing-price>$9.00</strong></span><input className="pricing-range" id="pricing-pages" type="range" min={100} max={10000} step={100} defaultValue={600} aria-label={t("pricing.pagesToProcess")} /></div>
            <div className="pricing-range-labels"><span>{t("pricing.scaleStart")}</span><span>2,500</span><span>5,000</span><span>7,500</span><span>10,000</span></div>
          </div>
        </div>
        <section className="pricing-file-limits" aria-labelledby="pricing-file-limits-title">
          <div className="pricing-file-limits-head"><h3 id="pricing-file-limits-title">{t("pricing.fileLimitsTitle")}</h3><p>{t("pricing.fileLimitsContact")} <LandingTrackedAnchor href="mailto:team@knowhereto.ai" ctaId="contact_sales" sourceSection="pricing">team@knowhereto.ai</LandingTrackedAnchor><br />{t("pricing.fileLimitsEnd")}</p></div>
          <dl><div><dt>.pdf</dt><dd>100M</dd></div><div><dt>.docx</dt><dd>50M</dd></div><div><dt>.xlsx</dt><dd>100M</dd></div><div><dt>.pptx</dt><dd>100M</dd></div></dl>
        </section>
      </div>
    </section>
    <section className="section shell reveal" id="enterprise" aria-labelledby="enterprise-title">
      <div className="enterprise-content">
        <p className="section-no enterprise-label"><SectionShinyText text={t("enterprise.sectionNo")} /></p>
        <div className="enterprise-copy"><h2 id="enterprise-title"><SectionShinyText text={t("enterprise.title")} /></h2><div className="enterprise-copy-detail"><p className="lede">{t("enterprise.lede")}</p><LandingTrackedAnchor className="button sales-link" href="mailto:team@knowhereto.ai" ctaId="contact_sales" sourceSection="enterprise">{t("enterprise.talk")}</LandingTrackedAnchor></div></div>
        <ul className="enterprise-metrics">
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><EnterpriseIllustration type="limits" /></div><div className="enterprise-metric-copy"><strong>{t("enterprise.metrics.limits.title")}</strong><p>{t("enterprise.metrics.limits.description")}</p></div></li>
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><EnterpriseIllustration type="priority" /></div><div className="enterprise-metric-copy"><strong>{t("enterprise.metrics.priority.title")}</strong><p>{t("enterprise.metrics.priority.description")}</p></div></li>
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><EnterpriseIllustration type="deployment" /></div><div className="enterprise-metric-copy"><strong>{t("enterprise.metrics.deployment.title")}</strong><p>{t("enterprise.metrics.deployment.description")}</p></div></li>
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><EnterpriseIllustration type="support" /></div><div className="enterprise-metric-copy"><strong>{t("enterprise.metrics.support.title")}</strong><p>{t("enterprise.metrics.support.description")}</p></div></li>
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><EnterpriseIllustration type="sla" /></div><div className="enterprise-metric-copy"><strong>{t("enterprise.metrics.sla.title")}</strong><p>{t("enterprise.metrics.sla.description")}</p></div></li>
          <li className="enterprise-metric"><div className="enterprise-metric-visual" aria-hidden="true"><EnterpriseIllustration type="commercial" /></div><div className="enterprise-metric-copy"><strong>{t("enterprise.metrics.commercial.title")}</strong><p>{t("enterprise.metrics.commercial.description")}</p></div></li>
        </ul>
      </div>
    </section>
    <section className="section shell reveal" id="faq" aria-labelledby="faq-title">
        <div className="section-heading"><p className="section-no"><SectionShinyText text={t("faq.sectionNo")} /></p><h2 id="faq-title"><SectionShinyText text={t("faq.title")} /></h2></div>
        <div className="faq-list">
          <details open><summary aria-expanded="true" aria-controls="faq-answer-1">{t("faq.items.charged.question")}<span aria-hidden="true">↓</span></summary><p id="faq-answer-1">{t("faq.items.charged.answer")}</p></details>
          <details><summary aria-expanded="false" aria-controls="faq-answer-2">{t("faq.items.rollover.question")}<span aria-hidden="true">↓</span></summary><p id="faq-answer-2">{t("faq.items.rollover.answer")}</p></details>
          <details><summary aria-expanded="false" aria-controls="faq-answer-3">{t("faq.items.refund.question")}<span aria-hidden="true">↓</span></summary><p id="faq-answer-3">{t("faq.items.refund.answer")}</p></details>
          <details><summary aria-expanded="false" aria-controls="faq-answer-4">{t("faq.items.payment.question")}<span aria-hidden="true">↓</span></summary><p id="faq-answer-4">{t("faq.items.payment.answer")}</p></details>
        </div>
    </section>
    <section className="section shell final-cta reveal" id="final-cta" aria-labelledby="final-title">
      <FinalCtaHelix theme={theme} />
      <div id="final-cta-copy">
        <p className="section-no"><SectionShinyText text={t("finalCta.sectionNo")} /></p>
        <h2 id="final-title"><SectionShinyText text={t("finalCta.title")} /></h2>
      </div>
      <div className="final-cta-detail">
        <p className="lede">{t("finalCta.lede")}</p>
        <div id="final-cta-actions">
          <LandingTrackedLink className="button" ctaId="start_free_trial" href="/login" sourceSection="final_cta">{t("hero.startFreeTrial")}</LandingTrackedLink>
          <LandingTrackedAnchor className="button button-secondary" ctaId="book_demo" href="mailto:team@knowhereto.ai" sourceSection="final_cta">{t("finalCta.bookDemo")}</LandingTrackedAnchor>
        </div>
        <ul className="final-cta-benefits" aria-label={t("finalCta.benefitsAria")}>
          <li><svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M6.75 9 8.25 10.5 11.25 7.5M15.75 9c0 .886-.175 1.764-.514 2.583a6.75 6.75 0 0 1-3.653 3.653A6.75 6.75 0 0 1 9 15.75a6.75 6.75 0 0 1-2.583-.514 6.75 6.75 0 0 1-3.653-3.653A6.75 6.75 0 0 1 2.25 9a6.75 6.75 0 0 1 13.5 0Z" /></svg>{t("finalCta.trial")}</li>
          <li><svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M6.75 9 8.25 10.5 11.25 7.5M15.75 9c0 .886-.175 1.764-.514 2.583a6.75 6.75 0 0 1-3.653 3.653A6.75 6.75 0 0 1 9 15.75a6.75 6.75 0 0 1-2.583-.514 6.75 6.75 0 0 1-3.653-3.653A6.75 6.75 0 0 1 2.25 9a6.75 6.75 0 0 1 13.5 0Z" /></svg>{t("finalCta.noCard")}</li>
          <li><svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M6.75 9 8.25 10.5 11.25 7.5M15.75 9c0 .886-.175 1.764-.514 2.583a6.75 6.75 0 0 1-3.653 3.653A6.75 6.75 0 0 1 9 15.75a6.75 6.75 0 0 1-2.583-.514 6.75 6.75 0 0 1-3.653-3.653A6.75 6.75 0 0 1 2.25 9a6.75 6.75 0 0 1 13.5 0Z" /></svg>{t("finalCta.cancel")}</li>
        </ul>
      </div>
    </section>
  </main>
  <LandingFooter />
  <div className="toast" role="status" aria-live="polite" hidden><p data-toast-message /><button type="button" aria-label={t("toastClose")}>×</button></div>
</div>
  );
};
