export const LETTERHEAD_PROMPT = `Create a professional A4 letterhead as a complete HTML document.

SPECIFICATIONS:
- Canvas: 2480x3508px (A4 at 300dpi)
- Include: company logo (top), company address, phone, email, website
- Use "123 Creative Avenue, Suite 400, New York, NY 10001" as address
- Add decorative header band using brand primary color
- Include subtle brand color accent line at bottom
- Add watermark logo at 3% opacity in center of page
- Body area should be clean white/light for actual letter content
- Include a "sample letter" paragraph in a professional tone using brand voice
- Footer: thin rule line, contact info centered, small
- Add realistic paper shadow on right/bottom edges

Output ONLY the complete HTML document.`;

export const EMAIL_SIGNATURE_PROMPT = `Create a beautiful HTML email signature.

SPECIFICATIONS:
- Canvas: 600x200px
- Include: logo (left), divider line, name "Alex Morgan", title "Founder & CEO", email, phone, website
- Social media icons row (LinkedIn, Twitter/X, Instagram) as simple SVG icons
- Use brand colors as accents
- Clean, professional — must render well in Gmail, Outlook
- Add a subtle brand color left border accent bar
- Font size appropriate for email (14px name, 12px contact)
- Must look premium but render in basic email clients

Output ONLY the complete HTML document.`;

export const INVOICE_TEMPLATE_PROMPT = `Create a professional invoice template as a complete HTML document.

SPECIFICATIONS:
- Canvas: 1240x1754px (A4 half-size at 150dpi)
- Include: logo (top left), "INVOICE" header (top right), invoice number (#INV-2024-001), date, due date
- "Bill To" section with placeholder client details
- Itemized table: Description, Qty, Rate, Amount
- 3 sample line items (Creative Services, Brand Strategy, Design Implementation)
- Subtotal, Tax (10%), Total row
- Payment terms section
- Bank/payment details area
- "Thank you for your business" footer
- Branded color bar at top and bottom
- Professional but warm — reflects brand personality

Output ONLY the complete HTML document.`;
