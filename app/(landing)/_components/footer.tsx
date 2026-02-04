"use client";

import { FOOTER_LINKS, SOCIAL_LINKS } from "@app/(landing)/_lib/constants";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Github, Linkedin, Mail, Sparkles, Twitter } from "lucide-react";
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
    <footer className="border-t border-border/50 bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center space-x-2 group">
              <div>
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Knowhere API
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              The most accurate document parsing API for AI agents. Transform complex documents into
              structured data optimized for RAG.
            </p>

            {/* Newsletter */}
            <div className="w-full max-w-sm">
              <h4 className="text-sm font-semibold mb-3">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting || submitted}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className="relative overflow-hidden"
                >
                  {submitted ? (
                    <span className="flex items-center gap-1">✓</span>
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                </Button>
              </form>
              {submitted && <p className="text-xs text-accent mt-2">Thanks for subscribing!</p>}
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <Link
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4 text-sm">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4 text-sm">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4 text-sm">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Knowhere API. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              Built with <span className="text-red-500">♥</span> for developers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
