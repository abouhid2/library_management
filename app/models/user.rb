class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # Validations
  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :user_type, presence: true, inclusion: { in: %w[member librarian] }

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
end
