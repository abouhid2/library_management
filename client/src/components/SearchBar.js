import React from "react";

const SearchBar = ({
  searchQuery,
  onSearchChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="bg-surface border-b border-neutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-md">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-neutral"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-testid="search-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              id="search"
              name="search"
              className="block w-full pl-10 pr-3 py-2 border border-neutral rounded-md leading-5 bg-white placeholder-neutral focus:outline-none focus:placeholder-secondary focus:ring-1 focus:ring-highlight focus:border-highlight sm:text-sm"
              placeholder={placeholder}
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
