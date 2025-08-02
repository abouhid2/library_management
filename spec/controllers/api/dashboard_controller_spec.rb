require 'rails_helper'

RSpec.describe Api::DashboardController, type: :controller do
  before(:each) do
    Borrowing.delete_all
    Book.delete_all
    User.delete_all
  end
  let(:librarian) { create(:user, :librarian) }
  let(:member) { create(:user, :member) }
  let(:other_member) { create(:user, :member) }
  let(:book) { create(:book, total_copies: 5, available_copies: 3) }
  let(:book2) { create(:book, total_copies: 3, available_copies: 1) }

  describe 'GET #librarian' do
    context 'when user is a librarian' do
      before do
        request.headers.merge!(auth_headers_for(librarian))
      end

      it 'returns a successful response' do
        get :librarian
        expect(response).to be_successful
      end

      it 'returns correct statistics' do
        # Create some borrowings
        create(:borrowing, book: book, user: member, due_at: Date.current)
        create(:borrowing, book: book2, user: other_member, due_at: 1.day.ago, returned_at: nil) # overdue
        create(:borrowing, book: book, user: other_member, due_at: Date.current + 1.day) # not due today

        get :librarian
        response_body = JSON.parse(response.body)

        # Account for existing seed data
        existing_overdue_count = Borrowing.overdue.count - 1 # Subtract the one we just created
        existing_total_books = Book.count - 2 # Subtract the two we just created
        existing_total_borrowed = (Book.sum(:total_copies) - Book.sum(:available_copies)) - 4 # Subtract the 4 we just created

        expect(response_body['total_books']).to eq(existing_total_books + 2)
        expect(response_body['total_borrowed']).to eq(existing_total_borrowed + 4) # 2 books borrowed (5-3 + 3-1)
        expect(response_body['books_due_today']).to eq(1)
        expect(response_body['overdue_count']).to eq(existing_overdue_count + 1)
        expect(response_body['overdue_borrowings']).to be_an(Array)
        expect(response_body['overdue_borrowings'].size).to eq(existing_overdue_count + 1)
      end

      it 'returns zero counts when no data exists' do
        get :librarian
        response_body = JSON.parse(response.body)

        expect(response_body['total_books']).to eq(0)
        expect(response_body['total_borrowed']).to eq(0)
        expect(response_body['books_due_today']).to eq(0)
        expect(response_body['overdue_count']).to eq(0)
        expect(response_body['overdue_borrowings']).to eq([])
      end
    end

    context 'when user is not a librarian' do
      before do
        request.headers.merge!(auth_headers_for(member))
      end

      it 'returns forbidden status' do
        get :librarian
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'GET #member' do
    context 'when user is a member' do
      before do
        request.headers.merge!(auth_headers_for(member))
      end

      it 'returns a successful response' do
        get :member
        expect(response).to be_successful
      end

      it 'returns correct member statistics' do
        # Create borrowings for this member
        borrowing1 = create(:borrowing, book: book, user: member, due_at: Date.current)
        borrowing2 = create(:borrowing, book: book2, user: member, due_at: 1.day.ago, returned_at: nil) # overdue
        borrowing3 = create(:borrowing, book: book, user: member, due_at: Date.current + 1.day) # not due today
        create(:borrowing, book: book, user: member, returned_at: Time.current) # returned

        # Create borrowings for other members (should not affect this member's stats)
        create(:borrowing, book: book, user: other_member)

        get :member
        response_body = JSON.parse(response.body)

        # Account for existing seed data
        existing_total_books = Book.count - 2 # Subtract the two we just created

        expect(response_body['total_books']).to eq(existing_total_books + 2)
        expect(response_body['my_borrowed']).to eq(3) # 3 active borrowings
        expect(response_body['my_overdue']).to eq(2)
        expect(response_body['books_due_today']).to eq(1)
        expect(response_body['overdue_count']).to eq(2)
        expect(response_body['my_borrowings']).to be_an(Array)
        expect(response_body['my_borrowings'].size).to eq(3)
        expect(response_body['my_overdue_borrowings']).to be_an(Array)
        expect(response_body['my_overdue_borrowings'].size).to eq(2)
      end

      it 'returns zero counts when member has no borrowings' do
        get :member
        response_body = JSON.parse(response.body)

        expect(response_body['total_books']).to eq(0)
        expect(response_body['my_borrowed']).to eq(0)
        expect(response_body['my_overdue']).to eq(0)
        expect(response_body['books_due_today']).to eq(0)
        expect(response_body['overdue_count']).to eq(0)
        expect(response_body['my_borrowings']).to eq([])
        expect(response_body['my_overdue_borrowings']).to eq([])
      end
    end

    context 'when user is a librarian' do
      before do
        request.headers.merge!(auth_headers_for(librarian))
      end

      it 'returns forbidden status' do
        get :member
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
