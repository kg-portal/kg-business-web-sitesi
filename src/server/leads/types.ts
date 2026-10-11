import type { EnergieCheckData, KontaktData } from "@/lib/lead-schema";

export type FormType = "energie-check" | "kontakt";

/** Verschlüsselt gespeicherter Inhalt einer Anfrage. */
export type LeadPayload =
  | { formType: "energie-check"; data: EnergieCheckData }
  | { formType: "kontakt"; data: KontaktData };

export type CrmStatus = "pending" | "sent" | "failed" | "skipped_disabled" | "skipped_duplicate" | "skipped_test";

export interface LeadRow {
  id: string;
  reference: string;
  idempotency_key: string;
  created_at: string;
  form_type: FormType;
  customer_type: string | null;
  energy: string | null;
  fingerprint: string;
  duplicate_of: string | null;
  payload_enc: Buffer;
  consent_text_version: string;
  consent_privacy_at: string;
  consent_marketing_email: number;
  consent_marketing_phone: number;
  is_test: number;
  upload_count: number;
  crm_status: CrmStatus;
  crm_attempts: number;
  crm_last_error: string | null;
  crm_next_attempt_at: string | null;
  crm_external_id: string | null;
  crm_sent_at: string | null;
  notify_status: string;
}

export interface UploadRow {
  id: string;
  lead_id: string;
  stored_name: string;
  original_name_enc: Buffer;
  mime: string;
  size: number;
  sha256: string;
  scan_status: "clean" | "not_scanned" | "error";
  created_at: string;
}
