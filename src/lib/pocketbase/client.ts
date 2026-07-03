"use client";

import PocketBase from "pocketbase";

function createPocketBaseClient() {
  const url = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
  return new PocketBase(url);
}

let pb: PocketBase | undefined;

export function getPB() {
  if (typeof window === "undefined") return null;
  if (!pb) pb = createPocketBaseClient();
  return pb;
}
