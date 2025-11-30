#!/bin/bash

# Backend Deployment Script
# This script deploys the backend to your VM

set -e  # Exit on error

echo "🚀 Starting backend deployment..."

# Configuration
APP_DIR="/var/www/finance-tracker-backend"
REPO_URL="YOUR_BACKEND_REPO_URL"  # Update this with your actual repo URL
BRANCH="main"

# Create app directory if it doesn't exist
sudo mkdir -p $APP_DIR

# Clone or pull latest code
if [ -d "$APP_DIR/.git" ]; then
    echo "📥 Pulling latest changes..."
    cd $APP_DIR
    git pull origin $BRANCH
else
    echo "📥 Cloning repository..."
    sudo git clone -b $BRANCH $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

# Set up environment file if it doesn't exist
if [ ! -f "$APP_DIR/.env" ]; then
    echo "⚠️  .env file not found. Please create it with production values."
    sudo cp .env.example .env
    echo "📝 Edit .env file at $APP_DIR/.env with production credentials"
    exit 1
fi

# Run database migrations
echo "🗄️  Running database migrations..."
npm run db:migrate

# Restart the service
echo "🔄 Restarting backend service..."
sudo systemctl restart finance-tracker-backend
sudo systemctl status finance-tracker-backend

echo "✅ Backend deployment complete!"
echo "📊 Check logs with: sudo journalctl -u finance-tracker-backend -f"
