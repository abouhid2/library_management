require 'rails_helper'

RSpec.describe Api::BorrowingsController, type: :controller do
  let(:librarian) { create(:user, :librarian) }
  let(:member) { create(:user, :member) }
  let(:book) { create(:book) }
  let(:borrowing) { create(:borrowing, user: member, book: book) }

  describe 'GET #index' do
    context 'when user is a member' do
      before do
        request.headers.merge!(auth_headers_for(member))
      end

      it 'returns a successful response' do
        get :index
        expect(response).to be_successful
      end

      it 'returns only user\'s borrowings' do
        create_list(:borrowing, 3, user: member)
        create(:borrowing, user: create(:user, :member)) # Different user

        get :index
        response_body = JSON.parse(response.body)
        expect(response_body.size).to eq(3)
      end

      it 'returns empty array when user has no borrowings' do
        get :index
        response_body = JSON.parse(response.body)
        expect(response_body).to eq([])
      end
    end

    context 'when user is a librarian' do
      before do
        request.headers.merge!(auth_headers_for(librarian))
      end

      it 'returns a successful response' do
        get :index
        expect(response).to be_successful
      end

      it 'returns all borrowings in the system' do
        member1 = create(:user, :member)
        member2 = create(:user, :member)
        create_list(:borrowing, 2, user: member1)
        create_list(:borrowing, 3, user: member2)

        get :index
        response_body = JSON.parse(response.body)
        expect(response_body.size).to eq(21)
      end

      it 'includes user and book information in response' do
        borrowing = create(:borrowing, user: member, book: book)

        get :index
        response_body = JSON.parse(response.body)
        last_borrowing = response_body.last

        expect(last_borrowing['user']).to be_present
        expect(last_borrowing['book']).to be_present
        expect(last_borrowing['user']['name']).to eq(member.name)
        expect(last_borrowing['book']['title']).to eq(book.title)
      end
    end

    context 'when user is not authenticated' do
      it 'returns unauthorized status' do
        get :index
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET #show' do
    context 'when user is authenticated' do
      before do
        request.headers.merge!(auth_headers_for(member))
      end

      it 'returns a successful response' do
        get :show, params: { id: borrowing.id }
        expect(response).to be_successful
      end

      it 'returns the requested borrowing' do
        get :show, params: { id: borrowing.id }
        response_body = JSON.parse(response.body)
        expect(response_body['id']).to eq(borrowing.id)
        expect(response_body['user_id']).to eq(member.id)
        expect(response_body['book_id']).to eq(book.id)
      end

      it 'returns not found for non-existent borrowing' do
        get :show, params: { id: 99999 }
        expect(response).to have_http_status(:not_found)
      end

      it 'returns forbidden when accessing another user\'s borrowing' do
        other_borrowing = create(:borrowing, user: create(:user, :member))
        get :show, params: { id: other_borrowing.id }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when user is not authenticated' do
      it 'returns unauthorized status' do
        get :show, params: { id: borrowing.id }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST #create' do
    context 'when user is a member' do
      before do
        request.headers.merge!(auth_headers_for(member))
      end

      it 'creates a new borrowing' do
        expect {
          post :create, params: { book_id: book.id }
        }.to change(Borrowing, :count).by(1)
      end

      it 'returns a successful response' do
        post :create, params: { book_id: book.id }
        expect(response).to have_http_status(:created)
      end

      it 'returns the created borrowing' do
        post :create, params: { book_id: book.id }
        response_body = JSON.parse(response.body)
        expect(response_body['user_id']).to eq(member.id)
        expect(response_body['book_id']).to eq(book.id)
        expect(response_body['borrowed_at']).to be_present
        expect(response_body['due_at']).to be_present
        expect(response_body['returned_at']).to be_nil
      end

      it 'decreases book available copies' do
        expect {
          post :create, params: { book_id: book.id }
        }.to change { book.reload.available_copies }.by(-1)
      end

      it 'prevents borrowing the same book twice' do
        member.borrow_book(book)
        post :create, params: { book_id: book.id }
        expect(response).to have_http_status(:unprocessable_entity)
        response_body = JSON.parse(response.body)
        expect(response_body['error']).to eq('You have already borrowed this book')
      end

      it 'prevents borrowing when book is not available' do
        book.update(available_copies: 0)
        post :create, params: { book_id: book.id }
        expect(response).to have_http_status(:unprocessable_entity)
        response_body = JSON.parse(response.body)
        expect(response_body['error']).to eq('Book is not available')
      end

      it 'returns not found for non-existent book' do
        post :create, params: { book_id: 99999 }
        expect(response).to have_http_status(:not_found)
      end

      it 'returns error when book_id is missing' do
        post :create, params: {}
        expect(response).to have_http_status(:unprocessable_entity)
        response_body = JSON.parse(response.body)
        expect(response_body['error']).to eq('Book ID is required')
      end
    end

    context 'when user is a librarian' do
      before do
        request.headers.merge!(auth_headers_for(librarian))
      end

      it 'returns forbidden status' do
        post :create, params: { book_id: book.id }
        expect(response).to have_http_status(:forbidden)
        response_body = JSON.parse(response.body)
        expect(response_body['error']).to eq('Only members can borrow books')
      end
    end

    context 'when user is not authenticated' do
      it 'returns unauthorized status' do
        post :create, params: { book_id: book.id }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'PATCH #return' do
    context 'when user is a librarian' do
      before do
        request.headers.merge!(auth_headers_for(librarian))
      end

      it 'marks the borrowing as returned' do
        patch :return, params: { id: borrowing.id }
        expect(response).to be_successful
        expect(borrowing.reload.returned_at).to be_present
      end

      it 'increases book available copies' do
        expect {
          patch :return, params: { id: borrowing.id }
        }.to change { book.reload.available_copies }.by(1)
      end

      it 'returns the updated borrowing' do
        patch :return, params: { id: borrowing.id }
        response_body = JSON.parse(response.body)
        expect(response_body['id']).to eq(borrowing.id)
        expect(response_body['returned_at']).to be_present
      end

      it 'returns not found for non-existent borrowing' do
        patch :return, params: { id: 99999 }
        expect(response).to have_http_status(:not_found)
      end

      it 'returns error when borrowing is already returned' do
        borrowing.update(returned_at: Time.current)
        patch :return, params: { id: borrowing.id }
        expect(response).to have_http_status(:unprocessable_entity)
        response_body = JSON.parse(response.body)
        expect(response_body['error']).to eq('Book already returned')
      end
    end

    context 'when user is a member' do
      before do
        request.headers.merge!(auth_headers_for(member))
      end

      it 'returns forbidden status' do
        patch :return, params: { id: borrowing.id }
        expect(response).to have_http_status(:forbidden)
        response_body = JSON.parse(response.body)
        expect(response_body['error']).to eq('Only librarians can return books')
      end
    end

    context 'when user is not authenticated' do
      it 'returns unauthorized status' do
        patch :return, params: { id: borrowing.id }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET #overdue' do
    context 'when user is a librarian' do
      before do
        request.headers.merge!(auth_headers_for(librarian))
      end

      it 'returns a successful response' do
        get :overdue
        expect(response).to be_successful
      end

      it 'returns all overdue borrowings' do
        overdue_borrowing = create(:borrowing, :overdue)
        current_borrowing = create(:borrowing)

        get :overdue
        response_body = JSON.parse(response.body)
        expect(response_body.size).to eq(4)
        expect(response_body.last['id']).to eq(overdue_borrowing.id)
      end
    end

    context 'when user is a member' do
      before do
        request.headers.merge!(auth_headers_for(member))
      end

      it 'returns forbidden status' do
        get :overdue
        expect(response).to have_http_status(:forbidden)
        response_body = JSON.parse(response.body)
        expect(response_body['error']).to eq('Only librarians can view overdue borrowings')
      end
    end

    context 'when user is not authenticated' do
      it 'returns unauthorized status' do
        get :overdue
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET #my_overdue' do
    context 'when user is authenticated' do
      before do
        request.headers.merge!(auth_headers_for(member))
      end

      it 'returns a successful response' do
        get :my_overdue
        expect(response).to be_successful
      end

      it 'returns user\'s overdue borrowings' do
        overdue_borrowing = create(:borrowing, :overdue, user: member)
        current_borrowing = create(:borrowing, user: member)
        other_overdue = create(:borrowing, :overdue, user: create(:user, :member))

        get :my_overdue
        response_body = JSON.parse(response.body)
        expect(response_body.size).to eq(1)
        expect(response_body.first['id']).to eq(overdue_borrowing.id)
      end

      it 'returns empty array when user has no overdue borrowings' do
        create(:borrowing, user: member)
        get :my_overdue
        response_body = JSON.parse(response.body)
        expect(response_body).to eq([])
      end
    end

    context 'when user is not authenticated' do
      it 'returns unauthorized status' do
        get :my_overdue
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
