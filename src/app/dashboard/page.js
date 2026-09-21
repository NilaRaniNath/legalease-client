import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardIndex() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const role = session.user.role;
  if (role === "admin") redirect("/dashboard/admin");
  if (role === "lawyer") redirect("/dashboard/lawyer");
  redirect("/dashboard/user");
}