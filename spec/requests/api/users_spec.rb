require 'rails_helper'

RSpec.describe 'Api::Users', type: :request do
  let(:librarian) { create(:user, :librarian) }
  let(:member) { create(:user, :member) }

  describe 'User Profile Management' do
    describe 'GET /api/auth/me' do
      context 'when user is authenticated' do
        it 'returns member user profile' do
          get '/api/auth/me', headers: auth_headers_for(member)

          expect(response).to have_http_status(:ok)
          json_response = JSON.parse(response.body)

          expect(json_response['success']).to be true
          expect(json_response['user']['id']).to eq(member.id)
          expect(json_response['user']['email']).to eq(member.email)
          expect(json_response['user']['name']).to eq(member.name)
          expect(json_response['user']['user_type']).to eq('member')
          expect(json_response['user']['password']).to be_nil
          expect(json_response['user']['encrypted_password']).to be_nil
        end

        it 'returns librarian user profile' do
          get '/api/auth/me', headers: auth_headers_for(librarian)

          expect(response).to have_http_status(:ok)
          json_response = JSON.parse(response.body)

          expect(json_response['success']).to be true
          expect(json_response['user']['id']).to eq(librarian.id)
          expect(json_response['user']['email']).to eq(librarian.email)
          expect(json_response['user']['name']).to eq(librarian.name)
          expect(json_response['user']['user_type']).to eq('librarian')
        end

        it 'does not expose sensitive information' do
          get '/api/auth/me', headers: auth_headers_for(member)

          json_response = JSON.parse(response.body)
          user_data = json_response['user']

          expect(user_data).not_to have_key('password')
          expect(user_data).not_to have_key('encrypted_password')
          expect(user_data).not_to have_key('reset_password_token')
          expect(user_data).not_to have_key('reset_password_sent_at')
          expect(user_data).not_to have_key('remember_created_at')
          expect(user_data).not_to have_key('sign_in_count')
          expect(user_data).not_to have_key('current_sign_in_at')
          expect(user_data).not_to have_key('last_sign_in_at')
          expect(user_data).not_to have_key('current_sign_in_ip')
          expect(user_data).not_to have_key('last_sign_in_ip')
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

      context 'with malformed token' do
        it 'returns unauthorized status' do
          get '/api/auth/me', headers: { 'Authorization' => 'Bearer' }

          expect(response).to have_http_status(:unauthorized)
          json_response = JSON.parse(response.body)
          expect(json_response['error']).to eq('Authentication required')
        end
      end

      context 'with missing Authorization header' do
        it 'returns unauthorized status' do
          get '/api/auth/me', headers: {}

          expect(response).to have_http_status(:unauthorized)
          json_response = JSON.parse(response.body)
          expect(json_response['error']).to eq('Authentication required')
        end
      end
    end

    describe 'POST /api/auth/register' do
      let(:valid_attributes) do
        {
          user: {
            email: 'newuser@example.com',
            password: 'password123',
            password_confirmation: 'password123',
            name: 'New User',
            user_type: 'member'
          }
        }
      end

      context 'with valid attributes' do
        it 'creates a new member user' do
          expect {
            post '/api/auth/register', params: valid_attributes
          }.to change(User, :count).by(1)

          expect(response).to have_http_status(:created)
          json_response = JSON.parse(response.body)

          expect(json_response['success']).to be true
          expect(json_response['user']['email']).to eq(valid_attributes[:user][:email])
          expect(json_response['user']['name']).to eq(valid_attributes[:user][:name])
          expect(json_response['user']['user_type']).to eq('member')
          expect(json_response['token']).to be_present
        end

        it 'creates a new librarian user' do
          librarian_attributes = valid_attributes.deep_merge(
            user: { email: 'newlibrarian@example.com', user_type: 'librarian' }
          )

          expect {
            post '/api/auth/register', params: librarian_attributes
          }.to change(User, :count).by(1)

          expect(response).to have_http_status(:created)
          json_response = JSON.parse(response.body)
          expect(json_response['user']['user_type']).to eq('librarian')
        end

        it 'sets default user_type to member when not specified' do
          attributes_without_type = valid_attributes.deep_merge(user: { user_type: nil })

          post '/api/auth/register', params: attributes_without_type

          expect(response).to have_http_status(:created)
          json_response = JSON.parse(response.body)
          expect(json_response['user']['user_type']).to eq('member')
        end

        it 'does not expose sensitive information in response' do
          post '/api/auth/register', params: valid_attributes

          json_response = JSON.parse(response.body)
          user_data = json_response['user']

          expect(user_data).not_to have_key('password')
          expect(user_data).not_to have_key('encrypted_password')
          expect(user_data).not_to have_key('reset_password_token')
        end
      end

      context 'with invalid attributes' do
        it 'returns unprocessable entity for missing email' do
          invalid_attributes = valid_attributes.deep_merge(user: { email: nil })

          post '/api/auth/register', params: invalid_attributes

          expect(response).to have_http_status(:unprocessable_entity)
          json_response = JSON.parse(response.body)
          expect(json_response['success']).to be false
          expect(json_response['errors']).to include("Email can't be blank")
        end

        it 'returns unprocessable entity for invalid email format' do
          invalid_attributes = valid_attributes.deep_merge(user: { email: 'invalid-email' })

          post '/api/auth/register', params: invalid_attributes

          expect(response).to have_http_status(:unprocessable_entity)
          json_response = JSON.parse(response.body)
          expect(json_response['success']).to be false
          expect(json_response['errors']).to include('Email is invalid')
        end

        it 'returns unprocessable entity for duplicate email' do
          create(:user, email: valid_attributes[:user][:email])

          post '/api/auth/register', params: valid_attributes

          expect(response).to have_http_status(:unprocessable_entity)
          json_response = JSON.parse(response.body)
          expect(json_response['success']).to be false
          expect(json_response['errors']).to include('Email has already been taken')
        end

        it 'returns unprocessable entity for missing password' do
          invalid_attributes = valid_attributes.deep_merge(user: { password: nil })

          post '/api/auth/register', params: invalid_attributes

          expect(response).to have_http_status(:unprocessable_entity)
          json_response = JSON.parse(response.body)
          expect(json_response['success']).to be false
          expect(json_response['errors']).to include("Password can't be blank")
        end

        it 'returns unprocessable entity for short password' do
          invalid_attributes = valid_attributes.deep_merge(user: { password: '123', password_confirmation: '123' })

          post '/api/auth/register', params: invalid_attributes

          expect(response).to have_http_status(:unprocessable_entity)
          json_response = JSON.parse(response.body)
          expect(json_response['success']).to be false
          expect(json_response['errors']).to include('Password is too short (minimum is 6 characters)')
        end

        it 'returns unprocessable entity for password confirmation mismatch' do
          invalid_attributes = valid_attributes.deep_merge(user: { password_confirmation: 'different' })

          post '/api/auth/register', params: invalid_attributes

          expect(response).to have_http_status(:unprocessable_entity)
          json_response = JSON.parse(response.body)
          expect(json_response['success']).to be false
          expect(json_response['errors']).to include("Password confirmation doesn't match Password")
        end

        it 'returns unprocessable entity for missing name' do
          invalid_attributes = valid_attributes.deep_merge(user: { name: nil })

          post '/api/auth/register', params: invalid_attributes

          expect(response).to have_http_status(:unprocessable_entity)
          json_response = JSON.parse(response.body)
          expect(json_response['success']).to be false
          expect(json_response['errors']).to include("Name can't be blank")
        end

        it 'returns unprocessable entity for invalid user_type' do
          invalid_attributes = valid_attributes.deep_merge(user: { user_type: 'invalid_type' })

          post '/api/auth/register', params: invalid_attributes

          expect(response).to have_http_status(:unprocessable_entity)
          json_response = JSON.parse(response.body)
          expect(json_response['success']).to be false
          expect(json_response['errors']).to include('User type is not included in the list')
        end
      end
    end

    describe 'POST /api/auth/login' do
      let(:user) { create(:user, email: 'login@example.com', password: 'password123') }

      context 'with valid credentials' do
        it 'authenticates user and returns token' do
          post '/api/auth/login', params: { email: user.email, password: 'password123' }

          expect(response).to have_http_status(:ok)
          json_response = JSON.parse(response.body)

          expect(json_response['success']).to be true
          expect(json_response['user']['id']).to eq(user.id)
          expect(json_response['user']['email']).to eq(user.email)
          expect(json_response['token']).to be_present
        end

        it 'works with case-insensitive email' do
          post '/api/auth/login', params: { email: user.email.upcase, password: 'password123' }

          expect(response).to have_http_status(:ok)
          json_response = JSON.parse(response.body)
          expect(json_response['success']).to be true
        end

        it 'works with email with leading/trailing spaces' do
          post '/api/auth/login', params: { email: " #{user.email} ", password: 'password123' }

          expect(response).to have_http_status(:ok)
          json_response = JSON.parse(response.body)
          expect(json_response['success']).to be true
        end
      end

      context 'with invalid credentials' do
        it 'returns unauthorized for wrong password' do
          post '/api/auth/login', params: { email: user.email, password: 'wrongpassword' }

          expect(response).to have_http_status(:unauthorized)
          json_response = JSON.parse(response.body)
          expect(json_response['success']).to be false
          expect(json_response['message']).to eq('Invalid email or password')
        end

        it 'returns unauthorized for non-existent email' do
          post '/api/auth/login', params: { email: 'nonexistent@example.com', password: 'password123' }

          expect(response).to have_http_status(:unauthorized)
          json_response = JSON.parse(response.body)
          expect(json_response['success']).to be false
          expect(json_response['message']).to eq('Invalid email or password')
        end
      end
    end

    describe 'POST /api/auth/logout' do
      it 'returns success response' do
        post '/api/auth/logout'

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)

        expect(json_response['success']).to be true
        expect(json_response['message']).to eq('Successfully logged out')
      end

      it 'works without authentication' do
        post '/api/auth/logout'

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
      end
    end
  end

  describe 'User Authentication Flow' do
    it 'allows complete user registration and login flow' do
      # Step 1: Register a new user
      register_params = {
        user: {
          email: 'flow@example.com',
          password: 'password123',
          password_confirmation: 'password123',
          name: 'Flow User',
          user_type: 'member'
        }
      }

      post '/api/auth/register', params: register_params
      expect(response).to have_http_status(:created)
      
      register_response = JSON.parse(response.body)
      expect(register_response['success']).to be true
      expect(register_response['token']).to be_present

      # Step 2: Login with the same credentials
      post '/api/auth/login', params: { email: register_params[:user][:email], password: register_params[:user][:password] }
      expect(response).to have_http_status(:ok)
      
      login_response = JSON.parse(response.body)
      expect(login_response['success']).to be true
      expect(login_response['token']).to be_present

      # Step 3: Use the token to access protected endpoint
      token = login_response['token']
      get '/api/auth/me', headers: { 'Authorization' => "Bearer #{token}" }
      expect(response).to have_http_status(:ok)
      
      me_response = JSON.parse(response.body)
      expect(me_response['success']).to be true
      expect(me_response['user']['email']).to eq(register_params[:user][:email])

      # Step 4: Logout
      post '/api/auth/logout'
      expect(response).to have_http_status(:ok)
    end
  end
end 