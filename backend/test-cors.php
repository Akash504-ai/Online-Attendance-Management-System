<?php
/**
 * CORS Test Script
 * Access: http://localhost/Trackify/backend/test-cors.php
 */

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');

echo json_encode([
    'success' => true,
    'message' => 'CORS is working!',
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'headers' => getallheaders(),
]);
