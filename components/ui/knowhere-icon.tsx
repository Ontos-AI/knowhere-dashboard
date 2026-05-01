import { cn } from "@lib/utils";
import type { ComponentProps, CSSProperties } from "react";

export const KNOWHERE_ICON_NAMES = [
  "info",
  "theme-dark",
  "menu",
  "theme-light",
  "arrow-outward",
  "check",
  "check-2",
  "check-pix",
  "draft",
  "document-scanner",
  "handyman",
  "docs",
  "api",
  "json",
  "light",
  "card",
  "right",
  "download",
  "doc",
  "tools",
  "pixel-check",
  "mind",
  "model-6",
  "model-5",
  "model-4",
  "model-3",
  "model-2",
  "model-1",
  "state-x",
  "component",
  "search",
  "ai",
  "chevron-down",
] as const;

export type KnowhereIconName = (typeof KNOWHERE_ICON_NAMES)[number];

export const KNOWHERE_REGULAR_ICON_NAMES: KnowhereIconName[] = [
  "info",
  "theme-dark",
  "menu",
  "theme-light",
  "arrow-outward",
  "check",
  "draft",
  "document-scanner",
  "handyman",
];

export const KNOWHERE_PIXEL_ICON_NAMES: KnowhereIconName[] = [
  "docs",
  "api",
  "json",
  "light",
  "card",
  "right",
  "download",
  "doc",
  "tools",
  "pixel-check",
  "mind",
];

export const KNOWHERE_MODEL_ICON_NAMES: KnowhereIconName[] = [
  "model-6",
  "model-5",
  "model-4",
  "model-3",
  "model-2",
  "model-1",
];

export const KNOWHERE_STATE_ICON_NAMES: KnowhereIconName[] = ["check", "state-x", "component"];

export const KNOWHERE_MESSAGE_ICON_NAMES: KnowhereIconName[] = ["search", "ai"];

const iconAssetMap: Record<KnowhereIconName, string> = {
  info: "/icons/knowhere/info.svg",
  "theme-dark": "/icons/knowhere/theme-dark.svg",
  menu: "/icons/knowhere/menu.svg",
  "theme-light": "/icons/knowhere/theme-light.svg",
  "arrow-outward": "/icons/knowhere/arrow-outward.svg",
  check: "/icons/knowhere/check.svg",
  draft: "/icons/knowhere/draft.svg",
  "document-scanner": "/icons/knowhere/document-scanner.svg",
  handyman: "/icons/knowhere/handyman.svg",
  docs: "/icons/knowhere/docs.svg",
  api: "/icons/knowhere/api.svg",
  json: "/icons/knowhere/json.svg",
  light: "/icons/knowhere/light.svg",
  card: "/icons/knowhere/card.svg",
  right: "/icons/knowhere/right.svg",
  download: "/icons/knowhere/download.svg",
  doc: "/icons/knowhere/doc.svg",
  tools: "/icons/knowhere/tools.svg",
  "pixel-check": "/icons/knowhere/pixel-check.svg",
  "check-2": "/icons/knowhere/check 2.svg",
  "check-pix": "/icons/knowhere/check-pix.svg",
  mind: "/icons/knowhere/mind.svg",
  "model-6": "/icons/knowhere/model-6.svg",
  "model-5": "/icons/knowhere/model-5.svg",
  "model-4": "/icons/knowhere/model-4.svg",
  "model-3": "/icons/knowhere/model-3.svg",
  "model-2": "/icons/knowhere/model-2.svg",
  "model-1": "/icons/knowhere/model-1.svg",
  "state-x": "/icons/knowhere/state-x.svg",
  component: "/icons/knowhere/component.svg",
  search: "/icons/knowhere/search.svg",
  ai: "/icons/knowhere/ai.svg",
  "chevron-down": "/icons/knowhere/chevron-down.svg",
};

export type KnowhereIconProps = Omit<ComponentProps<"span">, "children"> & {
  name: KnowhereIconName;
};

export const KnowhereIcon = ({ className, name, style, ...props }: KnowhereIconProps) => {
  const iconStyle: CSSProperties = {
    backgroundColor: "currentColor",
    WebkitMaskImage: `url("${iconAssetMap[name]}")`,
    maskImage: `url("${iconAssetMap[name]}")`,
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "contain",
    maskSize: "contain",
    ...style,
  };

  return (
    <span
      aria-hidden="true"
      className={cn("inline-block size-5 shrink-0 align-middle", className)}
      style={iconStyle}
      {...props}
    />
  );
};
