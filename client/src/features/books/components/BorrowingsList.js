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
