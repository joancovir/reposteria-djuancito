const runtimeApiUrl =
  (typeof window !== 'undefined' &&
    (window as Window & { __env?: { API_URL?: string } }).__env?.API_URL) ||
  'http://localhost:8080/api';

export const environment = {
  production: false,
  apiUrl: runtimeApiUrl
};
