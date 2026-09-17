import type { Page } from "@playwright/test";

export type Box = {
  readonly bottom: number;
  readonly height: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly width: number;
};

export const forceLightTheme = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    window.localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.style.colorScheme = "light";
  });
};

export const forceProtoLightTheme = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    window.localStorage.setItem("knowhere-color-theme", "light");
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
  });
};

export const pngSize = (buffer: Buffer): { height: number; width: number } => ({
  height: buffer.readUInt32BE(20),
  width: buffer.readUInt32BE(16),
});

export const neutralizeFonts = async (page: Page): Promise<void> => {
  await page.addStyleTag({
    content: "*, *::before, *::after { font-family: Poppins, Arial, sans-serif !important; }",
  });
};

export const boxOf = async (page: Page, selector: string): Promise<Box | null> =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) {
      return null;
    }
    const rect = el.getBoundingClientRect();
    return {
      bottom: rect.bottom,
      height: rect.height,
      left: rect.left,
      right: rect.right,
      top: rect.top,
      width: rect.width,
    };
  }, selector);

export const computed = async (
  page: Page,
  selector: string,
  properties: readonly string[]
): Promise<Record<string, string> | null> =>
  page.evaluate(
    ({ sel, props }) => {
      const el = document.querySelector(sel);
      if (!el) {
        return null;
      }
      const style = getComputedStyle(el);
      return Object.fromEntries(props.map((prop) => [prop, style.getPropertyValue(prop)]));
    },
    { sel: selector, props: properties }
  );

export const shellExpectedWidth = async (page: Page, scoped: string): Promise<number> =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) {
      return 0;
    }
    const style = getComputedStyle(el);
    const max = Number.parseFloat(style.getPropertyValue("--content-max")) || 1280;
    const edge = Number.parseFloat(style.getPropertyValue("--layout-grid-edge")) || 80;
    return Math.min(max, window.innerWidth - edge * 2);
  }, scoped);

export const plusBoxes = async (page: Page): Promise<readonly Box[]> =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll(".faq-plus"), (el) => {
      const rect = el.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
      };
    })
  );
