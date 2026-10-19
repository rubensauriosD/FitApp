/**
 * historial.js — Training history page: session log with rep tracking data.
 */

const Historial = {

  // ── Initialization ──────────────────────────────────────────────────────────
  init() {
    // Nothing to wire up on init — render is triggered by navigation
  },

  // ── Main render ────────────────────────────────────────────────────────────
  render() {
    const container = document.getElementById('historial-container');
    if (!container) return;

    const log    = Storage.get(KEYS.TRAINING_LOG, [])
                          .filter(e => e.completed)
                          .sort((a, b) => b.date.localeCompare(a.date));
    const repLog = Storage.get(KEYS.REP_LOG, []);

    if (log.length === 0) {
      container.innerHTML = `
        <div class="card">
          <div class="empty-state">
            <span class="empty-icon">📊</span>
            <p>Completá tu primer entreno para ver el historial.</p>
          </div>
        </div>
      `;
      return;
    }

    // ── Summary stats ─────────────────────────────────────────────────────────
    const totalWorkouts  = log.length;
    const totalKcal      = log.reduce((sum, e) => sum + (e.caloriesBurned || (e.dayType === 'B' ? 420 : 380)), 0);
    const totalMinutes   = log.reduce((sum, e) => {
      if (e.duration && e.duration < 300) return sum + e.duration;
      return sum + (e.dayType === 'B' ? 50 : 55);
    }, 0);
    const totalHours     = Math.floor(totalMinutes / 60);
    const remMins        = totalMinutes % 60;
    const timeStr        = totalHours > 0 ? `${totalHours}h ${remMins}m` : `${remMins}m`;

    const summaryHtml = `
      <div class="historial-summary">
        <div class="stat-tile">
          <div class="stat-number">${totalWorkouts}</div>
          <div class="stat-label">Entrenos totales</div>
        </div>
        <div class="stat-tile">
          <div class="stat-number">${timeStr}</div>
          <div class="stat-label">Tiempo total</div>
        </div>
        <div class="stat-tile">
          <div class="stat-number">~${totalKcal.toLocaleString('es-AR')}</div>
          <div class="stat-label">kcal estimadas</div>
        </div>
      </div>
    `;

    // ── Session cards ─────────────────────────────────────────────────────────
    const sessionsHtml = log.map((entry, idx) => {
      const dateStr   = this._formatDateSpanish(entry.date);
      const dayClass  = entry.dayType === 'A' ? 'day-type-A' : entry.dayType === 'B' ? 'day-type-B' : 'day-type-rest';
      const dayLabel  = entry.dayType === 'A' ? '💪 Día A' : entry.dayType === 'B' ? '🥊 Día B' : '😴 Descanso';
      const duration  = entry.duration && entry.duration < 300 ? entry.duration : (entry.dayType === 'B' ? 50 : 55);
      const kcal      = entry.caloriesBurned || (entry.dayType === 'B' ? 420 : 380);

      // Find rep entries for this session date
      const sessionReps = repLog.filter(r => r.date === entry.date);
      const hasReps     = sessionReps.length > 0;
      const repRowsHtml = sessionReps.map(r => {
        const ok        = r.actualReps >= r.targetReps;
        const resultCls = ok ? 'historial-rep-ok' : 'historial-rep-warn';
        const icon      = ok ? '✅' : '⚠️';
        return `
          <div class="historial-rep-row">
            <span class="historial-rep-name">
              ${r.exerciseName}
              <span class="text-dim text-xs"> · R${r.round}</span>
            </span>
            <span class="historial-rep-result ${resultCls}">
              ${r.actualReps}/${r.targetReps} reps ${icon}
            </span>
          </div>
        `;
      }).join('');

      const uid = `reps-${idx}`;

      return `
        <div class="historial-session-card">
          <div class="historial-session-header">
            <span class="historial-session-date">${dateStr}</span>
            <span class="day-type-badge ${dayClass}" style="margin-bottom:0;padding:4px 12px;font-size:0.8rem">${dayLabel}</span>
          </div>
          <div class="historial-session-meta">
            <span class="historial-meta-item">⏱ <span>${duration} min</span></span>
            <span class="historial-meta-item">🔥 <span>${kcal} kcal</span></span>
          </div>
          ${hasReps ? `
            <button class="historial-reps-toggle" onclick="Historial._toggleReps('${uid}')">
              ▼ Ver reps (${sessionReps.length})
            </button>
            <div class="historial-reps-list" id="${uid}">
              ${repRowsHtml}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    container.innerHTML = summaryHtml + sessionsHtml;
  },

  // ── Toggle rep detail panel ───────────────────────────────────────────────
  _toggleReps(uid) {
    const el  = document.getElementById(uid);
    const btn = el?.previousElementSibling;
    if (!el) return;
    const isOpen = el.classList.toggle('open');
    if (btn) btn.textContent = isOpen
      ? btn.textContent.replace('▼', '▲')
      : btn.textContent.replace('▲', '▼');
  },

  // ── Format date in Spanish long format ───────────────────────────────────
  _formatDateSpanish(dateStr) {
    if (!dateStr) return '';
    const date   = new Date(dateStr + 'T00:00:00');
    const days   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const months = ['enero','febrero','marzo','abril','mayo','junio',
                    'julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return `${days[date.getDay()]} ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  }
};
