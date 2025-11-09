<?php
/**
 * Direct API Test (bypasses .htaccess)
 * Access: http://localhost/Trackify/backend/test-api.php
 */

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simulate what index.php does
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/utils/Database.php';

try {
    $db = Database::getInstance();
    $users = $db->fetchAll('SELECT id, name, email, role FROM users LIMIT 5');
    
    echo json_encode([
        'success' => true,
        'message' => 'Direct API test successful',
        'data' => [
            'users' => $users,
            'count' => count($users)
        ]
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
