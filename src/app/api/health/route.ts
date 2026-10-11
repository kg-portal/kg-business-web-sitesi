import { NextResponse } from "next/server";
import { getDb } from "@/server/db";

export const dynamic = "force-dynamic";

/** Für Monitoring: keine Konfigurationsdetails, keine Daten. */
export async function GET() {
  try {
    getDb().prepare("SELECT 1").get();
    return NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
