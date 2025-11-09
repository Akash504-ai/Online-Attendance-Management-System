<?php
/**
 * Signup API Endpoint
 */

require_once __DIR__ . '/../../utils/CORS.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/JWT.php';
require_once __DIR__ . '/../../utils/Validator.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
$validator = new Validator($data);
$validator->required(['name', 'email', 'password'])
          ->email('email')
          ->min('password', 6)
          ->unique('email', 'users');

if (isset($data['role'])) {
    $validator->in('role', ['student', 'teacher', 'admin']);
}

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

// Prepare user data
$userData = [
    'name' => $data['name'],
    'email' => $data['email'],
    'password' => password_hash($data['password'], PASSWORD_DEFAULT),
    'role' => $data['role'] ?? 'student',
    'status' => 'active'
];

// Optional fields
$optionalFields = ['phone', 'department', 'class', 'roll_number'];
foreach ($optionalFields as $field) {
    if (isset($data[$field]) && !empty($data[$field])) {
        $userData[$field] = $data[$field];
    }
}

// Check if roll_number is unique (if provided)
if (isset($userData['roll_number'])) {
    $validator->unique('roll_number', 'users');
    if ($validator->fails()) {
        Response::validationError($validator->errors());
    }
}

// Insert user
$db = Database::getInstance();
try {
    $userId = $db->insert('users', $userData);
    
    // Get created user
    $user = $db->fetchOne('SELECT * FROM users WHERE id = :id', ['id' => $userId]);
    
    // Generate JWT token
    $token = JWT::encode([
        'user_id' => $user['id'],
        'email' => $user['email'],
        'role' => $user['role']
    ]);
    
    // Remove password from response
    unset($user['password']);
    
    Response::success([
        'token' => $token,
        'user' => $user
    ], 'Account created successfully', 201);
    
} catch (Exception $e) {
    Response::error('Failed to create account: ' . $e->getMessage(), 500);
}
