#!/bin/bash

# ===========================================
# Hospital Management System
# Production Deployment Script
# ===========================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    log_warn ".env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        log_warn "Please update .env file with your configuration before deploying."
        exit 1
    else
        log_error ".env.example file not found. Cannot proceed."
        exit 1
    fi
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

log_info "Starting deployment process..."

# Pull latest images
log_info "Pulling latest Docker images..."
docker-compose pull

# Build images if needed
log_info "Building Docker images..."
docker-compose build --no-cache

# Create backup
log_info "Creating database backup..."
BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
docker-compose exec -T db pg_dump -U ${DB_USERNAME:-hms_user} hms_db > ${BACKUP_FILE} 2>/dev/null || log_warn "Could not create backup (database might not be running)"

# Stop existing containers
log_info "Stopping existing containers..."
docker-compose down

# Start services
log_info "Starting services..."
docker-compose up -d

# Wait for services to be ready
log_info "Waiting for services to be ready..."
sleep 30

# Health checks
log_info "Performing health checks..."

# Backend health check
if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
    log_success "Backend is healthy"
else
    log_error "Backend health check failed"
    docker-compose logs backend
    exit 1
fi

# Frontend health check
if curl -f http://localhost/health > /dev/null 2>&1; then
    log_success "Frontend is healthy"
else
    log_error "Frontend health check failed"
    docker-compose logs frontend
    exit 1
fi

# Database health check
if docker-compose exec -T db pg_isready -U ${DB_USERNAME:-hms_user} > /dev/null 2>&1; then
    log_success "Database is healthy"
else
    log_error "Database health check failed"
    exit 1
fi

# Cleanup old images
log_info "Cleaning up old Docker images..."
docker system prune -af --volumes --filter "until=168h" || true

log_success "Deployment completed successfully!"
log_info "Frontend: http://localhost"
log_info "Backend API: http://localhost:8080"
log_info "API Docs: http://localhost:8080/swagger-ui.html"
