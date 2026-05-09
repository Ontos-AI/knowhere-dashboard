import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@components/theme-provider";
import { appMetadata } from "@lib/app-metadata";
import { getDefaultConfig } from "@lib/config";
import { ConfigProvider } from "@providers/config-provider";
import PostHogProvider from "@providers/posthog-provider";
import { Providers } from "@providers/providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export const metadata: Metadata = appMetadata;

const geistSans = localFont({
  src: "../public/fonts/Geist-VariableFont_wght.ttf",
  weight: "100 900",
  variable: "--font-geist-sans",
  display: "swap",
});

const anuphan = localFont({
  src: "../public/fonts/Anuphan-VariableFont_wght.ttf",
  weight: "100 900",
  variable: "--font-anuphan",
  display: "swap",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";

  // 在服务端读取环境变量（运行时配置，不带NEXT_PUBLIC_前缀）
  const appConfig = getDefaultConfig();
  const gaMeasurementId = appConfig.gaMeasurementId;

  // 获取翻译消息
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={"font-sans antialiased"}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ConfigProvider config={appConfig}>
            <ThemeProvider attribute="class" enableSystem={true} disableTransitionOnChange>
              <PostHogProvider>
                <Providers>
                  <div className="min-h-dvh">{children}</div>
                </Providers>
              </PostHogProvider>
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
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
