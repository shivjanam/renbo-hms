# Quick Deploy to Render

## 🚀 Fast Deployment Steps

### 1. Push to GitHub

```bash
# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/your-username/hospital-management-system.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +" → "Blueprint"**
3. **Connect GitHub** and select your repository
4. **Render will detect `render.yaml`** automatically
5. **Click "Apply"** to create services

### 3. Configure Environment Variables

After services are created, go to each service → **Environment** tab:

#### Backend Service Variables:
```
DATABASE_URL=jdbc:postgresql://ep-fancy-rice-a1i570l1-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_hwjWHm01xMlr
JWT_SECRET=YTJiM2M0ZDVlNmY3ZzhoOWkwajFrMmwzbTRuNW82cDdxOHI5czB0MXUydjN3NHg1eTZ6N2E4YjljMGQxZTJmM2c0aDVpNmo3
ENCRYPTION_KEY=HTC2024EncryptionKey32CharLong!
FRONTEND_URL=https://hms-frontend-xxxx.onrender.com
APP_BASE_URL=https://hms-frontend-xxxx.onrender.com
VITE_API_URL=https://hms-backend-xxxx.onrender.com
FAST2SMS_API_KEY=Rbf0s6OzhmgkDySZeKUL4NJ2rYAa9tF53ouI8PEqndlT7xjCHBSX4QcFw2HCyDtsmYpa8elUAhuiIdKJ
MAIL_PASSWORD=erxyeihfswrasgnw
```

#### Frontend Service Variables:
```
VITE_API_URL=https://hms-backend-xxxx.onrender.com
```

**⚠️ Important:** Replace `xxxx` with your actual Render service IDs after deployment!

### 4. Update URLs After First Deploy

1. Wait for both services to deploy
2. Copy the backend URL (e.g., `https://hms-backend-abc123.onrender.com`)
3. Copy the frontend URL (e.g., `https://hms-frontend-xyz789.onrender.com`)
4. Update environment variables:
   - Backend: Set `FRONTEND_URL` and `APP_BASE_URL` to frontend URL
   - Backend: Set `VITE_API_URL` to backend URL
   - Frontend: Set `VITE_API_URL` to backend URL
5. **Redeploy** both services

### 5. Done! 🎉

Your HMS is now live on Render!

- Frontend: `https://hms-frontend-xxxx.onrender.com`
- Backend: `https://hms-backend-xxxx.onrender.com`
- API Docs: `https://hms-backend-xxxx.onrender.com/swagger-ui.html`

## 📚 Full Documentation

For detailed instructions, see [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
