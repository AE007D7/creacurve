import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { LOGO_ANALYSIS_PROMPT, LOGO_ANALYSIS_SYSTEM } from "@/lib/prompts/logo-analysis";
import {
  createLogoVariations,
  createSocialVariant,
  createFaviconSet,
  createThumbnail,
} from "@/lib/render/sharp-pipeline";
import { buildBrandGuidelinesPDF } from "@/lib/render/pdf-builder";
import {
  makeBrandCtx,
  makeBusinessCard,
  makeLetterhead,
  makeEmailSignature,
  makeInvoice,
  makeInstagramPost,
  makeInstagramStory,
  makeLinkedInBanner,
  makeTwitterHeader,
  makeYoutubeBanner,
  makeTshirtMockup,
  makeCoffeeMug,
  makeToteBag,
  makeStickerSheet,
  makeStorefrontSign,
  makeBillboard,
  makeRollupBanner,
  makeWebsiteHero,
  makeMobileApp,
  makeProductBox,
  makeShoppingBag,
  makePitchDeck,
  makeNewsletter,
} from "@/lib/render/dev-assets";
import { extractLogoColors, mergeExtractedColors } from "@/lib/render/color-extractor";
import type { BrandData } from "@/lib/types";

export const maxDuration = 300;

const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project") &&
  process.env.SUPABASE_SERVICE_KEY
);

async function readLocalProject(projectId: string) {
  const file = path.join(process.cwd(), ".dev-data", `${projectId}.json`);
  return JSON.parse(await readFile(file, "utf-8"));
}

