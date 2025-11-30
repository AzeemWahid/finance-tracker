#!/bin/bash

# VM Initial Setup Script
# Run this script on your fresh Ubuntu/Debian VM to set up the environment

set -e

echo "🚀 Setting up Finance Tracker on VM..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 20.x
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
echo "📦 Installing PostgreSQL..."
sudo apt-get install -y postgresql postgresql-contrib

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt-get install -y nginx

# Install Git
echo "📦 Installing Git..."
sudo apt-get install -y git

# Install PM2 globally (alternative to systemd)
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Configure PostgreSQL
echo "🗄️  Configuring PostgreSQL..."
sudo -u postgres psql << EOF
CREATE DATABASE financetrackerdb;
CREATE USER financeuser WITH ENCRYPTED PASSWORD 'CHANGE_THIS_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE financetrackerdb TO financeuser;
\q
EOF

echo "✅ PostgreSQL database 'financetrackerdb' created"
echo "📝 Remember to update your backend .env file with the database credentials"

# Create application directories
echo "📁 Creating application directories..."
sudo mkdir -p /var/www/finance-tracker-backend
sudo mkdir -p /var/www/finance-tracker-frontend-dist

# Set up systemd service
echo "⚙️  Setting up systemd service..."
sudo cp systemd/finance-tracker-backend.service /etc/systemd/system/
sudo systemctl daemon-reload

# Set up Nginx
echo "⚙️  Setting up Nginx..."
sudo cp nginx/finance-tracker.conf /etc/nginx/sites-available/finance-tracker
sudo ln -sf /etc/nginx/sites-available/finance-tracker /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default  # Remove default site

# Test Nginx configuration
sudo nginx -t

# Enable and start services
echo "🔄 Enabling services..."
sudo systemctl enable postgresql
sudo systemctl enable nginx

# Configure firewall (if ufw is installed)
if command -v ufw &> /dev/null; then
    echo "🔥 Configuring firewall..."
    sudo ufw allow 22/tcp   # SSH
    sudo ufw allow 80/tcp   # HTTP
    sudo ufw allow 443/tcp  # HTTPS
    sudo ufw --force enable
fi

echo ""
echo "✅ VM setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update deployment/backend/deploy.sh with your backend repo URL"
echo "2. Update deployment/frontend/deploy.sh with your frontend repo URL"
echo "3. Update deployment/nginx/finance-tracker.conf with your domain name"
echo "4. Run: cd deployment/backend && ./deploy.sh"
echo "5. Run: cd deployment/frontend && ./deploy.sh"
echo "6. (Optional) Set up SSL with: sudo certbot --nginx -d your-domain.com"
echo ""
echo "🔐 Database credentials:"
echo "  Database: financetrackerdb"
echo "  User: financeuser"
echo "  Password: CHANGE_THIS_PASSWORD"
echo ""
echo "📝 Update your backend .env file with these credentials!"
