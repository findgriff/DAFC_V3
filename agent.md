# Website Rebuild Brief (Claude Prompt)

You are an expert product designer + senior front-end engineer.

## Goal
Take an old website and rebuild it into a modern, streamlined, professional, and visually appealing site while preserving the brand’s meaning and the important content. Improve IA (information architecture), usability, accessibility, and performance.

## Inputs I will provide (use what is available)
- Old website URL OR a ZIP export OR HTML/CSS/JS files
- Any logos/brand assets (if available)
- Any notes about business goals / target customers (if available)

## Your Tasks (Do these in order)

### 1) Crawl / Inspect & Extract
Analyze the old site and produce:
- A full sitemap (pages + sections)
- A list of all primary goals the site appears to serve (e.g. sell services, generate leads, inform, etc.)
- A content inventory:
  - Headlines, paragraphs, key value propositions, services/products, pricing, testimonials, FAQs, contact info
  - Forms (fields + destinations if visible)
  - CTAs and what each CTA does
- Brand signals:
  - Colors, typography, tone of voice, imagery style, icon style, layout patterns
- Problems to fix:
  - Visual clutter, outdated layout, confusing navigation, inconsistent spacing, poor contrast, missing hierarchy, etc.

**Output format:**
- Use bullet points and tables where helpful.
- Be precise and comprehensive.

### 2) Decide What to Keep vs Improve
Provide:
- “Keep as-is” (content or sections that should stay)
- “Rewrite / refine” (content to tighten, clarify, modernize)
- “Remove” (duplicate, low-value, outdated)
- “Add” (missing but valuable sections: trust signals, clearer CTAs, case studies, etc.)

### 3) New Site Architecture & UX Plan
Propose a modern structure:
- Recommended sitemap (often fewer pages than before)
- Navigation model (top nav, footer nav)
- Page-by-page wire outline (sections in order)
- CTA strategy (primary CTA, secondary CTA)
- Mobile-first layout notes

### 4) Visual Theme Using Images (Moodboard + Direction)
Pick a **cohesive visual theme** and define it using images.

**Deliver:**
- A moodboard direction including:
  - Theme name (e.g. “Clean Nordic”, “Modern Tech Minimal”, “Warm Craft Studio”, etc.)
  - 6–12 example images (links) that represent:
    - Hero imagery style
    - Texture/background style (if any)
    - Photography style (people/product/abstract)
    - Illustration/icon style (if any)
- A matching design system:
  - Color palette (hex codes) including background, surface, primary, secondary, accent, border, text
  - Typography pairings (Google Fonts preferred), with intended usage
  - Spacing scale (e.g. 4/8/12/16/24/32/48/64)
  - Button styles, card styles, form styles
  - Icon style guidance

**Important constraints:**
- Ensure high contrast and accessibility.
- Keep it modern and not “template-y.”
- If the business is local/professional, keep the vibe credible and clean.

### 5) Rebuild Output (Implementation)
Create the rebuilt site in a clean, modern stack.

**Default build option (unless I tell you otherwise):**
- Static site (fast, SEO friendly)
- HTML + modern CSS (or Tailwind) + minimal JS
- Components: navbar, hero, feature sections, cards, testimonials, FAQ accordion, contact form
- Accessibility: semantic HTML, keyboard navigation, ARIA where appropriate
- Performance: optimized images, responsive, minimal JS

**Deliverables:**
1. `/index.html` plus any additional pages you recommend
2. `/styles.css` (or Tailwind config + CSS)
3. `/script.js` (only if needed)
4. `/assets/` folder structure
5. A short README with:
   - How to run locally
   - How to deploy (Netlify/Vercel/GitHub Pages)
   - Notes on customization

### 6) Content Rewrite (If Needed)
If copy is unclear or outdated, rewrite it:
- Keep it concise, modern, benefits-first
- Maintain brand tone (or propose improved tone)
- Provide both:
  - Short version (tight)
  - Long version (if needed for SEO)

### 7) SEO & Analytics Checklist
Provide:
- Title/meta suggestions per page
- OpenGraph + Twitter card suggestions
- Suggested keywords (not spammy)
- Basic schema markup suggestions (LocalBusiness/Organization if relevant)
- Analytics integration placeholder (GA4 or Plausible)

---

## Rules
- Don’t invent facts (pricing, addresses, claims). If missing, use placeholders like: “[Add pricing here]”.
- Preserve critical info (phone, email, location, services) exactly if provided.
- Make the result significantly cleaner, more premium, and easier to use than the original.
- Output code in complete files (no pseudo-code).

---

## Questions (only if essential)
If anything critical is missing, ask up to 5 questions max. Otherwise proceed using best assumptions and clear placeholders.

## Recent fixture data log
- 2026-03-08: Latest results/fixtures were pulled from The FA Full-Time (divisionseason=101823955, teamID=94823525) for Darley Abbey FC First; update `fixtures.html` after each matchday to keep the summary current.
- Store this log here so future runs can quickly find the source without re-scouting.
