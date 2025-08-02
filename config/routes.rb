Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # API routes
  namespace :api do
    post "auth/login", to: "auth#login"
    post "auth/register", to: "auth#register"
    post "auth/logout", to: "auth#logout"
    get "auth/me", to: "auth#me"

    resources :books
    resources :borrowings do
      member do
        patch :return
      end
      collection do
        get :overdue
        get :my_overdue
      end
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
