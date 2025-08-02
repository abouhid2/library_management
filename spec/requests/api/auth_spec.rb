require 'rails_helper'

RSpec.describe 'Api::Auth', type: :request do
  let(:valid_user_attributes) do
    {
      user: {
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        name: 'Test User',
        user_type: 'member'
      }
    }
  end

  let(:existing_user) { create(:user, email: 'existing@example.com', password: 'password123') }

  describe 'POST /api/auth/login' do
    context 'with valid credentials' do
      before do
        existing_user # Create the user
      end

      it 'returns success response with user data and token' do
        post '/api/auth/login', params: { email: existing_user.email, password: 'password123' }

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)

        expect(json_response['success']).to be true
        expect(json_response['user']['id']).to eq(existing_user.id)
        expect(json_response['user']['email']).to eq(existing_user.email)
        expect(json_response['user']['name']).to eq(existing_user.name)
        expect(json_response['user']['user_type']).to eq(existing_user.user_type)
        expect(json_response['token']).to be_present
      end

      it 'returns different tokens for different logins' do
        post '/api/auth/login', params: { email: existing_user.email, password: 'password123' }
        first_token = JSON.parse(response.body)['token']

        # Add a small delay to ensure different timestamps
        sleep(1)

        post '/api/auth/login', params: { email: existing_user.email, password: 'password123' }
        second_token = JSON.parse(response.body)['token']

        expect(first_token).not_to eq(second_token)
      end
    end

    context 'with invalid email' do
      it 'returns unauthorized status with error message' do
        post '/api/auth/login', params: { email: 'nonexistent@example.com', password: 'password123' }

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)

        expect(json_response['success']).to be false
        expect(json_response['message']).to eq('Invalid email or password')
      end
    end

    context 'with invalid password' do
      before do
        existing_user # Create the user
      end

      it 'returns unauthorized status with error message' do
        post '/api/auth/login', params: { email: existing_user.email, password: 'wrongpassword' }

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)

        expect(json_response['success']).to be false
        expect(json_response['message']).to eq('Invalid email or password')
      end
    end

    context 'with missing email' do
      it 'returns unauthorized status with error message' do
        post '/api/auth/login', params: { password: 'password123' }

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)

        expect(json_response['success']).to be false
        expect(json_response['message']).to eq('Invalid email or password')
      end
    end

    context 'with missing password' do
      it 'returns unauthorized status with error message' do
        post '/api/auth/login', params: { email: 'test@example.com' }

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)

        expect(json_response['success']).to be false
        expect(json_response['message']).to eq('Invalid email or password')
      end
    end

    context 'with empty parameters' do
      it 'returns unauthorized status with error message' do
        post '/api/auth/login', params: {}

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)

        expect(json_response['success']).to be false
        expect(json_response['message']).to eq('Invalid email or password')
      end
    end
  end

  describe 'POST /api/auth/register' do
    context 'with valid attributes' do
      it 'creates a new user and returns success response' do
        expect {
          post '/api/auth/register', params: valid_user_attributes
        }.to change(User, :count).by(1)

        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)

        expect(json_response['success']).to be true
        expect(json_response['user']['email']).to eq(valid_user_attributes[:user][:email])
        expect(json_response['user']['name']).to eq(valid_user_attributes[:user][:name])
        expect(json_response['user']['user_type']).to eq(valid_user_attributes[:user][:user_type])
        expect(json_response['token']).to be_present
        expect(json_response['user']['password']).to be_nil # Password should not be returned
      end

      it 'creates user with librarian type' do
        librarian_attributes = valid_user_attributes.deep_merge(
          user: { email: 'librarian@example.com', user_type: 'librarian' }
        )

        post '/api/auth/register', params: librarian_attributes

        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)
        expect(json_response['user']['user_type']).to eq('librarian')
      end
    end

    context 'with invalid attributes' do
      it 'returns unprocessable entity for missing email' do
        invalid_attributes = valid_user_attributes.deep_merge(user: { email: nil })

        post '/api/auth/register', params: invalid_attributes

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['errors']).to include("Email can't be blank")
      end

      it 'returns unprocessable entity for invalid email format' do
        invalid_attributes = valid_user_attributes.deep_merge(user: { email: 'invalid-email' })

        post '/api/auth/register', params: invalid_attributes

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['errors']).to include('Email is invalid')
      end

      it 'returns unprocessable entity for duplicate email' do
        existing_user # Create the user first

        duplicate_attributes = valid_user_attributes.deep_merge(user: { email: existing_user.email })

        post '/api/auth/register', params: duplicate_attributes

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['errors']).to include('Email has already been taken')
      end

      it 'returns unprocessable entity for missing password' do
        invalid_attributes = valid_user_attributes.deep_merge(user: { password: nil })

        post '/api/auth/register', params: invalid_attributes

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['errors']).to include("Password can't be blank")
      end

      it 'returns unprocessable entity for password confirmation mismatch' do
        invalid_attributes = valid_user_attributes.deep_merge(user: { password_confirmation: 'different' })

        post '/api/auth/register', params: invalid_attributes

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['errors']).to include("Password confirmation doesn't match Password")
      end

      it 'returns unprocessable entity for missing name' do
        invalid_attributes = valid_user_attributes.deep_merge(user: { name: nil })

        post '/api/auth/register', params: invalid_attributes

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['errors']).to include("Name can't be blank")
      end

      it 'returns unprocessable entity for invalid user_type' do
        invalid_attributes = valid_user_attributes.deep_merge(user: { user_type: 'invalid_type' })

        post '/api/auth/register', params: invalid_attributes

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['errors']).to include('User type is not included in the list')
      end
    end
  end

  describe 'POST /api/auth/logout' do
    it 'returns success response with logout message' do
      post '/api/auth/logout'

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)

      expect(json_response['success']).to be true
      expect(json_response['message']).to eq('Successfully logged out')
    end

    it 'returns success response regardless of authentication state' do
      # Test logout even when no user is authenticated
      post '/api/auth/logout'

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)

      expect(json_response['success']).to be true
      expect(json_response['message']).to eq('Successfully logged out')
    end

    it 'returns consistent response format' do
      post '/api/auth/logout'

      json_response = JSON.parse(response.body)

      expect(json_response).to have_key('success')
      expect(json_response).to have_key('message')
    end
  end

  describe 'GET /api/auth/me' do
    context 'when user is authenticated' do
      let(:user) { create(:user, :member) }

      it 'returns current user information' do
        get '/api/auth/me', headers: auth_headers_for(user)

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)

        expect(json_response['success']).to be true
        expect(json_response['user']['id']).to eq(user.id)
        expect(json_response['user']['email']).to eq(user.email)
        expect(json_response['user']['name']).to eq(user.name)
        expect(json_response['user']['user_type']).to eq(user.user_type)
        expect(json_response['user']['password']).to be_nil
      end

      it 'returns librarian user information' do
        librarian = create(:user, :librarian)
        get '/api/auth/me', headers: auth_headers_for(librarian)

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)

        expect(json_response['user']['user_type']).to eq('librarian')
      end
    end

    context 'when user is not authenticated' do
      it 'returns unauthorized status' do
        get '/api/auth/me'

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)

        expect(json_response['error']).to eq('Authentication required')
      end
    end

    context 'with invalid token' do
      it 'returns unauthorized status' do
        get '/api/auth/me', headers: { 'Authorization' => 'Bearer invalid_token' }

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)

        expect(json_response['error']).to eq('Authentication required')
      end
    end

    context 'with expired token' do
      it 'returns unauthorized status' do
        # Create a token that's already expired
        payload = { user_id: create(:user).id, exp: 1.hour.ago.to_i }
        expired_token = JWT.encode(payload, Rails.application.credentials.secret_key_base, 'HS256')

        get '/api/auth/me', headers: { 'Authorization' => "Bearer #{expired_token}" }

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)

        expect(json_response['error']).to eq('Authentication required')
      end
    end
  end
end 