"use client";

import { LandingTrackedLink } from "@app/(landing)/_components/landing-tracked-link";
import { type SiteChromePage, siteChromeNavigation } from "@components/site-chrome/links";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import "@components/site-chrome/site-chrome.css";

type FooterGridProps = {
  className?: string;
};

export const FooterGrid = ({ className = "kh-footer-flickering-grid" }: FooterGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let columns = 0;
    let rows = 0;
    let squares = new Float32Array(0);
    let maxOpacity = 0.05;
    let frame = 0;
    let lastTime = 0;
    let visible = false;
    let color = "";

    const isDarkTheme = () =>
      document.documentElement.classList.contains("dark") ||
      document.documentElement.dataset.theme === "dark";

    const draw = (delta = 0) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = color;
      for (let column = 0; column < columns; column += 1) {
        for (let row = 0; row < rows; row += 1) {
          const index = column * rows + row;
          if (Math.random() < 0.1 * delta) squares[index] = Math.random() * maxOpacity;
          context.globalAlpha = squares[index];
          context.fillRect(column * 10, row * 10, 4, 4);
        }
      }
    };

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(width / 10);
      rows = Math.ceil(height / 10);
      color = getComputedStyle(canvas).color;
      maxOpacity = isDarkTheme() ? 0.16 : 0.05;
      squares = Float32Array.from({ length: columns * rows }, () => Math.random() * maxOpacity);
      draw();
    };

    const animate = (time: number) => {
      draw(lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0);
      lastTime = time;
      frame = window.requestAnimationFrame(animate);
    };

    const updateMotion = () => {
      window.cancelAnimationFrame(frame);
      lastTime = 0;
      if (visible && !reducedMotion.matches) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    const themeObserver = new MutationObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      updateMotion();
    });

    resize();
    resizeObserver.observe(canvas);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });
    intersectionObserver.observe(canvas);
    reducedMotion.addEventListener("change", updateMotion);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotion.removeEventListener("change", updateMotion);
    };
  }, []);

  return (
    <div className={className} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
};

type SiteFooterProps = {
  page?: SiteChromePage;
};

export const SiteFooter = ({ page = "landing" }: SiteFooterProps) => {
  const t = useTranslations("SiteChrome");
  const links = siteChromeNavigation(page);
  const brandHref = page === "pricing" ? "#overview" : "#top";

  return (
    <footer className="kh-site-footer">
      <FooterGrid />
      <div className="kh-footer-inner">
        <div className="kh-footer-navigation">
          <Link className="kh-footer-brand" href={brandHref} aria-label={t("backToTop")}>
            <Image
              src="/images/site-chrome/knowhere-footer-mark.svg"
              width={37}
              height={42}
              alt=""
              unoptimized
            />
          </Link>
          <div className="kh-footer-navigation-content">
            <nav className="kh-footer-links" aria-label={t("footerLinks")}>
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
            <p className="kh-footer-copyright">
              {t("copyright", { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
        <span className="kh-footer-wordmark" aria-hidden="true" />
      </div>
    </footer>
  );
};
