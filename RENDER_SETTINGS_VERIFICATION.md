# Render Settings Verification Guide

## ✅ Correct Settings for Backend Service

Based on our configuration, here are the correct settings:

### Backend Service Settings:

1. **Root Directory:**
   - **Value:** Leave **EMPTY** (or blank)
   - **Reason:** We're using Docker, so root directory should be empty

2. **Dockerfile Path:**
   - **Value:** `./backend/Dockerfile`
   - **⚠️ Important:** Remove the `$` prefix if present
   - **Correct:** `./backend/Dockerfile`
   - **Wrong:** `$./backend/Dockerfile` ❌

3. **Docker Build Context Directory:**
   - **Value:** `.` (dot/period)
   - **Reason:** This sets the build context to the repository root, allowing Docker to access `backend/` and `web-client/` directories

4. **Docker Command:**
   - **Value:** Leave **EMPTY**
   - **Reason:** The Dockerfile already has `ENTRYPOINT` defined

---

## ✅ Correct Settings for Frontend Service (if deploying separately):

1. **Root Directory:**
   - **Value:** Leave **EMPTY**

2. **Dockerfile Path:**
   - **Value:** `./web-client/Dockerfile`
   - **⚠️ Important:** No `$` prefix

3. **Docker Build Context Directory:**
   - **Value:** `.` (dot/period)

4. **Docker Command:**
   - **Value:** Leave **EMPTY**

---

## 🔧 How to Fix in Render Dashboard

### If you see `$./backend/Dockerfile`:

1. **Click on the Dockerfile Path field**
2. **Remove the `$` character**
3. **Enter:** `./backend/Dockerfile`
4. **Click "Update Fields"**

### Verify All Settings:

1. **Root Directory:** Empty ✅
2. **Dockerfile Path:** `./backend/Dockerfile` (no `$`) ✅
3. **Docker Build Context Directory:** `.` ✅
4. **Docker Command:** Empty ✅

---

## 📝 Summary

**For Backend:**
```
Root Directory: (empty)
Dockerfile Path: ./backend/Dockerfile
Docker Build Context Directory: .
Docker Command: (empty)
```

**For Frontend:**
```
Root Directory: (empty)
Dockerfile Path: ./web-client/Dockerfile
Docker Build Context Directory: .
Docker Command: (empty)
```

---

## ⚠️ Common Mistakes

1. **❌ Wrong:** `$./backend/Dockerfile` (has `$` prefix)
   **✅ Correct:** `./backend/Dockerfile`

2. **❌ Wrong:** Docker Build Context Directory = `./backend`
   **✅ Correct:** Docker Build Context Directory = `.`

3. **❌ Wrong:** Root Directory = `backend`
   **✅ Correct:** Root Directory = (empty)

---

## 🎯 After Updating Settings

1. **Click "Update Fields"**
2. **Render will automatically trigger a new build**
3. **Monitor the build logs** to ensure it succeeds
4. **If build fails**, check the logs for any path-related errors

---

## 🔍 Why These Settings?

- **Root Directory Empty:** Docker handles the directory structure
- **Dockerfile Path:** Points to the Dockerfile relative to repo root
- **Build Context `.`:** Allows Docker to access both `backend/` and `web-client/` directories
- **Docker Command Empty:** Dockerfile already defines the entrypoint

These settings match our `render.yaml` configuration and the updated Dockerfiles.
