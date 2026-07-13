const runtimeApiUrl =
  (typeof window !== 'undefined' &&
    (window as Window & { __env?: { API_URL?: string } }).__env?.API_URL) ||
  '/api';

export const environment = {
  production: true,
  apiUrl: runtimeApiUrl
};
