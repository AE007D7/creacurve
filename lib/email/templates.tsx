import type { BrandData } from "@/lib/types";

interface DeliveryEmailProps {
  brandName: string;
  downloadUrl: string;
  dashboardUrl: string;
  brandData: BrandData;
  previewImages?: string[];
}

export function buildDeliveryEmail(props: DeliveryEmailProps): string {
  const { brandName, downloadUrl, dashboardUrl, brandData } = props;
  const primary = brandData.primaryColors[0]?.hex || "#7c3aed";
  const secondary = brandData.secondaryColors[0]?.hex || "#06b6d4";
  const tagline = brandData.taglineSuggestions[0] || "Your brand, fully formed.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your CreaCurve Brand Kit is Ready ✨</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;">

<!-- Wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr>
    <td style="background:linear-gradient(135deg,${primary},${secondary});border-radius:16px 16px 0 0;padding:48px 40px 40px;text-align:center;">
      <div style="font-family:Georgia,serif;font-size:14px;letter-spacing:4px;color:rgba(255,255,255,0.7);text-transform:uppercase;margin-bottom:16px;">CreaCurve</div>
      <h1 style="margin:0;font-size:36px;font-weight:700;color:#fff;line-height:1.2;">Your brand is<br>fully formed. ✨</h1>
      <p style="margin:16px 0 0;color:rgba(255,255,255,0.85);font-size:16px;">"${tagline}"</p>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="background:#111;padding:40px;border-left:1px solid rgba(255,255,255,0.08);border-right:1px solid rgba(255,255,255,0.08);">

      <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 24px;">
        Your complete <strong style="color:#fff;">${brandName}</strong> brand kit has been generated and is ready to download.
        60+ professional assets — every use case covered.
      </p>

      <!-- Download CTA -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
        <tr>
          <td align="center" style="padding:8px 0;">
            <a href="${downloadUrl}" style="display:inline-block;background:linear-gradient(135deg,${primary},${secondary});color:#fff;text-decoration:none;padding:18px 48px;border-radius:12px;font-size:16px;font-weight:600;letter-spacing:0.3px;box-shadow:0 8px 32px rgba(124,58,237,0.35);">
              ↓ Download Your Brand Kit
            </a>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:8px;">
            <span style="color:rgba(255,255,255,0.4);font-size:12px;">Download link expires in 7 days</span>
          </td>
        </tr>
      </table>

      <!-- What's inside -->
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px;margin:0 0 32px;">
        <p style="margin:0 0 16px;color:#fff;font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">What's inside</p>
        <table width="100%" cellpadding="4" cellspacing="0">
          ${[
            ["✦ Logo Variations", "8 files"],
            ["📄 Stationery", "10 files"],
            ["👕 Merchandise", "8 files"],
            ["📱 Social Media", "13 files"],
            ["🏪 Signage & Print", "6 files"],
            ["💻 Web & Digital", "6 files"],
            ["📚 Brand Guidelines", "PDF"],
          ].map(([name, count]) => `
          <tr>
            <td style="color:rgba(255,255,255,0.7);font-size:13px;">${name}</td>
            <td align="right" style="color:${primary};font-size:12px;font-weight:600;">${count}</td>
          </tr>`).join("")}
        </table>
      </div>

      <!-- Brand Colors -->
      <div style="margin:0 0 32px;">
        <p style="margin:0 0 12px;color:#fff;font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Your brand palette</p>
        <table cellpadding="0" cellspacing="8">
          <tr>
            ${brandData.primaryColors.slice(0, 4).map(c => `
            <td>
              <div style="width:40px;height:40px;border-radius:8px;background:${c.hex};border:1px solid rgba(255,255,255,0.1);"></div>
              <div style="color:rgba(255,255,255,0.5);font-size:10px;text-align:center;margin-top:4px;">${c.hex}</div>
            </td>`).join("")}
          </tr>
        </table>
      </div>

      <!-- Dashboard CTA -->
      <p style="color:rgba(255,255,255,0.5);font-size:13px;text-align:center;">
        View all assets in your dashboard →
        <a href="${dashboardUrl}" style="color:${primary};text-decoration:none;font-weight:500;">Open Dashboard</a>
      </p>

    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#0d0d0d;border:1px solid rgba(255,255,255,0.06);border-top:none;border-radius:0 0 16px 16px;padding:32px 40px;text-align:center;">
      <p style="margin:0 0 8px;color:rgba(255,255,255,0.3);font-size:12px;">
        Made with ✦ by <a href="https://creacurve.com" style="color:rgba(255,255,255,0.5);text-decoration:none;">CreaCurve</a>
      </p>
      <p style="margin:0;color:rgba(255,255,255,0.2);font-size:11px;">
        From logo to launch-ready in 90 seconds.
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>

</body>
</html>`;
}
