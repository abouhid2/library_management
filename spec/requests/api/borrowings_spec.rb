require 'rails_helper'

RSpec.describe 'Api::Borrowings', type: :request do
  let(:librarian) { create(:user, :librarian) }
  let(:member) { create(:user, :member) }
  let(:book) { create(:book) }
  let(:borrowing) { create(:borrowing, user: member, book: book) }

  describe 'GET /api/borrowings' do
    context 'when authenticated as member' do
      before do
        get '/api/borrowings', headers: auth_headers_for(member)
      end

      it 'returns http success' do
        expect(response).to have_http_status(:success)
      end

      it 'returns user borrowings' do
        json_response = JSON.parse(response.body)
        expect(json_response).to be_an(Array)
      end
    end

    context 'when not authenticated' do
      before do
        get '/api/borrowings'
      end

      it 'returns http unauthorized' do
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /api/borrowings' do
    context 'when authenticated as member' do
      it 'creates a new borrowing' do
        expect {
          post '/api/borrowings',
               params: { book_id: book.id },
               headers: auth_headers_for(member)
        }.to change(Borrowing, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it 'prevents borrowing the same book twice' do
        member.borrow_book(book)

        post '/api/borrowings',
             params: { book_id: book.id },
             headers: auth_headers_for(member)

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['error']).to eq('You have already borrowed this book')
      end
    end

    context 'when authenticated as librarian' do
      before do
        post '/api/borrowings',
             params: { book_id: book.id },
             headers: auth_headers_for(librarian)
      end

      it 'returns http forbidden' do
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'PATCH /api/borrowings/:id/return' do
    context 'when authenticated as librarian' do
      it 'marks borrowing as returned' do
        patch "/api/borrowings/#{borrowing.id}/return",
              headers: auth_headers_for(librarian)

        expect(response).to have_http_status(:success)
        expect(borrowing.reload.returned_at).to be_present
      end
    end

    context 'when authenticated as member' do
      before do
        patch "/api/borrowings/#{borrowing.id}/return",
              headers: auth_headers_for(member)
      end

      it 'returns http forbidden' do
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'GET /api/borrowings/overdue' do
    context 'when authenticated as librarian' do
      before do
        get '/api/borrowings/overdue', headers: auth_headers_for(librarian)
      end

      it 'returns http success' do
        expect(response).to have_http_status(:success)
      end
    end

    context 'when authenticated as member' do
      before do
        get '/api/borrowings/overdue', headers: auth_headers_for(member)
      end

      it 'returns http forbidden' do
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'GET /api/borrowings/my_overdue' do
    context 'when authenticated as member' do
      before do
        get '/api/borrowings/my_overdue', headers: auth_headers_for(member)
      end

      it 'returns http success' do
        expect(response).to have_http_status(:success)
      end
    end
  end
end
