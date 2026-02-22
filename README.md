# Darley Abbey FC — Website

Modern website for Darley Abbey FC with a built-in contact API for SMTP email delivery.

## Files

```
/
├── index.html        — Homepage (hero, about, values, blog preview, newsletter, contact)
├── about.html        — Club history, mission, timeline
├── blog.html         — Blog listing with sidebar + AdSense slots
├── blog-post.html    — Article template with in-article AdSense slots
├── styles.css        — All styles (custom properties, responsive, print)
├── script.js         — Mobile nav, scroll header, forms, animations
└── logo.png          — [Add your club logo here]
```

---

## Running Locally

Install dependencies and run the Node server:

```bash
npm install
SMTP_HOST=mail.privateemail.com \
SMTP_PORT=465 \
SMTP_USER=info@darleyabbeyfc.com \
SMTP_PASS=your-password \
CONTACT_TO=info@darleyabbeyfc.com \
npm start
# then open http://localhost:5000

# Contact form posts to /api/contact on this server.
```

### Run Locally (Docker, same approach as Dokku)

```bash
docker build -t dafc-site .
docker run --rm -p 8080:5000 \
  -e SMTP_HOST=mail.privateemail.com \
  -e SMTP_PORT=465 \
  -e SMTP_USER=info@darleyabbeyfc.com \
  -e SMTP_PASS=your-password \
  -e CONTACT_TO=info@darleyabbeyfc.com \
  dafc-site
# then open http://localhost:8080
```

---

## Deploying

### Dokku (VPS)

This repo includes a `Dockerfile`, so Dokku can deploy it directly.

```bash
# On your VPS
dokku apps:create dafc-site

# Optional: set your domain
dokku domains:add dafc-site yourdomain.com
```

```bash
# In this repo on your machine
git remote add dokku dokku@YOUR_VPS_IP:dafc-site
git push dokku main
```

After deploy:

```bash
dokku ps:report dafc-site
dokku logs dafc-site --tail
```

### Netlify (recommended — free)
1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag and drop this entire folder onto the Netlify dashboard
3. Done — live in seconds. Set your custom domain in Site Settings → Domain Management.

### GitHub Pages (free)
1. Push this folder to a GitHub repo
2. Go to Settings → Pages → Source: Deploy from branch → `main` / `/ (root)`
3. Add your custom domain in Settings → Pages → Custom domain

### Vercel (free)
```bash
npm i -g vercel
vercel
```

---

## Setup Checklist

### 1. Add Your Logo
Replace `logo.png` in the root folder with your actual club logo. Recommended: PNG with transparent background, at least 200px tall.

### 2. Set Up Google AdSense
Replace every instance of `[YOUR-ADSENSE-ID]` with your AdSense publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`).

Replace ad slot placeholders:
- `[YOUR-AD-SLOT-LEADERBOARD]` — top banner slot
- `[YOUR-AD-SLOT-BLOG-TOP]` — blog page top
- `[YOUR-AD-SLOT-IN-LIST]` — between blog list items
- `[YOUR-AD-SLOT-IN-ARTICLE]` — in-article ads
- `[YOUR-AD-SLOT-POST-ARTICLE]` — below article
- `[YOUR-AD-SLOT-SIDEBAR]` — sidebar (300×250)
- `[YOUR-AD-SLOT-SIDEBAR-2]` — sticky sidebar

**Note:** AdSense won't show real ads until your site is approved. Add the AdSense script to all pages, publish the site, then apply for approval at [adsense.google.com](https://adsense.google.com).

### 3. Set Up Contact Form
The contact forms submit to `/api/contact` and send through SMTP.

For Dokku, set these config vars:

```bash
dokku config:set dafc-site \
  SMTP_HOST=mail.privateemail.com \
  SMTP_PORT=465 \
  SMTP_USER=info@darleyabbeyfc.com \
  SMTP_PASS=your-password \
  CONTACT_TO=info@darleyabbeyfc.com \
  CONTACT_FROM=info@darleyabbeyfc.com
```

### 4. Set Up Newsletter
Replace the newsletter form handler in `script.js`. Options:
- **Mailchimp** — use their embedded form or API
- **ConvertKit** — free up to 10,000 subscribers
- **Buttondown** — simple and free

### 5. Update Content
Replace all placeholder text and example blog posts with real content. In `blog-post.html`, update:
- `<title>` and `<meta name="description">` per article
- `<link rel="canonical">` URL per article
- `<script type="application/ld+json">` schema data per article
- `article:published_time` meta tag

---

## Blog Monetisation Tips

The domain already ranks — here's how to make the most of it:

1. **Publish consistently** — aim for 2-4 articles per week on Derby football topics
2. **Target long-tail keywords** — "grassroots football Derby", "junior football clubs Derby", "Derby amateur football"
3. **Get AdSense approved early** — apply once you have 10+ quality articles
4. **Build an email list** — newsletter sign-ups compound over time
5. **Internal linking** — link between articles to boost time-on-site
6. **Social sharing** — share every article to the club's Facebook, X, Instagram

### Blog Content Ideas
- Match day guides for Derby parks/venues
- Profiles of local coaches/volunteers
- History of Derby amateur football
- Guide to joining a grassroots club in Derby
- Derbyshire football league previews
- Youth football development in the East Midlands

---

## SEO Notes

- All pages have `<title>`, `<meta description>`, `<link rel="canonical">`, Open Graph, and Twitter Card tags — update these per page
- Schema.org `SportsOrganization` markup is on the homepage
- Schema.org `Article` markup is in `blog-post.html` — duplicate and update per article
- Images: add real photos with descriptive `alt` text for SEO
- Performance: no frameworks, no build tools — loads fast

---

## Customisation

### Colours
Edit CSS custom properties in `styles.css` `:root {}`:
```css
--accent: #16a34a;          /* Green — change to match brand */
--text-primary: #111827;    /* Near-black */
--bg: #ffffff;              /* Page background */
```

### Typography
Fonts are loaded from Google Fonts in each HTML `<head>`. Change the `@import` URL and update `--font-display` / `--font-body` variables in CSS.

### Adding Pages
1. Copy `about.html` as a template
2. Update `<title>`, `<meta>`, and `<link rel="canonical">`
3. Add the page to the nav in all HTML files
4. Add to the footer links

---

## Tech Stack

- **HTML5** — semantic, accessible markup
- **CSS3** — custom properties, grid, flexbox, no frameworks
- **Vanilla JS** — front-end interactions and form submission
- **Node.js + Express** — serves site + contact API endpoint
- **Nodemailer** — SMTP delivery for contact messages
- **Google Fonts** — Outfit (headings) + Inter (body)
- **Google AdSense** — monetisation slots throughout

The website is served by Node in production so contact email works on Dokku.
