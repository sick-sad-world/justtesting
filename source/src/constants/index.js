export const BASE_URL = 'https://api.trendolizer.com/v3';

export const MESSAGES = {
  SESSION: {
    EXPIRED: 'SESSION_EXPIRED',
    ESTABLISHED: 'SESSION_ESTABLISHED',
    LOGIN: 'SESSION_LOGIN_REQUEST',
    LOGOUT: 'SESSION_LOGOUT_REQUEST'
  },
  WINDOWS: {
    SUSPEND: 'WINDOWS_SUSPEND',
    WAKEUP: 'WINDOWS_WAKEUP'
  },
  MANAGEMENT: {
    NAVIGATE: 'MANAGEMENT_NAVIGATE'
  },
  DASHBOARD: {
    OPEN: 'DASHBOARD_OPEN',
    CLOSE: 'DASHBOARD_CLOSE',
    UPDATE: 'DASHBOARD_UPDATE',
    REORDER: 'DASHBOARD_RELOAD',
    RELOAD: 'DASHBOARD_RELOAD'
  }
};

export const STORAGE = {
  DASHBOARD: 'TR_DASHBOARDS'
};

export const WINDOWS = {
  auth: 'auth.html',
  nav: 'nav.html',
  management: 'management.html',
  dashboard: 'dashboard.html'
};
