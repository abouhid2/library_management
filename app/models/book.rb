class Book < ApplicationRecord
  # Validations
  validates :title, presence: true
  validates :author, presence: true
  validates :genre, presence: true
  validates :isbn, presence: true, uniqueness: { case_sensitive: false }
  validates :total_copies, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :available_copies, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validate :isbn_format
  validate :available_copies_cannot_exceed_total

  # Callbacks
  before_validation :set_default_available_copies

  # Scopes
  scope :search_by_title, ->(title) { where('LOWER(title) LIKE ?', "%#{title.downcase}%") }
  scope :search_by_author, ->(author) { where('LOWER(author) LIKE ?', "%#{author.downcase}%") }
  scope :search_by_genre, ->(genre) { where('LOWER(genre) LIKE ?', "%#{genre.downcase}%") }
  scope :available, -> { where('available_copies > 0') }
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
      raise StandardError, 'No copies available'
    end
  end

  def return_copy
    if available_copies < total_copies
      update(available_copies: available_copies + 1)
    else
      raise StandardError, 'Cannot return more copies than total'
    end
  end

  private

  def isbn_format
    return if isbn.blank?
    
    # Basic ISBN validation (supports both ISBN-10 and ISBN-13)
    isbn_clean = isbn.gsub(/[-\s]/, '')
    
    unless isbn_clean.match?(/^(?:\d{10}|\d{13})$/)
      errors.add(:isbn, 'must be a valid ISBN format')
    end
  end

  def available_copies_cannot_exceed_total
    return if available_copies.blank? || total_copies.blank?
    
    if available_copies > total_copies
      errors.add(:available_copies, 'cannot exceed total copies')
    end
  end

  def set_default_available_copies
    if available_copies.nil? && total_copies.present?
      self.available_copies = total_copies
    end
  end
end 