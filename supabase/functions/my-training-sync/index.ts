import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const OWNER_SYNC_KEY = Deno.env.get("MY_TRAINING_SYNC_KEY") || "";
const ALLOWED_ORIGIN = (Deno.env.get("ALLOWED_ORIGIN") || "").replace(/\/$/, "");
const TABLE = "my_training_owner_records";

function getAdminKey(): string {
  // Use a dedicated, rotated Supabase secret API key named "training_sync".
  // The key is injected by Supabase in SUPABASE_SECRET_KEYS and never belongs in source control.
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    return typeof keys.training_sync === "string" ? keys.training_sync : "";
  } catch {
    return "";
  }
}

const ADMIN_KEY = getAdminKey();
const db = SUPABASE_URL && ADMIN_KEY
  ? createClient(SUPABASE_URL, ADMIN_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

function safeEqual(a: string, b: string): boolean {
  const aa = new TextEncoder().encode(a);
  const bb = new TextEncoder().encode(b);
  let diff = aa.length ^ bb.length;
  const n = Math.max(aa.length, bb.length);
  for (let i = 0; i < n; i++) diff |= (aa[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

function headers(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN || origin || "null",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
    "Vary": "Origin",
    "Content-Type": "application/json; charset=utf-8",
  };
}

function reply(body: unknown, status = 200, origin: string | null = null): Response {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: headers(origin),
  });
}

function pathAfterFunction(pathname: string): string[] {
  const marker = "/my-training-sync";
  const at = pathname.lastIndexOf(marker);
  if (at < 0) return [];
  return pathname.slice(at + marker.length).split("/").filter(Boolean);
}

async function readExisting(type: string, key: string) {
  if (!db) throw new Error("Server database is not configured");
  const { data, error } = await db.from(TABLE).select("payload, updated_at")
    .eq("record_type", type).eq("record_key", key).maybeSingle();
  if (error) throw error;
  return data;
}

async function upsertRecord(type: string, key: string, payload: Record<string, unknown>) {
  if (!db) throw new Error("Server database is not configured");
  const existing = await readExisting(type, key);
  const incomingAt = Number(payload.updatedAt) || Date.now();
  const existingAt = Number(existing?.payload?.updatedAt) || 0;
  // Never let an older device overwrite a newer copy.
  if (existing && existingAt > incomingAt) return;
  const saved = { ...payload, updatedAt: incomingAt };
  const { error } = await db.from(TABLE).upsert({
    record_type: type,
    record_key: key,
    payload: saved,
    updated_at: new Date().toISOString(),
  }, { onConflict: "record_type,record_key" });
  if (error) throw error;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: headers(origin) });
  if (!ALLOWED_ORIGIN) return reply({ error: "ALLOWED_ORIGIN is not configured" }, 500, origin);
  if (origin && origin !== ALLOWED_ORIGIN) return reply({ error: "Origin not allowed" }, 403, origin);
  if (!OWNER_SYNC_KEY || OWNER_SYNC_KEY.length < 32) return reply({ error: "Owner sync code is not configured correctly" }, 500, origin);
  if (!db) return reply({ error: "Server database is not configured" }, 500, origin);

  const bearer = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!safeEqual(bearer, OWNER_SYNC_KEY)) return reply({ error: "Invalid sync code" }, 401, origin);

  try {
    const url = new URL(req.url);
    const route = pathAfterFunction(url.pathname);

    if (req.method === "GET" && route.length === 1 && route[0] === "workouts") {
      const rawSince = Number(url.searchParams.get("since") || 0);
      const since = Number.isFinite(rawSince) && rawSince > 0 ? rawSince : 0;
      let query = db.from(TABLE).select("record_type, record_key, payload, updated_at").order("updated_at", { ascending: true });
      if (since > 0) query = query.gt("updated_at", new Date(since).toISOString());
      const { data, error } = await query;
      if (error) throw error;
      const rows = data || [];
      const workouts = rows.filter((r) => r.record_type === "workout").map((r) => r.payload);
      const settingRow = rows.filter((r) => r.record_type === "settings").sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
      return reply({ workouts, settings: settingRow?.payload || null, cursor: Date.now() - 5 * 60 * 1000, serverTime: Date.now() }, 200, origin);
    }

    if (req.method === "PUT" && route.length === 2 && route[0] === "workouts") {
      const key = decodeURIComponent(route[1]);
      const body = await req.json();
      if (!body || typeof body !== "object" || body.id !== key || typeof body.updatedAt !== "number") {
        return reply({ error: "Invalid workout payload" }, 400, origin);
      }
      await upsertRecord("workout", key, body);
      return reply(null, 204, origin);
    }

    if (req.method === "DELETE" && route.length === 2 && route[0] === "workouts") {
      const key = decodeURIComponent(route[1]);
      const old = await readExisting("workout", key);
      const now = Date.now();
      const previous = old?.payload && typeof old.payload === "object" ? old.payload : {};
      const payload = {
        ...previous,
        id: key,
        date: typeof previous.date === "string" ? previous.date : key.slice(0, 10),
        day: typeof previous.day === "string" ? previous.day : key.slice(11),
        v: 3,
        startedAt: previous.startedAt ?? null,
        finishedAt: previous.finishedAt ?? null,
        items: Array.isArray(previous.items) ? previous.items : [],
        abs: !!previous.abs,
        bw: Number(previous.bw) || 75,
        durOverride: previous.durOverride ?? null,
        deleted: true,
        updatedAt: now,
      };
      await upsertRecord("workout", key, payload);
      return reply(null, 204, origin);
    }

    if (req.method === "PUT" && route.length === 1 && route[0] === "settings") {
      const body = await req.json();
      if (!body || typeof body !== "object" || typeof body.updatedAt !== "number") {
        return reply({ error: "Invalid settings payload" }, 400, origin);
      }
      await upsertRecord("settings", "settings", body);
      return reply(null, 204, origin);
    }

    return reply({ error: "Not found" }, 404, origin);
  } catch (error) {
    console.error("my-training-sync error", error);
    return reply({ error: "Sync request failed" }, 500, origin);
  }
});
