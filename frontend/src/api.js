// src/api.js
const BASE_URL = "http://localhost:5143"; // ✅ adjust if backend port changes

async function http(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // ✅ attach JWT if available
      ...(options.headers || {}),
    },
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
    return await http("/api/Mini");
  },

  getItemById: async (id) => {
    return await http(`/api/Mini/${id}`);
  },

  createItem: async (data) => {
    return await http("/api/Mini", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateItem: async (id, data) => {
    return await http(`/api/Mini/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteItem: async (id) => {
    return await http(`/api/Mini/${id}`, {
      method: "DELETE",
    });
  },

  // 🔑 Auth
  login: async (userName, password) => {
    const data = await http("/api/Auth/login", {
      method: "POST",
      body: JSON.stringify({
        UserName: userName, // matches backend property
        Password: password, // matches backend property
      }),
    });

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
    }

    return data;
  },

  register: async ({ UserName,email, Password }) => {
    const data = await http("/api/User/register", {
      method: "POST",
      body: JSON.stringify({
               // must match backend DTO
        UserName: UserName,
        Email :email,
        PasswordHash: Password,
      }),
    });

    return data; // may return user object or success message
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },
};