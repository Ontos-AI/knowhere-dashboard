/**
 * Cookie utility functions using Cookie Store API with fallback
 */

type CookieOptions = {
  path?: string;
  maxAge?: number;
  sameSite?: "strict" | "lax" | "none";
  secure?: boolean;
};

/**
 * Set a cookie using Cookie Store API (if available) or document.cookie as fallback
 */
export async function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): Promise<void> {
  const { path = "/", maxAge = 31536000, sameSite = "lax", secure = false } = options;

  // Try using Cookie Store API first (modern browsers)
  if (typeof window !== "undefined" && "cookieStore" in window) {
    try {
      await (window as typeof window & { cookieStore: CookieStore }).cookieStore.set({
        name,
        value,
        path,
        expires: maxAge ? Date.now() + maxAge * 1000 : undefined,
        sameSite,
        ...(secure && { secure: true }),
      });
      return;
    } catch (error) {
      // Fall through to document.cookie if Cookie Store API fails
      console.warn("Cookie Store API failed, falling back to document.cookie", error);
    }
  }

  // Fallback to document.cookie
  let cookieString = `${name}=${value}; path=${path}`;
  if (maxAge) {
    cookieString += `; max-age=${maxAge}`;
  }
  cookieString += `; SameSite=${sameSite.charAt(0).toUpperCase() + sameSite.slice(1)}`;
  if (secure) {
    cookieString += "; Secure";
  }

  // biome-ignore lint/suspicious/noDocumentCookie: Intentional fallback when Cookie Store API is unavailable
  document.cookie = cookieString;
}

/**
 * Type definition for Cookie Store API
 */
type CookieStore = {
  set(options: {
    name: string;
    value: string;
    path?: string;
    expires?: number;
    sameSite?: "strict" | "lax" | "none";
    secure?: boolean;
  }): Promise<void>;
};
