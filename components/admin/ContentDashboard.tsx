"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  BusinessProfile, ContentPiece, ContentCategory,
  ContentStatus, Platform,
} from "@/lib/content/types";

/* ── constants ──────────────────────────────────────────────────────────── */

const PLATFORMS: Platform[] = ["tiktok", "instagram", "x", "facebook", "linkedin", "threads"];

const CATEGORY_META: Record<ContentCategory, { label: string; color: string; icon: string }> = {
  educational: { label: "Educational",  color: "bg-blue-100 text-blue-700",    icon: "📚" },
  promotional: { label: "Promotional",  color: "bg-violet-100 text-violet-700", icon: "🚀" },
  authority:   { label: "Authority",    color: "bg-amber-100 text-amber-700",   icon: "⭐" },
  engagement:  { label: "Engagement",  color: "bg-green-100 text-green-700",   icon: "💬" },
  lead_gen:    { label: "Lead Gen",     color: "bg-rose-100 text-rose-700",     icon: "🎯" },
};

const STATUS_META: Record<ContentStatus, { label: string; color: string }> = {
  draft:     { label: "Draft",     color: "bg-zinc-100 text-zinc-600" },
  approved:  { label: "Approved",  color: "bg-blue-100 text-blue-700" },
  scheduled: { label: "Scheduled", color: "bg-amber-100 text-amber-700" },
  posted:    { label: "Posted",    color: "bg-green-100 text-green-700" },
};

const PLATFORM_ICONS: Record<Platform, string> = {
  tiktok: "🎵", instagram: "📸", x: "✕", facebook: "👥", linkedin: "💼", threads: "🧵",
};

/* ── api helpers ────────────────────────────────────────────────────────── */

function useApi(secret: string) {
  const headers = { "x-admin-secret": secret, "Content-Type": "application/json" };

  return {
    get:    (url: string) => fetch(url, { headers }).then((r) => r.json()),
    post:   (url: string, body: unknown) => fetch(url, { method: "POST",  headers, body: JSON.stringify(body) }).then((r) => r.json()),
    patch:  (url: string, body: unknown) => fetch(url, { method: "PATCH", headers, body: JSON.stringify(body) }).then((r) => r.json()),
    del:    (url: string) => fetch(url, { method: "DELETE", headers }).then((r) => r.json()),
  };
}

/* ── sub-components ─────────────────────────────────────────────────────── */

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>{children}</span>;
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  );
}

/* ── Profile setup panel ────────────────────────────────────────────────── */

