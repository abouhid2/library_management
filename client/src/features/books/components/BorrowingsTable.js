import React from "react";
import ReturnButton from "./ReturnButton";

const BorrowingsTable = ({
  borrowings,
  isLibrarian,
  onReturn,
  isSubmitting,
}) => {
  if (borrowings.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-gray-500">
        No borrowings found.
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysRemaining = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Book
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Borrowed By
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Borrowed Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            {isLibrarian && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {borrowings.map((borrowing) => (
            <tr key={borrowing.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {borrowing.book?.title || "Unknown Book"}
                  </div>
                  <div className="text-sm text-gray-500">
                    by {borrowing.book?.author || "Unknown Author"}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {borrowing.user?.name || "Unknown User"}
                </div>
                <div className="text-xs text-gray-500">
                  {borrowing.user?.email || "No email"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(borrowing.borrowed_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatDate(borrowing.due_at)}
                </div>
                <div className="text-xs text-gray-500">
                  {getDaysRemaining(borrowing.due_at) > 0
                    ? `${getDaysRemaining(borrowing.due_at)} days remaining`
                    : `${Math.abs(
                        getDaysRemaining(borrowing.due_at)
                      )} days overdue`}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    borrowing.returned_at
                      ? "bg-gray-100 text-gray-800"
                      : isOverdue(borrowing.due_at)
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {borrowing.returned_at
                    ? "Returned"
                    : isOverdue(borrowing.due_at)
                    ? "Overdue"
                    : "Active"}
                </span>
              </td>
              {isLibrarian && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {!borrowing.returned_at && (
                    <ReturnButton
                      borrowing={borrowing}
                      onReturn={onReturn}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowingsTable;
