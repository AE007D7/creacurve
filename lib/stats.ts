/**
 * Lightweight stats tracking for CreaCurve admin dashboard.
 * Stores counts in Upstash Redis. All writes are fire-and-forget
 * so they never block the main API response.
 */

import { getRedis } from "@/lib/redis";

function todayKey()  { return `logos:day:${new Date().toISOString().slice(0, 10)}`; }
function monthKey()  { return `logos:month:${new Date().toISOString().slice(0, 7)}`; }

/** Call after a successful logo ZIP is generated. */
export async function trackLogoGenerated(): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await Promise.all([
      redis.incr("logos:total"),
      redis.incr(todayKey()),
      redis.incr(monthKey()),
    ]);
  } catch { /* never block the response */ }
}

export interface LogoStats {
  total:     number;
  today:     number;
  thisMonth: number;
  /** last 30 days: [{date:"2026-05-10", count:3}, ...] sorted ascending */
  daily:     { date: string; count: number }[];
}

export async function getLogoStats(): Promise<LogoStats> {
  const redis = getRedis();
  if (!redis) return { total: 0, today: 0, thisMonth: 0, daily: [] };

  // Build last-30-days key list
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const keys = days.map((d) => `logos:day:${d}`);

  const [total, thisMonth, ...dailyRaw] = await Promise.all([
    redis.get<number>("logos:total"),
    redis.get<number>(monthKey()),
    ...keys.map((k) => redis.get<number>(k)),
  ]);

  const daily = days.map((date, i) => ({ date, count: Number(dailyRaw[i] ?? 0) }));
  const today = daily[daily.length - 1]?.count ?? 0;

  return {
    total:     Number(total ?? 0),
    today,
    thisMonth: Number(thisMonth ?? 0),
    daily,
  };
}
