<?php
/**
 * Backend Test Script
 * Access: http://localhost/Trackify/backend/test.php
 */

require_once __DIR__ . '/utils/CORS.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'success' => true,
    'message' => 'Backend is working!',
    'php_version' => PHP_VERSION,
    'server_time' => date('Y-m-d H:i:s'),
    'base_path' => __DIR__,
]);
