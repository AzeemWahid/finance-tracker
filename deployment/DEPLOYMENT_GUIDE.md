# Finance Tracker - VM Deployment Guide

Complete guide to deploying Finance Tracker to your own VM with CI/CD.

## Prerequisites

- Ubuntu 20.04+ or Debian 11+ VM
- SSH access to your VM
- Domain name (optional, but recommended for SSL)
- GitHub account

## Architecture

```
┌─────────────┐
│   Internet  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│   Nginx (Port 80)   │
│  - Serves Frontend  │
│  - Proxies API      │
└──────┬──────────────┘
       │
       ├──► Frontend (Static Files)
       │    /var/www/finance-tracker-frontend-dist
       │
       └──► Backend API (Port 3000)
            /var/www/finance-tracker-backend
            │
            ▼
       ┌────────────┐
       │ PostgreSQL │
       └────────────┘
```

## Initial VM Setup

### 1. Connect to Your VM

```bash
ssh your-user@your-vm-ip
```

### 2. Upload Deployment Files

From your local machine:

```bash
scp -r deployment your-user@your-vm-ip:~/
```

### 3. Run Setup Script

On your VM:

```bash
cd ~/deployment
chmod +x setup-vm.sh
chmod +x backend/deploy.sh
chmod +x frontend/deploy.sh
./setup-vm.sh
```

This script will:
- Install Node.js, PostgreSQL, Nginx, Git, PM2
- Create PostgreSQL database and user
- Set up systemd service
- Configure Nginx
- Set up firewall rules

## GitHub Setup

### 1. Create Separate Repositories

Create two repositories on GitHub:
- `finance-tracker-backend`
- `finance-tracker-frontend`

### 2. Push Code to Repositories

**Backend:**
```bash
cd backend
git init
git add .
git commit -m "Initial backend setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/finance-tracker-backend.git
git push -u origin main
```

**Frontend:**
```bash
cd frontend
git init
git add .
git commit -m "Initial frontend setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/finance-tracker-frontend.git
git push -u origin main
```

### 3. Set Up Deploy Keys (SSH Access)

On your VM:

```bash
# Generate SSH key for GitHub access
ssh-keygen -t ed25519 -C "deploy@your-vm" -f ~/.ssh/github_deploy
cat ~/.ssh/github_deploy.pub
```

Add the public key to each repository:
1. Go to repo Settings → Deploy keys → Add deploy key
2. Paste the public key
3. Check "Allow write access" if using GitHub Actions to deploy

Update your VM's SSH config:

```bash
cat >> ~/.ssh/config << EOF
Host github.com
  IdentityFile ~/.ssh/github_deploy
  StrictHostKeyChecking no
EOF
```

## Configuration

### 1. Update Deployment Scripts

Edit `deployment/backend/deploy.sh`:
```bash
REPO_URL="git@github.com:YOUR_USERNAME/finance-tracker-backend.git"
```

Edit `deployment/frontend/deploy.sh`:
```bash
REPO_URL="git@github.com:YOUR_USERNAME/finance-tracker-frontend.git"
```

### 2. Update Nginx Configuration

Edit `deployment/nginx/finance-tracker.conf`:
```nginx
server_name your-domain.com www.your-domain.com;
```

Reload Nginx:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 3. Configure Backend Environment

On your VM:

```bash
sudo nano /var/www/finance-tracker-backend/.env
```

Update with production values:
```env
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_NAME=financetrackerdb
DB_USER=financeuser
DB_PASSWORD=YOUR_STRONG_PASSWORD
JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_PRODUCTION
JWT_REFRESH_SECRET=YOUR_SUPER_SECRET_REFRESH_KEY_PRODUCTION
CORS_ORIGIN=https://your-domain.com
```

### 4. Configure Frontend Environment

The frontend build process will use the `.env` file in the repo. Update it before deploying:

```env
VITE_API_BASE_URL=https://your-domain.com/api/v1
VITE_APP_NAME=Finance Tracker
```

## First Deployment

### 1. Deploy Backend

```bash
cd ~/deployment/backend
./deploy.sh
```

This will:
- Clone the repository
- Install dependencies
- Build TypeScript
- Run database migrations
- Start the systemd service

### 2. Deploy Frontend

```bash
cd ~/deployment/frontend
./deploy.sh
```

This will:
- Clone the repository
- Install dependencies
- Build for production
- Copy files to web directory
- Reload Nginx

### 3. Verify Deployment

```bash
# Check backend service
sudo systemctl status finance-tracker-backend

# Check backend logs
sudo journalctl -u finance-tracker-backend -f

# Check if API is responding
curl http://localhost:3000/api/v1/health

# Check Nginx
sudo systemctl status nginx

# Check if site is accessible
curl http://your-vm-ip
```

