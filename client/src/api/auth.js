const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const defaultApiUrl = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';

export const API_BASE_URL = (configuredApiUrl || defaultApiUrl).replace(/\/+$/, '');

export async function submitAuthRequest(endpoint, payload) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(`Unable to reach the authentication server. Check the API URL and deployment settings. ${error.message}`);
  }

  const contentType = response.headers.get('content-type') || '';
  const result = contentType.includes('application/json') ? await response.json() : null;
  if (!response.ok) {
    throw new Error(result?.message || 'Unable to complete your request. Check that the API URL points to the deployed backend.');
  }
  if (!result) {
    throw new Error('The authentication server returned an unexpected response. Check the API URL and backend deployment.');
  }

  return result;
}