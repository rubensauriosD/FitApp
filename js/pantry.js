/**
 * pantry.js — Pantry/inventory management and disliked ingredients.
 */

// ─── PANTRY ──────────────────────────────────────────────────────────────────

const Pantry = {
  // ── Initialization ──────────────────────────────────────────────────────────
  init() {
    this._ensureDefaultItems();
    this._setupInnerTabs();
    this._setupEvents();
    this.render();
  },

  // ── Pre-populate default pantry on first load ──────────────────────────────
  _ensureDefaultItems() {
    const existing = Storage.get(KEYS.PANTRY, null);
    if (existing === null) {
      const defaults = DEFAULT_PANTRY_ITEMS.map((item, i) => ({
        id: Date.now() + i,
        name:     item.name,
        detail:   item.detail   || '',
        quantity: item.quantity || '',
        unit:     item.unit     || ''
      }));
      Storage.set(KEYS.PANTRY, defaults);
    }
  },

  // ── Inner tab switching (shared across Despensa tabs) ─────────────────────
  _setupInnerTabs() {
    const section = document.getElementById('section-despensa');
    if (!section) return;
    section.querySelectorAll('.tab-inner').forEach(btn => {
      btn.addEventListener('click', () => {
        section.querySelectorAll('.tab-inner').forEach(b => b.classList.remove('active'));
        section.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const tabId = 'tab-' + btn.dataset.tab;
        document.getElementById(tabId)?.classList.add('active');

        if (btn.dataset.tab === 'compras' && typeof Shopping !== 'undefined') {
          Shopping.render();
        }
        if (btn.dataset.tab === 'no-tolero' && typeof Disliked !== 'undefined') {
          Disliked.render();
        }
      });
    });
  },

  // ── Setup add button and input events ─────────────────────────────────────
  _setupEvents() {
    const addBtn = document.getElementById('btn-add-pantry');
    if (addBtn) {
      addBtn.addEventListener('click', () => this._addItem());
    }

    const nameInput = document.getElementById('pantry-item-name');
    if (nameInput) {
      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this._addItem();
      });
    }
  },

  // ── Add new pantry item ────────────────────────────────────────────────────
  _addItem() {
    const nameInput   = document.getElementById('pantry-item-name');
    const detailInput = document.getElementById('pantry-item-detail');
    const qtyInput    = document.getElementById('pantry-item-qty');
    const unitSelect  = document.getElementById('pantry-item-unit');

    if (!nameInput) return;

    const name   = nameInput.value.trim();
    if (!name) {
      nameInput.style.borderColor = 'var(--danger)';
      setTimeout(() => { nameInput.style.borderColor = ''; }, 1200);
      return;
    }

    const detail   = detailInput ? detailInput.value.trim() : '';
    const qtyRaw   = qtyInput ? qtyInput.value.trim() : '';
    const quantity = qtyRaw !== '' ? parseFloat(qtyRaw) || qtyRaw : '';
    const unit     = unitSelect ? unitSelect.value : '';

    Storage.update(KEYS.PANTRY, (items) => {
      const arr = Array.isArray(items) ? items : [];
      // Avoid duplicates (case insensitive)
      if (arr.some(i => i.name.toLowerCase() === name.toLowerCase())) return arr;
      return [...arr, { id: Date.now(), name, detail, quantity, unit }];
    }, []);

    nameInput.value = '';
    if (detailInput) detailInput.value = '';
    if (qtyInput)    qtyInput.value = '';
    if (unitSelect)  unitSelect.value = '';
    nameInput.focus();
    this.render();
  },

  // ── Remove pantry item ─────────────────────────────────────────────────────
  _removeItem(id) {
    Storage.update(KEYS.PANTRY, (items) => {
      return Array.isArray(items) ? items.filter(i => i.id !== id) : [];
    }, []);
    this.render();
  },

  // ── Render pantry list ─────────────────────────────────────────────────────
  render() {
    const container = document.getElementById('pantry-list-container');
    if (!container) return;

    const items = Storage.get(KEYS.PANTRY, []);

    if (!items.length) {
      container.innerHTML = `
        <div class="card">
          <div class="pantry-empty">
            <span style="font-size:2rem">🥫</span>
            <p>Tu despensa está vacía. Agregá ingredientes para mejorar tu plan de comidas.</p>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="card">
        <div class="flex-between mb-8">
          <h3>Ingredientes (${items.length})</h3>
          <button class="btn-danger btn-small" id="btn-clear-pantry">Vaciar todo</button>
        </div>
        <ul class="pantry-list">
          ${items.map(item => {
            const qtyStr = [item.quantity, item.unit].filter(Boolean).join(' ');
            return `
              <li class="pantry-item" data-id="${item.id}">
                <span class="pantry-item-name">${this._capitalize(item.name)}</span>
                ${item.detail ? `<span class="pantry-item-detail">(${item.detail})</span>` : ''}
                ${qtyStr ? `<span class="pantry-item-qty">${qtyStr}</span>` : '<span class="pantry-item-qty"></span>'}
                <button class="btn-remove" data-id="${item.id}" aria-label="Quitar ${item.name}">✕</button>
              </li>
            `;
          }).join('')}
        </ul>
      </div>
    `;

    container.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', () => this._removeItem(parseInt(btn.dataset.id)));
    });

    document.getElementById('btn-clear-pantry')?.addEventListener('click', () => {
      if (confirm('¿Vaciar toda la despensa?')) {
        Storage.set(KEYS.PANTRY, []);
        this.render();
      }
    });
  },

  // ── Get current pantry items ───────────────────────────────────────────────
  getPantryItems() {
    return Storage.get(KEYS.PANTRY, []);
  },

  _capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};

