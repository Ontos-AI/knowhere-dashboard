"use client";

import { ThemeToggle } from "@components/theme-toggle";
import { useAppConfigContext } from "@providers/config-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export function AuthLayoutClient({ children }: { children: ReactNode }) {
  const appConfig = useAppConfigContext();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // 如果已登录，重定向到仪表板
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/usage");
    }
  }, [isAuthenticated, isLoading, router]);

  // 如果正在加载或已登录，显示加载状态
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p>加载中...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between p-6">
        <Link href="/" className="text-2xl font-bold text-primary">
          Knowhere API
        </Link>
        <ThemeToggle />
      </header>

      {/* 主要内容 */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* 底部 */}
      <footer className="text-center text-sm text-muted-foreground p-6">
        <p>
          &copy; {appConfig.copyrightYear} {appConfig.companyName}
          {appConfig.showIcp && (
            <>
              {" "}
              <a
                href={appConfig.icpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {appConfig.icpNumber}
              </a>
            </>
          )}
        </p>
      </footer>
    </div>
  );
}
