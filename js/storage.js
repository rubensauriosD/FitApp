/**
 * Storage — thin localStorage wrapper with JSON serialization.
 * All FitApp data is persisted via this module.
 */
const Storage = {
  get(key, defaultVal = null) {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultVal;
    } catch {
      return defaultVal;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage.set error:', e);
    }
  },

  update(key, updaterFn, defaultVal = null) {
    const current = this.get(key, defaultVal);
    const updated = updaterFn(current);
    this.set(key, updated);
    return updated;
  },

  remove(key) {
    localStorage.removeItem(key);
  }
};

// Storage key constants
const KEYS = {
  PROFILE:         'fitapp_profile',
  WEIGHT_HISTORY:  'fitapp_weight_history',
  PANTRY:          'fitapp_pantry',
  MEAL_PLANS:      'fitapp_meal_plans',
  MEALS_EATEN:     'fitapp_meals_eaten',
  TRAINING_LOG:    'fitapp_training_log',
  ROUNDS:          'fitapp_rounds',
  DISLIKED:        'fitapp_disliked',
  SHOPPING_MANUAL: 'fitapp_shopping_manual',
  REP_LOG:         'fitapp_rep_log',
  MEASUREMENTS:    'fitapp_measurements',
  THEME:           'fitapp_theme'
};
