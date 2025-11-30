# Finance Tracker

A modern full-stack web application built with Vue 3, Express, TypeScript, and PostgreSQL.

## Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **PrimeVue** - Rich UI component library
- **Pinia** - State management
- **Vue Router** - Official router for Vue.js
- **Axios** - HTTP client

### Backend
- **Express.js** - Web framework for Node.js
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Relational database
- **Stored Procedures** - Database logic
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing

### Testing
- **Jest** - Backend unit testing
- **Vitest** - Frontend unit testing
- **Playwright** - E2E testing

### DevOps
- **GitHub Actions** - CI/CD pipelines
- **Nginx** - Web server and reverse proxy
- **Systemd** - Service management
- **Let's Encrypt** - SSL certificates

## Features

✅ **User Authentication**
- Registration with email validation
- Login with JWT tokens
- Automatic token refresh
- Protected routes

✅ **User Management**
- View all users with pagination
- Update user profile
- Delete users
- User statistics dashboard

✅ **Security**
- Password hashing with bcrypt
- JWT-based authentication
- CORS protection
- Helmet security headers
- SQL injection protection via stored procedures
- Input validation and sanitization

✅ **Developer Experience**
- Full TypeScript support
- Hot module replacement
- ESLint + Prettier
- Automated testing
- CI/CD workflows

## Project Structure

```
finance-tracker/
├── backend/               # Express TypeScript API
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   ├── sql/
│   │   ├── migrations/   # Database migrations
│   │   └── procedures/   # Stored procedures
│   └── tests/            # Backend tests
│
├── frontend/             # Vue 3 TypeScript SPA
│   ├── src/
│   │   ├── api/          # API client
│   │   ├── assets/       # Static assets
│   │   ├── components/   # Vue components
│   │   ├── router/       # Vue Router config
│   │   ├── stores/       # Pinia stores
│   │   ├── types/        # TypeScript types
│   │   └── views/        # Page components
│   └── tests/            # Frontend tests
│
├── e2e/                  # End-to-end tests
│   └── tests/            # Playwright tests
│
└── deployment/           # Deployment scripts
    ├── backend/          # Backend deployment
    ├── frontend/         # Frontend deployment
    ├── nginx/            # Nginx configuration
    └── systemd/          # Systemd service files
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd finance-tracker
```

### 2. Set Up Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DB_NAME=financetrackerdb
# DB_USER=postgres
# DB_PASSWORD=your_password

# Create PostgreSQL database
createdb financetrackerdb
# OR use pgAdmin to create the database

# Run migrations
npm run build
npm run db:migrate

# Start development server
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Run E2E Tests (Optional)

```bash
cd e2e

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run tests
npm test
```

## Development

### Backend Commands

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build TypeScript
npm start            # Start production server
npm test             # Run tests
npm run lint         # Lint code
npm run format       # Format code
npm run db:migrate   # Run database migrations
```

### Frontend Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm test             # Run unit tests
npm run lint         # Lint code
npm run format       # Format code
```

### E2E Testing Commands

```bash
npm test             # Run all E2E tests
npm run test:ui      # Run with interactive UI
npm run test:headed  # Run in headed mode
npm run codegen      # Generate tests interactively
```

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

### Health
- `GET /api/v1/health` - Server health check

## Database Schema

### Users Table
- `id` - UUID (Primary Key)
- `email` - VARCHAR(255) (Unique)
- `username` - VARCHAR(100) (Unique)
- `password_hash` - VARCHAR(255)
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

### Stored Procedures
- `sp_create_user` - Create new user
- `sp_get_user_by_email` - Get user for authentication
- `sp_get_user_by_id` - Get user by ID
- `sp_get_all_users` - Get all users with pagination
- `sp_update_user` - Update user information
- `sp_delete_user` - Delete user
- `sp_email_exists` - Check email availability
- `sp_username_exists` - Check username availability

## Deployment

See [deployment/DEPLOYMENT_GUIDE.md](deployment/DEPLOYMENT_GUIDE.md) for complete deployment instructions.

### Quick Deploy to VM

```bash
# On your VM
cd deployment
chmod +x setup-vm.sh
./setup-vm.sh

# Update repo URLs in deploy scripts
# Then deploy
cd backend && ./deploy.sh
cd ../frontend && ./deploy.sh
```

### CI/CD

GitHub Actions workflows are included for:
- **CI**: Lint, test, and build on every push
- **CD**: Deploy to VM on push to main branch

Set these secrets in your GitHub repository:
- `VM_HOST` - Your VM IP/domain
- `VM_USER` - SSH username
- `VM_SSH_KEY` - SSH private key

## Testing

### Unit Tests

**Backend:**
```bash
cd backend
npm test
npm run test:coverage
```

**Frontend:**
```bash
cd frontend
npm test
npm run test:coverage
```

### E2E Tests

```bash
cd e2e
npm test
npm run test:ui
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=financetrackerdb
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Finance Tracker
```

## Security Considerations

1. **Change JWT secrets** in production (use `openssl rand -base64 32`)
2. **Use strong database passwords**
3. **Enable HTTPS** with Let's Encrypt
4. **Set up firewall rules**
5. **Keep dependencies updated**
6. **Regular database backups**
7. **Monitor application logs**

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Built with ❤️ using modern web technologies**
