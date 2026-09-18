/*
  Landing ⇄ prototype parity checks.

  The prototype is the source of truth for landing geometry, tokens, type, and motion. These
  assertions lock the parity gaps that were measured and fixed in `fix/suguan/site-1-1-parity-gaps`
  so a later stylesheet edit cannot silently reopen them. They intentionally do not reach the
  network, so they run in the `app` project against the local build.

  Findings covered (see notes/knowhere-dashboard-site-1-1-parity.md):
  A palette resolves from :root, B palette-change event, C theme reveal, D body type scale,
  E section eyebrow size, F section shell width and #playground full-bleed, G shared footer,
  H button white-space, plus the FAQ disclosure row, the mono SDK code frame, and dark shadows.
*/
import { expect, type Page, test } from "@playwright/test";
import { boxOf, computed } from "./geometry";

const desktop = { width: 1920, height: 1080 } as const;

const useTheme = async (page: Page, theme: "light" | "dark"): Promise<void> => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("theme", value);
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(value);
    root.setAttribute("data-theme", value);
    root.style.colorScheme = value;
  }, theme);
};

const rootToken = async (page: Page, name: string): Promise<string> =>
  page.evaluate(
    (token) => getComputedStyle(document.documentElement).getPropertyValue(token).trim(),
    name
  );

const normalizeColor = (value: string): string => value.replace(/\s+/g, " ").toLowerCase();

/** `rgb(0, 0, 0)` is opaque; `rgba(0, 0, 0, 0)` is a surface painted by a descendant. */
const isOpaque = (value: string): boolean => !/^rgba\(.*,\s*0(?:\.0+)?\)$/.test(value);

/** Custom properties keep the authored literal, and `#fff` and `#ffffff` are the same colour. */
const expandHex = (value: string): string =>
  value.length === 4 && value.startsWith("#")
    ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
    : value;

const tokenColor = async (page: Page, name: string): Promise<string> =>
  expandHex((await rootToken(page, name)).toLowerCase());

const openLanding = async (page: Page): Promise<void> => {
  await page.goto("/");
  await expect(page.locator(".landing-page")).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
};

const changeTheme = async (page: Page, label: RegExp): Promise<void> => {
  await page.locator(".kh-theme-toggle").first().click();
  const item = page.locator('[role="menuitem"]').filter({ hasText: label }).first();
  await expect(item).toBeVisible();
  await item.click();
};

