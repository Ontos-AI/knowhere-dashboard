"use client";

import Image from "next/image";
import type { SyntheticEvent } from "react";

type ArticleCoverProps = {
  readonly src: string | null;
  readonly alt: string;
  readonly sizes?: string;
};

const markReady = (event: SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.dataset.ready = "true";
};

export function ArticleCover({
  src,
  alt,
  sizes = "(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 400px",
}: ArticleCoverProps) {
  if (!src) {
    return <div className="kb-cover kb-cover-placeholder" aria-hidden="true" />;
  }

  return (
    <Image
      alt={alt}
      className="kb-cover kb-loading-cover"
      height={900}
      onLoad={markReady}
      sizes={sizes}
      src={src}
      width={1600}
    />
  );
}
