"use client";

import { trackContactSalesClicked, trackLandingCtaClick } from "@lib/posthog";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { ComponentProps, MouseEvent, ReactNode } from "react";

type LandingTrackedLinkProps = {
  ctaId: string;
  sourceSection: string;
  href?: string;
  external?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
} & Omit<ComponentProps<typeof Link>, "href" | "onClick" | "children" | "className">;

type LandingTrackedAnchorProps = {
  ctaId: string;
  sourceSection: string;
  href: string;
  external?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

type LandingTrackedButtonProps = {
  ctaId: string;
  sourceSection: string;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

const isContactSalesCta = (ctaId: string) => ctaId === "contact_sales" || ctaId === "book_demo";

const externalLinkRel = "noopener noreferrer";

const trackCta = (ctaId: string, sourceSection: string, locale: string, href?: string) => {
  if (isContactSalesCta(ctaId)) {
    trackContactSalesClicked(sourceSection);
    return;
  }

  trackLandingCtaClick(ctaId, {
    source_section: sourceSection,
    locale,
    href,
  });
};

export const LandingTrackedLink = ({
  ctaId,
  sourceSection,
  href = "#",
  external = false,
  children,
  className,
  onClick,
  ...linkProps
}: LandingTrackedLinkProps) => {
  const locale = useLocale();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackCta(ctaId, sourceSection, locale, href);
    onClick?.(event);
  };

  return (
    <Link
      {...linkProps}
      className={className}
      href={href}
      onClick={handleClick}
      rel={external ? externalLinkRel : undefined}
      target={external ? "_blank" : undefined}
    >
      {children}
    </Link>
  );
};

export const LandingTrackedAnchor = ({
  ctaId,
  sourceSection,
  href,
  external = false,
  children,
  className,
  onClick,
}: LandingTrackedAnchorProps) => {
  const locale = useLocale();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackCta(ctaId, sourceSection, locale, href);
    onClick?.(event);
  };

  return (
    <a
      className={className}
      href={href}
      onClick={handleClick}
      rel={external ? externalLinkRel : undefined}
      target={external ? "_blank" : undefined}
    >
      {children}
    </a>
  );
};

export const LandingTrackedButton = ({
  ctaId,
  sourceSection,
  children,
  className,
  type = "button",
  onClick,
}: LandingTrackedButtonProps) => {
  const locale = useLocale();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    trackCta(ctaId, sourceSection, locale);
    onClick?.(event);
  };

  return (
    <button className={className} onClick={handleClick} type={type}>
      {children}
    </button>
  );
};

export const trackLandingInteraction = (
  ctaId: string,
  sourceSection: string,
  locale: string,
  extra?: Record<string, unknown>
) => {
  if (isContactSalesCta(ctaId)) {
    trackContactSalesClicked(sourceSection);
    return;
  }

  trackLandingCtaClick(ctaId, {
    source_section: sourceSection,
    locale,
    ...extra,
  });
};
