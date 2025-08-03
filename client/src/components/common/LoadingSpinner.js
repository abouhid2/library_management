import React from "react";

const LoadingSpinner = ({
  message = "Loading...",
  subtitle = "",
  fullScreen = false,
  size = "medium",
}) => {
  const containerClasses = fullScreen
    ? "min-h-screen flex items-center justify-center bg-primary"
    : "flex justify-center items-center py-8";

  const contentClasses = fullScreen ? "text-center" : "text-center";

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        <img
          src="/b2g_logo.png"
          alt="Books2Go Logo"
          className="mx-auto mb-4 w-32 h-32 object-contain"
        />
        <div className="text-lg text-secondary font-medium">{message}</div>
        {subtitle && <div className="mt-2 text-accent text-sm">{subtitle}</div>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
