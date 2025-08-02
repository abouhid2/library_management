class Borrowing < ApplicationRecord
  belongs_to :user
  belongs_to :book

  # Validations
  validates :user, presence: true
  validates :book, presence: true

  # Callbacks
  before_validation :set_default_times, on: :create

  # Scopes
  scope :active, -> { where(returned_at: nil) }
  scope :returned, -> { where.not(returned_at: nil) }
  scope :overdue, -> { active.where("due_at < ?", Time.current) }
  scope :due_today, -> { active.where("DATE(due_at) = ?", Date.current) }

  # Methods
  def active?
    returned_at.nil?
  end

  def overdue?
    active? && due_at < Time.current
  end

  def return!
    if returned_at.present?
      raise StandardError, "Book already returned"
    end

    transaction do
      update!(returned_at: Time.current)
      book.increment!(:available_copies)
    end
  end

  private

  def set_default_times
    self.borrowed_at ||= Time.current
    self.due_at ||= borrowed_at + 2.weeks
  end
end
