import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 需要认证的路径
const protectedPaths = ['/dashboard', '/api-keys', '/settings', '/usage']
const authPaths = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. 检查 Better Auth session
  const hasSession =
    request.cookies.has('better-auth.session_token') ||
    request.cookies.has('__Secure-better-auth.session_token')

  // 2. 处理受保护路径逻辑
  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
  const isAuthPath = authPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  // 如果访问受保护路径且未登录
  if (isProtectedPath && !hasSession) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackURL', pathname)
    return NextResponse.redirect(url)
  }

  // 如果已登录但访问登录/注册页
  if (isAuthPath && hasSession) {
    return NextResponse.redirect(new URL('/usage', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // 匹配所有路径，除了 api, _next, 静态文件
    '/((?!api|proxy|_next/static|_next/image|favicon.ico).*)',
  ],
}
