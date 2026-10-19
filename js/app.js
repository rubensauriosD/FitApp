/**
 * app.js — Application router, navigation, dashboard, and initialization.
 */

// ─── Dashboard ───────────────────────────────────────────────────────────────

const Dashboard = {
  render() {
    const profile = Storage.get(KEYS.PROFILE, null);

    // Greeting
    const greeting = document.getElementById('greeting');
    if (greeting) {
      greeting.textContent = profile ? `¡Hola, ${profile.name}!` : '¡Hola!';
    }

    // Date
    const dateEl = document.getElementById('today-date');
    if (dateEl) dateEl.textContent = this._formatDateLong(new Date());

    // Check if profile exists
    const prompt = document.getElementById('profile-prompt');
    const content = document.getElementById('dashboard-content');

    if (!profile || !profile.weight) {
      prompt?.classList.remove('hidden');
      if (content) content.style.opacity = '0.4';
    } else {
      prompt?.classList.add('hidden');
      if (content) content.style.opacity = '1';
    }

    // Show 2-month reminder if applicable
    const dismissed = Storage.get('fitapp_reminder_dismissed', false);
    const startDate = profile?.startDate;
    if (startDate && !dismissed) {
      const start = new Date(startDate);
      const today = new Date();
      if (!isNaN(start.getTime())) {
        const daysDiff = Math.floor((today - start) / 86400000);
        if (daysDiff >= 60 && daysDiff < 3650) {
          const banner = document.getElementById('reminder-banner');
          if (banner) banner.classList.remove('hidden');
        }
      }
    }

    this._renderWorkoutCard(profile);
    this._renderWeekCard();
    this._renderStatsCard();
    this._renderWeightCard(profile);
    this._renderStreakCard();
  },

  _renderWorkoutCard(profile) {
    const card = document.getElementById('card-workout-today');
    if (!card) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isTraining = Workout.isTrainingDay(today);
    const dayType    = Workout.getTodayDayType();
    const todayStr   = getLocalDateString(today);
    const log        = Storage.get(KEYS.TRAINING_LOG, []);
    const trained    = log.some(e => e.date === todayStr);

    const dayLabel    = dayType === 'A' ? 'Día A — Fuerza'
                      : dayType === 'B' ? 'Día B — Cardio y Boxeo'
                      : '';
    const daySubtitle = dayType === 'A' ? '~55 min · Piernas · Tren superior · Core'
                      : dayType === 'B' ? '~50 min · Boxeo · Cardio intervals · Core'
                      : '';

    const statusColor = trained ? 'var(--success)' : isTraining ? 'var(--text)' : 'var(--text-muted)';
    const statusLabel = trained
      ? '✅ Completado' + (isTraining ? '' : ' · Día de descanso')
      : isTraining ? `💪 ${dayLabel}` : '😴 Día de Descanso';
    const showBtn = !trained && isTraining;
    const showRestBtn = !trained && !isTraining;

    card.innerHTML = `
      <div class="dashboard-card-label">Entrenamiento de hoy</div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div class="dashboard-big-number" style="font-size:1.5rem;color:${statusColor}">
            ${statusLabel}
          </div>
          ${daySubtitle && !trained ? `<div class="dashboard-sub">${daySubtitle}</div>` : ''}
        </div>
        ${showBtn ? `<button class="btn-primary" id="btn-dash-start-workout">Iniciar</button>` : ''}
        ${showRestBtn ? `<button class="btn-secondary btn-small" id="btn-dash-start-workout">Entrenar igual</button>` : ''}
      </div>
    `;

    document.getElementById('btn-dash-start-workout')?.addEventListener('click', () => {
      App.navigateTo('entreno');
      setTimeout(() => Workout.startWorkout(), 100);
    });
  },

  _renderWeekCard() {
    const card = document.getElementById('card-week');
    if (!card) return;

    const profile   = Storage.get(KEYS.PROFILE, null);
    const startDate = profile?.startDate || getLocalDateString();
    const log       = Storage.get(KEYS.TRAINING_LOG, []);
    const trained   = new Set(log.filter(e => e.completed).map(e => e.date));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = getLocalDateString(today);

    // Monday of the current week (ISO: Mon=first day)
    const dow = today.getDay(); // 0=Sun
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dow + 6) % 7));

    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    let trainingDaysTotal = 0;
    let trainedCount      = 0;
    let daysHtml          = '';

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      const dateStr  = getLocalDateString(day);
      const dayType  = getWorkoutDayType(dateStr, startDate);
      const isFuture = day > today;
      const isToday  = dateStr === todayStr;
      const wasTrained = trained.has(dateStr);

      let dot      = '';
      let dotStyle = '';
      let typeLabel = '';

      if (dayType === 'rest') {
        if (wasTrained) {
          // Trained on a rest day — show green with "Extra" label
          trainedCount++;
          dot      = '●';
          dotStyle = 'color:var(--success)';
          typeLabel = 'Extra';
        } else {
          dot      = '●';
          dotStyle = 'color:var(--text-muted)';
          typeLabel = 'Desc';
        }
      } else {
        trainingDaysTotal++;
        if (isFuture) {
          dot      = '—';
          dotStyle = 'color:var(--border)';
          typeLabel = dayType;
        } else if (wasTrained) {
          trainedCount++;
          dot      = '●';
          dotStyle = 'color:var(--success)';
          typeLabel = dayType;
        } else if (isToday) {
          dot      = '●';
          dotStyle = 'color:var(--warning)';
          typeLabel = dayType;
        } else {
          // Past training day, missed
          dot      = '●';
          dotStyle = 'color:var(--danger)';
          typeLabel = dayType;
        }
      }

      daysHtml += `
        <div>
          <div class="week-day-label${isToday ? ' today' : ''}">${dayNames[i]}</div>
          <span class="week-dot" style="${dotStyle}">${dot}</span>
          <div class="week-type">${typeLabel}</div>
        </div>
      `;
    }

    const progressPct = trainingDaysTotal > 0
      ? Math.round((trainedCount / trainingDaysTotal) * 100)
      : 0;

    card.innerHTML = `
      <div class="dashboard-card-label">Semana en curso</div>
      <div class="week-strip">${daysHtml}</div>
      <div class="week-progress-row">
        <div class="week-progress-bar">
          <div class="week-progress-fill" style="width:${progressPct}%"></div>
        </div>
        <span class="text-sm text-muted">${trainedCount} de ${trainingDaysTotal} entrenamientos esta semana</span>
      </div>
    `;
  },

  _renderStatsCard() {
    const card = document.getElementById('card-stats');
    if (!card) return;

    const now         = new Date();
    const year        = now.getFullYear();
    const month       = now.getMonth(); // 0-indexed
    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthNames  = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                         'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

    const log          = Storage.get(KEYS.TRAINING_LOG, []);
    const monthEntries = log.filter(e => e.completed && e.date.startsWith(monthPrefix));
    const allCompleted = log.filter(e => e.completed);

    // 1. Workouts this month
    const workoutsThisMonth = monthEntries.length;

    // 2. All-time max streak (consecutive logged sessions)
    const maxStreak = this._calcMaxStreak(allCompleted);

    // 3. Total time this month — stored duration is in minutes (< 300 check guards
    //    against legacy entries that stored elapsed seconds instead of minutes)
    let totalMinutes = 0;
    monthEntries.forEach(e => {
      if (e.duration && e.duration < 300) {
        totalMinutes += e.duration;
      } else if (e.dayType === 'B') {
        totalMinutes += 50;
      } else if (e.dayType === 'A') {
        totalMinutes += 55;
      } else {
        totalMinutes += 52;
      }
    });
    const totalHours = Math.floor(totalMinutes / 60);
    const totalMins  = totalMinutes % 60;
    const timeStr    = workoutsThisMonth === 0
      ? '0m'
      : totalHours > 0 ? `${totalHours}h ${totalMins}m` : `${totalMins}m`;

    // 4. Estimated calories burned this month
    let totalCalories = 0;
    monthEntries.forEach(e => {
      if (e.caloriesBurned) {
        totalCalories += e.caloriesBurned;
      } else if (e.dayType === 'B') {
        totalCalories += 420;
      } else if (e.dayType === 'A') {
        totalCalories += 380;
      } else {
        totalCalories += 400;
      }
    });

    card.innerHTML = `
      <div class="dashboard-card-label">Estadísticas — ${monthNames[month]}</div>
      <div class="stats-grid">
        <div class="stat-tile">
          <div class="stat-number">${workoutsThisMonth}</div>
          <div class="stat-label">Entrenos</div>
        </div>
        <div class="stat-tile">
          <div class="stat-number">${maxStreak} <span style="font-size:1rem;font-weight:600">días</span></div>
          <div class="stat-label">Racha máxima</div>
        </div>
        <div class="stat-tile">
          <div class="stat-number">${timeStr}</div>
          <div class="stat-label">Tiempo total</div>
        </div>
        <div class="stat-tile">
          <div class="stat-number">~${totalCalories.toLocaleString('es-AR')}</div>
          <div class="stat-label">kcal est.</div>
        </div>
      </div>
      ${workoutsThisMonth > 0 ? '<p class="text-xs text-muted" style="margin-top:8px;text-align:right">(estimado)</p>' : ''}
    `;
  },

  _calcMaxStreak(log) {
    if (!log.length) return 0;
    const sorted = [...log].sort((a, b) => a.date.localeCompare(b.date));
    let maxStreak     = 1;
    let currentStreak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = parseLocalDateString(sorted[i - 1].date);
      const curr = parseLocalDateString(sorted[i].date);
      prev.setHours(0, 0, 0, 0);
      curr.setHours(0, 0, 0, 0);
      const diff = Math.round((curr - prev) / 86400000);
      if (diff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else if (diff > 1) {
        currentStreak = 1;
      }
      // diff === 0 means duplicate date — skip
    }
    return maxStreak;
  },

  _renderWeightCard(profile) {
    const card = document.getElementById('card-weight');
    if (!card) return;

    const history = Storage.get(KEYS.WEIGHT_HISTORY, []);
    const current = history.length ? history[history.length - 1] : null;
    const start   = history.length ? history[0] : null;
    const target  = profile ? profile.targetWeight : null;

    if (!current) {
      card.innerHTML = `
        <div class="dashboard-card-label">Peso</div>
        <div class="text-muted text-sm" style="padding:12px 0">
          Registrá tu peso en
          <a href="#" id="link-go-perfil" style="color:var(--accent);text-decoration:none">Perfil →</a>
        </div>
      `;
      document.getElementById('link-go-perfil')?.addEventListener('click', (e) => {
        e.preventDefault();
        App.navigateTo('perfil');
      });
      return;
    }

    const diff = start && start !== current
      ? (current.weight - start.weight).toFixed(1)
      : null;

    card.innerHTML = `
      <div class="dashboard-card-label">Peso</div>
      <div class="flex-between">
        <div>
          <div class="dashboard-big-number">${current.weight} <span style="font-size:1rem;font-weight:600">kg</span></div>
          ${diff !== null ? `
            <div class="dashboard-sub ${diff < 0 ? 'trend-down' : diff > 0 ? 'trend-up' : ''}">
              ${diff < 0 ? '▼' : diff > 0 ? '▲' : '—'} ${Math.abs(diff)} kg desde el inicio
            </div>
          ` : ''}
        </div>
        ${target ? `
          <div class="text-right">
            <div class="text-muted text-xs">Objetivo</div>
            <div style="font-size:1.1rem;font-weight:700;color:var(--warning)">${target} kg</div>
            ${current.weight > target ? `<div class="text-xs text-muted">Faltan ${(current.weight - target).toFixed(1)} kg</div>` : '<div class="text-xs text-success">✓ Meta alcanzada</div>'}
          </div>
        ` : ''}
      </div>
    `;
  },

  _renderStreakCard() {
    const card = document.getElementById('card-streak');
    if (!card) return;

    const log = Storage.get(KEYS.TRAINING_LOG, []);
    const streak = this._calcStreak(log);

    card.innerHTML = `
      <div class="dashboard-card-label">Racha de Entrenamiento</div>
      <div class="streak-display">
        <div class="streak-number">${streak}</div>
        <div class="streak-info">
          <h4>${streak === 1 ? 'día' : 'días'} seguidos</h4>
          <p>${streak >= 7 ? '🔥 ¡Racha increíble!' : streak >= 3 ? '💪 ¡Vas muy bien!' : streak >= 1 ? '✅ ¡Seguí así!' : 'Entrenate hoy para empezar'}</p>
        </div>
      </div>
    `;
  },

  _calcStreak(log) {
    if (!log.length) return 0;
    const trained = new Set(log.filter(e => e.completed).map(e => e.date));
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = getLocalDateString(d);
      if (trained.has(dateStr)) {
        streak++;
      } else if (i > 0) {
        break; // Gap found
      }
    }
    return streak;
  },

  _formatDateLong(date) {
    const days   = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    const months = ['enero','febrero','marzo','abril','mayo','junio',
                    'julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const d = date.getDay();
    return `${days[d].charAt(0).toUpperCase() + days[d].slice(1)}, ${date.getDate()} de ${months[date.getMonth()]}`;
  }
};

