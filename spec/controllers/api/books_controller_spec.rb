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
  let(:test_image) { fixture_file_upload('test_image.jpg', 'image/jpeg') }
  let(:large_image) { fixture_file_upload('large_image.jpg', 'image/jpeg') }
  let(:invalid_file) { fixture_file_upload('text_file.txt', 'text/plain') }

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

      it 'includes image URLs in response' do
        book_with_image = create(:book)
        book_with_image.image.attach(test_image)
        
        get :index
        response_body = JSON.parse(response.body)
        book_response = response_body.find { |b| b['id'] == book_with_image.id }
        
        expect(book_response['image_url']).to be_present
        expect(book_response['thumbnail_url']).to be_present
      end

      it 'returns nil image URLs for books without images' do
        book_without_image = create(:book)
        
        get :index
        response_body = JSON.parse(response.body)
        book_response = response_body.find { |b| b['id'] == book_without_image.id }
        
        expect(book_response['image_url']).to be_nil
        expect(book_response['thumbnail_url']).to be_nil
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

        it 'performs general search across all fields' do
          get :index, params: { search: 'Gatsby' }
          response_body = JSON.parse(response.body)
          expect(response_body.size).to eq(1)
          expect(response_body.first['title']).to eq('The Great Gatsby')
        end

        it 'performs case-insensitive general search' do
          get :index, params: { search: 'gatsby' }
          response_body = JSON.parse(response.body)
          expect(response_body.size).to eq(1)
          expect(response_body.first['title']).to eq('The Great Gatsby')
        end

        it 'prioritizes general search over specific field searches' do
          get :index, params: { search: 'Fitzgerald', title: 'Science' }
          response_body = JSON.parse(response.body)
          expect(response_body.size).to eq(1)
          expect(response_body.first['author']).to eq('Fitzgerald')
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

      it 'includes image URLs for book with image' do
        book_with_image = create(:book)
        book_with_image.image.attach(test_image)
        
        get :show, params: { id: book_with_image.id }
        response_body = JSON.parse(response.body)
        
        expect(response_body['image_url']).to be_present
        expect(response_body['thumbnail_url']).to be_present
        expect(response_body['image_url']).to include('test_image.jpg')
        expect(response_body['thumbnail_url']).to include('test_image.jpg')
      end

      it 'returns nil image URLs for book without image' do
        get :show, params: { id: book.id }
        response_body = JSON.parse(response.body)
        
        expect(response_body['image_url']).to be_nil
        expect(response_body['thumbnail_url']).to be_nil
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

        context 'with image upload' do
          it 'creates a book with an image' do
            expect {
              post :create, params: { book: valid_attributes.merge(image: test_image) }
            }.to change(Book, :count).by(1)
          end

          it 'attaches the image to the book' do
            post :create, params: { book: valid_attributes.merge(image: test_image) }
            created_book = Book.last
            expect(created_book.image).to be_attached
            expect(created_book.image.filename.to_s).to eq('test_image.jpg')
          end

          it 'returns image URLs in the response' do
            post :create, params: { book: valid_attributes.merge(image: test_image) }
            response_body = JSON.parse(response.body)
            expect(response_body['image_url']).to be_present
            expect(response_body['thumbnail_url']).to be_present
            expect(response_body['image_url']).to include('test_image.jpg')
            expect(response_body['thumbnail_url']).to include('test_image.jpg')
          end
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

        context 'with invalid image' do
          it 'rejects image that is too large' do
            post :create, params: { book: valid_attributes.merge(image: large_image) }
            expect(response).to have_http_status(:unprocessable_entity)
            
            response_body = JSON.parse(response.body)
            expect(response_body['errors']).to include('Image is too big (should be less than 5MB)')
          end

          it 'rejects invalid file type' do
            post :create, params: { book: valid_attributes.merge(image: invalid_file) }
            expect(response).to have_http_status(:unprocessable_entity)
            
            response_body = JSON.parse(response.body)
            expect(response_body['errors']).to include('Image must be a JPEG, PNG, GIF, or WebP')
          end
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

        context 'with image updates' do
          let!(:book_with_image) { create(:book) }
          
          before do
            book_with_image.image.attach(test_image)
          end

          it 'updates the book image' do
            new_image = fixture_file_upload('test_image.jpg', 'image/jpeg')
            put :update, params: { id: book_with_image.id, book: { image: new_image } }
            
            book_with_image.reload
            expect(book_with_image.image).to be_attached
          end

          it 'returns updated image URLs in response' do
            new_image = fixture_file_upload('test_image.jpg', 'image/jpeg')
            put :update, params: { id: book_with_image.id, book: { image: new_image } }
            
            response_body = JSON.parse(response.body)
            expect(response_body['image_url']).to be_present
            expect(response_body['thumbnail_url']).to be_present
          end

          it 'removes image when image parameter is set to nil' do
            put :update, params: { id: book_with_image.id, book: { image: nil } }
            
            book_with_image.reload
            expect(book_with_image.image).not_to be_attached
          end

          it 'returns nil image URLs when image is removed' do
            put :update, params: { id: book_with_image.id, book: { image: nil } }
            
            response_body = JSON.parse(response.body)
            expect(response_body['image_url']).to be_nil
            expect(response_body['thumbnail_url']).to be_nil
          end

          it 'removes image when image parameter is set to empty string' do
            put :update, params: { id: book_with_image.id, book: { image: '' } }
            
            book_with_image.reload
            expect(book_with_image.image).not_to be_attached
          end
        end

        context 'with invalid image updates' do
          let!(:book_with_image) { create(:book) }

          it 'rejects image that is too large' do
            put :update, params: { id: book_with_image.id, book: { image: large_image } }
            expect(response).to have_http_status(:unprocessable_entity)
            
            response_body = JSON.parse(response.body)
            expect(response_body['errors']).to include('Image is too big (should be less than 5MB)')
          end

          it 'rejects invalid file type' do
            put :update, params: { id: book_with_image.id, book: { image: invalid_file } }
            expect(response).to have_http_status(:unprocessable_entity)
            
            response_body = JSON.parse(response.body)
            expect(response_body['errors']).to include('Image must be a JPEG, PNG, GIF, or WebP')
          end
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
