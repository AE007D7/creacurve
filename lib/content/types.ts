export type Platform = "tiktok" | "instagram" | "x" | "facebook" | "linkedin" | "threads";

export type ContentCategory =
  | "educational"    // tips, how-tos, industry insights
  | "promotional"    // services, offers, direct CTAs
  | "authority"      // results, case studies, social proof
  | "engagement"     // questions, polls, relatable content
  | "lead_gen";      // free value, opt-ins, lead magnets

export type ContentStatus = "draft" | "approved" | "scheduled" | "posted";

export interface BusinessProfile {
  id:           string;
  name:         string;          // brand/business name
  niche:        string;          // e.g. "logo design, brand identity"
  audience:     string;          // e.g. "entrepreneurs, small business owners"
  tone:         string;          // e.g. "professional yet approachable, premium"
  services:     string[];        // e.g. ["logo design", "brand kits", "social media graphics"]
  usp:          string;          // unique selling proposition
  cta_url:      string;          // primary CTA link (website/Fiverr/etc.)
  platforms:    Platform[];
  created_at:   string;
  updated_at:   string;
}

export interface PlatformPost {
  platform:  Platform;
  hook:      string;   // first line / opening hook
  caption:   string;   // full post body
  cta:       string;   // call-to-action line
  hashtags:  string[]; // platform-optimised hashtags
  /** For Instagram/TikTok: visual direction or b-roll description */
  visual_note?: string;
}

export interface BlogIdea {
  title:       string;
  slug:        string;
  meta_desc:   string;
  outline:     string[];   // H2/H3 sections
  target_kw:   string[];   // primary + LSI keywords
}

export interface ContentPiece {
  id:           string;
  profile_id:   string;
  category:     ContentCategory;
  topic:        string;
  posts:        PlatformPost[];
  blog_idea:    BlogIdea | null;
  email_subject:string;
  repurpose_tip:string;      // e.g. "Turn this into a carousel: ..."
  status:       ContentStatus;
  scheduled_at: string | null;
  posted_at:    string | null;
  created_at:   string;
}

export interface ContentCalendar {
  week_start:  string;   // ISO date
  profile_id:  string;
  days: {
    date:     string;
    category: ContentCategory;
    topic:    string;
    piece_id: string | null;
  }[];
}

/** Rotation used when generating a week of content */
export const CATEGORY_ROTATION: ContentCategory[] = [
  "educational",
  "promotional",
  "engagement",
  "authority",
  "lead_gen",
  "educational",
  "promotional",
];
