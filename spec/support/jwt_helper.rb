module JwtHelper
  def jwt_token_for(user)
    payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
    JWT.encode(payload, Rails.application.secret_key_base, 'HS256')
  end

  def auth_headers_for(user)
    { 'Authorization' => "Bearer #{jwt_token_for(user)}" }
  end
end

RSpec.configure do |config|
  config.include JwtHelper, type: :controller
  config.include JwtHelper, type: :request
end
