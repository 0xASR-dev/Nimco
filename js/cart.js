/* ==========================================================================
   NIMCO'S SNACK BOX CART MANAGER (PROFESSIONAL FMCG EDITION)
   State management, coupon vouchers, free gift milestone, and order confirmation
   ========================================================================== */

class SnackBoxCart {
  constructor() {
    this.items = this.loadCart();
    this.discount = 0;
    this.promoApplied = null;
    this.freeGiftThreshold = 199; // Orders above ₹199 unlock complimentary Butter Popcorn
    this.initElements();
    this.bindEvents();
    this.render();
  }

  loadCart() {
    try {
      const stored = localStorage.getItem('nimco_snack_box');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('nimco_snack_box', JSON.stringify(this.items));
    } catch (e) {}
  }

  initElements() {
    this.cartDrawer = document.getElementById('cartDrawer');
    this.cartBackdrop = document.getElementById('cartBackdrop');
    this.cartItemsList = document.getElementById('cartItemsList');
    this.cartCountBadges = document.querySelectorAll('.cart-badge-count');
    this.subtotalElement = document.getElementById('cartSubtotal');
    this.discountRow = document.getElementById('cartDiscountRow');
    this.discountAmountEl = document.getElementById('cartDiscountAmount');
    this.finalTotalEl = document.getElementById('cartFinalTotal');
    this.giftProgressEl = document.getElementById('giftMeterFill');
    this.giftTextEl = document.getElementById('giftMeterText');
    this.promoInput = document.getElementById('cartPromoInput');
    this.promoBtn = document.getElementById('cartPromoBtn');
    this.promoMessage = document.getElementById('cartPromoMsg');
    this.checkoutBtn = document.getElementById('cartCheckoutBtn');
    this.triggerButtons = document.querySelectorAll('.cart-btn-trigger');
    this.closeButtons = document.querySelectorAll('.cart-close-btn');
  }

  bindEvents() {
    this.triggerButtons.forEach(btn => {
      btn.addEventListener('click', () => this.open());
    });

    this.closeButtons.forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    if (this.cartBackdrop) {
      this.cartBackdrop.addEventListener('click', () => this.close());
    }

    if (this.promoBtn) {
      this.promoBtn.addEventListener('click', () => this.applyPromo());
    }

    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', () => this.checkout());
    }

