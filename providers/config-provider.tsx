"use client";

import type { AppConfigType } from "@lib/config";
import { createContext, type ReactNode, useContext } from "react";

const ConfigContext = createContext<AppConfigType | null>(null);

type ConfigProviderProps = {
  config: AppConfigType;
  children: ReactNode;
};

export function ConfigProvider({ config, children }: ConfigProviderProps) {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

export function useAppConfigContext(): AppConfigType {
  const config = useContext(ConfigContext);
  if (!config) {
    // 如果 Context 未提供，返回默认配置（降级处理）
    return {
      companyName: "Knowhere AI",
      simpleCompanyName: "",
      icpNumber: "",
      icpUrl: "https://beian.miit.gov.cn/",
      copyrightYear: new Date().getFullYear(),
      showIcp: false,
      gaMeasurementId: "",
      openAIAdsPixelId: "",
      googleClientId: "",
      githubClientId: "",
      appleClientId: "",
      billingEnabled: false,
      passwordLoginEnabled: false,
    };
  }
  return config;
}
