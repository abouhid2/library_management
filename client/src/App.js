import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { authAPI } from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    // Check if user is already logged in with valid token
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          // Validate token with backend
          const response = await authAPI.me();
          if (response.data.success) {
            setUser(response.data.user);
            setAuthError("");
          } else {
            // Token invalid, clear storage
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");
            setAuthError("Session expired. Please log in again.");
          }
        } catch (error) {
          // Token expired or invalid, clear storage
          localStorage.removeItem("user");
          localStorage.removeItem("authToken");
          setAuthError("Session expired. Please log in again.");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthError("");
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear local storage and update state
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      setUser(null);
      setAuthError("");
    }
  };

  const clearAuthError = () => {
    setAuthError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login
          onLogin={handleLogin}
          initialError={authError}
          onClearError={clearAuthError}
        />
      )}
    </div>
  );
}

export default App;
