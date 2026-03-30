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
      <h2 className="font-sans text-[clamp(2rem,9vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-pixel-fg md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 font-sans text-sm leading-7 text-pixel-muted sm:mt-5 sm:text-base sm:leading-8 md:text-lg">
        {description}
      </p>
    </div>
  );
}
