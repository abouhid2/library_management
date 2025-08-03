import React from "react";

const DashboardStats = ({ stats, isLibrarian }) => {
  const {
    total_books: totalBooks = 0,
    total_copies: totalCopies = 0,
    total_borrowed: totalBorrowed = 0,
    books_due_today: booksDueToday = 0,
    overdue_count: overdueCount = 0,
    my_borrowed: myBorrowed = 0,
  } = stats || {};

  const statCards = isLibrarian
    ? [
        {
          title: "Total Books",
          value: `${totalBooks} (${totalCopies})`,
          description: "Books in library (total copies)",
          color: "bg-highlight",
          icon: "📚",
        },
        {
          title: "Currently Borrowed",
          value: totalBorrowed,
          description: "Books checked out",
          color: "bg-highlight",
          icon: "📖",
        },
        {
          title: "Due Today",
          value: booksDueToday,
          description: "Books due today",
          color: "bg-warning",
          icon: "📅",
        },
        {
          title: "Overdue",
          value: overdueCount,
          description: "Overdue books",
          color: "bg-error",
          icon: "⚠️",
        },
      ]
    : [
        {
          title: "Total Books",
          value: totalBooks,
          description: "Books in library",
          color: "bg-highlight",
          icon: "📚",
        },
        {
          title: "My Borrowed Books",
          value: myBorrowed,
          color: "bg-highlight",
          icon: "📖",
        },
        {
          title: "Due Today",
          value: booksDueToday,
          color: "bg-warning",
          icon: "📅",
        },
        {
          title: "My Overdue",
          value: overdueCount,
          color: "bg-error",
          icon: "⚠️",
        },
      ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {card.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{card.description}</p>
            </div>
            <div
              className={`${card.color} rounded-full p-3 text-white text-2xl`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
