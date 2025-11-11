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

## Production Deployment

### Deployment Option 1: Shared Hosting (cPanel)

#### Step 1: Build Frontend
```bash
cd c:\xampp\htdocs\Trackify\frontend
npm install
npm run build
```

This creates `frontend/dist/` with production files.

#### Step 2: Prepare Deployment Package

Create this structure:
```
deployment-package/
├── index.html (from dist/)
├── assets/ (from dist/assets/)
├── vite.svg (from dist/)
└── backend/ (entire backend folder)
```

#### Step 3: Upload to Server

**Via FTP/cPanel File Manager:**
1. Upload all files to `public_html/`
2. Ensure `backend/` folder is in `public_html/backend/`

#### Step 4: Database Setup

1. **cPanel → MySQL Databases**
   - Create: `username_trackify`
   - Create user: `username_trackify_user`
   - Grant ALL privileges

2. **phpMyAdmin**
   - Select database
   - Import → `database/schema.sql`

#### Step 5: Configure Backend

**Edit `public_html/backend/config/database.php`:**

```php
<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'username_trackify_user');
define('DB_PASS', 'your_secure_password');
define('DB_NAME', 'username_trackify');
define('DB_CHARSET', 'utf8mb4');

// CRITICAL: Generate random 64-char string
// Use: https://www.random.org/strings/ or openssl rand -hex 32
define('JWT_SECRET', 'YOUR_RANDOM_64_CHARACTER_STRING_HERE');
define('JWT_EXPIRY', 86400);

define('APP_URL', 'https://yourdomain.com');
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_UPLOAD_SIZE', 5242880);

// Email Configuration (Gmail example)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com');
define('SMTP_PASS', 'your-gmail-app-password'); // Not regular password!
define('SMTP_FROM', 'noreply@yourdomain.com');
define('SMTP_FROM_NAME', 'Trackify');

date_default_timezone_set('Asia/Kolkata');

// PRODUCTION: Disable errors
error_reporting(0);
ini_set('display_errors', 0);
```

#### Step 6: Create .htaccess Files

**Root .htaccess** (`public_html/.htaccess`):

```apache
# Trackify Production Configuration

RewriteEngine On

# Force HTTPS (uncomment after SSL setup)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Frontend SPA Routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/backend
RewriteRule ^(.*)$ index.html [L,QSA]

Options -Indexes
AddDefaultCharset UTF-8
```

**Backend .htaccess** is already configured in `backend/.htaccess`

#### Step 7: Set Permissions

**Via SSH:**
```bash
chmod -R 755 public_html
chmod -R 775 public_html/backend/uploads
chmod 600 public_html/backend/config/database.php
```

**Via cPanel:**
- Right-click folders → Change Permissions → 755
- uploads folder → 775
- database.php → 600

#### Step 8: Test Deployment

1. Visit `https://yourdomain.com`
2. Should see login page
3. Login: `admin@trackify.com` / `admin123`
4. **IMMEDIATELY change password!**

---

### Deployment Option 2: VPS/Cloud Server (Ubuntu)

#### Quick Deployment Script

Create `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Deploying Trackify to VPS..."

# Configuration - UPDATE THESE
DOMAIN="yourdomain.com"
DB_PASS="your_secure_db_password"
APP_DIR="/var/www/trackify"

# Install dependencies
echo "Installing dependencies..."
sudo apt update
sudo apt install -y nginx mysql-server php8.1-fpm php8.1-mysql \
    php8.1-mbstring php8.1-xml php8.1-curl php8.1-zip php8.1-gd \
    nodejs npm git certbot python3-certbot-nginx unzip

# Setup MySQL
echo "Setting up database..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS trackify;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'trackify_user'@'localhost' IDENTIFIED BY '$DB_PASS';"
sudo mysql -e "GRANT ALL PRIVILEGES ON trackify.* TO 'trackify_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Import schema
if [ -f "database/schema.sql" ]; then
    mysql -u trackify_user -p"$DB_PASS" trackify < database/schema.sql
    echo "✓ Database schema imported"
fi

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Deploy files
echo "Deploying files..."
sudo mkdir -p $APP_DIR/public
sudo cp -r frontend/dist/* $APP_DIR/public/
sudo cp -r backend $APP_DIR/public/backend

# Configure backend
sudo cp backend/config/database.example.php $APP_DIR/public/backend/config/database.php

# Generate JWT secret
JWT_SECRET=$(openssl rand -hex 32)

# Update config (you may need to edit manually)
echo "Update $APP_DIR/public/backend/config/database.php with:"
echo "  DB_USER: trackify_user"
echo "  DB_PASS: $DB_PASS"
echo "  JWT_SECRET: $JWT_SECRET"

# Set permissions
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR
sudo mkdir -p $APP_DIR/public/backend/uploads
sudo chmod -R 775 $APP_DIR/public/backend/uploads
sudo chmod 600 $APP_DIR/public/backend/config/database.php

# Configure Nginx
echo "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/trackify > /dev/null <<'EOF'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;
    root /var/www/trackify/public;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /backend {
        alias /var/www/trackify/public/backend;
        try_files $uri $uri/ /backend/index.php?$query_string;
        
        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
            fastcgi_param SCRIPT_FILENAME $request_filename;
        }
    }

    location ~ /\. { deny all; }
    location ~ /config/ { deny all; }
}
EOF

# Replace domain placeholder
sudo sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/trackify

# Enable site
sudo ln -sf /etc/nginx/sites-available/trackify /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t && sudo systemctl restart nginx

# Setup SSL
echo "Setting up SSL..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || echo "SSL setup failed - run certbot manually"

echo ""
echo "✅ Deployment Complete!"
echo "Visit: https://$DOMAIN"
echo "Login: admin@trackify.com / admin123"
echo "IMPORTANT: Change default passwords!"
```