    // Global listener for Add to Cart
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.btn-add-snack');
      if (addBtn) {
        const productId = addBtn.dataset.productId;
        const qty = parseInt(addBtn.dataset.quantity || '1', 10);
        if (productId) {
          this.addItem(productId, qty);
          this.animateAddEffect(addBtn);
        }
      }
    });
  }

  open() {
    if (this.cartDrawer) this.cartDrawer.classList.add('open');
    if (this.cartBackdrop) this.cartBackdrop.classList.add('open');
  }

  close() {
    if (this.cartDrawer) this.cartDrawer.classList.remove('open');
    if (this.cartBackdrop) this.cartBackdrop.classList.remove('open');
  }

  addItem(productId, quantity = 1) {
    const product = window.NIMCO_PRODUCTS ? window.NIMCO_PRODUCTS.find(p => p.id === productId) : null;
    if (!product) return;

    const existing = this.items.find(item => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        packWeight: product.packWeight,
        quantity: quantity
      });
    }

    this.saveCart();
    this.render();
    this.showToast(`Added ${product.name} to your Snack Box.`);
  }

  updateQuantity(productId, delta) {
    const item = this.items.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.items = this.items.filter(i => i.id !== productId);
    }

    this.saveCart();
    this.render();
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.id !== productId);
    this.saveCart();
    this.render();
  }

  applyPromo() {
    if (!this.promoInput) return;
    const code = this.promoInput.value.trim().toUpperCase();

    if (code === 'NIMCO10') {
      this.discount = 0.10;
      this.promoApplied = 'NIMCO10 (10% Off)';
      this.showPromoFeedback('10% Welcome discount applied successfully.', true);
    } else if (code === 'FESTIVE20') {
      this.discount = 0.20;
      this.promoApplied = 'FESTIVE20 (20% Off)';
      this.showPromoFeedback('20% Festive savings applied successfully.', true);
    } else if (code === 'SNACKBOX') {
      this.discount = 0.15;
      this.promoApplied = 'SNACKBOX (15% Off)';
      this.showPromoFeedback('15% Snack Box discount applied.', true);
    } else {
      this.showPromoFeedback('Invalid code. Try using NIMCO10 or FESTIVE20.', false);
    }

    this.render();
  }

  showPromoFeedback(msg, isSuccess) {
    if (!this.promoMessage) return;
    this.promoMessage.textContent = msg;
    this.promoMessage.style.color = isSuccess ? '#1E7E34' : 'var(--brand-red)';
    this.promoMessage.style.display = 'block';
  }

  getTotalCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  render() {
    const totalCount = this.getTotalCount();
    const subtotal = this.getSubtotal();
    const discountAmount = Math.round(subtotal * this.discount);
    const finalTotal = Math.max(0, subtotal - discountAmount);

    // Update Badges
    this.cartCountBadges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    });

    // Update Free Gift Meter
    if (this.giftProgressEl && this.giftTextEl) {
      const percentage = Math.min(100, Math.round((subtotal / this.freeGiftThreshold) * 100));
      this.giftProgressEl.style.width = `${percentage}%`;

      if (subtotal >= this.freeGiftThreshold) {
        this.giftTextEl.innerHTML = `<strong>Offer Unlocked:</strong> Free Butter Popcorn pack included with your order!`;
      } else {
        const remaining = this.freeGiftThreshold - subtotal;
        this.giftTextEl.innerHTML = `Add <strong>₹${remaining}</strong> more to qualify for a free Butter Popcorn pack.`;
      }
    }

    // Render Items
    if (!this.cartItemsList) return;

    if (this.items.length === 0) {
      this.cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <h4 style="font-size: 1.15rem; margin-bottom: 6px; color: var(--text-main);">Your Snack Box is empty</h4>
          <p style="font-size: 0.9rem; margin-bottom: 18px; color: var(--text-muted);">Explore our range of authentic bhujia, roasted peanuts, and namkeen.</p>
          <a href="products.html" class="btn btn-outline btn-sm" onclick="window.snackBoxCart.close()">Browse Snacks</a>
        </div>
      `;
      if (this.checkoutBtn) this.checkoutBtn.disabled = true;
    } else {
      if (this.checkoutBtn) this.checkoutBtn.disabled = false;
      this.cartItemsList.innerHTML = this.items.map(item => `
        <div class="cart-item-row">
          <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
          <div class="cart-item-details">
            <h5 class="cart-item-title">${item.name}</h5>
            <div class="cart-item-price">₹${item.price} <span style="font-weight: 500; font-size: 0.8rem; color: var(--text-muted);">(${item.packWeight})</span></div>
          </div>
          <div class="cart-qty-ctrls">
            <button class="cart-qty-btn" onclick="window.snackBoxCart.updateQuantity('${item.id}', -1)" title="Remove one" aria-label="Decrease quantity">−</button>
            <span class="cart-qty-val">${item.quantity}</span>
            <button class="cart-qty-btn" onclick="window.snackBoxCart.updateQuantity('${item.id}', 1)" title="Add one" aria-label="Increase quantity">+</button>
          </div>
        </div>
      `).join('');
    }

    // Subtotal and Total
    if (this.subtotalElement) this.subtotalElement.textContent = `₹${subtotal}`;
    if (this.discountRow) {
      this.discountRow.style.display = this.discount > 0 ? 'flex' : 'none';
    }
    if (this.discountAmountEl) this.discountAmountEl.textContent = `-₹${discountAmount}`;
    if (this.finalTotalEl) this.finalTotalEl.textContent = `₹${finalTotal}`;
  }

  animateAddEffect(button) {
    const originalText = button.innerHTML;
    button.classList.add('added-feedback');
    button.innerHTML = 'Added';

    // Animate cart trigger in navbar
    const cartTriggers = document.querySelectorAll('.cart-btn-trigger');
    cartTriggers.forEach(ct => {
      ct.classList.remove('cart-badge-bounce');
      void ct.offsetWidth; // Force reflow
      ct.classList.add('cart-badge-bounce');
    });

    this.showToast('Item added to your Snack Box.');

    setTimeout(() => {
      button.classList.remove('added-feedback');
      button.innerHTML = originalText;
    }, 900);
  }

  showToast(message) {
    let toast = document.getElementById('nimcoToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'nimcoToast';
      toast.style.position = 'fixed';
      toast.style.bottom = '24px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%) translateY(100px)';
      toast.style.background = 'var(--text-main)';
      toast.style.color = '#FFFFFF';
      toast.style.padding = '10px 22px';
      toast.style.borderRadius = '999px';
      toast.style.border = '1px solid var(--border-subtle)';
      toast.style.boxShadow = '0 10px 24px rgba(0,0,0,0.18)';
      toast.style.fontFamily = 'var(--font-sans)';
      toast.style.fontSize = '0.9rem';
      toast.style.fontWeight = '600';
      toast.style.zIndex = '99999';
      toast.style.transition = 'transform 0.25s ease';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 2400);
  }

  checkout() {
    if (this.items.length === 0) return;

    this.close();

    const finalAmount = Math.max(0, this.getSubtotal() - Math.round(this.getSubtotal() * this.discount));
    const totalCount = this.getTotalCount();

    // Show Professional Order Confirmation Modal
    const modalHTML = `
      <div class="modal-backdrop open" id="orderSuccessModal">
        <div class="modal-dialog" style="max-width: 480px; text-align: center; padding: 36px 28px;">
          <button class="modal-close-btn" onclick="document.getElementById('orderSuccessModal').remove()" aria-label="Close modal">✕</button>
          <div style="width: 56px; height: 56px; background: #E8F8EE; color: #1E7E34; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 1.5rem; font-weight: 800;">✓</div>
          <h2 style="font-size: 1.6rem; color: var(--text-main); margin-bottom: 8px;">Order Placed Successfully</h2>
          <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 22px; line-height: 1.5;">
            Thank you for choosing Nimco's. Your authentic namkeen pack is being prepared and dispatched.
          </p>
          <div style="background: var(--surface-warm); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 18px; margin-bottom: 24px; text-align: left;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem;">
              <span style="color: var(--text-muted);">Total Packets:</span>
              <strong style="color: var(--text-main);">${totalCount} packs</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.95rem;">
              <span style="color: var(--text-muted);">Total Amount Paid:</span>
              <strong style="color: var(--brand-red); font-size: 1.1rem;">₹${finalAmount}</strong>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 8px; margin-top: 8px;">
              Dispatch via local delivery network | Estimated delivery: 30-45 minutes
            </div>
          </div>
          <button class="btn btn-primary" style="width: 100%;" onclick="document.getElementById('orderSuccessModal').remove()">
            Continue Shopping
          </button>
        </div>
      </div>
    `;

    const wrap = document.createElement('div');
    wrap.innerHTML = modalHTML;
    document.body.appendChild(wrap.firstElementChild);

    // Reset cart
    this.items = [];
    this.discount = 0;
    this.promoApplied = null;
    this.saveCart();
    this.render();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.snackBoxCart = new SnackBoxCart();
});
