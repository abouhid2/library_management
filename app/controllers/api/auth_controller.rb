class Api::AuthController < Api::ApplicationController
  skip_before_action :authenticate_user!, only: [ :login, :register, :logout ]

  def login
    email = params[:email]&.strip&.downcase
    user = User.find_by("LOWER(email) = ?", email) if email.present?

    if user&.valid_password?(params[:password])
      token = generate_token(user)

      render json: {
        success: true,
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          user_type: user.user_type
        }
      }
    else
      render json: { success: false, message: "Invalid email or password" }, status: :unauthorized
    end
  end

  def register
    user = User.new(user_params)

    if user.save
      token = generate_token(user)

      render json: {
        success: true,
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          user_type: user.user_type
        }
      }, status: :created
    else
      render json: { success: false, errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def logout
    # With JWT, logout is handled client-side by removing the token
    render json: { success: true, message: "Successfully logged out" }
  end

  def me
    if current_user
      render json: {
        success: true,
        user: {
          id: current_user.id,
          email: current_user.email,
          name: current_user.name,
          user_type: current_user.user_type
        }
      }
    else
      render json: { success: false, message: "Not authenticated" }, status: :unauthorized
    end
  end

  private

  def generate_token(user)
    payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
    JWT.encode(payload, Rails.application.secret_key_base, "HS256")
  end

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name, :user_type)
  end
end
