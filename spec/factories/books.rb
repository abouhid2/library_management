FactoryBot.define do
  factory :book do
    sequence(:title) { |n| "Book Title #{n}" }
    sequence(:author) { |n| "Author #{n}" }
    genre { "Fiction" }
    sequence(:isbn) { |n| "978000000000#{n % 10}" }
    total_copies { 5 }
    available_copies { 5 }

    trait :fiction do
      genre { "Fiction" }
    end

    trait :non_fiction do
      genre { "Non-Fiction" }
    end

    trait :mystery do
      genre { "Mystery" }
    end

    trait :science_fiction do
      genre { "Science Fiction" }
    end

    trait :out_of_stock do
      available_copies { 0 }
    end

    trait :limited_copies do
      total_copies { 2 }
      available_copies { 1 }
    end
  end
end
