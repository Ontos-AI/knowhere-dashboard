"use client";

import { PixelButton } from "@app/_(landing)/_components/pixel/pixel-button";
import { PixelDivider } from "@app/_(landing)/_components/pixel/pixel-divider";
import { PixelIcon } from "@app/_(landing)/_components/pixel/pixel-icon";
import { FOOTER_LINKS, SOCIAL_LINKS } from "@app/_(landing)/_lib/constants";
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
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-end gap-4 text-center md:text-left">
          <p className="text-sm text-pixel-muted font-sans">
            &copy; {currentYear} Knowhere API. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
