# 🍿 Nimco's Namkeen & Sweets — Kids-Friendly Web Experience

> **"Khate Khate Mann Na Bhare!"**  
> 100% Pure Vegetarian 🟢 | Export Quality | Pocket-Friendly ₹5 & ₹10 Treats

A delightful, high-conversion, kids-friendly web experience built for **Nimco's Namkeen & Sweets**, showcasing all 15 authentic product lines from the `assets/` directory with engaging animations, tactile components, interactive arcade mini-games, and transparent nutritional guidance for parents.

---

## 🎨 Kids-Friendly Design System

1. **Cheerful Appetite Color Palette**:
   - **Nimco Red** (`#E5252A`): Core brand identity and primary action color.
   - **Sunshine Gold** (`#FFC300`): Popcorn and butter glow.
   - **Tangerine Orange** (`#FF7B00`): Savory chatpata energy and highlight badges.
   - **Pure Veg Green** (`#25AC4B`): Clean, trustworthy vegetarian certification icon.
   - **Bubblegum Pink & Royal Purple** (`#FF007A`, `#7928CA`): Funky playground accent gradients.
   - **Warm Milk Cream** (`#FFFDF7`): Gentle, appetite-stimulating background surface with subtle micro-dot textures.

2. **Tactile Comic Physics**:
   - 3D tactile pill buttons with solid press shadows (`box-shadow: 0 10px 0 ...`).
   - Bouncy hover animations (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
   - Organic wave SVG dividers and floating sticker badges.

3. **Audio Experience (Web Audio API Synthesizer)**:
   - Built-in zero-dependency sound effects (`js/sound.js`):
     - Bubble Pop on button taps
     - Crisp Crunch sound on adding snacks to the cart or catching snacks in the game
     - Melodic Chimes on quiz completions and coupon unlocks
     - Mute/Unmute state with header toggle and `localStorage` persistence.

4. **Brand Mascot — "Chintu Crunch"**:
   - An adorable golden peanut with a white chef's hat and cheerful anime expressions.
   - Floating interactive widget on every page with random jokes, riddles, and snack tips every few seconds.

---

## 📄 Complete Multi-Page Suite

| Page | File | Description |
|---|---|---|
| **Home** | [`index.html`](index.html) | Hero 3D packaging showcase, mood picker, featured bestsellers, bento grid of parent-kid benefits, live reviews, and fun zone teaser. |
| **Snack Galaxy** | [`products.html`](products.html) | Full categorized catalogue with all 15 products, instant search, category filter tabs, crunch stars, and quick nutrition modals. |
| **Kid's Fun Zone** | [`funzone.html`](funzone.html) | Interactive HTML5 Canvas "Crunch Catcher" arcade game, "What's Your Snack Persona?" quiz, printable coloring pages, and joke flip-cards. |
| **Parents & Nutrition** | [`parents.html`](parents.html) | 100% Pure Veg commitment, touchless nitrogen packaging hygiene, per-serving nutrition table, allergen warnings, and 3 school tiffin combo recipes. |
| **Our Story** | [`about.html`](about.html) | Heritage since 1998, meaning of *"Khate Khate Mann Na Bhare"*, Chintu the mascot backstory, and quality timeline. |
| **Where to Buy & Bulk** | [`contact.html`](contact.html) | Interactive Birthday Party Bulk Calculator (instant savings estimator), Store Locator, Customer Care Hotline, and Dealership application form. |

---

## 🍿 All 15 Authentic Products Integrated

Every product image from the `assets/` folder has been incorporated with authentic details:

1. **Pop Corn** (`assets/pop-corn.png`) — Butter Salted, Super Fluffy
2. **Royal Aloo Bhujia** (`assets/aloo-bhujia.png`) — Export Quality, Crisp Strands
3. **Khatta Meetha Mixture** (`assets/khatta_meetha.jpeg`) — Sweet & Tangy Delight
4. **Tasty Besan Peanuts** (`assets/Tasty.png`) — Double-layer crunch
5. **Masala Peanuts** (`assets/masala_peanuts.png`) — Zesty Indian spices
6. **Salted Peanuts** (`assets/salted_peanuts.png`) — Pure roasted groundnuts
7. **Crispy Moong Dal** (`assets/moong_dal.png`) — Light as air, 5.1g protein
8. **Spicy Chana Dal** (`assets/chana_dal.png`) — Hearty Bengal Gram
9. **Hing Roasted Chana** (`assets/hing_chana.png`) — Aromatic asafoetida & gut-friendly
10. **Chatpata Green Peas (Matar)** (`assets/Matar.png`) — Sweet green peas with tangy spices
11. **Tikha Mitha Mixture** (`assets/tikha_mitha_mix.jpeg`) — Sweet boondi & spicy sev party
12. **Golden Corn Flake Mix** (`assets/corn_mix.jpeg`) — Sun-dried corn crisp with roasted nuts
13. **Dal Chawal Crispy Crunch** (`assets/dal_chawal.jpeg`) — India's comfort staple turned into a light snack
14. **Salted Pope Crispies** (`assets/salted_pope.jpeg`) — Tubular finger puffs
15. **Traditional Jeera Papad** (`assets/jeera-papad.png`) — Handmade thin wafers with whole cumin seeds

---

## 🛒 Interactive Features & Goodies

- **"My Snack Box" Slide-over Cart**:
  - Live count badge, item counter stepper (`+` / `-`).
  - Free gift progress meter: Add ₹199 to unlock a **FREE Butter Popcorn** pack!
  - Promo codes: `CHINTU10` (10% Off), `CRUNCHY20` (20% Off), `FREESNACK`.
  - Confetti cannon celebration on checkout.
- **"Crunch Catcher" Arcade Game**:
  - Keyboard, mouse, and touch drag controls.
  - Combos, score multiplier, 3 heart lives, high scores stored in `localStorage`.
- **School & Birthday Party Calculator**:
  - Automatically calculates total packets based on child count and applies bulk discounts (up to 25% OFF).

---

## 🚀 Running Locally

Open any `.html` file directly in any browser, or run a local HTTP server:

```bash
python -m http.server 8080
```

Then visit:
`http://localhost:8080`

## 🌐 Publish with GitHub Pages

This is a static site; GitHub Actions publishes the files from the repository root whenever you push to the `main` branch.

1. Create an empty repository on GitHub.
2. From this folder, initialize Git if needed, commit the site, add the repository as `origin`, and push the `main` branch:

  ```bash
  git init -b main
  git add .
  git commit -m "Prepare site for GitHub Pages"
  git remote add origin https://github.com/<username>/<repository>.git
  git push -u origin main
  ```

  If Git is already initialized, skip `git init -b main`. If `origin` already exists, update it with `git remote set-url origin <repository-url>` instead of adding it again.
3. In the GitHub repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
4. Check the **Actions** tab for the deployment. GitHub Pages will show the published URL in **Settings → Pages**.
