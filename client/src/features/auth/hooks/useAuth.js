import { useState } from "react";
import { authAPI } from "../../../services/api";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(email, password);

      if (response.data.success) {
        // Store user data and JWT token in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("authToken", response.data.token);
        return response.data.user;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.register(userData);

      if (response.data.success) {
        // Store user data and JWT token in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("authToken", response.data.token);
        return response.data.user;
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMessage = err.response.data.errors.join(", ");
        setError(errorMessage);
      } else {
        const errorMessage =
          err.response?.data?.message || "Registration failed";
        setError(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError("");
  };

  return {
    loading,
    error,
    login,
    register,
    clearError,
    setError,
  };
};