**Run:**
```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

---

### Deployment Option 3: Docker

#### Create docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: trackify-db
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword123
      MYSQL_DATABASE: trackify
      MYSQL_USER: trackify_user
      MYSQL_PASSWORD: trackify_pass123
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    networks:
      - trackify-net
    restart: unless-stopped

  backend:
    image: php:8.1-apache
    container_name: trackify-backend
    depends_on:
      - mysql
    volumes:
      - ./backend:/var/www/html
    ports:
      - "8080:80"
    environment:
      DB_HOST: mysql
      DB_USER: trackify_user
      DB_PASS: trackify_pass123
      DB_NAME: trackify
    networks:
      - trackify-net
    restart: unless-stopped
    command: >
      bash -c "docker-php-ext-install mysqli pdo pdo_mysql &&
      a2enmod rewrite headers &&
      apache2-foreground"

  frontend:
    image: nginx:alpine
    container_name: trackify-frontend
    depends_on:
      - backend
    volumes:
      - ./frontend/dist:/usr/share/nginx/html
    ports:
      - "80:80"
    networks:
      - trackify-net
    restart: unless-stopped

volumes:
  mysql_data:

networks:
  trackify-net:
    driver: bridge
```

**Deploy:**
```bash
# Build frontend first
cd frontend
npm install
npm run build
cd ..

# Start containers
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Access at: `http://localhost`

---

## Post-Deployment Checklist

### Security Tasks

- [ ] Change all default passwords
- [ ] Generate secure JWT secret (64 characters)
- [ ] Enable HTTPS/SSL certificate
- [ ] Set correct file permissions
- [ ] Disable error display (`error_reporting(0)`)
- [ ] Configure firewall (if VPS)
- [ ] Setup fail2ban (if VPS)

### Configuration Tasks

- [ ] Update `APP_URL` in database.php
- [ ] Configure SMTP for emails
- [ ] Set correct timezone
- [ ] Test email sending
- [ ] Test file uploads

### Operational Tasks

- [ ] Setup database backups
- [ ] Configure monitoring (UptimeRobot)
- [ ] Setup error logging
- [ ] Document credentials securely
- [ ] Train users

### Generate JWT Secret

```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Online
# Visit: https://www.random.org/strings/
# Generate 64 character alphanumeric string
```

### Setup Email (Gmail)

1. Enable 2-Factor Authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password in `database.php` (NOT your regular password)

### Database Backup Script

**Create `backup.sh`:**
```bash
#!/bin/bash
BACKUP_DIR="/backups/trackify"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
mysqldump -u trackify_user -p'password' trackify | gzip > $BACKUP_DIR/trackify_$DATE.sql.gz

# Keep last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: trackify_$DATE.sql.gz"
```

**Add to crontab:**
```bash
crontab -e
# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

---

## Next Steps

1. **Customize the application** for your institution's needs
2. **Add more features** like:
   - Email notifications
   - SMS alerts
   - Biometric integration
   - Mobile app
   - Advanced reporting
3. **Monitor and maintain**:
   - Check logs regularly
   - Update packages monthly
   - Review backups weekly
   - Monitor uptime
4. **Scale as needed**:
   - Add load balancer
   - Setup database replication
   - Use CDN for assets
   - Implement caching

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
