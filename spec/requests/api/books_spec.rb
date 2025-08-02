require 'rails_helper'

RSpec.describe 'Api::Books', type: :request do
  let(:librarian) { create(:user, :librarian) }
  let(:member) { create(:user, :member) }
  let(:valid_attributes) do
    {
      book: {
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        isbn: '978-0-7475-3269-9',
        total_copies: 5
      }
    }
  end
  let(:invalid_attributes) do
    {
      book: {
        title: '',
        author: '',
        genre: '',
        isbn: '',
        total_copies: -1
      }
    }
  end

  describe 'GET /api/books' do
    context 'when user is authenticated' do
      before do
        get '/api/books', headers: auth_headers_for(librarian)
      end

      it 'returns http success' do
        expect(response).to have_http_status(:success)
      end

      it 'returns all books' do
        create_list(:book, 3)
        get '/api/books', headers: auth_headers_for(librarian)
        json_response = JSON.parse(response.body)
        expect(json_response.size).to eq(3)
      end

      it 'returns empty array when no books exist' do
        json_response = JSON.parse(response.body)
        expect(json_response).to eq([])
      end

      context 'with search parameters' do
        let!(:fiction_book) { create(:book, title: 'The Great Gatsby', author: 'Fitzgerald', genre: 'Fiction') }
        let!(:non_fiction_book) { create(:book, title: 'Science Book', author: 'Einstein', genre: 'Non-Fiction') }

        it 'filters by title' do
          get '/api/books', params: { title: 'Gatsby' }, headers: auth_headers_for(librarian)
          json_response = JSON.parse(response.body)
          expect(json_response.size).to eq(1)
          expect(json_response.first['title']).to eq('The Great Gatsby')
        end

        it 'filters by author' do
          get '/api/books', params: { author: 'Einstein' }, headers: auth_headers_for(librarian)
          json_response = JSON.parse(response.body)
          expect(json_response.size).to eq(1)
          expect(json_response.first['author']).to eq('Einstein')
        end

        it 'filters by genre' do
          get '/api/books', params: { genre: 'Non-Fiction' }, headers: auth_headers_for(librarian)
          json_response = JSON.parse(response.body)
          expect(json_response.size).to eq(1)
          expect(json_response.first['genre']).to eq('Non-Fiction')
        end

        it 'filters by multiple parameters' do
          get '/api/books', params: { title: 'Science', genre: 'Non-Fiction' }, headers: auth_headers_for(librarian)
          json_response = JSON.parse(response.body)
          expect(json_response.size).to eq(1)
          expect(json_response.first['title']).to eq('Science Book')
        end

        it 'returns empty array when no matches found' do
          get '/api/books', params: { title: 'Nonexistent' }, headers: auth_headers_for(librarian)
          json_response = JSON.parse(response.body)
          expect(json_response).to eq([])
        end
      end
    end

    context 'when user is not authenticated' do
      it 'returns http unauthorized' do
        get '/api/books'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/books/:id' do
    let(:book) { create(:book) }

    context 'when user is authenticated' do
      it 'returns http success' do
        get "/api/books/#{book.id}", headers: auth_headers_for(librarian)
        expect(response).to have_http_status(:success)
      end

      it 'returns the requested book' do
        get "/api/books/#{book.id}", headers: auth_headers_for(librarian)
        json_response = JSON.parse(response.body)
        expect(json_response['id']).to eq(book.id)
        expect(json_response['title']).to eq(book.title)
        expect(json_response['author']).to eq(book.author)
        expect(json_response['genre']).to eq(book.genre)
        expect(json_response['isbn']).to eq(book.isbn)
        expect(json_response['total_copies']).to eq(book.total_copies)
        expect(json_response['available_copies']).to eq(book.available_copies)
      end

      it 'returns not found for non-existent book' do
        get '/api/books/99999', headers: auth_headers_for(librarian)
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when user is not authenticated' do
      it 'returns http unauthorized' do
        get "/api/books/#{book.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /api/books' do
    context 'when user is authenticated as librarian' do
      it 'creates a new book' do
        expect {
          post '/api/books', params: valid_attributes, headers: auth_headers_for(librarian)
        }.to change(Book, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it 'returns the created book' do
        post '/api/books', params: valid_attributes, headers: auth_headers_for(librarian)
        json_response = JSON.parse(response.body)
        expect(json_response['title']).to eq(valid_attributes[:book][:title])
        expect(json_response['author']).to eq(valid_attributes[:book][:author])
        expect(json_response['genre']).to eq(valid_attributes[:book][:genre])
        expect(json_response['isbn']).to eq(valid_attributes[:book][:isbn])
        expect(json_response['total_copies']).to eq(valid_attributes[:book][:total_copies])
        # available_copies will be 0 since we're not setting it explicitly
        expect(json_response['available_copies']).to eq(0)
      end

      it 'sets available_copies to total_copies by default' do
        # Remove available_copies from params to test the callback
        params_without_available = valid_attributes.deep_merge(book: { available_copies: nil })
        post '/api/books', params: params_without_available, headers: auth_headers_for(librarian)
        json_response = JSON.parse(response.body)
        expect(json_response['available_copies']).to eq(valid_attributes[:book][:total_copies])
      end

      it 'allows setting custom available_copies' do
        custom_attributes = valid_attributes.deep_merge(book: { available_copies: 3 })
        post '/api/books', params: custom_attributes, headers: auth_headers_for(librarian)
        json_response = JSON.parse(response.body)
        expect(json_response['available_copies']).to eq(3)
      end
    end

    context 'when user is authenticated as member' do
      it 'returns forbidden status' do
        post '/api/books', params: valid_attributes, headers: auth_headers_for(member)
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when user is not authenticated' do
      it 'returns http unauthorized' do
        post '/api/books', params: valid_attributes
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'with invalid attributes' do
      it 'returns unprocessable entity for missing title' do
        invalid_params = valid_attributes.deep_merge(book: { title: nil })
        post '/api/books', params: invalid_params, headers: auth_headers_for(librarian)
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include("Title can't be blank")
      end

      it 'returns unprocessable entity for missing author' do
        invalid_params = valid_attributes.deep_merge(book: { author: nil })
        post '/api/books', params: invalid_params, headers: auth_headers_for(librarian)
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include("Author can't be blank")
      end

      it 'returns unprocessable entity for missing genre' do
        invalid_params = valid_attributes.deep_merge(book: { genre: nil })
        post '/api/books', params: invalid_params, headers: auth_headers_for(librarian)
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include("Genre can't be blank")
      end

      it 'returns unprocessable entity for missing isbn' do
        invalid_params = valid_attributes.deep_merge(book: { isbn: nil })
        post '/api/books', params: invalid_params, headers: auth_headers_for(librarian)
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include("Isbn can't be blank")
      end

      it 'returns unprocessable entity for invalid isbn format' do
        invalid_params = valid_attributes.deep_merge(book: { isbn: 'invalid-isbn' })
        post '/api/books', params: invalid_params, headers: auth_headers_for(librarian)
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include('Isbn must be a valid ISBN format')
      end

      it 'returns unprocessable entity for duplicate isbn' do
        create(:book, isbn: valid_attributes[:book][:isbn])
        post '/api/books', params: valid_attributes, headers: auth_headers_for(librarian)
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include('Isbn has already been taken')
      end

      it 'returns unprocessable entity for negative total_copies' do
        invalid_params = valid_attributes.deep_merge(book: { total_copies: -1 })
        post '/api/books', params: invalid_params, headers: auth_headers_for(librarian)
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include('Total copies must be greater than or equal to 0')
      end

      it 'returns unprocessable entity for negative available_copies' do
        invalid_params = valid_attributes.deep_merge(book: { available_copies: -1 })
        post '/api/books', params: invalid_params, headers: auth_headers_for(librarian)
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include('Available copies must be greater than or equal to 0')
      end

      it 'returns unprocessable entity when available_copies exceeds total_copies' do
        invalid_params = valid_attributes.deep_merge(book: { total_copies: 5, available_copies: 10 })
        post '/api/books', params: invalid_params, headers: auth_headers_for(librarian)
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include('Available copies cannot exceed total copies')
      end
    end
  end

  describe 'PUT /api/books/:id' do
    let(:book) { create(:book) }
    let(:new_attributes) do
      {
        book: {
          title: 'Updated Book Title',
          author: 'Updated Author',
          genre: 'Mystery',
          total_copies: 10
        }
      }
    end

    context 'when user is authenticated as librarian' do
      it 'updates the requested book' do
        put "/api/books/#{book.id}", params: new_attributes, headers: auth_headers_for(librarian)
        expect(response).to have_http_status(:ok)
      end

      it 'returns the updated book' do
        put "/api/books/#{book.id}", params: new_attributes, headers: auth_headers_for(librarian)
        json_response = JSON.parse(response.body)
        expect(json_response['title']).to eq(new_attributes[:book][:title])
        expect(json_response['author']).to eq(new_attributes[:book][:author])
        expect(json_response['genre']).to eq(new_attributes[:book][:genre])
        expect(json_response['total_copies']).to eq(new_attributes[:book][:total_copies])
      end

      it 'returns not found for non-existent book' do
        put '/api/books/99999', params: new_attributes, headers: auth_headers_for(librarian)
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when user is authenticated as member' do
      it 'returns forbidden status' do
        put "/api/books/#{book.id}", params: new_attributes, headers: auth_headers_for(member)
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when user is not authenticated' do
      it 'returns http unauthorized' do
        put "/api/books/#{book.id}", params: new_attributes
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'with invalid attributes' do
      it 'returns unprocessable entity for invalid data' do
        invalid_params = { book: { title: '', author: '', total_copies: -1 } }
        put "/api/books/#{book.id}", params: invalid_params, headers: auth_headers_for(librarian)
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to be_present
      end
    end
  end

  describe 'DELETE /api/books/:id' do
    let!(:book) { create(:book) }

    context 'when user is authenticated as librarian' do
      it 'destroys the requested book' do
        expect {
          delete "/api/books/#{book.id}", headers: auth_headers_for(librarian)
        }.to change(Book, :count).by(-1)

        expect(response).to have_http_status(:no_content)
      end

      it 'returns not found for non-existent book' do
        delete '/api/books/99999', headers: auth_headers_for(librarian)
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when user is authenticated as member' do
      it 'returns forbidden status' do
        delete "/api/books/#{book.id}", headers: auth_headers_for(member)
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when user is not authenticated' do
      it 'returns http unauthorized' do
        delete "/api/books/#{book.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
