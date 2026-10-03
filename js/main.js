/* ==========================================================================
   NIMCO'S MAIN UI INTERACTIVITY
   Header scroll, mobile menu, mascot dialog, product modal, quiz & calculators
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initSoundToggle();
  initMascotWidget();
  initProductDetailModal();
  initProductsPage();
  initQuiz();
  initBulkPartyCalculator();
});

/* --------------------------------------------------------------------------
   HEADER & MOBILE MENU
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
      if (window.nimcoSounds) window.nimcoSounds.playPop();
    });

    // Close menu when clicking outside or link
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   SOUND TOGGLE
   -------------------------------------------------------------------------- */
function initSoundToggle() {
  const soundBtns = document.querySelectorAll('.sound-toggle-btn');

  function updateButtons(enabled) {
    soundBtns.forEach(btn => {
      btn.innerHTML = enabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
    });
  }

  if (window.nimcoSounds) {
    updateButtons(window.nimcoSounds.enabled);

    soundBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const isEnabled = window.nimcoSounds.toggle();
        updateButtons(isEnabled);
      });
    });
  }
}

/* --------------------------------------------------------------------------
   FLOATING MASCOT WIDGET (CHINTU CRUNCH)
   -------------------------------------------------------------------------- */
const MASCOT_MESSAGES = [
  "Psst! Have you tasted Butter Popcorn yet? It's so fluffy! 🍿",
  "Aloo Bhujia is crispy perfection in every single strand! 🥔✨",
  "Khatta Meetha means sweet and tangy at the exact same moment! 🍋🍬",
  "Moong Dal gives you super energy for playground games! 💪",
  "Why did the peanut go to outer space? To visit the Milky Way! 🌌🥜",
  "100% Pure Veggie goodness in every single Nimco packet! 🟢",
  "Need snacks for a birthday party? Check out our Bulk Order tool! 🎂🎉",
  "Beat the high score in our Crunch Catcher arcade game! 🎮🏆",
  "Only ₹5 for pure happiness! What a sweet treat! 🪙",
  "Khate Khate Mann Na Bhare! That's the Nimco promise! ❤️"
];

function initMascotWidget() {
  const mascotAvatar = document.getElementById('mascotAvatarBtn');
  const mascotBubble = document.getElementById('mascotSpeechBubble');

  if (!mascotAvatar || !mascotBubble) return;

  function showRandomMessage() {
    const randomMsg = MASCOT_MESSAGES[Math.floor(Math.random() * MASCOT_MESSAGES.length)];
    mascotBubble.textContent = randomMsg;
    mascotBubble.classList.add('visible');

    setTimeout(() => {
      mascotBubble.classList.remove('visible');
    }, 4500);
  }

  // Show periodic messages
  setTimeout(showRandomMessage, 2000);
  setInterval(showRandomMessage, 14000);

  // Click on mascot
  mascotAvatar.addEventListener('click', () => {
    if (window.nimcoSounds) window.nimcoSounds.playPop();
    showRandomMessage();
  });
}

/* --------------------------------------------------------------------------
   PRODUCT DETAIL & NUTRITION MODAL
   -------------------------------------------------------------------------- */
function initProductDetailModal() {
  const modalBackdrop = document.getElementById('productModal');
  if (!modalBackdrop) return;

  const closeBtn = modalBackdrop.querySelector('.modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal());
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  function closeModal() {
    modalBackdrop.classList.remove('open');
    if (window.nimcoSounds) window.nimcoSounds.playPop();
  }

  // Global listener for Quick View buttons
  document.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('.btn-quick-view');
    if (viewBtn) {
      const productId = viewBtn.dataset.productId;
      openProductModal(productId);
    }
  });
}

