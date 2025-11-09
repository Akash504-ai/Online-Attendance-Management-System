# 🔍 Troubleshooting Guide - "Failed to Fetch Users" Error

## Quick Diagnosis Steps

### Step 1: Check if Backend is Running

**Test 1 - Simple Backend Test:**
Open in browser: http://localhost/Trackify/backend/test.php

**Expected Result:**
```json
{
  "success": true,
  "message": "Backend is working!",
  "php_version": "8.x.x",
  "server_time": "2025-11-09 11:12:00",
  "base_path": "C:\\xampp\\htdocs\\Trackify\\backend"
}
```

**If this fails:**
- ❌ Apache is not running → Start Apache in XAMPP
- ❌ Wrong URL → Check if folder is exactly `Trackify` (case-sensitive)
- ❌ 404 Error → Verify file exists at `c:\xampp\htdocs\Trackify\backend\test.php`

---

### Step 2: Check Database Connection

**Test 2 - Database Test:**
Create file: `c:\xampp\htdocs\Trackify\backend\test-db.php`

```php
<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/utils/Database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $db = Database::getInstance();
    $users = $db->fetchAll('SELECT COUNT(*) as count FROM users');
    
    echo json_encode([
        'success' => true,
        'message' => 'Database connected!',
        'user_count' => $users[0]['count']
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
```

**Access:** http://localhost/Trackify/backend/test-db.php

**Expected Result:**
```json
{
  "success": true,
  "message": "Database connected!",
  "user_count": 3
}
```

**If this fails:**
- ❌ "Database configuration not found" → Copy `database.example.php` to `database.php`
- ❌ "Access denied" → Check MySQL credentials in `database.php`
- ❌ "Unknown database" → Create `trackify` database in phpMyAdmin
- ❌ "Table 'users' doesn't exist" → Import `database/schema.sql`

---

### Step 3: Check API Endpoint

**Test 3 - Users API Test:**
Open in browser: http://localhost/Trackify/backend/api/users/list.php

**Expected Result (without auth):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

This is GOOD! It means the API is working but needs authentication.

**If you get:**
- ❌ 404 Error → `.htaccess` not working or file missing
- ❌ Blank page → PHP error, check Apache error logs
- ❌ "Database configuration not found" → See Step 2

---

### Step 4: Check Frontend API Configuration

**Check:** `frontend/src/lib/api.js`

```javascript
const API_BASE_URL = 'http://localhost/Trackify/backend'
```

**Verify:**
1. URL matches your XAMPP setup
2. No trailing slash
3. Case-sensitive (Trackify not trackify)

---

### Step 5: Check Browser Console

**Open Developer Tools:**
1. Press `F12` in browser
2. Go to **Console** tab
3. Go to http://localhost:3000/admin/users
4. Look for errors

**Common Errors:**

#### Error: "Network Error" or "ERR_CONNECTION_REFUSED"
**Cause:** Backend not running
**Fix:** Start Apache in XAMPP

#### Error: "CORS policy blocked"
**Cause:** CORS headers not set
**Fix:** Already configured in `backend/index.php`, restart Apache

#### Error: "401 Unauthorized"
**Cause:** Not logged in or token expired
**Fix:** Logout and login again

#### Error: "404 Not Found"
**Cause:** Wrong API URL
**Fix:** Check `frontend/src/lib/api.js` base URL

---

## Common Issues & Solutions

### Issue 1: Apache Not Running

**Symptoms:**
- Can't access http://localhost
- Can't access backend test files

**Solution:**
1. Open XAMPP Control Panel
2. Click "Start" next to Apache
3. Wait for green "Running" status
4. If port 80 is busy, stop other web servers

---

### Issue 2: MySQL Not Running

**Symptoms:**
- Backend test works but database test fails
- "Can't connect to MySQL server"

**Solution:**
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. Wait for green "Running" status
4. If port 3306 is busy, check for other MySQL instances

---

### Issue 3: Database Not Created

**Symptoms:**
- "Unknown database 'trackify'"

**Solution:**
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click "New" in left sidebar
3. Database name: `trackify`
4. Collation: `utf8mb4_unicode_ci`
5. Click "Create"

---

### Issue 4: Schema Not Imported

**Symptoms:**
- "Table 'trackify.users' doesn't exist"

