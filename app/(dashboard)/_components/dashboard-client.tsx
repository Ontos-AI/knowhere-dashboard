"use client";

import { useState } from "react";
import { Header } from "@/app/(dashboard)/_components/header";
import { Sidebar } from "@/app/(dashboard)/_components/sidebar";
import type { AuthUser } from "@/hooks/use-auth";

type DashboardClientProps = {
  user: AuthUser;
  children: React.ReactNode;
};

export function DashboardClient({ user, children }: DashboardClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* 侧边栏 */}
      <Sidebar user={user} open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* 主内容区域 */}
      <div className="lg:pl-64">
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
