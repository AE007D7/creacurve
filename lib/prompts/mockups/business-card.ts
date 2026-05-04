export const BUSINESS_CARD_FRONT_PROMPT = `Create a stunning, print-ready business card front face as a complete HTML document.

SPECIFICATIONS:
- Canvas: 1050x600px (standard business card at 3.5" x 2" @ 300dpi)
- Background should use brand primary color as the dominant color
- Must include: logo image, person's full name (use "Alex Morgan" as placeholder), job title (use "Founder & CEO"), phone ("+1 (555) 234-5678"), email ("hello@[brandname].com"), website ("[brandname].com")
- Add realistic paper texture using CSS noise filter
- Include subtle geometric design elements matching the brand style
- Cast a realistic drop shadow beneath the card
- The overall composition should look like it came from a $500/hr design agency

DESIGN REQUIREMENTS:
- Use high-contrast typography — the card must be legible
- Include a subtle premium finish (matte, glossy sheen effect, or foil-like gradient)
- Add micro-details: thin rule lines, small geometric accents, breathing room margins
- Logo placement: prominent but balanced
- Typography hierarchy: Name is largest, title second, contact info smallest
- If brand style is "luxury": gold/cream palette, serif fonts, minimalist spacing
- If brand style is "tech": dark background, monospace accents, circuit-like patterns
- If brand style is "playful": bold colors, fun shapes, rounded corners
- If brand style is "minimal": white space dominant, single accent color, clean type

Output ONLY the complete HTML document (<!DOCTYPE html> through </html>).`;

export const BUSINESS_CARD_BACK_PROMPT = `Create a premium business card back as a complete HTML document.

SPECIFICATIONS:
- Canvas: 1050x600px
- The back should be a bold brand statement — primarily visual
- Feature the logo as the hero element, centered and large
- Include the brand tagline if available, or website URL
- Use a different treatment than the front — if front was primary color, back could be dark/black or white
- Add texture, patterns, or geometric elements that extend the brand language
- Include a subtle "Powered by CreaCurve" watermark in the bottom right (very small, 8px, 20% opacity white)

Output ONLY the complete HTML document.`;
