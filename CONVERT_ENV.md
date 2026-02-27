# Convert CMS Environment to HMS

## Quick Conversion Guide

### Option 1: Using the Conversion Script (Recommended)

1. **Place your CMS .env file** in the project directory or note its path
   - Example: `htc-cms-api (1).env`

2. **Run the conversion script:**
   ```powershell
   # If file is in project directory
   .\convert-cms-to-hms.ps1 -CmsEnvFile "htc-cms-api (1).env"
   
   # If file is in another location
   .\convert-cms-to-hms.ps1 -CmsEnvFile "C:\path\to\htc-cms-api (1).env"
   
   # Specify custom output file
   .\convert-cms-to-hms.ps1 -CmsEnvFile "htc-cms-api (1).env" -OutputFile ".env"
   ```

3. **Review and update** the generated `.env` file:
   - Replace "College" with "Hospital" in names
   - Update email domains
   - Verify database URL format
   - Add any missing HMS-specific variables

### Option 2: Manual Conversion

Use the mapping guide in `ENV_MAPPING.md` to manually convert variables.

## Common CMS Variables and HMS Equivalents

### Database
- `DB_HOST` + `DB_NAME` → `DATABASE_URL=jdbc:postgresql://host:5432/hms_db`
- `DB_USER` → `DB_USERNAME`
- `DB_PASSWORD` → `DB_PASSWORD`

### URLs
- `FRONTEND_URL` → `FRONTEND_URL` (same)
- `BACKEND_URL` → `VITE_API_URL`
- `APP_URL` → `APP_BASE_URL`

### Institution Info
- `COLLEGE_NAME` → `HOSPITAL_NAME`
- `COLLEGE_CODE` → `HOSPITAL_CODE`
- `COLLEGE_ADDRESS` → `HOSPITAL_ADDRESS`
- `COLLEGE_PHONE` → `HOSPITAL_PHONE`
- `COLLEGE_EMAIL` → `HOSPITAL_EMAIL`

### Email
- `EMAIL_HOST` → `MAIL_HOST`
- `EMAIL_PORT` → `MAIL_PORT`
- `EMAIL_USER` → `MAIL_USERNAME`
- `EMAIL_PASSWORD` → `MAIL_PASSWORD`
- `EMAIL_FROM` → `RESEND_FROM_EMAIL`

### Payment
- `RAZORPAY_KEY_ID` → `RAZORPAY_KEY_ID` (same)
- `RAZORPAY_KEY_SECRET` → `RAZORPAY_KEY_SECRET` (same)
- `PAYMENT_GATEWAY=razorpay` → `RAZORPAY_ENABLED=true`

## After Conversion

1. **Review the generated `.env` file**
2. **Update institution-specific values:**
   - Change "College" to "Hospital" in names
   - Update contact information
   - Update URLs/domains
3. **Verify database connection:**
   - Ensure DATABASE_URL format is correct
   - Test connection: `docker-compose exec db psql -U $DB_USERNAME -d hms_db`
4. **Test deployment:**
   ```bash
   docker-compose up -d
   ```

## Example

**CMS .env:**
```env
DB_HOST=localhost
DB_NAME=cms_db
DB_USER=cms_user
DB_PASSWORD=secure123
JWT_SECRET=my-secret-key
FRONTEND_URL=https://cms.example.com
COLLEGE_NAME=ABC College
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=noreply@college.com
```

**HMS .env (after conversion):**
```env
DATABASE_URL=jdbc:postgresql://localhost:5432/hms_db
DB_USERNAME=cms_user
DB_PASSWORD=secure123
JWT_SECRET=my-secret-key
FRONTEND_URL=https://hms.example.com
HOSPITAL_NAME=ABC Hospital
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=noreply@hospital.com
```

## Need Help?

If you encounter issues:
1. Check `ENV_MAPPING.md` for detailed mappings
2. Review the conversion script output comments
3. Compare with `.env.example` for required variables
