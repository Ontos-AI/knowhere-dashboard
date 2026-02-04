/**
 * 应用配置
 * 支持运行时动态配置（通过环境变量）
 * 
 * 实现方式：
 * - 在服务端组件（如 Layout）中调用 getDefaultConfig() 读取环境变量
 * - 通过 React Context 传递给客户端组件
 * - 环境变量（COMPANY_NAME 等，不带 NEXT_PUBLIC_ 前缀）在运行时读取
 * 
 * 优先级：
 * 1. 环境变量（COMPANY_NAME 等，不带 NEXT_PUBLIC_ 前缀）
 * 2. 默认值
 */

// 配置类型
export interface AppConfigType {
  companyName: string
  simpleCompanyName: string
  icpNumber: string
  icpUrl: string
  copyrightYear: number
  showIcp: boolean
  // OAuth配置（运行时配置，不带NEXT_PUBLIC_前缀）
  googleClientId: string
  githubClientId: string
  appleClientId: string
}

// 获取配置（用于服务端组件）
// 在服务端组件中调用此函数读取环境变量，然后通过 ConfigProvider 传递给客户端组件
export const getDefaultConfig = (): AppConfigType => {
  // 处理环境变量：如果值为空字符串或undefined，使用默认值
  const getEnv = (key: string, defaultValue: string = ''): string => {
    const value = process.env[key]
    return value && value.trim() !== '' ? value : defaultValue
  }
  
  const companyName = getEnv('COMPANY_NAME', 'Knowhere AI')
  const simpleCompanyName = getEnv('SIMPLE_COMPANY_NAME', '')
  const icpNumber = getEnv('ICP_NUMBER', '')
  const icpUrl = getEnv('ICP_URL', 'https://beian.miit.gov.cn/')
  
  // OAuth配置（运行时配置，不带NEXT_PUBLIC_前缀）
  const googleClientId = getEnv('GOOGLE_CLIENT_ID', '')
  const githubClientId = getEnv('GITHUB_CLIENT_ID', '')
  const appleClientId = getEnv('APPLE_CLIENT_ID', '')
  
  return {
    // 公司名称（运行时配置，不带 NEXT_PUBLIC_ 前缀）
    companyName,
    
    // 公司简称
    simpleCompanyName,
    
    // ICP备案号（国内部署时使用）
    icpNumber,
    
    // ICP备案链接（国内部署时使用）
    icpUrl,
    
    // 版权年份
    copyrightYear: new Date().getFullYear(),
    
    // 是否显示ICP备案信息（只有当icpNumber不为空时才显示）
    showIcp: icpNumber.trim() !== '',
    
    // OAuth配置（运行时配置）
    googleClientId,
    githubClientId,
    appleClientId,
  }
}

