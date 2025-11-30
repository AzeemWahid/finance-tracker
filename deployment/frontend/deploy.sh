#!/bin/bash

# Frontend Deployment Script
# This script builds and deploys the frontend to your VM

set -e  # Exit on error

echo "🚀 Starting frontend deployment..."

# Configuration
APP_DIR="/var/www/finance-tracker-frontend"
BUILD_DIR="/var/www/finance-tracker-frontend-dist"
REPO_URL="YOUR_FRONTEND_REPO_URL"  # Update this with your actual repo URL
BRANCH="main"

# Create app directory if it doesn't exist
sudo mkdir -p $APP_DIR
sudo mkdir -p $BUILD_DIR

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
npm ci

# Set up environment file if it doesn't exist
if [ ! -f "$APP_DIR/.env" ]; then
    echo "⚠️  .env file not found. Creating from example..."
    sudo cp .env.example .env
    echo "📝 Edit .env file at $APP_DIR/.env with production values"
fi

# Build for production
echo "🔨 Building frontend..."
npm run build

# Copy build files to web directory
echo "📋 Copying build files..."
sudo rm -rf $BUILD_DIR/*
sudo cp -r dist/* $BUILD_DIR/

# Set proper permissions
sudo chown -R www-data:www-data $BUILD_DIR
sudo chmod -R 755 $BUILD_DIR

# Reload nginx
echo "🔄 Reloading nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Frontend deployment complete!"
echo "🌐 Your app should now be live!"
