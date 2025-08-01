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