// ─── App Router ───────────────────────────────────────────────────────────────

const App = {
  currentSection: 'inicio',

  navigateTo(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    // Show target section
    const target = document.getElementById(`section-${section}`);
    if (target) target.classList.remove('hidden');

    // Activate nav tab
    const tab = document.querySelector(`.nav-tab[data-section="${section}"]`);
    if (tab) tab.classList.add('active');

    this.currentSection = section;

    // Scroll to top
    const mc = document.getElementById('main-content');
    if (mc) mc.scrollTop = 0;

    // Trigger section-specific renders
    if (section === 'inicio') Dashboard.render();
    if (section === 'entreno') {
      Workout._renderCalendar();
      Workout._renderRoutine();
    }
    if (section === 'nutricion') {
      Nutrition.renderWeeklyPlan();
      Nutrition.renderDailyTracking();
    }
    if (section === 'despensa') {
      Pantry.render();
      if (typeof Disliked !== 'undefined') Disliked._checkWarning();
    }
    if (section === 'perfil') {
      Profile._renderTDEE();
      Profile._renderWeightHistory();
      Profile._renderWeightChart();
    }
  }
};

// ─── Initialization ───────────────────────────────────────────────────────────

function initApp() {
  // Init all modules
  Profile.init();
  Workout.init();
  Nutrition.init();
  Pantry.init();
  Disliked.init();
  Shopping.init();

  // Bottom nav click handlers
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      App.navigateTo(tab.dataset.section);
    });
  });

  // Profile prompt button
  document.querySelector('#profile-prompt .btn-primary')?.addEventListener('click', () => {
    App.navigateTo('perfil');
  });

  // 2-month reminder dismiss
  document.getElementById('btn-dismiss-reminder')?.addEventListener('click', () => {
    Storage.set('fitapp_reminder_dismissed', true);
    document.getElementById('reminder-banner')?.classList.add('hidden');
  });

  // Apply saved theme before first render
  const savedTheme = Storage.get(KEYS.THEME, 'dark');
  if (savedTheme === 'light') document.body.classList.add('light-mode');

  // Theme toggle button
  const btnTheme = document.getElementById('btn-theme-toggle');
  if (btnTheme) {
    const updateThemeBtn = () => {
      const isLight = document.body.classList.contains('light-mode');
      document.getElementById('theme-icon').textContent  = isLight ? '🌙' : '☀️';
      document.getElementById('theme-label').textContent = isLight ? 'Modo oscuro' : 'Modo claro';
    };
    updateThemeBtn();
    btnTheme.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      Storage.set(KEYS.THEME, document.body.classList.contains('light-mode') ? 'light' : 'dark');
      updateThemeBtn();
    });
  }

  // Check first-time launch
  const profile = Storage.get(KEYS.PROFILE, null);
  if (!profile) {
    // First time — show Perfil with welcome message
    App.navigateTo('perfil');
    const onboardingMsg = document.getElementById('onboarding-msg');
    if (onboardingMsg) onboardingMsg.classList.remove('hidden');
  } else {
    // Normal launch — show Dashboard
    App.navigateTo('inicio');
  }
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
