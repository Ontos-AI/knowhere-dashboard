import { getDefaultConfig } from "@lib/config";
import { ConfigProvider } from "@providers/config-provider";
import { Suspense } from "react";
import { AuthLayoutClient } from "@/app/(auth)/_components/auth-layout-client";
import { LoginChrome } from "@/app/(auth)/_components/login-chrome";

export const dynamic = "force-dynamic";

function AuthChromeFallback() {
  return (
    <LoginChrome>
      <div className="login-status">
        <span className="control-spinner" aria-hidden="true" />
      </div>
    </LoginChrome>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const appConfig = getDefaultConfig();

  return (
    <ConfigProvider config={appConfig}>
      <Suspense fallback={<AuthChromeFallback />}>
        <AuthLayoutClient>{children}</AuthLayoutClient>
      </Suspense>
    </ConfigProvider>
  );
}
