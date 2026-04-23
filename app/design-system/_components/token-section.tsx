import type { ReactNode } from "react";

type TokenSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export const TokenSection = ({ eyebrow, title, description, children }: TokenSectionProps) => {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          <span className="h-px w-8 bg-border" />
          {eyebrow}
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
};
