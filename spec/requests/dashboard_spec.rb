require 'rails_helper'

RSpec.describe 'Dashboard API', type: :request do
  before(:each) do
    Borrowing.delete_all
    Book.delete_all
    User.delete_all
  end
  let(:librarian) { create(:user, :librarian) }
  let(:member) { create(:user, :member) }
  let(:book) { create(:book, total_copies: 5, available_copies: 3) }
  let(:book2) { create(:book, total_copies: 3, available_copies: 1) }

  describe 'GET /api/dashboard/librarian' do
    context 'when authenticated as librarian' do
      before do
        @auth_headers = auth_headers_for(librarian)
      end

      it 'returns librarian dashboard statistics' do
        # Create test data
        create(:borrowing, book: book, user: member, due_at: Date.current)
        create(:borrowing, book: book2, user: create(:user, :member), due_at: 1.day.ago, returned_at: nil)
        create(:borrowing, book: book, user: create(:user, :member), due_at: Date.current + 1.day)

        get '/api/dashboard/librarian', headers: @auth_headers

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['total_books']).to eq(2)
        expect(json_response['total_borrowed']).to eq(4)
        expect(json_response['books_due_today']).to eq(1)
        expect(json_response['overdue_count']).to eq(2)
        expect(json_response['overdue_borrowings']).to be_an(Array)
        expect(json_response['overdue_borrowings'].size).to eq(2)
      end

      it 'returns zero counts when no data exists' do
        get '/api/dashboard/librarian', headers: @auth_headers

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['total_books']).to eq(0)
        expect(json_response['total_borrowed']).to eq(0)
        expect(json_response['books_due_today']).to eq(0)
        expect(json_response['overdue_count']).to eq(0)
        expect(json_response['overdue_borrowings']).to eq([])
      end

      it 'includes book and user information in overdue borrowings' do
        overdue_borrowing = create(:borrowing, book: book, user: member, due_at: 1.day.ago, returned_at: nil)

        get '/api/dashboard/librarian', headers: @auth_headers

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        overdue_borrowings = json_response['overdue_borrowings']
        
        expect(overdue_borrowings.size).to eq(1)
        expect(overdue_borrowings.first['id']).to eq(overdue_borrowing.id)
        expect(overdue_borrowings.first['book']).to include('id', 'title', 'author')
        expect(overdue_borrowings.first['user']).to include('id', 'name', 'email')
      end
    end

    context 'when authenticated as member' do
      before do
        @auth_headers = auth_headers_for(member)
      end

      it 'returns forbidden status' do
        get '/api/dashboard/librarian', headers: @auth_headers
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized status' do
        get '/api/dashboard/librarian'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/dashboard/member' do
    context 'when authenticated as member' do
      before do
        @auth_headers = auth_headers_for(member)
      end

      it 'returns member dashboard statistics' do
        # Create borrowings for this member
        create(:borrowing, book: book, user: member, due_at: Date.current)
        create(:borrowing, book: book2, user: member, due_at: 1.day.ago, returned_at: nil)
        create(:borrowing, book: book, user: member, due_at: Date.current + 1.day)
        create(:borrowing, book: book, user: member, returned_at: Time.current)

        # Create borrowings for other members
        create(:borrowing, book: book, user: create(:user, :member))

        get '/api/dashboard/member', headers: @auth_headers

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['total_books']).to eq(2)
        expect(json_response['my_borrowed']).to eq(3)
        expect(json_response['my_overdue']).to eq(2)
        expect(json_response['books_due_today']).to eq(1)
        expect(json_response['overdue_count']).to eq(2)
        expect(json_response['my_borrowings']).to be_an(Array)
        expect(json_response['my_borrowings'].size).to eq(3)
        expect(json_response['my_overdue_borrowings']).to be_an(Array)
        expect(json_response['my_overdue_borrowings'].size).to eq(2)
      end

      it 'returns zero counts when member has no borrowings' do
        get '/api/dashboard/member', headers: @auth_headers

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['total_books']).to eq(0)
        expect(json_response['my_borrowed']).to eq(0)
        expect(json_response['my_overdue']).to eq(0)
        expect(json_response['books_due_today']).to eq(0)
        expect(json_response['overdue_count']).to eq(0)
        expect(json_response['my_borrowings']).to eq([])
        expect(json_response['my_overdue_borrowings']).to eq([])
      end

      it 'includes book information in member borrowings' do
        borrowing = create(:borrowing, book: book, user: member)

        get '/api/dashboard/member', headers: @auth_headers

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        my_borrowings = json_response['my_borrowings']
        
        expect(my_borrowings.size).to eq(1)
        expect(my_borrowings.first['id']).to eq(borrowing.id)
        expect(my_borrowings.first['book']).to include('id', 'title', 'author', 'genre', 'isbn')
      end
    end

    context 'when authenticated as librarian' do
      before do
        @auth_headers = auth_headers_for(librarian)
      end

      it 'returns forbidden status' do
        get '/api/dashboard/member', headers: @auth_headers
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized status' do
        get '/api/dashboard/member'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/dashboard/stats' do
    context 'when authenticated as librarian' do
      before do
        @auth_headers = auth_headers_for(librarian)
      end

      it 'returns librarian stats' do
        get '/api/dashboard/stats', headers: @auth_headers

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response).to include('total_books', 'total_borrowed', 'books_due_today', 'overdue_count')
        expect(json_response).not_to include('my_borrowed', 'my_overdue')
      end
    end

    context 'when authenticated as member' do
      before do
        @auth_headers = auth_headers_for(member)
      end

      it 'returns member stats' do
        get '/api/dashboard/stats', headers: @auth_headers

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response).to include('total_books', 'my_borrowed', 'my_overdue', 'books_due_today', 'overdue_count')
        expect(json_response).not_to include('total_borrowed')
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized status' do
        get '/api/dashboard/stats'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'Dashboard data accuracy' do
    before do
      @librarian_headers = auth_headers_for(librarian)
      @member_headers = auth_headers_for(member)
    end

    it 'correctly calculates books due today' do
      # Create borrowings with different due dates
      create(:borrowing, book: book, user: member, due_at: Date.current)
      create(:borrowing, book: book2, user: member, due_at: Date.current)
      create(:borrowing, book: book, user: member, due_at: Date.current + 1.day)
      create(:borrowing, book: book, user: member, due_at: Date.current - 1.day)

      get '/api/dashboard/member', headers: @member_headers

      json_response = JSON.parse(response.body)
      expect(json_response['books_due_today']).to eq(2)
    end

    it 'correctly calculates overdue books' do
      # Create overdue borrowings
      create(:borrowing, book: book, user: member, due_at: 1.day.ago, returned_at: nil)
      create(:borrowing, book: book2, user: member, due_at: 2.days.ago, returned_at: nil)
      create(:borrowing, book: book, user: member, due_at: Date.current + 1.day) # Not overdue

      get '/api/dashboard/member', headers: @member_headers

      json_response = JSON.parse(response.body)
      expect(json_response['overdue_count']).to eq(2)
    end

    it 'excludes returned books from calculations' do
      # Create borrowings including returned ones
      create(:borrowing, book: book, user: member, due_at: Date.current)
      create(:borrowing, book: book2, user: member, due_at: 1.day.ago, returned_at: Time.current)

      get '/api/dashboard/member', headers: @member_headers

      json_response = JSON.parse(response.body)
      expect(json_response['my_borrowed']).to eq(1)
      expect(json_response['overdue_count']).to eq(1)
    end
  end
end 