<?php
/**
 * Database Configuration
 * Copy this file to database.php and update with your credentials
 */

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'trackify');
define('DB_CHARSET', 'utf8mb4');

// JWT Configuration
define('JWT_SECRET', 'your-secret-key-change-this-in-production');
define('JWT_EXPIRY', 86400); // 24 hours in seconds

// Application Configuration
define('APP_URL', 'http://localhost');
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_UPLOAD_SIZE', 5242880); // 5MB in bytes

// Email Configuration (for password reset)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com');
define('SMTP_PASS', 'your-app-password');
define('SMTP_FROM', 'noreply@trackify.com');
define('SMTP_FROM_NAME', 'Trackify');

// Timezone
date_default_timezone_set('Asia/Kolkata');

// Error Reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);
