# Professional Brand Redesign (Bikano-Inspired) Implementation Plan

> **For Agent:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Design Read:** Reading this as an Indian packaged foods & FMCG brand web experience (inspired by Bikano.com) for consumers, retailers, and distributors, with a bold appetite-appeal and professional heritage language, leaning toward responsive Vanilla CSS + Plus Jakarta Sans/Poppins + clean interactive components.

**Dials:** `DESIGN_VARIANCE: 6` | `MOTION_INTENSITY: 4` | `VISUAL_DENSITY: 4`

**Goal:** Transform the Nimco's website from a cartoonish, emoji-heavy, AI-generated prototype into a sleek, authentic, professional FMCG brand experience inspired by Bikano.com: remove the top ticker bar and sound synthesizer, remove the Kid's Fun Zone, remove the Parents & Nutrition section, eliminate all AI slop (floating mascots, comic physics, procedural audio, em-dashes, cartoon stickers), and deliver a mobile-optimized, high-conversion multi-page experience.

**Architecture:** Static multi-page website with four core pages (`index.html`, `products.html`, `about.html`, `contact.html`). A unified CSS design system (`css/style.css` and `css/craveable.css`) providing modern typography, professional FMCG color palette, refined responsive grids, and clean component states. Interactive JavaScript modules for category filtering, the Bikano-style 3D craveable carousel, and a streamlined Snack Box inquiry drawer.

**Tech Stack:** Semantic HTML5, Vanilla CSS3 (CSS Custom Properties, Flexbox, Grid, backdrop blur), Vanilla ES6+ JavaScript, Responsive Mobile First (320px to 4K).

---

### Task 1: Clean Up Retired Pages & Sound Synthesizer AI Slop

**Files:**
- Remove: `funzone.html`
- Remove: `parents.html`
- Remove: `js/game.js`
- Remove: `js/sound.js`
- Modify: `README.md`