async function updateLocalProject(projectId: string, updates: Record<string, unknown>) {
  const file = path.join(process.cwd(), ".dev-data", `${projectId}.json`);
  try {
    const data = JSON.parse(await readFile(file, "utf-8"));
    await writeFile(file, JSON.stringify({ ...data, ...updates }, null, 2));
  } catch { /* ignore */ }
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-internal-secret");
  if (secret !== (process.env.INTERNAL_API_SECRET || "creacurve-internal")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { projectId, devMode } = body;
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

  const useLocal = devMode || !isSupabaseConfigured;

  let project: Record<string, unknown>;
  if (useLocal) {
    try { project = await readLocalProject(projectId); }
    catch { return NextResponse.json({ error: "Project not found" }, { status: 404 }); }
  } else {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
    const { data, error } = await supabase.from("projects").select("*").eq("id", projectId).single();
    if (error || !data) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (data.status === "complete") return NextResponse.json({ message: "Already complete" });
    project = data;
  }

  if (useLocal) {
    runDevPipeline(projectId, project, updateLocalProject).catch((err) => {
      console.error("[Generate] Dev pipeline failed:", err);
      updateLocalProject(projectId, { status: "failed", error_message: String(err) });
    });
  } else {
    const { BrandOrchestrator } = await import("@/lib/orchestrator");
    const orchestrator = new BrandOrchestrator(projectId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orchestrator.run(project as any).catch(console.error);
  }

  return NextResponse.json({ message: "Generation started", projectId });
}

/* ─── Types ───────────────────────────────────────────────────────────── */

interface DevAsset {
  id: string;
  category: string;
  name: string;
  url: string;
  thumbnail_url: string;
  width: number | null;
  height: number | null;
  file_size: number;
}

/* ─── Dev pipeline ────────────────────────────────────────────────────── */

async function runDevPipeline(
  projectId: string,
  project: Record<string, unknown>,
  update: (id: string, data: Record<string, unknown>) => Promise<void>
) {
  await update(projectId, { status: "processing", progress: 5 });

  // ── 1. Fetch logo buffer ───────────────────────────────────────────────
  const logoRes = await fetch(project.logo_url as string);
  if (!logoRes.ok) throw new Error(`Failed to fetch logo: ${logoRes.status}`);
  const logoBuffer = Buffer.from(await logoRes.arrayBuffer());

  // ── 2. Extract real colors from logo pixels ────────────────────────────
  let pixelColors: Awaited<ReturnType<typeof extractLogoColors>> = [];
  try {
    pixelColors = await extractLogoColors(logoBuffer);
    console.log(`[Dev] Pixel extraction: ${pixelColors.length} colors — ${pixelColors.map(c => c.hex).join(", ")}`);
  } catch (err) {
    console.warn("[Dev] Pixel color extraction failed:", err);
  }

  // ── 3. Claude brand analysis (for style, personality, taglines, etc.) ─
  let brandData: BrandData | null = null;
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const res = await client.messages.create({
        model: "claude-opus-4-7",
        max_tokens: 2000,
        system: LOGO_ANALYSIS_SYSTEM,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "url", url: project.logo_url as string } },
            { type: "text", text: LOGO_ANALYSIS_PROMPT },
          ],
        }],
      });
      const text = res.content[0].type === "text" ? res.content[0].text : "";
      const m = text.match(/\{[\s\S]*\}/);
      if (m) brandData = JSON.parse(m[0]);
    } catch (err) {
      console.warn("[Dev] Brand analysis failed, using mock:", err);
    }
  }
  if (!brandData) brandData = getMockBrandData(project.brand_name as string || "Brand");

  // ── 4. Merge: pixel colors OVERRIDE Claude's colors ───────────────────
  // Claude provides style/personality/taglines; pixels provide exact HEX values
  if (pixelColors.length > 0) {
    const merged = mergeExtractedColors(pixelColors, brandData);
    brandData = { ...brandData, ...merged };
  }

  const ctx = makeBrandCtx(project.brand_name as string || "Brand", brandData, (project.tagline as string) || "");
  await update(projectId, { progress: 12, brand_data: brandData });

  // ── 3. Output directory ────────────────────────────────────────────────
  const outDir = path.join(process.cwd(), "public", "uploads", projectId);
  await mkdir(outDir, { recursive: true });

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const assets: DevAsset[] = [];

  async function save(
    id: string,
    category: string,
    name: string,
    buf: Buffer,
    ext = "png",
    w: number | null = null,
    h: number | null = null
  ) {
    const file = path.join(outDir, `${id}.${ext}`);
    const thumbFile = path.join(outDir, `${id}-thumb.png`);
    await writeFile(file, buf);

    let thumbBuf: Buffer;
    if (ext === "pdf") {
      // PDF thumbnail — a simple branded card
      thumbBuf = await makeBusinessCard(logoBuffer, 400, 230, ctx);
    } else {
      thumbBuf = await createThumbnail(buf, 400);
    }
    await writeFile(thumbFile, thumbBuf);

    assets.push({
      id, category, name,
      url: `${siteUrl}/uploads/${projectId}/${id}.${ext}`,
      thumbnail_url: `${siteUrl}/uploads/${projectId}/${id}-thumb.png`,
      width: w, height: h, file_size: buf.length,
    });

    const prog = Math.round(12 + (assets.length / TOTAL_ASSETS) * 80);
    await update(projectId, { progress: Math.min(prog, 92), assets });
  }

  // ── 4. Generate all assets ─────────────────────────────────────────────

  // Logo variations (Sharp pipeline)
  try {
    const vars = await createLogoVariations(logoBuffer);
    await save("logo-original",    "logos", "Logo — Original",    vars.original,    "png", 800, 400);
    await save("logo-white",       "logos", "Logo — White",       vars.white,       "png", 800, 400);
    await save("logo-black",       "logos", "Logo — Black",       vars.black,       "png", 800, 400);
    await save("logo-monochrome",  "logos", "Logo — Monochrome",  vars.monochrome,  "png", 800, 400);
  } catch (e) { console.warn("[Dev] Logo variations:", e); }

  // Favicon pack
  try {
    const favs = await createFaviconSet(logoBuffer);
    const fav512 = favs.find(f => f.size === 512)?.buffer || logoBuffer;
    await save("logo-favicon-pack", "logos", "Favicon Pack (512px)", fav512, "png", 512, 512);
  } catch (e) { console.warn("[Dev] Favicon:", e); }

  // Profile resizes (social)
  try {
    const ig = await createSocialVariant(logoBuffer, 320, 320, ctx.p);
    await save("instagram-profile", "social", "Instagram Profile Photo", ig, "png", 320, 320);
  } catch (e) { console.warn("[Dev] IG profile:", e); }
  try {
    const tw = await createSocialVariant(logoBuffer, 400, 400, ctx.p);
    await save("twitter-profile", "social", "Twitter / X Profile Photo", tw, "png", 400, 400);
  } catch (e) { console.warn("[Dev] Twitter profile:", e); }
  try {
    const fb = await createSocialVariant(logoBuffer, 170, 170, ctx.p);
    await save("facebook-profile", "social", "Facebook Profile Photo", fb, "png", 170, 170);
  } catch (e) { console.warn("[Dev] FB profile:", e); }

  // Stationery
  try {
    const bc = await makeBusinessCard(logoBuffer, 1050, 600, ctx);
    await save("business-card-front", "stationery", "Business Card — Front", bc, "png", 1050, 600);
  } catch (e) { console.warn("[Dev] Business card:", e); }
  try {
    const lh = await makeLetterhead(logoBuffer, 2480, 3508, ctx);
    await save("letterhead-a4", "stationery", "Letterhead A4", lh, "png", 2480, 3508);
  } catch (e) { console.warn("[Dev] Letterhead:", e); }
  try {
    const em = await makeEmailSignature(logoBuffer, 600, 200, ctx);
    await save("email-signature", "stationery", "Email Signature", em, "png", 600, 200);
  } catch (e) { console.warn("[Dev] Email sig:", e); }
  try {
    const inv = await makeInvoice(logoBuffer, 1240, 1754, ctx);
    await save("invoice-template", "stationery", "Invoice Template", inv, "png", 1240, 1754);
  } catch (e) { console.warn("[Dev] Invoice:", e); }

  // Social media
  try {
    const ig = await makeInstagramPost(logoBuffer, 1080, 1080, ctx);
    await save("instagram-post", "social", "Instagram Post", ig, "png", 1080, 1080);
  } catch (e) { console.warn("[Dev] IG post:", e); }
  try {
    const igs = await makeInstagramStory(logoBuffer, 1080, 1920, ctx);
    await save("instagram-story", "social", "Instagram Story", igs, "png", 1080, 1920);
  } catch (e) { console.warn("[Dev] IG story:", e); }
  try {
    const li = await makeLinkedInBanner(logoBuffer, 1584, 396, ctx);
    await save("linkedin-banner", "social", "LinkedIn Banner", li, "png", 1584, 396);
  } catch (e) { console.warn("[Dev] LinkedIn:", e); }
  try {
    const tw = await makeTwitterHeader(logoBuffer, 1500, 500, ctx);
    await save("twitter-header", "social", "Twitter / X Header", tw, "png", 1500, 500);
  } catch (e) { console.warn("[Dev] Twitter header:", e); }
  try {
    const yt = await makeYoutubeBanner(logoBuffer, 2560, 1440, ctx);
    await save("youtube-banner", "social", "YouTube Channel Art", yt, "png", 2560, 1440);
  } catch (e) { console.warn("[Dev] YouTube:", e); }

  // Merchandise
  try {
    const ts = await makeTshirtMockup(logoBuffer, 1500, 1500, ctx);
    await save("tshirt-flatlay", "merchandise", "T-Shirt Mockup", ts, "png", 1500, 1500);
  } catch (e) { console.warn("[Dev] T-shirt:", e); }
  try {
    const mug = await makeCoffeeMug(logoBuffer, 1500, 1500, ctx);
    await save("coffee-mug", "merchandise", "Coffee Mug Mockup", mug, "png", 1500, 1500);
  } catch (e) { console.warn("[Dev] Mug:", e); }
  try {
    const tote = await makeToteBag(logoBuffer, 1500, 1500, ctx);
    await save("tote-bag", "merchandise", "Tote Bag Mockup", tote, "png", 1500, 1500);
  } catch (e) { console.warn("[Dev] Tote:", e); }
  try {
    const stk = await makeStickerSheet(logoBuffer, 1500, 1500, ctx);
    await save("sticker-sheet", "merchandise", "Sticker Sheet", stk, "png", 1500, 1500);
  } catch (e) { console.warn("[Dev] Stickers:", e); }

  // Signage
  try {
    const sf = await makeStorefrontSign(logoBuffer, 1920, 1080, ctx);
    await save("storefront-sign", "signage", "Storefront Sign", sf, "png", 1920, 1080);
  } catch (e) { console.warn("[Dev] Storefront:", e); }
  try {
    const bb = await makeBillboard(logoBuffer, 3000, 1500, ctx);
    await save("billboard-mockup", "signage", "Billboard Mockup", bb, "png", 3000, 1500);
  } catch (e) { console.warn("[Dev] Billboard:", e); }
  try {
    const rb = await makeRollupBanner(logoBuffer, 1080, 2400, ctx);
    await save("rollup-banner", "signage", "Roll-up Banner", rb, "png", 1080, 2400);
  } catch (e) { console.warn("[Dev] Rollup:", e); }

  // Web & Digital
  try {
    const hero = await makeWebsiteHero(logoBuffer, 1920, 1080, ctx);
    await save("website-hero", "web", "Website Hero Section", hero, "png", 1920, 1080);
  } catch (e) { console.warn("[Dev] Web hero:", e); }
  try {
    const app = await makeMobileApp(logoBuffer, 1242, 2688, ctx);
    await save("mobile-app-screen", "web", "Mobile App Screen", app, "png", 1242, 2688);
  } catch (e) { console.warn("[Dev] App screen:", e); }
  try {
    const nl = await makeNewsletter(logoBuffer, 600, 800, ctx);
    await save("email-newsletter", "web", "Email Newsletter", nl, "png", 600, 800);
  } catch (e) { console.warn("[Dev] Newsletter:", e); }

  // Packaging
  try {
    const box = await makeProductBox(logoBuffer, 1500, 1500, ctx);
    await save("product-box", "packaging", "Product Box (Isometric)", box, "png", 1500, 1500);
  } catch (e) { console.warn("[Dev] Product box:", e); }
  try {
    const bag = await makeShoppingBag(logoBuffer, 1500, 1500, ctx);
    await save("shopping-bag", "packaging", "Shopping Bag", bag, "png", 1500, 1500);
  } catch (e) { console.warn("[Dev] Shopping bag:", e); }

  // Presentations
  try {
    const deck = await makePitchDeck(logoBuffer, 1920, 1080, ctx);
    await save("pitch-deck-cover", "presentations", "Pitch Deck Cover", deck, "png", 1920, 1080);
  } catch (e) { console.warn("[Dev] Pitch deck:", e); }

  // Documentation PDF
  try {
    const pdf = await buildBrandGuidelinesPDF({ brandName: ctx.name, brandData, logoUrl: project.logo_url as string });
    await save("brand-guidelines", "documentation", "Brand Guidelines PDF", pdf, "pdf", null, null);
  } catch (e) { console.warn("[Dev] PDF:", e); }

  // ── 5. Complete ────────────────────────────────────────────────────────
  await update(projectId, {
    status: "complete",
    progress: 100,
    assets,
    completed_at: new Date().toISOString(),
    zip_url: null,
  });

  console.log(`[Dev] Generated ${assets.length} assets for project ${projectId}`);
}

