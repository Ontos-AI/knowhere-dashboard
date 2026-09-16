/**
 * Knowhere Brand + Design Prototype color ramps.
 * CSS copies these into `.kh-site` / `--kh-*` in app/kh-site.css.
 * Brand 500s match `.cursor/skills/knowhere-brand/tokens.json`.
 * Ramps match the prototype `src/colors.js` `colorHex` table.
 */
export const brandColor = {
  mistWhite: "#F0F2E6",
  mineralGreen: "#19A88B",
  deepTeal: "#083B3A",
  coralSignal: "#FF634A",
} as const;

export const colorHex = {
  black: "#000000",
  white: "#FFFFFF",
  "mist-white": {
    50: "#FFFFFF",
    100: "#FCFCFA",
    200: "#F9FAF5",
    300: "#F6F7EF",
    400: "#F3F5EA",
    500: "#F0F2E6",
    600: "#BBBCB3",
    700: "#888A82",
    800: "#595A55",
    900: "#2E2E2C",
    950: "#1B1C1A",
  },
  "mineral-green": {
    50: "#CAFFEE",
    100: "#7EFEDD",
    200: "#27EFC6",
    300: "#23D6B1",
    400: "#1DBE9D",
    500: "#19A88B",
    600: "#12846C",
    700: "#0A6351",
    800: "#054437",
    900: "#01251D",
    950: "#011711",
  },
  "coral-signal": {
    50: "#FFF0EF",
    100: "#FFE1DF",
    200: "#FFC7C3",
    300: "#FFA79F",
    400: "#FF897D",
    500: "#FF634A",
    600: "#DD3B00",
    700: "#A42900",
    800: "#731A00",
    900: "#420B00",
    950: "#2D0500",
  },
  "deep-teal": {
    50: "#6DFDFA",
    100: "#3BE8E4",
    200: "#2FBAB8",
    300: "#208C8A",
    400: "#156462",
    500: "#083B3A",
    600: "#073231",
    700: "#042626",
    800: "#021D1D",
    900: "#011110",
    950: "#010909",
  },
} as const;

export const siteThemes = ["system", "light", "dark"] as const;

export type SiteTheme = (typeof siteThemes)[number];
