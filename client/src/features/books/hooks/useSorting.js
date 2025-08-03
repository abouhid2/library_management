import { useState, useMemo } from "react";

const useSorting = (items, defaultSortField = null, defaultSortDirection = "asc") => {
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  const sortedItems = useMemo(() => {
    if (!sortField || !items) return items;

    return [...items].sort((a, b) => {
      let aValue = getNestedValue(a, sortField);
      let bValue = getNestedValue(b, sortField);

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = "";
      if (bValue === null || bValue === undefined) bValue = "";

      // Convert to strings for comparison
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return sortDirection === "desc" ? -comparison : comparison;
    });
  }, [items, sortField, sortDirection]);

  const handleSortChange = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);
  };

  return {
    sortedItems,
    sortField,
    sortDirection,
    handleSortChange,
  };
};

// Helper function to get nested object values (e.g., "book.title")
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

export default useSorting; 