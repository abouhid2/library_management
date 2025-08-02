import React from "react";

const NavigationTabs = ({ activeTab, onTabChange, isLibrarian }) => {
  return (
    <div className="bg-surface border-b border-neutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => onTabChange("books")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "books"
                ? "border-highlight text-secondary"
                : "border-transparent text-neutral hover:text-secondary hover:border-accent"
            }`}
          >
            Books
          </button>
          <button
            onClick={() => onTabChange("borrowings")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "borrowings"
                ? "border-highlight text-secondary"
                : "border-transparent text-neutral hover:text-secondary hover:border-accent"
            }`}
          >
            Dashboard
          </button>
        </nav>
      </div>
    </div>
  );
};

export default NavigationTabs;
