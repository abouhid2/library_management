import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),

  register: (userData) => api.post("/auth/register", { user: userData }),

  logout: () => api.post("/auth/logout"),

  me: () => api.get("/auth/me"),
};

export const booksAPI = {
  getAll: (params = {}) => api.get("/books", { params }),

  getById: (id) => api.get(`/books/${id}`),

  create: (bookData) => api.post("/books", { book: bookData }),

  update: (id, bookData) => api.put(`/books/${id}`, { book: bookData }),

  delete: (id) => api.delete(`/books/${id}`),
};

export default api;
