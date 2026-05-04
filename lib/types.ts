export type ProjectStatus = "pending" | "processing" | "complete" | "failed";

export interface BrandColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  name: string;
  usage: string;
}

export interface FontPairing {
  heading: string;
  body: string;
  mood: string;
  googleFontsUrl: string;
}

export interface BrandVoice {
  tone: string;
  vocabulary: string[];
  examples: string[];
}

export interface BrandData {
  primaryColors: BrandColor[];
  secondaryColors: BrandColor[];
  accentColors: BrandColor[];
  style: "minimal" | "bold" | "vintage" | "playful" | "luxury" | "tech" | "organic";
  personality: string[];
  industry: string;
  targetAudience: string;
  fontPairings: FontPairing[];
  brandVoice: BrandVoice;
  taglineSuggestions: string[];
  designPrinciples: string[];
}

export interface Project {
  id: string;
  user_id: string;
  logo_url: string;
  original_filename: string | null;
  brand_name: string | null;
  status: ProjectStatus;
  brand_data: BrandData | null;
  zip_url: string | null;
  progress: number;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Asset {
  id: string;
  project_id: string;
  category: string;
  name: string;
  url: string;
  thumbnail_url: string | null;
  width: number | null;
  height: number | null;
  file_size: number | null;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  stripe_session_id: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "refunded";
  project_id: string | null;
  created_at: string;
}

export type AssetCategory =
  | "logos"
  | "stationery"
  | "hospitality"
  | "merchandise"
  | "packaging"
  | "signage"
  | "social"
  | "web"
  | "presentations"
  | "documentation";

export const ASSET_CATEGORIES: Record<AssetCategory, { label: string; icon: string; count: number }> = {
  logos: { label: "Logo Variations", icon: "✦", count: 8 },
  stationery: { label: "Stationery", icon: "📄", count: 10 },
  hospitality: { label: "Hospitality & Retail", icon: "🍽️", count: 8 },
  merchandise: { label: "Merchandise", icon: "👕", count: 8 },
  packaging: { label: "Packaging", icon: "📦", count: 4 },
  signage: { label: "Signage & Print", icon: "🏪", count: 6 },
  social: { label: "Social Media", icon: "📱", count: 13 },
  web: { label: "Web & Digital", icon: "💻", count: 6 },
  presentations: { label: "Presentations", icon: "🎤", count: 3 },
  documentation: { label: "Brand Docs", icon: "📚", count: 4 },
};
