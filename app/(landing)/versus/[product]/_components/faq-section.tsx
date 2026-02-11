"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { FAQItem, VersusPageData } from "@/app/(landing)/_data/versus-pages";

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
    <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        id={`faq-question-${item.id}`}
        className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-card/50 transition-colors"
      >
        <span className="text-lg font-semibold text-foreground">{item.question}</span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div
          id={`faq-answer-${item.id}`}
          role="region"
          aria-labelledby={`faq-question-${item.id}`}
          className="px-6 pb-6"
        >
          <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
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
    general: "General",
    technical: "Technical",
    pricing: "Pricing",
    migration: "Migration",
  };

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
            {data.title}
          </h2>
        </div>

        {/* Category filter */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeCategory === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
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
