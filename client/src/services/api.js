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

  create: (bookData) => {
    // Check if there's an image file to upload
    if (bookData.image && bookData.image instanceof File) {
      const formData = new FormData();

      // Add all book data to form data
      Object.keys(bookData).forEach((key) => {
        if (key === "image") {
          formData.append("book[image]", bookData.image);
        } else {
          formData.append(`book[${key}]`, bookData[key]);
        }
      });

      // Create a new axios instance for multipart/form-data
      const multipartApi = axios.create({
        baseURL: API_BASE_URL,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Add auth token to multipart requests
      const token = localStorage.getItem("authToken");
      if (token) {
        multipartApi.defaults.headers.Authorization = `Bearer ${token}`;
      }

      return multipartApi.post("/books", formData);
    } else {
      // Regular JSON request for books without images
      return api.post("/books", { book: bookData });
    }
  },

  update: (id, bookData) => {
    // Check if there's an image file to upload
    if (bookData.image && bookData.image instanceof File) {
      const formData = new FormData();

      // Add all book data to form data
      Object.keys(bookData).forEach((key) => {
        if (key === "image") {
          formData.append("book[image]", bookData.image);
        } else {
          formData.append(`book[${key}]`, bookData[key]);
        }
      });

      // Create a new axios instance for multipart/form-data
      const multipartApi = axios.create({
        baseURL: API_BASE_URL,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Add auth token to multipart requests
      const token = localStorage.getItem("authToken");
      if (token) {
        multipartApi.defaults.headers.Authorization = `Bearer ${token}`;
      }

      return multipartApi.put(`/books/${id}`, formData);
    } else {
      // Remove the image property if it's not a File to avoid sending it
      const { image, ...bookDataWithoutImage } = bookData;
      return api.put(`/books/${id}`, { book: bookDataWithoutImage });
    }
  },

  delete: (id) => api.delete(`/books/${id}`),
};

export const borrowingsAPI = {
  getAll: () => api.get("/borrowings"),

  getById: (id) => api.get(`/borrowings/${id}`),

  borrowBook: (bookId) => api.post("/borrowings", { book_id: bookId }),

  returnBook: (borrowingId) => api.patch(`/borrowings/${borrowingId}/return`),

  getOverdue: () => api.get("/borrowings/overdue"),

  getMyOverdue: () => api.get("/borrowings/my_overdue"),
};

export const dashboardAPI = {
  getLibrarianStats: () => api.get("/dashboard/librarian"),
  getMemberStats: () => api.get("/dashboard/member"),
};

export default api;
