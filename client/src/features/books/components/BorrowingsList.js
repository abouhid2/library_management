import React from "react";
import BorrowingsTable from "./BorrowingsTable";

const BorrowingsList = ({
  borrowings,
  isLibrarian,
  onReturn,
  isSubmitting,
  showOverdue,
  overdueCount,
  activeBorrowingsCount,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {showOverdue
            ? `Overdue Borrowings (${overdueCount})`
            : `${isLibrarian ? "All" : "My"} Active Borrowings (${activeBorrowingsCount})`}
        </h3>
      </div>
      <BorrowingsTable
        borrowings={borrowings}
        isLibrarian={isLibrarian}
        onReturn={onReturn}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default BorrowingsList; 