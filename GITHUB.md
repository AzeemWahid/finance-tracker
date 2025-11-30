# GitHub Setup Guide

This guide explains how to set up GitHub repositories and CI/CD workflows for the Finance Tracker application.

## Repository Structure

This project uses a **monorepo approach** with separate GitHub Actions workflows for backend and frontend. Both components live in the same repository but have independent CI/CD pipelines.

## Initial Setup

### 1. Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `finance-tracker`)
3. Choose visibility (Public or Private)
4. **Do NOT initialize with README** (we already have code)
5. Click "Create repository"

### 2. Initialize Git in Project Root

```bash
cd C:\Users\azeem\OneDrive\Desktop\claudetest

# Initialize git repository
git init

# Create .gitignore if not present
```

### 3. Create Root .gitignore

Create a `.gitignore` file in the project root:

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Docker
*.pid
*.seed
*.pid.lock

# Test coverage
coverage/
.nyc_output/

# Playwright
test-results/
playwright-report/
playwright/.cache/
```

### 4. Copy Workflows to Root

Since we're using a monorepo, we need to move the workflow files to the root `.github` directory:

```bash
# Create root .github/workflows directory
mkdir -p .github/workflows

# Copy backend workflow
copy backend\.github\workflows\ci.yml .github\workflows\backend-ci.yml

# Copy frontend workflow
copy frontend\.github\workflows\ci.yml .github\workflows\frontend-ci.yml

# Copy deployment templates
copy backend\.github\workflows\deploy.yml.template .github\workflows\backend-deploy.yml.template
copy frontend\.github\workflows\deploy.yml.template .github\workflows\frontend-deploy.yml.template
```

### 5. Update Workflow Paths

After copying, you need to update the workflows to work from the root directory.

#### Update `.github/workflows/backend-ci.yml`:

Change the working directory for all steps:

```yaml
name: Backend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'backend/**'

defaults:
  run:
    working-directory: backend

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: financetrackerdb
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Build TypeScript
        run: npm run build

      - name: Run database migrations
        env:
          DB_HOST: localhost
          DB_PORT: 5432
          DB_NAME: financetrackerdb
          DB_USER: postgres
          DB_PASSWORD: postgres
          NODE_ENV: test
        run: npm run db:migrate

      - name: Run tests
        env:
          DB_HOST: localhost
          DB_PORT: 5432
          DB_NAME: financetrackerdb
          DB_USER: postgres
          DB_PASSWORD: postgres
          JWT_SECRET: test-secret
          JWT_REFRESH_SECRET: test-refresh-secret
          NODE_ENV: test
        run: npm test

  build-docker:
    runs-on: ubuntu-latest
    needs: lint-and-test

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile
          push: false
          tags: finance-tracker-backend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

#### Update `.github/workflows/frontend-ci.yml`:

```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'frontend/**'
      - '.github/workflows/frontend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'frontend/**'

defaults:
  run:
    working-directory: frontend

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Lint code
        run: npm run lint

      - name: Type check
        run: npm run build -- --mode development

      - name: Build production
        run: npm run build

  build-docker:
    runs-on: ubuntu-latest
    needs: lint-and-test

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          file: ./frontend/Dockerfile
          push: false
          tags: finance-tracker-frontend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### 6. Initial Commit and Push

```bash
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Finance Tracker with CI/CD workflows"

# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/finance-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## CI/CD Workflows

### Backend CI (`backend-ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches (only when backend files change)
- Pull requests to `main` or `develop` (only when backend files change)

**Jobs:**
1. **lint-and-test**:
   - Sets up PostgreSQL service container
   - Installs dependencies
   - Runs ESLint
   - Builds TypeScript
   - Runs database migrations
   - Runs tests

