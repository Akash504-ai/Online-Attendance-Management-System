# 🔍 Debug Authentication Issue

## The Problem

- ✅ Backend works: http://localhost/Trackify/backend/test-api.php
- ✅ Frontend loads: http://localhost:3000
- ❌ Admin pages fail: "Failed to fetch users"

**This means:** Authentication is the issue, not CORS!

---

## 🔍 Check If You're Logged In

### Step 1: Open Browser Console
1. Go to: http://localhost:3000/admin/users
2. Press **F12**
3. Go to **Console** tab
4. Run this command:

```javascript
console.log('Token:', localStorage.getItem('token'))
console.log('User:', localStorage.getItem('user'))
```

### Expected Results:

**If logged in:**
```
Token: eyJ0eXAiOiJKV1QiLCJhbGc... (long string)
User: {"id":1,"name":"...","role":"admin"}
```

**If NOT logged in:**
```
Token: null
User: null
```

---

## ✅ Solution: Login Again

### Option 1: Create New Account
1. Go to: http://localhost:3000/signup
2. Fill the form:
   - Name: Your Name
   - Email: your@email.com
   - Password: password123
   - Confirm Password: password123
   - **Role: Administrator** ← Important!
   - Department: IT
   - Phone: (optional)
3. Click "Create Account"
4. Should auto-login and redirect

### Option 2: Login with Existing Account
1. Go to: http://localhost:3000/login
2. Enter your email and password
3. Click "Sign In"
4. Should redirect to dashboard

---

## 🔍 Test Authentication

After logging in, run this in console (F12):

```javascript
// Check token exists
const token = localStorage.getItem('token')
console.log('Token exists:', !!token)

// Test API call with token
fetch('http://localhost/Trackify/backend/api/users', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => {
  console.log('✅ API Response:', data)
  if (data.success) {
    console.log('✅ Users fetched:', data.data.users.length)
  } else {
    console.log('❌ API Error:', data.message)
  }
})
.catch(err => console.error('❌ Network Error:', err))
```

### Expected Results:

**If working:**
```
✅ API Response: {success: true, data: {users: [...], total: 3}}
✅ Users fetched: 3
```

**If token invalid:**
```
❌ API Error: Unauthorized
```

**If network error:**
```
❌ Network Error: ...
```

---

## 🔧 Common Issues

### Issue 1: Token is null
**Cause:** Not logged in  
**Fix:** Login or signup

### Issue 2: Token exists but API returns 401
**Cause:** Token expired or invalid  
**Fix:** Logout and login again

### Issue 3: Token exists but "Network Error"
**Cause:** Backend not accessible  
**Fix:** Check Apache is running

---

## 📋 Step-by-Step Fix

### 1. Clear Everything
```javascript
// Run in console (F12)
localStorage.clear()
console.log('✅ Storage cleared')
```

### 2. Logout (if logged in)
- Click logout button
- Or go to: http://localhost:3000/login

### 3. Create New Account
- Go to: http://localhost:3000/signup
- **Important:** Select role "Administrator"
- Submit form

### 4. Verify Login
```javascript
// Run in console
console.log('Token:', localStorage.getItem('token'))
console.log('User:', JSON.parse(localStorage.getItem('user')))
```

### 5. Test Admin Page
- Go to: http://localhost:3000/admin/users
- Should load users list

---

## 🎯 Quick Test

Run this complete test in browser console:

```javascript
// Complete authentication test
(async function() {
  console.log('=== Authentication Test ===')
  
  // Check token
  const token = localStorage.getItem('token')
  console.log('1. Token exists:', !!token)
  
  if (!token) {
    console.log('❌ Not logged in! Go to /signup or /login')
    return
  }
  
  // Check user
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  console.log('2. User:', user.name, '- Role:', user.role)
  
  if (user.role !== 'admin' && user.role !== 'teacher') {
    console.log('❌ Not admin/teacher! Need admin role for /admin/users')
    return
  }
  
  // Test API
  console.log('3. Testing API...')
  try {
    const response = await fetch('http://localhost/Trackify/backend/api/users', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    console.log('4. API Response:', data)
    
    if (data.success) {
      console.log('✅ SUCCESS! Users:', data.data.users.length)
    } else {
      console.log('❌ API Error:', data.message)
    }
  } catch (err) {
    console.log('❌ Network Error:', err.message)
  }
})()
```

---

## 🔐 Database Check

If you can't login, check if users exist:

1. Open: http://localhost/phpmyadmin
2. Select database: `trackify`
3. Click table: `users`
4. Should see at least 1 user

**If no users:**
- Import `database/schema.sql` again
- Or create account via signup

---

## ✅ Expected Flow

1. **Signup** → Creates account + auto-login
2. **Token stored** in localStorage
3. **API calls** include token in Authorization header
4. **Backend validates** token
5. **Returns data** if valid

---

## 🚨 Most Likely Issue

**You're not logged in!**

**Quick Fix:**
1. Go to: http://localhost:3000/signup
2. Create account with role "Administrator"
3. Should auto-login
4. Go to: http://localhost:3000/admin/users
5. Should work!

---

**Try logging in and test again!** 🔐
