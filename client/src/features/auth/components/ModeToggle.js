import React from "react";

const ModeToggle = ({ mode, onModeChange }) => {
  return (
    <div className="flex justify-center">
      <div className="bg-gray-200 rounded-lg p-1">
        <button
          onClick={() => onModeChange("login")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            mode === "login"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => onModeChange("register")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            mode === "register"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default ModeToggle;
