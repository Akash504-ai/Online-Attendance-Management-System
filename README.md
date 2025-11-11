# 🏫 Trackify – Online Attendance Management System

A modern web-based platform to digitally manage attendance for institutions and organizations.

## 🚀 Features

### Student/Employee Features
- 📊 Real-time attendance dashboard with statistics
- 📅 View daily/monthly attendance records
- 📈 Analytics and trends visualization
- 📄 Export attendance reports (PDF/Excel)
- 👤 Profile management with photo upload

### Admin/Teacher Features
- 🎯 Mark and manage attendance records
- 👥 User management (Add/Edit/Remove students)
- 📊 Generate comprehensive reports
- 📧 Email notifications and alerts
- ⚙️ System settings and configuration
- 📤 Bulk import/export via CSV/Excel

## 🛠️ Tech Stack

### Backend
- PHP 8.x
- MySQL Database
- RESTful API Architecture
- JWT Authentication

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- shadcn/ui components
- Recharts for analytics
- Lucide React for icons

## 📁 Project Structure

```
Trackify/
├── backend/              # PHP API
│   ├── api/             # API endpoints
│   ├── config/          # Configuration files
│   ├── models/          # Database models
│   ├── middleware/      # Auth & validation
│   └── utils/           # Helper functions
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Utilities
│   │   └── styles/      # Global styles
│   └── public/          # Static assets
└── database/            # SQL schemas
```

## 🚀 Getting Started

### Prerequisites
- XAMPP (Apache + MySQL + PHP)
- Node.js 18+ and npm
- Modern web browser

### Backend Setup

1. Start XAMPP (Apache and MySQL)

2. Create database:
```sql
CREATE DATABASE trackify;
```

3. Import database schema:
```bash
# Import from database/schema.sql via phpMyAdmin or command line
mysql -u root -p trackify < database/schema.sql
```

4. Configure backend:
```bash
# Copy example config
cd backend/config
copy database.example.php database.php
# Edit database.php with your credentials
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

---

## 📦 Production Deployment

### Quick Deploy - Shared Hosting (cPanel)

**Step 1: Build Frontend**
```bash
cd frontend
npm install
npm run build
```

**Step 2: Upload Files**

Upload to `public_html/`:
- `frontend/dist/*` → Root of public_html
- `backend/` → `public_html/backend/`

**Step 3: Setup Database**
1. cPanel → MySQL Databases → Create database
2. phpMyAdmin → Import `database/schema.sql`

**Step 4: Configure**

Edit `backend/config/database.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');
define('DB_NAME', 'your_db_name');
define('JWT_SECRET', 'GENERATE_RANDOM_64_CHAR_STRING');
define('APP_URL', 'https://yourdomain.com');

// Production mode
error_reporting(0);
ini_set('display_errors', 0);
```

**Step 5: Create .htaccess**

Root `.htaccess` (`public_html/.htaccess`):
```apache
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Frontend SPA routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/backend
RewriteRule ^(.*)$ index.html [L,QSA]
```

**Step 6: Test**
- Visit `https://yourdomain.com`
- Login with admin@trackify.com / admin123
- **Change password immediately!**

### VPS/Cloud Deployment

For Ubuntu/Linux servers:

```bash
# Install dependencies
sudo apt update
sudo apt install -y nginx mysql-server php8.1-fpm php8.1-mysql \
    php8.1-mbstring php8.1-xml php8.1-curl nodejs npm certbot

# Setup database
sudo mysql -e "CREATE DATABASE trackify;"
sudo mysql -e "CREATE USER 'trackify_user'@'localhost' IDENTIFIED BY 'password';"
sudo mysql -e "GRANT ALL PRIVILEGES ON trackify.* TO 'trackify_user'@'localhost';"
mysql -u trackify_user -p trackify < database/schema.sql

# Build and deploy
cd frontend && npm install && npm run build
sudo mkdir -p /var/www/trackify/public
sudo cp -r dist/* /var/www/trackify/public/
sudo cp -r ../backend /var/www/trackify/public/backend

# Configure Nginx (see SETUP.md for full config)
sudo systemctl restart nginx

# Setup SSL
sudo certbot --nginx -d yourdomain.com
```

### Docker Deployment

```bash
# Build frontend
cd frontend && npm run build && cd ..

# Create docker-compose.yml (see SETUP.md)
docker-compose up -d
```

**See SETUP.md for detailed deployment instructions**

## 🔐 Default Credentials

### Admin Account
- Email: admin@trackify.com
- Password: admin123

### Teacher Account
- Email: teacher@trackify.com
- Password: teacher123

### Student Account
- Email: student@trackify.com
- Password: student123

**⚠️ Change these credentials after first login!**

## 📱 Features Overview

### Authentication
- Secure login/signup with JWT
- Password reset via email
- Role-based access control (Admin, Teacher, Student)

### Dashboard
- Attendance overview cards
- Quick action buttons
- Notifications panel
- Real-time statistics

### Attendance Management
- Mark daily attendance
- View attendance history
- Filter by date/subject/department
- Bulk operations support

### Reports & Analytics
- Visual charts and graphs
- Monthly/custom date range reports
- Export to PDF/Excel
- Attendance trends analysis

### User Management (Admin)
- Add/edit/remove users
- Assign roles and permissions
- Import users via CSV
- View individual attendance history

## 🎨 UI Features

- ✅ Fully responsive (Mobile, Tablet, Desktop)
- 🌓 Dark/Light mode support
- 🎭 Smooth animations and transitions
- 📊 Interactive charts
- 🎯 Material-inspired design

## 🔒 Security Features

- JWT-based authentication
- Password hashing (bcrypt)
- SQL injection prevention
- XSS protection
- CSRF tokens
- Role-based access control

## 📧 Email Notifications

- Low attendance alerts
- Daily/weekly attendance summaries
- Password reset emails
- System announcements

## 🤝 Contributing

This is a complete attendance management solution. Feel free to customize it for your institution's needs.

## 📄 License

MIT License - Feel free to use for educational or commercial purposes.

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for modern educational institutions**
