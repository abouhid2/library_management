class Api::AuthController < ApplicationController
  def login
    user = User.find_by(email: params[:email])

    if user&.valid_password?(params[:password])
      render json: {
        success: true,
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
      render json: {
        success: true,
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

  def me
    # For now, return a simple response since we're not implementing token-based auth yet
    render json: { success: false, message: "Not implemented yet" }, status: :not_implemented
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name, :user_type)
  end
end
