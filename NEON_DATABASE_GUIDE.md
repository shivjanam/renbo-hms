# Neon Database Guide - HMS

## 🔗 Database Connection Details

Your HMS uses **Neon PostgreSQL** (same database as CMS):

```
Host: ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech
Database: neondb
Username: neondb_owner
Password: npg_hwjWHm01xMlr
Port: 5432
SSL: Required
```

**Connection String (JDBC):**
```
jdbc:postgresql://ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

---

## 🌐 Access Neon Database

### Method 1: Neon Dashboard (Easiest)

1. **Go to**: https://console.neon.tech
2. **Sign in** with your account
3. **Select your project** (the one with `ep-fancy-rice-a1i570l1`)
4. **Click "SQL Editor"** in the left sidebar
5. **Run queries** directly in the browser

### Method 2: Using psql (Command Line)

```bash
# Install PostgreSQL client if needed
# Windows: Download from https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql-client

# Connect to Neon database
psql "postgresql://neondb_owner:npg_hwjWHm01xMlr@ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

### Method 3: Using DBeaver / pgAdmin / TablePlus

1. **Download** DBeaver (free): https://dbeaver.io/download/
2. **Create new connection** → PostgreSQL
3. **Enter details:**
   - Host: `ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech`
   - Port: `5432`
   - Database: `neondb`
   - Username: `neondb_owner`
   - Password: `npg_hwjWHm01xMlr`
   - SSL: Enable (Required)
4. **Test connection** → **Connect**

---

## 📊 Check HMS Tables

### List All Tables

```sql
-- List all tables in the database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### List HMS-Specific Tables

HMS creates tables with these prefixes/patterns:

```sql
-- Check for HMS tables (Spring Boot JPA creates tables in lowercase)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND (
    table_name LIKE '%patient%' OR
    table_name LIKE '%doctor%' OR
    table_name LIKE '%appointment%' OR
    table_name LIKE '%invoice%' OR
    table_name LIKE '%prescription%' OR
    table_name LIKE '%hospital%' OR
    table_name LIKE '%department%' OR
    table_name LIKE '%lab%' OR
    table_name LIKE '%medicine%' OR
    table_name LIKE '%user%' OR
    table_name LIKE '%audit%'
  )
ORDER BY table_name;
```

### Expected HMS Tables

After HMS backend starts, you should see tables like:

```
- users
- patients
- doctors
- appointments
- queue_entries
- prescriptions
- prescription_medicines
- invoices
- invoice_items
- payments
- hospitals
- departments
- beds
- admissions
- lab_tests
- lab_orders
- lab_order_items
- medicines
- medicine_stocks
- doctor_schedules
- notifications
- audit_logs
- refresh_tokens
```

### Check Table Structure

```sql
-- View structure of a specific table
\d+ patients

-- Or using SQL
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'patients'
ORDER BY ordinal_position;
```

### Count Records in Tables

```sql
-- Count records in main HMS tables
SELECT 
    'patients' as table_name, COUNT(*) as count FROM patients
UNION ALL
SELECT 'doctors', COUNT(*) FROM doctors
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'prescriptions', COUNT(*) FROM prescriptions
UNION ALL
SELECT 'hospitals', COUNT(*) FROM hospitals
UNION ALL
SELECT 'departments', COUNT(*) FROM departments
UNION ALL
SELECT 'users', COUNT(*) FROM users;
```

---

## 🔍 Useful Queries

### Check Database Size

```sql
SELECT 
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE datname = 'neondb';
```

### Check Table Sizes

```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check Recent Activity

```sql
-- Check recent audit logs (if audit_logs table exists)
SELECT * FROM audit_logs 
ORDER BY created_at DESC 
LIMIT 20;
```

### Check Users

```sql
-- List all users
SELECT id, username, email, role, enabled, created_at 
FROM users 
ORDER BY created_at DESC;
```

### Check Appointments

```sql
-- List recent appointments
SELECT 
    a.id,
    a.appointment_date,
    a.status,
    p.name as patient_name,
    d.name as doctor_name
FROM appointments a
LEFT JOIN patients p ON a.patient_id = p.id
LEFT JOIN doctors d ON a.doctor_id = d.id
ORDER BY a.appointment_date DESC
LIMIT 20;
```

---

## 🚀 Initialize HMS Tables

HMS tables are created automatically when the backend starts (using JPA `ddl-auto: update`).

### First Time Setup

1. **Deploy backend** to Render
2. **Backend will automatically:**
   - Connect to Neon database
   - Create all tables
   - Set up indexes and constraints

### Manual Table Creation (if needed)

If tables don't auto-create, you can check backend logs or run:

```sql
-- Check if tables exist
SELECT COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public';
```

---

## 🔐 Security Notes

⚠️ **Important:**
- Never share database credentials publicly
- Use environment variables in production
- Neon database is shared with CMS - HMS creates its own tables
- Both systems can coexist in the same database

---

## 📝 Connection Test

Test your connection:

```sql
-- Simple test query
SELECT version();

-- Check current database
SELECT current_database();

-- Check current user
SELECT current_user;
```

---

## 🆘 Troubleshooting

### Can't Connect?

1. **Check credentials** in `.env` file
2. **Verify SSL** is enabled (`sslmode=require`)
3. **Check Neon dashboard** - ensure database is active
4. **Verify IP whitelist** (if Neon has IP restrictions)

### Tables Not Created?

1. **Check backend logs** on Render
2. **Verify** `SPRING_PROFILES_ACTIVE=prod` is set
3. **Check** `application.yml` has `ddl-auto: update`
4. **Restart backend** service

### Connection Timeout?

1. **Use connection pooling** (already configured)
2. **Check Neon status**: https://status.neon.tech
3. **Verify region** matches (ap-southeast-1)

---

## 📚 Resources

- **Neon Dashboard**: https://console.neon.tech
- **Neon Docs**: https://neon.tech/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
