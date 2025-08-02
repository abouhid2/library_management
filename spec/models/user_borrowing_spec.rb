require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'borrowing functionality' do
    let(:member) { create(:user, :member) }
    let(:librarian) { create(:user, :librarian) }
    let(:book) { create(:book) }

    describe '#borrow_book' do
      context 'when user is a member' do
        it 'creates a borrowing record' do
          expect { member.borrow_book(book) }.to change(Borrowing, :count).by(1)
        end

        it 'decreases book available copies' do
          expect { member.borrow_book(book) }.to change { book.reload.available_copies }.by(-1)
        end

        it 'creates borrowing with correct attributes' do
          borrowing = member.borrow_book(book)
          expect(borrowing.user).to eq(member)
          expect(borrowing.book).to eq(book)
          expect(borrowing.borrowed_at).to be_within(1.second).of(Time.current)
          expect(borrowing.due_at).to be_within(1.second).of(Time.current + 2.weeks)
          expect(borrowing.returned_at).to be_nil
        end

        it 'prevents borrowing the same book twice' do
          member.borrow_book(book)
          expect { member.borrow_book(book) }.to raise_error(StandardError, "You have already borrowed this book")
        end

        it 'prevents borrowing when book is not available' do
          book.update(available_copies: 0)
          expect { member.borrow_book(book) }.to raise_error(StandardError, "Book is not available")
        end

        it 'prevents borrowing when user is not a member' do
          expect { librarian.borrow_book(book) }.to raise_error(StandardError, "Only members can borrow books")
        end
      end
    end

    describe '#active_borrowings' do
      let!(:active_borrowing) { create(:borrowing, user: member, book: book) }
      let!(:returned_borrowing) { create(:borrowing, user: member, book: create(:book), returned_at: Time.current) }

      it 'returns only active borrowings for the user' do
        expect(member.active_borrowings).to include(active_borrowing)
        expect(member.active_borrowings).not_to include(returned_borrowing)
      end
    end

    describe '#has_borrowed?' do
      it 'returns true when user has borrowed the book' do
        member.borrow_book(book)
        expect(member.has_borrowed?(book)).to be true
      end

      it 'returns false when user has not borrowed the book' do
        expect(member.has_borrowed?(book)).to be false
      end

      it 'returns false when user has returned the book' do
        borrowing = member.borrow_book(book)
        borrowing.update(returned_at: Time.current)
        expect(member.has_borrowed?(book)).to be false
      end
    end

    describe '#overdue_borrowings' do
      let!(:overdue_borrowing) { create(:borrowing, user: member, book: book, due_at: 1.day.ago) }
      let!(:current_borrowing) { create(:borrowing, user: member, book: create(:book)) }

      it 'returns only overdue borrowings for the user' do
        expect(member.overdue_borrowings).to include(overdue_borrowing)
        expect(member.overdue_borrowings).not_to include(current_borrowing)
      end
    end

    describe '#borrowings.due_today' do
      let!(:due_today_borrowing) { create(:borrowing, user: member, book: book, due_at: Date.current) }
      let!(:due_tomorrow_borrowing) { create(:borrowing, user: member, book: create(:book), due_at: Date.current + 1.day) }
      let!(:returned_due_today_borrowing) { create(:borrowing, user: member, book: create(:book), due_at: Date.current, returned_at: Time.current) }

      it 'returns only borrowings due today for the user' do
        expect(member.borrowings.due_today).to include(due_today_borrowing)
        expect(member.borrowings.due_today).not_to include(due_tomorrow_borrowing)
        expect(member.borrowings.due_today).not_to include(returned_due_today_borrowing)
      end
    end
  end

  describe 'librarian functionality' do
    let(:librarian) { create(:user, :librarian) }
    let(:member) { create(:user, :member) }
    let(:book) { create(:book) }
    let(:borrowing) { create(:borrowing, user: member, book: book) }

    describe '#return_book_for_user' do
      it 'marks the borrowing as returned' do
        expect { librarian.return_book_for_user(borrowing) }.to change { borrowing.reload.returned_at }.from(nil)
      end

      it 'increases book available copies' do
        expect { librarian.return_book_for_user(borrowing) }.to change { book.reload.available_copies }.by(1)
      end

      it 'prevents non-librarians from returning books' do
        expect { member.return_book_for_user(borrowing) }.to raise_error(StandardError, "Only librarians can return books")
      end

      it 'raises error if borrowing is already returned' do
        borrowing.update(returned_at: Time.current)
        expect { librarian.return_book_for_user(borrowing) }.to raise_error(StandardError, "Book already returned")
      end
    end

    describe '#all_active_borrowings' do
      let!(:borrowing1) { create(:borrowing, user: member, book: book) }
      let!(:borrowing2) { create(:borrowing, user: create(:user, :member), book: create(:book)) }
      let!(:returned_borrowing) { create(:borrowing, user: member, book: create(:book), returned_at: Time.current) }

      it 'returns all active borrowings in the system' do
        expect(librarian.all_active_borrowings).to include(borrowing1, borrowing2)
        expect(librarian.all_active_borrowings).not_to include(returned_borrowing)
      end

      it 'prevents non-librarians from accessing all borrowings' do
        expect { member.all_active_borrowings }.to raise_error(StandardError, "Only librarians can access all borrowings")
      end
    end
  end
end
