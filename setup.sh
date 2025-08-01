#!/bin/bash

echo "🚀 Setting up Library Management System..."

# Install Ruby dependencies
echo "📦 Installing Ruby dependencies..."
bundle install

# Setup database
echo "🗄️  Setting up database..."
rails db:create
rails db:migrate
rails db:seed

# Install Node dependencies
echo "📦 Installing Node dependencies..."
cd client
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start the Rails server: rails server -p 3001"
echo "2. In another terminal, start the React app: cd client && npm start"
echo ""
echo "The Rails API will be available at http://localhost:3001"
echo "The React app will be available at http://localhost:3000" 