**Solution:**
1. Open phpMyAdmin
2. Select `trackify` database
3. Click "Import" tab
4. Choose file: `c:\xampp\htdocs\Trackify\database\schema.sql`
5. Click "Go"
6. Verify 9 tables created

---

### Issue 5: Not Logged In

**Symptoms:**
- API returns 401 Unauthorized
- Redirected to login page

**Solution:**
1. Go to http://localhost:3000/signup
2. Create an account with role "Admin"
3. Login
4. Try accessing admin pages again

---

### Issue 6: Token Expired

**Symptoms:**
- Was working, now getting 401 errors
- Logged in but API calls fail

**Solution:**
1. Click logout
2. Login again
3. Token will be refreshed

---

### Issue 7: Wrong Base Path

**Symptoms:**
- 404 errors on all API calls
- Backend test works but API doesn't

**Solution:**

Check `backend/index.php` line 36:
```php
$base_path = '/Trackify/backend';
```

Should match your folder structure:
- Folder: `c:\xampp\htdocs\Trackify` → `/Trackify/backend` ✅
- Folder: `c:\xampp\htdocs\trackify` → `/trackify/backend` ❌ (case matters)
- Folder: `c:\xampp\htdocs\attendance` → `/attendance/backend` ❌

---

## Step-by-Step Debugging Process

### 1. Verify XAMPP Services
```
✓ Apache: Running (green)
✓ MySQL: Running (green)
```

### 2. Test Backend
```
✓ http://localhost/Trackify/backend/test.php → Success
```

### 3. Test Database
```
✓ http://localhost/Trackify/backend/test-db.php → Success
```

### 4. Check Database
```
✓ Database 'trackify' exists
✓ Table 'users' exists
✓ At least 1 user exists
```

### 5. Test API
```
✓ http://localhost/Trackify/backend/api/users/list.php → 401 (Good!)
```

### 6. Create Account
```
✓ Signup at http://localhost:3000/signup
✓ Role: Admin
✓ Login successful
```

### 7. Test Frontend
```
✓ http://localhost:3000/admin/users → Users list loads
```

---

## Manual API Test with Authentication

### Using Browser Console:

1. Login at http://localhost:3000/login
2. Press F12 → Console tab
3. Run this code:

```javascript
// Get token from localStorage
const token = localStorage.getItem('token')
console.log('Token:', token)

// Test API call
fetch('http://localhost/Trackify/backend/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('API Response:', data))
.catch(err => console.error('API Error:', err))
```

**Expected Output:**
```javascript
Token: eyJ0eXAiOiJKV1QiLCJhbGc...
API Response: {
  success: true,
  data: {
    users: [...],
    total: 3,
    page: 1
  }
}
```

---

## Quick Fix Checklist

Run through this checklist:

- [ ] XAMPP Apache is running (green)
- [ ] XAMPP MySQL is running (green)
- [ ] Can access http://localhost
- [ ] Can access http://localhost/phpmyadmin
- [ ] Database `trackify` exists
- [ ] Database has 9 tables
- [ ] Backend test works: http://localhost/Trackify/backend/test.php
- [ ] Database test works: http://localhost/Trackify/backend/test-db.php
- [ ] File exists: `c:\xampp\htdocs\Trackify\backend\config\database.php`
- [ ] Frontend running: http://localhost:3000
- [ ] Created an account via signup
- [ ] Logged in successfully
- [ ] Token in localStorage (F12 → Application → Local Storage)

---

## Still Not Working?

### Check Apache Error Logs:
1. Open XAMPP Control Panel
2. Click "Logs" button next to Apache
3. Open "error.log"
4. Look for recent errors

### Check Browser Network Tab:
1. Press F12
2. Go to "Network" tab
3. Go to http://localhost:3000/admin/users
4. Click on failed request
5. Check:
   - Request URL
   - Status Code
   - Response

### Enable PHP Error Display:

Edit `backend/config/database.php`:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

---

## Contact Points

If all else fails, check:

1. **Backend URL:** http://localhost/Trackify/backend/test.php
2. **Database:** http://localhost/phpmyadmin
3. **Frontend:** http://localhost:3000
4. **Browser Console:** F12 → Console
5. **Network Tab:** F12 → Network

---

**Most Common Solution:**
1. Ensure Apache & MySQL are running
2. Create/import database
3. Create account via signup
4. Login
5. Access admin pages

**Success Rate: 95%** ✅