function openProductModal(productId) {
  const product = window.NIMCO_PRODUCTS ? window.NIMCO_PRODUCTS.find(p => p.id === productId) : null;
  const modalBackdrop = document.getElementById('productModal');
  const modalBody = document.getElementById('productModalBody');

  if (!product || !modalBackdrop || !modalBody) return;

  modalBody.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1.3fr; gap: 30px; align-items: center;">
      <div style="background: ${product.accentColor}; border-radius: 24px; padding: 20px; text-align: center; border: 2.5px solid #F0DFC2;">
        <img src="${product.image}" alt="${product.name}" style="max-height: 280px; margin: 0 auto; filter: drop-shadow(0 15px 25px rgba(0,0,0,0.15));">
        <div style="margin-top: 14px; display: inline-flex; align-items: center; gap: 6px; font-weight: 700; color: #25AC4B; background: #FFF; padding: 4px 12px; border-radius: 999px;">
          <span class="veg-badge"></span> 100% Pure Vegetarian
        </div>
      </div>

      <div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
          <span class="flavor-chip">${product.categoryLabel}</span>
          <span style="font-weight: 800; color: #E5252A; font-size: 1.25rem;">₹${product.price} <small style="font-size: 0.85rem; color: #666;">(${product.packWeight})</small></span>
        </div>
        
        <h3 style="font-size: 1.8rem; margin-bottom: 6px; line-height: 1.2;">${product.name}</h3>
        <p style="color: #FF7B00; font-weight: 700; font-size: 0.95rem; margin-bottom: 14px;">"${product.tagline}"</p>
        <p style="color: #555; font-size: 0.95rem; line-height: 1.6; margin-bottom: 18px;">${product.desc}</p>

        <!-- Fun Kid Fact Box -->
        <div style="background: #FFF9E6; border: 2px dashed #FFC300; border-radius: 16px; padding: 12px 16px; margin-bottom: 20px;">
          <div style="font-size: 0.82rem; font-weight: 800; color: #B38600; text-transform: uppercase;">🌟 Fun Snack Fact for Kids:</div>
          <div style="font-size: 0.92rem; font-weight: 600; color: #333; margin-top: 2px;">${product.kidFact}</div>
        </div>

        <!-- Nutrition Facts Grid -->
        <div style="background: #FAFAFA; border: 1.5px solid #EEE; border-radius: 16px; padding: 14px; margin-bottom: 22px;">
          <div style="font-weight: 700; font-size: 0.85rem; color: #666; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Nutrition Per Serving (${product.packWeight}):</div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center;">
            <div style="background: #FFF; padding: 6px; border-radius: 8px; border: 1px solid #E5E5E5;">
              <span style="font-size: 0.72rem; color: #888; display: block;">Energy</span>
              <strong style="font-size: 0.9rem; color: #E5252A;">${product.nutrition.calories}</strong>
            </div>
            <div style="background: #FFF; padding: 6px; border-radius: 8px; border: 1px solid #E5E5E5;">
              <span style="font-size: 0.72rem; color: #888; display: block;">Protein</span>
              <strong style="font-size: 0.9rem; color: #25AC4B;">${product.nutrition.protein}</strong>
            </div>
            <div style="background: #FFF; padding: 6px; border-radius: 8px; border: 1px solid #E5E5E5;">
              <span style="font-size: 0.72rem; color: #888; display: block;">Carbs</span>
              <strong style="font-size: 0.9rem; color: #FF7B00;">${product.nutrition.carbs}</strong>
            </div>
            <div style="background: #FFF; padding: 6px; border-radius: 8px; border: 1px solid #E5E5E5;">
              <span style="font-size: 0.72rem; color: #888; display: block;">Crunch</span>
              <strong style="font-size: 0.9rem; color: #6B11FF;">${'⭐'.repeat(product.crunchStars)}</strong>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 14px;">
          <button class="btn btn-primary btn-add-snack" data-product-id="${product.id}" style="flex: 1;">
            🛒 Add to Snack Box
          </button>
        </div>
      </div>
    </div>
  `;

  modalBackdrop.classList.add('open');
  if (window.nimcoSounds) window.nimcoSounds.playPop();
}

/* --------------------------------------------------------------------------
   PRODUCTS CATALOGUE (PRODUCTS.HTML & HOME PREVIEWS)
   -------------------------------------------------------------------------- */
function renderProductCard(product) {
  const stars = '⭐'.repeat(product.crunchStars);
  return `
    <div class="snack-card" style="--card-accent: ${product.accentColor};" data-category="${product.category}">
      <div class="card-top-row">
        <span class="veg-badge" title="100% Pure Veg"></span>
        <span class="price-tag">₹${product.price} Only</span>
      </div>

      <div class="product-img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>

      <div class="product-info">
        <span class="snack-tagline">${product.tagline}</span>
        <h4 class="snack-title">${product.name}</h4>
        <p class="snack-desc">${product.desc}</p>
        
        <div class="crunch-rating">
          <span class="crunch-stars">${stars}</span>
          <span>${product.crunchLevel}</span>
        </div>

        <div class="card-actions-row">
          <button class="btn-add-snack" data-product-id="${product.id}">
            <span>+ Add to Box</span>
          </button>
          <button class="btn-quick-view" data-product-id="${product.id}" title="Quick Nutrition & Trivia">
            🔍
          </button>
        </div>
      </div>
    </div>
  `;
}

function initProductsPage() {
  const container = document.getElementById('allProductsGrid');
  const homeFeaturedContainer = document.getElementById('featuredProductsGrid');
  const filterTabs = document.querySelectorAll('.product-filter-btn');
  const searchInput = document.getElementById('productSearchInput');

  // Render on All Products grid
  if (container && window.NIMCO_PRODUCTS) {
    function filterAndRender() {
      const activeFilter = document.querySelector('.product-filter-btn.active')?.dataset.filter || 'all';
      const query = (searchInput?.value || '').toLowerCase().trim();

      const filtered = window.NIMCO_PRODUCTS.filter(p => {
        const matchesCategory = activeFilter === 'all' || p.category === activeFilter;
        const matchesSearch = !query || 
          p.name.toLowerCase().includes(query) || 
          p.tagline.toLowerCase().includes(query) ||
          p.flavorTags.some(t => t.toLowerCase().includes(query));
        return matchesCategory && matchesSearch;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <div style="font-size: 3.5rem; margin-bottom: 12px;">🍿🔍</div>
            <h3 style="font-size: 1.8rem; margin-bottom: 8px;">No snacks found!</h3>
            <p style="color: #666;">Try searching for "Popcorn", "Peanut", or "Aloo Bhujia".</p>
          </div>
        `;
      } else {
        container.innerHTML = filtered.map(renderProductCard).join('');
      }
    }

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (window.nimcoSounds) window.nimcoSounds.playPop();
        filterAndRender();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', () => filterAndRender());
    }

    filterAndRender();
  }

  // Render on Homepage Featured row
  if (homeFeaturedContainer && window.NIMCO_PRODUCTS) {
    const featuredIds = ['pop-corn', 'aloo-bhujia', 'khatta-meetha', 'tasty-peanuts'];
    const featured = window.NIMCO_PRODUCTS.filter(p => featuredIds.includes(p.id));
    homeFeaturedContainer.innerHTML = featured.map(renderProductCard).join('');
  }
}

