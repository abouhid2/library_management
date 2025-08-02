class Api::BorrowingsController < Api::ApplicationController
  before_action :set_borrowing, only: [ :show, :return ]
  before_action :require_member_for_create, only: [ :create ]
  before_action :require_librarian_for_return, only: [ :return ]
  before_action :require_librarian_for_overdue, only: [ :overdue ]
  before_action :ensure_own_borrowing, only: [ :show ]

  # GET /api/borrowings
  def index
    @borrowings = current_user.borrowings.includes(:book)
    render json: @borrowings.as_json(include: :book)
  end

  # GET /api/borrowings/:id
  def show
    render json: @borrowing.as_json(include: :book)
  end

  # POST /api/borrowings
  def create
    book_id = params[:book_id]

    unless book_id.present?
      return render_error("Book ID is required")
    end

    book = Book.find_by(id: book_id)
    unless book
      return render json: { error: "Book not found" }, status: :not_found
    end

    begin
      borrowing = current_user.borrow_book(book)
      render json: borrowing.as_json(include: :book), status: :created
    rescue StandardError => e
      render_error(e.message)
    end
  end

  # PATCH /api/borrowings/:id/return
  def return
    begin
      current_user.return_book_for_user(@borrowing)
      render json: @borrowing.reload.as_json(include: :book)
    rescue StandardError => e
      render_error(e.message)
    end
  end

  # GET /api/borrowings/overdue
  def overdue
    @borrowings = Borrowing.overdue.includes(:user, :book)
    render json: @borrowings.as_json(include: [ :user, :book ])
  end

  # GET /api/borrowings/my_overdue
  def my_overdue
    @borrowings = current_user.overdue_borrowings.includes(:book)
    render json: @borrowings.as_json(include: :book)
  end

  private

  def set_borrowing
    @borrowing = Borrowing.find_by(id: params[:id])
    unless @borrowing
      render json: { error: "Borrowing not found" }, status: :not_found
    end
  end

  def require_member_for_create
    unless current_user.member?
      render json: { error: "Only members can borrow books" }, status: :forbidden
    end
  end

  def require_librarian_for_return
    unless current_user.librarian?
      render json: { error: "Only librarians can return books" }, status: :forbidden
    end
  end

  def require_librarian_for_overdue
    unless current_user.librarian?
      render json: { error: "Only librarians can view overdue borrowings" }, status: :forbidden
    end
  end

  def ensure_own_borrowing
    unless @borrowing.user_id == current_user.id || current_user.librarian?
      render json: { error: "Access denied" }, status: :forbidden
    end
  end
end
