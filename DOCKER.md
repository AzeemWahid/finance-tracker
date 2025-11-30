# Docker Setup Guide

Complete Docker setup for Finance Tracker - run the entire stack with one command!

## Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop/))
- Docker Compose (included with Docker Desktop)

## Quick Start

### Production Build (Recommended for Testing)

Run the entire application stack:

```bash
docker-compose up
```

This starts:
- ✅ PostgreSQL database on port 5432
- ✅ Backend API on port 3000
- ✅ Frontend on port 80

Access the app at: **http://localhost**

### Development Mode (with Hot Reload)

For active development with code changes reflected instantly:

```bash
docker-compose -f docker-compose.dev.yml up
```

Note: Frontend still needs to run locally with `npm run dev` for hot reload.

## Docker Commands

### Start Services

```bash
# Start all services
docker-compose up

# Start in background (detached mode)
docker-compose up -d

# Start and rebuild images
docker-compose up --build

# Start specific service
docker-compose up postgres backend
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v

# Stop without removing containers
docker-compose stop
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Database Management

```bash
# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d financetrackerdb

# Run migrations (if needed)
docker-compose exec backend npm run db:migrate

# View database data
docker-compose exec postgres psql -U postgres -d financetrackerdb -c "SELECT * FROM users;"
```

### Rebuild Services

```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Rebuild and restart
docker-compose up --build
```

## Architecture

### Production Stack (`docker-compose.yml`)

```
┌─────────────────────┐
│  Browser :80        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Nginx (Frontend)   │
│  - Serves static    │
│  - Production build │
└─────────────────────┘

┌─────────────────────┐
│  Backend :3000      │
│  - Node.js API      │
│  - Built TypeScript │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  PostgreSQL :5432   │
│  - Database         │
└─────────────────────┘
```

## Environment Variables

### Production

Environment variables are set in `docker-compose.yml`. To customize:

```yaml
services:
  backend:
    environment:
      JWT_SECRET: your-secret-here
      DB_PASSWORD: your-password-here
```

### For VM Deployment

Use environment variables or `.env` file:

```bash
# Create .env file
cat > .env <<EOF
JWT_SECRET=production-secret-key
JWT_REFRESH_SECRET=production-refresh-key
DB_PASSWORD=strong-password
EOF

# Use with docker-compose
docker-compose --env-file .env up -d
```

## Troubleshooting

### Port Already in Use

If ports are busy:

```bash
# Check what's using the port
netstat -ano | findstr :80
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Stop local services first
# Then run Docker
docker-compose up
```

### Database Connection Failed

```bash
# Check if PostgreSQL is healthy
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Restart services
docker-compose restart
```

### Backend Not Starting

```bash
# Check logs
docker-compose logs backend

# Rebuild backend
docker-compose build backend
docker-compose up backend
```

### Frontend Shows Blank Page

```bash
# Check if frontend built correctly
docker-compose logs frontend

# Rebuild frontend
docker-compose build frontend
docker-compose up frontend
```

## Testing with Docker

### Run Backend Tests

```bash
# Start only database
docker-compose up -d postgres

# Run tests
cd backend && npm test
```

### CI/CD with Docker

The Dockerfiles are optimized for CI/CD:

```yaml
# GitHub Actions example
- name: Build and test
  run: |
    docker-compose build
    docker-compose up -d postgres
    docker-compose exec -T backend npm test
```

## Production Deployment

### Build Production Images

```bash
# Build optimized images
docker-compose build --no-cache

# Tag for registry
docker tag finance-tracker-backend:latest your-registry/backend:v1.0.0
docker tag finance-tracker-frontend:latest your-registry/frontend:v1.0.0

# Push to registry
docker push your-registry/backend:v1.0.0
docker push your-registry/frontend:v1.0.0
```

### Deploy to VM

```bash
# On your VM
docker-compose pull
docker-compose up -d

# Or use the deploy script (we'll create this)
```

## Volumes

### PostgreSQL Data

Data is persisted in a Docker volume:

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect claudetest_postgres_data

# Backup database
docker-compose exec postgres pg_dump -U postgres financetrackerdb > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres financetrackerdb < backup.sql
```

### Remove All Data

```bash
# ⚠️ This deletes all database data!
docker-compose down -v
```

## Performance Optimization

### Multi-stage Builds

Both Dockerfiles use multi-stage builds:
- Smaller images (Node.js build tools not included in final image)
- Faster deployments
- Better security (no dev dependencies)

### Caching

Docker caches layers. To optimize builds:

```bash
# Copy package.json first (cached if not changed)
COPY package*.json ./
RUN npm ci

# Then copy source code (changes frequently)
COPY . .
```

## Security

### Non-root User

Backend runs as non-root user `nodejs`:

```dockerfile
USER nodejs
```

### Health Checks

All services have health checks:

```yaml
healthcheck:
  test: ["CMD-SHELL", "wget --spider http://localhost/"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### Secrets Management

**Never commit secrets!** Use:
- Environment variables
- Docker secrets
- `.env` files (add to `.gitignore`)

## Next Steps

1. ✅ Test locally: `docker-compose up`
2. ✅ Create GitHub CI workflows
3. ✅ Deploy to VM with Docker Compose
4. ✅ Set up automated deployments

---

**Need help?** Check logs with `docker-compose logs -f`
