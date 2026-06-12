"use client";

import { PixelBadge } from "@app/_(landing)/_components/pixel/pixel-badge";
import { PixelButton } from "@app/_(landing)/_components/pixel/pixel-button";
import { PixelCard } from "@app/_(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@app/_(landing)/_components/pixel/pixel-heading";
import { PixelIcon } from "@app/_(landing)/_components/pixel/pixel-icon";
import Link from "next/link";

type Example = {
  pages: string;
  cost: string;
};

type Limit = {
  icon: "clock" | "layers" | "weight";
  type: string;
  value: string;
  description: string;
};

type FileLimit = {
  type: string;
  size: string;
};

type FAQ = {
  question: string;
  answer: string;
};

const examples: Example[] = [
  { pages: "100-page PDF", cost: "$1.50" },
  { pages: "500-page document", cost: "$7.50" },
  { pages: "10,000 pages", cost: "$150.00" },
];

const rateLimits: Limit[] = [
  {
    icon: "clock",
    type: "Requests per minute",
    value: "60 RPM",
    description: "Maximum API calls per minute",
  },
  {
    icon: "layers",
    type: "Concurrent jobs",
    value: "10",
    description: "Simultaneous processing jobs",
  },
  {
    icon: "weight",
    type: "Max file size",
    value: "100 MB",
    description: "Per file upload limit",
  },
];

const fileLimits: FileLimit[] = [
  { type: "PDF", size: "100 MB" },
  { type: "DOCX", size: "50 MB" },
  { type: "XLSX", size: "50 MB" },
  { type: "PPTX", size: "100 MB" },
];

const faqs: FAQ[] = [
  {
    question: "When am I charged?",
    answer:
      "Page credits are deducted when a job completes successfully. Failed jobs do not consume credits.",
  },
  {
    question: "Do unused pages roll over?",
    answer: "Page credits expire 3 months after purchase.",
  },
  {
    question: "Can I get a refund?",
    answer: "Contact team@knowhereto.ai for refund requests within 14 days of purchase.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major credit cards through Stripe: Visa, Mastercard, American Express, and more.",
  },
];

