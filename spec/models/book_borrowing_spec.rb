require 'rails_helper'

RSpec.describe Book, type: :model do
  describe 'borrowing functionality' do
    let(:book) { create(:book) }
    let(:member) { create(:user, :member) }

    describe '#can_be_borrowed_by?' do
      it 'returns true when book is available and user is a member' do
        expect(book.can_be_borrowed_by?(member)).to be true
      end

      it 'returns false when book is not available' do
        book.update(available_copies: 0)
        expect(book.can_be_borrowed_by?(member)).to be false
      end

      it 'returns false when user is not a member' do
        librarian = create(:user, :librarian)
        expect(book.can_be_borrowed_by?(librarian)).to be false
      end

      it 'returns false when user has already borrowed the book' do
        member.borrow_book(book)
        expect(book.can_be_borrowed_by?(member)).to be false
      end
    end

    describe '#active_borrowings' do
      let!(:active_borrowing) { create(:borrowing, book: book) }
      let!(:returned_borrowing) { create(:borrowing, book: book, returned_at: Time.current) }

      it 'returns only active borrowings for the book' do
        expect(book.active_borrowings).to include(active_borrowing)
        expect(book.active_borrowings).not_to include(returned_borrowing)
      end
    end

    describe '#borrowed_by?' do
      it 'returns true when user has borrowed the book' do
        member.borrow_book(book)
        expect(book.borrowed_by?(member)).to be true
      end

      it 'returns false when user has not borrowed the book' do
        expect(book.borrowed_by?(member)).to be false
      end

      it 'returns false when user has returned the book' do
        borrowing = member.borrow_book(book)
        borrowing.update(returned_at: Time.current)
        expect(book.borrowed_by?(member)).to be false
      end
    end

    describe '#overdue_borrowings' do
      let!(:overdue_borrowing) { create(:borrowing, book: book, due_at: 1.day.ago) }
      let!(:current_borrowing) { create(:borrowing, book: book) }

      it 'returns only overdue borrowings for the book' do
        expect(book.overdue_borrowings).to include(overdue_borrowing)
        expect(book.overdue_borrowings).not_to include(current_borrowing)
      end
    end

    describe '#borrow_for_user' do
      it 'creates a borrowing and decreases available copies' do
        expect { book.borrow_for_user(member) }.to change(Borrowing, :count).by(1)
        expect(book.reload.available_copies).to eq(4)
      end

      it 'prevents borrowing when book is not available' do
        book.update(available_copies: 0)
        expect { book.borrow_for_user(member) }.to raise_error(StandardError, "Book is not available")
      end

      it 'prevents borrowing when user is not a member' do
        librarian = create(:user, :librarian)
        expect { book.borrow_for_user(librarian) }.to raise_error(StandardError, "Only members can borrow books")
      end

      it 'prevents borrowing the same book twice by the same user' do
        book.borrow_for_user(member)
        expect { book.borrow_for_user(member) }.to raise_error(StandardError, "User has already borrowed this book")
      end
    end
  end
end
