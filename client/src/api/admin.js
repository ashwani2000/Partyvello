import { API_BASE_URL } from './auth';

export async function adminRequest(path, options = {}) {
  const token = localStorage.getItem('partypops-token');
  const headers = new Headers(options.headers);
  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/admin${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch (error) {
    throw new Error(`Unable to reach the admin API. Check that the backend is running. ${error.message}`);
  }

  const contentType = response.headers.get('content-type') || '';
  const result = contentType.includes('application/json') ? await response.json() : null;
  if (!response.ok) {
    throw new Error(result?.message || `Admin request failed (${response.status}).`);
  }

  return result;
}
