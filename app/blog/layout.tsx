import { SiteChrome } from "@components/site-chrome";
import type { ReactNode } from "react";
import "@app/blog/blog.css";
import "@app/blog/article-detail.css";

export const revalidate = 90;

type BlogLayoutProps = {
  children: ReactNode;
};

export default function BlogLayout({ children }: BlogLayoutProps) {
  return <SiteChrome page="blog">{children}</SiteChrome>;
}
