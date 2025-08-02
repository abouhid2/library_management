require 'rails_helper'

RSpec.describe Borrowing, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:book) }
  end

  describe 'validations' do
    it { should validate_presence_of(:user) }
    it { should validate_presence_of(:book) }
  end

  describe 'factory' do
    it 'has a valid factory' do
      borrowing = build(:borrowing)
      expect(borrowing).to be_valid
    end

    it 'sets borrowed_at to current time' do
      borrowing = create(:borrowing)
      expect(borrowing.borrowed_at).to be_within(1.second).of(Time.current)
    end

    it 'sets due_at to 2 weeks from borrowed_at' do
      borrowing = create(:borrowing)
      expect(borrowing.due_at).to be_within(1.second).of(borrowing.borrowed_at + 2.weeks)
    end
  end

  describe 'scopes' do
    let!(:active_borrowing) { create(:borrowing, returned_at: nil) }
    let!(:returned_borrowing) { create(:borrowing, returned_at: Time.current) }
    let!(:overdue_borrowing) { create(:borrowing, due_at: 1.day.ago, returned_at: nil) }

    describe '.active' do
      it 'returns only unreturned borrowings' do
        expect(Borrowing.active).to include(active_borrowing)
        expect(Borrowing.active).not_to include(returned_borrowing)
      end
    end

    describe '.returned' do
      it 'returns only returned borrowings' do
        expect(Borrowing.returned).to include(returned_borrowing)
        expect(Borrowing.returned).not_to include(active_borrowing)
      end
    end

    describe '.overdue' do
      it 'returns only overdue borrowings' do
        expect(Borrowing.overdue).to include(overdue_borrowing)
        expect(Borrowing.overdue).not_to include(active_borrowing)
        expect(Borrowing.overdue).not_to include(returned_borrowing)
      end
    end

    describe '.due_today' do
      let!(:due_today_borrowing) { create(:borrowing, due_at: Date.current, returned_at: nil) }
      let!(:due_tomorrow_borrowing) { create(:borrowing, due_at: Date.current + 1.day, returned_at: nil) }
      let!(:due_yesterday_borrowing) { create(:borrowing, due_at: Date.current - 1.day, returned_at: nil) }
      let!(:returned_due_today_borrowing) { create(:borrowing, due_at: Date.current, returned_at: Time.current) }

      it 'returns only borrowings due today that are not returned' do
        expect(Borrowing.due_today).to include(due_today_borrowing)
        expect(Borrowing.due_today).not_to include(due_tomorrow_borrowing)
        expect(Borrowing.due_today).not_to include(due_yesterday_borrowing)
        expect(Borrowing.due_today).not_to include(returned_due_today_borrowing)
      end
    end
  end

  describe 'instance methods' do
    let(:borrowing) { create(:borrowing) }

    describe '#active?' do
      it 'returns true when not returned' do
        expect(borrowing.active?).to be true
      end

      it 'returns false when returned' do
        borrowing.update(returned_at: Time.current)
        expect(borrowing.active?).to be false
      end
    end

    describe '#overdue?' do
      it 'returns false when not due yet' do
        expect(borrowing.overdue?).to be false
      end

      it 'returns true when overdue and not returned' do
        borrowing.update(due_at: 1.day.ago)
        expect(borrowing.overdue?).to be true
      end

      it 'returns false when overdue but returned' do
        borrowing.update(due_at: 1.day.ago, returned_at: Time.current)
        expect(borrowing.overdue?).to be false
      end
    end

    describe '#return!' do
      it 'marks the borrowing as returned' do
        expect { borrowing.return! }.to change { borrowing.reload.returned_at }.from(nil)
      end

      it 'increases the book available copies' do
        book = borrowing.book
        expect { borrowing.return! }.to change { book.reload.available_copies }.by(1)
      end

      it 'raises error if already returned' do
        borrowing.update(returned_at: Time.current)
        expect { borrowing.return! }.to raise_error(StandardError, "Book already returned")
      end
    end
  end
end
