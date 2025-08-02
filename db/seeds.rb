# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Create demo users
puts "Creating demo users..."

# Create Librarian user
librarian = User.find_or_create_by!(email: 'librarian@library.com') do |user|
  user.name = 'John Librarian'
  user.user_type = 'librarian'
  user.password = 'password123'
  user.password_confirmation = 'password123'
end

# Create Member user
member = User.find_or_create_by!(email: 'member@library.com') do |user|
  user.name = 'Jane Member'
  user.user_type = 'member'
  user.password = 'password123'
  user.password_confirmation = 'password123'
end

# Create additional member users
(1..3).each do |i|
  User.find_or_create_by!(email: "member#{i}@library.com") do |user|
    user.name = "Member User #{i}"
    user.user_type = 'member'
    user.password = 'password123'
    user.password_confirmation = 'password123'
  end
end

puts "Demo users created successfully!"
puts "Librarian: librarian@library.com / password123"
puts "Member: member@library.com / password123"

# Create demo books
puts "Creating demo books..."

books_data = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic Fiction",
    isbn: "978-0743273565",
    total_copies: 5,
    available_copies: 2
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic Fiction",
    isbn: "978-0446310789",
    total_copies: 4,
    available_copies: 2
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian Fiction",
    isbn: "978-0451524935",
    total_copies: 6,
    available_copies: 5
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    isbn: "978-0141439518",
    total_copies: 3,
    available_copies: 2
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    isbn: "978-0547928241",
    total_copies: 7,
    available_copies: 6
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Coming-of-age",
    isbn: "978-0316769488",
    total_copies: 4,
    available_copies: 0
  },
  {
    title: "Lord of the Flies",
    author: "William Golding",
    genre: "Allegory",
    isbn: "978-0399501487",
    total_copies: 5,
    available_copies: 5
  },
  {
    title: "Animal Farm",
    author: "George Orwell",
    genre: "Political Satire",
    isbn: "978-0451526342",
    total_copies: 4,
    available_copies: 3
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Philosophical Fiction",
    isbn: "978-0062315007",
    total_copies: 6,
    available_copies: 6
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    genre: "Dystopian Fiction",
    isbn: "978-0060850524",
    total_copies: 3,
    available_copies: 0
  }
]

books_data.each do |book_attrs|
  Book.find_or_create_by!(isbn: book_attrs[:isbn]) do |book|
    book.title = book_attrs[:title]
    book.author = book_attrs[:author]
    book.genre = book_attrs[:genre]
    book.total_copies = book_attrs[:total_copies]
    book.available_copies = book_attrs[:available_copies]
  end
end

puts "Demo books created successfully!"
puts "Created #{books_data.length} sample books for testing."

# Create demo borrowings
puts "Creating demo borrowings..."

# Get all users and books for creating borrowings
all_users = User.all
all_books = Book.all

