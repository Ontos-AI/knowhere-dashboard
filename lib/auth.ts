import './polyfill'
import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { magicLink } from 'better-auth/plugins'
import { Resend } from 'resend'
import { ProxyAgent, setGlobalDispatcher } from 'undici'

// 在开发环境下，如果配置了代理，则设置全局代理（解决国内无法访问 Google/GitHub OAuth 的问题）
if (process.env.NODE_ENV === 'development' || process.env.HTTPS_PROXY) {
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY
  if (proxyUrl) {
    try {
      const dispatcher = new ProxyAgent(proxyUrl)
      setGlobalDispatcher(dispatcher)
      console.log(`[Auth] Using proxy: ${proxyUrl}`)
    } catch (error) {
      console.error('[Auth] Failed to set proxy:', error)
    }
  }
}

// Only initialize Resend if API key is provided
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  // 显式指定 trustedOrigins 防止反向代理或 Docker 环境下的 host 校验失败
  // 必须包含生产环境域名，否则会导致 invalid_origin 错误
  trustedOrigins: ['http://localhost:3000', process.env.BETTER_AUTH_URL || 'http://localhost:3000'],
  secret: process.env.BETTER_AUTH_SECRET || 'dev-secret-please-change',
  session: {
    // 启用 JWT session，这样前端获取的 token 就是一个标准的 JWT，
    // 后端可以直接验证这个 JWT，而不需要访问数据库（前提是共享 secret）
    // 这对于接入外部后端 API 是最小力度的整改方案
    cookieCache: {
      enabled: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
  },
  // advanced: {
  //     defaultSession: {
  //         strategy: "jwt",
  //     }
  // },
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      // GitHub 有时需要显式指定 redirectURI 避免自动推导错误
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/github`,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        try {
          // 检查必要的环境变量
          if (!process.env.RESEND_API_KEY || !resend) {
            console.warn('RESEND_API_KEY is missing. Printing magic link to console instead.')
            if (process.env.NODE_ENV === 'development') {
              console.log(`\n📨 [DEV MODE] Magic Link for ${email}:\n${url}\n`)
            }
            return
          }

          const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM || 'onboarding@resend.dev',
            to: email,
            subject: '登录您的 Knowhere 账户',
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta name="color-scheme" content="light dark">
                <meta name="supported-color-schemes" content="light dark">
                <style>
                  @media (prefers-color-scheme: dark) {
                    .body-bg { background-color: #09090b !important; }
                    .content-text { color: #ffffff !important; }
                    .secondary-text { color: #a1a1aa !important; }
                    .button-primary { background-color: #fafafa !important; color: #09090b !important; }
                    .link-text { color: #a1a1aa !important; }
                    .divider { border-color: #27272a !important; }
                  }
                </style>
              </head>
              <body class="body-bg" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff;">
                <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                  <h2 class="content-text" style="color: #09090b; margin-bottom: 24px; font-size: 24px; font-weight: 600;">登录 Knowhere</h2>
                  <p class="content-text" style="color: #09090b; margin-bottom: 24px; line-height: 1.6; font-size: 16px;">您请求了登录链接。请点击下方按钮完成登录：</p>
                  
                  <a href="${url}" class="button-primary" style="display: inline-block; padding: 12px 24px; background-color: #09090b; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
                    登录系统
                  </a>

                  <div class="divider" style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #e5e5e5;">
                    <p class="secondary-text" style="font-size: 14px; color: #666666; margin-bottom: 12px; line-height: 1.5;">如果按钮无法点击，请复制以下链接到浏览器：</p>
                    <a href="${url}" class="link-text" style="font-size: 13px; color: #666666; text-decoration: underline; word-break: break-all; line-height: 1.6; display: block;">
                      ${url}
                    </a>
                  </div>

                  <p class="secondary-text" style="margin-top: 32px; font-size: 12px; color: #a1a1aa;">
                    如果您没有请求此链接，请忽略此邮件。
                  </p>
                </div>
              </body>
              </html>
            `,
          })

          if (error) {
            console.error('Resend error:', error)
            throw error
          }

          console.log(`Magic link sent to ${email}. Id: ${data?.id}`)
        } catch (error) {
          console.error('Failed to send magic link:', error)
          // 即使发送失败，也在开发环境下打印链接，确保流程不阻塞
          if (process.env.NODE_ENV === 'development') {
            console.log(`\n⚠️ [FALLBACK] Email failed. Here is the Magic Link:\n${url}\n`)
            // 在开发模式下，如果启用了 fallback 打印，我们可以选择不抛出错误，让流程继续
            // 但如果用户希望看到真实错误，可以注释掉下面这行 return
            return
          }
          // 在生产环境或非 fallback 情况下，必须抛出错误，否则前端会显示"发送成功"
          throw error
        }
      },
    }),
    nextCookies(),
  ],
})
