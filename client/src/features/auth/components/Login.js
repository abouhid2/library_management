import React, { useState } from "react";
import ModeToggle from "./ModeToggle";
import AuthForm from "./AuthForm";
import { useAuth } from "../hooks/useAuth";

const Login = ({ onLogin, initialError, onClearError }) => {
  const [mode, setMode] = useState("login"); // "login" or "register"

  const { loading, error, login, register, clearError } = useAuth();

  const handleModeChange = (newMode) => {
    setMode(newMode);
    clearError();
    if (onClearError) {
      onClearError();
    }
  };

  const handleSubmit = async (userData) => {
    try {
      let user;

      if (mode === "login") {
        user = await login(userData.email, userData.password);
      } else {
        user = await register(userData);
      }

      onLogin(user);
    } catch (err) {
      // Error is already handled in the useAuth hook
      console.error("Authentication error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            src="/b2g_logo.png"
            alt="Books 2 Go"
            className="w-24 h-24 mx-auto mb-4 rounded-full"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Books 2 Go
          </h2>
        </div>

        <ModeToggle mode={mode} onModeChange={handleModeChange} />

        <AuthForm
          mode={mode}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          initialError={initialError}
          onClearError={onClearError}
        />
      </div>
    </div>
  );
};

export default Login;
