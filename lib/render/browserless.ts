import { sleep } from "@/lib/utils";

const BROWSERLESS_URL = "https://chrome.browserless.io";
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

interface ScreenshotOptions {
  html: string;
  width: number;
  height: number;
  quality?: number;
}

export async function renderHTMLtoPNG(options: ScreenshotOptions): Promise<Buffer> {
  const { html, width, height, quality = 95 } = options;
  const apiKey = process.env.BROWSERLESS_API_KEY;

  if (!apiKey) throw new Error("BROWSERLESS_API_KEY not configured");

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(
        `${BROWSERLESS_URL}/screenshot?token=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            html,
            options: {
              type: "png",
              quality,
              clip: { x: 0, y: 0, width, height, scale: 1 },
              fullPage: false,
            },
            viewport: { width, height, deviceScaleFactor: 1 },
            gotoOptions: { waitUntil: "networkidle0", timeout: 30000 },
          }),
          signal: AbortSignal.timeout(45000),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Browserless error ${response.status}: ${errorText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      lastError = error as Error;
      console.error(`[Browserless] Attempt ${attempt}/${MAX_RETRIES} failed:`, error);
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY * attempt);
      }
    }
  }

  throw lastError || new Error("Browserless rendering failed after all retries");
}

export async function renderToPNGWithFallback(
  html: string,
  width: number,
  height: number
): Promise<Buffer> {
  try {
    return await renderHTMLtoPNG({ html, width, height });
  } catch (error) {
    console.error("[Browserless] All retries failed, using placeholder:", error);
    return generatePlaceholderPNG(width, height);
  }
}

function generatePlaceholderPNG(width: number, height: number): Buffer {
  // Minimal placeholder SVG converted to a simple buffer
  // In production this would be a proper placeholder image
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#1a1a2e"/>
    <rect x="${width / 2 - 100}" y="${height / 2 - 40}" width="200" height="80" rx="8" fill="#7c3aed" opacity="0.3"/>
    <text x="${width / 2}" y="${height / 2 + 8}" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Generating...</text>
  </svg>`;
  return Buffer.from(svg);
}