2. **build-docker**:
   - Builds Docker image (doesn't push)
   - Uses GitHub Actions cache for faster builds
   - Only runs if tests pass

### Frontend CI (`frontend-ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches (only when frontend files change)
- Pull requests to `main` or `develop` (only when frontend files change)

**Jobs:**
1. **lint-and-test**:
   - Installs dependencies
   - Runs ESLint
   - Type checks with TypeScript
   - Builds production bundle

2. **build-docker**:
   - Builds Docker image with Nginx
   - Uses GitHub Actions cache
   - Only runs if lint/build passes

### Viewing Workflow Results

1. Go to your repository on GitHub
2. Click the "Actions" tab
3. See all workflow runs and their status
4. Click on a run to see detailed logs

## Deployment Setup (When Ready)

When you have a VM ready for deployment:

### 1. Prepare Your VM

```bash
# SSH into your VM
ssh user@your-vm-ip

# Create deployment directories
mkdir -p ~/deployment/backend
mkdir -p ~/deployment/frontend

# Create deploy.sh scripts (see deployment section below)
```

### 2. Add GitHub Secrets

1. Go to your repository on GitHub
2. Click Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add these secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VM_HOST` | Your VM's IP address or hostname | `192.168.1.100` or `myvm.example.com` |
| `VM_USER` | SSH username | `ubuntu` or `azeem` |
| `VM_SSH_KEY` | Private SSH key for authentication | Contents of `~/.ssh/id_rsa` |

**To get your SSH private key:**
```bash
# On Windows (Git Bash or PowerShell)
cat ~/.ssh/id_rsa

# Or generate a new one specifically for GitHub Actions
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_key

# Copy the private key
cat ~/.ssh/github_actions_key

# Add the public key to your VM's authorized_keys
cat ~/.ssh/github_actions_key.pub | ssh user@vm-ip "cat >> ~/.ssh/authorized_keys"
```

### 3. Create Deployment Scripts on VM

#### Backend Deploy Script (`~/deployment/backend/deploy.sh`):

```bash
#!/bin/bash
set -e

echo "Starting backend deployment..."

cd ~/deployment/backend

# Pull latest code (if using git clone on VM)
# git pull origin main

# Or copy files from build artifacts
# (Implementation depends on your deployment strategy)

# Stop existing container
docker-compose down || true

# Pull/build latest images
docker-compose pull
docker-compose build

# Start services
docker-compose up -d

# Run migrations
docker-compose exec -T backend npm run db:migrate

echo "Backend deployment complete!"
```

#### Frontend Deploy Script (`~/deployment/frontend/deploy.sh`):

```bash
#!/bin/bash
set -e

echo "Starting frontend deployment..."

cd ~/deployment/frontend

# Stop existing container
docker-compose down || true

# Pull/build latest images
docker-compose pull
docker-compose build

# Start services
docker-compose up -d

echo "Frontend deployment complete!"
```

Make scripts executable:
```bash
chmod +x ~/deployment/backend/deploy.sh
chmod +x ~/deployment/frontend/deploy.sh
```

### 4. Enable Deployment Workflows

When ready to deploy automatically:

```bash
# Rename template files to active workflows
mv .github/workflows/backend-deploy.yml.template .github/workflows/backend-deploy.yml
mv .github/workflows/frontend-deploy.yml.template .github/workflows/frontend-deploy.yml

# Commit and push
git add .github/workflows/
git commit -m "Enable deployment workflows"
git push
```

## Troubleshooting

### Workflow Not Triggering

**Problem**: Pushed code but workflow didn't run

**Solutions**:
- Check the `paths` filter - workflow only runs when relevant files change
- Verify you pushed to `main` or `develop` branch
- Check Actions tab for disabled workflows
- Ensure `.github/workflows/` files are in the repository

### Tests Failing in CI

**Problem**: Tests pass locally but fail in GitHub Actions

**Common Causes**:
- Environment variables not set correctly
- Database connection issues (check PostgreSQL service configuration)
- Port conflicts
- Missing dependencies

**Debug Steps**:
1. Check workflow logs in Actions tab
2. Verify environment variables in workflow file
3. Ensure PostgreSQL service is healthy before tests run
4. Try running with same Node version locally

### Docker Build Failing

**Problem**: Docker build works locally but fails in CI

**Solutions**:
- Ensure all dependencies are in package.json (not just globally installed)
- Check file paths are correct (case-sensitive in Linux containers)
- Verify `.dockerignore` isn't excluding necessary files
- Check build context in workflow file

### SSH Deployment Failing

**Problem**: Deployment workflow can't connect to VM

**Solutions**:
- Verify VM_HOST, VM_USER, VM_SSH_KEY secrets are set correctly
- Check SSH key has no passphrase
- Ensure VM's firewall allows SSH (port 22)
- Verify SSH key is added to VM's `~/.ssh/authorized_keys`
- Test SSH connection manually: `ssh -i path/to/key user@vm-ip`

## Best Practices

### Branch Protection

1. Go to Settings > Branches
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks to pass (select CI workflows)
   - Require branches to be up to date

### Workflow Optimization

- Use `cache: "npm"` in setup-node to cache dependencies
- Use `cache-from` and `cache-to` for Docker builds
- Use `paths` filters to only run workflows when relevant files change
- Use `needs` to control job dependencies

### Security

- Never commit `.env` files
- Use GitHub Secrets for sensitive data
- Rotate SSH keys periodically
- Use least-privilege SSH user for deployments
- Enable branch protection rules

### Monitoring

- Enable email notifications for workflow failures
- Use GitHub's dependency scanning (Settings > Code security)
- Monitor workflow run times and optimize slow steps
- Set up status badges in README

## Status Badges

Add these to your README.md to show CI status:

```markdown
# Finance Tracker

![Backend CI](https://github.com/YOUR_USERNAME/finance-tracker/workflows/Backend%20CI/badge.svg)
![Frontend CI](https://github.com/YOUR_USERNAME/finance-tracker/workflows/Frontend%20CI/badge.svg)
```

## Next Steps

1. Create GitHub repository
2. Push code to repository
3. Verify CI workflows run successfully
4. Set up VM when ready
5. Add GitHub secrets for deployment
6. Enable deployment workflows
7. Test full CI/CD pipeline

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [SSH Action for Deployment](https://github.com/appleboy/ssh-action)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