// ─── DISLIKED INGREDIENTS ─────────────────────────────────────────────────────

const Disliked = {
  // ── Initialization ──────────────────────────────────────────────────────────
  init() {
    this._setupEvents();
    this.render();
  },

  // ── Setup event listeners ──────────────────────────────────────────────────
  _setupEvents() {
    document.getElementById('btn-add-dislike')?.addEventListener('click', () => {
      const name   = document.getElementById('dislike-name')?.value.trim();
      const reason = document.getElementById('dislike-reason')?.value || 'no_gusta';
      if (!name) {
        const inp = document.getElementById('dislike-name');
        if (inp) {
          inp.style.borderColor = 'var(--danger)';
          setTimeout(() => { inp.style.borderColor = ''; }, 1200);
        }
        return;
      }
      this.add(name, reason);
    });

    document.getElementById('dislike-name')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const name   = document.getElementById('dislike-name')?.value.trim();
        const reason = document.getElementById('dislike-reason')?.value || 'no_gusta';
        if (name) this.add(name, reason);
      }
    });
  },

  // ── Add a disliked ingredient ──────────────────────────────────────────────
  add(name, reason) {
    Storage.update(KEYS.DISLIKED, (items) => {
      const arr = Array.isArray(items) ? items : [];
      if (arr.some(i => i.name.toLowerCase() === name.toLowerCase())) return arr;
      return [...arr, { id: Date.now(), name, reason }];
    }, []);

    const inp = document.getElementById('dislike-name');
    if (inp) { inp.value = ''; inp.focus(); }

    this.render();
  },

  // ── Remove a disliked ingredient ───────────────────────────────────────────
  remove(id) {
    Storage.update(KEYS.DISLIKED, (items) => {
      return Array.isArray(items) ? items.filter(i => i.id !== id) : [];
    }, []);
    this.render();
  },

  // ── Get the disliked list ──────────────────────────────────────────────────
  getList() {
    return Storage.get(KEYS.DISLIKED, []);
  },

  // ── Render the disliked list ───────────────────────────────────────────────
  render() {
    const container = document.getElementById('disliked-list-container');
    if (!container) return;

    const items = this.getList();

    if (!items.length) {
      container.innerHTML = `
        <div class="card">
          <p class="text-muted text-center">Nada agregado. Si hay algo que no tolerás o no te gusta, agregalo aquí para que las recetas lo tengan en cuenta.</p>
        </div>
      `;
      this._checkWarning();
      return;
    }

    const reasonLabels = {
      no_gusta:    'No me gusta',
      intolerancia:'Intolerancia',
      alergia:     'Alergia'
    };
    const badgeClass = {
      no_gusta:    'disliked-badge--gray',
      intolerancia:'disliked-badge--amber',
      alergia:     'disliked-badge--red'
    };

    container.innerHTML = `
      <div class="card">
        <ul class="pantry-list">
          ${items.map(item => `
            <li class="pantry-item" data-id="${item.id}">
              <span class="pantry-item-name">${this._capitalize(item.name)}</span>
              <span class="disliked-badge ${badgeClass[item.reason] || 'disliked-badge--gray'}">
                ${reasonLabels[item.reason] || item.reason}
              </span>
              <button class="btn-remove" data-id="${item.id}" aria-label="Quitar ${item.name}">✕</button>
            </li>
          `).join('')}
        </ul>
      </div>
    `;

    container.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', () => this.remove(parseInt(btn.dataset.id)));
    });

    this._checkWarning();
  },

  // ── Show warning if allowed recipe count is below threshold ───────────────
  _checkWarning() {
    const warning = document.getElementById('dislike-warning');
    if (!warning) return;

    if (typeof Nutrition === 'undefined' || typeof RECIPES === 'undefined') {
      warning.innerHTML = '';
      return;
    }

    const allowed = RECIPES.filter(r => Nutrition.isRecipeAllowed(r)).length;

    if (allowed < 15) {
      warning.innerHTML = `
        <div class="card card-warning">
          ⚠️ Tenés pocos ingredientes disponibles (${allowed} recetas). Si querés más variedad,
          abrí Claude Code y pedile que agregue recetas que no incluyan tus restricciones.
        </div>
      `;
    } else {
      warning.innerHTML = '';
    }
  },

  _capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};
