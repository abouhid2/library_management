#!/bin/bash

echo "🚀 Setting up Library Management System..."

# Install Ruby dependencies
echo "📦 Installing Ruby dependencies..."
bundle install

# Ensure Rails is available via bundler
echo "🔧 Setting up Rails via bundler..."

# Check if critical config files exist, create if missing
echo "⚙️  Checking configuration files..."
if [ ! -f "config/database.yml" ]; then
    echo "Creating config/database.yml..."
    cat > config/database.yml << 'EOF'
default: &default
  adapter: sqlite3
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  timeout: 5000

development:
  <<: *default
  database: db/development.sqlite3

test:
  <<: *default
  database: db/test.sqlite3

production:
  <<: *default
  database: db/production.sqlite3
EOF
fi

if [ ! -f "config/application.yml" ]; then
    echo "Creating config/application.yml..."
    cat > config/application.yml << 'EOF'
# Application configuration
DATABASE_URL: "sqlite3:db/development.sqlite3"
RAILS_ENV: "development"
SECRET_KEY_BASE: ""
APP_NAME: "Library Management System"
APP_HOST: "localhost"
APP_PORT: "3001"
API_VERSION: "v1"
CORS_ORIGINS: "http://localhost:3000"
DEVISE_SECRET_KEY: ""
JWT_SECRET_KEY: ""
EOF
fi

# Setup database
echo "🗄️  Setting up database..."
bundle exec rails db:create db:migrate db:seed


# Install Node dependencies
echo "📦 Installing Node dependencies..."
cd client
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start the Rails server: bundle exec rails server -p 3001"
echo "2. In another terminal, start the React app: cd client && npm start"
echo ""
echo "The Rails API will be available at http://localhost:3001"
echo "The React app will be available at http://localhost:3000" 