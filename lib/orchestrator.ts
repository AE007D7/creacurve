import Anthropic from "@anthropic-ai/sdk";
import pLimit from "p-limit";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type JSZipType from "jszip";
import { renderToPNGWithFallback } from "./render/browserless";
import { createThumbnail, createLogoVariations, createSocialVariant, createFaviconSet } from "./render/sharp-pipeline";
import { buildBrandGuidelinesPDF } from "./render/pdf-builder";
import { buildMockupPrompt, MOCKUP_SYSTEM_PROMPT } from "./prompts/mockup-base";
import { LOGO_ANALYSIS_PROMPT, LOGO_ANALYSIS_SYSTEM } from "./prompts/logo-analysis";
import { extractLogoColors, mergeExtractedColors } from "./render/color-extractor";
import type { BrandData, Project } from "./types";
import { BUSINESS_CARD_FRONT_PROMPT, BUSINESS_CARD_BACK_PROMPT } from "./prompts/mockups/business-card";
import { LETTERHEAD_PROMPT, EMAIL_SIGNATURE_PROMPT, INVOICE_TEMPLATE_PROMPT } from "./prompts/mockups/stationery";
import { INSTAGRAM_POST_PROMPT, INSTAGRAM_STORY_PROMPT, LINKEDIN_BANNER_PROMPT, TWITTER_HEADER_PROMPT, YOUTUBE_BANNER_PROMPT } from "./prompts/mockups/social-media";
import { TSHIRT_MOCKUP_PROMPT, COFFEE_MUG_PROMPT, TOTE_BAG_PROMPT, STICKER_SHEET_PROMPT } from "./prompts/mockups/merchandise";
import { STOREFRONT_SIGN_PROMPT, BILLBOARD_PROMPT, ROLLUP_BANNER_PROMPT } from "./prompts/mockups/signage";
import { WEBSITE_HERO_PROMPT, MOBILE_APP_SCREEN_PROMPT, EMAIL_NEWSLETTER_PROMPT, PITCH_DECK_COVER_PROMPT } from "./prompts/mockups/web-digital";
import { RESTAURANT_MENU_PROMPT, LOYALTY_CARD_PROMPT, GIFT_CARD_PROMPT, TABLE_TENT_PROMPT } from "./prompts/mockups/hospitality";
import { PRODUCT_BOX_PROMPT, SHOPPING_BAG_PROMPT, PRODUCT_LABEL_PROMPT } from "./prompts/mockups/packaging";

const CONCURRENCY_LIMIT = 6;
const PROJECT_TIMEOUT_MS = 5 * 60 * 1000;

interface AssetDefinition {
  id: string;
  category: string;
  name: string;
  width: number;
  height: number;
  prompt?: string;
  type: "mockup" | "logo-variation" | "social-resize" | "favicon" | "pdf";
}

