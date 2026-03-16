import type { ReactNode } from "react";

export function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="mb-4 font-pixel text-[10px] uppercase tracking-[0.18em] text-pixel-green">
        {eyebrow}
      </p>
      <h2 className="text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-pixel-fg font-sans md:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-pixel-muted font-sans md:text-lg">
        {description}
      </p>
    </div>
  );
}
