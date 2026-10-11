export interface DbProfile {
  id: string;
  name: string;
  dob: string;
  category: string;
  country: string;
  achievement: string;
  has_letter: number;
  letter_status: string;
  letter_html: string;
  contact_email: string;
  contact_linkedin: string;
  notes: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface DbQueueItem {
  id: number;
  profile_id: string;
  name: string;
  status: string;
  letter_html: string;
  scheduled_date: string;
  sent_at: string;
  recipient_email: string;
  resend_email_id: string;
  error: string;
  created_at: string;
  updated_at: string;
}

export interface DbBlindSpot {
  id: string;
  title: string;
  priority: string;
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface DbLogEntry {
  id: number;
  profile_id: string;
  action: string;
  details: string;
  created_at: string;
}

export type ResearchDraftStatus = "draft" | "approved" | "rejected";
export type ResearchDraftKind = "enrichment" | "new_profile" | "story_lead" | "correction";

export interface ResearchClaim {
  field: string;
  value: string;
  sources: string[];
  confidence: "low" | "medium" | "high";
}

export interface DbResearchDraft {
  id: number;
  kind: ResearchDraftKind;
  profile_id: string;
  name: string;
  claims_json: string;
  summary: string;
  status: ResearchDraftStatus;
  reviewed_by: string;
  reviewed_at: string;
  created_at: string;
  updated_at: string;
}

export function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

export function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
