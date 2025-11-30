# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Finance Tracker is a full-stack web application with separate backend (Express/TypeScript/PostgreSQL) and frontend (Vue 3/TypeScript) services.

## Quick Commands

### Development Workflow

**Backend** (runs on port 3000):
```bash
cd backend
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm test             # Run Jest tests
npm run db:migrate   # Run database migrations
```

**Frontend** (runs on port 5173, sometimes 5174 if 5173 is in use):
```bash
cd frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production (runs vue-tsc then vite build)
npm test             # Run Vitest tests
npm run test:ui      # Run Vitest with UI
```

**E2E Tests**:
```bash
cd e2e
npm test             # Run all Playwright tests
npm run test:headed  # Run with visible browser
npm run test:ui      # Run with Playwright UI
```

**Quick Start Scripts** (from root):
- `setup-database.bat` - Windows batch script to create database
- `start-dev.bat` - Windows batch script to start both backend and frontend

### Running Single Tests

**Backend**:
```bash
npm test -- path/to/test.test.ts
npm test -- --testNamePattern="test name"
```

**Frontend**:
```bash
npm test -- path/to/test.spec.ts
npm test -- -t "test name"
```

## Architecture Patterns

### Backend Architecture

**Database Layer**: PostgreSQL with stored procedures
- All database operations go through stored procedures in `backend/sql/procedures/`
- Migrations are in `backend/sql/migrations/`
- Stored procedures provide SQL injection protection and encapsulation
- Example procedure naming: `sp_create_user`, `sp_get_user_by_email`, `sp_get_all_users`

**Controller Pattern**: Controllers in `backend/src/controllers/` use `.controller.ts` suffix
- Controllers call stored procedures via db.query()
- Controllers handle request/response logic only
- Example: `auth.controller.ts`, `user.controller.ts`

**Middleware Pattern**:
- `auth.middleware.ts` - JWT authentication using `req.user` pattern
- `validate.middleware.ts` - Request validation
- `error.middleware.ts` - Centralized error handling
- Middleware uses `.middleware.ts` suffix

**Authentication Flow**:
- JWT-based with access tokens (15min) and refresh tokens (7days)
- Tokens generated in `utils/jwt.ts`
- Frontend stores tokens in localStorage
- Automatic token refresh on 401 via axios interceptor (frontend/src/api/client.ts)

**Routes**: Located in `backend/src/routes/`
- All routes prefixed with `/api/v1`
- Protected routes use `authenticate` middleware

### Frontend Architecture

**API Client Pattern**: Single axios instance in `frontend/src/api/client.ts`
- Interceptors automatically add Bearer tokens from localStorage
- Automatic token refresh on 401 responses
- All API modules in `frontend/src/api/` import this client

**State Management**: Pinia stores in `frontend/src/stores/`
- `auth.ts` - Authentication state, user data, login/register/logout
- Stores use Composition API pattern with `defineStore`

**Router Guards**: `frontend/src/router/index.ts`
- `requiresAuth` meta - redirects to login if not authenticated
- `requiresGuest` meta - redirects to dashboard if authenticated
- Guards check `authStore.isAuthenticated` and call `initializeAuth()` if needed

**Component Structure**:
- `frontend/src/views/` - Page-level components (LoginView, DashboardView, etc.)
- `frontend/src/components/` - Reusable components
- Uses PrimeVue for UI components (Button, Card, Toast, etc.)
- Tailwind CSS for styling

**Environment Variables**:
- Backend: `.env` in backend/ (DB credentials, JWT secrets, CORS)
- Frontend: `.env` in frontend/ (VITE_API_BASE_URL, VITE_APP_NAME)

## Database

**Connection**: Uses `pg` library, connection in `backend/src/config/database.ts`

**Schema**:
- Main table: `users` (id UUID, email, username, password_hash, timestamps)
- All user operations via stored procedures

**Adding New Stored Procedures**:
1. Create SQL file in `backend/sql/procedures/`
2. Run `npm run db:migrate` to apply
3. Call from controller using: `await db.query('SELECT * FROM sp_procedure_name($1, $2)', [param1, param2])`

## Testing Strategy

**Backend Tests**: Jest with supertest
- API integration tests hitting actual endpoints
- Tests should start the Express app and test HTTP requests
- Mock database calls if needed

**Frontend Tests**: Vitest with Vue Test Utils
- Component unit tests
- Use `happy-dom` environment

**E2E Tests**: Playwright
- Full user flows (registration, login, dashboard navigation)
- Tests expect backend on port 3000, frontend on port 5173

## Common Issues

**Port Conflicts**: Frontend may run on 5174 instead of 5173 if port is in use

**Database Connection**: Ensure PostgreSQL is running and `financetrackerdb` exists

**Token Expiry**: Frontend automatically refreshes tokens; if refresh fails, redirects to /login

**CORS**: Backend CORS_ORIGIN must match frontend URL (default: http://localhost:5173)

## Adding New Features

**New API Endpoint**:
1. Create stored procedure in `backend/sql/procedures/`
2. Run `npm run db:migrate`
3. Create controller in `backend/src/controllers/`
4. Add route in `backend/src/routes/`
5. Test with curl or Postman
6. Create frontend API method in `frontend/src/api/`
7. Call from component/store

**New Frontend Page**:
1. Create view in `frontend/src/views/`
2. Add route in `frontend/src/router/index.ts`
3. Set `meta: { requiresAuth: true }` if login required
4. Update navigation in relevant components
