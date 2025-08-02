class Api::ApplicationController < ApplicationController
  before_action :authenticate_user!
  before_action :set_default_format

  private

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
      render json: { error: 'Access denied. Librarian privileges required.' }, status: :forbidden
    end
  end
end 