## SSL Setup with Let's Encrypt

### 1. Install Certbot

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

### 2. Obtain Certificate

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 3. Auto-Renewal

Certbot automatically sets up renewal. Test it:

```bash
sudo certbot renew --dry-run
```

## GitHub Actions CI/CD

### Backend CI/CD Workflow

Create `.github/workflows/deploy.yml` in your backend repo:

```yaml
name: Deploy to VM

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VM
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VM_HOST }}
          username: ${{ secrets.VM_USER }}
          key: ${{ secrets.VM_SSH_KEY }}
          script: |
            cd ~/deployment/backend
            ./deploy.sh
```

### Frontend CI/CD Workflow

Create `.github/workflows/deploy.yml` in your frontend repo:

```yaml
name: Deploy to VM

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VM
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VM_HOST }}
          username: ${{ secrets.VM_USER }}
          key: ${{ secrets.VM_SSH_KEY }}
          script: |
            cd ~/deployment/frontend
            ./deploy.sh
```

### Set Up GitHub Secrets

Add these secrets to each repository (Settings → Secrets and variables → Actions):

- `VM_HOST`: Your VM IP or domain
- `VM_USER`: SSH username
- `VM_SSH_KEY`: Private SSH key (create a new key specifically for GitHub Actions)

To generate the SSH key for GitHub Actions:

```bash
# On your local machine
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
cat ~/.ssh/github_actions  # This is your private key for GitHub secret
cat ~/.ssh/github_actions.pub  # Add this to VM's authorized_keys
```

On your VM:

```bash
echo "PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
```

## Monitoring and Maintenance

### View Logs

```bash
# Backend logs
sudo journalctl -u finance-tracker-backend -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Restart Services

```bash
# Restart backend
sudo systemctl restart finance-tracker-backend

# Reload Nginx
sudo systemctl reload nginx

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Database Backup

Create a backup script:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgres"
mkdir -p $BACKUP_DIR
pg_dump -U financeuser financetrackerdb > $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql
```

Add to crontab for daily backups:

```bash
sudo crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

### Updates

To deploy new changes:

1. Push to GitHub main branch
2. GitHub Actions will automatically deploy
3. Or manually: Run `./deploy.sh` on your VM

## Troubleshooting

### Backend not starting

```bash
# Check service status
sudo systemctl status finance-tracker-backend

# Check logs for errors
sudo journalctl -u finance-tracker-backend -n 50

# Test backend directly
cd /var/www/finance-tracker-backend
node dist/server.js
```

### Frontend not displaying

```bash
# Check Nginx configuration
sudo nginx -t

# Check if files exist
ls -la /var/www/finance-tracker-frontend-dist

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Database connection issues

```bash
# Test PostgreSQL connection
sudo -u postgres psql financetrackerdb

# Check if PostgreSQL is running
sudo systemctl status postgresql

# Verify credentials in backend .env
cat /var/www/finance-tracker-backend/.env
```

### Can't connect to VM

```bash
# Check firewall
sudo ufw status

# Allow ports if needed
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Security Best Practices

1. **Change default PostgreSQL password**
2. **Use strong JWT secrets** (generate with `openssl rand -base64 32`)
3. **Keep system updated**: `sudo apt-get update && sudo apt-get upgrade`
4. **Enable firewall**: Only allow necessary ports
5. **Use SSH keys** instead of passwords
6. **Disable root SSH login**
7. **Set up fail2ban** for brute force protection
8. **Regular backups** of database and .env files
9. **Monitor logs** regularly
10. **Keep dependencies updated**: Run `npm audit` regularly

## Performance Optimization

1. **Enable Gzip in Nginx**
2. **Set up caching** for static assets
3. **Use PM2** for process management (alternative to systemd)
4. **Database connection pooling** (already configured)
5. **CDN** for static assets (optional)

## Scaling

For high traffic, consider:
1. **Load balancer** with multiple backend instances
2. **Redis** for session management
3. **Separate database server**
4. **CDN** for frontend assets
5. **Horizontal scaling** with Docker/Kubernetes

## Support

For issues or questions:
- Check logs first
- Review this guide
- Check GitHub repository issues

---

**Deployment checklist:**

- [ ] VM set up and accessible
- [ ] PostgreSQL database created
- [ ] GitHub repositories created
- [ ] Deploy keys configured
- [ ] Deployment scripts updated with repo URLs
- [ ] Nginx configured with domain
- [ ] Backend .env configured
- [ ] Frontend .env configured
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] SSL certificate installed
- [ ] GitHub Actions configured
- [ ] Monitoring set up
- [ ] Backup strategy in place
