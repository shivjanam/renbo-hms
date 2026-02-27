# Deployment Guide

This guide covers deploying the Hospital Management System to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Manual Deployment](#manual-deployment)
4. [Automated Deployment](#automated-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Server Setup](#server-setup)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

- Docker 20.10+ and Docker Compose 2.0+
- Git
- SSH access to production server (for remote deployment)
- Domain name with DNS configured (optional)
- SSL certificate (optional, recommended for production)

## Quick Start

### Local Deployment

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hospital-management-system
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Deploy using Docker Compose**
   ```bash
   # Linux/Mac
   chmod +x deploy.sh
   ./deploy.sh
   
   # Windows
   .\deploy.ps1
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080
   - API Docs: http://localhost:8080/swagger-ui.html

## Manual Deployment

### Step 1: Prepare Environment

1. Create `.env` file from template:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with production values:
   ```env
   DB_USERNAME=hms_user
   DB_PASSWORD=your_secure_password
   JWT_SECRET=your-very-long-jwt-secret-key-minimum-256-bits
   ENCRYPTION_KEY=your-32-character-encryption-key
   FRONTEND_URL=https://yourdomain.com
   APP_BASE_URL=https://yourdomain.com
   VITE_API_URL=https://api.yourdomain.com
   ```

### Step 2: Build and Start Services

```bash
# Pull latest images (if using registry)
docker-compose pull

# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Step 3: Verify Deployment

```bash
# Check service status
docker-compose ps

# Health checks
curl http://localhost:8080/actuator/health
curl http://localhost/health

# View logs
docker-compose logs backend
docker-compose logs frontend
```

## Automated Deployment

### GitHub Actions CI/CD

The project includes GitHub Actions workflows for automated deployment:

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Runs on every push/PR
   - Tests backend and frontend
   - Builds Docker images
   - Pushes to Docker Hub (on main branch)

2. **Deploy Pipeline** (`.github/workflows/deploy.yml`)
   - Manual trigger or on main branch push
   - Builds and pushes images
   - Deploys to production server via SSH

### Setup GitHub Secrets

Configure the following secrets in GitHub repository settings:

- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password/token
- `PRODUCTION_HOST` - Production server IP/hostname
- `PRODUCTION_USER` - SSH username
- `PRODUCTION_SSH_KEY` - SSH private key
- `PRODUCTION_PORT` - SSH port (default: 22)
- `VITE_API_URL` - Frontend API URL
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password

### Trigger Deployment

1. **Automatic**: Push to `main` branch
2. **Manual**: Go to Actions → Deploy to Production → Run workflow

## Environment Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_USERNAME` | PostgreSQL username | `hms_user` |
| `DB_PASSWORD` | PostgreSQL password | `secure_password` |
| `JWT_SECRET` | JWT signing secret (min 256 bits) | `your-secret-key` |
| `ENCRYPTION_KEY` | Encryption key (32 chars) | `your-32-char-key` |
| `FRONTEND_URL` | Frontend URL | `https://yourdomain.com` |
| `VITE_API_URL` | Backend API URL | `https://api.yourdomain.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `HOSPITAL_NAME` | Hospital name | `City General Hospital` |
| `HOSPITAL_CODE` | Hospital code | `CGH001` |
| `RESEND_API_KEY` | Email API key | - |
| `FAST2SMS_API_KEY` | SMS API key | - |
| `RAZORPAY_KEY_ID` | Razorpay key | - |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | - |

## Server Setup

### Initial Server Configuration

1. **Install Docker**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

2. **Install Docker Compose**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Create project directory**
   ```bash
   sudo mkdir -p /opt/hospital-management-system
   sudo chown $USER:$USER /opt/hospital-management-system
   cd /opt/hospital-management-system
   ```

4. **Clone repository**
   ```bash
   git clone <repository-url> .
   ```

5. **Configure environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit with production values
   ```

6. **Deploy**
   ```bash
   ./deploy.sh
   ```

### Nginx Reverse Proxy (Optional)

For production with custom domain:

```nginx
# /etc/nginx/sites-available/hms
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Troubleshooting

### Services Won't Start

1. **Check logs**
   ```bash
   docker-compose logs
   ```

2. **Check port availability**
   ```bash
   netstat -tulpn | grep -E '80|443|8080'
   ```

3. **Verify environment variables**
   ```bash
   docker-compose config
   ```

### Database Connection Issues

1. **Check database is running**
   ```bash
   docker-compose ps db
   ```

2. **Test connection**
   ```bash
   docker-compose exec db psql -U hms_user -d hms_db
   ```

3. **Check logs**
   ```bash
   docker-compose logs db
   ```

### Frontend Not Loading

1. **Check nginx logs**
   ```bash
   docker-compose logs frontend
   ```

2. **Verify build**
   ```bash
   docker-compose exec frontend ls -la /usr/share/nginx/html
   ```

3. **Check API connectivity**
   ```bash
   curl http://localhost:8080/actuator/health
   ```

### Performance Issues

1. **Check resource usage**
   ```bash
   docker stats
   ```

2. **Increase resources in docker-compose.yml**
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '2'
             memory: 2G
   ```

3. **Enable Redis caching** (already configured)

### Backup and Restore

**Create backup:**
```bash
docker-compose exec -T db pg_dump -U hms_user hms_db > backup_$(date +%Y%m%d).sql
```

**Restore backup:**
```bash
docker-compose exec -T db psql -U hms_user hms_db < backup_YYYYMMDD.sql
```

## Monitoring

### Health Checks

- Backend: `http://localhost:8080/actuator/health`
- Frontend: `http://localhost/health`
- Database: `docker-compose exec db pg_isready -U hms_user`

### Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Or use deployment script
./deploy.sh
```

## Security Best Practices

1. **Change default passwords** in `.env`
2. **Use strong JWT secrets** (minimum 256 bits)
3. **Enable SSL/TLS** for production
4. **Regular backups** of database
5. **Keep Docker images updated**
6. **Use secrets management** (Docker secrets, Vault, etc.)
7. **Restrict network access** (firewall rules)
8. **Monitor logs** for suspicious activity

## Support

For deployment issues:
1. Check logs: `docker-compose logs`
2. Review this guide
3. Check GitHub Issues
4. Contact support team
