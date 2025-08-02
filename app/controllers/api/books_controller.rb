class Api::BooksController < Api::ApplicationController
  before_action :set_book, only: [:show, :update, :destroy]
  before_action :require_librarian, only: [:create, :update, :destroy]

  # GET /api/books
  def index
    @books = Book.all

    # Apply search filters
    @books = @books.search_by_title(params[:title]) if params[:title].present?
    @books = @books.search_by_author(params[:author]) if params[:author].present?
    @books = @books.search_by_genre(params[:genre]) if params[:genre].present?

    render json: @books
  end

  # GET /api/books/:id
  def show
    render json: @book
  end

  # POST /api/books
  def create
    @book = Book.new(book_params)

    if @book.save
      render json: @book, status: :created
    else
      render_errors(@book.errors.full_messages)
    end
  end

  # PUT /api/books/:id
  def update
    if @book.update(book_params)
      render json: @book
    else
      render_errors(@book.errors.full_messages)
    end
  end

  # DELETE /api/books/:id
  def destroy
    @book.destroy
    head :no_content
  end

  private

  def set_book
    @book = Book.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Book not found' }, status: :not_found
  end

  def book_params
    params.require(:book).permit(:title, :author, :genre, :isbn, :total_copies, :available_copies)
  end
end 