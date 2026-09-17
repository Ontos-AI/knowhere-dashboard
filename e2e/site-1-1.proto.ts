import { type Browser, expect, type Page, test } from "@playwright/test";
import {
  type Box,
  boxOf,
  forceLightTheme,
  forceProtoLightTheme,
  neutralizeFonts,
  pngSize,
} from "./geometry";

const desktop = { width: 1920, height: 1080 } as const;
const boxTolerance = 4;
const protoLanding = process.env.PROTO_LANDING ?? "http://localhost:5173";
const protoPricing = process.env.PROTO_PRICING ?? "http://localhost:3001";
const protoBlog = process.env.PROTO_BLOG ?? "http://localhost:3002";
const protoLogin = process.env.PROTO_LOGIN ?? "http://localhost:3003";
const runShots = process.env.RUN_PROTO_1_1 === "1";

const originLooksLike = async (url: string, needle: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(2500) });
    if (!response.ok) {
      return false;
    }
    const html = await response.text();
    return html.includes(needle);
  } catch {
    return false;
  }
};

const applyCompareChrome = async (page: Page): Promise<void> => {
  await neutralizeFonts(page);
  await page.evaluate(() => document.fonts.ready);
};

const openProto = async (browser: Browser, url: string, ready: string): Promise<Page> => {
  const proto = await browser.newPage();
  await proto.setViewportSize(desktop);
  await forceProtoLightTheme(proto);
  await proto.goto(url);
  await proto.locator(ready).waitFor();
  await applyCompareChrome(proto);
  return proto;
};

const assertClose = (
  appBox: Box | null,
  protoBox: Box | null,
  label: string,
  options: { readonly top?: boolean } = {}
) => {
  const compareTop = options.top ?? true;
  expect(appBox, `${label} missing in app`).not.toBeNull();
  expect(protoBox, `${label} missing in prototype`).not.toBeNull();
  expect(Math.abs((appBox?.left ?? 0) - (protoBox?.left ?? 0))).toBeLessThanOrEqual(boxTolerance);
  expect(Math.abs((appBox?.width ?? 0) - (protoBox?.width ?? 0))).toBeLessThanOrEqual(boxTolerance);
  if (compareTop) {
    expect(Math.abs((appBox?.top ?? 0) - (protoBox?.top ?? 0))).toBeLessThanOrEqual(boxTolerance);
  }
};

test.describe("site 1:1 vs local prototypes", () => {
  test.beforeEach(async ({ page }) => {
    await forceLightTheme(page);
    await page.setViewportSize(desktop);
  });

  test("pricing FAQ boxes match the prototype shell", async ({ page, browser }) => {
    test.skip(
      !(await originLooksLike(protoPricing, "faq-layout")),
      `pricing prototype is not at ${protoPricing}`
    );

    await page.goto("/pricing");
    await applyCompareChrome(page);
    const appFaq = await boxOf(page, "#faq");
    const appHeading = await boxOf(page, ".faq-heading");
    const appList = await boxOf(page, ".faq-list");

    const proto = await openProto(browser, protoPricing, "#faq");
    const protoFaq = await boxOf(proto, "#faq");
    const protoHeading = await boxOf(proto, ".faq-heading");
    const protoList = await boxOf(proto, ".faq-list");
    // Live prices/copy above FAQ can shift absolute Y; the shell and inner grid must still match.
    assertClose(appFaq, protoFaq, "#faq", { top: false });
    assertClose(appHeading, protoHeading, ".faq-heading", { top: false });
    assertClose(appList, protoList, ".faq-list", { top: false });
    expect(
      Math.abs(
        (appHeading?.top ?? 0) -
          (appFaq?.top ?? 0) -
          ((protoHeading?.top ?? 0) - (protoFaq?.top ?? 0))
      )
    ).toBeLessThanOrEqual(boxTolerance);
    expect(
      Math.abs(
        (appList?.top ?? 0) - (appFaq?.top ?? 0) - ((protoList?.top ?? 0) - (protoFaq?.top ?? 0))
      )
    ).toBeLessThanOrEqual(boxTolerance);
    await proto.close();
  });

  test("landing hero box matches the prototype", async ({ page, browser }) => {
    test.skip(
      !(await originLooksLike(protoLanding, "KNOWHERE — Document context for agents")),
      `landing prototype is not at ${protoLanding}`
    );

    await page.goto("/");
    await applyCompareChrome(page);
    const appHero = await boxOf(page, "#top");

    const proto = await openProto(browser, protoLanding, "#top");
    assertClose(appHero, await boxOf(proto, "#top"), "#top");
    await proto.close();
  });

  test("blog intro box matches the prototype", async ({ page, browser }) => {
    test.skip(
      !(await originLooksLike(protoBlog, "kb-intro")),
      `blog prototype is not at ${protoBlog}`
    );

    await page.goto("/blog");
    await applyCompareChrome(page);
    const appIntro = await boxOf(page, ".kb-intro");

    const proto = await openProto(browser, protoBlog, ".kb-intro");
    assertClose(appIntro, await boxOf(proto, ".kb-intro"), ".kb-intro");
    await proto.close();
  });

  test("login panel box matches the prototype", async ({ page, browser }) => {
    test.skip(
      !(await originLooksLike(protoLogin, "login-panel")),
      `login prototype is not at ${protoLogin}`
    );

    await page.goto("/login");
    await applyCompareChrome(page);
    const appPanel = await boxOf(page, ".login-panel");

    const proto = await openProto(browser, protoLogin, ".login-panel");
    assertClose(appPanel, await boxOf(proto, ".login-panel"), ".login-panel");
    await proto.close();
  });

  test("font-neutral FAQ screenshot size matches the prototype", async ({ page, browser }) => {
    test.skip(!runShots, "set RUN_PROTO_1_1=1 to capture prototype screenshots");
    test.skip(
      !(await originLooksLike(protoPricing, "faq-layout")),
      `pricing prototype is not at ${protoPricing}`
    );

    await page.goto("/pricing");
    await applyCompareChrome(page);
    await page.locator(".faq-layout").scrollIntoViewIfNeeded();

    const proto = await openProto(browser, protoPricing, ".faq-layout");
    await proto.locator(".faq-layout").scrollIntoViewIfNeeded();

    const appShot = await page.locator(".faq-layout").screenshot({ animations: "disabled" });
    const protoShot = await proto.locator(".faq-layout").screenshot({ animations: "disabled" });
    await test.info().attach("app-pricing-faq", { body: appShot, contentType: "image/png" });
    await test.info().attach("proto-pricing-faq", { body: protoShot, contentType: "image/png" });

    const appSize = pngSize(appShot);
    const protoSize = pngSize(protoShot);
    expect(Math.abs(appSize.width - protoSize.width)).toBeLessThanOrEqual(2);
    expect(Math.abs(appSize.height - protoSize.height)).toBeLessThanOrEqual(12);
    await proto.close();
  });
});
