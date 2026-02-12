"use client";

import { PixelButton } from "@app/(landing)/_components/pixel/pixel-button";
import { PixelDivider } from "@app/(landing)/_components/pixel/pixel-divider";
import { PixelIcon } from "@app/(landing)/_components/pixel/pixel-icon";
import { FOOTER_LINKS, SOCIAL_LINKS } from "@app/(landing)/_lib/constants";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
    setEmail("");

    // Reset after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-pixel-border bg-pixel-bg">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center space-x-2 group">
              <PixelIcon icon="sparkles" color="green" size={24} />
              <span className="font-pixel text-[12px] text-pixel-fg">KNOWHERE API</span>
            </Link>
            <p className="text-sm text-pixel-muted font-sans max-w-sm">
              The most accurate document parsing API for AI agents. Transform complex documents into
              structured data optimized for RAG.
            </p>

            {/* Newsletter */}
            <div className="w-full max-w-sm">
              <h4 className="text-[10px] font-pixel mb-3 text-[var(--pixel-text-muted)]">
                STAY UPDATED
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting || submitted}
                  className="flex-1 pixel-border bg-pixel-bg text-pixel-fg font-sans text-sm px-3 py-2 focus:outline-none focus:border-pixel-green disabled:opacity-50"
                />
                <PixelButton type="submit" disabled={isSubmitting || submitted} variant="primary">
                  {submitted ? "✓" : <PixelIcon icon="arrow-right" color="default" size={16} />}
                </PixelButton>
              </form>
              {submitted && (
                <p className="text-xs text-pixel-green font-sans mt-2">Thanks for subscribing!</p>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <Link
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pixel-muted hover:text-pixel-green transition-colors"
              >
                <Image src="/images/social/github.svg" alt="GitHub icon" width={32} height={32} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href={SOCIAL_LINKS.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pixel-muted hover:text-pixel-green transition-colors"
              >
                <Image src="/images/social/discord.svg" alt="Discord icon" width={32} height={32} />
                <span className="sr-only">Discord</span>
              </Link>
              <Link
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pixel-muted hover:text-pixel-green transition-colors"
              >
                <Image src="/images/social/x.svg" alt="Twitter icon" width={25} height={25} />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="text-center md:text-left">
            <h3 className="font-pixel text-[10px] mb-4 text-[var(--pixel-text-muted)]">PRODUCT</h3>
            <ul className="space-y-3 text-sm text-pixel-muted font-sans">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-pixel-green transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="text-center md:text-left">
            <h3 className="font-pixel text-[10px] mb-4 text-[var(--pixel-text-muted)]">COMPANY</h3>
            <ul className="space-y-3 text-sm text-pixel-muted font-sans">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-pixel-green transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="text-center md:text-left">
            <h3 className="font-pixel text-[10px] mb-4 text-[var(--pixel-text-muted)]">LEGAL</h3>
            <ul className="space-y-3 text-sm text-pixel-muted font-sans">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-pixel-green transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12">
          <PixelDivider />
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-sm text-pixel-muted font-sans">
              &copy; {currentYear} Knowhere API. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
