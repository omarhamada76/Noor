/** API root, e.g. https://your-api.onrender.com/api or /api in local dev */
export const getApiBaseUrl = () => {
  const backend = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  return backend ? `${backend}/api` : '/api';
};

export const apiUrl = (path = '') => {
  const base = getApiBaseUrl();
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
};