/* --------------------------------------------------------------------------
   INTERACTIVE SNACK PERSONA QUIZ (FUNZONE.HTML)
   -------------------------------------------------------------------------- */
const QUIZ_QUESTIONS = [
  {
    q: "When is your absolute favorite time to munch on crunchy snacks?",
    options: [
      { text: "During cartoons or superhero movies! 🎬", snack: "pop-corn" },
      { text: "Right after coming home from school! 🎒", snack: "aloo-bhujia" },
      { text: "On weekend family road trips & picnics! 🚗", snack: "khatta-meetha" },
      { text: "During intense playground cricket matches! 🏏", snack: "tasty-peanuts" }
    ]
  },
  {
    q: "What flavor superpower makes your tastebuds dance?",
    options: [
      { text: "Creamy warm butter with a touch of salt! 🧈", snack: "pop-corn" },
      { text: "Crispy potato strands with secret mint masala! 🌿", snack: "aloo-bhujia" },
      { text: "Sweet & tangy zip that tickles your tongue! 🍋🍬", snack: "khatta-meetha" },
      { text: "Mega-crunchy nutty besan power! 🥜⚡", snack: "tasty-peanuts" }
    ]
  },
  {
    q: "If you had a superpower in school, what would it be?",
    options: [
      { text: "Bouncing high like a cloud! ☁️", snack: "pop-corn" },
      { text: "Super lightning speed! ⚡", snack: "aloo-bhujia" },
      { text: "Spreading non-stop laughter and fun! 😂", snack: "khatta-meetha" },
      { text: "Super strength and unbreakable stamina! 🦾", snack: "tasty-peanuts" }
    ]
  }
];

