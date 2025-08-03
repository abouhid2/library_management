class Api::BooksController < Api::ApplicationController
  before_action :set_book, only: [ :show, :update, :destroy ]
  before_action :require_librarian, only: [ :create, :update, :destroy ]

  # GET /api/books
  def index
    @books = Book.all

    # Apply general search across all fields
    if params[:search].present?
      search_term = params[:search].downcase
      @books = @books.where(
        "LOWER(title) LIKE ? OR LOWER(author) LIKE ? OR LOWER(genre) LIKE ?",
        "%#{search_term}%", "%#{search_term}%", "%#{search_term}%"
      )
    else
      # Apply specific field search filters
      @books = @books.search_by_title(params[:title]) if params[:title].present?
      @books = @books.search_by_author(params[:author]) if params[:author].present?
      @books = @books.search_by_genre(params[:genre]) if params[:genre].present?
    end

    render json: @books.as_json(methods: [ :image_url, :thumbnail_url ])
  end

  # GET /api/books/:id
  def show
    render json: @book.as_json(methods: [ :image_url, :thumbnail_url ])
  end

  # POST /api/books
  def create
    @book = Book.new(book_params)

    if @book.save
      render json: @book.as_json(methods: [ :image_url, :thumbnail_url ]), status: :created
    else
      render_errors(@book.errors.full_messages)
    end
  end

  # PUT /api/books/:id
  def update
    if @book.update(book_params)
      render json: @book.as_json(methods: [ :image_url, :thumbnail_url ])
    else
      render_errors(@book.errors.full_messages)
    end
  end

  # DELETE /api/books/:id
  def destroy
    # Check if book has active borrowings
    unless @book.can_be_deleted?
      render json: { error: "Cannot delete book: It is currently borrowed" }, status: :unprocessable_entity
      return
    end

    @book.destroy
    head :no_content
  end

  private

  def set_book
    @book = Book.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Book not found" }, status: :not_found
  end

  def book_params
    params.require(:book).permit(:title, :author, :genre, :isbn, :total_copies, :available_copies, :image)
  end
end
