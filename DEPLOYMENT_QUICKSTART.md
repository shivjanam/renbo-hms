# Deployment Quick Start Guide

## 🚀 Quick Deployment Commands

### Local Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```powershell
.\deploy.ps1
```

**Manual:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📋 Pre-Deployment Checklist

- [ ] `.env` file configured with production values
- [ ] Database credentials set
- [ ] JWT secret generated (min 256 bits)
- [ ] Encryption key set (32 characters)
- [ ] Frontend URL configured
- [ ] API URL configured
- [ ] Email/SMS API keys configured (if using)
- [ ] Docker and Docker Compose installed
- [ ] Ports 80, 443, 8080 available

## 🔧 Common Commands

### Service Management
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View status
docker-compose ps

# View logs
docker-compose logs -f [service_name]
```

### Database Operations
```bash
# Create backup
docker-compose exec -T db pg_dump -U hms_user hms_db > backup.sql

# Restore backup
docker-compose exec -T db psql -U hms_user hms_db < backup.sql

# Access database shell
docker-compose exec db psql -U hms_user -d hms_db

# Check database health
docker-compose exec db pg_isready -U hms_user
```

### Health Checks
```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend health
curl http://localhost/health

# All services
docker-compose ps
```

### Updates
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Or use deployment script
./deploy.sh  # Linux/Mac
.\deploy.ps1  # Windows
```

### Troubleshooting
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Check resource usage
docker stats

# Clean up unused resources
docker system prune -af --volumes
```

## 🌐 Access URLs

After deployment:
- **Frontend**: http://localhost (or your domain)
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **H2 Console** (dev only): http://localhost:8080/h2-console

## 🔐 Environment Variables

Required variables in `.env`:
```env
DB_USERNAME=hms_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your-very-long-jwt-secret-key-minimum-256-bits
ENCRYPTION_KEY=your-32-character-encryption-key
FRONTEND_URL=http://localhost:3000
VITE_API_URL=http://localhost:8080
```

## 📚 Full Documentation

For detailed deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## 🆘 Support

If you encounter issues:
1. Check logs: `docker-compose logs`
2. Verify environment: `docker-compose config`
3. Review [DEPLOYMENT.md](docs/DEPLOYMENT.md) troubleshooting section
4. Check GitHub Issues
