FactoryBot.define do
  factory :book do
    sequence(:title) { |n| "Book Title #{n}" }
    sequence(:author) { |n| "Author #{n}" }
    genre { "Fiction" }
    sequence(:isbn) { |n| "978000000000#{n % 10}" }
    total_copies { 5 }
    available_copies { 5 }
    image { "https://via.placeholder.com/300x400/4a90e2/ffffff?text=#{CGI.escape("Book Title")}" }

    trait :fiction do
      genre { "Fiction" }
      image { "https://via.placeholder.com/300x400/4a90e2/ffffff?text=Fiction" }
    end

    trait :non_fiction do
      genre { "Non-Fiction" }
      image { "https://via.placeholder.com/300x400/7ed321/ffffff?text=Non-Fiction" }
    end

    trait :mystery do
      genre { "Mystery" }
      image { "https://via.placeholder.com/300x400/9013fe/ffffff?text=Mystery" }
    end

    trait :science_fiction do
      genre { "Science Fiction" }
      image { "https://via.placeholder.com/300x400/f5a623/ffffff?text=Science+Fiction" }
    end

    trait :out_of_stock do
      available_copies { 0 }
    end

    trait :limited_copies do
      total_copies { 2 }
      available_copies { 1 }
    end

    trait :with_image do
      image { "https://via.placeholder.com/300x400/4a90e2/ffffff?text=With+Image" }
    end

    trait :without_image do
      image { nil }
    end
  end
end
