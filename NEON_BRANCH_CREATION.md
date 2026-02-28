# Neon Branch Creation - Visual Guide

## 🎯 Creating HMS Database Branch in Neon

Based on the Neon UI, here's exactly what to do:

---

## Step-by-Step with UI Details

### 1. Open Neon Dashboard
- Go to: https://console.neon.tech
- Sign in to your account
- Select your project

### 2. Navigate to Branches
- Click **"Branches"** in the left sidebar
- Click **"Create Branch"** button

### 3. Configure the Branch Dialog

You'll see the **"Create new branch"** dialog with these options:

#### **Parent branch** (Dropdown)
- **Select**: Your main branch (usually `production` or `main`)
- This is the branch you're copying from

#### **Branch name** (Text Input)
- **Enter**: `hms_db`
- This will be your new HMS database name
- Can also use: `hospital_management_db` or any name you prefer

#### **Automatically delete branch after** (Checkbox + Dropdown)
- ⚠️ **Leave UNCHECKED** for a permanent database
- Only check if you want the branch to auto-delete after a set time (e.g., 1 day)
- For production HMS database, keep this unchecked

#### **Data Inclusion Options** (Radio Buttons) ⭐ **CRITICAL**

**Select: "Schema only (Beta)"** ✅
- ✅ Creates database with **table structures only**
- ✅ **No data** copied (clean slate)
- ✅ Perfect for HMS initialization with sample data
- ✅ Shows remaining space: "536.87 MB remaining space"
- ✅ This is what you want!

**DO NOT SELECT:**
- ❌ **"Current data"** - Would copy all CMS + HMS tables AND data
- ❌ **"Past data"** - Would copy historical data up to a date
- ❌ **"Anonymized data"** - For testing with masked sensitive data

### 4. Create the Branch
- Click the **"Create"** button (black button at bottom)
- Wait a few seconds for branch creation
- Neon will show the connection details

---

## 📋 Summary of Settings

| Setting | Value |
|---------|-------|
| **Parent branch** | `production` (or your main branch) |
| **Branch name** | `hms_db` |
| **Auto-delete** | ❌ Unchecked |
| **Data option** | ✅ **Schema only (Beta)** |

---

## ✅ After Creation

1. **Copy connection string** from Neon dashboard
2. **Update Render** environment variables with new connection
3. **Backend will create HMS tables** automatically
4. **DataInitializer will populate** sample data

---

## 🎯 Why "Schema only"?

- ✅ Clean database (no CMS data)
- ✅ No existing HMS data (fresh start)
- ✅ Table structures copied (ready for HMS)
- ✅ `DataInitializer` can populate sample data automatically
- ✅ Perfect for your use case!

---

## 📸 Visual Reference

The dialog shows:
- Left side: Configuration options
- Right side: Information panel explaining branches
- Bottom: Cancel and Create buttons

**Key visual indicator:**
- "Schema only (Beta)" radio button should be **selected** (filled circle)
- Other options should be **unselected** (empty circles)

---

## 🆘 Troubleshooting

### Branch creation failed
- Check your Neon account limits
- Verify parent branch exists
- Try a different branch name

### Wrong data copied
- If you selected "Current data" by mistake:
  1. Delete the branch
  2. Create new branch with "Schema only"
  3. Or manually drop CMS tables after creation

### Connection string not showing
- Refresh the Neon dashboard
- Check branch was created successfully
- Go to branch settings → Connection details

---

**After creating the branch, proceed to Step 3: Update Render Environment Variables** ✅
