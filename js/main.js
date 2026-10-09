/* ==========================================================================
   NIMCO'S MAIN UI INTERACTIVITY (PROFESSIONAL FMCG EDITION)
   - Header scroll effects & responsive mobile navigation drawer
   - High-end FMCG product card rendering (clean elevation & zero gimmicks)
   - Comprehensive nutritional specifications modal
   - Live category filtration & real-time search
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeroBackgroundVideo();
  initProductDetailModal();
  initProductsPage();
});

/* --------------------------------------------------------------------------
   AMBIENT HERO BACKGROUND VIDEO (WEB-OPTIMIZED, ZERO-AUDIO, AUTO-PLAY, POWER-AWARE)
   -------------------------------------------------------------------------- */
function initHeroBackgroundVideo() {
  const video = document.getElementById('heroBgVideo');
  const heroSection = document.getElementById('heroSection');
  if (!video) return;

  // Strictly enforce zero audio across all browsers
  video.muted = true;
  video.volume = 0;

  // Respect user prefers-reduced-motion accessibility preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    video.pause();
    return;
  }

  // Attempt seamless autoplay
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Fallback: retry on first interaction if power-saver active
      const playOnInteract = () => {
        video.play().catch(() => {});
      };
      document.addEventListener('click', playOnInteract, { once: true });
      document.addEventListener('touchstart', playOnInteract, { once: true });
    });
  }

  // Performance Optimization: Pause video when scrolled out of view to save CPU/GPU
  if ('IntersectionObserver' in window && heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (video.paused && !prefersReducedMotion) {
            video.play().catch(() => {});
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      });
    }, { threshold: 0.08 });

    observer.observe(heroSection);
  }
}

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
    }, { passive: true });
  }

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
      }
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }
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
  }

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
    <div class="product-modal-grid">
      <div class="modal-pack-showcase" style="background: ${product.accentColor || '#FAF7F2'};">
        <span class="modal-flavor-badge">
          ${product.flavorHeroBadge || product.badge}
        </span>
        <img src="${product.image}" alt="${product.name}" class="modal-packet-img">
        <div class="modal-veg-pill">
          <span class="veg-badge"></span> 100% Pure Vegetarian
        </div>
      </div>

      <div class="modal-details-col">
        <div class="modal-header-meta">
          <span class="flavor-chip">${product.categoryLabel}</span>
          <span class="modal-price">₹${product.price} <small>(${product.packWeight})</small></span>
        </div>
        
        <h3 class="modal-title">${product.name}</h3>
        <p class="modal-tagline">"${product.tagline}"</p>
        <p class="modal-desc">${product.desc}</p>

        <!-- Culinary & Ingredient Notes -->
        <div class="modal-moment-callout">
          <div>
            <strong>Culinary Standards:</strong>
            <p>${product.culinaryNote || product.desc}</p>
          </div>
        </div>

        <!-- Flavor Profile Metrics -->
        <div class="modal-flavor-breakdown">
          <div class="flavor-meter-row">
            <span>Crunch Index:</span>
            <div class="meter-bar"><div class="meter-fill" style="width: ${product.flavorProfile.crunch * 20}%;"></div></div>
            <strong>${product.flavorProfile.crunch}/5</strong>
          </div>
          <div class="flavor-meter-row">
            <span>Spice Balance:</span>
            <div class="meter-bar"><div class="meter-fill" style="width: ${product.flavorProfile.spice * 20}%;"></div></div>
            <strong>${product.flavorProfile.spice}/5</strong>
          </div>
          <div class="flavor-meter-row">
            <span>Tangy Note:</span>
            <div class="meter-bar"><div class="meter-fill" style="width: ${product.flavorProfile.tangy * 20}%;"></div></div>
            <strong>${product.flavorProfile.tangy}/5</strong>
          </div>
        </div>

        <!-- Nutrition Facts Grid -->
        <div class="modal-nutrition-card">
          <div class="nutrition-header">Nutritional Values per Pack (${product.packWeight}):</div>
          <div class="nutrition-quad-grid">
            <div class="nutrition-quad-cell">
              <span>Energy</span>
              <strong>${product.nutrition.calories}</strong>
            </div>
            <div class="nutrition-quad-cell">
              <span>Protein</span>
              <strong style="color: #1E7E34;">${product.nutrition.protein}</strong>
            </div>
            <div class="nutrition-quad-cell">
              <span>Carbohydrates</span>
              <strong style="color: #D97706;">${product.nutrition.carbs}</strong>
            </div>
            <div class="nutrition-quad-cell">
              <span>Dietary Fiber</span>
              <strong style="color: #4F46E5;">${product.nutrition.fiber}</strong>
            </div>
          </div>
        </div>

        <!-- Ingredients statement -->
        <div class="modal-ingredients-text">
          <strong>Ingredients:</strong> ${product.ingredients}
        </div>

        <div>
          <button class="btn btn-primary btn-add-snack" data-product-id="${product.id}" style="width: 100%; font-size: 1rem; padding: 13px 20px;">
            Add to Snack Box (₹${product.price})
          </button>
        </div>
      </div>
    </div>
  `;

  modalBackdrop.classList.add('open');
}

/* --------------------------------------------------------------------------
   CLEAN FMCG PRODUCT CARD RENDERING
   -------------------------------------------------------------------------- */
function renderProductCard(product) {
  return `
    <div class="snack-card" data-category="${product.category}">
      <div class="card-top-row">
        <span class="flavor-badge-pill">
          ${product.flavorHeroBadge || product.badge}
        </span>
        <span class="price-tag">₹${product.price}</span>
      </div>

      <div class="product-img-wrap" onclick="openProductModal('${product.id}')" title="Click to view nutritional specifications">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>

      <div class="product-info">
        <div class="snack-meta-chips">
          <span class="veg-badge" title="100% Pure Vegetarian"></span>
          <span class="weight-chip">${product.packWeight}</span>
          <span class="crunch-mini-pill">${product.crunchLevel}</span>
        </div>

        <h4 class="snack-title">${product.name}</h4>
        <p class="snack-funbite">${product.funBite || product.desc}</p>
        
        <div class="card-actions-row">
          <button class="btn-add-snack" data-product-id="${product.id}" title="Add pack to your Snack Box">
            Add to Box
          </button>
          <button class="btn-quick-view" data-product-id="${product.id}" title="View ingredients and nutrition facts">
            Details
          </button>
        </div>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   PRODUCTS CATALOGUE (PRODUCTS.HTML & HOME PREVIEWS)
   -------------------------------------------------------------------------- */
