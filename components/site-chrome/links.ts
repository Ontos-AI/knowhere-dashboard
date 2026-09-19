/*
  `not-found` has no entry in the header nav on purpose: the 404 renders the shared chrome
  so it looks like the rest of the site, but no nav item is the current page there.
*/
export type SiteChromePage = "landing" | "blog" | "pricing" | "not-found";

export type SiteChromeNavKey = "comparison" | "pricing" | "docs" | "playground" | "blog";

export type SiteChromeNavItem = {
  readonly key: SiteChromeNavKey;
  readonly href: string;
  readonly ctaId: string;
  readonly external?: boolean;
};

export const siteChromeLinks = {
  landing: "/",
  pricing: "/pricing",
  blog: "/blog",
  docs: "https://docs.knowhereto.ai/",
  playground: "https://notebook.knowhereto.ai",
  github: "/github",
  login: "/login",
} as const;

export const siteChromeNavCtaIds = {
  comparison: "comparison",
  pricing: "pricing",
  docs: "docs",
  playground: "playground_external",
  github: "github",
  blog: "blog",
  getApiKey: "get_api_key",
} as const;

export const siteChromeNavigation = (page: SiteChromePage): SiteChromeNavItem[] => [
  {
    key: "comparison",
    href: page === "landing" ? "#comparison" : "/#comparison",
    ctaId: siteChromeNavCtaIds.comparison,
  },
  {
    key: "pricing",
    href: siteChromeLinks.pricing,
    ctaId: siteChromeNavCtaIds.pricing,
  },
  {
    key: "docs",
    href: siteChromeLinks.docs,
    ctaId: siteChromeNavCtaIds.docs,
    external: true,
  },
  {
    key: "playground",
    href: siteChromeLinks.playground,
    ctaId: siteChromeNavCtaIds.playground,
    external: true,
  },
  {
    key: "blog",
    href: siteChromeLinks.blog,
    ctaId: siteChromeNavCtaIds.blog,
  },
];
