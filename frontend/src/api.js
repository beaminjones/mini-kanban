const API_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchApi(path, options = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const d = err.detail;
    const msg = Array.isArray(d) ? d[0]?.msg : d;
    throw new Error(msg || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  boards: {
    list: () => fetchApi('/boards'),
    get: (id) => fetchApi(`/boards/${id}`),
    create: (name) => fetchApi('/boards', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  },
  columns: {
    create: (boardId, name) => fetchApi(`/boards/${boardId}/columns`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  },
  cards: {
    create: (columnId, { title, description }) => fetchApi(`/columns/${columnId}/cards`, {
      method: 'POST',
      body: JSON.stringify({ title, description: description || null }),
    }),
    update: (cardId, { title, description }) => fetchApi(`/cards/${cardId}`, {
      method: 'PUT',
      body: JSON.stringify({ title, description: description ?? undefined }),
    }),
    delete: (cardId) => fetchApi(`/cards/${cardId}`, { method: 'DELETE' }),
    move: (cardId, newColumnId) => fetchApi(`/cards/${cardId}/move`, {
      method: 'PATCH',
      body: JSON.stringify({ newColumnId }),
    }),
  },
};
