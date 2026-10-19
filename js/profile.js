/**
 * profile.js — Profile management, TDEE calculation, and weight tracking.
 */

let weightChartInstance = null;

const Profile = {
  // ── Initialization ──────────────────────────────────────────────────────────
  init() {
    this._populateForm();
    this._setupEvents();
    this._renderTDEE();
    this._renderWeightHistory();
    this._renderWeightChart();
    this._setupDataManagement();
    this._setupMeasurements();
  },

  // ── Get stored profile ─────────────────────────────────────────────────────
  getProfile() {
    return Storage.get(KEYS.PROFILE, null);
  },

  // ── Calculate calorie and protein goals ───────────────────────────────────
  calculateGoals(profile) {
    if (!profile || !profile.weight || !profile.height || !profile.age) {
      return null;
    }
    const { weight, height, age, gender } = profile;
    // Mifflin-St Jeor BMR
    let bmr;
    if (gender === 'femenino') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    }
    const tdee = Math.round(bmr * 1.55); // Moderately active
    const calorieGoal = tdee - 400;      // Slight deficit
    const proteinGoal = Math.round(weight * 2);
    return { bmr: Math.round(bmr), tdee, calorieGoal, proteinGoal };
  },

  // ── Populate form from storage ─────────────────────────────────────────────
  _populateForm() {
    const p = this.getProfile();
    if (!p) return;
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined && val !== null) el.value = val;
    };
    set('input-name', p.name);
    set('input-weight', p.weight);
    set('input-height', p.height);
    set('input-age', p.age);
    set('input-gender', p.gender);
    set('input-start-date', p.startDate);
    set('input-target-weight', p.targetWeight);
  },

  // ── Setup form events ──────────────────────────────────────────────────────
  _setupEvents() {
    const form = document.getElementById('profile-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this._saveProfile();
      });
    }

    const logBtn = document.getElementById('btn-log-weight');
    if (logBtn) {
      logBtn.addEventListener('click', () => this._logWeight());
    }

    // Auto-save on change (debounced)
    ['input-name','input-weight','input-height','input-age',
     'input-gender','input-start-date','input-target-weight'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', () => this._saveProfile(false));
      }
    });
  },

  // ── Save profile ──────────────────────────────────────────────────────────
  _saveProfile(showFeedback = true) {
    const get = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };
    const weight = parseFloat(get('input-weight'));
    const profile = {
      name:         get('input-name') || 'Usuario',
      weight:       isNaN(weight) ? null : weight,
      height:       parseFloat(get('input-height')) || null,
      age:          parseInt(get('input-age')) || null,
      gender:       get('input-gender') || 'masculino',
      startDate:    get('input-start-date') || new Date().toISOString().split('T')[0],
      targetWeight: parseFloat(get('input-target-weight')) || null
    };
    Storage.set(KEYS.PROFILE, profile);

    // Update greeting
    const greeting = document.getElementById('greeting');
    if (greeting) greeting.textContent = `¡Hola, ${profile.name}!`;

    // Hide onboarding prompt
    const onboardingMsg = document.getElementById('onboarding-msg');
    if (onboardingMsg) onboardingMsg.classList.add('hidden');

    this._renderTDEE();

    if (showFeedback) {
      this._showSavedFeedback();
    }

    // Refresh dashboard
    if (typeof Dashboard !== 'undefined') Dashboard.render();
  },

  // ── Render TDEE display ───────────────────────────────────────────────────
  _renderTDEE() {
    const p = this.getProfile();
    const card = document.getElementById('tdee-card');
    const display = document.getElementById('tdee-display');
    if (!card || !display) return;

    const goals = this.calculateGoals(p);
    if (!goals) {
      card.classList.add('hidden');
      return;
    }

    card.classList.remove('hidden');
    display.innerHTML = `
      <div class="tdee-grid">
        <div class="tdee-item">
          <div class="tdee-val">${goals.calorieGoal}</div>
          <div class="tdee-label">kcal / día</div>
        </div>
        <div class="tdee-item">
          <div class="tdee-val">${goals.proteinGoal}g</div>
          <div class="tdee-label">Proteína / día</div>
        </div>
        <div class="tdee-item">
          <div class="tdee-val">${goals.tdee}</div>
          <div class="tdee-label">TDEE</div>
        </div>
        <div class="tdee-item">
          <div class="tdee-val">${goals.bmr}</div>
          <div class="tdee-label">BMR</div>
        </div>
      </div>
      <p class="text-muted text-sm mt-8">
        Déficit de 400 kcal/día para composición corporal lean. Proteína 2g × kg de peso.
      </p>
    `;
  },

  // ── Log a weight entry ────────────────────────────────────────────────────
  _logWeight() {
    const input = document.getElementById('input-new-weight');
    if (!input) return;
    const w = parseFloat(input.value);
    if (isNaN(w) || w < 20 || w > 300) {
      input.style.borderColor = 'var(--danger)';
      setTimeout(() => { input.style.borderColor = ''; }, 1500);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    Storage.update(KEYS.WEIGHT_HISTORY, (history) => {
      const arr = Array.isArray(history) ? history : [];
      // Replace today's entry if exists
      const filtered = arr.filter(e => e.date !== today);
      return [...filtered, { date: today, weight: w }].sort((a, b) => a.date.localeCompare(b.date));
    }, []);

    // Update profile current weight
    const p = this.getProfile();
    if (p) {
      p.weight = w;
      Storage.set(KEYS.PROFILE, p);
      const inputWeight = document.getElementById('input-weight');
      if (inputWeight) inputWeight.value = w;
      this._renderTDEE();
    }

    input.value = '';
    input.placeholder = `✓ ${w} kg registrado`;
    setTimeout(() => { input.placeholder = 'Nuevo peso (kg)'; }, 2500);

    this._renderWeightHistory();
    this._renderWeightChart();
    if (typeof Dashboard !== 'undefined') Dashboard.render();
  },

  // ── Render weight history table ───────────────────────────────────────────
  _renderWeightHistory() {
    const container = document.getElementById('weight-history');
    if (!container) return;

    const history = Storage.get(KEYS.WEIGHT_HISTORY, []);
    if (!history.length) {
      container.innerHTML = '';
      return;
    }

    const recent = [...history].reverse().slice(0, 10);
    container.innerHTML = `
      <table class="weight-history-table">
        <thead>
          <tr><th>Fecha</th><th>Peso</th><th>Cambio</th></tr>
        </thead>
        <tbody>
          ${recent.map((entry, i) => {
            const prev = recent[i + 1];
            const diff = prev ? (entry.weight - prev.weight).toFixed(1) : null;
            const diffStr = diff !== null
              ? `<span class="${diff > 0 ? 'trend-up' : diff < 0 ? 'trend-down' : 'text-muted'}">${diff > 0 ? '+' : ''}${diff} kg</span>`
              : '—';
            return `<tr>
              <td>${this._formatDate(entry.date)}</td>
              <td><strong>${entry.weight} kg</strong></td>
              <td>${diffStr}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
  },

  // ── Render weight chart ───────────────────────────────────────────────────
  _renderWeightChart() {
    const canvas = document.getElementById('weight-chart');
    const empty  = document.getElementById('weight-chart-empty');
    if (!canvas) return;

    const history = Storage.get(KEYS.WEIGHT_HISTORY, []);

    if (history.length < 2) {
      canvas.classList.add('hidden');
      if (empty) empty.classList.remove('hidden');
      return;
    }

    canvas.classList.remove('hidden');
    if (empty) empty.classList.add('hidden');

    const labels = history.map(h => this._formatDate(h.date));
    const data   = history.map(h => h.weight);
    const profile = this.getProfile();
    const target  = profile && profile.targetWeight ? profile.targetWeight : null;

    // Destroy existing chart instance
    if (weightChartInstance) {
      weightChartInstance.destroy();
      weightChartInstance = null;
    }

    const ctx = canvas.getContext('2d');
    const datasets = [
      {
        label: 'Peso (kg)',
        data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ];

    if (target) {
      datasets.push({
        label: 'Objetivo',
        data: history.map(() => target),
        borderColor: 'rgba(245,158,11,0.6)',
        borderDash: [6, 4],
        pointRadius: 0,
        tension: 0,
        fill: false
      });
    }

    weightChartInstance = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#9ca3af', font: { size: 11 } }
          },
          tooltip: {
            backgroundColor: '#111827',
            titleColor: '#f9fafb',
            bodyColor: '#9ca3af',
            borderColor: '#374151',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            ticks: { color: '#9ca3af', font: { size: 10 }, maxTicksLimit: 6 },
            grid: { color: '#1f2937' }
          },
          y: {
            ticks: { color: '#9ca3af', font: { size: 10 } },
            grid: { color: '#1f2937' }
          }
        }
      }
    });
  },

  // ── Visual save feedback ──────────────────────────────────────────────────
  _showSavedFeedback() {
    const btn = document.querySelector('#profile-form [type="submit"]');
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = '✓ Guardado';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 1800);
  },

  // ── Format date for display ───────────────────────────────────────────────
  _formatDate(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return `${parseInt(d)} ${months[parseInt(m) - 1]}`;
  },

  // ── Short date format for measurements history ────────────────────────────
  _formatDateShort(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  },

  // ── Data export / import ──────────────────────────────────────────────────
  _setupDataManagement() {
    const btnExport = document.getElementById('btn-export-data');
    const btnImport = document.getElementById('btn-import-data');
    const dataMsg   = document.getElementById('data-msg');

    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const allKeys = Object.values(KEYS);
        const backup  = {};
        allKeys.forEach(k => { backup[k] = Storage.get(k, null); });
        const json = JSON.stringify(backup, null, 2);

        if (window.fitappElectron) {
          // Electron: use native save dialog
          window.fitappElectron.exportData(json).then(res => {
            if (res.success) {
              dataMsg.textContent = '✅ Datos exportados correctamente.';
              dataMsg.style.display = 'block';
            }
          });
        } else {
          // Browser fallback: download as file
          const blob = new Blob([json], { type: 'application/json' });
          const url  = URL.createObjectURL(blob);
          const a    = document.createElement('a');
          a.href     = url;
          a.download = `fitapp-backup-${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
          dataMsg.textContent = '✅ Archivo descargado.';
          dataMsg.style.display = 'block';
        }
      });
    }

    if (btnImport) {
      btnImport.addEventListener('click', async () => {
        if (window.fitappElectron) {
          // Electron: use native open dialog
          const res = await window.fitappElectron.importData();
          if (res.success) {
            try {
              const backup = JSON.parse(res.data);
              Object.entries(backup).forEach(([k, v]) => { if (v !== null) Storage.set(k, v); });
              dataMsg.textContent = '✅ Datos importados. Recargá la app para ver los cambios.';
              dataMsg.style.display = 'block';
            } catch {
              dataMsg.textContent = '❌ Error al leer el archivo.';
              dataMsg.style.display = 'block';
            }
          }
        } else {
          // Browser fallback: file input
          const input    = document.createElement('input');
          input.type     = 'file';
          input.accept   = '.json';
          input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader   = new FileReader();
            reader.onload  = (ev) => {
              try {
                const backup = JSON.parse(ev.target.result);
                Object.entries(backup).forEach(([k, v]) => { if (v !== null) Storage.set(k, v); });
                dataMsg.textContent = '✅ Datos importados. Recargá la app.';
                dataMsg.style.display = 'block';
              } catch {
                dataMsg.textContent = '❌ Archivo inválido.';
                dataMsg.style.display = 'block';
              }
            };
            reader.readAsText(file);
          };
          input.click();
        }
      });
    }
  },

  // ── Body measurements tracking ────────────────────────────────────────────
  _setupMeasurements() {
    const btnSave = document.getElementById('btn-save-measurements');
    if (!btnSave) return;

    // Pre-fill inputs from last saved entry
    const history = Storage.get(KEYS.MEASUREMENTS, []);
    if (history.length > 0) {
      const last = history[history.length - 1];
      if (last.waist) document.getElementById('m-waist').value = last.waist;
      if (last.chest) document.getElementById('m-chest').value = last.chest;
      if (last.arm)   document.getElementById('m-arm').value   = last.arm;
      if (last.thigh) document.getElementById('m-thigh').value = last.thigh;
    }

    btnSave.addEventListener('click', () => {
      const entry = {
        date:  new Date().toISOString().split('T')[0],
        waist: parseFloat(document.getElementById('m-waist').value)  || null,
        chest: parseFloat(document.getElementById('m-chest').value)  || null,
        arm:   parseFloat(document.getElementById('m-arm').value)    || null,
        thigh: parseFloat(document.getElementById('m-thigh').value)  || null,
      };
      const hist = Storage.get(KEYS.MEASUREMENTS, []);
      const idx  = hist.findIndex(e => e.date === entry.date);
      if (idx >= 0) hist[idx] = entry;
      else hist.push(entry);
      Storage.set(KEYS.MEASUREMENTS, hist);

      // Visual feedback on button
      const orig = btnSave.textContent;
      btnSave.textContent = '✓ Guardado';
      btnSave.disabled = true;
      setTimeout(() => { btnSave.textContent = orig; btnSave.disabled = false; }, 1800);

      this._renderMeasurementsHistory();
    });

    this._renderMeasurementsHistory();
  },

  // ── Render measurements history ───────────────────────────────────────────
  _renderMeasurementsHistory() {
    const container = document.getElementById('measurements-history');
    if (!container) return;
    const history = Storage.get(KEYS.MEASUREMENTS, []).slice().reverse().slice(0, 5);
    if (history.length === 0) {
      container.innerHTML = '<p class="text-muted text-sm">Sin registros aún.</p>';
      return;
    }
    const labels = { waist: 'Cintura', chest: 'Pecho', arm: 'Brazo', thigh: 'Pierna' };
    container.innerHTML = history.map(e => `
      <div class="measurement-entry">
        <span class="measurement-date">${this._formatDateShort(e.date)}</span>
        <span class="measurement-values">
          ${Object.entries(labels).filter(([k]) => e[k]).map(([k, l]) => `${l}: <strong>${e[k]}cm</strong>`).join(' · ')}
        </span>
      </div>
    `).join('');
  }
};
