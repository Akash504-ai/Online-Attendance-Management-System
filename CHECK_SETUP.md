# ✅ Quick Setup Check

## Run These Tests in Order

### Test 1: Backend Basic Test
**URL:** http://localhost/Trackify/backend/test.php

**Expected:** 
```json
{"success":true,"message":"Backend is working!"}
```

**If fails:** Apache not running or wrong folder name

---

### Test 2: Database Connection Test
**URL:** http://localhost/Trackify/backend/test-db.php

**Expected:**
```json
{"success":true,"message":"Database connected successfully!","user_count":3}
```

**If fails:** 
- MySQL not running
- Database not created
- Schema not imported
- Wrong credentials in database.php

---

### Test 3: Login to Frontend
**URL:** http://localhost:3000/signup

**Steps:**
1. Create account with role "Admin"
2. Login
3. Should redirect to dashboard

**If fails:**
- Frontend not running (`npm run dev`)
- Backend not accessible

---

### Test 4: Check Token
**After login, press F12 → Console, run:**
```javascript
console.log(localStorage.getItem('token'))
```

**Expected:** Long string starting with `eyJ...`

**If null:** Login failed, check backend

---

### Test 5: Test API with Token
**In browser console (F12), run:**
```javascript
fetch('http://localhost/Trackify/backend/api/users', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
}).then(r => r.json()).then(console.log)
```

**Expected:**
```json
{"success":true,"data":{"users":[...]}}
```

**If fails:** Check error message in response

---

## Quick Fixes

### "Failed to fetch users"

**Cause 1: Backend not running**
- Solution: Start Apache in XAMPP

**Cause 2: Database not set up**
- Solution: Run Test 2 above, follow error message

**Cause 3: Not logged in**
- Solution: Logout and login again

**Cause 4: Wrong API URL**
- Check: `frontend/src/lib/api.js`
- Should be: `http://localhost/Trackify/backend`

---

## Checklist

Before asking for help, verify:

- [ ] XAMPP Apache: Running ✅
- [ ] XAMPP MySQL: Running ✅
- [ ] Test 1 passes ✅
- [ ] Test 2 passes ✅
- [ ] Account created ✅
- [ ] Logged in ✅
- [ ] Test 4 shows token ✅
- [ ] Test 5 returns data ✅

If all checked, the system should work!

---

## Most Common Issue

**90% of "failed to fetch" errors are:**

1. **Apache not running** → Start it in XAMPP
2. **Database not created** → Create `trackify` in phpMyAdmin
3. **Schema not imported** → Import `database/schema.sql`
4. **Not logged in** → Create account and login

**Fix these 4 things and it will work!**
