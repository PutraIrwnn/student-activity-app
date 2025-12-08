const STORAGE_KEYS = {
  TODOS: 'student_app_todos',
  PREFERENCES: 'student_app_prefs',
  LAST_LOGIN: 'student_app_last_login'
};

export const storageService = {
  getTodos: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TODOS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse todos', e);
      return [];
    }
  },

  saveTodos: (todos) => {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  },

  getPreferences: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : { theme: 'default', pomodoroTime: 25 };
    } catch (e) {
      return { theme: 'default', pomodoroTime: 25 };
    }
  },

  savePreferences: (prefs) => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  },

  getLastLoginDate: () => {
    return localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
  },

  setLastLoginDate: (dateString) => {
    localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, dateString);
  }
};
