import React from "react";

const BorrowingsSummary = ({ activeBorrowingsCount, overdueCount }) => {
  if (activeBorrowingsCount === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
      <h4 className="text-sm font-medium text-blue-900 mb-2">
        Borrowing Summary
      </h4>
      <div className="text-sm text-blue-700">
        <p>You have {activeBorrowingsCount} active borrowing(s).</p>
        {overdueCount > 0 && (
          <p className="text-red-700 font-medium mt-1">
            ⚠️ {overdueCount} of your borrowings are overdue. Please return
            them soon.
          </p>
        )}
      </div>
    </div>
  );
};

export default BorrowingsSummary; 