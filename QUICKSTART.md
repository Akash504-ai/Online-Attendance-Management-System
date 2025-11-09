# 🚀 Trackify Quick Start Guide

Get your attendance management system up and running in 5 minutes!

## ⚡ Quick Setup

### Step 1: Database Setup (2 minutes)

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Start **Apache** and **MySQL**

2. **Create Database**
   - Open browser: http://localhost/phpmyadmin
   - Click "New" to create database
   - Database name: `trackify`
   - Collation: `utf8mb4_unicode_ci`
   - Click "Create"

3. **Import Schema**
   - Select `trackify` database
   - Click "Import" tab
   - Choose file: `database/schema.sql`
   - Click "Go"
   - ✅ You should see "Import has been successfully finished"

### Step 2: Backend Configuration (1 minute)

1. **Copy Configuration File**
   ```bash
   cd backend/config
   copy database.example.php database.php
   ```

2. **Verify Settings** (Optional)
   - Open `backend/config/database.php`
   - Default settings should work for XAMPP:
     - Host: `localhost`
     - User: `root`
     - Password: `` (empty)
     - Database: `trackify`

### Step 3: Frontend Setup (2 minutes)

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```
   
   This will take 1-2 minutes to download all packages.

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   VITE v5.0.8  ready in XXX ms
   ➜  Local:   http://localhost:3000/
   ```

### Step 4: Access the Application

1. **Open Browser**
   - Navigate to: http://localhost:3000

2. **Login with Demo Account**
   
   **Student Account:**
   - Email: `student@trackify.com`
   - Password: `student123`
   
   **Teacher Account:**
   - Email: `teacher@trackify.com`
   - Password: `teacher123`
   
   **Admin Account:**
   - Email: `admin@trackify.com`
   - Password: `admin123`

## 🎉 You're Done!

The application is now running with:
- ✅ Backend API at: http://localhost/Trackify/backend
- ✅ Frontend at: http://localhost:3000
- ✅ Sample data loaded

## 📱 What You Can Do Now

### As a Student:
1. View your attendance dashboard
2. Check attendance records by date
3. See analytics and trends
4. Update your profile

### As a Teacher/Admin:
1. View system statistics
2. Manage users (add/edit/delete)
3. Mark attendance
4. Generate reports
5. Configure settings

## 🔧 Common Issues & Solutions

### Issue: "Database connection failed"
**Solution:**
- Ensure MySQL is running in XAMPP
- Check database name is exactly `trackify`
- Verify `backend/config/database.php` exists

### Issue: "Cannot GET /api/..."
**Solution:**
- Ensure Apache is running in XAMPP
- Check if `.htaccess` file exists in backend folder
- Verify URL: http://localhost/Trackify/backend/api/auth/login

### Issue: Frontend won't start
**Solution:**
```bash
# Delete node_modules and reinstall
cd frontend
rmdir /s node_modules
del package-lock.json
npm install
npm run dev
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
npm run dev -- --port 3001
```

## 📚 Next Steps

1. **Explore Features**
   - Try different user roles
   - Mark some attendance
   - View analytics

2. **Customize**
   - Change colors in `frontend/src/index.css`
   - Add your institution logo
   - Modify attendance rules

3. **Add Real Data**
   - Create actual users
   - Import student list
   - Start marking real attendance

4. **Deploy**
   - Build frontend: `npm run build`
   - Move to production server
   - Configure for HTTPS

## 🆘 Need Help?

1. Check `SETUP.md` for detailed instructions
2. Review `README.md` for feature documentation
3. Check browser console for errors
4. Verify XAMPP services are running

## 🎯 Key Features

- **Dashboard**: Real-time attendance overview
- **Analytics**: Visual charts and trends
- **Reports**: Export to CSV/Excel
- **Multi-role**: Student, Teacher, Admin access
- **Responsive**: Works on mobile, tablet, desktop
- **Dark Mode**: Toggle between light/dark themes
- **Secure**: JWT authentication, role-based access

## 📊 Sample Data Included

The database comes pre-loaded with:
- 3 demo users (admin, teacher, student)
- 4 departments
- 3 classes
- 4 subjects
- Sample settings

## 🔐 Security Notes

**Before Production:**
1. Change all default passwords
2. Update JWT secret in `backend/config/database.php`
3. Enable HTTPS
4. Set up proper backups
5. Configure email settings

## 💡 Tips

- Use **Ctrl+C** to stop the frontend server
- Backend runs automatically with Apache
- Changes to frontend auto-reload
- Backend changes need Apache restart
- Check browser DevTools for debugging

---

**Enjoy using Trackify! 🎓**

For detailed documentation, see `README.md` and `SETUP.md`
