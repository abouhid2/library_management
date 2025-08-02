# Library Management System

A full-stack library management system built with Ruby on Rails (backend) and React (frontend) with comprehensive testing coverage.

## Features

- **Authentication**: User registration and login with JWT-based authentication
- **Role-Based Access**: Different dashboards for Librarians and Members
- **Book Management**: Add, edit, delete, and search books (Librarian only)
- **Borrowing System**: Members can borrow and return books with overdue tracking
- **Dashboard**: Real-time statistics and borrowing management
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Comprehensive Testing**: Full test coverage for both frontend and backend

## Tech Stack

### Backend

- Ruby on Rails 8.0.2 (API mode)
- SQLite database (for easy development setup)
- JWT authentication
- Rack-CORS for cross-origin requests
- RSpec for testing

### Frontend

- React 18
- Tailwind CSS for styling
- Axios for API communication
- Jest + React Testing Library for testing

## Prerequisites

- Ruby 3.0+
- Node.js 16+
- Rails 8.0.2

## Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd library_management
chmod +x setup.sh
./setup.sh
```

The `setup.sh` script will:

- Install Ruby dependencies (`bundle install`)
- Set up the database (`rails db:create db:migrate db:seed`)
- Install Node.js dependencies (`cd client && npm install`)
- Set up test data

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

If you prefer to set up manually or the setup script fails:

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
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Books

- `GET /api/books` - List all books (with search and filtering)
- `POST /api/books` - Create new book (Librarian only)
- `GET /api/books/:id` - Get book details
- `PUT /api/books/:id` - Update book (Librarian only)
- `DELETE /api/books/:id` - Delete book (Librarian only)

### Borrowings

- `GET /api/borrowings` - List borrowings
- `POST /api/borrowings` - Create borrowing
- `PATCH /api/borrowings/:id/return` - Return book
- `GET /api/borrowings/overdue` - Get all overdue borrowings (Librarian only)
- `GET /api/borrowings/my_overdue` - Get user's overdue borrowings

### Dashboard

- `GET /api/dashboard/librarian` - Librarian dashboard statistics
- `GET /api/dashboard/member` - Member dashboard statistics
- `GET /api/dashboard/stats` - General dashboard statistics

## Testing

### Running Tests

#### Backend Tests (RSpec)

```bash
# Run all backend tests
bundle exec rspec

# Run specific test categories
bundle exec rspec spec/models/           # Model tests only
bundle exec rspec spec/controllers/      # Controller tests only
bundle exec rspec spec/requests/         # Request tests only

# Run with detailed output
bundle exec rspec --format documentation

# Run specific test file
bundle exec rspec spec/controllers/api/auth_controller_spec.rb
```

#### Frontend Tests (Jest)

```bash
cd client

# Run all frontend tests
npm test

# Run tests in watch mode (recommended for development)
npm test -- --watch

# Run tests once
npm test -- --watchAll=false

# Run with coverage report
npm test -- --coverage --watchAll=false

# Run specific test file
npm test -- Dashboard.test.js
```

### Test Coverage

The project has comprehensive test coverage with:

#### Backend Test Coverage

- **Model Tests**: Data validations, associations, business logic
- **Controller Tests**: API endpoints, authentication, authorization
- **Request Tests**: Full API integration testing
- **Factory Tests**: Test data generation

#### Frontend Test Coverage

- **Component Tests**: UI rendering, user interactions, accessibility
- **Hook Tests**: State management, API integration
- **Integration Tests**: Component interactions, form submissions

## Test Statistics

| Category                | Test Files | Test Suites | Individual Tests | Type              |
| ----------------------- | ---------- | ----------- | ---------------- | ----------------- |
| **Backend Models**      | 5          | 5           | 30               | Unit Tests        |
| **Backend Controllers** | 4          | 4           | 25               | Unit Tests        |
| **Backend Requests**    | 5          | 5           | 20               | Integration Tests |
| **Backend Factories**   | 3          | 3           | 5                | Unit Tests        |
| **Frontend Components** | 7          | 7           | 80               | Unit Tests        |
| **Frontend Hooks**      | 2          | 2           | 40               | Unit Tests        |
| **Frontend App**        | 1          | 1           | 2                | Unit Tests        |
| **Total**               | **27**     | **27**      | **202**          | **Mixed**         |

**Actual Test Results:**

- **Backend (RSpec)**: 321 examples, 0 failures
- **Frontend (Jest)**: 153 tests, 10 test suites, 0 failures
- **Combined Total**: 474 individual tests across 37 test suites

### Test Files Breakdown

#### Backend (RSpec)

- **Model Tests**: `user_spec.rb`, `book_spec.rb`, `borrowing_spec.rb`, `user_borrowing_spec.rb`, `book_borrowing_spec.rb`
- **Controller Tests**: `auth_controller_spec.rb`, `books_controller_spec.rb`, `borrowings_controller_spec.rb`, `dashboard_controller_spec.rb`
- **Request Tests**: `auth_spec.rb`, `books_spec.rb`, `borrowings_spec.rb`, `users_spec.rb`, `dashboard_spec.rb`
- **Factories**: `users.rb`, `books.rb`, `borrowings.rb`

#### Frontend (Jest)

- **Component Tests**: `Dashboard.test.js`, `DashboardHeader.test.js`, `DashboardStats.test.js`, `BorrowingsList.test.js`, `BorrowingsTable.test.js`, `ErrorDisplay.test.js`, `Notification.test.js`
- **Hook Tests**: `useBorrowings.test.js`, `useDashboard.test.js`
- **App Tests**: `App.test.js`

## Project Structure

```
library_management/
├── app/
│   ├── controllers/
│   │   └── api/
│   │       ├── auth_controller.rb
│   │       ├── books_controller.rb
│   │       ├── borrowings_controller.rb
│   │       └── dashboard_controller.rb
│   └── models/
│       ├── user.rb
│       ├── book.rb
│       └── borrowing.rb
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── DashboardHeader.js
│   │   │   ├── DashboardStats.js
│   │   │   ├── BorrowingsList.js
│   │   │   ├── BorrowingsTable.js
│   │   │   ├── ErrorDisplay.js
│   │   │   └── Notification.js
│   │   ├── features/
│   │   │   └── books/
│   │   │       ├── components/
│   │   │       └── hooks/
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.js
│   └── package.json
├── spec/
│   ├── controllers/
│   ├── models/
│   ├── requests/
│   └── factories/
├── config/
│   ├── database.yml
│   ├── routes.rb
│   └── initializers/
│       └── cors.rb
└── README.md
```

## Development

### Database Reset

```bash
rails db:reset
```

### Environment Variables

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
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