**Step 1: Delete retired HTML pages and game/sound scripts**
- Delete `funzone.html` (Kid's Fun Zone)
- Delete `parents.html` (Parents & Nutrition)
- Delete `js/game.js` (Canvas game)
- Delete `js/sound.js` (Web Audio API sound generator)

**Step 2: Update README.md**
- Update project documentation to reflect the professional 4-page site structure:
  1. Home (`index.html`)
  2. Our Range (`products.html`)
  3. Our Story (`about.html`)
  4. Reach Us / Distributors (`contact.html`)
- Remove references to sound effects, mascot jokes, and arcade games.

**Step 3: Verify clean directory state**
- Verify files are removed and no broken references remain in repository root.

---

### Task 2: Refactor Design Tokens & Typography in `css/style.css`

**Files:**
- Modify: `css/style.css`

**Step 1: Update Font Family & Color Palette**
- Replace Google Fonts import: Load `Plus Jakarta Sans` (400, 500, 600, 700, 800) and `Poppins` (600, 700, 800) for clean editorial FMCG typography. Remove `Bubblegum Sans`.
- Refine brand color palette:
  - Primary Brand Red: `#B81D24` (deep, appetizing royal red)
  - Secondary Crimson: `#921218`
  - Accent Gold: `#FEC33F` / `#F59E0B` (rich snack gold)
  - Neutral Dark: `#181615` (deep charcoal text)
  - Neutral Muted: `#5C5854` (body copy)
  - Warm Surface: `#FAF7F2` (clean ivory background)
  - Pure White: `#FFFFFF`
  - Vegetarian Green: `#1E8E3E`
- Remove comic button shadows (`--shadow-red-pop`, `--shadow-comic`, 3D chunky 10px push offsets).
- Introduce sleek, modern box shadows (`0 4px 20px rgba(0,0,0,0.06)`, `0 12px 32px rgba(184,29,36,0.12)`).

**Step 2: Remove AI Slop Styles**
- Remove all CSS rules for:
  - `.top-ticker` (top announcement bar)
  - `.sound-toggle-btn` (sound switch)
  - `.mascot-head-icon`, `.mascot-widget`, `.mascot-bubble` (floating peanut character)
  - `.fun-sticker` (comic stickers like "Super Fluffy!")
  - Kid's arcade game canvas classes

**Step 3: Professionalize Buttons, Navigation, and Badges**
- Convert `.btn` styles from chunky cartoon pills to sleek FMCG buttons with subtle lift, rounded corners (8px to 12px or clean pill), refined padding, and crisp typography.
- Standardize header navigation: Bikano-style floating pill bar or clean sticky glassmorphic header with uppercase links (`HOME`, `OUR RANGE`, `OUR STORY`, `CONTACT US`), no emojis in navigation.

---

### Task 3: Overhaul Home Page (`index.html`) to Bikano Standards

**Files:**
- Modify: `index.html`

**Step 1: Remove Top Ticker & Sound Toggle**
- Remove `<aside class="top-ticker">` completely.
- Remove sound toggle buttons.

**Step 2: Redesign Site Header & Navigation**
- Clean professional header:
  - Brand Logo: "Nimco's" with subtitle "Namkeen & Sweets | Est. 1998"
  - Main Navigation without emojis: `Home`, `Our Range`, `Our Story`, `Contact`
  - Action button: Clean "Quick Order / Snack Box" button with bag icon.
  - Responsive mobile drawer toggle.

**Step 3: Redesign Hero Section (Bikano-Inspired)**
- Remove cartoon stickers (`Super Fluffy!`, `Only ₹5!`, floating peanut mascot pill).
- Create a bold FMCG visual hero:
  - Strong, appetizing typography:
    - Eyebrow: `TRADITIONAL FLAVOURS, MODERN CRUNCH`
    - Headline: `Barson Ki Shaan, Har Pal Ka Swaad.` (Crispy & Authentic Namkeen)
    - Subtext: `Crafted from 100% pure vegetarian ingredients, farm-fresh pulses, and royal Indian spices. Export-quality snacks packed with hygienic freshness.`
  - Direct CTAs:
    - Primary: `Explore Our Range ➔` (links to `products.html`)
    - Secondary: `Bulk & Dealership Inquiries` (links to `contact.html`)
  - Hero pack visual: Elegant presentation of authentic product packs (`assets/aloo-bhujia.png`, `assets/khatta_meetha.jpeg`, `assets/pop-corn.png`) on clean soft radial glow without childish bouncy comic frames.

**Step 4: Refine "All Things Craveable" Section**
- Maintain the Bikano-style horizontal craveable product showcase, updated with refined styling:
  - Clean title: `All Things Craveable`
  - Professional category tabs: `All Munchies`, `Bestsellers`, `Peanuts & Cashews`, `Crunchy Dals`, `Sweet & Tangy Mixes`, `Papad & Savouries`
  - Clean navigation arrows and pack cards with actual pack weight, price (`₹5 / ₹10`), and direct "Add to Box" action.

**Step 5: Add "Certified by & Quality Standards" Section (Bikano Pattern)**
- Add a quality credentials banner:
  - 100% Pure Vegetarian certification mark 🟢
  - Nitrogen Flush Freshness packaging
  - Zero Trans Fat & No Artificial Colors
  - Export Quality Standard Hygiene
  - FSSAI Compliant Manufacturing

**Step 6: Add Quick Commerce "Available On" Section (Bikano Pattern)**
- "Order Your Favourites On" section highlighting availability on leading quick-commerce & retail partners (Blinkit, Zepto, Swiggy Instamart, Amazon, Local Supermarkets).

**Step 7: Clean Brand Footer**
- Professional FMCG footer with company address, quick links, product categories, business hours, dealership link, and copyright notice. Zero em-dashes.

---

### Task 4: Streamline "Our Range" Products Page (`products.html`)

**Files:**
- Modify: `products.html`

**Step 1: Clean Up Header & Navigation**
- Remove top ticker bar and sound switch.
- Standardize header navigation to match `index.html`.

**Step 2: Professionalize Hero & Filtering Controls**
- Replace "Snack Galaxy 🚀" with "Our Range: Authentic Indian Namkeen & Snacks".
- Professional filter tabs without emojis:
  - `All Snacks (15)`
  - `Bestsellers`
  - `Savouries & Sev`
  - `Peanuts & Groundnuts`
  - `Pulses & Dals`
  - `Traditional Papad`
- Clean search input with search icon and live filter counter.

**Step 3: Refactor Product Cards & Modal**
- Clean product cards: high-res pack image on white/subtle-tint background, pack weight (`25g / 35g`), price badge (`₹5 / ₹10`), taste profile tags, and clean "View Nutrition" / "Add to Box" buttons.
- Modern slide-in/modal drawer for ingredients and nutritional facts (calories, protein, carbs, fats) presented in a clean spec table rather than childish comic dialogs.

---

### Task 5: Refactor "Our Story" (`about.html`) and "Contact / Reach Us" (`contact.html`)

**Files:**
- Modify: `about.html`
- Modify: `contact.html`

**Step 1: Clean Up Headers & Navigation in both pages**
- Remove top ticker bar and sound toggle.
- Standardize navigation across all pages.

**Step 2: Modernize `about.html`**
- Remove mascot "Chintu Crunch" cartoon backstory and emojis.
- Focus on authentic FMCG heritage:
  - Established in 1998, rooted in authentic Indian taste.
  - The philosophy of *"Khate Khate Mann Na Bhare"* (uncompromising craveable taste).
  - Modern automated manufacturing, contactless nitrogen packaging, and export-grade sourcing.
  - Mission & quality pillars.

**Step 3: Modernize `contact.html`**
- Remove cartoonish party calculator elements.
- Professional layout inspired by Bikano's "Reach Us" & "Become a Distributor":
  - Direct inquiry form with tabs: `General Inquiry`, `Distributor / Super-Stockist`, `Bulk & Corporate Orders`.
  - Corporate Office & Factory location details.
  - Customer Care phone, email, and business hours.
  - Distribution inquiry flow.

---

### Task 6: Update JavaScript Controllers (`js/main.js`, `js/cart.js`, `js/products-data.js`)

**Files:**
- Modify: `js/main.js`
- Modify: `js/cart.js`
- Modify: `js/products-data.js`
- Modify: `js/craveable-slider.js`

**Step 1: Clean Up `js/main.js`**
- Remove all sound triggers (`window.nimcoSounds.playPop()`, etc.).
- Remove floating mascot widget controller and random joke timer loop.
- Remove quiz and arcade game initialization.
- Keep clean header scroll behavior, mobile drawer toggle, modal controllers, and search filters.

**Step 2: Clean Up `js/cart.js`**
- Remove sound synthesis triggers.
- Retain clean Snack Box inquiry & order estimation drawer.
- Remove arcade confetti blasts, replace with clean order confirmation modal.

**Step 3: Clean Up `js/products-data.js`**
- Remove childish tags, emojis, and mascot quotes.
- Standardize categories: `bestsellers`, `savouries`, `peanuts`, `dals`, `papad`.
- Ensure accurate descriptions, weights, ingredients, and nutrition facts.

**Step 4: Clean Up `js/craveable-slider.js`**
- Remove sound calls.
- Optimize slider touch events and desktop drag transitions.

---

### Task 7: Comprehensive Mobile Optimization & Cross-Screen Testing

**Files:**
- Modify: `css/style.css`
- Modify: `css/craveable.css`

**Step 1: Mobile & Responsive Polish**
- Test breakpoints: 360px (compact mobile), 414px (standard mobile), 768px (tablet), 1024px (laptop), 1440px (desktop).
- Ensure no horizontal scrolling or overflow on mobile devices.
- Verify touch targets (buttons at least 44px min height).
- Verify mobile navigation drawer opens and closes smoothly.
- Ensure product cards grid scales cleanly (1 col on mobile, 2 col on tablet, 3-4 col on desktop).

---

### Task 8: Pre-Flight Anti-Slop Audit

**Files:**
- Audit all HTML, CSS, JS files against `taste-skill` Section 14:
  - [x] Zero em-dashes (`—`) in visible text.
  - [x] No childish emojis in headings, navigation, or buttons.
  - [x] No fake sound effects or cartoon popup widgets.
  - [x] Navigation on a single line at desktop.
  - [x] Colors locked to brand palette (Deep Red, Gold, White, Ivory, Charcoal).
  - [x] WCAG AA contrast on all CTA buttons and text elements.
  - [x] Viewport stability (`min-h-[100dvh]`).
