import { NextResponse, NextRequest } from "next/server";
import { verifyRequestAuth } from "@/lib/cf/auth";

export async function GET(request: NextRequest) {
  const authenticated = await verifyRequestAuth(request);
  return NextResponse.json({ authenticated });
}
