/**
 * PostHog 用户行为追踪 - 官方推荐实现
 */

// PostHog 配置
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'

// 只在客户端初始化PostHog
let posthog: any = null

const initPostHog = () => {
  if (typeof window !== 'undefined' && POSTHOG_KEY && !posthog) {
    // 动态导入PostHog，避免服务端渲染问题
    import('posthog-js').then((module) => {
      posthog = module.default
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: 'identified_only',
        capture_pageview: false, // 手动控制页面浏览事件
        capture_pageleave: true,
        loaded: (posthog: any) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('PostHog loaded')
          }
        }
      })
    }).catch((error) => {
      console.error('Failed to load PostHog:', error)
    })
  }
}

// 获取PostHog实例
const getPostHog = () => {
  return posthog
}

// 初始化 PostHog
export const initPostHogClient = initPostHog

// 识别用户
export const identifyUser = (userId: string, userProperties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && posthog) {
    posthog.identify(userId, userProperties)
  }
}

// 重置用户（登出时调用）
export const resetUser = () => {
  if (typeof window !== 'undefined' && posthog) {
    posthog.reset()
  }
}

// 追踪页面浏览
export const trackPageView = (pageName?: string) => {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture('$pageview', {
      page: pageName || window.location.pathname
    })
  }
}

// 追踪自定义事件
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture(eventName, properties)
  }
}

// 设置用户属性
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && posthog) {
    posthog.people.set(properties)
  }
}

// 追踪登录事件
export const trackLogin = (method: 'google' | 'github' | 'apple' | 'email', userId: string) => {
  trackEvent('user_login', {
    method,
    user_id: userId,
    timestamp: new Date().toISOString()
  })
}

// 追踪注册事件
export const trackSignUp = (method: 'google' | 'github' | 'apple' | 'email', userId: string) => {
  trackEvent('user_signup', {
    method,
    user_id: userId,
    timestamp: new Date().toISOString()
  })
}

// 追踪API Key创建
export const trackApiKeyCreated = (keyId: string, keyName: string) => {
  trackEvent('api_key_created', {
    key_id: keyId,
    key_name: keyName,
    timestamp: new Date().toISOString()
  })
}

// 追踪API Key删除
export const trackApiKeyDeleted = (keyId: string) => {
  trackEvent('api_key_deleted', {
    key_id: keyId,
    timestamp: new Date().toISOString()
  })
}

// 追踪Credits购买
export const trackCreditsPurchased = (amount: number, planType: string, transactionId: string) => {
  trackEvent('credits_purchased', {
    amount,
    plan_type: planType,
    transaction_id: transactionId,
    timestamp: new Date().toISOString()
  })
}

// 追踪任务创建
export const trackJobCreated = (jobType: 'kb_management', jobId: string, sourceType: 'direct_upload' | 'url') => {
  trackEvent('job_created', {
    job_type: jobType,
    job_id: jobId,
    source_type: sourceType,
    timestamp: new Date().toISOString()
  })
}

// 追踪任务完成
export const trackJobCompleted = (jobType: 'kb_management', jobId: string, processingTimeMs: number) => {
  trackEvent('job_completed', {
    job_type: jobType,
    job_id: jobId,
    processing_time_ms: processingTimeMs,
    timestamp: new Date().toISOString()
  })
}

// 追踪任务失败
export const trackJobFailed = (jobType: 'kb_management', jobId: string, errorMessage: string) => {
  trackEvent('job_failed', {
    job_type: jobType,
    job_id: jobId,
    error_message: errorMessage,
    timestamp: new Date().toISOString()
  })
}

// 追踪文件上传
export const trackFileUpload = (fileType: string, fileSize: number, uploadMethod: 'direct' | 'url') => {
  trackEvent('file_uploaded', {
    file_type: fileType,
    file_size: fileSize,
    upload_method: uploadMethod,
    timestamp: new Date().toISOString()
  })
}

// 追踪Webhook配置
export const trackWebhookConfigured = (webhookUrl: string) => {
  trackEvent('webhook_configured', {
    webhook_url: webhookUrl,
    timestamp: new Date().toISOString()
  })
}

// 追踪错误
export const trackError = (errorMessage: string, errorContext?: Record<string, any>) => {
  trackEvent('error_occurred', {
    error_message: errorMessage,
    error_context: errorContext,
    timestamp: new Date().toISOString()
  })
}

// 追踪功能使用
export const trackFeatureUsage = (featureName: string, properties?: Record<string, any>) => {
  trackEvent('feature_used', {
    feature_name: featureName,
    ...properties,
    timestamp: new Date().toISOString()
  })
}

export default getPostHog