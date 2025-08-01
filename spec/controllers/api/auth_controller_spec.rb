require 'rails_helper'

RSpec.describe Api::AuthController, type: :controller do
  describe 'POST #login' do
    let(:valid_user) { create(:user, email: 'test@example.com', password: 'password123', name: 'Test User', user_type: 'member') }
    
    context 'with valid credentials' do
      it 'returns success response with user data' do
        post :login, params: { email: valid_user.email, password: 'password123' }
        
        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        
        expect(json_response['success']).to be true
        expect(json_response['user']['id']).to eq(valid_user.id)
        expect(json_response['user']['email']).to eq(valid_user.email)
        expect(json_response['user']['name']).to eq(valid_user.name)
        expect(json_response['user']['user_type']).to eq(valid_user.user_type)
      end
    end
    
    context 'with invalid email' do
      it 'returns unauthorized status with error message' do
        post :login, params: { email: 'nonexistent@example.com', password: 'password123' }
        
        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)
        
        expect(json_response['success']).to be false
        expect(json_response['message']).to eq('Invalid email or password')
      end
    end
    
    context 'with invalid password' do
      it 'returns unauthorized status with error message' do
        post :login, params: { email: valid_user.email, password: 'wrongpassword' }
        
        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)
        
        expect(json_response['success']).to be false
        expect(json_response['message']).to eq('Invalid email or password')
      end
    end
    
    context 'with missing email' do
      it 'returns unauthorized status with error message' do
        post :login, params: { password: 'password123' }
        
        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)
        
        expect(json_response['success']).to be false
        expect(json_response['message']).to eq('Invalid email or password')
      end
    end
    
    context 'with missing password' do
      it 'returns unauthorized status with error message' do
        post :login, params: { email: valid_user.email }
        
        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)
        
        expect(json_response['success']).to be false
        expect(json_response['message']).to eq('Invalid email or password')
      end
    end
  end

  describe 'POST #register' do
    let(:valid_params) do
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
    
    context 'with valid parameters' do
      it 'creates a new user and returns success response' do
        expect {
          post :register, params: valid_params
        }.to change(User, :count).by(1)
        
        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)
        
        expect(json_response['success']).to be true
        expect(json_response['user']['email']).to eq('newuser@example.com')
        expect(json_response['user']['name']).to eq('New User')
        expect(json_response['user']['user_type']).to eq('member')
        expect(json_response['user']['id']).to be_present
      end
      
      it 'creates a librarian user successfully' do
        librarian_params = valid_params.deep_dup
        librarian_params[:user][:user_type] = 'librarian'
        librarian_params[:user][:email] = 'librarian@example.com'
        
        post :register, params: librarian_params
        
        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)
        
        expect(json_response['success']).to be true
        expect(json_response['user']['user_type']).to eq('librarian')
      end
    end
    
    context 'with invalid parameters' do
      it 'returns unprocessable entity status with validation errors' do
        invalid_params = valid_params.deep_dup
        invalid_params[:user][:email] = ''
        invalid_params[:user][:password] = ''
        
        post :register, params: invalid_params
        
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        
        expect(json_response['success']).to be false
        expect(json_response['errors']).to include("Email can't be blank")
        expect(json_response['errors']).to include("Password can't be blank")
      end
      
      it 'returns error for duplicate email' do
        create(:user, email: 'existing@example.com')
        
        duplicate_params = valid_params.deep_dup
        duplicate_params[:user][:email] = 'existing@example.com'
        
        post :register, params: duplicate_params
        
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        
        expect(json_response['success']).to be false
        expect(json_response['errors']).to include('Email has already been taken')
      end
      
      it 'returns error for password confirmation mismatch' do
        mismatch_params = valid_params.deep_dup
        mismatch_params[:user][:password_confirmation] = 'differentpassword'
        
        post :register, params: mismatch_params
        
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        
        expect(json_response['success']).to be false
        expect(json_response['errors']).to include("Password confirmation doesn't match Password")
      end
      
      it 'raises ArgumentError for invalid user_type' do
        invalid_type_params = valid_params.deep_dup
        invalid_type_params[:user][:user_type] = 'invalid_type'
        
        expect {
          post :register, params: invalid_type_params
        }.to raise_error(ArgumentError, "'invalid_type' is not a valid user_type")
      end
      
      it 'returns error for missing name' do
        no_name_params = valid_params.deep_dup
        no_name_params[:user][:name] = ''
        
        post :register, params: no_name_params
        
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        
        expect(json_response['success']).to be false
        expect(json_response['errors']).to include("Name can't be blank")
      end
    end
    
    context 'with missing user parameters' do
      it 'raises ActionController::ParameterMissing error' do
        expect {
          post :register, params: {}
        }.to raise_error(ActionController::ParameterMissing)
      end
    end
  end
end 