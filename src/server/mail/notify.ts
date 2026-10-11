/**
 * Benachrichtigungen nach Eingang einer Anfrage.
 *  - MAIL_MODE=disabled (Standard): keine E-Mails
 *  - MAIL_MODE=log: nur Protokolleintrag (ohne personenbezogene Daten)
 *  - MAIL_MODE=smtp: interne E-Mail an MAIL_TO_INTERNAL
 * Kundenbestätigungen nur mit CUSTOMER_CONFIRMATION_EMAIL=true (Freigabe nötig).
 */
import nodemailer from "nodemailer";
import { company } from "@/content/company";
import { getConfig } from "../config";
import { decryptJson } from "../crypto";
import { getDb, recordEvent } from "../db";
import { errorCode, log } from "../logger";
import type { LeadPayload, LeadRow } from "../leads/types";

function summaryLines(row: LeadRow, payload: LeadPayload, includeContact: boolean): string[] {
  const lines = [
    `Referenz: ${row.reference}`,
    `Eingang: ${new Date(row.created_at).toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}`,
    `Formular: ${row.form_type}`,
    `Kundentyp: ${row.customer_type ?? "–"}`,
    `Energie: ${row.energy ?? "–"}`,
    `Uploads: ${row.upload_count}`,
  ];
  if (row.duplicate_of) lines.push(`Hinweis: mögliches Duplikat von ${row.duplicate_of}`);
  if (payload.formType === "energie-check") lines.push(`PLZ: ${payload.data.plz}`);
  if (includeContact) {
    const d = payload.data;
    lines.push("", `Name: ${d.ansprechpartner}`, `Firma: ${d.firma ?? "–"}`, `E-Mail: ${d.email}`, `Telefon: ${d.telefon ?? "–"}`);
  } else {
    lines.push("", "Kontaktdaten sind aus Datenschutzgründen nicht enthalten – Details im CRM bzw. in der Lead-Datenbank.");
  }
  return lines;
}

export async function notifyNewLead(reference: string): Promise<void> {
  const config = getConfig();
  const db = getDb();
  const row = db.prepare("SELECT * FROM leads WHERE reference = ?").get(reference) as LeadRow | undefined;
  if (!row) return;
  const mode = config.env.MAIL_MODE;
  try {
    if (mode === "disabled" || row.is_test) {
      db.prepare("UPDATE leads SET notify_status = ? WHERE id = ?").run(row.is_test ? "skipped_test" : "disabled", row.id);
      return;
    }
    if (mode === "log") {
      log.info("mail.notify_logged", { reference: row.reference });
      db.prepare("UPDATE leads SET notify_status = 'logged' WHERE id = ?").run(row.id);
      return;
    }
    const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO_INTERNAL } = config.env;
    if (!SMTP_HOST || !MAIL_FROM || !MAIL_TO_INTERNAL) {
      log.warn("mail.misconfigured", { reference: row.reference });
      db.prepare("UPDATE leads SET notify_status = 'misconfigured' WHERE id = ?").run(row.id);
      return;
    }
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      requireTLS: !SMTP_SECURE,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
    const payload = decryptJson<LeadPayload>(row.payload_enc, config.encryptionKey);
    await transport.sendMail({
      from: MAIL_FROM,
      to: MAIL_TO_INTERNAL,
      subject: `Neue Website-Anfrage ${row.reference} (${row.form_type})`,
      text: summaryLines(row, payload, config.env.MAIL_INCLUDE_CONTACT).join("\n"),
    });
    if (config.env.CUSTOMER_CONFIRMATION_EMAIL) {
      await transport.sendMail({
        from: MAIL_FROM,
        to: payload.data.email,
        subject: `Ihre Anfrage bei ${company.brandName} (${row.reference})`,
        text: [
          `Guten Tag ${payload.data.ansprechpartner},`,
          "",
          `vielen Dank für Ihre Anfrage. Sie ist unter der Referenz ${row.reference} bei uns eingegangen.`,
          "Wir melden uns persönlich bei Ihnen.",
          "",
          `${company.brandName} · ${company.address.street} · ${company.address.postalCode} ${company.address.city}`,
          `Telefon ${company.phone.display} · ${company.email}`,
        ].join("\n"),
      });
    }
    db.prepare("UPDATE leads SET notify_status = 'sent' WHERE id = ?").run(row.id);
    recordEvent(db, row.id, "mail.sent");
  } catch (err) {
    log.error("mail.failed", { reference: row.reference, code: errorCode(err) });
    db.prepare("UPDATE leads SET notify_status = 'failed' WHERE id = ?").run(row.id);
  }
}
