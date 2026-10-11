/**
 * Shared outreach tracker types (Phase 3.1).
 *
 * Previously these lived in the `(main)/api/outreach` route file and were
 * imported across the app/route boundary by the admin UI — brittle to every
 * route move. Import from here instead.
 */

export type OutreachStatus =
  | "not_sent"
  | "sent"
  | "replied"
  | "meeting_booked"
  | "declined"
  | "follow_up";

export type OutreachChannel =
  | ""
  | "email"
  | "linkedin"
  | "phone"
  | "mail"
  | "whatsapp"
  | "other";

export interface OutreachRecord {
  profileId: string;
  name: string;
  category: string;
  country: string;
  letter: string | null;
  status: OutreachStatus;
  channel: OutreachChannel;
  dateSent: string | null;
  notes: string;
  lastContacted: string | null;
}
