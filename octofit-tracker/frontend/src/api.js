const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

export async function readCollectionResponse(response) {
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`API request failed (${response.status})${details ? `: ${details}` : ''}`);
  }

  const payload = await response.json();
  const records = findRecords(payload);
  if (!records) {
    throw new Error('API returned an unsupported collection response');
  }

  return records;
}

function findRecords(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== 'object') {
    return null;
  }

  for (const key of ['results', 'items', 'records', 'docs', 'data']) {
    if (key in payload) {
      const records = findRecords(payload[key]);
      if (records) {
        return records;
      }
    }
  }

  return null;
}

export function formatReference(value) {
  if (value && typeof value === 'object') {
    return value.displayName || value.username || value.name || value._id || '—';
  }

  return value || '—';
}
