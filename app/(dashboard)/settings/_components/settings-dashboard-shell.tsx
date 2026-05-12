"use client";

import { DashboardShell } from "@app/(dashboard)/_components/dashboard-shell";
import type { AuthUser } from "@hooks/use-auth";

type SettingsDashboardShellProps = {
  user: AuthUser;
  children: React.ReactNode;
  isBuyCreditsOpen: boolean;
};

export const SettingsDashboardShell = ({
  user,
  children,
  isBuyCreditsOpen,
}: SettingsDashboardShellProps) => {
  return (
    <DashboardShell
      compactMobileHeader={true}
      compactTabletHeader={true}
      user={user}
      isBuyCreditsOpen={isBuyCreditsOpen}
      mainClassName="px-[18px] pb-[30px] pt-[30px] sm:px-[30px] sm:pb-[70px] sm:pt-[22px] lg:px-12 lg:pb-24 lg:pt-8"
      titleNamespace="Settings"
      creditsIconSrc="/icons/api-keys/credits-coin.svg"
    >
      {children}
    </DashboardShell>
  );
};
