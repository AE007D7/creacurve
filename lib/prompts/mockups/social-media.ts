export const INSTAGRAM_POST_PROMPT = `Create a stunning Instagram post template as a complete HTML document.

SPECIFICATIONS:
- Canvas: 1080x1080px (perfect square)
- Background: bold brand color gradient or brand pattern
- Feature the logo prominently
- Include a compelling call-to-action text area
- Add visual elements: geometric shapes, lines, or patterns that match brand personality
- Typography: Large display text with brand fonts
- Include a subtle grid/template overlay showing text/image placement guides
- Make it look like a premium brand post from a lifestyle brand

If brand style is luxury: dark background, gold accents, editorial layout
If brand style is tech: dark gradient, glowing accents, clean grid
If brand style is playful: bright colors, bold shapes, fun typography
If brand style is minimal: white space, single color accent, clean type

Output ONLY the complete HTML document.`;

export const INSTAGRAM_STORY_PROMPT = `Create an Instagram Story template as a complete HTML document.

SPECIFICATIONS:
- Canvas: 1080x1920px (9:16 portrait)
- Full-bleed brand color background with gradient
- Logo in upper third
- Large headline text area in middle
- CTA area at bottom ("Swipe Up" or "Link in Bio")
- Decorative elements: curved shapes, dots, lines matching brand aesthetic
- Safe zones: avoid placing important content in top/bottom 250px (UI chrome area)
- Story should feel immersive and premium

Output ONLY the complete HTML document.`;

export const LINKEDIN_BANNER_PROMPT = `Create a LinkedIn profile banner as a complete HTML document.

SPECIFICATIONS:
- Canvas: 1584x396px (LinkedIn banner dimensions)
- Professional and authoritative tone
- Brand logo (left or center)
- Brand tagline or value proposition
- Subtle geometric background pattern
- Professional color palette derived from brand
- Can include: industry keywords, "Hiring" badge, core services
- Should look impressive when seen on a LinkedIn profile

Output ONLY the complete HTML document.`;

export const TWITTER_HEADER_PROMPT = `Create a Twitter/X profile header as a complete HTML document.

SPECIFICATIONS:
- Canvas: 1500x500px
- Bold, attention-grabbing design
- Brand identity prominent without being cluttered
- Works with circular profile photo overlay (remember the profile pic covers bottom-left)
- Include brand tagline or key message
- Dynamic visual: gradient, pattern, or brand illustration elements

Output ONLY the complete HTML document.`;

export const YOUTUBE_BANNER_PROMPT = `Create a YouTube channel banner as a complete HTML document.

SPECIFICATIONS:
- Canvas: 2560x1440px (YouTube banner dimensions)
- Safe area for all devices: center 1546x423px
- Brand logo in safe zone
- Channel name and niche/description
- Posting schedule or value proposition (e.g. "New videos every Tuesday")
- Visually rich background that extends to edges
- Brand colors throughout

Output ONLY the complete HTML document.`;
