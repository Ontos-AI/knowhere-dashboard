"use client";

import { Button } from "@components/ui/button";
import { motion } from "framer-motion";
import { Check, CreditCard, FileText, Gauge, Mail, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

type Example = {
  pages: string;
  cost: string;
};

type Limit = {
  icon: React.ElementType;
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
  { pages: "100-page PDF", cost: "$0.15" },
  { pages: "500-page document", cost: "$0.75" },
  { pages: "10,000 pages", cost: "$15.00" },
];

const rateLimits: Limit[] = [
  {
    icon: Zap,
    type: "Requests per minute",
    value: "60 RPM",
    description: "Maximum API calls per minute",
  },
  {
    icon: Gauge,
    type: "Concurrent jobs",
    value: "10",
    description: "Simultaneous processing jobs",
  },
  {
    icon: FileText,
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
    <section id="pricing" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
            Simple,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Transparent Pricing
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Pay only for what you use. No hidden fees, no complex tiers.
          </p>
        </motion.div>

        {/* Main Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="glass rounded-3xl border border-primary/30 p-8 md:p-12 text-center relative overflow-hidden">
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-50 blur-xl -z-10"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <div className="mb-8">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Pay-as-you-go</span>
              </div>

              <div className="mb-6">
                <div className="text-6xl md:text-7xl font-bold font-heading mb-2">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    $1.50
                  </span>
                </div>
                <div className="text-xl text-muted-foreground">per 1,000 pages</div>
              </div>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                That&apos;s it. No complex tiers, no hidden fees. Purchase page credits anytime. No
                minimum, no commitment.
              </p>
            </div>

            {/* Pricing Examples */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {examples.map((example, _index) => (
                <div
                  key={example.pages}
                  className="glass rounded-xl border border-border/50 p-4 hover:border-primary/50 transition-all"
                >
                  <div className="text-sm text-muted-foreground mb-1">{example.pages}</div>
                  <div className="text-2xl font-bold text-primary">{example.cost}</div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button size="lg" className="h-12 px-8 text-lg" asChild>
                <Link href="/login">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Rate Limits & File Limits */}
        <div className="max-w-6xl mx-auto mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rate Limits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl border border-border/50 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Gauge className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Rate Limits</h3>
            </div>

            <div className="space-y-4">
              {rateLimits.map((limit, index) => (
                <motion.div
                  key={limit.type}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                    <limit.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{limit.type}</span>
                      <span className="text-lg font-bold text-primary">{limit.value}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{limit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-accent/5 border border-accent/20">
              <p className="text-sm text-muted-foreground">
                When you exceed the limit, you&apos;ll receive a{" "}
                <code className="px-2 py-0.5 rounded bg-background/50 text-accent font-mono text-xs">
                  429 Too Many Requests
                </code>{" "}
                response with a{" "}
                <code className="px-2 py-0.5 rounded bg-background/50 text-accent font-mono text-xs">
                  Retry-After
                </code>{" "}
                header.
              </p>
            </div>
          </motion.div>

          {/* File Size Limits */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl border border-border/50 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">File Size Limits</h3>
            </div>

            <div className="space-y-3">
              {fileLimits.map((limit, index) => (
                <motion.div
                  key={limit.type}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-accent/5 transition-colors border border-border/30"
                >
                  <span className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {limit.type}
                  </span>
                  <span className="text-lg font-bold text-accent">{limit.size}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                Need higher limits? Contact{" "}
                <a
                  href="mailto:team@knowhereto.ai"
                  className="text-primary hover:underline font-medium"
                >
                  team@knowhereto.ai
                </a>{" "}
                for enterprise pricing with custom limits.
              </p>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-8">
            Frequently Asked{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Questions
            </span>
          </h3>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass rounded-xl border border-border/50 p-6 hover:border-primary/50 transition-all"
              >
                <h4 className="text-lg font-semibold mb-2 text-foreground">{faq.question}</h4>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="glass rounded-3xl border border-accent/30 p-8 md:p-12 relative overflow-hidden">
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 opacity-50 blur-xl -z-10"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent">Enterprise</span>
                </div>

                <h3 className="text-3xl font-bold mb-4">
                  Need Custom{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">
                    Solutions?
                  </span>
                </h3>

                <p className="text-muted-foreground mb-6">
                  Get custom limits, SLAs, and dedicated support for your enterprise needs.
                </p>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-accent/50 hover:border-accent hover:bg-accent/10"
                  asChild
                >
                  <a href="mailto:team@knowhereto.ai">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact Sales
                  </a>
                </Button>
              </div>

              <div className="space-y-3">
                {enterpriseFeatures.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent/5"
                  >
                    <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
