/**
 * Content automation — Supabase data layer.
 * Uses service-role client (server-side only).
 */

import { createClient } from "@supabase/supabase-js";
import type { BusinessProfile, ContentPiece, ContentStatus } from "./types";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );
}

/* ── Profiles ─────────────────────────────────────────────────────────────── */

export async function getProfiles(): Promise<BusinessProfile[]> {
  const { data, error } = await adminClient()
    .from("content_profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as BusinessProfile[];
}

export async function getProfile(id: string): Promise<BusinessProfile | null> {
  const { data, error } = await adminClient()
    .from("content_profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as unknown as BusinessProfile;
}

export async function getDefaultProfile(): Promise<BusinessProfile | null> {
  const { data } = await adminClient()
    .from("content_profiles")
    .select("*")
    .eq("is_default", true)
    .limit(1)
    .single();
  return data as unknown as BusinessProfile | null;
}

export async function upsertProfile(
  profile: Omit<BusinessProfile, "id" | "created_at" | "updated_at">,
  id?: string,
): Promise<BusinessProfile> {
  const payload = { ...profile, updated_at: new Date().toISOString() };
  const query = id
    ? adminClient().from("content_profiles").update(payload).eq("id", id).select().single()
    : adminClient().from("content_profiles").insert({ ...payload }).select().single();

  const { data, error } = await query;
  if (error) throw error;
  return data as unknown as BusinessProfile;
}

/* ── Content pieces ───────────────────────────────────────────────────────── */

export async function saveContentPiece(
  piece: Omit<ContentPiece, "id" | "created_at">,
): Promise<ContentPiece> {
  const { data, error } = await adminClient()
    .from("content_pieces")
    .insert(piece)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as ContentPiece;
}

export async function getContentPieces(opts: {
  profile_id?: string;
  status?:     ContentStatus;
  limit?:      number;
  offset?:     number;
}): Promise<{ pieces: ContentPiece[]; total: number }> {
  let q = adminClient()
    .from("content_pieces")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (opts.profile_id) q = q.eq("profile_id", opts.profile_id);
  if (opts.status)     q = q.eq("status", opts.status);
  if (opts.limit)      q = q.limit(opts.limit);
  if (opts.offset)     q = q.range(opts.offset, opts.offset + (opts.limit ?? 20) - 1);

  const { data, error, count } = await q;
  if (error) throw error;
  return { pieces: (data ?? []) as unknown as ContentPiece[], total: count ?? 0 };
}

export async function updateContentStatus(
  id:     string,
  status: ContentStatus,
  extra?: { scheduled_at?: string; posted_at?: string },
): Promise<void> {
  const { error } = await adminClient()
    .from("content_pieces")
    .update({ status, ...extra })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteContentPiece(id: string): Promise<void> {
  const { error } = await adminClient()
    .from("content_pieces")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function getContentStats(profile_id?: string): Promise<{
  total: number;
  draft: number;
  approved: number;
  scheduled: number;
  posted: number;
  byCategory: Record<string, number>;
}> {
  let q = adminClient().from("content_pieces").select("status, category");
  if (profile_id) q = q.eq("profile_id", profile_id);
  const { data } = await q;
  const rows = (data ?? []) as { status: string; category: string }[];

  const stats = { total: rows.length, draft: 0, approved: 0, scheduled: 0, posted: 0, byCategory: {} as Record<string, number> };
  for (const r of rows) {
    if (r.status === "draft" || r.status === "approved" || r.status === "scheduled" || r.status === "posted")
      stats[r.status]++;
    stats.byCategory[r.category] = (stats.byCategory[r.category] ?? 0) + 1;
  }
  return stats;
}
