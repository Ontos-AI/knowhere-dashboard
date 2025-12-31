import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// 1. 定义多语言中间件
const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: false // 禁用基于浏览器的语言自动检测，防止切换语言时被强制重定向回浏览器首选语言
});

// 需要认证的路径 (不包含语言前缀)
const protectedPaths = ['/dashboard', '/api-keys', '/settings', '/usage'];
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 2. 检查 Better Auth session
  const hasSession = request.cookies.has('better-auth.session_token') || 
                     request.cookies.has('__Secure-better-auth.session_token');

  // 3. 处理受保护路径逻辑
  // 使用更安全的方式去除语言前缀
  const segments = pathname.split('/');
  const hasLocalePrefix = ['en', 'zh'].includes(segments[1]);
  const pathWithoutLocale = hasLocalePrefix 
    ? '/' + segments.slice(2).join('/') 
    : pathname;

  const isProtectedPath = protectedPaths.some(path => pathWithoutLocale === path || pathWithoutLocale.startsWith(path + '/'));
  const isAuthPath = authPaths.some(path => pathWithoutLocale === path || pathWithoutLocale.startsWith(path + '/'));

  // 如果访问受保护路径且未登录
  if (isProtectedPath && !hasSession) {
    // 获取当前语言，默认为 zh
    const locale = hasLocalePrefix ? segments[1] : 'zh';
    const url = new URL(`/${locale}/login`, request.url);
    url.searchParams.set('callbackURL', pathname);
    return NextResponse.redirect(url);
  }

  // 如果已登录但访问登录/注册页
  if (isAuthPath && hasSession) {
    const locale = hasLocalePrefix ? segments[1] : 'zh';
    return NextResponse.redirect(new URL(`/${locale}/usage`, request.url));
  }

  // 4. 最后执行 next-intl 中间件
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // 匹配所有路径，除了 api, _next, 静态文件
    // 注意：我们需要排除 /proxy 以允许本地代理路由工作
    '/((?!api|proxy|_next/static|_next/image|favicon.ico).*)',
  ],
};
