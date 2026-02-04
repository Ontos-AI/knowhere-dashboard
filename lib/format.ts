// 日期格式化
export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short', locale: string = 'zh-CN', timeZone?: string): string {
  const d = new Date(date)
  
  if (isNaN(d.getTime())) {
    return '无效日期'
  }

  const options: Intl.DateTimeFormatOptions = {
    timeZone
  }

  switch (format) {
    case 'short':
      return d.toLocaleDateString(locale, {
        ...options,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    
    case 'long':
      return d.toLocaleDateString(locale, {
        ...options,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    
    case 'relative':
      return formatRelativeTime(d, locale, timeZone)
    
    default:
      return d.toLocaleDateString(locale, options)
  }
}

// 相对时间格式化
function formatRelativeTime(date: Date, locale: string = 'zh-CN', timeZone?: string): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  const isZh = locale.startsWith('zh')

  if (diffInSeconds < 60) {
    return isZh ? '刚刚' : 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return isZh ? `${minutes}分钟前` : `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return isZh ? `${hours}小时前` : `${hours}h ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return isZh ? `${days}天前` : `${days}d ago`
  } else {
    return formatDate(date, 'short', locale, timeZone)
  }
}

// 金额格式化
export function formatCurrency(amount: number, currency: string = 'CNY'): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

// Credits格式化
export function formatCredits(credits: number): string {
  return new Intl.NumberFormat('zh-CN').format(credits)
}

// 文件大小格式化
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 百分比格式化
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

// 截断文本
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// 掩码API Key
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) return apiKey
  return apiKey.substring(0, 8) + '•'.repeat(apiKey.length - 8)
}

// 验证邮箱格式
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 验证密码强度
export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  
  if (score <= 2) {
    return { score, label: '弱', color: 'text-red-500' }
  } else if (score <= 4) {
    return { score, label: '中等', color: 'text-yellow-500' }
  } else {
    return { score, label: '强', color: 'text-green-500' }
  }
}

// 生成随机字符串
export function generateRandomString(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 复制到剪贴板
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (err) {
      document.body.removeChild(textArea)
      return false
    }
  }
}
