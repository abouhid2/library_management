import React, { useState, useEffect } from "react";
import Header from "./Header";
import NavigationTabs from "./NavigationTabs";
import SearchBar from "./SearchBar";
import MainContent from "./MainContent";

const DashboardLayout = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("books");

  const isLibrarian = user?.user_type === "librarian";

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Header user={user} onLogout={onLogout} />

      <NavigationTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isLibrarian={isLibrarian}
      />

      {activeTab === "books" && (
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
      )}

      <MainContent
        activeTab={activeTab}
        user={user}
        searchQuery={debouncedSearchQuery}
      />
    </>
  );
};

export default DashboardLayout; 