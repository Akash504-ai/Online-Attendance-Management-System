# 🔐 Trackify Authentication Guide

## Overview

Trackify now uses a **self-registration system** where users can create their own accounts with their desired role (Student, Teacher, or Administrator).

## ✅ Changes Made

### What's New:
- ✅ **Role Selection** during signup (Student, Teacher, Admin)
- ✅ **Department** field for organization
- ✅ **Phone Number** field for contact
- ✅ **Removed Demo Credentials** from login page
- ✅ **Self-service account creation** for all roles

### What's Removed:
- ❌ Demo credentials display on login page
- ❌ Pre-created demo accounts requirement

## 🚀 How to Use

### Creating Your First Admin Account

1. **Start the Application**
   ```bash
   # Ensure XAMPP is running (Apache + MySQL)
   # Start frontend
   cd c:\xampp\htdocs\Trackify\frontend
   npm run dev
   ```

2. **Access Signup Page**
   - Open browser: http://localhost:3000
   - Click "Sign up" link on login page

3. **Fill Registration Form**
   - **Full Name**: Your name
   - **Email**: Your email address
   - **Password**: Choose a secure password (min 6 characters)
   - **Confirm Password**: Re-enter password
   - **Role**: Select **Administrator**
   - **Department**: e.g., "Administration" or "IT"
   - **Phone Number**: Your contact number (optional)

4. **Create Account**
   - Click "Create Account" button
   - You'll be automatically logged in
   - Redirected to admin dashboard

### Creating Teacher Accounts

Follow the same process but select **Teacher** as the role.

### Creating Student Accounts

Follow the same process but select **Student** as the role (default).

## 📋 Signup Form Fields

| Field | Required | Description |
|-------|----------|-------------|
| Full Name | ✅ Yes | User's full name |
| Email | ✅ Yes | Must be unique, used for login |
| Password | ✅ Yes | Minimum 6 characters |
| Confirm Password | ✅ Yes | Must match password |
| Role | ✅ Yes | Student / Teacher / Administrator |
| Department | ❌ No | User's department/division |
| Phone Number | ❌ No | Contact number |

## 🔑 Role Permissions

### Student
- View personal dashboard
- View attendance records
- View analytics
- Update profile
- Cannot access admin features

### Teacher
- All student features
- View class statistics
- Mark attendance (when implemented)
- View student lists
- Access teacher dashboard

### Administrator
- All teacher features
- Full user management (CRUD)
- System-wide statistics
- Manage all attendance records
- System configuration
- Access admin dashboard

## 🎯 First-Time Setup Workflow

### Step 1: Database Setup
```bash
# Ensure database is created and schema imported
# Open phpMyAdmin: http://localhost/phpmyadmin
# Create database: trackify
# Import: database/schema.sql
```

### Step 2: Create Admin Account
1. Go to http://localhost:3000/signup
2. Fill form with admin details
3. Select "Administrator" role
4. Submit form

### Step 3: Create Additional Users
**Option A: Self-Registration**
- Share signup link with teachers/students
- They create their own accounts
- Select appropriate role

**Option B: Admin Creates Users**
- Login as admin
- Go to "Manage Users"
- Click "Add New User"
- Fill user details and assign role

## 🔒 Security Features

### Password Security
- Minimum 6 characters required
- Passwords hashed with bcrypt
- Confirmation required during signup
- Password reset available via email

### Email Validation
- Must be valid email format
- Must be unique in system
- Used as login identifier

### Role-Based Access
- Routes protected based on role
- API endpoints check user permissions
- Unauthorized access redirected

## 📱 User Experience

### Login Flow
1. Enter email and password
2. Click "Sign In"
3. Redirected based on role:
   - **Admin/Teacher** → `/admin/dashboard`
   - **Student** → `/dashboard`

### Signup Flow
1. Click "Sign up" from login page
2. Fill registration form
3. Select role
4. Submit form
5. Auto-login and redirect to dashboard

### Forgot Password Flow
1. Click "Forgot password?" on login
2. Enter email address
3. Receive reset link (email integration required)
4. Create new password

