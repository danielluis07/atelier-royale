import { createHmac, timingSafeEqual } from "crypto";

function parseXSignature(signature: string) {
  const parts = signature.split(",").map((p) => p.trim());
  const map: Record<string, string> = {};

  for (const part of parts) {
    const [k, ...rest] = part.split("=");
    if (!k || rest.length === 0) continue;
    map[k.trim()] = rest.join("=").trim();
  }

  return { ts: map.ts, v1: map.v1 };
}

function safeEqualHex(a: string, b: string) {
  try {
    const aBuf = Buffer.from(a, "hex");
    const bBuf = Buffer.from(b, "hex");
    return aBuf.length === bBuf.length && timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}

export function validateWebhookSignature(
  signature: string,
  requestId: string,
  resourceId: string,
) {
  if (!process.env.MP_WEBHOOK_SECRET) {
    console.error("MP_WEBHOOK_SECRET não configurado");
    return false;
  }

  const { ts, v1 } = parseXSignature(signature);
  if (!ts || !v1) return false;

  const manifest = `id:${resourceId};request-id:${requestId};ts:${ts};`;

  const generated = createHmac("sha256", process.env.MP_WEBHOOK_SECRET)
    .update(manifest)
    .digest("hex");

  return safeEqualHex(v1, generated);
}
