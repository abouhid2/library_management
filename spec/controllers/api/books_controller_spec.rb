require 'rails_helper'

RSpec.describe Api::BooksController, type: :controller do
  let(:librarian) { create(:user, :librarian) }
  let(:member) { create(:user, :member) }
  let(:book) { create(:book) }
  let(:valid_attributes) do
    {
      title: 'Test Book',
      author: 'Test Author',
      genre: 'Fiction',
      isbn: '978-0-7475-3269-9',
      total_copies: 5
    }
  end
  let(:invalid_attributes) do
    {
      title: '',
      author: '',
      genre: '',
      isbn: '',
      total_copies: -1
    }
  end

  describe 'GET #index' do
    context 'when user is authenticated' do
      before do
        request.headers.merge!(auth_headers_for(librarian))
      end

      it 'returns a successful response' do
        get :index
        expect(response).to be_successful
      end

      it 'returns all books' do
        create_list(:book, 3)
        get :index
        expect(JSON.parse(response.body).size).to eq(3)
      end

      context 'with search parameters' do
        let!(:fiction_book) { create(:book, title: 'The Great Gatsby', author: 'Fitzgerald', genre: 'Fiction') }
        let!(:non_fiction_book) { create(:book, title: 'Science Book', author: 'Einstein', genre: 'Non-Fiction') }

        it 'filters by title' do
          get :index, params: { title: 'Gatsby' }
          response_body = JSON.parse(response.body)
          expect(response_body.size).to eq(1)
          expect(response_body.first['title']).to eq('The Great Gatsby')
        end

        it 'filters by author' do
          get :index, params: { author: 'Einstein' }
          response_body = JSON.parse(response.body)
          expect(response_body.size).to eq(1)
          expect(response_body.first['author']).to eq('Einstein')
        end

        it 'filters by genre' do
          get :index, params: { genre: 'Non-Fiction' }
          response_body = JSON.parse(response.body)
          expect(response_body.size).to eq(1)
          expect(response_body.first['genre']).to eq('Non-Fiction')
        end
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
        request.headers.merge!(auth_headers_for(librarian))
      end

      it 'returns a successful response' do
        get :show, params: { id: book.id }
        expect(response).to be_successful
      end

      it 'returns the requested book' do
        get :show, params: { id: book.id }
        response_body = JSON.parse(response.body)
        expect(response_body['id']).to eq(book.id)
        expect(response_body['title']).to eq(book.title)
      end

      it 'returns not found for non-existent book' do
        get :show, params: { id: 99999 }
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when user is not authenticated' do
      it 'returns unauthorized status' do
        get :show, params: { id: book.id }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST #create' do
    context 'when user is a librarian' do
      before do
        request.headers.merge!(auth_headers_for(librarian))
      end

      context 'with valid parameters' do
        it 'creates a new book' do
          expect {
            post :create, params: { book: valid_attributes }
          }.to change(Book, :count).by(1)
        end

        it 'returns a successful response' do
          post :create, params: { book: valid_attributes }
          expect(response).to have_http_status(:created)
        end

        it 'returns the created book' do
          post :create, params: { book: valid_attributes }
          response_body = JSON.parse(response.body)
          expect(response_body['title']).to eq('Test Book')
          expect(response_body['author']).to eq('Test Author')
        end
      end

      context 'with invalid parameters' do
        it 'does not create a new book' do
          expect {
            post :create, params: { book: invalid_attributes }
          }.not_to change(Book, :count)
        end

        it 'returns unprocessable entity status' do
          post :create, params: { book: invalid_attributes }
          expect(response).to have_http_status(:unprocessable_entity)
        end

        it 'returns validation errors' do
          post :create, params: { book: invalid_attributes }
          response_body = JSON.parse(response.body)
          expect(response_body['errors']).to be_present
        end
      end
    end

    context 'when user is a member' do
      before do
        request.headers.merge!(auth_headers_for(member))
      end

      it 'returns forbidden status' do
        post :create, params: { book: valid_attributes }
        expect(response).to have_http_status(:forbidden)
      end

      it 'does not create a new book' do
        expect {
          post :create, params: { book: valid_attributes }
        }.not_to change(Book, :count)
      end
    end

    context 'when user is not authenticated' do
      it 'returns unauthorized status' do
        post :create, params: { book: valid_attributes }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'PUT #update' do
    let(:new_attributes) do
      {
        title: 'Updated Book Title',
        total_copies: 10
      }
    end

    context 'when user is a librarian' do
      before do
        request.headers.merge!(auth_headers_for(librarian))
      end

      context 'with valid parameters' do
        it 'updates the requested book' do
          put :update, params: { id: book.id, book: new_attributes }
          book.reload
          expect(book.title).to eq('Updated Book Title')
          expect(book.total_copies).to eq(10)
        end

        it 'returns a successful response' do
          put :update, params: { id: book.id, book: new_attributes }
          expect(response).to be_successful
        end

        it 'returns the updated book' do
          put :update, params: { id: book.id, book: new_attributes }
          response_body = JSON.parse(response.body)
          expect(response_body['title']).to eq('Updated Book Title')
        end
      end

      context 'with invalid parameters' do
        it 'returns unprocessable entity status' do
          put :update, params: { id: book.id, book: invalid_attributes }
          expect(response).to have_http_status(:unprocessable_entity)
        end

        it 'returns validation errors' do
          put :update, params: { id: book.id, book: invalid_attributes }
          response_body = JSON.parse(response.body)
          expect(response_body['errors']).to be_present
        end
      end

      it 'returns not found for non-existent book' do
        put :update, params: { id: 99999, book: new_attributes }
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when user is a member' do
      before do
        request.headers.merge!(auth_headers_for(member))
      end

      it 'returns forbidden status' do
        put :update, params: { id: book.id, book: new_attributes }
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when user is not authenticated' do
      it 'returns unauthorized status' do
        put :update, params: { id: book.id, book: new_attributes }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE #destroy' do
    let!(:book_to_delete) { create(:book) }

    context 'when user is a librarian' do
      before do
        request.headers.merge!(auth_headers_for(librarian))
      end

      it 'destroys the requested book' do
        expect {
          delete :destroy, params: { id: book_to_delete.id }
        }.to change(Book, :count).by(-1)
      end

      it 'returns no content status' do
        delete :destroy, params: { id: book_to_delete.id }
        expect(response).to have_http_status(:no_content)
      end

      it 'returns not found for non-existent book' do
        delete :destroy, params: { id: 99999 }
        expect(response).to have_http_status(:not_found)
      end

      it 'prevents deletion of book with active borrowings' do
        member = create(:user, :member)
        create(:borrowing, user: member, book: book_to_delete)

        delete :destroy, params: { id: book_to_delete.id }
        expect(response).to have_http_status(:unprocessable_entity)
        
        response_body = JSON.parse(response.body)
        expect(response_body['error']).to eq('Cannot delete book: It is currently borrowed')
      end

      it 'allows deletion of book with no active borrowings' do
        expect {
          delete :destroy, params: { id: book_to_delete.id }
        }.to change(Book, :count).by(-1)
      end

      it 'allows deletion of book with only returned borrowings' do
        member = create(:user, :member)
        borrowing = create(:borrowing, user: member, book: book_to_delete)
        borrowing.update(returned_at: Time.current)

        expect {
          delete :destroy, params: { id: book_to_delete.id }
        }.to change(Book, :count).by(-1)
      end
    end

    context 'when user is a member' do
      before do
        request.headers.merge!(auth_headers_for(member))
      end

      it 'returns forbidden status' do
        delete :destroy, params: { id: book_to_delete.id }
        expect(response).to have_http_status(:forbidden)
      end

      it 'does not destroy the book' do
        expect {
          delete :destroy, params: { id: book_to_delete.id }
        }.not_to change(Book, :count)
      end
    end

    context 'when user is not authenticated' do
      it 'returns unauthorized status' do
        delete :destroy, params: { id: book_to_delete.id }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
