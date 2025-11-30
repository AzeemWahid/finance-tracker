# Backend API

Express.js + TypeScript backend with PostgreSQL and stored procedures.

## Features

- **Authentication**: JWT-based authentication with access and refresh tokens
- **Database**: PostgreSQL with stored procedures for all data operations
- **Security**: Helmet, CORS, password hashing with bcrypt
- **Validation**: Request validation using express-validator
- **Testing**: Jest with supertest for unit and integration tests
- **Code Quality**: ESLint and Prettier for consistent code style
- **TypeScript**: Full type safety across the application

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- Database credentials
- JWT secrets (use strong random strings in production)
- CORS origin
- Other settings as needed

### 3. Database Setup

Ensure PostgreSQL is running, then create the database:

```bash
createdb appdb
```

Run migrations to set up tables and stored procedures:

```bash
npm run build
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on http://localhost:3000 (or your configured PORT).

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run db:migrate` - Run database migrations

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token

### Users (Protected)

- `GET /api/v1/users` - Get all users (paginated)
- `GET /api/v1/users/me` - Get current user
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Health Check

- `GET /api/v1/health` - Server health check

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── server.ts        # Main application entry
├── sql/
│   ├── migrations/      # Database schema migrations
│   └── procedures/      # Stored procedures
├── tests/               # Test files
├── .env.example         # Example environment variables
├── .eslintrc.json       # ESLint configuration
├── .prettierrc          # Prettier configuration
├── jest.config.js       # Jest configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Database Stored Procedures

All database operations use stored procedures for better performance and security:

- `sp_create_user` - Create new user
- `sp_get_user_by_email` - Get user by email (for login)
- `sp_get_user_by_id` - Get user by ID
- `sp_get_all_users` - Get all users with pagination
- `sp_update_user` - Update user information
- `sp_delete_user` - Delete user
- `sp_email_exists` - Check if email is already registered
- `sp_username_exists` - Check if username is already taken

## Authentication Flow

1. **Register**: User registers with email, username, and password
2. **Login**: User logs in with email and password, receives access and refresh tokens
3. **Protected Routes**: Access token must be included in Authorization header as Bearer token
4. **Token Refresh**: When access token expires, use refresh token to get new tokens

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Helmet for security headers
- CORS configuration
- Input validation and sanitization
- SQL injection protection via parameterized queries
- Environment variable management

## Testing

Run the test suite:

```bash
npm test
```

Tests include:
- Authentication endpoints
- User CRUD operations
- Token validation
- Error handling

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables

3. Run database migrations on production database

4. Start the server:
   ```bash
   npm start
   ```

## License

MIT
