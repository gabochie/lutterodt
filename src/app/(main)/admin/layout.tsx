import { redirect } from "next/navigation";
import { verifySession } from "@/lib/cf/auth";
import { AdminShell } from "./AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await verifySession();
  if (!authenticated) redirect("/login");
  return <AdminShell>{children}</AdminShell>;
}