const TOTAL_ASSETS = 28; // approximate

/* ─── Mock brand data (when no API key) ──────────────────────────────── */
function getMockBrandData(brandName: string): BrandData {
  return {
    primaryColors: [{ hex: "#7c3aed", rgb: { r: 124, g: 58, b: 237 }, name: "Electric Violet", usage: "Primary brand color" }],
    secondaryColors: [{ hex: "#06b6d4", rgb: { r: 6, g: 182, b: 212 }, name: "Cyan Glow", usage: "Secondary accents" }],
    accentColors: [{ hex: "#fb7185", rgb: { r: 251, g: 113, b: 133 }, name: "Soft Coral", usage: "Warm accents" }],
    style: "tech",
    personality: ["innovative", "trustworthy", "modern", "bold"],
    industry: "Technology",
    targetAudience: "Forward-thinking professionals",
    fontPairings: [{ heading: "Inter", body: "Inter", mood: "Clean, modern", googleFontsUrl: "" }],
    brandVoice: { tone: "Confident and clear", vocabulary: ["innovative", "seamless"], examples: [`${brandName} — built for the future.`] },
    taglineSuggestions: [`${brandName} — built for what's next.`, "Shape the future, today."],
    designPrinciples: ["Clarity over complexity", "Bold but refined"],
  };
}