const ASSET_DEFINITIONS: AssetDefinition[] = [
  // Logo variations
  { id: "logo-original", category: "logos", name: "Logo Original", width: 800, height: 400, type: "logo-variation" },
  { id: "logo-white", category: "logos", name: "Logo White", width: 800, height: 400, type: "logo-variation" },
  { id: "logo-black", category: "logos", name: "Logo Black", width: 800, height: 400, type: "logo-variation" },
  { id: "logo-monochrome", category: "logos", name: "Logo Monochrome", width: 800, height: 400, type: "logo-variation" },
  { id: "logo-favicon-pack", category: "logos", name: "Favicon Pack", width: 512, height: 512, type: "favicon" },

  // Stationery
  { id: "business-card-front", category: "stationery", name: "Business Card Front", width: 1050, height: 600, prompt: BUSINESS_CARD_FRONT_PROMPT, type: "mockup" },
  { id: "business-card-back", category: "stationery", name: "Business Card Back", width: 1050, height: 600, prompt: BUSINESS_CARD_BACK_PROMPT, type: "mockup" },
  { id: "letterhead-a4", category: "stationery", name: "Letterhead A4", width: 2480, height: 3508, prompt: LETTERHEAD_PROMPT, type: "mockup" },
  { id: "email-signature", category: "stationery", name: "Email Signature", width: 600, height: 200, prompt: EMAIL_SIGNATURE_PROMPT, type: "mockup" },
  { id: "invoice-template", category: "stationery", name: "Invoice Template", width: 1240, height: 1754, prompt: INVOICE_TEMPLATE_PROMPT, type: "mockup" },

  // Merchandise
  { id: "tshirt-flatlay", category: "merchandise", name: "T-Shirt Mockup", width: 1500, height: 1500, prompt: TSHIRT_MOCKUP_PROMPT, type: "mockup" },
  { id: "coffee-mug", category: "merchandise", name: "Coffee Mug Mockup", width: 1500, height: 1500, prompt: COFFEE_MUG_PROMPT, type: "mockup" },
  { id: "tote-bag", category: "merchandise", name: "Tote Bag Mockup", width: 1500, height: 1500, prompt: TOTE_BAG_PROMPT, type: "mockup" },
  { id: "sticker-sheet", category: "merchandise", name: "Sticker Sheet", width: 1500, height: 1500, prompt: STICKER_SHEET_PROMPT, type: "mockup" },

  // Signage
  { id: "storefront-sign", category: "signage", name: "Storefront Sign", width: 1920, height: 1080, prompt: STOREFRONT_SIGN_PROMPT, type: "mockup" },
  { id: "billboard-mockup", category: "signage", name: "Billboard Mockup", width: 3000, height: 1500, prompt: BILLBOARD_PROMPT, type: "mockup" },
  { id: "rollup-banner", category: "signage", name: "Roll-up Banner", width: 1080, height: 2400, prompt: ROLLUP_BANNER_PROMPT, type: "mockup" },

  // Social Media
  { id: "instagram-post", category: "social", name: "Instagram Post", width: 1080, height: 1080, prompt: INSTAGRAM_POST_PROMPT, type: "mockup" },
  { id: "instagram-story", category: "social", name: "Instagram Story", width: 1080, height: 1920, prompt: INSTAGRAM_STORY_PROMPT, type: "mockup" },
  { id: "linkedin-banner", category: "social", name: "LinkedIn Banner", width: 1584, height: 396, prompt: LINKEDIN_BANNER_PROMPT, type: "mockup" },
  { id: "twitter-header", category: "social", name: "Twitter/X Header", width: 1500, height: 500, prompt: TWITTER_HEADER_PROMPT, type: "mockup" },
  { id: "youtube-banner", category: "social", name: "YouTube Banner", width: 2560, height: 1440, prompt: YOUTUBE_BANNER_PROMPT, type: "mockup" },
  { id: "instagram-profile", category: "social", name: "Instagram Profile", width: 320, height: 320, type: "social-resize" },
  { id: "facebook-profile", category: "social", name: "Facebook Profile", width: 170, height: 170, type: "social-resize" },
  { id: "twitter-profile", category: "social", name: "Twitter/X Profile", width: 400, height: 400, type: "social-resize" },
  { id: "youtube-profile", category: "social", name: "YouTube Profile", width: 800, height: 800, type: "social-resize" },

  // Web & Digital
  { id: "website-hero", category: "web", name: "Website Hero Section", width: 1920, height: 1080, prompt: WEBSITE_HERO_PROMPT, type: "mockup" },
  { id: "mobile-app-screen", category: "web", name: "Mobile App Screen", width: 1242, height: 2688, prompt: MOBILE_APP_SCREEN_PROMPT, type: "mockup" },
  { id: "email-newsletter", category: "web", name: "Email Newsletter Template", width: 600, height: 800, prompt: EMAIL_NEWSLETTER_PROMPT, type: "mockup" },

  // Presentations
  { id: "pitch-deck-cover", category: "presentations", name: "Pitch Deck Cover", width: 1920, height: 1080, prompt: PITCH_DECK_COVER_PROMPT, type: "mockup" },

  // Hospitality
  { id: "restaurant-menu", category: "hospitality", name: "Restaurant Menu", width: 1240, height: 1754, prompt: RESTAURANT_MENU_PROMPT, type: "mockup" },
  { id: "loyalty-card", category: "hospitality", name: "Loyalty Card", width: 1050, height: 600, prompt: LOYALTY_CARD_PROMPT, type: "mockup" },
  { id: "gift-card", category: "hospitality", name: "Gift Card", width: 1050, height: 600, prompt: GIFT_CARD_PROMPT, type: "mockup" },
  { id: "table-tent", category: "hospitality", name: "Table Tent Card", width: 1240, height: 1754, prompt: TABLE_TENT_PROMPT, type: "mockup" },

  // Packaging
  { id: "product-box", category: "packaging", name: "Product Box (Isometric)", width: 1500, height: 1500, prompt: PRODUCT_BOX_PROMPT, type: "mockup" },
  { id: "shopping-bag", category: "packaging", name: "Shopping Bag", width: 1500, height: 1500, prompt: SHOPPING_BAG_PROMPT, type: "mockup" },
  { id: "product-label", category: "packaging", name: "Product Label", width: 1500, height: 1500, prompt: PRODUCT_LABEL_PROMPT, type: "mockup" },

  // Documentation
  { id: "brand-guidelines", category: "documentation", name: "Brand Guidelines PDF", width: 0, height: 0, type: "pdf" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = SupabaseClient<any>;

export class BrandOrchestrator {
  private claude: Anthropic;
  private supabase: DB;
  private limit: ReturnType<typeof pLimit>;
  private projectId: string;
  private totalAssets: number;
  private completedAssets: number;

  constructor(projectId: string) {
    this.claude = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    this.limit = pLimit(CONCURRENCY_LIMIT);
    this.projectId = projectId;
    this.totalAssets = ASSET_DEFINITIONS.length;
    this.completedAssets = 0;
  }

  async run(project: Project): Promise<void> {
    const timeout = setTimeout(() => {
      this.failProject("Project timed out after 5 minutes");
    }, PROJECT_TIMEOUT_MS);

    try {
      await this.updateProgress(5, "Analyzing your brand DNA...");

      // Phase 1: Analyze logo
      const logoBuffer = await this.fetchLogoBuffer(project.logo_url);
      let brandData = await this.analyzeLogo(project.logo_url);

      // Override colors with pixel-accurate extraction from the actual logo
      try {
        const pixelColors = await extractLogoColors(logoBuffer);
        if (pixelColors.length > 0) {
          const merged = mergeExtractedColors(pixelColors, brandData);
          brandData = { ...brandData, ...merged };
        }
      } catch (err) {
        console.warn("[Orchestrator] Pixel color extraction failed:", err);
      }

      await this.saveBrandData(brandData);
      await this.updateProgress(10, "Brand analysis complete. Generating assets...");

      // Phase 2: Parallel generation
      const tasks = ASSET_DEFINITIONS.map((asset) =>
        this.limit(() =>
          this.generateAsset(asset, project, brandData, logoBuffer).catch((err) => {
            console.error(`[Orchestrator] Asset ${asset.id} failed:`, err);
          })
        )
      );

      await Promise.all(tasks);
      await this.updateProgress(92, "Packaging your brand kit...");

      // Phase 3: Build ZIP
      const zipUrl = await this.buildAndUploadZip(project);
      await this.updateProgress(97, "Sending your brand kit...");

      // Phase 4: Send email
      await this.sendDeliveryEmail(project, brandData, zipUrl);

      // Complete
      await this.supabase
        .from("projects")
        .update({
          status: "complete",
          progress: 100,
          zip_url: zipUrl,
          completed_at: new Date().toISOString(),
        })
        .eq("id", this.projectId);

      clearTimeout(timeout);
    } catch (error) {
      clearTimeout(timeout);
      const message = error instanceof Error ? error.message : "Unknown error";
      await this.failProject(message);
      throw error;
    }
  }

  private async analyzeLogo(logoUrl: string): Promise<BrandData> {
    const response = await this.claude.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 2000,
      system: LOGO_ANALYSIS_SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "url", url: logoUrl },
            },
            { type: "text", text: LOGO_ANALYSIS_PROMPT },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Logo analysis returned invalid JSON");

    return JSON.parse(jsonMatch[0]) as BrandData;
  }

  private async generateAsset(
    asset: AssetDefinition,
    project: Project,
    brandData: BrandData,
    logoBuffer: Buffer
  ): Promise<void> {
    const brandName = project.brand_name || "Your Brand";

    let imageBuffer: Buffer;
    let thumbnailBuffer: Buffer;
    let mimeType = "image/png";

    switch (asset.type) {
      case "mockup": {
        const html = await this.generateMockupHTML(asset, brandName, project.logo_url, brandData);
        imageBuffer = await renderToPNGWithFallback(html, asset.width, asset.height);
        thumbnailBuffer = await createThumbnail(imageBuffer);
        break;
      }

      case "logo-variation": {
        const variations = await createLogoVariations(logoBuffer);
        const key = asset.id.replace("logo-", "") as keyof typeof variations;
        imageBuffer = variations[key] || variations.original;
        thumbnailBuffer = await createThumbnail(imageBuffer);
        break;
      }

      case "social-resize": {
        const primaryColor = brandData.primaryColors[0]?.hex || "#7c3aed";
        imageBuffer = await createSocialVariant(logoBuffer, asset.width, asset.height, primaryColor);
        thumbnailBuffer = await createThumbnail(imageBuffer);
        break;
      }

      case "favicon": {
        const favicons = await createFaviconSet(logoBuffer);
        // Upload the 512px version as the main asset
        const favicon512 = favicons.find((f) => f.size === 512);
        imageBuffer = favicon512?.buffer || logoBuffer;
        thumbnailBuffer = await createThumbnail(imageBuffer, 200);
        break;
      }

      case "pdf": {
        const pdfBuffer = await buildBrandGuidelinesPDF({ brandName, brandData });
        const assetPath = `assets/${this.projectId}/${asset.id}.pdf`;
        const { error } = await this.supabase.storage
          .from("assets")
          .upload(assetPath, pdfBuffer, { contentType: "application/pdf", upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = this.supabase.storage
          .from("assets")
          .getPublicUrl(assetPath);

        await this.saveAsset({
          projectId: this.projectId,
          assetId: asset.id,
          category: asset.category,
          name: asset.name,
          url: publicUrl,
          thumbnailUrl: null,
          width: null,
          height: null,
          fileSize: pdfBuffer.length,
        });

        this.completedAssets++;
        await this.updateProgressFromCompleted();
        return;
      }
    }

    // Upload main image
    const imagePath = `assets/${this.projectId}/${asset.id}.png`;
    const thumbPath = `assets/${this.projectId}/${asset.id}-thumb.png`;

    const [imageUpload, thumbUpload] = await Promise.all([
      this.supabase.storage.from("assets").upload(imagePath, imageBuffer, {
        contentType: mimeType,
        upsert: true,
      }),
      this.supabase.storage.from("assets").upload(thumbPath, thumbnailBuffer, {
        contentType: "image/png",
        upsert: true,
      }),
    ]);

    if (imageUpload.error) throw imageUpload.error;
    if (thumbUpload.error) throw thumbUpload.error;

    const { data: { publicUrl } } = this.supabase.storage.from("assets").getPublicUrl(imagePath);
    const { data: { publicUrl: thumbUrl } } = this.supabase.storage.from("assets").getPublicUrl(thumbPath);

    await this.saveAsset({
      projectId: this.projectId,
      assetId: asset.id,
      category: asset.category,
      name: asset.name,
      url: publicUrl,
      thumbnailUrl: thumbUrl,
      width: asset.width || null,
      height: asset.height || null,
      fileSize: imageBuffer.length,
    });

    this.completedAssets++;
    await this.updateProgressFromCompleted();
  }

  private async generateMockupHTML(
    asset: AssetDefinition,
    brandName: string,
    logoUrl: string,
    brandData: BrandData
  ): Promise<string> {
    const ctx = { brandName, logoUrl, brandData, width: asset.width, height: asset.height };
    const prompt = buildMockupPrompt(asset.prompt!, ctx);

    const response = await this.claude.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 4096,
      system: MOCKUP_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const html = response.content[0].type === "text" ? response.content[0].text : "";
    if (!html.includes("<!DOCTYPE") && !html.includes("<html")) {
      // Extract HTML if wrapped in code blocks
      const htmlMatch = html.match(/```(?:html)?\s*([\s\S]*?)```/);
      if (htmlMatch) return htmlMatch[1].trim();
    }
    return html;
  }

  private async buildAndUploadZip(project: Project): Promise<string> {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    const brandName = (project.brand_name || "brand").toLowerCase().replace(/\s+/g, "-");
    const root = zip.folder(`creacurve-brand-kit-${brandName}`)!;

    // Fetch all assets for this project
    const { data: assets } = await this.supabase
      .from("assets")
      .select("*")
      .eq("project_id", this.projectId);

    const folderMap: Record<string, string> = {
      logos: "01-logos",
      stationery: "02-stationery",
      hospitality: "03-hospitality-retail",
      merchandise: "04-merchandise",
      packaging: "05-packaging",
      signage: "06-signage-print",
      social: "07-social-media",
      web: "08-web-digital",
      presentations: "09-presentations",
      documentation: "10-documentation",
    };

    const folders: Record<string, JSZipType> = {};
    Object.entries(folderMap).forEach(([cat, folderName]) => {
      folders[cat] = root.folder(folderName) as JSZipType;
    });

    // Add README
    root.file(
      "README.txt",
      `CreaCurve Brand Kit — ${project.brand_name || "Your Brand"}
Generated: ${new Date().toLocaleDateString()}
creacurve.com

Your brand kit contains ${assets?.length || 0} professional assets organized across 10 categories.

FOLDERS:
${Object.entries(folderMap).map(([, v]) => `  ${v}/`).join("\n")}

USAGE TIPS:
• Logos: Use the appropriate variation for each background (white logo on dark, black logo on light)
• Social Media: Each platform has its optimal resolution included
• Print: All files are high-resolution and print-ready
• Documentation: Review the Brand Guidelines PDF for complete usage rules

Thank you for using CreaCurve — the fastest way to build a brand.
creacurve.com | hello@creacurve.com
`
    );

    // Download and add each asset
    const downloadTasks = (assets || []).map(async (asset) => {
      try {
        const response = await fetch(asset.url);
        if (!response.ok) return;
        const buffer = await response.arrayBuffer();
        const ext = asset.url.endsWith(".pdf") ? ".pdf" : ".png";
        const folder = folders[asset.category] || folders["web"];
        if (folder) {
          folder.file(`${asset.name.toLowerCase().replace(/\s+/g, "-")}${ext}`, buffer);
        }
      } catch (err) {
        console.error(`[ZIP] Failed to add asset ${asset.name}:`, err);
      }
    });

    await Promise.all(downloadTasks);

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    const zipPath = `zips/${this.projectId}/brand-kit-${brandName}.zip`;
    const { error } = await this.supabase.storage
      .from("zips")
      .upload(zipPath, zipBuffer, { contentType: "application/zip", upsert: true });

    if (error) throw error;

    // 7-day signed URL
    const { data: signedUrl } = await this.supabase.storage
      .from("zips")
      .createSignedUrl(zipPath, 7 * 24 * 60 * 60);

    return signedUrl?.signedUrl || "";
  }

  private async sendDeliveryEmail(project: Project, brandData: BrandData, zipUrl: string) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email/send-delivery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: this.projectId,
          zipUrl,
          brandName: project.brand_name,
          brandData,
        }),
      });
    } catch (err) {
      console.error("[Email] Delivery email failed:", err);
      // Non-fatal — don't throw
    }
  }

  private async saveAsset(params: {
    projectId: string;
    assetId: string;
    category: string;
    name: string;
    url: string;
    thumbnailUrl: string | null;
    width: number | null;
    height: number | null;
    fileSize: number;
  }) {
    const { error } = await this.supabase.from("assets").insert({
      project_id: params.projectId,
      category: params.category,
      name: params.name,
      url: params.url,
      thumbnail_url: params.thumbnailUrl,
      width: params.width,
      height: params.height,
      file_size: params.fileSize,
    });

    if (error) console.error("[DB] Failed to save asset:", error);
  }

  private async saveBrandData(brandData: BrandData) {
    await this.supabase
      .from("projects")
      .update({ brand_data: brandData })
      .eq("id", this.projectId);
  }

  private async updateProgress(progress: number, message?: string) {
    await this.supabase
      .from("projects")
      .update({
        progress,
        status: progress < 100 ? "processing" : "complete",
        ...(message ? { error_message: null } : {}),
      })
      .eq("id", this.projectId);

    if (message) console.log(`[Orchestrator] ${progress}% — ${message}`);
  }

  private async updateProgressFromCompleted() {
    const baseProgress = 10;
    const maxProgress = 90;
    const progressPerAsset = (maxProgress - baseProgress) / this.totalAssets;
    const currentProgress = Math.round(baseProgress + this.completedAssets * progressPerAsset);
    await this.updateProgress(currentProgress);
  }

  private async failProject(message: string) {
    console.error(`[Orchestrator] Project failed: ${message}`);
    await this.supabase
      .from("projects")
      .update({ status: "failed", error_message: message })
      .eq("id", this.projectId);
  }

  private async fetchLogoBuffer(logoUrl: string): Promise<Buffer> {
    const response = await fetch(logoUrl);
    if (!response.ok) throw new Error(`Failed to fetch logo: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
