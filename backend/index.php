<?php
/**
 * Trackify API Entry Point
 */

// Set CORS headers BEFORE any output
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 3600');
header('Content-Type: application/json');

// Handle preflight requests immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load configuration
if (!file_exists(__DIR__ . '/config/database.php')) {
    echo json_encode([
        'success' => false,
        'message' => 'Database configuration not found. Please copy config/database.example.php to config/database.php'
    ]);
    exit();
}

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/utils/Database.php';
require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/middleware/Auth.php';

// Get request URI and method
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Remove base path and query string
$base_path = '/Trackify/backend';
$uri = str_replace($base_path, '', parse_url($request_uri, PHP_URL_PATH));

// Route the request
$routes = [
    // Authentication routes
    'POST /api/auth/login' => 'api/auth/login.php',
    'POST /api/auth/signup' => 'api/auth/signup.php',
    'POST /api/auth/logout' => 'api/auth/logout.php',
    'POST /api/auth/forgot-password' => 'api/auth/forgot-password.php',
    'POST /api/auth/reset-password' => 'api/auth/reset-password.php',
    'GET /api/auth/me' => 'api/auth/me.php',
    
    // User routes
    'GET /api/users' => 'api/users/list.php',
    'GET /api/users/:id' => 'api/users/get.php',
    'POST /api/users' => 'api/users/create.php',
    'PUT /api/users/:id' => 'api/users/update.php',
    'DELETE /api/users/:id' => 'api/users/delete.php',
    'POST /api/users/import' => 'api/users/import.php',
    'GET /api/users/export' => 'api/users/export.php',
    
    // Attendance routes
    'GET /api/attendance' => 'api/attendance/list.php',
    'GET /api/attendance/:id' => 'api/attendance/get.php',
    'POST /api/attendance' => 'api/attendance/mark.php',
    'PUT /api/attendance/:id' => 'api/attendance/update.php',
    'DELETE /api/attendance/:id' => 'api/attendance/delete.php',
    'POST /api/attendance/bulk' => 'api/attendance/bulk.php',
    'GET /api/attendance/stats' => 'api/attendance/stats.php',
    'GET /api/attendance/report' => 'api/attendance/report.php',
    
    // Subject routes
    'GET /api/subjects' => 'api/subjects/list.php',
    'POST /api/subjects' => 'api/subjects/create.php',
    'PUT /api/subjects/:id' => 'api/subjects/update.php',
    'DELETE /api/subjects/:id' => 'api/subjects/delete.php',
    
    // Department routes
    'GET /api/departments' => 'api/departments/list.php',
    'POST /api/departments' => 'api/departments/create.php',
    'PUT /api/departments/:id' => 'api/departments/update.php',
    'DELETE /api/departments/:id' => 'api/departments/delete.php',
    
    // Class routes
    'GET /api/classes' => 'api/classes/list.php',
    'POST /api/classes' => 'api/classes/create.php',
    'PUT /api/classes/:id' => 'api/classes/update.php',
    'DELETE /api/classes/:id' => 'api/classes/delete.php',
    
    // Notification routes
    'GET /api/notifications' => 'api/notifications/list.php',
    'PUT /api/notifications/:id/read' => 'api/notifications/mark-read.php',
    'DELETE /api/notifications/:id' => 'api/notifications/delete.php',
    
    // Announcement routes
    'GET /api/announcements' => 'api/announcements/list.php',
    'POST /api/announcements' => 'api/announcements/create.php',
    'PUT /api/announcements/:id' => 'api/announcements/update.php',
    'DELETE /api/announcements/:id' => 'api/announcements/delete.php',
    
    // Settings routes
    'GET /api/settings' => 'api/settings/get.php',
    'PUT /api/settings' => 'api/settings/update.php',
    
    // Dashboard routes
    'GET /api/dashboard/stats' => 'api/dashboard/stats.php',
    'GET /api/dashboard/recent' => 'api/dashboard/recent.php',
];

// Find matching route
$route_file = null;
$params = [];

foreach ($routes as $route => $file) {
    list($method, $pattern) = explode(' ', $route);
    
    if ($method !== $request_method) {
        continue;
    }
    
    // Convert route pattern to regex
    $pattern = preg_replace('/\/:([^\/]+)/', '/(?P<$1>[^/]+)', $pattern);
    $pattern = '#^' . $pattern . '$#';
    
    if (preg_match($pattern, $uri, $matches)) {
        $route_file = $file;
        // Extract named parameters
        foreach ($matches as $key => $value) {
            if (!is_numeric($key)) {
                $params[$key] = $value;
            }
        }
        break;
    }
}

if ($route_file && file_exists(__DIR__ . '/' . $route_file)) {
    // Make params available to route files
    $_ROUTE_PARAMS = $params;
    require_once __DIR__ . '/' . $route_file;
} else {
    Response::error('Route not found', 404);
}
