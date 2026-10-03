/* ==========================================================================
   NIMCO'S SNACK BOX / CART MANAGER
   State management, promo codes, free gift milestones, and celebration modal
   ========================================================================== */

class SnackBoxCart {
  constructor() {
    this.items = this.loadCart();
    this.discount = 0;
    this.promoApplied = null;
    this.freeGiftThreshold = 199; // ₹199 unlocks free Butter Popcorn
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
          if (window.nimcoSounds) {
            window.nimcoSounds.playCrunch();
          }
          this.animateAddEffect(addBtn);
        }
      }
    });
  }

  open() {
    if (this.cartDrawer) this.cartDrawer.classList.add('open');
    if (this.cartBackdrop) this.cartBackdrop.classList.add('open');
    if (window.nimcoSounds) window.nimcoSounds.playPop();
  }

  close() {
    if (this.cartDrawer) this.cartDrawer.classList.remove('open');
    if (this.cartBackdrop) this.cartBackdrop.classList.remove('open');
  }

  addItem(productId, quantity = 1) {
    const product = window.NIMCO_PRODUCTS.find(p => p.id === productId);
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
    this.showToast(`Yum! Added ${product.name} to your Snack Box! 🍿`);
  }

  updateQuantity(productId, delta) {
    const item = this.items.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.items = this.items.filter(i => i.id !== productId);
    }

    if (window.nimcoSounds) window.nimcoSounds.playPop();
    this.saveCart();
    this.render();
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.id !== productId);
    if (window.nimcoSounds) window.nimcoSounds.playPop();
    this.saveCart();
    this.render();
  }

  applyPromo() {
    if (!this.promoInput) return;
    const code = this.promoInput.value.trim().toUpperCase();

    if (code === 'CHINTU10') {
      this.discount = 0.10;
      this.promoApplied = 'CHINTU10 (10% Off)';
      this.showPromoFeedback('Yay! 10% Chintu Buddy discount applied! 🥳', true);
      if (window.nimcoSounds) window.nimcoSounds.playChime();
    } else if (code === 'CRUNCHY20') {
      this.discount = 0.20;
      this.promoApplied = 'CRUNCHY20 (20% Off)';
      this.showPromoFeedback('Superstar! 20% Crunchy Festival discount applied! 🚀', true);
      if (window.nimcoSounds) window.nimcoSounds.playChime();
    } else if (code === 'FREESNACK') {
      this.discount = 0.15;
      this.promoApplied = 'FREESNACK (Free Popcorn Perk)';
      this.showPromoFeedback('Hooray! Free Butter Popcorn added to your order! 🍿', true);
      if (window.nimcoSounds) window.nimcoSounds.playChime();
    } else {
      this.showPromoFeedback('Oops! Try code CHINTU10 or CRUNCHY20 🎈', false);
      if (window.nimcoSounds) window.nimcoSounds.playOops();
    }

    this.render();
  }

  showPromoFeedback(msg, isSuccess) {
    if (!this.promoMessage) return;
    this.promoMessage.textContent = msg;
    this.promoMessage.style.color = isSuccess ? '#25AC4B' : '#E5252A';
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
        this.giftTextEl.innerHTML = `🎉 <strong>Hooray!</strong> You unlocked a <strong>FREE Butter Popcorn (₹10)</strong> pack! 🍿`;
      } else {
        const remaining = this.freeGiftThreshold - subtotal;
        this.giftTextEl.innerHTML = `Add <strong>₹${remaining}</strong> more to unlock a <strong>FREE Butter Popcorn</strong>! 🎁`;
      }
    }

    // Render Items
    if (!this.cartItemsList) return;

    if (this.items.length === 0) {
      this.cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <span class="cart-empty-icon">🥣</span>
          <h4 style="font-size: 1.3rem; margin-bottom: 8px;">Your Snack Box is Empty!</h4>
          <p style="font-size: 0.95rem; margin-bottom: 20px;">Load up on Aloo Bhujia, Popcorn, and Crunchy Peanuts!</p>
          <a href="products.html" class="btn btn-secondary btn-sm" onclick="window.snackBoxCart.close()">Browse Snacks 🚀</a>
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
            <div class="cart-item-price">₹${item.price} <span style="font-weight: 500; font-size: 0.8rem; color: #888;">(${item.packWeight})</span></div>
          </div>
          <div class="cart-qty-ctrls">
            <button class="cart-qty-btn" onclick="window.snackBoxCart.updateQuantity('${item.id}', -1)" title="Remove one">−</button>
            <span class="cart-qty-val">${item.quantity}</span>
            <button class="cart-qty-btn" onclick="window.snackBoxCart.updateQuantity('${item.id}', 1)" title="Add one">+</button>
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
    button.style.transform = 'scale(1.15)';
    button.style.background = '#25AC4B';
    const oldText = button.innerHTML;
    button.innerHTML = `<span>Added! 🟢</span>`;

    setTimeout(() => {
      button.style.transform = '';
      button.style.background = '';
      button.innerHTML = oldText;
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
      toast.style.background = '#242220';
      toast.style.color = '#FFFFFF';
      toast.style.padding = '12px 24px';
      toast.style.borderRadius = '999px';
      toast.style.border = '2px solid #FFC300';
      toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
      toast.style.fontFamily = "'Fredoka', sans-serif";
      toast.style.fontWeight = '600';
      toast.style.zIndex = '99999';
      toast.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
      document.body.appendChild(toast);
    }

    toast.innerHTML = message;
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 2800);
  }

  checkout() {
    if (this.items.length === 0) return;

    this.close();
    if (window.nimcoSounds) window.nimcoSounds.playChime();
    this.launchConfetti();

    // Show Celebration Modal
    const modalHTML = `
      <div class="modal-backdrop open" id="orderSuccessModal">
        <div class="modal-dialog" style="max-width: 500px; text-align: center; padding: 40px 30px;">
          <button class="modal-close-btn" onclick="document.getElementById('orderSuccessModal').remove()">✕</button>
          <div style="font-size: 4rem; margin-bottom: 12px; animation: cuteBob 1.5s infinite alternate;">🎉🍿✨</div>
          <h2 style="font-size: 2.2rem; color: #E5252A; margin-bottom: 10px;">YAAAY! Order Placed!</h2>
          <p style="font-size: 1.1rem; color: #555; margin-bottom: 20px;">
            Your delicious box of crunchy Nimco's goodies is packed with joy and speeding towards your snack cupboard!
          </p>
          <div style="background: #FFF5E0; border: 2px dashed #EEDAC0; border-radius: 16px; padding: 16px; margin-bottom: 24px;">
            <div style="font-weight: 700; color: #8C6400;">Total Munchies: ${this.getTotalCount()} packs</div>
            <div style="font-size: 1.3rem; font-weight: 800; color: #E5252A; margin-top: 4px;">Paid: ₹${Math.max(0, this.getSubtotal() - Math.round(this.getSubtotal() * this.discount))}</div>
            <div style="font-size: 0.85rem; color: #666; margin-top: 4px;">Delivery in 20-30 mins | 100% Crunchy Guarantee</div>
          </div>
          <button class="btn btn-primary" onclick="document.getElementById('orderSuccessModal').remove()">
            Awesome, Let's Munch! 😋
          </button>
        </div>
      </div>
    `;

    const wrap = document.createElement('div');
    wrap.innerHTML = modalHTML;
    document.body.appendChild(wrap.firstElementChild);

    // Clear cart
    this.items = [];
    this.discount = 0;
    this.promoApplied = null;
    this.saveCart();
    this.render();
  }

  launchConfetti() {
    const colors = ['#E5252A', '#FFC300', '#FF7B00', '#00A6FB', '#25AC4B', '#FF3366'];
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    for (let i = 0; i < 70; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 0.8}s`;
      piece.style.animationDuration = `${2 + Math.random() * 2}s`;
      container.appendChild(piece);
    }

    setTimeout(() => {
      container.remove();
    }, 4500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.snackBoxCart = new SnackBoxCart();
});
