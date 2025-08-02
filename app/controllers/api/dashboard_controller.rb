class Api::DashboardController < Api::ApplicationController
  before_action :require_librarian, only: [:librarian]
  before_action :require_member, only: [:member]

  # GET /api/dashboard/librarian
  def librarian
    stats = {
      total_books: Book.count,
      total_borrowed: Book.sum(:total_copies) - Book.sum(:available_copies),
      books_due_today: Borrowing.due_today.count,
      overdue_count: Borrowing.overdue.count,
      overdue_borrowings: Borrowing.overdue.includes(:user, :book).as_json(include: [:user, :book])
    }
    
    render json: stats
  end

  # GET /api/dashboard/member
  def member
    stats = {
      total_books: Book.count,
      my_borrowed: current_user.borrowings.active.count,
      my_overdue: current_user.overdue_borrowings.count,
      books_due_today: current_user.borrowings.due_today.count,
      overdue_count: current_user.overdue_borrowings.count,
      my_borrowings: current_user.borrowings.active.includes(:book).as_json(include: :book),
      my_overdue_borrowings: current_user.overdue_borrowings.includes(:book).as_json(include: :book)
    }
    
    render json: stats
  end

  # GET /api/dashboard/stats
  def stats
    if current_user.librarian?
      librarian
    else
      member
    end
  end
end 