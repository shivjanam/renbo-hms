# Deployment Notes - CMS to HMS Migration

## Important Configuration Notes

### Database Configuration

Your CMS uses **Neon PostgreSQL** (cloud database), not a local Docker database. You have two deployment options:

#### Option 1: Use External Neon Database (Recommended for Production)

This uses your existing Neon database from CMS:

```bash
# Use the external database compose file
docker-compose -f docker-compose.external-db.yml up -d
```

**Advantages:**
- Uses existing database (no migration needed)
- Cloud-hosted, managed database
- No local database setup required
- Same database as CMS

**Note:** Make sure your `.env` file has the Neon database credentials.

#### Option 2: Use Local Docker Database

This creates a new local PostgreSQL database:

```bash
# Use the standard compose file
docker-compose up -d
```

**Advantages:**
- Complete isolation from CMS
- Full control over database
- No external dependencies

**Note:** You'll need to migrate data from Neon to local database if needed.

### URL Configuration

Your CMS uses Vercel for frontend hosting. Update these URLs in `.env` for HMS:

```env
# Current (CMS URLs)
FRONTEND_URL=https://htc-cms.vercel.app
APP_BASE_URL=https://htc-cms.vercel.app
VITE_API_URL=https://htc-cms.vercel.app

# Update to your HMS URLs (examples):
FRONTEND_URL=https://htc-hms.vercel.app
APP_BASE_URL=https://htc-hms.vercel.app
VITE_API_URL=https://api.htc-hms.com  # or your backend URL
```

### Email Configuration

Your CMS has `MAIL_PASSWORD` but missing `MAIL_USERNAME`. You need to add:

```env
MAIL_USERNAME=your-gmail-address@gmail.com
MAIL_PASSWORD=erxyeihfswrasgnw  # Already set from CMS
```

Or use Resend API (recommended):
```env
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@hospital.com
EMAIL_PREFER_RESEND=true
```

### Hospital Information

Converted from CMS:
- **College Name** → **Hospital Name**: "Hi-Tech Computer Hospital"
- **College Code** → **Hospital Code**: A287
- **Short Name**: HTC
- **Tagline**: "Excellence in Healthcare" (changed from "Excellence in Education")

**Action Required:** Update hospital-specific details:
- `HOSPITAL_ADDRESS` - Add hospital address
- `HOSPITAL_PHONE` - Add contact phone
- `HOSPITAL_EMAIL` - Add contact email
- `HOSPITAL_GSTIN` - Add GST number if applicable

### SMS Configuration

✅ Already configured:
- `FAST2SMS_API_KEY` - From CMS
- `SMS_PROVIDER=fast2sms`

**Note:** CMS uses Twilio for WhatsApp, but HMS uses Fast2SMS for SMS. Twilio variables are commented out in `.env`.

### Security Keys

✅ Already configured from CMS:
- `JWT_SECRET` - Long secret key
- `ENCRYPTION_KEY` - 32-character key

**Important:** These are production secrets. Keep them secure!

## Deployment Steps

### 1. Review and Update .env

```bash
# Edit .env file
nano .env  # or use your preferred editor
```

Update:
- URLs (if different from CMS)
- Hospital contact information
- Email username (if using SMTP)
- Any other HMS-specific values

### 2. Choose Deployment Method

**For External Database (Neon):**
```bash
docker-compose -f docker-compose.external-db.yml up -d
```

**For Local Database:**
```bash
docker-compose up -d
```

### 3. Verify Deployment

```bash
# Check services
docker-compose ps

# Check logs
docker-compose logs -f backend

# Health checks
curl http://localhost:8080/actuator/health
curl http://localhost/health
```

## Migration Considerations

### Database Schema

If using the same Neon database:
- HMS will create its own tables (different from CMS tables)
- Both systems can coexist in the same database
- Consider using different schema or database name for isolation

### Data Migration

If you need to migrate data from CMS to HMS:
1. Export CMS data
2. Transform to HMS format
3. Import into HMS database

## Troubleshooting

### Database Connection Issues

If using Neon database:
```bash
# Test connection from backend container
docker-compose exec backend sh
# Inside container:
wget --spider -q "https://ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech"
```

### SSL Mode

Neon requires SSL. The connection string already includes `?sslmode=require`.

### Port Conflicts

If ports 80, 443, or 8080 are in use:
```bash
# Check what's using the ports
netstat -ano | findstr :8080
netstat -ano | findstr :80

# Update docker-compose.yml ports if needed
```

## Next Steps

1. ✅ Environment file created (`.env`)
2. ⏳ Update URLs to HMS-specific domains
3. ⏳ Add missing hospital contact information
4. ⏳ Configure email (add MAIL_USERNAME or RESEND_API_KEY)
5. ⏳ Deploy using chosen method
6. ⏳ Test all functionality
7. ⏳ Update DNS/domain configuration

## Support

For issues:
1. Check logs: `docker-compose logs`
2. Verify `.env` configuration
3. Test database connectivity
4. Review [DEPLOYMENT.md](docs/DEPLOYMENT.md)
