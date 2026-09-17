import { expect, type Page, test } from "@playwright/test";
import { boxOf, computed, forceLightTheme, plusBoxes, shellExpectedWidth } from "./geometry";

const desktop = { width: 1920, height: 1080 } as const;
const boxTolerance = 2;

const assertPricingFaqGeometry = async (page: Page) => {
  const faq = page.locator("#faq");
  await expect(faq).toBeVisible();
  await faq.scrollIntoViewIfNeeded();

  const styles = await computed(page, "#faq", ["display", "grid-template-columns"]);
  expect(styles).not.toBeNull();
  expect(styles?.display).toBe("block");
  expect(
    styles?.["grid-template-columns"] === "none" || styles?.["grid-template-columns"] === ""
  ).toBe(true);

  const faqBox = await boxOf(page, "#faq");
  const expectedWidth = await shellExpectedWidth(page, "#faq");
  expect(faqBox).not.toBeNull();
  expect(faqBox?.width ?? 0).toBeGreaterThan(0);
  expect(Math.abs((faqBox?.width ?? 0) - expectedWidth)).toBeLessThanOrEqual(boxTolerance);
  expect(faqBox?.width ?? 0).toBeLessThan(page.viewportSize()?.width ?? 1920 - 40);

  const heading = await boxOf(page, ".faq-heading");
  const list = await boxOf(page, ".faq-list");
  expect(heading).not.toBeNull();
  expect(list).not.toBeNull();
  expect(heading?.right ?? 0).toBeLessThanOrEqual((list?.left ?? 0) + boxTolerance);

  const listGrid = await computed(page, ".faq-list", ["grid-column"]);
  expect(listGrid?.["grid-column"]).toMatch(/^6\s*\//);

  const plus = await plusBoxes(page);
  expect(plus.length).toBeGreaterThan(0);
  for (const control of plus) {
    expect(control.left).toBeGreaterThanOrEqual((faqBox?.left ?? 0) - boxTolerance);
    expect(control.right).toBeLessThanOrEqual((faqBox?.right ?? 0) + boxTolerance);
  }
};

const assertNoLandingPageLeak = async (page: Page, present: string) => {
  await expect(page.locator(present).first()).toBeVisible();
  expect(await page.locator(".landing-page").count()).toBe(0);
  expect(await page.locator("#faq").count()).toBe(0);
  expect(await page.locator("#enterprise").count()).toBe(0);
  expect(await page.locator("#final-cta").count()).toBe(0);
};

const clientNavigate = async (page: Page, selector: string, path: string) => {
  await page
    .locator(selector)
    .first()
    .evaluate((el: HTMLElement) => el.click());
  await expect(page).toHaveURL(new RegExp(`${path}(?:\\?|$)`));
};

test.describe("site 1:1 app geometry", () => {
  test.beforeEach(async ({ page }) => {
    await forceLightTheme(page);
    await page.setViewportSize(desktop);
  });

  test("direct / keeps the prototype hero grid", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".landing-page")).toBeVisible();
    const styles = await computed(page, "#top", ["display"]);
    expect(styles?.display).toBe("grid");
  });

  test("direct /pricing keeps the prototype FAQ shell", async ({ page }) => {
    await page.goto("/pricing");
    await assertPricingFaqGeometry(page);
  });

  test("Home → Pricing does not collapse the FAQ into Landing's grid", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".landing-page")).toBeVisible();
    await clientNavigate(page, ".kh-header-links a[href='/pricing']", "/pricing");
    await assertPricingFaqGeometry(page);
  });

  test("Home → Blog does not keep Landing section ids", async ({ page }) => {
    test.setTimeout(45_000);
    await page.goto("/");
    await expect(page.locator(".landing-page")).toBeVisible();
    await clientNavigate(page, ".kh-header-links a[href='/blog']", "/blog");
    await assertNoLandingPageLeak(page, ".kb");
  });

  test("Home → Login does not keep Landing section ids", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".landing-page")).toBeVisible();
    await clientNavigate(page, ".kh-header-api", "/login");
    await assertNoLandingPageLeak(page, ".kh-login");
  });
});
