import type { BusinessProfile, ContentCategory, Platform } from "./types";

/* ── Platform tone guides ─────────────────────────────────────────────────── */

export const PLATFORM_GUIDES: Record<Platform, string> = {
  tiktok:    "Short punchy sentences. Strong first-line hook (make them stop scrolling). Casual, energetic tone. 3–5 relevant hashtags.",
  instagram: "Story-driven caption. Emojis for visual breaks. First line is the hook (above the fold). 8–12 hashtags mix niche + broad.",
  x:         "Under 280 characters. Sharp, opinionated, quotable. No fluff. 1–2 hashtags max or none.",
  facebook:  "Conversational and community-focused. Longer is ok. Ask a question at the end. 2–3 hashtags.",
  linkedin:  "Professional tone. Line-break storytelling format. Start with a bold statement or result. End with takeaway + CTA. 3–5 hashtags.",
  threads:   "Casual, conversational, raw. Like a tweet but more personal. No more than 2 hashtags.",
};

/* ── Category intent guides ───────────────────────────────────────────────── */

export const CATEGORY_GUIDES: Record<ContentCategory, string> = {
  educational: "Teach something genuinely valuable. Position the brand as the expert. No direct selling — let the value do the selling.",
  promotional: "Sell clearly and confidently. Show the offer, price anchor, transformation, urgency. Direct CTA.",
  authority:   "Social proof, results, transformations. 'We helped X achieve Y.' Real numbers when possible. Build trust.",
  engagement:  "Ask a question, create a poll, relatable scenario, 'this or that'. Goal: maximum replies and shares.",
  lead_gen:    "Give away free value (tip, template, checklist, guide) in exchange for attention or a DM/click. Soft sell.",
};

/* ── Master content generation prompt ────────────────────────────────────── */

export function buildContentPrompt(
  profile:  BusinessProfile,
  category: ContentCategory,
  topic:    string,
): string {
  const platformList = profile.platforms.join(", ");

  return `You are a world-class social media strategist and copywriter specialising in ${profile.niche}.

BUSINESS CONTEXT:
- Brand: ${profile.name}
- Niche: ${profile.niche}
- Target audience: ${profile.audience}
- Services: ${profile.services.join(", ")}
- USP: ${profile.usp}
- Brand tone: ${profile.tone}
- Primary CTA URL: ${profile.cta_url}
- Active platforms: ${platformList}

CONTENT BRIEF:
- Category: ${category.toUpperCase()}
- Category goal: ${CATEGORY_GUIDES[category]}
- Topic: ${topic}

YOUR TASK:
Generate a complete content piece for this topic. Return a single valid JSON object with this exact structure:

{
  "posts": [
    ${profile.platforms.map((p) => `{
      "platform": "${p}",
      "hook": "<single attention-grabbing first line, optimised for ${p}>",
      "caption": "<full post body, formatted for ${p} — ${PLATFORM_GUIDES[p]}>",
      "cta": "<clear call-to-action line>",
      "hashtags": [<array of strings without #>],
      "visual_note": "<brief note on ideal visual or video direction for this post>"
    }`).join(",\n    ")}
  ],
  "blog_idea": {
    "title": "<SEO-optimised blog post title>",
    "slug": "<kebab-case-url-slug>",
    "meta_desc": "<155-char meta description>",
    "outline": ["<H2 section 1>", "<H2 section 2>", "<H2 section 3>", "<H2 section 4>", "<H2 section 5>"],
    "target_kw": ["<primary keyword>", "<lsi keyword 1>", "<lsi keyword 2>", "<lsi keyword 3>"]
  },
  "email_subject": "<compelling email subject line for this topic>",
  "repurpose_tip": "<one concrete tip on how to repurpose this content into another format>"
}

QUALITY RULES:
1. Every hook must make someone STOP scrolling — use curiosity, bold claim, or contrarian angle
2. CTAs must be specific: not "check the link" but "DM me 'LOGO' and I'll send you a free brand audit"
3. LinkedIn and Facebook posts should use line breaks for readability (\\n\\n between paragraphs)
4. TikTok captions should feel like a script for a 30-60s video
5. Hashtags must be relevant and a mix of niche (under 100K) and broad (over 1M) for reach
6. Blog title must target a real search query someone would Google
7. Keep brand voice consistent: ${profile.tone}

Return ONLY the JSON object. No markdown, no explanation.`;
}

/* ── Topic generation prompt ──────────────────────────────────────────────── */

export function buildTopicsPrompt(profile: BusinessProfile, days: number): string {
  return `You are a content strategist for ${profile.name}, a ${profile.niche} business targeting ${profile.audience}.

Generate ${days} unique, high-performing content topics — one per day — for a content calendar.
The rotation must follow this pattern: educational, promotional, engagement, authority, lead_gen, educational, promotional (repeat).

Each topic must be:
- Specific (not generic like "tips for success")
- Relevant to ${profile.niche} and ${profile.audience}
- Timely or evergreen
- Designed to drive the goal of that day's category

Return ONLY a JSON array of ${days} objects:
[
  { "day": 1, "category": "educational", "topic": "<specific topic>" },
  { "day": 2, "category": "promotional", "topic": "<specific topic>" },
  ...
]

Categories in order: educational, promotional, engagement, authority, lead_gen, educational, promotional, (then repeat).
No markdown. No explanation. Only the JSON array.`;
}
