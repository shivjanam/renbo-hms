# How to Upload Environment Variables to Render

## Method 1: Copy-Paste Individual Variables (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your backend service** (`hms-backend` or `renbo-hms`)
3. **Click "Environment"** tab
4. **Open `backend.env` file** from this repository
5. **Copy each variable** and paste into Render:
   - Click **"Add Environment Variable"**
   - Paste **Key** (left side)
   - Paste **Value** (right side)
   - Click **"Save Changes"**
6. **Repeat** for all variables in `backend.env`

## Method 2: Using Render CLI (Advanced)

```bash
# Install Render CLI
npm install -g render-cli

# Login to Render
render login

# Set environment variables from file
render env:set --service-id <your-service-id> --file backend.env
```

## Method 3: Manual Entry (If needed)

Copy variables from `backend.env` one by one into Render dashboard.

---

## ⚠️ Important Notes

- **Don't upload** `.env` file directly (it contains secrets)
- **Use** `backend.env` file provided
- **Update** `RESEND_API_KEY` and `MAIL_USERNAME` if you have them
- **Verify** all URLs are correct after adding
- **Save** after adding all variables
- **Service will auto-redeploy** after saving

---

## ✅ Quick Checklist

After adding all variables, verify:

- [ ] `DATABASE_URL` is set correctly
- [ ] `FRONTEND_URL` = https://renbo-hms.vercel.app
- [ ] `VITE_API_URL` = https://renbo-hms.onrender.com
- [ ] `JWT_SECRET` and `ENCRYPTION_KEY` are set
- [ ] All hospital information is filled
- [ ] Service redeploys successfully

---

## 📝 Variables Count

Total variables in `backend.env`: ~30 variables

**Required (Must have):**
- DATABASE_URL, DB_USERNAME, DB_PASSWORD
- JWT_SECRET, ENCRYPTION_KEY
- FRONTEND_URL, APP_BASE_URL, VITE_API_URL
- SPRING_PROFILES_ACTIVE

**Optional (Can update later):**
- RESEND_API_KEY, MAIL_USERNAME (if using email)
- RAZORPAY_* (if using Razorpay payments)
