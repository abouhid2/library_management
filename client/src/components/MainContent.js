import React from "react";
import Books from "../features/books/components/Books";
import { Dashboard } from "../features/books/components/dashboard";

const MainContent = ({ activeTab, user, searchQuery }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {activeTab === "books" ? (
        <Books user={user} searchQuery={searchQuery} />
      ) : (
        <Dashboard user={user} />
      )}
    </div>
  );
};

export default MainContent;
