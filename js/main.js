/* ==========================================================================
   NIMCO'S MAIN UI INTERACTIVITY
   Header scroll, mobile drawer, product detail modal, catalogue & search
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initProductDetailModal();
  initProductsPage();
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
    }, { passive: true });
  }

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    // Close menu when clicking outside or navigating
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
    <div style="display: grid; grid-template-columns: 1fr 1.35fr; gap: 32px; align-items: start;">
      <div style="background: ${product.accentColor || '#FAF7F2'}; border-radius: 16px; padding: 28px 20px; text-align: center; border: 1px solid var(--border-subtle);">
        <img src="${product.image}" alt="${product.name}" style="max-height: 290px; margin: 0 auto; filter: drop-shadow(0 12px 24px rgba(0,0,0,0.12));">
        <div style="margin-top: 18px; display: inline-flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.85rem; color: #1E7E34; background: #FFFFFF; padding: 6px 14px; border-radius: 999px; border: 1px solid #C3E6CB;">
          <span class="veg-badge"></span> 100% Pure Vegetarian
        </div>
      </div>

      <div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <span class="flavor-chip">${product.categoryLabel}</span>
          <span style="font-weight: 800; color: var(--brand-red); font-size: 1.35rem;">₹${product.price} <small style="font-size: 0.88rem; color: var(--text-muted); font-weight: 500;">(${product.packWeight})</small></span>
        </div>
        
        <h3 style="font-size: 1.65rem; margin-bottom: 6px; line-height: 1.25; color: var(--text-main);">${product.name}</h3>
        <p style="color: #B85D00; font-weight: 600; font-size: 0.95rem; margin-bottom: 14px;">"${product.tagline}"</p>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 18px;">${product.desc}</p>

        <!-- Culinary / Heritage Note -->
        <div style="background: #FFFBF2; border-left: 3px solid var(--brand-gold); padding: 12px 16px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
          <div style="font-size: 0.78rem; font-weight: 800; color: #8A6500; text-transform: uppercase; letter-spacing: 0.05em;">Craft &amp; Heritage Quality:</div>
          <div style="font-size: 0.92rem; color: var(--text-main); margin-top: 3px; line-height: 1.45;">${product.culinaryNote || product.desc}</div>
        </div>

        <!-- Nutrition Facts Grid -->
        <div style="background: #FAFAFA; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 14px; margin-bottom: 18px;">
          <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em;">Nutrition per serving (${product.packWeight}):</div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center;">
            <div style="background: #FFFFFF; padding: 8px 4px; border-radius: 6px; border: 1px solid var(--border-subtle);">
              <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">Energy</span>
              <strong style="font-size: 0.92rem; color: var(--brand-red);">${product.nutrition.calories}</strong>
            </div>
            <div style="background: #FFFFFF; padding: 8px 4px; border-radius: 6px; border: 1px solid var(--border-subtle);">
              <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">Protein</span>
              <strong style="font-size: 0.92rem; color: #1E7E34;">${product.nutrition.protein}</strong>
            </div>
            <div style="background: #FFFFFF; padding: 8px 4px; border-radius: 6px; border: 1px solid var(--border-subtle);">
              <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">Carbs</span>
              <strong style="font-size: 0.92rem; color: #D97706;">${product.nutrition.carbs}</strong>
            </div>
            <div style="background: #FFFFFF; padding: 8px 4px; border-radius: 6px; border: 1px solid var(--border-subtle);">
              <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">Dietary Fiber</span>
              <strong style="font-size: 0.92rem; color: #4F46E5;">${product.nutrition.fiber}</strong>
            </div>
          </div>
        </div>

        <!-- Ingredients statement -->
        <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 22px;">
          <strong style="color: var(--text-main);">Ingredients:</strong> ${product.ingredients}
        </div>

        <div>
          <button class="btn btn-primary btn-add-snack" data-product-id="${product.id}" style="width: 100%;">
            Add to Snack Box
          </button>
        </div>
      </div>
    </div>
  `;

  modalBackdrop.classList.add('open');
}

/* --------------------------------------------------------------------------
   PRODUCTS CATALOGUE (PRODUCTS.HTML & HOME PREVIEWS)
   -------------------------------------------------------------------------- */
function renderProductCard(product) {
  return `
    <div class="snack-card" style="--card-accent: ${product.accentColor || '#FFFFFF'};" data-category="${product.category}">
      <div class="card-top-row">
        <span class="veg-badge" title="100% Pure Vegetarian"></span>
        <span class="price-tag">₹${product.price} Only</span>
      </div>

      <div class="product-img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>

      <div class="product-info">
        <span class="snack-tagline">${product.tagline}</span>
        <h4 class="snack-title">${product.name}</h4>
        <p class="snack-desc">${product.desc}</p>
        
        <div class="card-actions-row">
          <button class="btn-add-snack" data-product-id="${product.id}">
            + Add to Box
          </button>
          <button class="btn-quick-view" data-product-id="${product.id}" title="View details and nutrition">
            Details
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

  // Render on All Products grid (products.html)
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
          p.flavorTags.some(t => t.toLowerCase().includes(query));

        return matchesCategory && matchesSearch;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #FFFFFF; border-radius: 12px; border: 1px dashed var(--border-subtle);">
            <h3 style="font-size: 1.4rem; margin-bottom: 8px; color: var(--text-main);">No matching snacks found</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 16px;">Try searching for "Popcorn", "Peanut", "Aloo Bhujia", or "Papad".</p>
            <button class="btn btn-outline btn-sm" onclick="document.getElementById('productSearchInput').value=''; document.querySelector('.product-filter-btn[data-filter=all]').click();">
              View All Products
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