function initQuiz() {
  const quizContainer = document.getElementById('snackQuizBox');
  if (!quizContainer) return;

  let currentStep = 0;
  const scores = { "pop-corn": 0, "aloo-bhujia": 0, "khatta-meetha": 0, "tasty-peanuts": 0 };

  function renderStep() {
    if (currentStep < QUIZ_QUESTIONS.length) {
      const q = QUIZ_QUESTIONS[currentStep];
      quizContainer.innerHTML = `
        <div style="max-width: 620px; margin: 0 auto; text-align: center;">
          <div style="font-family: var(--font-display); font-size: 1rem; color: #FF7B00; margin-bottom: 10px; font-weight: 700;">
            Question ${currentStep + 1} of ${QUIZ_QUESTIONS.length} 🎈
          </div>
          <h3 style="font-size: 1.8rem; margin-bottom: 24px; color: var(--text-main);">${q.q}</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${q.options.map((opt, i) => `
              <button class="quiz-opt-btn btn-outline" data-snack="${opt.snack}" style="border-radius: 18px; padding: 14px 20px; font-size: 1.05rem; justify-content: flex-start; text-align: left;">
                ${opt.text}
              </button>
            `).join('')}
          </div>
        </div>
      `;

      quizContainer.querySelectorAll('.quiz-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const snackKey = btn.dataset.snack;
          scores[snackKey] = (scores[snackKey] || 0) + 1;
          if (window.nimcoSounds) window.nimcoSounds.playCrunch();
          currentStep++;
          renderStep();
        });
      });
    } else {
      // Show result
      let highestKey = 'pop-corn';
      let highestScore = -1;
      for (const [key, val] of Object.entries(scores)) {
        if (val > highestScore) {
          highestScore = val;
          highestKey = key;
        }
      }

      const match = window.NIMCO_PRODUCTS.find(p => p.id === highestKey) || window.NIMCO_PRODUCTS[0];

      quizContainer.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto; text-align: center; background: #FFF9E6; border: 3px solid #FFC300; border-radius: 28px; padding: 36px 24px; box-shadow: 0 10px 0 #E2AC00;">
          <div style="font-size: 3.5rem; margin-bottom: 8px;">🎉🏆✨</div>
          <div style="font-family: var(--font-display); font-size: 1.1rem; color: #8A6500; font-weight: 700;">YOUR SNACK ALTER-EGO IS:</div>
          <h2 style="font-size: 2.2rem; color: #E5252A; margin: 8px 0 16px;">${match.name}!</h2>
          <img src="${match.image}" alt="${match.name}" style="max-height: 220px; margin: 0 auto 16px; filter: drop-shadow(0 15px 20px rgba(0,0,0,0.15));">
          <p style="font-size: 1.1rem; color: #444; margin-bottom: 24px; line-height: 1.5;">${match.tagline} You bring crunch, energy, and smiles wherever you go!</p>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button class="btn btn-primary btn-add-snack" data-product-id="${match.id}">
              Add My Match to Box 🛒
            </button>
            <button class="btn btn-outline" id="retakeQuizBtn">
              Retake Quiz 🔄
            </button>
          </div>
        </div>
      `;

      if (window.nimcoSounds) window.nimcoSounds.playChime();

      document.getElementById('retakeQuizBtn')?.addEventListener('click', () => {
        currentStep = 0;
        scores["pop-corn"] = 0;
        scores["aloo-bhujia"] = 0;
        scores["khatta-meetha"] = 0;
        scores["tasty-peanuts"] = 0;
        renderStep();
      });
    }
  }

  renderStep();
}

/* --------------------------------------------------------------------------
   BULK PARTY ORDER CALCULATOR (CONTACT.HTML)
   -------------------------------------------------------------------------- */
function initBulkPartyCalculator() {
  const kidsCountInput = document.getElementById('bulkKidsCount');
  const packTypeSelect = document.getElementById('bulkPackType');
  const resultPacksEl = document.getElementById('calcTotalPacks');
  const resultCostEl = document.getElementById('calcTotalCost');
  const resultSavingsEl = document.getElementById('calcTotalSavings');

  if (!kidsCountInput || !packTypeSelect) return;

  function calculate() {
    const kids = parseInt(kidsCountInput.value || '20', 10);
    const packsPerKid = 2; // Recommended 2 snack packs per kid
    const totalPacks = kids * packsPerKid;

    const unitPrice = parseFloat(packTypeSelect.value || '5');
    const baseCost = totalPacks * unitPrice;
    
    // Bulk discount: 15% off for 50+ packs, 25% off for 100+ packs
    let discountRate = 0.10;
    if (totalPacks >= 100) discountRate = 0.25;
    else if (totalPacks >= 50) discountRate = 0.15;

    const savings = Math.round(baseCost * discountRate);
    const finalCost = baseCost - savings;

    if (resultPacksEl) resultPacksEl.textContent = `${totalPacks} Packs`;
    if (resultCostEl) resultCostEl.textContent = `₹${finalCost}`;
    if (resultSavingsEl) resultSavingsEl.textContent = `You Save ₹${savings} (${Math.round(discountRate * 100)}% Party Discount!)`;
  }

  kidsCountInput.addEventListener('input', calculate);
  packTypeSelect.addEventListener('change', calculate);
  calculate();
}
