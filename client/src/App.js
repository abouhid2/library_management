import React, { useState, useEffect } from "react";
import Login from "./features/auth/components/Login";
import DashboardLayout from "./components/DashboardLayout";
import { authAPI } from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          const response = await authAPI.me();
          if (response.data.success) {
            setUser(response.data.user);
            setAuthError("");
          } else {
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");
            setAuthError("Session expired. Please log in again.");
          }
        } catch (error) {
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
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <div className="mb-4">
            <img
              src="/b2g_logo.png"
              alt="Books 2 Go"
              className="w-24 h-24 mx-auto mb-4"
            />
          </div>
          <div className="text-lg text-secondary font-medium">
            Loading Books 2 Go...
          </div>
          <div className="mt-2 text-accent text-sm">
            Your library management system
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {user ? (
        <DashboardLayout user={user} onLogout={handleLogout} />
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
