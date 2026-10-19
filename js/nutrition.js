/**
 * nutrition.js — Weekly meal planner and daily tracking.
 */

const Nutrition = {
  _weekOffset: 0,

  // ── Initialization ──────────────────────────────────────────────────────────
  init() {
    this._setupInnerTabs();
    this._setupEvents();
    this.renderWeeklyPlan();
    this.renderDailyTracking();
  },

  // ── Recipe filter: returns false if any ingredient matches a disliked item ──
  isRecipeAllowed(recipe) {
    const disliked = Storage.get(KEYS.DISLIKED, []);
    if (!disliked.length) return true;
    return !recipe.ingredients.some(ing => {
      const ingName = (typeof ing === 'string' ? ing : ing.name).toLowerCase();
      return disliked.some(d => {
        const dName = d.name.toLowerCase();
        return ingName.includes(dName) || dName.includes(ingName);
      });
    });
  },

  // ── Inner tab switching ────────────────────────────────────────────────────
  _setupInnerTabs() {
    const section = document.getElementById('section-nutricion');
    if (!section) return;
    section.querySelectorAll('.tab-inner').forEach(btn => {
      btn.addEventListener('click', () => {
        section.querySelectorAll('.tab-inner').forEach(b => b.classList.remove('active'));
        section.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const tabId = 'tab-' + btn.dataset.tab;
        document.getElementById(tabId)?.classList.add('active');
        if (btn.dataset.tab === 'seguimiento') this.renderDailyTracking();
      });
    });
  },

  // ── Setup section events ───────────────────────────────────────────────────
  _setupEvents() {
    document.getElementById('btn-generate-plan')?.addEventListener('click', () => {
      this._generateAndSavePlan();
    });
    document.getElementById('btn-week-prev')?.addEventListener('click', () => {
      this._weekOffset--;
      this.renderWeeklyPlan();
    });
    document.getElementById('btn-week-next')?.addEventListener('click', () => {
      this._weekOffset++;
      this.renderWeeklyPlan();
    });
  },

  // ── Get Monday of current offset week ─────────────────────────────────────
  _getWeekStart(offset = 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dow  = today.getDay();
    const diff = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff + offset * 7);
    return monday;
  },

  // ── Render the weekly plan (7-column compact grid) ─────────────────────────
  renderWeeklyPlan() {
    const container = document.getElementById('weekly-plan-container');
    if (!container) return;

    const weekStart = this._getWeekStart(this._weekOffset);
    const weekEnd   = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekLabel = document.getElementById('week-label');
    if (weekLabel) {
      const fmtStart = this._formatDate(weekStart);
      const fmtEnd   = this._formatDate(weekEnd);
      weekLabel.textContent = `${fmtStart} — ${fmtEnd}`;
    }

    const plans   = Storage.get(KEYS.MEAL_PLANS, {});
    const today   = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const dayShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const slotShort = { desayuno: 'DES', almuerzo: 'ALM', merienda: 'MER', cena: 'CEN', snack: 'SNA' };
    const slots = ['desayuno', 'almuerzo', 'merienda', 'cena', 'snack'];

    let html = '';
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const dateStr  = d.toISOString().split('T')[0];
      const dayPlan  = plans[dateStr] || {};
      const isToday  = dateStr === todayStr;

      // Calculate day calorie total
      let dayKcal = 0;
      slots.forEach(slot => {
        if (dayPlan[slot]) {
          const r = RECIPES.find(r => r.id === dayPlan[slot]);
          if (r) dayKcal += r.calories;
        }
      });

      html += `
        <div class="day-plan-card${isToday ? ' day-today' : ''}">
          <div class="day-plan-header">
            <h4 class="${isToday ? 'today-day' : ''}">${dayShort[i]} <span style="font-weight:400;color:var(--text-muted)">${d.getDate()}</span></h4>
            <span class="day-cal-total">${dayKcal > 0 ? dayKcal + ' kcal' : '—'}</span>
          </div>
          ${slots.map(slot => {
            const recipeId = dayPlan[slot];
            const recipe   = recipeId ? RECIPES.find(r => r.id === recipeId) : null;
            return `
              <div class="meal-slot">
                <span class="meal-slot-type">${slotShort[slot]}</span>
                <span class="meal-slot-name${recipe ? ' recipe-clickable' : ''}" title="${recipe ? recipe.name : ''}" ${recipe ? `data-recipe-id="${recipe.id}"` : ''}>${recipe ? recipe.name : '<em style="color:var(--text-muted);font-size:0.7rem">—</em>'}</span>
                <button class="btn-swap" data-date="${dateStr}" data-slot="${slot}" title="Cambiar">⇄</button>
              </div>`;
          }).join('')}
        </div>
      `;
    }

    container.innerHTML = html || '<div class="empty-state"><p>No hay plan para esta semana. Generá uno.</p></div>';

    // Attach swap handlers
    container.querySelectorAll('.btn-swap').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._openSwapModal(btn.dataset.date, btn.dataset.slot);
      });
    });

    // Attach recipe detail click handlers
    container.querySelectorAll('.recipe-clickable').forEach(el => {
      el.addEventListener('click', () => {
        this.showRecipe(parseInt(el.dataset.recipeId));
      });
    });
  },

  // ── Generate and save a week plan ──────────────────────────────────────────
  _generateAndSavePlan() {
    const btn = document.getElementById('btn-generate-plan');
    if (btn) { btn.textContent = 'Generando...'; btn.disabled = true; }

    const weekStart = this._getWeekStart(this._weekOffset);
    const profile   = Storage.get(KEYS.PROFILE, null);
    const pantry    = Storage.get(KEYS.PANTRY, []);
    const existing  = Storage.get(KEYS.MEAL_PLANS, {});

    const plan = this._generateWeekPlan(weekStart, profile, pantry, existing);
    Storage.update(KEYS.MEAL_PLANS, (current) => ({ ...(current || {}), ...plan }), {});

    // Trigger disliked warning check if the Disliked module is available
    if (typeof Disliked !== 'undefined') {
      Disliked._checkWarning();
    }

    setTimeout(() => {
      if (btn) { btn.textContent = '⚡ Generar Plan Semanal'; btn.disabled = false; }
      this.renderWeeklyPlan();
    }, 300);
  },

  // ── Meal planning algorithm ────────────────────────────────────────────────
  _generateWeekPlan(weekStart, profile, pantry, existingPlans) {
    const plan = {};
    const slots = ['desayuno', 'almuerzo', 'merienda', 'cena', 'snack'];
    const goals       = profile ? Profile.calculateGoals(profile) : null;
    const proteinGoal = goals ? goals.proteinGoal : 160;

    // Track used recipes per slot across 3-day window
    const usedRecently = {}; // recipeId -> last day index used

    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayPlan = {};

      // Collect recently used recipe IDs from preceding 3 days
      for (let j = 1; j <= 3; j++) {
        const prev = new Date(d);
        prev.setDate(d.getDate() - j);
        const prevStr  = prev.toISOString().split('T')[0];
        const prevPlan = existingPlans[prevStr] || plan[prevStr] || {};
        slots.forEach(slot => {
          if (prevPlan[slot]) usedRecently[prevPlan[slot]] = i - j;
        });
      }

      slots.forEach(slot => {
        const typeMap = {
          desayuno: ['desayuno'],
          almuerzo: ['almuerzo'],
          merienda: ['merienda'],
          cena:     ['cena'],
          snack:    ['snack']
        };
        const targetTypes = typeMap[slot];

        // Start with type-matching, allowed recipes
        let candidates = RECIPES.filter(r =>
          r.type.some(t => targetTypes.includes(t)) && this.isRecipeAllowed(r)
        );

        // Fall back to all type-matching recipes if no allowed ones exist
        if (!candidates.length) {
          candidates = RECIPES.filter(r => r.type.some(t => targetTypes.includes(t)));
        }

        // Filter out recently used
        let filtered = candidates.filter(r => {
          const lastUsed = usedRecently[r.id];
          return lastUsed === undefined || (i - lastUsed) >= 3;
        });
        if (!filtered.length) filtered = candidates;

        // Pantry preference: prefer recipes where all ingredients are in pantry
        let pantryMatches = filtered;
        if (pantry.length > 0) {
          const pantryNames = pantry.map(p => (p.name || p).toLowerCase());
          const matched = filtered.filter(r =>
            r.ingredients.every(ing => {
              const ingName = (typeof ing === 'string' ? ing : ing.name).toLowerCase();
              return pantryNames.some(p => p.includes(ingName) || ingName.includes(p));
            })
          );
          if (matched.length > 0) pantryMatches = matched;
        }

        // Pick highest-protein option
        pantryMatches.sort((a, b) => b.protein - a.protein);
        const chosen = pantryMatches[0];
        if (chosen) {
          dayPlan[slot] = chosen.id;
          usedRecently[chosen.id] = i;
        }
      });

      plan[dateStr] = dayPlan;
    }

    return plan;
  },

  // ── Open swap modal ────────────────────────────────────────────────────────
  _openSwapModal(dateStr, slot) {
    const typeMap = {
      desayuno: ['desayuno'], almuerzo: ['almuerzo'],
      merienda: ['merienda'], cena:     ['cena'], snack: ['snack']
    };
    const types = typeMap[slot] || [slot];

    // Show allowed recipes first, then all if no allowed ones for this slot
    let options = RECIPES.filter(r => r.type.some(t => types.includes(t)) && this.isRecipeAllowed(r));
    if (!options.length) {
      options = RECIPES.filter(r => r.type.some(t => types.includes(t)));
    }

    const overlay = document.createElement('div');
    overlay.className = 'swap-modal-overlay';
    overlay.innerHTML = `
      <div class="swap-modal">
        <div class="flex-between mb-8">
          <h3>Cambiar ${this._slotLabel(slot)}</h3>
          <button class="btn-icon btn-small" id="close-swap">✕</button>
        </div>
        ${options.map(r => `
          <div class="swap-option" data-recipe-id="${r.id}">
            <div>
              <div class="swap-option-name">${r.name}</div>
              <div class="text-muted text-xs mt-4">⏱ ${r.prepTime} min · ${r.instructions.slice(0, 60)}...</div>
            </div>
            <div class="swap-option-macros">
              <div><strong>${r.calories}</strong> kcal</div>
              <div>P: ${r.protein}g</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#close-swap').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    overlay.querySelectorAll('.swap-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const recipeId = parseInt(opt.dataset.recipeId);
        Storage.update(KEYS.MEAL_PLANS, (plans) => {
          const p = plans || {};
          p[dateStr] = { ...(p[dateStr] || {}), [slot]: recipeId };
          return p;
        }, {});
        overlay.remove();
        this.renderWeeklyPlan();
      });
    });
  },

  // ── Render daily tracking ──────────────────────────────────────────────────
  renderDailyTracking() {
    this._renderDailyMacros();
    this._renderDailyMeals();
  },

  _renderDailyMacros() {
    const card = document.getElementById('daily-macros-card');
    if (!card) return;

    const today    = new Date().toISOString().split('T')[0];
    const eaten    = Storage.get(KEYS.MEALS_EATEN, {})[today] || [];
    const profile  = Storage.get(KEYS.PROFILE, null);
    const goals    = profile ? Profile.calculateGoals(profile) : null;
    const calGoal  = goals ? goals.calorieGoal : 2000;
    const protGoal = goals ? goals.proteinGoal : 160;
    const carbGoal = 250;
    const fatGoal  = 70;

    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    eaten.forEach(id => {
      const r = RECIPES.find(r => r.id === id);
      if (r) {
        totals.calories += r.calories;
        totals.protein  += r.protein;
        totals.carbs    += r.carbs;
        totals.fat      += r.fat;
      }
    });

    const pct    = (val, goal) => Math.min(100, Math.round((val / goal) * 100));
    const calPct = pct(totals.calories, calGoal);

    card.innerHTML = `
      <div class="flex-between mb-8">
        <h3>Calorías de hoy</h3>
        <span class="text-muted text-sm">${totals.calories} / ${calGoal} kcal</span>
      </div>
      <div class="progress-bar" style="height:12px;margin-bottom:16px">
        <div class="progress-fill ${calPct > 105 ? 'red' : 'green'}" style="width:${calPct}%"></div>
      </div>
      ${[
        { label: 'Proteína',       val: totals.protein, goal: protGoal, unit: 'g', color: 'green' },
        { label: 'Carbohidratos',  val: totals.carbs,   goal: carbGoal, unit: 'g', color: 'blue'  },
        { label: 'Grasas',         val: totals.fat,     goal: fatGoal,  unit: 'g', color: 'amber' }
      ].map(m => `
        <div class="macro-row">
          <span class="macro-label">${m.label}</span>
          <div class="macro-bar-wrap">
            <div class="progress-bar">
              <div class="progress-fill ${m.color}" style="width:${pct(m.val, m.goal)}%"></div>
            </div>
          </div>
          <span class="macro-value">${m.val}${m.unit}</span>
        </div>
      `).join('')}
    `;
  },

  _renderDailyMeals() {
    const card = document.getElementById('daily-meals-card');
    if (!card) return;

    const today    = new Date().toISOString().split('T')[0];
    const plans    = Storage.get(KEYS.MEAL_PLANS, {});
    const dayPlan  = plans[today] || {};
    const eaten    = Storage.get(KEYS.MEALS_EATEN, {})[today] || [];
    const slots    = ['desayuno', 'almuerzo', 'merienda', 'cena', 'snack'];

    const plannedMeals = slots
      .map(slot => ({ slot, recipeId: dayPlan[slot] }))
      .filter(m => m.recipeId);

    if (!plannedMeals.length) {
      card.innerHTML = `
        <h3>Comidas de hoy</h3>
        <div class="empty-state">
          <p>No hay plan para hoy. Generá un plan semanal en la pestaña "Plan Semanal".</p>
        </div>
      `;
      return;
    }

    card.innerHTML = `
      <h3>Comidas de hoy</h3>
      ${plannedMeals.map(({ slot, recipeId }) => {
        const recipe  = RECIPES.find(r => r.id === recipeId);
        if (!recipe) return '';
        const isEaten = eaten.includes(recipeId);
        const uid     = `meal-check-${recipeId}-${slot}`;
        return `
          <div class="meal-check-item">
            <input type="checkbox" id="${uid}" data-recipe-id="${recipeId}" ${isEaten ? 'checked' : ''}>
            <div style="flex:1">
              <label for="${uid}" class="${isEaten ? 'checked' : ''}">
                <strong>${this._slotLabel(slot)}</strong> — <span class="recipe-clickable" data-recipe-id="${recipeId}" style="cursor:pointer;text-decoration:underline dotted">${recipe.name}</span>
              </label>
            </div>
            <span class="meal-cal-badge">${recipe.calories} kcal</span>
          </div>
        `;
      }).join('')}
    `;

    card.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const recipeId = parseInt(cb.dataset.recipeId);
        Storage.update(KEYS.MEALS_EATEN, (eaten) => {
          const obj      = eaten || {};
          const todayArr = [...(obj[today] || [])];
          if (cb.checked) {
            if (!todayArr.includes(recipeId)) todayArr.push(recipeId);
          } else {
            const idx = todayArr.indexOf(recipeId);
            if (idx > -1) todayArr.splice(idx, 1);
          }
          return { ...obj, [today]: todayArr };
        }, {});
        const label = cb.nextElementSibling?.querySelector('label') ||
                      cb.parentNode.querySelector('label');
        if (label) label.classList.toggle('checked', cb.checked);
        this._renderDailyMacros();
        if (typeof Dashboard !== 'undefined') Dashboard.render();
      });
    });

    // Attach recipe detail click handlers
    card.querySelectorAll('.recipe-clickable').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.showRecipe(parseInt(el.dataset.recipeId));
      });
    });
  },

  // ── Get today's totals (used by Dashboard) ─────────────────────────────────
  getTodayTotals() {
    const today = new Date().toISOString().split('T')[0];
    const eaten = Storage.get(KEYS.MEALS_EATEN, {})[today] || [];
    let totals  = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    eaten.forEach(id => {
      const r = RECIPES.find(r => r.id === id);
      if (r) {
        totals.calories += r.calories;
        totals.protein  += r.protein;
        totals.carbs    += r.carbs;
        totals.fat      += r.fat;
      }
    });
    return totals;
  },

  // ── Get today's planned meals ──────────────────────────────────────────────
  getTodayMeals() {
    const today   = new Date().toISOString().split('T')[0];
    const plans   = Storage.get(KEYS.MEAL_PLANS, {});
    const dayPlan = plans[today] || {};
    const eaten   = Storage.get(KEYS.MEALS_EATEN, {})[today] || [];
    const slots   = ['desayuno', 'almuerzo', 'merienda', 'cena', 'snack'];
    return slots
      .map(slot => {
        const recipeId = dayPlan[slot];
        if (!recipeId) return null;
        const recipe = RECIPES.find(r => r.id === recipeId);
        if (!recipe) return null;
        return { slot, recipe, eaten: eaten.includes(recipeId) };
      })
      .filter(Boolean);
  },

  // ── Recipe detail cooking mode overlay ───────────────────────────────────
  showRecipe(recipeId) {
    const recipe = RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    const overlay = document.getElementById('recipe-overlay');
    const content = document.getElementById('recipe-modal-content');
    if (!overlay || !content) return;

    const typeLabels = { desayuno: 'Desayuno', almuerzo: 'Almuerzo', cena: 'Cena', merienda: 'Merienda', snack: 'Snack' };
    const typeStr = recipe.type.map(t => typeLabels[t] || t).join(' · ');

    content.innerHTML = `
      <div class="recipe-header">
        <div class="recipe-type-badge">${typeStr}</div>
        <h2>${recipe.name}</h2>
        <div class="recipe-meta">
          <span>⏱ ${recipe.prepTime} min</span>
          <span>🔥 ${recipe.calories} kcal</span>
          <span>💪 ${recipe.protein}g proteína</span>
        </div>
      </div>
      <div class="recipe-body">
        <div class="recipe-section">
          <h4>Ingredientes</h4>
          <ul class="recipe-ingredients">
            ${recipe.ingredients.map(i => `<li><span class="ing-amount">${i.amount}</span> ${i.name}</li>`).join('')}
          </ul>
        </div>
        <div class="recipe-section">
          <h4>Preparación</h4>
          <p class="recipe-instructions">${recipe.instructions}</p>
        </div>
        <div class="recipe-macros">
          <div class="macro-pill">Proteínas <strong>${recipe.protein}g</strong></div>
          <div class="macro-pill">Carbohidratos <strong>${recipe.carbs}g</strong></div>
          <div class="macro-pill">Grasas <strong>${recipe.fat}g</strong></div>
        </div>
      </div>
    `;

    overlay.classList.remove('hidden');
    document.getElementById('btn-close-recipe').onclick = () => overlay.classList.add('hidden');
    overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.add('hidden'); };
  },

  // ── Helpers ───────────────────────────────────────────────────────────────
  _slotLabel(slot) {
    const labels = {
      desayuno: 'Desayuno', almuerzo: 'Almuerzo',
      merienda: 'Merienda', cena:     'Cena', snack: 'Snack'
    };
    return labels[slot] || slot;
  },

  _formatDate(date) {
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  }
};
