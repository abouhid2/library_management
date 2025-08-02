class Api::ApplicationController < ApplicationController
  before_action :authenticate_user!
  before_action :set_default_format

  private

  def authenticate_user!
    unless current_user
      render json: { error: "Authentication required" }, status: :unauthorized
    end
  end

  def current_user
    @current_user ||= User.find_by(id: decoded_token["user_id"]) if decoded_token
  rescue JWT::DecodeError => e
    Rails.logger.error "JWT Decode Error: #{e.message}"
    nil
  end

  def decoded_token
    return nil unless token

    @decoded_token ||= begin
      decoded = JWT.decode(token, Rails.application.credentials.secret_key_base, true, { algorithm: "HS256" })[0]
      Rails.logger.info "Decoded token: #{decoded}"
      decoded
    end
  rescue JWT::DecodeError => e
    Rails.logger.error "JWT Decode Error: #{e.message}"
    nil
  end

  def token
    auth_header = request.headers["Authorization"]
    Rails.logger.info "Auth header: #{auth_header}"
    auth_header&.split(" ")&.last
  end

  def set_default_format
    request.format = :json
  end

  def render_error(message, status = :unprocessable_entity)
    render json: { error: message }, status: status
  end

  def render_errors(errors, status = :unprocessable_entity)
    render json: { errors: errors }, status: status
  end

  def require_librarian
    unless current_user&.librarian?
      render json: { error: "Access denied. Librarian privileges required." }, status: :forbidden
    end
  end
end
