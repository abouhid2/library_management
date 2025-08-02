class Book < ApplicationRecord
  # Associations
  has_many :borrowings, dependent: :destroy
  has_many :borrowers, through: :borrowings, source: :user
  has_one_attached :image

  # Validations
  validates :title, presence: true
  validates :author, presence: true
  validates :genre, presence: true
  validates :isbn, presence: true, uniqueness: { case_sensitive: false }
  validates :total_copies, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :available_copies, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validate :isbn_format
  validate :available_copies_cannot_exceed_total
  validate :acceptable_image

  # Callbacks
  before_validation :set_default_available_copies

  # Scopes
  scope :search_by_title, ->(title) { where("LOWER(title) LIKE ?", "%#{title.downcase}%") }
  scope :search_by_author, ->(author) { where("LOWER(author) LIKE ?", "%#{author.downcase}%") }
  scope :search_by_genre, ->(genre) { where("LOWER(genre) LIKE ?", "%#{genre.downcase}%") }
  scope :available, -> { where("available_copies > 0") }
  scope :out_of_stock, -> { where(available_copies: 0) }

  # Methods
  def borrowed_copies
    total_copies - available_copies
  end

  def available?
    available_copies > 0
  end

  def borrow_copy
    if available_copies > 0
      update(available_copies: available_copies - 1)
    else
      raise StandardError, "No copies available"
    end
  end

  def return_copy
    if available_copies < total_copies
      update(available_copies: available_copies + 1)
    else
      raise StandardError, "Cannot return more copies than total"
    end
  end

  # Image methods
  def image_url
    return nil unless image.attached?
    host = Rails.application.config.action_mailer.default_url_options[:host] || "localhost"
    port = Rails.application.config.action_mailer.default_url_options[:port] || 3001
    Rails.application.routes.url_helpers.rails_blob_url(image, only_path: false, host: "#{host}:#{port}")
  end

  def thumbnail_url
    return nil unless image.attached?
    host = Rails.application.config.action_mailer.default_url_options[:host] || "localhost"
    port = Rails.application.config.action_mailer.default_url_options[:port] || 3001
    Rails.application.routes.url_helpers.rails_blob_url(image.variant(resize_to_limit: [ 200, 200 ]), only_path: false, host: "#{host}:#{port}")
  end

  # Borrowing methods
  def can_be_borrowed_by?(user)
    return false unless user.member?
    return false unless available?
    return false if borrowed_by?(user)
    true
  end

  def active_borrowings
    borrowings.active
  end

  def borrowed_by?(user)
    borrowings.active.exists?(user: user)
  end

  def overdue_borrowings
    borrowings.overdue
  end

  def can_be_deleted?
    !borrowings.active.exists?
  end

  def borrow_for_user(user)
    unless user.member?
      raise StandardError, "Only members can borrow books"
    end

    unless available?
      raise StandardError, "Book is not available"
    end

    if borrowed_by?(user)
      raise StandardError, "User has already borrowed this book"
    end

    transaction do
      borrowing = borrowings.create!(user: user)
      borrow_copy
      borrowing
    end
  end

  private

  def isbn_format
    return if isbn.blank?

    # Basic ISBN validation (supports both ISBN-10 and ISBN-13)
    isbn_clean = isbn.gsub(/[-\s]/, "")

    unless isbn_clean.match?(/^(?:\d{10}|\d{13})$/)
      errors.add(:isbn, "must be a valid ISBN format")
    end
  end

  def available_copies_cannot_exceed_total
    return if available_copies.blank? || total_copies.blank?

    if available_copies > total_copies
      errors.add(:available_copies, "cannot exceed total copies")
    end
  end

  def acceptable_image
    return unless image.attached?

    unless image.blob.byte_size <= 5.megabyte
      errors.add(:image, "is too big (should be less than 5MB)")
    end

    acceptable_types = [ "image/jpeg", "image/png", "image/gif", "image/webp" ]
    unless acceptable_types.include?(image.blob.content_type)
      errors.add(:image, "must be a JPEG, PNG, GIF, or WebP")
    end
  end

  def set_default_available_copies
    if available_copies.nil? && total_copies.present?
      self.available_copies = total_copies
    end
  end
end
