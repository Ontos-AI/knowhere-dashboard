"use client";

import Image from "next/image";
import { PixelCard } from "@/app/_(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@/app/_(landing)/_components/pixel/pixel-heading";
import { PixelIcon } from "@/app/_(landing)/_components/pixel/pixel-icon";
import type { Testimonial, VersusPageData } from "@/app/_(landing)/_data/versus-pages";

type TestimonialsSectionProps = {
  data: NonNullable<VersusPageData["testimonials"]>;
};

type TestimonialCardProps = {
  testimonial: Testimonial;
};

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <PixelCard className="p-6 hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
      <div className="flex flex-col h-full">
        {/* Rating stars */}
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <PixelIcon
              key={`star-${testimonial.id}-${index}`}
              icon="star"
              size={16}
              color={index < testimonial.rating ? "yellow" : "default"}
            />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-[var(--pixel-text-muted)] font-sans leading-relaxed mb-4 flex-1">
          "{testimonial.quote}"
        </blockquote>

        {/* Author info */}
        <div className="flex items-center gap-3 pt-4 border-t-2 border-pixel-border mt-auto">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt={testimonial.author}
              width={40}
              height={40}
              className="pixel-image border-2 border-pixel-border"
            />
          ) : (
            <div className="w-10 h-10 border-2 border-pixel-border bg-pixel-border flex items-center justify-center">
              <span className="text-pixel-fg font-pixel text-pixel-xs">
                {testimonial.author.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <div className="text-sm font-sans font-semibold text-pixel-fg">
              {testimonial.author}
            </div>
            <div className="text-xs font-sans text-[var(--pixel-text-muted)] text-nowrap">
              {testimonial.role} at {testimonial.company}
            </div>
          </div>
        </div>
      </div>
    </PixelCard>
  );
}

export function TestimonialsSection({ data }: TestimonialsSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-pixel-bg">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <PixelHeading as="h2" size="lg" className="mb-4">
            {data.title}
          </PixelHeading>
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
