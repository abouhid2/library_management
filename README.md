# Library Management System

A full-stack library management system built with Ruby on Rails (backend) and React (frontend).

## Features

- **Authentication**: User registration and login with role-based access (Librarian/Member)
- **Book Management**: Add, edit, delete, and search books (Librarian only)
- **Borrowing System**: Members can borrow and return books
- **Dashboard**: Different dashboards for Librarians and Members
- **Responsive Design**: Modern UI built with Material-UI

## Tech Stack

### Backend

- Ruby on Rails 8.0.2 (API mode)
- SQLite database (for easy development setup)
- Devise for authentication
- Rack-CORS for cross-origin requests

### Frontend

- React 18
- Material-UI for styling
- Axios for API communication
- React Router for navigation

## Prerequisites

- Ruby 3.0+
- Node.js 16+
- Rails 8.0.2

## Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd library_management
./setup.sh
```

### 2. Start the Application

```bash
# Terminal 1: Start Rails server
rails server -p 3001

# Terminal 2: Start React app
cd client
npm start
```

That's it! Your application will be running at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Manual Setup (Alternative)

#### Install Ruby Dependencies

```bash
bundle install
```

#### Database Setup

The application uses SQLite for development, so no additional database setup is required!

```bash
rails db:create
rails db:migrate
rails db:seed
```

#### Start Rails Server

```bash
rails server -p 3001
```

The Rails API will be available at `http://localhost:3001`

### 3. Frontend Setup

#### Install Node Dependencies

```bash
cd client
npm install
```

#### Start React Development Server

```bash
npm start
```

The React app will be available at `http://localhost:3000`

## Starting the Application

After setup, you can start the application with these simple commands:

### Start Rails Server

```bash
rails server -p 3001
```

### Start React App (in a new terminal)

```bash
cd client
npm start
```

## Demo Credentials

### Librarian Account

- Email: `librarian@library.com`
- Password: `password123`

### Member Account

- Email: `member@library.com`
- Password: `password123`

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user info

### Books (Coming Soon)

- `GET /api/books` - List all books
- `POST /api/books` - Create new book
- `GET /api/books/:id` - Get book details
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Borrowings (Coming Soon)

- `GET /api/borrowings` - List borrowings
- `POST /api/borrowings` - Create borrowing
- `PUT /api/borrowings/:id/return` - Return book

## Project Structure

```
library_management/
├── app/
│   ├── controllers/
│   │   └── api/
│   │       └── auth_controller.rb
│   └── models/
│       └── user.rb
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   └── Dashboard.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.js
│   └── package.json
├── config/
│   ├── database.yml
│   ├── routes.rb
│   └── initializers/
│       └── cors.rb
└── README.md
```

## Development

### Testing Setup

The project uses RSpec for backend testing with the following setup:

- **RSpec**: Main testing framework
- **FactoryBot**: For creating test data
- **User Factory**: Includes traits for different user types (member/librarian)

#### Test Coverage

Currently implemented tests:

- ✅ API Authentication Controller (`spec/controllers/api/auth_controller_spec.rb`)
  - Login endpoint (valid/invalid credentials, missing parameters)
  - Register endpoint (valid/invalid parameters, validation errors)
  - User creation with different roles

#### Test Structure

```
spec/
├── controllers/
│   └── api/
│       └── auth_controller_spec.rb
├── factories/
│   └── users.rb
└── rails_helper.rb
```

### Running Tests

```bash
# Backend tests (RSpec)
bundle exec rspec                    # Run all tests
bundle exec rspec spec/controllers/  # Run controller tests only
bundle exec rspec spec/models/       # Run model tests only
bundle exec rspec --format documentation  # Run with detailed output

# Run specific test file
bundle exec rspec spec/controllers/api/auth_controller_spec.rb

# Frontend tests
cd client
npm test
```

### Database Reset

```bash
DB_USERNAME=library_user DB_PASSWORD=library_password rails db:reset
```

## Environment Variables

Create a `.env` file in the root directory:

```
DB_USERNAME=library_user
DB_PASSWORD=library_password
DB_HOST=localhost
DB_PORT=3306
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
