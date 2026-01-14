"use client"

import { createContext, useContext, type ReactNode } from 'react'
import type { AppConfigType } from '@/lib/config'

const ConfigContext = createContext<AppConfigType | null>(null)

interface ConfigProviderProps {
  config: AppConfigType
  children: ReactNode
}

export function ConfigProvider({ config, children }: ConfigProviderProps) {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}

export function useAppConfigContext(): AppConfigType {
  const config = useContext(ConfigContext)
  if (!config) {
    // 如果 Context 未提供，返回默认配置（降级处理）
    return {
      companyName: 'Knowhere AI',
      simpleCompanyName: '',
      icpNumber: '',
      icpUrl: 'https://beian.miit.gov.cn/',
      copyrightYear: new Date().getFullYear(),
      showIcp: false,
      googleClientId: '',
      githubClientId: '',
      appleClientId: '',
    }
  }
  return config
}

