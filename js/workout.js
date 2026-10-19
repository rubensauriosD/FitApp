/**
 * workout.js — Workout display, training calendar, and interactive timer.
 */

const Workout = {
  // ── Timer state ────────────────────────────────────────────────────────────
  _sequence: [],
  _currentStep: 0,
  _isRunning: false,
  _isPaused: false,
  _stepStartTime: 0,
  _stepElapsedBeforePause: 0,
  _timerInterval: null,
  _workoutStartTime: 0,
  _selectedDayType: null,
  _activeWorkoutDayType: null,
  _activeWorkoutDate: null,
  _allowRestDayWorkout: false,

  // ── Initialization ──────────────────────────────────────────────────────────
  init() {
    this._selectedDayType = this._getDefaultSelectableDayType();
    const dayTypeSelect = document.getElementById('day-type-select');
    if (dayTypeSelect) dayTypeSelect.value = this._selectedDayType;
    this._renderRoutine();
    this._renderCalendar();
    this._setupEvents();
  },

  // ── Return today's day type (A / B / rest) ────────────────────────────────
  getTodayDayType() {
    const profile = Storage.get(KEYS.PROFILE, null);
    const startDate = profile?.startDate || getLocalDateString();
    const today = getLocalDateString();
    return getWorkoutDayType(today, startDate);
  },

  // ── Return a trainable default for the selector (A / B) ───────────────────
  _getDefaultSelectableDayType() {
    const scheduledType = this.getTodayDayType();
    if (scheduledType !== 'rest') return scheduledType;

    const profile = Storage.get(KEYS.PROFILE, null);
    const startDate = profile?.startDate || getLocalDateString();
    const previousDay = new Date();
    for (let daysBack = 1; daysBack <= 7; daysBack++) {
      previousDay.setDate(previousDay.getDate() - 1);
      const previousType = getWorkoutDayType(getLocalDateString(previousDay), startDate);
      if (previousType !== 'rest') return previousType;
    }
    return 'A';
  },

  // ── Render routine summary and day-type badge ──────────────────────────────
  _renderRoutine() {
    const container = document.getElementById('workout-routine-detail');
    if (!container) return;

    const scheduledType = this.getTodayDayType();
    const dayType = this._selectedDayType || this._getDefaultSelectableDayType();
    const isResting = scheduledType === 'rest' && !this._allowRestDayWorkout;

    // Update day-type badge
    const badgeContainer = document.getElementById('day-type-badge-container');
    if (badgeContainer) {
      if (isResting) {
        badgeContainer.innerHTML = '<div class="day-type-badge day-type-rest">😴 Día de Descanso</div>';
      } else if (dayType === 'A') {
        badgeContainer.innerHTML = '<div class="day-type-badge day-type-A">💪 Día A — Fuerza</div>';
      } else if (dayType === 'B') {
        badgeContainer.innerHTML = '<div class="day-type-badge day-type-B">🥊 Día B — Cardio y Boxeo</div>';
      }
    }

    // Update start button and rest-day message
    const startBtn = document.getElementById('btn-start-workout');
    const restMsg  = document.getElementById('rest-day-msg');
    if (isResting) {
      startBtn?.classList.add('hidden');
      if (restMsg) {
        const profile = Storage.get(KEYS.PROFILE, null);
        const startDate = profile?.startDate || getLocalDateString();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowType = getWorkoutDayType(getLocalDateString(tomorrow), startDate);
        const tomorrowName = tomorrowType === 'A'
          ? 'Día A — Fuerza'
          : tomorrowType === 'B'
          ? 'Día B — Cardio y Boxeo'
          : 'Día de Descanso';
        restMsg.innerHTML = `
          <p class="text-muted text-sm" style="margin-bottom:10px">😴 Hoy es día de descanso. Mañana: <strong>${tomorrowName}</strong></p>
          <button class="btn-secondary btn-small" id="btn-train-anyway">Entrenar de todas formas</button>
          <p class="text-muted" style="font-size:0.75rem;margin-top:6px">Ocasionalmente está bien, pero respetá el descanso si tenés dolor muscular.</p>
        `;
        restMsg.classList.remove('hidden');
        document.getElementById('btn-train-anyway')?.addEventListener('click', () => {
          this._allowRestDayWorkout = true;
          this._renderRoutine();
        });
      }
      container.innerHTML = '';
      return;
    } else {
      startBtn?.classList.remove('hidden');
      restMsg?.classList.add('hidden');
    }

    // Update routine subtitle inside the header card
    const routineDesc = document.querySelector('#workout-routine-view .routine-header p.text-muted');
    if (routineDesc) {
      routineDesc.textContent = dayType === 'B'
        ? 'Boxeo · Cardio intervals · Core'
        : 'Piernas · Tren superior · Core';
    }

    // Progression suggestion badge
    const profile = Storage.get(KEYS.PROFILE, null);
    const suggested = getSuggestedRounds(profile?.startDate);
    const saved = parseInt(Storage.get(KEYS.ROUNDS, 2));
    const suggestionEl = document.getElementById('rounds-suggestion');
    if (suggestionEl) {
      if (suggested !== saved) {
        const startDateVal = profile?.startDate;
        const startDateObj = startDateVal ? new Date(startDateVal) : null;
        const isValidDate  = startDateObj && !isNaN(startDateObj.getTime());
        const week = isValidDate
          ? Math.max(1, Math.floor((new Date() - startDateObj) / 86400000 / 7) + 1)
          : 1;
        suggestionEl.innerHTML = `
          <div class="rounds-badge">
            💡 Semana ${week} — recomendado: ${suggested} rondas
            <button class="btn-apply-rounds" id="btn-apply-rounds">Aplicar</button>
          </div>
        `;
        document.getElementById('btn-apply-rounds')?.addEventListener('click', () => {
          const sel = document.getElementById('rounds-select');
          if (sel) {
            sel.value = String(suggested);
            Storage.set(KEYS.ROUNDS, suggested);
          }
          suggestionEl.innerHTML = '';
          this._renderRoutine();
        });
      } else {
        suggestionEl.innerHTML = '';
      }
    }

    // Render section list
    const rounds = parseInt(Storage.get(KEYS.ROUNDS, 2));
    const summary = dayType === 'B' ? getWorkoutSummaryB(rounds) : WORKOUT_SUMMARY_A;
    container.innerHTML = summary.map(sec => `
      <div class="card routine-section">
        <div class="routine-section-header">
          <h4>${sec.section}</h4>
          <span class="duration-badge">${sec.duration}</span>
        </div>
        ${sec.note ? `<p class="routine-note">${sec.note}</p>` : ''}
        <ul class="routine-exercise-list">
          ${sec.exercises.map(ex => `<li>${ex}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  },

  // ── Render last-90-days training calendar ─────────────────────────────────
  _renderCalendar() {
    const container = document.getElementById('training-calendar');
    if (!container) return;

    const log = Storage.get(KEYS.TRAINING_LOG, []);
    const trainedDates = new Set(log.map(e => e.date));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = '<div class="training-calendar">';
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = getLocalDateString(d);
      const isToday = i === 0;
      const isTrained = trainedDates.has(dateStr);
      const isTrainingDay = this.isTrainingDay(d);

      let cls = 'cal-day';
      if (isTrained)          cls += ' trained';
      else if (!isTrainingDay) cls += ' rest-day';
      else                    cls += ' future';
      if (isToday)            cls += ' today';

      const day = d.getDate();
      html += `<div class="${cls}" title="${dateStr}">${day}</div>`;
    }
    html += '</div>';
    container.innerHTML = html;
  },

  // ── Determine if a date is a training day (A/B/rest 7-day cycle) ────────────
  isTrainingDay(date) {
    const profile = Storage.get(KEYS.PROFILE, null);
    const startDate = profile?.startDate || getLocalDateString();
    const dateStr = getLocalDateString(new Date(date));
    return getWorkoutDayType(dateStr, startDate) !== 'rest';
  },

  // ── Setup section event listeners ─────────────────────────────────────────
  _setupEvents() {
    const startBtn = document.getElementById('btn-start-workout');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startWorkout());
    }

    const roundsSel = document.getElementById('rounds-select');
    if (roundsSel) {
      roundsSel.value = Storage.get(KEYS.ROUNDS, 2);
      roundsSel.addEventListener('change', (e) => {
        Storage.set(KEYS.ROUNDS, parseInt(e.target.value));
        this._renderRoutine();
      });
    }

    const dayTypeSelect = document.getElementById('day-type-select');
    if (dayTypeSelect) {
      dayTypeSelect.value = this._selectedDayType || this._getDefaultSelectableDayType();
      dayTypeSelect.addEventListener('change', (e) => {
        this._selectedDayType = e.target.value;
        this._renderRoutine();
      });
    }

    // Timer controls
    document.getElementById('btn-pause-play')?.addEventListener('click', () => this._togglePause());
    document.getElementById('btn-skip')?.addEventListener('click', () => this._nextStep());
    document.getElementById('btn-prev')?.addEventListener('click', () => this._prevStep());
    document.getElementById('btn-rep-done')?.addEventListener('click', () => this._nextStep());
    document.getElementById('btn-exit-timer')?.addEventListener('click', () => this._exitTimer());
    document.getElementById('btn-register-workout')?.addEventListener('click', () => this._registerWorkout());
    document.getElementById('btn-dismiss-complete')?.addEventListener('click', () => this._dismissComplete());
  },

  // ── Start the workout timer ────────────────────────────────────────────────
  startWorkout(autoStart = true) {
    const dayType = this._selectedDayType || this._getDefaultSelectableDayType();
    const rounds  = parseInt(Storage.get(KEYS.ROUNDS, 2));
    this._activeWorkoutDayType = dayType;
    this._activeWorkoutDate = getLocalDateString();
    this._sequence = dayType === 'B' ? getDayBSequence(rounds) : getDayASequence(rounds);
    this._currentStep = 0;
    this._isRunning = false;
    this._isPaused = false;
    this._workoutStartTime = Date.now();

    document.getElementById('timer-overlay')?.classList.remove('hidden');
    document.getElementById('timer-complete')?.classList.add('hidden');

    this._renderTimerStep();
    if (autoStart) this._resumeTimer();
  },

  // ── Render the current step in the timer UI ───────────────────────────────
  _renderTimerStep() {
    const step = this._sequence[this._currentStep];
    if (!step) return;

    const total = this._sequence.length;
    const progress = (this._currentStep / total) * 100;

    // Progress bar
    const fill = document.getElementById('timer-progress-fill');
    if (fill) fill.style.width = `${progress}%`;

    // Step label
    const stepLabel = document.getElementById('timer-step-label');
    if (stepLabel) stepLabel.textContent = `Paso ${this._currentStep + 1} de ${total}`;

    // Section label
    const secLabel = document.getElementById('timer-section-label');
    if (secLabel) {
      secLabel.textContent = step.section || '';
      secLabel.style.color = step.type === 'rest' ? 'var(--warning)' : '';
    }

    // Exercise name
    const nameEl = document.getElementById('timer-exercise-name');
    if (nameEl) {
      nameEl.textContent = step.type === 'rest' ? 'DESCANSA' : step.name;
      nameEl.style.color = step.type === 'rest' ? 'var(--warning)' : '';
    }

    // Description
    let descEl = document.getElementById('timer-desc');
    if (!descEl) {
      descEl = document.createElement('p');
      descEl.id = 'timer-desc';
      descEl.className = 'timer-desc';
      const clock = document.getElementById('timer-clock');
      if (clock) clock.parentNode.insertBefore(descEl, clock.nextSibling);
    }
    descEl.textContent = step.description || '';

    // Tip
    let tipEl = document.getElementById('timer-tip');
    if (!tipEl) {
      tipEl = document.createElement('p');
      tipEl.id = 'timer-tip';
      tipEl.className = 'timer-tip';
      descEl.parentNode.insertBefore(tipEl, descEl.nextSibling);
    }
    tipEl.textContent = step.tip || '';
    tipEl.style.display = step.tip ? '' : 'none';

    // Show/hide clock vs reps
    const clockEl = document.getElementById('timer-clock');
    const repContainer = document.getElementById('timer-rep-container');

    if (step.type === 'reps') {
      clockEl?.classList.add('hidden');
      repContainer?.classList.remove('hidden');
      const repsEl = document.getElementById('timer-reps');
      if (repsEl) {
        repsEl.textContent = step.repsPerSide
          ? `${step.reps} reps × lado`
          : `${step.reps} reps`;
      }
      // Clear the rep-actual input for each new exercise
      const repInput = document.getElementById('rep-actual-input');
      if (repInput) repInput.value = '';
    } else {
      clockEl?.classList.remove('hidden');
      repContainer?.classList.add('hidden');
      if (clockEl) {
        const remaining = step.duration * 1000;
        clockEl.textContent = this._formatTime(remaining);
        clockEl.className = 'timer-clock';
        if (step.type === 'rest') clockEl.classList.add('warning');
      }
    }

    // Next step preview
    const nextEl = document.getElementById('timer-next');
    if (nextEl) {
      const next = this._sequence[this._currentStep + 1];
      if (next) {
        const nextName = next.type === 'rest' ? 'Descanso' : next.name;
        const nextDetail = next.type === 'timed'
          ? `${next.duration}s`
          : next.type === 'reps'
          ? `${next.reps} reps${next.repsPerSide ? ' × lado' : ''}`
          : '1 min';
        nextEl.textContent = `Próximo: ${nextName} — ${nextDetail}`;
      } else {
        nextEl.textContent = '¡Último paso!';
      }
    }

    // Reset pause state display
    this._stepElapsedBeforePause = 0;
    this._updatePauseButton();
  },

  // ── Start/resume the countdown ────────────────────────────────────────────
  _resumeTimer() {
    const step = this._sequence[this._currentStep];
    if (!step) return;

    this._isRunning = true;
    this._isPaused = false;
    this._stepStartTime = Date.now();
    this._updatePauseButton();

    if (step.type === 'reps') return; // Reps wait for button press

    this._clearInterval();
    this._timerInterval = setInterval(() => {
      if (!this._isRunning || this._isPaused) return;

      const elapsed = this._stepElapsedBeforePause + (Date.now() - this._stepStartTime);
      const remaining = step.duration * 1000 - elapsed;

      if (remaining <= 0) {
        this._clearInterval();
        this._nextStep();
        return;
      }

      const clockEl = document.getElementById('timer-clock');
      if (clockEl) {
        clockEl.textContent = this._formatTime(remaining);
        // Color logic
        const secs = remaining / 1000;
        clockEl.className = 'timer-clock';
        if (step.type === 'rest') {
          clockEl.classList.add('warning');
        } else if (secs <= 3) {
          clockEl.classList.add('danger');
        } else if (secs <= 10) {
          clockEl.classList.add('warning');
        }
      }
    }, 100);
  },

  // ── Toggle pause/resume ───────────────────────────────────────────────────
  _togglePause() {
    if (!this._isRunning) return;

    if (this._isPaused) {
      // Resume
      this._stepStartTime = Date.now();
      this._isPaused = false;
      const step = this._sequence[this._currentStep];
      if (step && step.type !== 'reps') {
        this._resumeTimer();
      }
    } else {
      // Pause
      this._stepElapsedBeforePause += Date.now() - this._stepStartTime;
      this._isPaused = true;
      this._clearInterval();
    }

    this._updatePauseButton();
  },

  // ── Advance to next step ──────────────────────────────────────────────────
  _nextStep() {
    this._captureRepLog();
    this._clearInterval();
    if (this._currentStep < this._sequence.length - 1) {
      this._currentStep++;
      this._renderTimerStep();
      this._resumeTimer();
    } else {
      this._completeWorkout();
    }
  },

  // ── Capture actual reps if the current step is a reps exercise ────────────
  _captureRepLog() {
    const step = this._sequence[this._currentStep];
    if (!step || step.type !== 'reps') return;

    const input = document.getElementById('rep-actual-input');
    if (!input || !input.value.trim()) return;

    const actualReps = parseInt(input.value, 10);
    if (isNaN(actualReps) || actualReps < 0) return;

    const today   = this._activeWorkoutDate || getLocalDateString();
    const dayType = this._activeWorkoutDayType || this._selectedDayType || this.getTodayDayType();

    Storage.update(KEYS.REP_LOG, (log) => {
      return [...(Array.isArray(log) ? log : []), {
        date:         today,
        exerciseName: step.name,
        targetReps:   step.reps,
        actualReps,
        round:        step.round || 1,
        dayType
      }];
    }, []);
  },

  // ── Go back to previous step ──────────────────────────────────────────────
  _prevStep() {
    this._clearInterval();
    if (this._currentStep > 0) {
      this._currentStep--;
      this._stepElapsedBeforePause = 0;
      this._renderTimerStep();
      this._resumeTimer();
    }
  },

  // ── Complete workout ──────────────────────────────────────────────────────
  _completeWorkout() {
    this._isRunning = false;
    this._clearInterval();

    const elapsed = Math.floor((Date.now() - this._workoutStartTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const totalExercises = this._sequence.filter(s => s.type !== 'rest').length;

    const statsEl = document.getElementById('complete-stats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="flex-between mb-8">
          <span class="text-muted">Tiempo total</span>
          <strong>${mins}m ${secs}s</strong>
        </div>
        <div class="flex-between mb-8">
          <span class="text-muted">Ejercicios completados</span>
          <strong>${totalExercises}</strong>
        </div>
        <div class="flex-between">
          <span class="text-muted">Circuitos</span>
          <strong>3</strong>
        </div>
      `;
    }

    document.getElementById('timer-overlay')?.classList.add('hidden');
    document.getElementById('timer-complete')?.classList.remove('hidden');
  },

  // ── Register workout in log ───────────────────────────────────────────────
  _registerWorkout() {
    const today          = this._activeWorkoutDate || getLocalDateString();
    const dayType        = this._activeWorkoutDayType || this._selectedDayType || this.getTodayDayType();
    const duration       = dayType === 'B' ? 50 : 55; // minutes
    const caloriesBurned = dayType === 'B' ? 420 : 380;

    Storage.update(KEYS.TRAINING_LOG, (log) => {
      const arr      = Array.isArray(log) ? log : [];
      const filtered = arr.filter(e => e.date !== today);
      return [...filtered, { date: today, dayType, duration, caloriesBurned, completed: true }];
    }, []);

    this._dismissComplete();
    this._renderCalendar();
    this._activeWorkoutDate = null;
    this._activeWorkoutDayType = null;
    if (typeof Dashboard !== 'undefined') Dashboard.render();
  },

  // ── Exit timer overlay ────────────────────────────────────────────────────
  _exitTimer() {
    this._isRunning = false;
    this._clearInterval();
    document.getElementById('timer-overlay')?.classList.add('hidden');
  },

  // ── Dismiss completion screen ─────────────────────────────────────────────
  _dismissComplete() {
    document.getElementById('timer-complete')?.classList.add('hidden');
  },

  // ── Helpers ───────────────────────────────────────────────────────────────
  _clearInterval() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
  },

  _updatePauseButton() {
    const btn = document.getElementById('btn-pause-play');
    if (!btn) return;
    btn.textContent = this._isPaused ? '▶ Continuar' : '⏸ Pausar';
  },

  _formatTime(ms) {
    const totalSecs = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
};
