class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # Associations
  has_many :borrowings, dependent: :destroy
  has_many :borrowed_books, through: :borrowings, source: :book

  # Validations
  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :user_type, presence: true, inclusion: { in: %w[member librarian] }

  # Callbacks
  before_validation :set_default_user_type

  # Scopes
  scope :librarians, -> { where(user_type: "librarian") }
  scope :members, -> { where(user_type: "member") }

  # Methods
  def librarian?
    user_type == "librarian"
  end

  def member?
    user_type == "member"
  end

  # Borrowing methods
  def borrow_book(book)
    unless member?
      raise StandardError, "Only members can borrow books"
    end

    unless book.available?
      raise StandardError, "Book is not available"
    end

    if has_borrowed?(book)
      raise StandardError, "You have already borrowed this book"
    end

    transaction do
      borrowing = borrowings.create!(book: book)
      book.borrow_copy
      borrowing
    end
  end

  def active_borrowings
    borrowings.active
  end

  def has_borrowed?(book)
    borrowings.active.exists?(book: book)
  end

  def overdue_borrowings
    borrowings.overdue
  end

  # Librarian methods
  def return_book_for_user(borrowing)
    unless librarian?
      raise StandardError, "Only librarians can return books"
    end

    borrowing.return!
  end

  def all_active_borrowings
    unless librarian?
      raise StandardError, "Only librarians can access all borrowings"
    end

    Borrowing.active
  end

  private

  def set_default_user_type
    self.user_type ||= "member"
  end
end
