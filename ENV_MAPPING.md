# Environment Variables Mapping Guide
## College Management System → Hospital Management System

This guide helps map environment variables from the College Management System (CMS) to the Hospital Management System (HMS).

## Common Mappings

### Database Configuration
| CMS Variable | HMS Variable | Description |
|--------------|--------------|-------------|
| `DB_HOST` | `DATABASE_URL` | Database connection URL |
| `DB_NAME` | `DATABASE_URL` (part of) | Database name (hms_db) |
| `DB_USER` | `DB_USERNAME` | Database username |
| `DB_PASSWORD` | `DB_PASSWORD` | Database password |
| `DB_PORT` | `DATABASE_URL` (part of) | Database port (5432 for PostgreSQL) |

### Security & Authentication
| CMS Variable | HMS Variable | Description |
|--------------|--------------|-------------|
| `JWT_SECRET` | `JWT_SECRET` | JWT signing secret (min 256 bits) |
| `JWT_EXPIRATION` | (in code) | JWT expiration time |
| `ENCRYPTION_KEY` | `ENCRYPTION_KEY` | Encryption key (32 characters) |
| `SECRET_KEY` | `JWT_SECRET` | General secret key |

### Application URLs
| CMS Variable | HMS Variable | Description |
|--------------|--------------|-------------|
| `FRONTEND_URL` | `FRONTEND_URL` | Frontend application URL |
| `BACKEND_URL` | `VITE_API_URL` | Backend API URL |
| `API_BASE_URL` | `VITE_API_URL` | API base URL |
| `APP_URL` | `APP_BASE_URL` | Application base URL |

### Email Configuration
| CMS Variable | HMS Variable | Description |
|--------------|--------------|-------------|
| `EMAIL_HOST` | `MAIL_HOST` | SMTP host |
| `EMAIL_PORT` | `MAIL_PORT` | SMTP port |
| `EMAIL_USER` | `MAIL_USERNAME` | SMTP username |
| `EMAIL_PASSWORD` | `MAIL_PASSWORD` | SMTP password |
| `EMAIL_FROM` | `RESEND_FROM_EMAIL` | From email address |
| `RESEND_API_KEY` | `RESEND_API_KEY` | Resend API key (preferred) |

### SMS Configuration
| CMS Variable | HMS Variable | Description |
|--------------|--------------|-------------|
| `SMS_API_KEY` | `FAST2SMS_API_KEY` | SMS API key |
| `SMS_PROVIDER` | `SMS_PROVIDER` | SMS provider (fast2sms) |
| `TWILIO_*` | (not used) | Twilio config (if applicable) |

### Payment Gateway
| CMS Variable | HMS Variable | Description |
|--------------|--------------|-------------|
| `RAZORPAY_KEY_ID` | `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | `RAZORPAY_KEY_SECRET` | Razorpay secret |
| `RAZORPAY_WEBHOOK_SECRET` | `RAZORPAY_WEBHOOK_SECRET` | Webhook secret |
| `PAYMENT_GATEWAY` | `RAZORPAY_ENABLED` | Payment gateway enabled |

### Organization/Institution Info
| CMS Variable | HMS Variable | Description |
|--------------|--------------|-------------|
| `COLLEGE_NAME` | `HOSPITAL_NAME` | Institution name |
| `COLLEGE_CODE` | `HOSPITAL_CODE` | Institution code |
| `COLLEGE_ADDRESS` | `HOSPITAL_ADDRESS` | Institution address |
| `COLLEGE_PHONE` | `HOSPITAL_PHONE` | Contact phone |
| `COLLEGE_EMAIL` | `HOSPITAL_EMAIL` | Contact email |
| `GSTIN` | `HOSPITAL_GSTIN` | GST number |

### Redis/Cache
| CMS Variable | HMS Variable | Description |
|--------------|--------------|-------------|
| `REDIS_HOST` | (auto: redis) | Redis hostname |
| `REDIS_PORT` | (auto: 6379) | Redis port |
| `REDIS_PASSWORD` | (optional) | Redis password |

### File Upload
| CMS Variable | HMS Variable | Description |
|--------------|--------------|-------------|
| `UPLOAD_DIR` | (auto: /app/uploads) | Upload directory |
| `MAX_FILE_SIZE` | (in code: 50MB) | Max file size |

## Example Conversion

### CMS .env
```env
DB_HOST=localhost
DB_NAME=cms_db
DB_USER=cms_user
DB_PASSWORD=secure_pass
JWT_SECRET=your-jwt-secret-key
FRONTEND_URL=https://cms.example.com
BACKEND_URL=https://api.cms.example.com
COLLEGE_NAME=ABC College
COLLEGE_CODE=ABC001
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@college.com
EMAIL_PASSWORD=email_pass
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=rzp_secret_xxx
```

### HMS .env (Converted)
```env
DATABASE_URL=jdbc:postgresql://localhost:5432/hms_db
DB_USERNAME=cms_user
DB_PASSWORD=secure_pass
JWT_SECRET=your-jwt-secret-key
FRONTEND_URL=https://hms.example.com
VITE_API_URL=https://api.hms.example.com
APP_BASE_URL=https://hms.example.com
HOSPITAL_NAME=ABC Hospital
HOSPITAL_CODE=ABC001
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=noreply@hospital.com
MAIL_PASSWORD=email_pass
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=rzp_secret_xxx
RAZORPAY_ENABLED=true
```

## Notes

1. **Database URL Format**: HMS uses JDBC URL format: `jdbc:postgresql://host:port/database`
2. **Institution Names**: Change "College" to "Hospital" in names
3. **Email Addresses**: Update email domains from college to hospital
4. **URLs**: Update domain names accordingly
5. **Secrets**: Keep the same secrets if migrating from CMS to HMS on same server
