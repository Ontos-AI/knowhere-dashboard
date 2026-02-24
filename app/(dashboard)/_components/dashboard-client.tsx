"use client";

import { useEffect, useState } from "react";
import { Header } from "@/app/(dashboard)/_components/header";
import { Sidebar } from "@/app/(dashboard)/_components/sidebar";
import type { AuthUser } from "@/hooks/use-auth";

type DashboardClientProps = {
  user: AuthUser;
  children: React.ReactNode;
};

export function DashboardClient({ user, children }: DashboardClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("console-tone");
    return () => document.body.classList.remove("console-tone");
  }, []);

  return (
    <div className="landing-tone relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,119,6,0.1),transparent_55%)]" />
      {/* 侧边栏 */}
      <Sidebar user={user} open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* 主内容区域 */}
      <div className="relative z-10 lg:pl-64">
        {/* 顶部导航栏 */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* 页面内容 */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
