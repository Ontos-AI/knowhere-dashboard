"use client";

import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { ScrollArea } from "@components/ui/scroll-area";
import { Sheet, SheetContent } from "@components/ui/sheet";
import { cn } from "@lib/utils";
import { Key, LayoutDashboard, LogOut, Settings, Webhook } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { type AuthUser, useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

type SidebarProps = {
  user: AuthUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function Sidebar({ user, open, onOpenChange }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { success } = useToast();
  const t = useTranslations("Common");

  const navigation = [
    { name: t("usage"), href: "/usage", icon: LayoutDashboard },
    { name: t("apiKeys"), href: "/api-keys", icon: Key },
    { name: t("webhooks"), href: "/webhooks/secrets", icon: Webhook },
    { name: t("settings"), href: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    success(t("logout"));
    onOpenChange(false);
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2">
          {/*  Brand logo icon */}
          <Image
            src={"/images/brand/brand-logo.png"}
            alt="brand logo"
            width={24}
            height={24}
            className="rounded-[5px]"
          />
          <span className="text-xl font-bold">Knowhere</span>
        </Link>
        {/* <LanguageSwitcher /> */}
      </div>

      {/* 导航菜单 */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/90 text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                )}
                onClick={() => onOpenChange(false)}
              >
                <IconComponent className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* 用户菜单 */}
      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start px-2 h-auto py-2 hover:bg-muted"
            >
              <div className="flex items-center gap-x-3 text-left w-full">
                <div
                  className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0 bg-cover bg-center"
                  style={{
                    backgroundImage: user?.image ? `url(${user.image})` : undefined,
                  }}
                >
                  {!user?.image && (
                    <span className="text-xs font-medium">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-medium truncate">{user?.name || "User"}</span>
                  <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" side="top" sideOffset={10} className="w-56 p-1">
            <DropdownMenuLabel className="p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user?.name}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" onClick={() => onOpenChange(false)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("settings")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => void handleLogout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t("logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <>
      {/* 移动端侧边栏 */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* 桌面端侧边栏 */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border/70 bg-sidebar/90 px-6 pb-4 backdrop-blur-sm">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
