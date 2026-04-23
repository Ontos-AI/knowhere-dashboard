"use client";

import { useState } from "react";
import { PixelCard } from "@/app/_(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@/app/_(landing)/_components/pixel/pixel-heading";
import { PixelIcon } from "@/app/_(landing)/_components/pixel/pixel-icon";
import type { FAQItem, VersusPageData } from "@/app/_(landing)/_data/versus-pages";

type FAQSectionProps = {
  data: NonNullable<VersusPageData["faq"]>;
};

type FAQItemComponentProps = {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
};

function FAQItemComponent({ item, isOpen, onToggle }: FAQItemComponentProps) {
  return (
    <PixelCard className="overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        id={`faq-question-${item.id}`}
        className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-pixel-border/10 transition-colors"
      >
        <span className="text-sm font-sans font-semibold text-pixel-fg">{item.question}</span>
        <PixelIcon icon={isOpen ? "arrow-up" : "arrow-down"} size={16} className="flex-shrink-0" />
      </button>
      {isOpen && (
        <div
          id={`faq-answer-${item.id}`}
          role="region"
          aria-labelledby={`faq-question-${item.id}`}
          className="px-6 pb-6"
        >
          <p className="text-[var(--pixel-text-muted)] font-sans leading-relaxed">{item.answer}</p>
        </div>
      )}
    </PixelCard>
  );
}

export function FAQSection({ data }: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  // Get unique categories
  const categories = Array.from(new Set(data.items.map((item) => item.category)));

  // Filter items by category
  const filteredItems = activeCategory
    ? data.items.filter((item) => item.category === activeCategory)
    : data.items;

  // Category labels
  const categoryLabels: Record<string, string> = {
    general: "GENERAL",
    technical: "TECHNICAL",
    pricing: "PRICING",
    migration: "MIGRATION",
  };

  return (
    <section className="py-16 md:py-24 bg-pixel-bg">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <PixelHeading as="h2" size="lg" className="mb-4">
            {data.title}
          </PixelHeading>
        </div>

        {/* Category filter */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 border-2 font-pixel text-pixel-xs transition-transform ${
                activeCategory === null
                  ? "bg-pixel-green text-pixel-bg border-pixel-fg hover:translate-x-[2px] hover:translate-y-[2px]"
                  : "bg-pixel-bg text-pixel-fg border-pixel-border hover:translate-x-[2px] hover:translate-y-[2px]"
              }`}
              style={{
                boxShadow:
                  activeCategory === null
                    ? "2px 2px 0 var(--pixel-fg)"
                    : "2px 2px 0 var(--pixel-shadow)",
              }}
            >
              ALL
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 border-2 font-pixel text-pixel-xs transition-transform ${
                  activeCategory === category
                    ? "bg-pixel-green text-pixel-bg border-pixel-fg hover:translate-x-[2px] hover:translate-y-[2px]"
                    : "bg-pixel-bg text-pixel-fg border-pixel-border hover:translate-x-[2px] hover:translate-y-[2px]"
                }`}
                style={{
                  boxShadow:
                    activeCategory === category
                      ? "2px 2px 0 var(--pixel-fg)"
                      : "2px 2px 0 var(--pixel-shadow)",
                }}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredItems.map((item) => (
            <FAQItemComponent
              key={item.id}
              item={item}
              isOpen={openItems.has(item.id)}
              onToggle={() => toggleItem(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
