<?php
/**
 * Database Connection Test
 * Access: http://localhost/Trackify/backend/test-db.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Check if config exists
if (!file_exists(__DIR__ . '/config/database.php')) {
    echo json_encode([
        'success' => false,
        'error' => 'Configuration file not found',
        'message' => 'Please copy backend/config/database.example.php to database.php',
        'expected_path' => __DIR__ . '/config/database.php'
    ]);
    exit();
}

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/utils/Database.php';

try {
    $db = Database::getInstance();
    
    // Test query
    $users = $db->fetchAll('SELECT COUNT(*) as count FROM users');
    $tables = $db->fetchAll('SHOW TABLES');
    
    echo json_encode([
        'success' => true,
        'message' => 'Database connected successfully!',
        'database' => DB_NAME,
        'host' => DB_HOST,
        'user_count' => $users[0]['count'],
        'table_count' => count($tables),
        'tables' => array_map(function($t) { return array_values($t)[0]; }, $tables)
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed',
        'message' => $e->getMessage(),
        'code' => $e->getCode(),
        'config' => [
            'host' => DB_HOST,
            'database' => DB_NAME,
            'user' => DB_USER
        ]
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'General error',
        'message' => $e->getMessage()
    ]);
}
