import { useState, useMemo } from "react";

const usePagination = (items, itemsPerPage = 9) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  }, [items, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    paginatedItems,
    totalPages,
    handlePageChange,
    resetPagination,
  };
};

export default usePagination;
