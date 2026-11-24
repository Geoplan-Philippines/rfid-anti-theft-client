const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

export const environment = {
  production: false,
  apiBaseUrl: `http://${host}:8001/api/v1`,
};