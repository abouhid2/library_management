import React from "react";

const Header = ({ user, onLogout }) => {
  return (
    <nav className="bg-secondary shadow-brand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <img
                src="/b2g_logo.png"
                alt="Books 2 Go"
                className="w-8 h-8 rounded-full"
              />
              <h1 className="text-primary text-xl font-semibold">Books 2 Go</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onLogout}
              className="bg-highlight hover:bg-accent text-secondary px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
