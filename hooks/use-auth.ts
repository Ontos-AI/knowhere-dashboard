"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/better-auth-client";

/**
 * User type derived from Better Auth session
 * User management is fully handled by Better Auth + Drizzle
 */
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role?: string;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Main authentication hook — wraps Better Auth session with a stable user interface.
 *
 * @returns Authentication state and actions
 */
export function useAuth() {
  const router = useRouter();

  // Get Better Auth session
  const { data: session, isPending } = authClient.useSession();

  // Map Better Auth session user to AuthUser shape
  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        emailVerified: session.user.emailVerified,
        createdAt: session.user.createdAt,
        updatedAt: session.user.updatedAt,
      }
    : null;

  // Authenticated when session and user are both available
  const isAuthenticated = !!session?.user;

  /**
   * Sign out from Better Auth (clears session cookie) and redirect to login page
   */
  const logout = async () => {
    try {
      await authClient.signOut();
      router.push("/login");
    } catch (error) {
      console.error("[useAuth] Logout error:", error);
    }
  };

  /**
   * Refresh session from Better Auth
   */
  const refreshSession = async () => {
    await authClient.getSession({
      query: { disableCookieCache: true },
    });
  };

  /**
   * Refresh user data from Better Auth session
   */
  const refreshUser = async () => {
    try {
      await refreshSession();
    } catch (error) {
      console.error("[useAuth] Failed to refresh user:", error);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading: isPending,
    session: session?.user || null,
    logout,
    refreshSession,
    refreshUser,
  };
}
