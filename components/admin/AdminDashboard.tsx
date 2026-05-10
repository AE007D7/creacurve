"use client";

import { useState, useEffect, useCallback } from "react";
import { ContentDashboard } from "./ContentDashboard";

interface DailyPoint { date: string; count: number }
interface Stats {
  total:     number;
  today:     number;
  thisMonth: number;
  daily:     DailyPoint[];
}

/* ── tiny helpers ─────────────────────────────────────────────────────────── */

function fmt(n: number) { return n.toLocaleString(); }

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{label}</span>
      <span className="text-4xl font-black text-zinc-900">{value}</span>
      {sub && <span className="text-xs text-zinc-400">{sub}</span>}
    </div>
  );
}

function BarChart({ daily }: { daily: DailyPoint[] }) {
  const max = Math.max(...daily.map((d) => d.count), 1);
  const last7 = daily.slice(-7);

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-6">
        Last 7 days — logos generated
      </p>
      <div className="flex items-end gap-3 h-36">
        {last7.map(({ date, count }) => {
          const pct = Math.round((count / max) * 100);
          const label = new Date(date + "T00:00:00").toLocaleDateString("en", { weekday: "short" });
          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-zinc-700">{count || ""}</span>
              <div className="w-full rounded-md bg-violet-100 flex items-end" style={{ height: "100px" }}>
                <div
                  className="w-full rounded-md bg-violet-600 transition-all duration-500"
                  style={{ height: `${Math.max(pct, count > 0 ? 4 : 0)}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-400">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniChart({ daily }: { daily: DailyPoint[] }) {
  const max = Math.max(...daily.map((d) => d.count), 1);
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
        Last 30 days
      </p>
      <div className="flex items-end gap-[3px] h-16">
        {daily.map(({ date, count }) => {
          const pct = Math.round((count / max) * 100);
          return (
            <div
              key={date}
              title={`${date}: ${count}`}
              className="flex-1 rounded-sm bg-violet-600 opacity-70 hover:opacity-100 transition-opacity"
              style={{ height: `${Math.max(pct, count > 0 ? 6 : 2)}%`, minHeight: count > 0 ? "3px" : "2px" }}
            />
          );
        })}
      </div>
    </div>
  );
}

function ExternalLink({ href, label, sub }: { href: string; label: string; sub: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 hover:border-violet-300 hover:shadow-md transition-all group"
    >
      <div>
        <p className="font-semibold text-zinc-800 group-hover:text-violet-700 transition-colors">{label}</p>
        <p className="text-xs text-zinc-400">{sub}</p>
      </div>
      <span className="text-zinc-300 group-hover:text-violet-500 transition-colors text-xl">→</span>
    </a>
  );
}

/* ── main component ──────────────────────────────────────────────────────── */

export function AdminDashboard() {
  const [secret,   setSecret]   = useState("");
  const [authed,   setAuthed]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [stats,    setStats]    = useState<Stats | null>(null);
  const [lastSync, setLastSync] = useState<string>("");

  const fetchStats = useCallback(async (s: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/stats?secret=${encodeURIComponent(s)}`);
      if (res.status === 401) { setError("Wrong password."); setAuthed(false); return; }
      if (!res.ok) throw new Error("Server error");
      const data = await res.json() as Stats;
      setStats(data);
      setAuthed(true);
      setLastSync(new Date().toLocaleTimeString());
    } catch {
      setError("Could not load stats. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh every 60 s while logged in
  useEffect(() => {
    if (!authed) return;
    const id = setInterval(() => fetchStats(secret), 60_000);
    return () => clearInterval(id);
  }, [authed, secret, fetchStats]);

  /* ── login screen ───────────────────────────────────────────────────── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-10 w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h1 className="text-2xl font-black text-zinc-900">Admin</h1>
            <p className="text-sm text-zinc-400 mt-1">CreaCurve dashboard</p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); fetchStats(secret); }}
            className="flex flex-col gap-4"
          >
            <input
              type="password"
              placeholder="Admin secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading || !secret}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? "Checking…" : "Enter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ── dashboard ──────────────────────────────────────────────────────── */
  const [adminTab, setAdminTab] = useState<"stats" | "content">("stats");

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* header */}
      <header className="bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
            </svg>
          </div>
          <span className="font-black text-zinc-900 text-lg hidden sm:block">CreaCurve Admin</span>
          {/* nav tabs */}
          <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl">
            {([["stats", "📊 Stats"], ["content", "✨ Content"]] as const).map(([t, label]) => (
              <button key={t} onClick={() => setAdminTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  adminTab === t ? "bg-white shadow text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastSync && <span className="text-xs text-zinc-400 hidden sm:block">Updated {lastSync}</span>}
          {adminTab === "stats" && (
            <button onClick={() => fetchStats(secret)} disabled={loading}
              className="text-xs bg-violet-50 hover:bg-violet-100 text-violet-700 font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
              {loading ? "…" : "Refresh"}
            </button>
          )}
          <button onClick={() => { setAuthed(false); setStats(null); setSecret(""); }}
            className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors">
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">

        {adminTab === "stats" && (
          <>
            {/* stat cards */}
            {stats && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard label="Logos generated today"      value={fmt(stats.today)}     />
                  <StatCard label="This month"                 value={fmt(stats.thisMonth)}  />
                  <StatCard label="All-time total"             value={fmt(stats.total)}      />
                </div>
                <BarChart daily={stats.daily} />
                <MiniChart daily={stats.daily} />
              </>
            )}

            {/* external links */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">External tools</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ExternalLink href="https://vercel.com/dashboard"              label="Vercel Analytics"        sub="Page views, unique visitors, top pages"      />
                <ExternalLink href="https://search.google.com/search-console"  label="Google Search Console"   sub="Clicks, impressions, keyword rankings"       />
                <ExternalLink href="https://dashboard.stripe.com"              label="Stripe Dashboard"         sub="Revenue, payments, customers"                />
                <ExternalLink href="https://console.upstash.com"               label="Upstash Console"          sub="Redis usage and logo stat raw keys"           />
              </div>
            </div>

            {stats && stats.total === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-amber-800">
                <p className="font-bold mb-1">No stats yet</p>
                <p>Add <code className="bg-amber-100 px-1 rounded">UPSTASH_REDIS_REST_URL</code> and <code className="bg-amber-100 px-1 rounded">UPSTASH_REDIS_REST_TOKEN</code> to your env vars.</p>
              </div>
            )}
          </>
        )}

        {adminTab === "content" && <ContentDashboard secret={secret} />}

      </main>
    </div>
  );
}
