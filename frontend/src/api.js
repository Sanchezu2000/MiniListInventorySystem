// src/api.js
const BASE_URL = import.meta.env.VITE_API_URL;

async function http(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} – ${text}`);
  }

  return res.status === 204 ? null : res.json();
}

export const api = {
  // 🔑 Inventory (MiniController)
  getAllItems: async () => {
    return await http("/api/mini");
  },

  getItemById: async (id) => {
    return await http(`/api/mini/${id}`);
  },

  createItem: async (data) => {
    return await http("/api/mini", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateItem: async (id, data) => {
    return await http(`/api/mini/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteItem: async (id) => {
    return await http(`/api/mini/${id}`, {
      method: "DELETE",
    });
  },
};
