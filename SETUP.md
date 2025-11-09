# Trackify Setup Guide

## Prerequisites

- **XAMPP** (Apache + MySQL + PHP 8.x)
- **Node.js** 18+ and npm
- Modern web browser

## Backend Setup

### 1. Start XAMPP Services

Start Apache and MySQL from XAMPP Control Panel.

### 2. Create Database

Open phpMyAdmin (http://localhost/phpmyadmin) and create a new database:

```sql
CREATE DATABASE trackify;
```

### 3. Import Database Schema

Import the database schema:
- Navigate to phpMyAdmin
- Select the `trackify` database
- Click on "Import" tab
- Choose `database/schema.sql` file
- Click "Go"

Alternatively, use command line:
```bash
mysql -u root -p trackify < database/schema.sql
```

### 4. Configure Backend

Copy the example configuration file:
```bash
cd backend/config
copy database.example.php database.php
```

Edit `backend/config/database.php` and update if needed:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'trackify');
```

### 5. Test Backend API

Open your browser and navigate to:
```
http://localhost/Trackify/backend/api/auth/login
```

You should see a JSON response (even if it's an error, it means the API is working).

## Frontend Setup

### 1. Install Dependencies

Open terminal/command prompt in the frontend directory:

```bash
cd frontend
npm install
```

This will install all required packages including:
- React
- Vite
- TailwindCSS
- Recharts
- Axios
- Radix UI components
- Lucide icons

### 2. Start Development Server

```bash
npm run dev
```

The application will start on http://localhost:3000

### 3. Build for Production

When ready to deploy:

```bash
npm run build
```

The built files will be in `frontend/dist` directory.

## Default Login Credentials

### Admin Account
- **Email:** admin@trackify.com
- **Password:** admin123

### Teacher Account
- **Email:** teacher@trackify.com
- **Password:** teacher123

### Student Account
- **Email:** student@trackify.com
- **Password:** student123

**⚠️ IMPORTANT:** Change these passwords after first login!

## Troubleshooting

### Backend Issues

**Problem:** "Database connection failed"
- **Solution:** Ensure MySQL is running in XAMPP
- Check database credentials in `backend/config/database.php`
- Verify database exists

**Problem:** "Route not found"
- **Solution:** Ensure `.htaccess` is enabled in Apache
- Check `httpd.conf` for `AllowOverride All`

**Problem:** "CORS errors"
- **Solution:** Headers are already configured in `backend/index.php`
- If issues persist, check Apache configuration

### Frontend Issues

**Problem:** "Cannot connect to API"
- **Solution:** Ensure backend is running
- Check API URL in `frontend/src/lib/api.js`
- Verify XAMPP Apache is running

**Problem:** "Module not found" errors
- **Solution:** Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**Problem:** "Port 3000 already in use"
- **Solution:** Kill the process or use a different port:
  ```bash
  npm run dev -- --port 3001
  ```

## File Structure

```
Trackify/
├── backend/              # PHP API
│   ├── api/             # API endpoints
│   │   ├── auth/        # Authentication
│   │   ├── users/       # User management
│   │   ├── attendance/  # Attendance operations
│   │   └── dashboard/   # Dashboard stats
│   ├── config/          # Configuration
│   ├── middleware/      # Auth middleware
│   └── utils/           # Helper classes
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilities & API
│   └── public/          # Static assets
└── database/            # SQL schema
```

## Features Overview

### Student/Employee Features
- ✅ Dashboard with attendance overview
- ✅ View attendance records with filters
- ✅ Analytics and trends visualization
- ✅ Profile management
- ✅ Dark/Light mode

### Admin/Teacher Features
- ✅ Admin dashboard with statistics
- ✅ User management (CRUD operations)
- ✅ Mark and manage attendance
- ✅ Generate reports
- ✅ System settings
- ✅ Low attendance alerts

### Technical Features
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Responsive design (Mobile/Tablet/Desktop)
- ✅ RESTful API architecture
- ✅ Modern UI with TailwindCSS
- ✅ Interactive charts with Recharts
- ✅ Form validation
- ✅ Toast notifications

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users` - List users (with filters)
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Attendance
- `GET /api/attendance` - List attendance records
- `GET /api/attendance/:id` - Get single record
- `POST /api/attendance` - Mark attendance
- `POST /api/attendance/bulk` - Bulk mark attendance
- `PUT /api/attendance/:id` - Update attendance
- `DELETE /api/attendance/:id` - Delete attendance
- `GET /api/attendance/stats` - Get statistics
- `GET /api/attendance/report` - Generate report

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Next Steps

1. **Customize the application** for your institution's needs
2. **Add more features** like:
   - Email notifications
   - SMS alerts
   - Biometric integration
   - Mobile app
   - Advanced reporting
3. **Secure the application** for production:
   - Change JWT secret
   - Enable HTTPS
   - Set up proper backups
   - Configure email settings
4. **Deploy to production** server

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Check browser console for errors
4. Verify database connections

## License

MIT License - Free to use for educational or commercial purposes.

---

**Built with ❤️ for modern educational institutions**
