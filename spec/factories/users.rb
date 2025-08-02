FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password123" }
    password_confirmation { "password123" }
    name { "Test User" }
    user_type { "member" }

    trait :librarian do
      user_type { "librarian" }
      sequence(:email) { |n| "librarian#{n}@example.com" }
      name { "Test Librarian" }
    end

    trait :member do
      user_type { "member" }
      sequence(:email) { |n| "member#{n}@example.com" }
      name { "Test Member" }
    end
  end
end
