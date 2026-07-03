import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "./AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("pb_auth");
  if (!authCookie) redirect("/login");
  return <AdminShell>{children}</AdminShell>;
}
