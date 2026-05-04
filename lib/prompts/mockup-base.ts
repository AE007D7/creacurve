import type { BrandData } from "@/lib/types";

export interface MockupContext {
  brandName: string;
  logoUrl: string;
  brandData: BrandData;
  width: number;
  height: number;
}

export function buildBrandContext(ctx: MockupContext): string {
  const { brandName, brandData } = ctx;
  const primary = brandData.primaryColors[0];
  const secondary = brandData.secondaryColors[0];
  const accent = brandData.accentColors[0];
  const font = brandData.fontPairings[0];

  return `
Brand Name: ${brandName}
Primary Color: ${primary?.hex || "#000000"} (${primary?.name || "Black"})
Secondary Color: ${secondary?.hex || "#ffffff"} (${secondary?.name || "White"})
Accent Color: ${accent?.hex || "#999999"} (${accent?.name || "Gray"})
Style: ${brandData.style}
Industry: ${brandData.industry}
Personality: ${brandData.personality.join(", ")}
Heading Font: ${font?.heading || "Georgia"}
Body Font: ${font?.body || "Arial"}
Target Audience: ${brandData.targetAudience}
Design Principles: ${brandData.designPrinciples.join("; ")}
`.trim();
}

export const MOCKUP_SYSTEM_PROMPT = `You are an elite graphic designer creating high-end HTML/CSS mockups for a professional brand kit generator called CreaCurve.

Your mockups must:
- Look like real agency work, not auto-generated templates
- Use sophisticated design techniques: paper textures via CSS noise, layered shadows, subtle gradients, perspective transforms
- Include realistic details that make the design feel tangible and premium
- Use ONLY inline styles and embedded CSS (no external stylesheets)
- Embed the logo as an <img> tag using the provided URL
- Load fonts from Google Fonts when specified
- Be PERFECTLY sized to the exact pixel dimensions specified
- Return ONLY the complete HTML document, no explanations

The output will be rendered by a headless browser at exact pixel dimensions.`;

export function buildMockupPrompt(
  template: string,
  ctx: MockupContext
): string {
  const brandContext = buildBrandContext(ctx);
  return `${template}\n\nBRAND CONTEXT:\n${brandContext}\n\nLogo URL: ${ctx.logoUrl}\nCanvas: ${ctx.width}x${ctx.height}px`;
}
