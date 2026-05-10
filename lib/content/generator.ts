/**
 * AI content generation engine.
 * Uses OpenAI GPT-4o for all content generation.
 */

import type { BusinessProfile, ContentCategory, ContentPiece, PlatformPost, BlogIdea } from "./types";
import { CATEGORY_ROTATION } from "./types";
import { buildContentPrompt, buildTopicsPrompt } from "./prompts";

/* ── OpenAI client ────────────────────────────────────────────────────────── */

async function callOpenAI(prompt: string, jsonMode = true): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      temperature: 0.85,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${err}`);
  }

  const data = await res.json() as { choices: { message: { content: string } }[] };
  return data.choices[0].message.content;
}

/* ── Parse helpers ────────────────────────────────────────────────────────── */

function parseJSON<T>(raw: string): T {
  // strip markdown code fences if present
  const clean = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(clean) as T;
}

/* ── Topic planner ────────────────────────────────────────────────────────── */

export interface TopicPlan {
  day:      number;
  category: ContentCategory;
  topic:    string;
}

export async function generateTopics(
  profile: BusinessProfile,
  days    = 7,
): Promise<TopicPlan[]> {
  const prompt = buildTopicsPrompt(profile, days);
  const raw    = await callOpenAI(prompt);

  // The prompt returns an array, but json_object mode requires an object.
  // Parse the raw text directly.
  let parsed: TopicPlan[];
  try {
    parsed = parseJSON<TopicPlan[]>(raw);
  } catch {
    // Try wrapping if it came back as JSON object with a key
    const obj = parseJSON<{ topics?: TopicPlan[]; days?: TopicPlan[] }>(raw);
    parsed = obj.topics ?? obj.days ?? [];
  }

  // Fill in any gaps with rotation
  return parsed.map((t, i) => ({
    day:      t.day ?? i + 1,
    category: t.category ?? CATEGORY_ROTATION[i % CATEGORY_ROTATION.length],
    topic:    t.topic ?? "Brand tips and insights",
  }));
}

/* ── Single content piece generator ──────────────────────────────────────── */

export async function generateContentPiece(
  profile:  BusinessProfile,
  category: ContentCategory,
  topic:    string,
): Promise<Omit<ContentPiece, "id" | "profile_id" | "status" | "scheduled_at" | "posted_at" | "created_at">> {
  const prompt = buildContentPrompt(profile, category, topic);
  const raw    = await callOpenAI(prompt);

  const data = parseJSON<{
    posts:         PlatformPost[];
    blog_idea:     BlogIdea | null;
    email_subject: string;
    repurpose_tip: string;
  }>(raw);

  return {
    category,
    topic,
    posts:         data.posts         ?? [],
    blog_idea:     data.blog_idea     ?? null,
    email_subject: data.email_subject ?? "",
    repurpose_tip: data.repurpose_tip ?? "",
  };
}

/* ── Batch generator (full week) ──────────────────────────────────────────── */

export interface GeneratedDay {
  date:     string;   // ISO date
  plan:     TopicPlan;
  content:  Omit<ContentPiece, "id" | "profile_id" | "status" | "scheduled_at" | "posted_at" | "created_at">;
}

export async function generateWeek(
  profile:    BusinessProfile,
  startDate?: Date,
): Promise<GeneratedDay[]> {
  const start  = startDate ?? new Date();
  const topics = await generateTopics(profile, 7);

  // Generate all 7 pieces in parallel (rate-limit-aware: max 5 concurrent)
  const results = await Promise.allSettled(
    topics.map(async (plan, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);

      const content = await generateContentPiece(profile, plan.category, plan.topic);
      return { date: date.toISOString().slice(0, 10), plan, content } as GeneratedDay;
    }),
  );

  return results
    .filter((r): r is PromiseFulfilledResult<GeneratedDay> => r.status === "fulfilled")
    .map((r) => r.value);
}

/* ── Repurposer — turn one piece into a new platform format ──────────────── */

export async function repurposePost(
  profile:      BusinessProfile,
  originalPost: PlatformPost,
  targetPlatform: string,
): Promise<PlatformPost> {
  const prompt = `You are a social media expert. Repurpose this ${originalPost.platform} post for ${targetPlatform}.

ORIGINAL (${originalPost.platform}):
Hook: ${originalPost.hook}
Caption: ${originalPost.caption}
CTA: ${originalPost.cta}

Brand: ${profile.name} | Niche: ${profile.niche} | Tone: ${profile.tone}

Return ONLY a JSON object:
{
  "platform": "${targetPlatform}",
  "hook": "<new hook optimised for ${targetPlatform}>",
  "caption": "<full repurposed caption>",
  "cta": "<CTA>",
  "hashtags": [<array of strings>],
  "visual_note": "<visual direction>"
}`;

  const raw    = await callOpenAI(prompt);
  const parsed = parseJSON<PlatformPost>(raw);
  return { ...parsed, platform: targetPlatform as PlatformPost["platform"] };
}