const enterpriseFeatures = [
  "Custom rate limits",
  "Priority processing",
  "Dedicated support channel",
  "Custom SLA agreements",
  "Volume discounts",
  "Invoice billing",
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-pixel-bg">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <PixelHeading as="h2" className="mb-4">
            SIMPLE, <span className="text-pixel-green">TRANSPARENT PRICING</span>
          </PixelHeading>
          <p className="text-base text-pixel-muted font-sans">
            Pay only for what you use. No hidden fees, no complex tiers.
          </p>
        </div>

        {/* Main Pricing Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <PixelCard className="p-8 md:p-12 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center gap-2 mb-6">
                <PixelBadge color="green">PAY-AS-YOU-GO</PixelBadge>
              </div>

              <div className="mb-6">
                <div className="text-5xl md:text-6xl font-bold font-pixel mb-2 text-pixel-green">
                  $1.50
                </div>
                <div className="text-base text-pixel-muted font-sans">per 100 pages</div>
              </div>

              <p className="text-base text-pixel-muted font-sans max-w-2xl mx-auto">
                That&apos;s it. No complex tiers, no hidden fees. Purchase page credits anytime. No
                minimum, no commitment.
              </p>
            </div>

            {/* Pricing Examples */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              {examples.map((example) => (
                <div key={example.pages} className="pixel-border bg-pixel-bg p-4">
                  <div className="text-sm text-pixel-muted font-sans mb-1">{example.pages}</div>
                  <div className="text-2xl font-bold font-mono text-pixel-green">
                    {example.cost}
                  </div>
                </div>
              ))}
            </div>

            <PixelButton variant="primary" asChild>
              <Link href="/login">GET STARTED FREE</Link>
            </PixelButton>
          </PixelCard>
        </div>

        {/* Rate Limits & File Limits */}
        <div className="max-w-2xl mx-auto mb-16">
          {/* Rate Limits */}
          {/* <PixelCard>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <PixelIcon icon="chart" color="green" size={24} />
                <h3 className="font-pixel text-[var(--pixel-text-muted)] text-lg">RATE LIMITS</h3>
              </div>

              <div className="space-y-4">
                {rateLimits.map((limit) => (
                  <div
                    key={limit.type}
                    className="flex items-start gap-4 p-4 pixel-border-sm hover:bg-pixel-border/30 transition-colors"
                  >
                    <PixelIcon icon={limit.icon} className="text-pixel-muted mt-1" size={16} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-sans font-semibold text-[var(--pixel-text-muted)] text-base">
                          {limit.type}
                        </span>
                        <span className="text-base font-bold font-mono text-pixel-green">
                          {limit.value}
                        </span>
                      </div>
                      <p className="text-sm text-pixel-muted font-sans">{limit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 pixel-border-sm bg-pixel-yellow/10">
                <p className="text-sm text-pixel-muted font-sans">
                  When you exceed the limit, you&apos;ll receive a{" "}
                  <code className="px-2 py-0.5 pixel-border-sm bg-pixel-fg text-pixel-yellow font-mono text-xs">
                    429 Too Many Requests
                  </code>{" "}
                  response with a{" "}
                  <code className="px-2 py-0.5 pixel-border-sm bg-pixel-fg text-pixel-yellow font-mono text-xs">
                    Retry-After
                  </code>{" "}
                  header.
                </p>
              </div>
            </div>
          </PixelCard> */}

          {/* File Size Limits */}
          <PixelCard>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <PixelIcon icon="file" color="green" size={24} />
                <h3 className="text-[var(--pixel-text-muted)] text-lg font-pixel">
                  FILE SIZE LIMITS
                </h3>
              </div>

              <div className="space-y-3">
                {fileLimits.map((limit) => (
                  <div
                    key={limit.type}
                    className="flex items-center justify-between p-4 pixel-border hover:bg-pixel-border/30 transition-colors"
                  >
                    <span className="font-sans text-sm font-semibold flex items-center gap-2 text-[var(--pixel-text-muted)]">
                      <PixelIcon icon="file" color="default" size={16} />
                      {limit.type}
                    </span>
                    <span className="text-base font-bold font-mono text-pixel-green">
                      {limit.size}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 pixel-border-sm bg-pixel-green/10">
                <p className="text-sm text-pixel-muted font-sans">
                  Need higher limits? Contact{" "}
                  <a
                    href="mailto:team@knowhereto.ai"
                    className="text-pixel-green hover:underline font-medium"
                  >
                    team@knowhereto.ai
                  </a>{" "}
                  for enterprise pricing with custom limits.
                </p>
              </div>
            </div>
          </PixelCard>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-[24px] font-pixel text-center mb-8 text-[var(--pixel-text-muted)]">
            FREQUENTLY ASKED <span className="text-pixel-green">QUESTIONS</span>
          </h3>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <PixelCard key={faq.question}>
                <div className="p-6">
                  <h4 className="text-sm font-semibold mb-2 font-sans text-[var(--pixel-text-muted)]">
                    {faq.question}
                  </h4>
                  <p className="text-sm text-pixel-muted font-sans leading-relaxed">{faq.answer}</p>
                </div>
              </PixelCard>
            ))}
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="max-w-5xl mx-auto">
          <PixelCard className="border-4 border-pixel-yellow">
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="mb-4">
                    <PixelBadge color="yellow">ENTERPRISE</PixelBadge>
                  </div>

                  <h3 className="text-[20px] font-pixel mb-4 leading-relaxed text-[var(--pixel-text-muted)]">
                    NEED CUSTOM <span className="text-pixel-yellow">SOLUTIONS?</span>
                  </h3>

                  <p className="text-sm text-pixel-muted font-sans mb-6">
                    Get custom limits, SLAs, and dedicated support for your enterprise needs.
                  </p>

                  <PixelButton variant="secondary" asChild>
                    <a href="mailto:team@knowhereto.ai">CONTACT SALES</a>
                  </PixelButton>
                </div>

                <div className="space-y-3">
                  {enterpriseFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 p-3 bg-pixel-yellow/10">
                      <PixelIcon icon="check" color="yellow" size={16} />
                      <span className="text-sm font-sans font-medium text-[var(--pixel-text-muted)]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PixelCard>
        </div>
      </div>
    </section>
  );
}