function ProfilePanel({
  secret, onSaved,
}: { secret: string; onSaved: (p: BusinessProfile) => void }) {
  const api    = useApi(secret);
  const [form, setForm] = useState({
    name: "CreaCurve", niche: "logo design, brand identity, visual branding",
    audience: "entrepreneurs, startups, small business owners",
    tone: "premium, professional yet approachable, results-driven",
    services: "logo design, brand kit, social media graphics, AI mockups",
    usp: "AI-powered professional branding in minutes, not weeks",
    cta_url: "https://creacurve.com",
    platforms: ["instagram", "x", "linkedin", "tiktok"] as Platform[],
    is_default: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  async function save() {
    setSaving(true);
    try {
      const payload = { ...form, services: form.services.split(",").map((s) => s.trim()) };
      const profile = await api.post("/api/content/profile", payload) as BusinessProfile;
      onSaved(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally { setSaving(false); }
  }

  const togglePlatform = (p: Platform) =>
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p],
    }));

  const field = (key: keyof typeof form, label: string, placeholder: string, multi = false) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{label}</label>
      {multi
        ? <textarea rows={2} value={form[key] as string} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            placeholder={placeholder}
            className="border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"/>
        : <input  value={form[key] as string} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            placeholder={placeholder}
            className="border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"/>
      }
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 flex flex-col gap-4">
      <h3 className="font-bold text-zinc-900 text-lg">Business Profile</h3>
      <p className="text-xs text-zinc-400">This teaches the AI about your brand so every post sounds like you.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("name",     "Brand Name",        "CreaCurve")}
        {field("niche",    "Niche / Industry",  "logo design, branding")}
        {field("audience", "Target Audience",   "entrepreneurs, small businesses")}
        {field("tone",     "Brand Voice / Tone","premium, professional, approachable")}
        {field("usp",      "Unique Value Prop", "What makes you different?", true)}
        {field("services", "Services (comma-separated)", "logo design, brand kit, mockups", true)}
        {field("cta_url",  "Primary CTA URL",   "https://yoursite.com")}
      </div>

      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Active Platforms</label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button key={p} onClick={() => togglePlatform(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                form.platforms.includes(p)
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-zinc-500 border-zinc-200 hover:border-violet-300"
              }`}>
              {PLATFORM_ICONS[p]} {p}
            </button>
          ))}
        </div>
      </div>

      <button onClick={save} disabled={saving}
        className="self-start bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2">
        {saving ? <><Spinner/> Saving…</> : saved ? "✓ Saved!" : "Save Profile"}
      </button>
    </div>
  );
}

/* ── Content piece card ─────────────────────────────────────────────────── */

function ContentCard({
  piece, secret, onDelete, onStatusChange,
}: { piece: ContentPiece; secret: string; onDelete: () => void; onStatusChange: (status: ContentStatus) => void }) {
  const api  = useApi(secret);
  const [expanded, setExpanded]   = useState(false);
  const [platform,  setPlatform]  = useState<Platform>(piece.posts[0]?.platform ?? "instagram");
  const [copying,   setCopying]   = useState("");

  const activePost = piece.posts.find((p) => p.platform === platform);
  const cat        = CATEGORY_META[piece.category];
  const st         = STATUS_META[piece.status];

  async function setStatus(status: ContentStatus) {
    await api.patch("/api/content/pieces", { id: piece.id, status });
    onStatusChange(status);
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopying(key);
    setTimeout(() => setCopying(""), 1500);
  }

  function copyAll() {
    if (!activePost) return;
    const text = [
      activePost.hook,
      "",
      activePost.caption,
      "",
      activePost.cta,
      "",
      activePost.hashtags.map((h) => `#${h}`).join(" "),
    ].join("\n");
    copy(text, "all");
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
      {/* header */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge className={cat.color}>{cat.icon} {cat.label}</Badge>
            <Badge className={st.color}>{st.label}</Badge>
          </div>
          <p className="font-semibold text-zinc-900 text-sm truncate">{piece.topic}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setExpanded((v) => !v)}
            className="text-xs text-violet-600 hover:text-violet-800 font-semibold">
            {expanded ? "Collapse" : "View"}
          </button>
          <button onClick={async () => { await api.del(`/api/content/pieces?id=${piece.id}`); onDelete(); }}
            className="text-xs text-zinc-400 hover:text-red-500 transition-colors">
            Delete
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-zinc-100">
          {/* platform tabs */}
          <div className="flex gap-0 border-b border-zinc-100 overflow-x-auto">
            {piece.posts.map((p) => (
              <button key={p.platform} onClick={() => setPlatform(p.platform)}
                className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
                  platform === p.platform
                    ? "border-violet-600 text-violet-700 bg-violet-50"
                    : "border-transparent text-zinc-500 hover:text-zinc-700"
                }`}>
                {PLATFORM_ICONS[p.platform]} {p.platform}
              </button>
            ))}
          </div>

          {activePost && (
            <div className="p-5 flex flex-col gap-4">
              {/* hook */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Hook</span>
                  <button onClick={() => copy(activePost.hook, "hook")}
                    className="text-[10px] text-violet-500 hover:text-violet-700">
                    {copying === "hook" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-sm font-semibold text-zinc-900 bg-violet-50 rounded-lg px-3 py-2">
                  {activePost.hook}
                </p>
              </div>

              {/* caption */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Caption</span>
                  <button onClick={() => copy(activePost.caption, "caption")}
                    className="text-[10px] text-violet-500 hover:text-violet-700">
                    {copying === "caption" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-xs text-zinc-700 bg-zinc-50 rounded-lg px-3 py-2 whitespace-pre-wrap leading-relaxed">
                  {activePost.caption}
                </p>
              </div>

              {/* cta */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">CTA</span>
                <p className="text-xs font-semibold text-violet-700 bg-violet-50 rounded-lg px-3 py-2">
                  {activePost.cta}
                </p>
              </div>

              {/* hashtags */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Hashtags</span>
                <div className="flex flex-wrap gap-1.5">
                  {activePost.hashtags.map((h) => (
                    <span key={h} onClick={() => copy(`#${h}`, h)}
                      className="text-[11px] bg-zinc-100 hover:bg-violet-100 text-zinc-600 hover:text-violet-700 px-2 py-0.5 rounded-md cursor-pointer transition-colors">
                      #{h}
                    </span>
                  ))}
                </div>
              </div>

              {activePost.visual_note && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Visual Direction</span>
                  <p className="text-xs text-zinc-500 italic">{activePost.visual_note}</p>
                </div>
              )}

              {/* copy all */}
              <button onClick={copyAll}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
                {copying === "all" ? "✓ Copied to clipboard!" : "Copy Full Post"}
              </button>
            </div>
          )}

          {/* blog idea */}
          {piece.blog_idea && (
            <div className="border-t border-zinc-100 p-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Blog Idea</span>
              <p className="font-semibold text-sm text-zinc-900 mb-1">{piece.blog_idea.title}</p>
              <p className="text-xs text-zinc-500 mb-2">{piece.blog_idea.meta_desc}</p>
              <div className="flex flex-wrap gap-1">
                {piece.blog_idea.target_kw.map((kw) => (
                  <span key={kw} className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">{kw}</span>
                ))}
              </div>
            </div>
          )}

          {/* email subject */}
          {piece.email_subject && (
            <div className="border-t border-zinc-100 px-5 py-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Email Subject</span>
                <p className="text-xs font-medium text-zinc-800">{piece.email_subject}</p>
              </div>
              <button onClick={() => copy(piece.email_subject, "email")}
                className="text-[10px] text-violet-500 hover:text-violet-700 shrink-0">
                {copying === "email" ? "Copied!" : "Copy"}
              </button>
            </div>
          )}

          {/* repurpose tip */}
          {piece.repurpose_tip && (
            <div className="border-t border-zinc-100 px-5 py-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">♻ Repurpose Tip</span>
              <p className="text-xs text-zinc-600">{piece.repurpose_tip}</p>
            </div>
          )}

          {/* status actions */}
          <div className="border-t border-zinc-100 px-5 py-3 flex gap-2 flex-wrap">
            {piece.status === "draft"     && <button onClick={() => setStatus("approved")}  className="text-xs bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-lg">Approve</button>}
            {piece.status === "approved"  && <button onClick={() => setStatus("scheduled")} className="text-xs bg-amber-500 text-white font-semibold px-3 py-1.5 rounded-lg">Mark Scheduled</button>}
            {piece.status === "scheduled" && <button onClick={() => setStatus("posted")}    className="text-xs bg-green-600 text-white font-semibold px-3 py-1.5 rounded-lg">Mark Posted</button>}
            {piece.status !== "draft"     && <button onClick={() => setStatus("draft")}     className="text-xs bg-zinc-200 text-zinc-700 font-semibold px-3 py-1.5 rounded-lg">Back to Draft</button>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Generate panel ─────────────────────────────────────────────────────── */

function GeneratePanel({
  secret, profiles, onGenerated,
}: { secret: string; profiles: BusinessProfile[]; onGenerated: () => void }) {
  const api     = useApi(secret);
  const [mode,       setMode]       = useState<"single" | "week">("week");
  const [profileId,  setProfileId]  = useState(profiles[0]?.id ?? "");
  const [category,   setCategory]   = useState<ContentCategory>("educational");
  const [topic,      setTopic]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [msg,        setMsg]        = useState("");

  async function generate() {
    if (!profileId) return;
    setLoading(true); setMsg("");
    try {
      if (mode === "week") {
        const r = await api.post("/api/content/week", { profile_id: profileId }) as { generated: number };
        setMsg(`✓ Generated ${r.generated} posts for the week!`);
      } else {
        if (!topic) { setMsg("Enter a topic."); return; }
        await api.post("/api/content/generate", { profile_id: profileId, category, topic });
        setMsg("✓ Post generated!");
        setTopic("");
      }
      onGenerated();
    } catch (e) {
      setMsg(`Error: ${String(e)}`);
    } finally { setLoading(false); }
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 flex flex-col gap-4">
      <h3 className="font-bold text-zinc-900 text-lg">Generate Content</h3>

      {/* profile selector */}
      {profiles.length > 1 && (
        <div>
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Profile</label>
          <select value={profileId} onChange={(e) => setProfileId(e.target.value)}
            className="border border-zinc-200 rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-violet-400">
            {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      )}

      {/* mode toggle */}
      <div className="flex rounded-xl border border-zinc-200 overflow-hidden w-fit">
        {(["week", "single"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 text-sm font-semibold transition-colors ${
              mode === m ? "bg-violet-600 text-white" : "bg-white text-zinc-500 hover:bg-zinc-50"
            }`}>
            {m === "week" ? "📅 Full Week (7 posts)" : "✏ Single Post"}
          </button>
        ))}
      </div>

      {mode === "single" && (
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Category</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CATEGORY_META) as ContentCategory[]).map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    category === c ? "bg-violet-600 text-white border-violet-600" : "bg-white text-zinc-500 border-zinc-200 hover:border-violet-300"
                  }`}>
                  {CATEGORY_META[c].icon} {CATEGORY_META[c].label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Topic</label>
            <input value={topic} onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 5 signs your logo is hurting your brand"
              className="border border-zinc-200 rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-violet-400"/>
          </div>
        </div>
      )}

      {msg && <p className={`text-xs font-medium ${msg.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>{msg}</p>}

      <button onClick={generate} disabled={loading || !profileId}
        className="self-start bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2">
        {loading ? <><Spinner/> Generating…</> : "Generate with AI"}
      </button>

      {loading && mode === "week" && (
        <p className="text-xs text-zinc-400">Generating 7 posts for all platforms… this takes ~30 seconds.</p>
      )}
    </div>
  );
}

/* ── Main dashboard ─────────────────────────────────────────────────────── */

interface Props { secret: string }

export function ContentDashboard({ secret }: Props) {
  const api = useApi(secret);
  const [tab,      setTab]      = useState<"content" | "generate" | "profile">("content");
  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [pieces,   setPieces]   = useState<ContentPiece[]>([]);
  const [total,    setTotal]    = useState(0);
  const [filter,   setFilter]   = useState<ContentStatus | "all">("all");
  const [loading,  setLoading]  = useState(false);
  const [page,     setPage]     = useState(0);
  const PAGE = 12;

  const loadProfiles = useCallback(async () => {
    const data = await api.get("/api/content/profile") as BusinessProfile[];
    setProfiles(data ?? []);
  }, [api]);

  const loadPieces = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(PAGE), offset: String(page * PAGE) });
    if (filter !== "all") params.set("status", filter);
    const data = await api.get(`/api/content/pieces?${params}`) as { pieces: ContentPiece[]; total: number };
    setPieces(data.pieces ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [api, filter, page]);

  useEffect(() => { loadProfiles(); }, [loadProfiles]);
  useEffect(() => { if (tab === "content") loadPieces(); }, [tab, loadPieces]);

  return (
    <div className="flex flex-col gap-6">
      {/* tabs */}
      <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl w-fit">
        {([["content", "📋 Content"], ["generate", "✨ Generate"], ["profile", "⚙ Profile"]] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t ? "bg-white shadow text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* content library */}
      {tab === "content" && (
        <div className="flex flex-col gap-4">
          {/* filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-zinc-500 font-semibold">{total} posts</span>
            <div className="flex gap-1">
              {(["all", "draft", "approved", "scheduled", "posted"] as const).map((s) => (
                <button key={s} onClick={() => { setFilter(s); setPage(0); }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    filter === s ? "bg-violet-600 text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                  }`}>
                  {s === "all" ? "All" : STATUS_META[s].label}
                </button>
              ))}
            </div>
            <button onClick={loadPieces} className="ml-auto text-xs text-violet-600 hover:text-violet-800 font-semibold">
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Spinner/></div>
          ) : pieces.length === 0 ? (
            <div className="text-center py-16 text-zinc-400">
              <p className="text-4xl mb-3">✨</p>
              <p className="font-semibold">No content yet.</p>
              <p className="text-sm mt-1">Go to Generate tab and create your first week of posts.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pieces.map((piece) => (
                <ContentCard key={piece.id} piece={piece} secret={secret}
                  onDelete={loadPieces}
                  onStatusChange={() => loadPieces()}
                />
              ))}
            </div>
          )}

          {/* pagination */}
          {total > PAGE && (
            <div className="flex items-center justify-center gap-3">
              <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}
                className="px-4 py-1.5 text-sm font-semibold border border-zinc-200 rounded-lg disabled:opacity-40">
                ← Prev
              </button>
              <span className="text-sm text-zinc-500">{page + 1} / {Math.ceil(total / PAGE)}</span>
              <button disabled={(page + 1) * PAGE >= total} onClick={() => setPage((p) => p + 1)}
                className="px-4 py-1.5 text-sm font-semibold border border-zinc-200 rounded-lg disabled:opacity-40">
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "generate" && (
        <GeneratePanel
          secret={secret}
          profiles={profiles}
          onGenerated={() => { setTab("content"); loadPieces(); }}
        />
      )}

      {tab === "profile" && (
        <ProfilePanel
          secret={secret}
          onSaved={(p) => { setProfiles((prev) => [p, ...prev.filter((x) => x.id !== p.id)]); setTab("generate"); }}
        />
      )}
    </div>
  );
}
