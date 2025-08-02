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
    available_copies: 3
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
    available_copies: 4
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    isbn: "978-0141439518",
    total_copies: 3,
    available_copies: 1
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    isbn: "978-0547928241",
    total_copies: 7,
    available_copies: 5
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
    available_copies: 3
  },
  {
    title: "Animal Farm",
    author: "George Orwell",
    genre: "Political Satire",
    isbn: "978-0451526342",
    total_copies: 4,
    available_copies: 2
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Philosophical Fiction",
    isbn: "978-0062315007",
    total_copies: 6,
    available_copies: 4
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    genre: "Dystopian Fiction",
    isbn: "978-0060850524",
    total_copies: 3,
    available_copies: 1
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
