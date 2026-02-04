"use client";

import { LanguageSwitcher } from "@components/language-switcher";
import { ThemeToggle } from "@components/theme-toggle";
import { Button } from "@components/ui/button";
import { useCredits } from "@hooks/use-credits";
import { Bell, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { BuyCreditsDialog } from "@/app/(dashboard)/billing/_components/buy-credits-dialog";

type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  const { data: credits } = useCredits();
  const t = useTranslations("Common");

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* 移动端菜单按钮 */}
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">{t("openSidebar")}</span>
      </Button>

      {/* 分隔线 */}
      <div className="h-6 w-px bg-border lg:hidden" />

      {/* 占位符，将右侧操作区推到最右 */}
      <div className="flex-1" />

      {/* 右侧操作区 */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Credits余额 & 购买按钮 */}
        <div className="hidden sm:flex items-center space-x-3">
          <BuyCreditsDialog currentCredits={credits || 0} />
        </div>

        {/* 通知 */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">{t("viewNotifications")}</span>
          {/* 通知红点 */}
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive" />
        </Button>

        {/* 主题切换 */}
        <ThemeToggle />

        {/* 语言切换 */}
        <LanguageSwitcher />
      </div>
    </header>
  );
}
