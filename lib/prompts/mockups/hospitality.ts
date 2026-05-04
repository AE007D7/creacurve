export const RESTAURANT_MENU_PROMPT = `Create a beautiful restaurant menu as a complete HTML document.

SPECIFICATIONS:
- Canvas: 1240x1754px (A4 portrait)
- Design a premium restaurant menu:
  - Elegant cover-like header with brand logo and restaurant name
  - Menu sections: STARTERS, MAINS, DESSERTS, DRINKS
  - Each section has 4-5 items with name, description, and price
  - Use placeholder food items that match the brand's style and audience
  - If luxury brand: fine dining language, elegant typography, cream backgrounds
  - If casual/playful brand: fun descriptions, bright colors, approachable tone
  - If tech brand: minimal layout, clean grid, monospace accents

Design elements:
- Section dividers with brand color accents
- Item descriptions in a lighter weight
- Price in brand primary color
- Decorative footer with restaurant name and social handles
- Paper texture via CSS noise filter

Output ONLY the complete HTML document.`;

export const LOYALTY_CARD_PROMPT = `Create a loyalty card design as a complete HTML document.

SPECIFICATIONS:
- Canvas: 1050x600px (standard card size)
- Front: loyalty card with:
  - Brand logo
  - "Loyalty Card" or brand-specific name
  - 10 stamp circles/squares (2 filled, 8 empty — showing progress)
  - Customer name area
  - "Earn 1 stamp per visit" or similar CTA
- Design: match brand style (luxury = elegant cream/gold, playful = fun colors, etc.)
- Realistic card shadow and depth

Output ONLY the complete HTML document.`;

export const GIFT_CARD_PROMPT = `Create a gift card design as a complete HTML document.

SPECIFICATIONS:
- Canvas: 1050x600px
- Premium gift card:
  - Brand logo prominently
  - "Gift Card" in elegant typography
  - "$50" denomination placeholder (or currency-agnostic)
  - Decorative brand elements
  - "The perfect gift" or brand tagline
  - Unique code area at bottom (placeholder: XXXX-XXXX-XXXX-XXXX)
- Should feel premium and giftable
- Back side hint showing balance check URL

Output ONLY the complete HTML document.`;

export const TABLE_TENT_PROMPT = `Create a table tent/table card as a complete HTML document.

SPECIFICATIONS:
- Canvas: 1240x1754px (tall format for table tent fold)
- Top half: front of tent
  - Brand logo
  - Featured offer or message ("Happy Hour 4-7pm", "Today's Special", etc.)
  - Mouth-watering description
  - QR code placeholder (CSS square with "QR" text)
- Bottom half: back of tent (will fold behind)
  - Social media handles
  - Website URL
  - Minimal but branded

Output ONLY the complete HTML document.`;
