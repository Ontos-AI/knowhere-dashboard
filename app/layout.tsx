import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@components/theme-provider";
import { getDefaultConfig } from "@lib/config";
import { ConfigProvider } from "@providers/config-provider";
import PostHogProvider from "@providers/posthog-provider";
import { Providers } from "@providers/providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });
const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "block",
  variable: "--font-pixel-primary",
});

export const metadata: Metadata = {
  title: "Knowhere API - Transform Documents into Structured Data",
  description:
    "The most accurate document parsing API for AI agents. Extract tables, formulas, and structured data with unmatched precision.",
};

import { cookies } from "next/headers";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";

  // 在服务端读取环境变量（运行时配置，不带NEXT_PUBLIC_前缀）
  const appConfig = getDefaultConfig();
  const gaMeasurementId = appConfig.gaMeasurementId;

  // 获取翻译消息
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={pressStart2P.variable}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ConfigProvider config={appConfig}>
            <ThemeProvider attribute="class" enableSystem={true} disableTransitionOnChange>
              <PostHogProvider>
                <Providers>
                  <div className="min-h-screen bg-background">{children}</div>
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
