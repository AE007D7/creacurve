import sharp from "sharp";

export async function createThumbnail(
  imageBuffer: Buffer,
  size = 400
): Promise<Buffer> {
  return sharp(imageBuffer)
    .resize(size, size, { fit: "cover", position: "center" })
    .png({ quality: 85, compressionLevel: 8 })
    .toBuffer();
}

export async function resizeImage(
  imageBuffer: Buffer,
  width: number,
  height: number
): Promise<Buffer> {
  return sharp(imageBuffer)
    .resize(width, height, { fit: "cover", position: "center" })
    .png({ quality: 90 })
    .toBuffer();
}

export async function createLogoVariations(logoBuffer: Buffer): Promise<{
  original: Buffer;
  white: Buffer;
  black: Buffer;
  monochrome: Buffer;
}> {
  const { data, info } = await sharp(logoBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rawOpts = { raw: { width: info.width, height: info.height, channels: 4 as 4 } };

  const whiteData = Buffer.from(data);
  const blackData = Buffer.from(data);

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 10) {
      whiteData[i] = whiteData[i + 1] = whiteData[i + 2] = 255;
      blackData[i] = blackData[i + 1] = blackData[i + 2] = 0;
    }
  }

  const original    = await sharp(logoBuffer).ensureAlpha().png().toBuffer();
  const white       = await sharp(whiteData, rawOpts).png().toBuffer();
  const black       = await sharp(blackData, rawOpts).png().toBuffer();
  const monochrome  = await sharp(logoBuffer).ensureAlpha().grayscale().png().toBuffer();

  return { original, white, black, monochrome };
}

export async function createSocialVariant(
  logoBuffer: Buffer,
  width: number,
  height: number,
  bgColor: string
): Promise<Buffer> {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 10, g: 10, b: 10 };
  };

  const rgb = hexToRgb(bgColor);
  const logoSize = Math.min(width, height) * 0.6;

  const resizedLogo = await sharp(logoBuffer)
    .resize(Math.round(logoSize), Math.round(logoSize), {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  const background = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: rgb.r, g: rgb.g, b: rgb.b, alpha: 255 },
    },
  })
    .png()
    .toBuffer();

  return sharp(background)
    .composite([
      {
        input: resizedLogo,
        gravity: "center",
      },
    ])
    .png()
    .toBuffer();
}

export async function createFaviconSet(
  logoBuffer: Buffer
): Promise<{ size: number; buffer: Buffer }[]> {
  const sizes = [16, 32, 192, 512];
  return Promise.all(
    sizes.map(async (size) => ({
      size,
      buffer: await sharp(logoBuffer)
        .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer(),
    }))
  );
}

export async function compositeOnBrandBackground(
  logoBuffer: Buffer,
  width: number,
  height: number,
  primaryColor: string,
  secondaryColor?: string
): Promise<Buffer> {
  const primary = hexToRgbObject(primaryColor);
  const secondary = secondaryColor ? hexToRgbObject(secondaryColor) : primary;

  // Create gradient background using SVG
  const svgBg = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primaryColor}"/>
          <stop offset="100%" stop-color="${secondaryColor || primaryColor}"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#g)"/>
    </svg>`
  );

  const background = await sharp(svgBg).png().toBuffer();
  const logoSize = Math.min(width, height) * 0.55;

  const resizedLogo = await sharp(logoBuffer)
    .resize(Math.round(logoSize), Math.round(logoSize), {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  return sharp(background)
    .composite([{ input: resizedLogo, gravity: "center" }])
    .png()
    .toBuffer();

  void primary; void secondary;
}

function hexToRgbObject(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
}
