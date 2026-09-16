import type { ReactNode } from "react";
import { LoginChrome } from "@/app/(auth)/_components/login-chrome";

export default function VerifyEmailLayout({ children }: { children: ReactNode }) {
  return <LoginChrome>{children}</LoginChrome>;
}
