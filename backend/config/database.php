<?php
/**
 * Database Configuration for Render PostgreSQL
 * (hard-coded credentials – use only for testing or in a private repo)
 */

define('DB_HOST', 'dpg-d49ptjuuk2gs739fnh90-a.oregon-postgres.render.com');
define('DB_PORT', 5432);
define('DB_USER', 'trackify_user');
define('DB_PASS', 'Mj63AUUeUKMUPR0r7HyHDE0UPIFP7kV2');   // ⚠️ hard-coded password
define('DB_NAME', 'trackify_wffq');
define('DB_CHARSET', 'utf8');

// JWT Configuration
define('JWT_SECRET', 'your-secret-key-change-this-in-production');
define('JWT_EXPIRY', 86400); // 24 hours in seconds

// Application Configuration
define('APP_URL', 'https://online-attendance-management-system-1.onrender.com');
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_UPLOAD_SIZE', 5242880); // 5 MB

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

/**
 * Create PDO connection (PostgreSQL)
 */
try {
    $dsn = sprintf('pgsql:host=%s;port=%d;dbname=%s;', DB_HOST, DB_PORT, DB_NAME);
    $pdo = new PDO($dsn, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]));
}
