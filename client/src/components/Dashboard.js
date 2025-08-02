import React, { useState } from "react";
import Books from "../features/books/components/Books";

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "books":
        return <Books user={user} />;
      case "dashboard":
      default:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h2>
            <p className="text-gray-600 text-lg">
              Welcome to the Library Management System. You are logged in as{" "}
              {user.name} ({user.user_type}).
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900">
                  Quick Actions
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-blue-700">
                  <li>• Browse the book collection</li>
                  {user.user_type === "librarian" && (
                    <>
                      <li>• Add new books to the library</li>
                      <li>• Manage book inventory</li>
                    </>
                  )}
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900">
                  Your Role
                </h3>
                <p className="mt-2 text-sm text-green-700">
                  {user.user_type === "librarian"
                    ? "As a librarian, you can manage the entire book collection including adding, editing, and deleting books."
                    : "As a member, you can browse and search the book collection."}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900">
                  System Info
                </h3>
                <p className="mt-2 text-sm text-purple-700">
                  Library Management System v1.0
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Header/Navigation */}
      <nav className="bg-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-semibold">
                Library Management System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">
                Welcome, {user.name} ({user.user_type})
              </span>
              <button
                onClick={onLogout}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
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

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "dashboard"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("books")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "books"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Books
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </>
  );
};

export default Dashboard;
