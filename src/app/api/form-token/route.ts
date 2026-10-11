import { NextResponse } from "next/server";
import { ConfigError, getConfig } from "@/server/config";
import { issueFormToken } from "@/server/security/form-token";
import { getLimiters } from "@/server/security/limits";
import { clientKey } from "@/server/security/request";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  let config;
  try {
    config = getConfig();
  } catch (err) {
    if (err instanceof ConfigError) return NextResponse.json({ error: "unavailable" }, { status: 503 });
    throw err;
  }
  const key = clientKey(request.headers, config.env.TRUST_PROXY, config.appSecret);
  const rl = getLimiters().tokens.hit(key);
  if (!rl.allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } });
  }
  return NextResponse.json({ token: issueFormToken(config.appSecret) }, { headers: { "Cache-Control": "no-store" } });
}