## 🛠️ API Endpoints

### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin",
  "department": "IT",
  "phone": "+91 1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "department": "IT",
      "phone": "+91 1234567890",
      "status": "active"
    }
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

## 🎨 UI Components

### Signup Form Features
- ✅ Real-time validation
- ✅ Password confirmation check
- ✅ Role dropdown selector
- ✅ Loading states
- ✅ Error messages
- ✅ Success notifications
- ✅ Responsive design

### Login Form Features
- ✅ Email and password fields
- ✅ Forgot password link
- ✅ Sign up link
- ✅ Loading states
- ✅ Error handling
- ✅ Auto-redirect based on role

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','teacher','student') DEFAULT 'student',
  `phone` varchar(20) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `class` varchar(50) DEFAULT NULL,
  `roll_number` varchar(50) DEFAULT NULL UNIQUE,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
```

## 🔄 Migration from Demo System

If you previously had demo accounts:

### Option 1: Keep Demo Accounts
The demo accounts from `schema.sql` still exist in the database:
- admin@trackify.com / admin123
- teacher@trackify.com / teacher123
- student@trackify.com / student123

You can still login with these if you imported the schema.

### Option 2: Remove Demo Accounts
```sql
-- Login to phpMyAdmin or MySQL
DELETE FROM users WHERE email IN (
  'admin@trackify.com',
  'teacher@trackify.com',
  'student@trackify.com'
);
```

### Option 3: Fresh Start
```sql
-- Clear all users
TRUNCATE TABLE users;

-- Then create your own accounts via signup
```

## 🎓 Best Practices

### For Administrators
1. Create your admin account first
2. Use a strong, unique password
3. Keep admin credentials secure
4. Create teacher accounts or share signup link
5. Monitor user registrations
6. Deactivate unused accounts

### For Teachers
1. Use institutional email
2. Specify correct department
3. Keep contact information updated
4. Verify role is set to "Teacher"

### For Students
1. Use personal or institutional email
2. Provide accurate information
3. Remember your credentials
4. Update profile after first login

## 🐛 Troubleshooting

### Issue: "Email already exists"
**Solution:** Email must be unique. Use a different email or reset password if you forgot credentials.

### Issue: "Password too short"
**Solution:** Password must be at least 6 characters long.

### Issue: "Passwords do not match"
**Solution:** Ensure password and confirm password fields are identical.

### Issue: "Cannot create account"
**Solution:** 
- Check database connection
- Ensure `users` table exists
- Check Apache error logs
- Verify backend API is running

### Issue: "Not redirected after signup"
**Solution:**
- Check browser console for errors
- Verify JWT token is being stored
- Check network tab for API response

## 📞 Support

### Common Questions

**Q: Can I change my role after signup?**
A: Only administrators can change user roles through the admin panel.

**Q: What if I forget my password?**
A: Use the "Forgot password?" link on login page (requires email configuration).

**Q: Can I have multiple admin accounts?**
A: Yes, anyone can signup as an administrator.

**Q: Is there a limit on user accounts?**
A: No limit, create as many accounts as needed.

**Q: Can I delete my account?**
A: Contact an administrator to delete your account.

## 🔐 Security Recommendations

### Production Deployment
1. ✅ Change JWT_SECRET in `backend/config/database.php`
2. ✅ Enable HTTPS
3. ✅ Implement email verification
4. ✅ Add CAPTCHA to signup form
5. ✅ Set up rate limiting
6. ✅ Enable two-factor authentication
7. ✅ Regular security audits
8. ✅ Monitor failed login attempts

### Password Policy
- Minimum 8 characters (increase from 6)
- Require uppercase, lowercase, numbers
- Require special characters
- Password expiry (90 days)
- Prevent password reuse

## 📝 Summary

The authentication system now provides:
- ✅ **Self-service registration** for all roles
- ✅ **No demo credentials** needed
- ✅ **Role-based access control** from signup
- ✅ **Professional user experience**
- ✅ **Secure password handling**
- ✅ **Flexible user management**

---

**Ready to use! Create your first account and start managing attendance.** 🎉
