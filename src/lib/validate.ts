import { z } from "zod";

/**
 * Shared request validation (Phase 1.4).
 *
 * Every public write endpoint parses its body through one of these schemas.
 * Rules of thumb: trim everything, cap every string (D1 rows and KV values
 * are bounded), and never trust `request.json()` output types.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Email is too long")
  .refine((v) => EMAIL_RE.test(v), "Enter a valid email address");

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(120, "Name is too long");

const optText = (max: number) =>
  z.string().trim().max(max, `Must be under ${max} characters`).optional().default("");

const optMessage = (max: number) =>
  z.string().trim().max(max, `Message is too long (max ${max} characters)`).optional().default("");

const optEmail = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .optional()
  .default("")
  .refine((v) => v === "" || EMAIL_RE.test(v), "Enter a valid email address");

export const leadSchema = z.object({
  email: emailSchema,
  // Name stays optional here (legacy contact forms omit it); required on register.
  name: optText(120),
  whatsapp: optText(40),
  subject: optText(160),
  message: optMessage(2000),
  category: optText(60),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: optText(40),
  service_interest: optText(120),
  message: optMessage(2000),
});

export const subscribeSchema = z.object({
  email: emailSchema,
  name: z.string().trim().max(120).optional().default(""),
  consent: z.literal(true, { error: "Please agree to receive the bulletin to continue" }),
});

export const loginSchema = z.object({
  email: emailSchema,
  access_code: z.string().trim().min(1, "Access code is required").max(200),
});

const LETTER_HTML_MAX = 200_000;

export const profileCreateSchema = z.object({
  name: z.string().trim().min(2, "Name is required (min 2 chars)").max(160),
  dob: optText(40),
  category: z.string().trim().max(60).optional().default("uncategorized"),
  country: optText(80),
  achievement: optMessage(2000),
  contact_email: optEmail,
  contact_linkedin: optText(2048),
  notes: optMessage(2000),
  image_url: optText(2048),
});

export const profilePatchSchema = z
  .object({
    id: z.string().trim().min(1, "id required").max(200),
    name: z.string().trim().min(1).max(160).optional(),
    dob: z.string().trim().max(40).optional(),
    category: z.string().trim().max(60).optional(),
    country: z.string().trim().max(80).optional(),
    achievement: z.string().trim().max(2000).optional(),
    letter_status: z
      .enum(["none", "new", "draft", "queued", "sent"])
      .optional(),
    letter_html: z.string().max(LETTER_HTML_MAX, "Letter HTML is too large").optional(),
    contact_email: z
      .string()
      .trim()
      .toLowerCase()
      .max(254)
      .optional()
      .refine((v) => v === undefined || v === "" || EMAIL_RE.test(v), "Enter a valid email address"),
    contact_linkedin: z.string().trim().max(2048).optional(),
    notes: z.string().trim().max(2000).optional(),
    has_letter: z.number().int().min(0).max(1).optional(),
    image_url: z.string().trim().max(2048).optional(),
  })
  .refine(
    (v) => Object.keys(v).some((k) => k !== "id"),
    "No valid fields"
  );

export const reunionUpdateSchema = z.object({
  attendee_name: nameSchema,
  message: optMessage(1000),
  photo_url: optText(2048),
});

export const sponsorSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  organization: optText(160),
  contactPerson: optText(120),
  queue: z.boolean().optional().default(false),
});

export const tokenSchema = z
  .string()
  .trim()
  .min(8, "Invalid token")
  .max(256, "Invalid token");

export const takedownSchema = z.object({
  // Who is asking (so the committee can follow up).
  name: nameSchema,
  email: optEmail,
  // Which profile this concerns (id from /directory, or free text).
  profile_id: optText(200),
  profile_name: optText(160),
  // correction = fix details, removal = erase my listing.
  kind: z.enum(["correction", "removal"]),
  details: z.string().trim().min(10, "Please describe the issue (min 10 characters)").max(2000),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfilePatchInput = z.infer<typeof profilePatchSchema>;

export function parseBody<T>(
  schema: z.ZodType<T>,
  body: unknown
): { ok: true; data: T } | { ok: false; error: string } {
  const result = schema.safeParse(body);
  if (result.success) return { ok: true, data: result.data };
  const first = result.error.issues[0];
  return { ok: false, error: first?.message || "Invalid request" };
}
