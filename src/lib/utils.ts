import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function errMessage(err: unknown, fallback = "Unknown error"): string {
  if (err instanceof Error) return err.message
  if (typeof err === "string" && err.length > 0) return err
  return fallback
}
