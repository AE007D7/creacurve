export const PRODUCT_BOX_PROMPT = `Create a product box isometric mockup as a complete HTML document.

SPECIFICATIONS:
- Canvas: 1500x1500px
- Create a 3D isometric product box using CSS transforms:
  - Top face (lighter shade of brand color)
  - Front face (brand primary color with logo)
  - Right side face (darker shade)
  - Realistic edges and depth shadows
  - Logo on front face, product name on top
  - Subtle texture on faces
- Background: clean neutral or brand-appropriate
- Cast shadow beneath the box
- Use CSS transform: perspective + rotateX/Y for isometric effect

Output ONLY the complete HTML document.`;

export const SHOPPING_BAG_PROMPT = `Create a branded shopping bag mockup as a complete HTML document.

SPECIFICATIONS:
- Canvas: 1500x1500px
- Paper shopping bag using CSS:
  - Main bag body with paper bag shape
  - Folded top edge
  - Rope handles (CSS curves)
  - Brand logo on front panel
  - Subtle paper texture via CSS filter
  - Realistic bag shadow
- Brand colors as primary/accent
- Premium quality feel

Output ONLY the complete HTML document.`;

export const PRODUCT_LABEL_PROMPT = `Create a product label as a complete HTML document.

SPECIFICATIONS:
- Canvas: 1500x1500px
- Circular or rectangular product label:
  - Brand logo centered
  - Product name and type
  - Subtle background pattern or texture
  - Brand colors throughout
  - "Net Wt" / batch number placeholder details
  - Decorative border matching brand style
- Should look print-ready, premium quality

Output ONLY the complete HTML document.`;
