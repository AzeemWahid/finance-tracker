# Frontend

Vue 3 + TypeScript frontend with Tailwind CSS and PrimeVue.

## Features

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Vue Router** for navigation with route guards
- **Pinia** for state management
- **Tailwind CSS** for styling
- **PrimeVue** for UI components
- **Axios** for API requests with interceptors
- **Vitest** for unit testing

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your API URL:
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Lint and fix code
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API client and endpoints
│   ├── assets/           # Static assets and styles
│   ├── components/       # Reusable Vue components
│   ├── composables/      # Vue composables
│   ├── router/           # Vue Router configuration
│   ├── stores/           # Pinia stores
│   ├── types/            # TypeScript type definitions
│   ├── views/            # Page components
│   ├── App.vue           # Root component
│   └── main.ts           # Application entry point
├── index.html            # HTML template
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
├── vitest.config.ts      # Vitest configuration
└── package.json          # Dependencies and scripts
```

## Routes

- `/` - Home page
- `/login` - Login page (guest only)
- `/register` - Registration page (guest only)
- `/dashboard` - Dashboard (protected)
- `/profile` - User profile (protected)

## Authentication

The app uses JWT-based authentication with automatic token refresh:

1. Login/Register to receive access and refresh tokens
2. Tokens are stored in localStorage
3. Access token is automatically attached to API requests
4. When access token expires, refresh token is used to get new tokens
5. If refresh fails, user is redirected to login

## API Client

The Axios client (`src/api/client.ts`) includes:
- Automatic authorization header injection
- Token refresh on 401 errors
- Centralized error handling
- Request/response interceptors

## State Management

Pinia stores are used for:
- **Auth Store**: User authentication state and methods
- Add more stores as needed for your app

## UI Components

Using PrimeVue components:
- DataTable for data display
- Card for content containers
- Button for actions
- InputText, Password for forms
- Toast for notifications

Combined with Tailwind CSS for custom styling.

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_APP_NAME` - Application name

## License

MIT
