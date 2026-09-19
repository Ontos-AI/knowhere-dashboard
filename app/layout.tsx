import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@components/theme-provider";
import { appMetadata } from "@lib/app-metadata";
import { getDefaultConfig } from "@lib/config";
import { AnalyticsProvider } from "@providers/analytics-provider";
import { ConfigProvider } from "@providers/config-provider";
import { Providers } from "@providers/providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export const metadata: Metadata = appMetadata;

const poppins = localFont({
  src: "../public/fonts/Poppins-Variable.woff2",
  weight: "400 600",
  variable: "--font-poppins",
  display: "swap",
});

const frexSans = localFont({
  src: "../public/fonts/FrexSansGB-VF.woff2",
  weight: "100 700",
  variable: "--font-frex",
  display: "swap",
});

const geistMono = localFont({
  src: "../public/fonts/GeistMono-Regular.woff2",
  weight: "400",
  variable: "--font-geist-mono",
  display: "swap",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";

  // 在服务端读取环境变量（运行时配置，不带NEXT_PUBLIC_前缀）
  const appConfig = getDefaultConfig();
  const gaMeasurementId = appConfig.gaMeasurementId;
  const openAIAdsPixelId = appConfig.openAIAdsPixelId;

  // 获取翻译消息
  const messages = await getMessages();

  /*
    The font variables have to sit on <html>: `--font-sans` is declared on `:root` and reads
    `var(--font-poppins)` / `var(--font-frex)`. Declaring those on <body> leaves the `:root`
    declaration referencing variables that do not exist yet, which makes `--font-sans` invalid and
    drops every `font-sans` utility back to the browser default.
  */
  return (
    <html
      className={`${poppins.variable} ${frexSans.variable} ${geistMono.variable}`}
      lang={locale}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ConfigProvider config={appConfig}>
            <ThemeProvider>
              <AnalyticsProvider>
                <Providers>
                  <div className="min-h-dvh">{children}</div>
                </Providers>
              </AnalyticsProvider>
            </ThemeProvider>
          </ConfigProvider>
        </NextIntlClientProvider>
        {gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { send_page_view: false });
              `}
            </Script>
          </>
        ) : null}
        {openAIAdsPixelId ? (
          <>
            <Script id="openai-ads-pixel-init" strategy="afterInteractive">
              {`
                window.oaiq = window.oaiq || function () {
                  (window.oaiq.q = window.oaiq.q || []).push(arguments);
                };
                window.oaiq("init", { pixelId: ${JSON.stringify(openAIAdsPixelId)} });
              `}
            </Script>
            <Script
              async={true}
              src="https://bzrcdn.openai.com/sdk/oaiq.min.js"
              strategy="afterInteractive"
            />
          </>
        ) : null}
      </body>
    </html>
  );
}
