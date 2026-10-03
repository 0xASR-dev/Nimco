/* ==========================================================================
   NIMCO'S "CRUNCH CATCHER!" ARCADE MINI-GAME
   Canvas game for kids with score, combos, lives, rewards & sound effects
   ========================================================================== */

class CrunchCatcherGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('nimco_high_score') || '0', 10);
    this.lives = 3;
    this.isPlaying = false;
    this.gameOver = false;
    this.combo = 0;
    this.multiplier = 1;

    // Elements
    this.scoreDisplay = document.getElementById('gameScore');
    this.highScoreDisplay = document.getElementById('gameHighScore');
    this.livesDisplay = document.getElementById('gameLives');
    this.overlay = document.getElementById('gameOverOverlay');
    this.startOverlay = document.getElementById('gameStartOverlay');
    this.finalScoreEl = document.getElementById('gameFinalScore');
    this.rewardPromoBox = document.getElementById('gameRewardPromo');

    this.startBtn = document.getElementById('gameStartBtn');
    this.restartBtn = document.getElementById('gameRestartBtn');

    // Bowl
    this.bowl = {
      x: 0,
      y: 0,
      width: 100,
      height: 36,
      speed: 14,
      targetX: 0
    };

    // Items
    this.items = [];
    this.spawnTimer = 0;
    this.spawnRate = 55; // frames between spawns
    this.keys = {};

    this.initCanvasSize();
    this.bindEvents();
    this.updateHUD();
  }

  initCanvasSize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width || 760;
    this.canvas.height = rect.height || 460;
    this.bowl.y = this.canvas.height - 48;
    this.bowl.x = (this.canvas.width - this.bowl.width) / 2;
    this.bowl.targetX = this.bowl.x;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.initCanvasSize());

    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });

    // Mouse movement
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      this.bowl.targetX = mouseX - this.bowl.width / 2;
    });

    // Touch support for tablets & phones
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;
      this.bowl.targetX = touchX - this.bowl.width / 2;
    }, { passive: false });

    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.start());
    }

    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => this.start());
    }
  }

  start() {
    this.initCanvasSize();
    this.score = 0;
    this.lives = 3;
    this.combo = 0;
    this.multiplier = 1;
    this.items = [];
    this.isPlaying = true;
    this.gameOver = false;

    if (this.startOverlay) this.startOverlay.classList.add('hidden');
    if (this.overlay) this.overlay.classList.add('hidden');

    this.updateHUD();
    if (window.nimcoSounds) window.nimcoSounds.playChime();

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  spawnItem() {
    const types = [
      { type: 'popcorn', emoji: '🍿', name: 'Popcorn', points: 10, speed: 3.2, size: 28, isGood: true },
      { type: 'bhujia', emoji: '🥢', name: 'Aloo Bhujia', points: 15, speed: 3.6, size: 26, isGood: true },
      { type: 'peanut', emoji: '🥜', name: 'Peanut', points: 20, speed: 4.0, size: 24, isGood: true },
      { type: 'star', emoji: '⭐', name: 'Super Star', points: 50, speed: 4.5, size: 30, isGood: true },
      { type: 'drop', emoji: '💧', name: 'Soggy Drop', points: 0, speed: 3.8, size: 26, isGood: false }
    ];

    // Probability weights
    const rand = Math.random();
    let picked;
    if (rand < 0.35) picked = types[0]; // Popcorn
    else if (rand < 0.60) picked = types[1]; // Aloo bhujia
    else if (rand < 0.78) picked = types[2]; // Peanut
    else if (rand < 0.88) picked = types[3]; // Star bonus
    else picked = types[4]; // Bad soggy drop

    const x = 30 + Math.random() * (this.canvas.width - 60);

    this.items.push({
      ...picked,
      x: x,
      y: -30,
      rot: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.08
    });
  }

  updateHUD() {
    if (this.scoreDisplay) this.scoreDisplay.textContent = this.score;
    if (this.highScoreDisplay) this.highScoreDisplay.textContent = this.highScore;
    if (this.livesDisplay) {
      let hearts = '';
      for (let i = 0; i < this.lives; i++) hearts += '❤️ ';
      for (let i = this.lives; i < 3; i++) hearts += '🖤 ';
      this.livesDisplay.textContent = hearts;
    }
  }

  gameLoop(time) {
    if (!this.isPlaying) return;

    this.update();
    this.render();

    if (!this.gameOver) {
      requestAnimationFrame((t) => this.gameLoop(t));
    }
  }

  update() {
    // Bowl keyboard controls
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
      this.bowl.targetX -= this.bowl.speed;
    }
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
      this.bowl.targetX += this.bowl.speed;
    }

    // Smooth bowl interpolation
    this.bowl.x += (this.bowl.targetX - this.bowl.x) * 0.25;

    // Boundaries
    if (this.bowl.x < 10) {
      this.bowl.x = 10;
      this.bowl.targetX = 10;
    }
    if (this.bowl.x > this.canvas.width - this.bowl.width - 10) {
      this.bowl.x = this.canvas.width - this.bowl.width - 10;
      this.bowl.targetX = this.bowl.x;
    }

    // Spawning items
    this.spawnTimer++;
    if (this.spawnTimer >= this.spawnRate) {
      this.spawnItem();
      this.spawnTimer = 0;
      // Slightly speed up game as score rises
      this.spawnRate = Math.max(30, 55 - Math.floor(this.score / 50));
    }

    // Update items & collision detection
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.y += item.speed;
      item.rot += item.rotSpeed;

      // Check collision with bowl
      const bowlTop = this.bowl.y;
      const bowlBottom = this.bowl.y + this.bowl.height;
      const bowlLeft = this.bowl.x;
      const bowlRight = this.bowl.x + this.bowl.width;

      if (
        item.y + item.size >= bowlTop &&
        item.y <= bowlBottom &&
        item.x >= bowlLeft - 10 &&
        item.x <= bowlRight + 10
      ) {
        // Collided!
        if (item.isGood) {
          this.combo++;
          this.multiplier = 1 + Math.floor(this.combo / 5) * 0.5;
          const earned = Math.round(item.points * this.multiplier);
          this.score += earned;

          if (item.type === 'star') {
            if (window.nimcoSounds) window.nimcoSounds.playScoreDing();
          } else {
            if (window.nimcoSounds) window.nimcoSounds.playCrunch();
          }
        } else {
          // Hit soggy raindrop!
          this.lives--;
          this.combo = 0;
          this.multiplier = 1;
          if (window.nimcoSounds) window.nimcoSounds.playOops();

          if (this.lives <= 0) {
            this.endGame();
            return;
          }
        }

        this.items.splice(i, 1);
        this.updateHUD();
        continue;
      }

      // Missed item falling off screen
      if (item.y > this.canvas.height + 30) {
        if (item.isGood && item.type !== 'star') {
          this.combo = 0;
          this.multiplier = 1;
        }
        this.items.splice(i, 1);
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Decorative clouds in sky background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    this.ctx.beginPath();
    this.ctx.arc(80, 70, 35, 0, Math.PI * 2);
    this.ctx.arc(120, 65, 45, 0, Math.PI * 2);
    this.ctx.arc(160, 70, 35, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(this.canvas.width - 120, 90, 40, 0, Math.PI * 2);
    this.ctx.arc(this.canvas.width - 80, 85, 45, 0, Math.PI * 2);
    this.ctx.fill();

    // Render Falling Items
    this.items.forEach((item) => {
      this.ctx.save();
      this.ctx.translate(item.x, item.y);
      this.ctx.rotate(item.rot);
      this.ctx.font = `${item.size}px 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(item.emoji, 0, 0);
      this.ctx.restore();
    });

    // Render Nimco Snack Bowl
    this.drawBowl(this.bowl.x, this.bowl.y, this.bowl.width, this.bowl.height);

    // Combo streak badge
    if (this.combo >= 3) {
      this.ctx.fillStyle = '#E5252A';
      this.ctx.font = "bold 16px 'Fredoka', sans-serif";
      this.ctx.fillText(`🔥 ${this.combo}x STREAK! (${this.multiplier}x Multiplier)`, this.canvas.width / 2 - 80, 34);
    }
  }

  drawBowl(x, y, w, h) {
    this.ctx.save();
    // Bowl shadow
    this.ctx.fillStyle = 'rgba(36, 34, 32, 0.15)';
    this.ctx.beginPath();
    this.ctx.ellipse(x + w / 2, y + h + 4, w / 2 + 5, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Bowl Body
    this.ctx.fillStyle = '#E5252A';
    this.ctx.strokeStyle = '#242220';
    this.ctx.lineWidth = 3.5;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + 8);
    this.ctx.bezierCurveTo(x + 5, y + h, x + w - 5, y + h, x + w, y + 8);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Bowl Rim
    this.ctx.fillStyle = '#FFC300';
    this.ctx.beginPath();
    this.ctx.ellipse(x + w / 2, y + 8, w / 2, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Nimco Mascot Face on Bowl
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(x + w / 2 - 12, y + h / 2 + 3, 4, 0, Math.PI * 2);
    this.ctx.arc(x + w / 2 + 12, y + h / 2 + 3, 4, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#242220';
    this.ctx.beginPath();
    this.ctx.arc(x + w / 2 - 11, y + h / 2 + 3, 2.2, 0, Math.PI * 2);
    this.ctx.arc(x + w / 2 + 13, y + h / 2 + 3, 2.2, 0, Math.PI * 2);
    this.ctx.fill();

    // Smiling mouth
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2.5;
    this.ctx.beginPath();
    this.ctx.arc(x + w / 2, y + h / 2 + 6, 7, 0.2, Math.PI - 0.2);
    this.ctx.stroke();

    this.ctx.restore();
  }

  endGame() {
    this.isPlaying = false;
    this.gameOver = true;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('nimco_high_score', this.highScore);
    }

    if (this.finalScoreEl) this.finalScoreEl.textContent = this.score;
    if (this.rewardPromoBox) {
      if (this.score >= 150) {
        this.rewardPromoBox.innerHTML = `
          <div style="background: #E8F8EE; border: 2px solid #25AC4B; border-radius: 12px; padding: 12px; margin-top: 15px;">
            <div style="font-weight: 800; color: #176B2C; font-size: 1.1rem;">🏆 Master Cruncher Badge Unlocked!</div>
            <div style="font-size: 0.95rem; color: #222; margin-top: 4px;">Use code <strong>CRUNCHY20</strong> in your Snack Box for 20% OFF!</div>
          </div>
        `;
      } else {
        this.rewardPromoBox.innerHTML = `
          <div style="background: #FFF5E0; border: 2px dashed #FFC300; border-radius: 12px; padding: 12px; margin-top: 15px;">
            <div style="font-weight: 700; color: #8C6400;">Good Try, Buddy! 🌟</div>
            <div style="font-size: 0.9rem; color: #444; margin-top: 4px;">Score 150+ to win a secret coupon!</div>
          </div>
        `;
      }
    }

    if (this.overlay) this.overlay.classList.remove('hidden');
    this.updateHUD();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('gameCanvas')) {
    window.nimcoGame = new CrunchCatcherGame('gameCanvas');
  }
});