# Create some borrowings to test the functionality
borrowings_data = [
  # Multiple users borrowing the same book (The Great Gatsby)
  {
    user: User.find_by(email: 'member@library.com'),
    book: Book.find_by(title: 'The Great Gatsby'),
    borrowed_at: 1.week.ago,
    due_at: 1.week.from_now
  },
  {
    user: User.find_by(email: 'member1@library.com'),
    book: Book.find_by(title: 'The Great Gatsby'),
    borrowed_at: 3.days.ago,
    due_at: 11.days.from_now
  },
  {
    user: User.find_by(email: 'member2@library.com'),
    book: Book.find_by(title: 'The Great Gatsby'),
    borrowed_at: 1.day.ago,
    due_at: 13.days.from_now
  },

  # Multiple users borrowing another book (To Kill a Mockingbird)
  {
    user: User.find_by(email: 'member@library.com'),
    book: Book.find_by(title: 'To Kill a Mockingbird'),
    borrowed_at: 2.weeks.ago,
    due_at: Date.today # This will be overdue
  },
  {
    user: User.find_by(email: 'member3@library.com'),
    book: Book.find_by(title: 'To Kill a Mockingbird'),
    borrowed_at: 5.days.ago,
    due_at: 9.days.from_now
  },

  # Single borrowings for other books
  {
    user: User.find_by(email: 'member1@library.com'),
    book: Book.find_by(title: '1984'),
    borrowed_at: 1.week.ago,
    due_at: 1.week.from_now
  },

  # Fully borrowed book (The Catcher in the Rye - all 4 copies)
  {
    user: User.find_by(email: 'member@library.com'),
    book: Book.find_by(title: 'The Catcher in the Rye'),
    borrowed_at: 2.weeks.ago,
    due_at: 1.week.from_now
  },
  {
    user: User.find_by(email: 'member1@library.com'),
    book: Book.find_by(title: 'The Catcher in the Rye'),
    borrowed_at: 1.week.ago,
    due_at: 2.weeks.from_now
  },
  {
    user: User.find_by(email: 'member2@library.com'),
    book: Book.find_by(title: 'The Catcher in the Rye'),
    borrowed_at: 5.days.ago,
    due_at: 9.days.from_now
  },
  {
    user: User.find_by(email: 'member3@library.com'),
    book: Book.find_by(title: 'The Catcher in the Rye'),
    borrowed_at: 2.days.ago,
    due_at: 12.days.from_now
  },
  {
    user: User.find_by(email: 'member2@library.com'),
    book: Book.find_by(title: 'Pride and Prejudice'),
    borrowed_at: 2.days.ago,
    due_at: 12.days.from_now
  },
  {
    user: User.find_by(email: 'member3@library.com'),
    book: Book.find_by(title: 'The Hobbit'),
    borrowed_at: 3.days.ago,
    due_at: 11.days.from_now
  },

  # Some overdue borrowings
  {
    user: User.find_by(email: 'member@library.com'),
    book: Book.find_by(title: 'Animal Farm'),
    borrowed_at: 3.weeks.ago,
    due_at: 1.week.ago # Overdue
  },

  # Fully borrowed book (Brave New World - all 3 copies)
  {
    user: User.find_by(email: 'member1@library.com'),
    book: Book.find_by(title: 'Brave New World'),
    borrowed_at: 2.weeks.ago,
    due_at: 3.days.ago # Overdue
  },
  {
    user: User.find_by(email: 'member2@library.com'),
    book: Book.find_by(title: 'Brave New World'),
    borrowed_at: 1.week.ago,
    due_at: 1.week.from_now
  },
  {
    user: User.find_by(email: 'member3@library.com'),
    book: Book.find_by(title: 'Brave New World'),
    borrowed_at: 3.days.ago,
    due_at: 11.days.from_now
  }
]

borrowings_data.each do |borrowing_attrs|
  user = borrowing_attrs[:user]
  book = borrowing_attrs[:book]

  next unless user && book

  # Create the borrowing
  Borrowing.find_or_create_by!(
    user: user,
    book: book,
    returned_at: nil
  ) do |b|
    b.borrowed_at = borrowing_attrs[:borrowed_at]
    b.due_at = borrowing_attrs[:due_at]
  end
end

puts "Demo borrowings created successfully!"
puts "Created borrowings for testing multiple users borrowing the same book."
puts "Some books now have multiple borrowers for testing the dropdown functionality."

# Print summary of what was created
puts "\n=== SEEDING SUMMARY ==="
puts "Users created: #{User.count}"
puts "Books created: #{Book.count}"
puts "Active borrowings created: #{Borrowing.where(returned_at: nil).count}"
puts "Overdue borrowings: #{Borrowing.overdue.count}"

puts "\n=== TESTING SCENARIOS ==="
puts "1. 'The Great Gatsby' has 3 borrowers - test the +2 more dropdown"
puts "2. 'To Kill a Mockingbird' has 2 borrowers - test the +1 more dropdown"
puts "3. 'The Catcher in the Rye' is fully borrowed (4/4) - test +3 more dropdown"
puts "4. 'Brave New World' is fully borrowed (3/3) - test +2 more dropdown"
puts "5. Some books have overdue borrowings - test red highlighting"
puts "6. Some books have single borrowers - test basic display"
puts "7. Some books are not borrowed - test 'Not borrowed' display"
puts "8. Fully borrowed books show 0/4 available - test availability display"

puts "\n=== LOGIN CREDENTIALS ==="
puts "Librarian: librarian@library.com / password123"
puts "Member: member@library.com / password123"
puts "Additional members: member1@library.com, member2@library.com, member3@library.com / password123"
