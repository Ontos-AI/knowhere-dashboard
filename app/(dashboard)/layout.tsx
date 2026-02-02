import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/app/(dashboard)/_components/dashboard-client";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 服务端获取 session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 未认证则重定向
  if (!session?.user) {
    redirect("/login");
  }

  // 提取用户信息
  const user = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
  };

  return <DashboardClient user={user}>{children}</DashboardClient>;
}
