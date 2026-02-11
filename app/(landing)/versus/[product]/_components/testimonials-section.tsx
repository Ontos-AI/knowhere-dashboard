"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import type { Testimonial, VersusPageData } from "@/app/(landing)/_data/versus-pages";

type TestimonialsSectionProps = {
  data: NonNullable<VersusPageData["testimonials"]>;
};

type TestimonialCardProps = {
  testimonial: Testimonial;
};

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/50 hover:bg-card/50 transition-colors">
      <div className="space-y-4">
        {/* Rating stars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={`star-${testimonial.id}-${index}`}
              className={`w-4 h-4 ${
                index < testimonial.rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-muted-foreground leading-relaxed">
          "{testimonial.quote}"
        </blockquote>

        {/* Author info */}
        <div className="flex items-center gap-3 pt-4 border-t border-border/30">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt={testimonial.author}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {testimonial.author.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <div className="text-sm font-semibold text-foreground">{testimonial.author}</div>
            <div className="text-xs text-muted-foreground">
              {testimonial.role} at {testimonial.company}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
            {data.title}
          </h2>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {data.items.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