test.describe("landing 1:1 parity", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(desktop);
  });

  test("A: resolves the prototype palette from :root in both themes", async ({ page }) => {
    await useTheme(page, "light");
    await openLanding(page);

    expect(await tokenColor(page, "--main-500")).toBe("#19a88b");
    expect(await tokenColor(page, "--main-600")).toBe("#12846c");
    expect(await tokenColor(page, "--deep-teal-300")).toBe("#208c8a");
    expect(await tokenColor(page, "--paper")).toBe("#ffffff");
    expect(await tokenColor(page, "--ink")).toBe("#2e2e2c");
    expect(await tokenColor(page, "--page-primary")).toBe("#19a88b");

    const lightBody = await computed(page, "body", ["background-color", "color"]);
    expect(lightBody?.["background-color"]).toBe("rgb(255, 255, 255)");
    expect(lightBody?.color).toBe("rgb(46, 46, 44)");
  });

  test("A: resolves the dark palette from :root", async ({ page }) => {
    await useTheme(page, "dark");
    await openLanding(page);

    expect(await tokenColor(page, "--paper")).toBe("#010909");
    expect(await tokenColor(page, "--ink")).toBe("#f9faf5");
    expect(await tokenColor(page, "--page-primary")).toBe("#23d6b1");
    expect(await tokenColor(page, "--mineral-green-500")).toBe("#1dbe9d");

    const darkBody = await computed(page, "body", ["background-color", "color"]);
    expect(darkBody?.["background-color"]).toBe("rgb(1, 9, 9)");
    expect(darkBody?.color).toBe("rgb(249, 250, 245)");
  });

  test("D: keeps the prototype body type scale", async ({ page }) => {
    await useTheme(page, "light");
    await openLanding(page);

    for (const selector of ["body", "main#main"]) {
      const styles = await computed(page, selector, ["font-size", "line-height"]);
      expect(styles?.["font-size"]).toBe("18px");
      expect(styles?.["line-height"]).toBe("27.9px");
    }
  });

  test("E: keeps every section eyebrow at the prototype size", async ({ page }) => {
    await useTheme(page, "light");
    await openLanding(page);

    const eyebrows = [
      ["#playground .section-no", "15px", "24px"],
      ["#formats .section-no", "15px", "24px"],
      ["#faq .section-no", "15px", "24px"],
      ["#final-cta .section-no", "14px", "20px"],
    ] as const;

    for (const [selector, size, lineHeight] of eyebrows) {
      const styles = await computed(page, selector, ["font-size", "line-height"]);
      expect(styles?.["font-size"], selector).toBe(size);
      expect(styles?.["line-height"], selector).toBe(lineHeight);
    }
  });

  test("F: keeps section shells 1440px wide and #playground full-bleed", async ({ page }) => {
    await useTheme(page, "light");
    await openLanding(page);

    for (const selector of ["#formats", "#comparison", "#integration", "#pricing", "#faq"]) {
      const box = await boxOf(page, selector);
      expect(box?.width, selector).toBe(1440);
      expect(box?.left, selector).toBe(240);
    }

    const playground = await boxOf(page, "#playground");
    expect(playground?.left).toBe(0);
    expect(playground?.width).toBe(desktop.width);
  });

  test("G: renders the Landing footer from the shared site chrome", async ({ page }) => {
    await useTheme(page, "light");
    await openLanding(page);

    await expect(page.locator("footer.kh-site-footer")).toHaveCount(1);
    await expect(page.locator("footer.footer")).toHaveCount(0);
    await expect(page.locator("footer .kh-footer-brand").first()).toBeVisible();
  });

  test("H: lets hero, CTA, and header buttons wrap", async ({ page }) => {
    await useTheme(page, "light");
    await openLanding(page);

    // The prototype lets every one of these wrap; the header CTA is the same control there.
    const scope: Array<[string, string]> = [
      ["#top .button-row .button", "normal"],
      ["#final-cta #final-cta-actions .button", "normal"],
      [".kh-header-api", "normal"],
    ];

    for (const [selector, whiteSpace] of scope) {
      const styles = await computed(page, selector, ["white-space"]);
      expect(styles?.["white-space"], selector).toBe(whiteSpace);
    }
  });

  test("FAQ rows use the prototype disclosure layout", async ({ page }) => {
    await useTheme(page, "light");
    await openLanding(page);

    const summary = await computed(page, "#faq details summary", [
      "display",
      "align-items",
      "justify-content",
      "cursor",
    ]);
    expect(summary?.display).toBe("flex");
    expect(summary?.["align-items"]).toBe("center");
    expect(summary?.["justify-content"]).toBe("space-between");
    expect(summary?.cursor).toBe("pointer");

    const summaryBox = await boxOf(page, "#faq details summary");
    expect(summaryBox?.height).toBe(68);

    const toggleBox = await boxOf(page, "#faq summary span");
    expect(toggleBox?.width).toBe(24);
    expect(toggleBox?.height).toBe(24);

    const toggleColor = await computed(page, "#faq details[open] summary span", [
      "background-color",
    ]);
    expect(toggleColor?.["background-color"]).toBe("rgb(25, 168, 139)");

    const faq = await boxOf(page, "#faq");
    expect(faq?.height).toBe(541);
  });

  test("renders the SDK code sample in Geist Mono", async ({ page }) => {
    await useTheme(page, "light");
    await openLanding(page);

    for (const selector of [
      "#integration .integration-code-frame",
      "#integration pre",
      "#integration pre code",
    ]) {
      const styles = await computed(page, selector, ["font-family", "font-size", "line-height"]);
      expect(styles?.["font-family"], selector).toContain("Geist Mono");
      expect(styles?.["font-family"], selector).not.toContain("Poppins");
      expect(styles?.["font-size"], selector).toBe("12px");
      expect(styles?.["line-height"], selector).toBe("16px");
    }
  });

  test("keeps capability card shadows black in dark theme", async ({ page }) => {
    await useTheme(page, "dark");
    await openLanding(page);

    const shadow = await computed(page, ".capability-code-card", ["box-shadow"]);
    const value = normalizeColor(shadow?.["box-shadow"] ?? "");
    expect(value).toContain("0.45");
    expect(value).toMatch(/0[, ]+0[, ]+0/);
    expect(value).not.toContain("0.976");
  });

  test("B + C: theme change dispatches the palette event and runs the reveal", async ({ page }) => {
    await useTheme(page, "light");
    await page.addInitScript(() => {
      (window as unknown as { __parity: Record<string, unknown> }).__parity = {
        paletteEvents: 0,
        transitions: 0,
      };
      window.addEventListener("main-palette-change", () => {
        (window as unknown as { __parity: { paletteEvents: number } }).__parity.paletteEvents += 1;
      });
      const original = document.startViewTransition?.bind(document);
      Object.defineProperty(document, "startViewTransition", {
        configurable: true,
        value: (callback: () => void) => {
          (window as unknown as { __parity: { transitions: number } }).__parity.transitions += 1;
          return original
            ? original(callback)
            : { finished: Promise.resolve(), skipTransition() {} };
        },
      });
    });

    await openLanding(page);
    await changeTheme(page, /dark|深色/i);

    const during = await page.evaluate(() => {
      const root = document.documentElement;
      return {
        paletteEvents: (window as unknown as { __parity: { paletteEvents: number } }).__parity
          .paletteEvents,
        transitions: (window as unknown as { __parity: { transitions: number } }).__parity
          .transitions,
        themeTransition: root.dataset.themeTransition ?? null,
        origin: root.style.getPropertyValue("--theme-reveal-origin"),
        radius: root.style.getPropertyValue("--theme-reveal-radius"),
      };
    });

    expect(during.transitions).toBeGreaterThan(0);
    expect(during.paletteEvents).toBeGreaterThan(0);
    expect(during.themeTransition).toBe("active");
    expect(during.origin).toMatch(/^[\d.]+% [\d.]+%$/);
    expect(during.radius).toMatch(/^[\d.]+%$/);

    await page.waitForTimeout(1500);
    const after = await page.evaluate(() => {
      const root = document.documentElement;
      return {
        themeTransition: root.dataset.themeTransition ?? null,
        origin: root.style.getPropertyValue("--theme-reveal-origin"),
        radius: root.style.getPropertyValue("--theme-reveal-radius"),
        background: getComputedStyle(document.body).backgroundColor,
      };
    });

    expect(after.themeTransition).toBeNull();
    expect(after.origin).toBe("");
    expect(after.radius).toBe("");
    expect(after.background).toBe("rgb(1, 9, 9)");
  });

  test("Q: keeps the dark Material surface ramp on the prototype's dark values", async ({
    page,
  }) => {
    await useTheme(page, "dark");
    await openLanding(page);

    expect(await tokenColor(page, "--md-sys-color-surface-container-lowest")).toBe("#000000");
    expect(await tokenColor(page, "--md-sys-color-surface-container-high")).toBe("#042626");

    // Inside `.landing-page` the prototype rebinds `--mist-white-*` to the Material ramp, so the
    // lowest container has to stay black there instead of resolving through the ink `--black`.
    const scoped = await page.evaluate(() =>
      getComputedStyle(document.querySelector(".landing-page") as Element)
        .getPropertyValue("--mist-white-50")
        .trim()
    );
    expect(expandHex(scoped.toLowerCase())).toBe("#000000");

    const surfaces = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".product-terminal, .product-output-content")).map(
        (el) => {
          const style = getComputedStyle(el);
          return [style.backgroundColor, style.color] as const;
        }
      )
    );
    const opaqueSurfaces = surfaces.filter(([background]) => isOpaque(background));
    expect(opaqueSurfaces.length).toBeGreaterThan(1);
    for (const [background, color] of opaqueSurfaces) {
      expect(background).toBe("rgb(0, 0, 0)");
      expect(color).toBe("rgb(249, 250, 245)");
    }

    // `#comparison` paints the same token on itself and on the 100vw `::before` band behind it.
    // Before the fix both were ivory while the heading stayed near-white, so the heading vanished
    // on the ivory band.
    const comparison = await page.evaluate(() => {
      const section = document.querySelector("#comparison") as Element;
      const own = getComputedStyle(section);
      const band = getComputedStyle(section, "::before");
      const heading = getComputedStyle(section.querySelector("h2") as Element);
      return [own.backgroundColor, band.backgroundColor, heading.color] as const;
    });
    expect(comparison).toEqual(["rgb(1, 9, 9)", "rgb(0, 0, 0)", "rgb(249, 250, 245)"]);
  });

  test("R: animates landing hash jumps and honours reduced motion", async ({ page }) => {
    await useTheme(page, "light");
    await openLanding(page);

    const scrollBehavior = (): Promise<string> =>
      page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);

    expect(await scrollBehavior()).toBe("smooth");

    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(await scrollBehavior()).toBe("auto");

    // The rule is Landing-scoped, so the rest of the app keeps instant jumps.
    await page.goto("/login");
    expect(await scrollBehavior()).toBe("auto");
  });
});