function initProductsPage() {
  const container = document.getElementById('allProductsGrid');
  const homeFeaturedContainer = document.getElementById('featuredProductsGrid');
  const filterTabs = document.querySelectorAll('.product-filter-btn');
  const searchInput = document.getElementById('productSearchInput');

  if (container && window.NIMCO_PRODUCTS) {
    function filterAndRender() {
      const activeFilter = document.querySelector('.product-filter-btn.active')?.dataset.filter || 'all';
      const query = (searchInput?.value || '').toLowerCase().trim();

      const filtered = window.NIMCO_PRODUCTS.filter(p => {
        let matchesCategory = false;
        if (activeFilter === 'all') {
          matchesCategory = true;
        } else if (activeFilter === 'bestsellers') {
          matchesCategory = p.category === 'bestsellers' || p.badge === 'Bestseller';
        } else {
          matchesCategory = p.category === activeFilter;
        }

        const matchesSearch = !query || 
          p.name.toLowerCase().includes(query) || 
          p.tagline.toLowerCase().includes(query) ||
          p.desc.toLowerCase().includes(query) ||
          (p.flavorHeroBadge && p.flavorHeroBadge.toLowerCase().includes(query)) ||
          p.flavorTags.some(t => t.toLowerCase().includes(query));

        return matchesCategory && matchesSearch;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #FFFFFF; border-radius: 16px; border: 1.5px dashed var(--border-medium);">
            <h3 style="font-size: 1.3rem; margin-bottom: 8px; color: var(--text-main);">No matching products found</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 16px;">Try searching for "Popcorn", "Peanut", "Aloo Bhujia", or "Papad".</p>
            <button class="btn btn-outline btn-sm" onclick="document.getElementById('productSearchInput').value=''; document.querySelector('.product-filter-btn[data-filter=all]').click();">
              View All 15 Products
            </button>
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
        filterAndRender();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', () => filterAndRender());
    }

    filterAndRender();
  }

  // Render on Homepage Featured row (index.html)
  if (homeFeaturedContainer && window.NIMCO_PRODUCTS) {
    const featuredIds = ['pop-corn', 'aloo-bhujia', 'khatta-meetha', 'tasty-peanuts'];
    const featured = window.NIMCO_PRODUCTS.filter(p => featuredIds.includes(p.id));
    homeFeaturedContainer.innerHTML = featured.map(renderProductCard).join('');
  }
}
