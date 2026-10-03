/* ==========================================================================
   BIKANO-STYLE "ALL THINGS CRAVEABLE" HORIZONTAL PRODUCT SLIDER
   Interactive 3D center-focus carousel with categories, touch/mouse drag,
   sound effects, keyboard navigation, and instant cart integration
   ========================================================================== */

class CraveableSlider {
  constructor() {
    this.stage = document.getElementById('craveableStage');
    this.prevBtn = document.getElementById('craveablePrevBtn');
    this.nextBtn = document.getElementById('craveableNextBtn');
    this.infoCard = document.getElementById('craveableInfoCard');
    this.thumbStrip = document.getElementById('craveableThumbStrip');
    this.progressFill = document.getElementById('craveableProgressFill');
    this.categoryBtns = document.querySelectorAll('.craveable-cat-btn');

    if (!this.stage || !window.NIMCO_PRODUCTS) return;

    this.allProducts = window.NIMCO_PRODUCTS;
    this.currentCategory = 'all';
    this.filteredProducts = [...this.allProducts];
    this.currentIndex = 0; // Starts with center product

    this.startX = 0;
    this.isDragging = false;

    this.init();
  }

  init() {
    this.filterCategory('all');
    this.bindEvents();
  }

  filterCategory(category) {
    this.currentCategory = category;
    if (category === 'all') {
      this.filteredProducts = [...this.allProducts];
    } else {
      this.filteredProducts = this.allProducts.filter(p => p.category === category);
    }

    // Default to first item or center
    this.currentIndex = 0;
    this.render();
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    // Category button clicks
    this.categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        if (window.nimcoSounds) window.nimcoSounds.playPop();
        this.filterCategory(cat);
      });
    });

    // Touch and Mouse Drag Support on stage
    const container = document.getElementById('craveableTrackContainer');
    if (container) {
      container.addEventListener('touchstart', (e) => {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
      }, { passive: true });

      container.addEventListener('touchend', (e) => {
        if (!this.isDragging) return;
        this.isDragging = false;
        const endX = e.changedTouches[0].clientX;
        const diff = endX - this.startX;
        if (diff > 40) this.prev();
        else if (diff < -40) this.next();
      });

      // Mouse drag
      container.addEventListener('mousedown', (e) => {
        this.startX = e.clientX;
        this.isDragging = true;
      });

      container.addEventListener('mouseup', (e) => {
        if (!this.isDragging) return;
        this.isDragging = false;
        const diff = e.clientX - this.startX;
        if (diff > 45) this.prev();
        else if (diff < -45) this.next();
      });

      container.addEventListener('mouseleave', () => {
        this.isDragging = false;
      });

      // Mouse wheel horizontal scrolling
      container.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > 25) {
          e.preventDefault();
          if (e.deltaX > 0) this.next();
          else this.prev();
        }
      }, { passive: false });
    }

    // Keyboard navigation (Left / Right Arrow)
    window.addEventListener('keydown', (e) => {
      const rect = this.stage?.getBoundingClientRect();
      const inView = rect && rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      }
    });
  }

  prev() {
    if (this.filteredProducts.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.filteredProducts.length) % this.filteredProducts.length;
    if (window.nimcoSounds) window.nimcoSounds.playPop();
    this.render();
  }

  next() {
    if (this.filteredProducts.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.filteredProducts.length;
    if (window.nimcoSounds) window.nimcoSounds.playPop();
    this.render();
  }

  goToIndex(index) {
    if (index >= 0 && index < this.filteredProducts.length) {
      this.currentIndex = index;
      if (window.nimcoSounds) window.nimcoSounds.playPop();
      this.render();
    }
  }

  render() {
    if (this.filteredProducts.length === 0) return;

    const total = this.filteredProducts.length;
    const current = this.filteredProducts[this.currentIndex];

    // Indices for circular left, center, right
    const prevIdx = (this.currentIndex - 1 + total) % total;
    const nextIdx = (this.currentIndex + 1) % total;
    const farLeftIdx = (this.currentIndex - 2 + total) % total;
    const farRightIdx = (this.currentIndex + 2) % total;

    const prevProduct = this.filteredProducts[prevIdx];
    const nextProduct = this.filteredProducts[nextIdx];

    // Render Stage HTML
    this.stage.innerHTML = `
      <div class="craveable-burst-halo" aria-hidden="true" style="background: radial-gradient(circle, ${current.accentColor || '#FFE180'} 0%, rgba(255, 183, 3, 0.4) 40%, rgba(255,255,255,0) 70%);">
        <svg viewBox="0 0 200 200" class="burst-sparks-svg">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#FFA200" stroke-width="2" stroke-dasharray="8 8" opacity="0.4" />
          <path d="M100 15 L100 0 M100 185 L100 200 M15 100 L0 100 M185 100 L200 100 M40 40 L28 28 M160 160 L172 172 M40 160 L28 172 M160 40 L172 28" stroke="#E5252A" stroke-width="3" stroke-linecap="round" />
        </svg>
      </div>

      <!-- Left Side Product -->
      <div class="craveable-slide slide-left" onclick="window.craveableSlider.prev()" title="Click to view ${prevProduct.name}">
        <div class="slide-pack-wrap">
          <img src="${prevProduct.image}" alt="${prevProduct.name}" class="craveable-packet-img" loading="lazy">
        </div>
        <div class="slide-name-peek">${prevProduct.name.replace("Nimco's ", "")}</div>
      </div>

      <!-- Center Active Product -->
      <div class="craveable-slide slide-center" onclick="openProductModal('${current.id}')" title="Click for nutrition & details">
        <div class="slide-pack-wrap">
          <img src="${current.image}" alt="${current.name}" class="craveable-packet-img" loading="lazy">
          <span class="center-badge-pop">${current.badge || '🌟 Favorite'}</span>
        </div>
      </div>

      <!-- Right Side Product -->
      <div class="craveable-slide slide-right" onclick="window.craveableSlider.next()" title="Click to view ${nextProduct.name}">
        <div class="slide-pack-wrap">
          <img src="${nextProduct.image}" alt="${nextProduct.name}" class="craveable-packet-img" loading="lazy">
        </div>
        <div class="slide-name-peek">${nextProduct.name.replace("Nimco's ", "")}</div>
      </div>
    `;

    // Render Info Card for center item
    const stars = '⭐'.repeat(current.crunchStars);
    this.infoCard.innerHTML = `
      <div class="info-card-inner">
        <div class="info-card-header">
          <div class="info-meta-row">
            <span class="veg-badge" title="100% Pure Vegetarian"></span>
            <span class="info-price-pill">₹${current.price} Only <small>(${current.packWeight})</small></span>
            <span class="flavor-chip">${current.categoryLabel}</span>
          </div>
          <h3 class="info-product-name">${current.name}</h3>
          <p class="info-product-tagline">"${current.tagline}"</p>
        </div>

        <p class="info-product-desc">${current.desc}</p>

        <div class="info-card-footer">
          <div class="info-crunch-meter">
            <span class="crunch-stars">${stars}</span>
            <span style="font-weight: 700; color: #8C6400; font-size: 0.88rem;">${current.crunchLevel}</span>
          </div>

          <div class="info-action-btns">
            <button class="btn btn-primary btn-add-snack btn-sm" data-product-id="${current.id}">
              <span>🛒 Add to Box</span>
            </button>
            <button class="btn btn-outline btn-info-details btn-sm" onclick="openProductModal('${current.id}')" title="Nutrition Facts & Trivia">
              <span>🔍 Nutrition & Fun</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Update Progress Bar & Thumbnails
    if (this.progressFill) {
      const progress = ((this.currentIndex + 1) / total) * 100;
      this.progressFill.style.width = `${progress}%`;
    }

    if (this.thumbStrip) {
      this.thumbStrip.innerHTML = this.filteredProducts.map((p, idx) => `
        <button class="thumb-pill ${idx === this.currentIndex ? 'active' : ''}" onclick="window.craveableSlider.goToIndex(${idx})" title="${p.name}">
          <img src="${p.image}" alt="${p.name}">
          <span>${p.name.replace("Nimco's ", "").slice(0, 16)}</span>
        </button>
      `).join('');

      // Auto scroll thumb strip to active thumbnail
      const activeThumb = this.thumbStrip.querySelector('.thumb-pill.active');
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('craveableStage')) {
    window.craveableSlider = new CraveableSlider();
  }
});
