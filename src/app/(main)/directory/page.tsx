import { cookies } from "next/headers";
import DirectoryClient from "./DirectoryClient";

export const dynamic = "force-dynamic";

export default async function DirectoryPage() {
  const cookieStore = await cookies();
  const vToken = cookieStore.get("lutterodt_verified")?.value || "";
  const isVerified = vToken.includes(".") && vToken.split(".").length === 2;

  return <DirectoryClient isVerified={isVerified} />;
}
