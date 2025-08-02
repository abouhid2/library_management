FactoryBot.define do
  factory :borrowing do
    association :user, factory: [ :user, :member ]
    association :book
    borrowed_at { Time.current }
    due_at { borrowed_at + 2.weeks }
    returned_at { nil }

    trait :returned do
      returned_at { Time.current }
    end

    trait :overdue do
      due_at { 1.day.ago }
    end

    trait :due_soon do
      due_at { 2.days.from_now }
    end
  end
end
