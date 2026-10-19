/**
 * shopping.js — Shopping list generated from weekly meal plan vs pantry.
 */

const Shopping = {
  _checkedItems: new Set(),

  // ── Initialization ──────────────────────────────────────────────────────────
  init() {
    this._checkedItems = new Set(Storage.get('fitapp_shopping_checked', []));
    this._initManual();
  },

  // ── Manual items ─────────────────────────────────────────────────────────
  _initManual() {
    const btn = document.getElementById('btn-add-manual');
    const inp = document.getElementById('manual-item-input');
    if (!btn || !inp) return;

    btn.addEventListener('click', () => {
      const val = inp.value.trim();
      if (!val) return;
      const items = Storage.get(KEYS.SHOPPING_MANUAL, []);
      if (!items.find(i => i.name.toLowerCase() === val.toLowerCase())) {
        items.push({ id: Date.now(), name: val, checked: false });
        Storage.set(KEYS.SHOPPING_MANUAL, items);
      }
      inp.value = '';
      this._renderManual();
    });

    inp.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
    this._renderManual();
  },

  _renderManual() {
    const container = document.getElementById('manual-items-list');
    if (!container) return;
    const items = Storage.get(KEYS.SHOPPING_MANUAL, []);

    if (items.length === 0) {
      container.innerHTML = '<p class="text-muted text-sm">Sin ítems. Agregá lo que necesitás comprar.</p>';
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="shopping-item" style="justify-content:space-between">
        <div style="display:flex;align-items:center;gap:10px">
          <input type="checkbox" id="manual-${item.id}" data-id="${item.id}" ${item.checked ? 'checked' : ''}>
          <label for="manual-${item.id}" class="${item.checked ? 'checked' : ''}" style="cursor:pointer">${item.name}</label>
        </div>
        <button class="btn-icon btn-danger-sm" data-remove="${item.id}" title="Eliminar">✕</button>
      </div>
    `).join('');

    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const items = Storage.get(KEYS.SHOPPING_MANUAL, []);
        const item = items.find(i => i.id == cb.dataset.id);
        if (item) { item.checked = cb.checked; Storage.set(KEYS.SHOPPING_MANUAL, items); }
        this._renderManual();
      });
    });

    container.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const items = Storage.get(KEYS.SHOPPING_MANUAL, []).filter(i => i.id != btn.dataset.remove);
        Storage.set(KEYS.SHOPPING_MANUAL, items);
        this._renderManual();
      });
    });
  },

  // ── Render the shopping list ───────────────────────────────────────────────
  render() {
    const container = document.getElementById('shopping-list-container');
    if (!container) return;

    const weekIngredients = this._getWeekIngredients();
    const pantryItems     = Storage.get(KEYS.PANTRY, []).map(i => i.name.toLowerCase());

    // Determine what's missing
    const needed = [...weekIngredients].filter(ing =>
      !pantryItems.some(p => p.includes(ing) || ing.includes(p))
    );

    if (weekIngredients.size === 0) {
      container.innerHTML = `
        <div class="card">
          <div class="empty-state">
            <span class="empty-icon">🛒</span>
            <p>Generá un plan semanal para ver qué necesitás comprar.</p>
          </div>
        </div>
      `;
      return;
    }

    if (needed.length === 0) {
      container.innerHTML = `
        <div class="card card-accent">
          <div class="empty-state">
            <span class="empty-icon">✅</span>
            <p>¡Tenés todo lo necesario para el plan de esta semana!</p>
          </div>
        </div>
      `;
      return;
    }

    // Also list pantry-available items separately
    const available = [...weekIngredients].filter(ing =>
      pantryItems.some(p => p.includes(ing) || ing.includes(p))
    );

    const renderItems = (items, sectionTitle) => `
      <div class="card">
        <div class="shopping-section-title">${sectionTitle} (${items.length})</div>
        ${items.sort().map(ing => {
          const uid = `shop-${ing.replace(/\s+/g, '-')}`;
          const isChecked = this._checkedItems.has(ing);
          return `
            <div class="shopping-item">
              <input type="checkbox" id="${uid}" data-ingredient="${ing}" ${isChecked ? 'checked' : ''}>
              <label for="${uid}" class="${isChecked ? 'checked' : ''}">${this._capitalize(ing)}</label>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.innerHTML = `
      <div class="card">
        <div class="flex-between mb-8">
          <h3>Lista de Compras</h3>
          <button class="btn-secondary btn-small" id="btn-clear-checks">Desmarcar todo</button>
        </div>
        <p class="text-muted text-sm">Basada en el plan de esta semana vs tu despensa.</p>
      </div>
      ${renderItems(needed, '🛒 Necesitás comprar')}
      ${available.length > 0 ? renderItems(available, '✅ Ya tenés en despensa') : ''}
    `;

    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const ing = cb.dataset.ingredient;
        if (cb.checked) {
          this._checkedItems.add(ing);
        } else {
          this._checkedItems.delete(ing);
        }
        const label = cb.nextElementSibling;
        if (label) label.classList.toggle('checked', cb.checked);
        Storage.set('fitapp_shopping_checked', [...this._checkedItems]);
      });
    });

    document.getElementById('btn-clear-checks')?.addEventListener('click', () => {
      this._checkedItems.clear();
      Storage.set('fitapp_shopping_checked', []);
      this.render();
    });
  },

  // ── Collect all ingredients from this week's meal plan ────────────────────
  _getWeekIngredients() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dow  = today.getDay();
    const diff = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);

    const plans     = Storage.get(KEYS.MEAL_PLANS, {});
    const allIngr   = new Set();
    const slots     = ['desayuno','almuerzo','merienda','cena','snack'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayPlan = plans[dateStr] || {};
      slots.forEach(slot => {
        if (dayPlan[slot]) {
          const recipe = RECIPES.find(r => r.id === dayPlan[slot]);
          if (recipe) {
            recipe.ingredients.forEach(ing => {
              const name = typeof ing === 'string' ? ing : ing.name;
              allIngr.add(name.toLowerCase());
            });
          }
        }
      });
    }

    return allIngr;
  },

  _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};
