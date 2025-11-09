# ✅ Trackify Installation Checklist

Use this checklist to ensure proper installation and configuration.

## Pre-Installation

- [ ] XAMPP installed (Apache + MySQL + PHP 8.x)
- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Modern web browser (Chrome, Firefox, Edge, Safari)
- [ ] Text editor (VS Code, Sublime, etc.)

## Backend Setup

### Database
- [ ] XAMPP Control Panel opened
- [ ] Apache started (green indicator)
- [ ] MySQL started (green indicator)
- [ ] phpMyAdmin accessible at http://localhost/phpmyadmin
- [ ] Database `trackify` created
- [ ] Collation set to `utf8mb4_unicode_ci`
- [ ] `database/schema.sql` imported successfully
- [ ] 9 tables created (users, attendance, subjects, etc.)
- [ ] Sample data loaded (3 demo users)

### Configuration
- [ ] `backend/config/database.php` file exists
- [ ] Database credentials correct:
  - [ ] DB_HOST = 'localhost'
  - [ ] DB_USER = 'root'
  - [ ] DB_PASS = '' (or your password)
  - [ ] DB_NAME = 'trackify'
- [ ] JWT_SECRET configured (change in production)
- [ ] Timezone set correctly
- [ ] Upload directory exists: `backend/uploads/`

### Testing Backend
- [ ] Can access: http://localhost/Trackify/backend/
- [ ] API responds at: http://localhost/Trackify/backend/api/auth/login
- [ ] No PHP errors in Apache error log
- [ ] `.htaccess` files present in backend folders

## Frontend Setup

### Installation
- [ ] Navigated to `frontend` directory
- [ ] Ran `npm install` successfully
- [ ] All dependencies installed (check for errors)
- [ ] `node_modules` folder created
- [ ] No vulnerability warnings (or acceptable)

### Configuration
- [ ] `frontend/.env` file created (optional)
- [ ] API URL configured if needed
- [ ] `jsconfig.json` exists for path aliases
- [ ] TailwindCSS config present

### Testing Frontend
- [ ] Ran `npm run dev` successfully
- [ ] Dev server started on http://localhost:3000
- [ ] No compilation errors
- [ ] Browser opens automatically or manually
- [ ] Login page loads correctly
- [ ] No console errors in browser DevTools

## Application Testing

### Authentication
- [ ] Can access login page
- [ ] Can login with student account (student@trackify.com / student123)
- [ ] Can login with teacher account (teacher@trackify.com / teacher123)
- [ ] Can login with admin account (admin@trackify.com / admin123)
- [ ] JWT token stored in localStorage
- [ ] Logout works correctly
- [ ] Protected routes redirect to login when not authenticated

### Student Features
- [ ] Dashboard loads with statistics
- [ ] Attendance page shows records
- [ ] Analytics page displays charts
- [ ] Profile page loads user data
- [ ] Can update profile information
- [ ] Can change password
- [ ] Dark/Light theme toggle works

### Admin Features
- [ ] Admin dashboard shows system stats
- [ ] Can view users list
- [ ] Can search/filter users
- [ ] Can view attendance records
- [ ] Reports page accessible
- [ ] Settings page accessible

### Responsive Design
- [ ] Works on desktop (> 1024px)
- [ ] Works on tablet (768px - 1024px)
- [ ] Works on mobile (< 768px)
- [ ] Bottom navigation appears on mobile
- [ ] Mobile menu works correctly
- [ ] Charts resize properly

### UI/UX
- [ ] All pages load without errors
- [ ] Navigation works smoothly
- [ ] Forms submit correctly
- [ ] Toast notifications appear
- [ ] Loading states show properly
- [ ] Error messages display correctly
- [ ] Icons render properly (Lucide React)

## Security Checks

- [ ] Cannot access admin routes as student
- [ ] Cannot access other users' data
- [ ] API returns 401 for unauthorized requests
- [ ] Passwords are hashed in database
- [ ] JWT tokens expire correctly
- [ ] SQL injection protection working (prepared statements)

## Performance Checks

- [ ] Pages load quickly (< 2 seconds)
- [ ] API responses fast (< 500ms)
- [ ] No memory leaks in browser
- [ ] Charts render smoothly
- [ ] No console warnings/errors
- [ ] Images load properly

## Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Documentation Review

- [ ] README.md reviewed
- [ ] SETUP.md reviewed
- [ ] QUICKSTART.md reviewed
- [ ] PROJECT_SUMMARY.md reviewed
- [ ] All demo credentials noted

## Production Preparation (Before Going Live)

- [ ] Change all default passwords
- [ ] Update JWT_SECRET to random string
- [ ] Configure email settings (SMTP)
- [ ] Set up SSL/HTTPS
- [ ] Configure proper database backups
- [ ] Set up error logging
- [ ] Disable PHP error display
- [ ] Set up monitoring
- [ ] Configure firewall rules
- [ ] Test on production server
- [ ] Create admin documentation
- [ ] Train users

## Optional Enhancements

- [ ] Custom logo added
- [ ] Institution name updated
- [ ] Color scheme customized
- [ ] Additional users created
- [ ] Real attendance data imported
- [ ] Email notifications configured
- [ ] Backup system set up
- [ ] Analytics tracking added

## Troubleshooting Completed

If you encountered issues, mark what you fixed:

- [ ] Fixed database connection issues
- [ ] Resolved CORS errors
- [ ] Fixed routing problems
- [ ] Resolved npm install errors
- [ ] Fixed port conflicts
- [ ] Resolved permission issues
- [ ] Fixed .htaccess issues

## Final Verification

- [ ] All features working as expected
- [ ] No critical errors in logs
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Documentation accessible
- [ ] Backup created
- [ ] Ready for use

## Sign-Off

**Installation Date**: _______________

**Installed By**: _______________

**Verified By**: _______________

**Notes**:
_________________________________
_________________________________
_________________________________

---

## Quick Reference

### Start Application
```bash
# Terminal 1: Backend (XAMPP)
# Just ensure Apache and MySQL are running in XAMPP

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost/Trackify/backend
- **phpMyAdmin**: http://localhost/phpmyadmin

### Demo Accounts
- **Admin**: admin@trackify.com / admin123
- **Teacher**: teacher@trackify.com / teacher123
- **Student**: student@trackify.com / student123

### Support Files
- `README.md` - Overview
- `SETUP.md` - Detailed setup
- `QUICKSTART.md` - Quick start
- `PROJECT_SUMMARY.md` - Complete summary

---

**✅ Installation Complete!**

If all items are checked, your Trackify installation is ready to use!
