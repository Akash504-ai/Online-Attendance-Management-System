<?php
/**
 * Create User API Endpoint
 */

require_once __DIR__ . '/../../utils/CORS.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Validator.php';
require_once __DIR__ . '/../../middleware/Auth.php';

// Only admin can create users
$user = Auth::requireRole(['admin']);

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
$validator = new Validator($data);
$validator->required(['name', 'email', 'password', 'role'])
          ->email('email')
          ->min('password', 6)
          ->in('role', ['admin', 'teacher', 'student'])
          ->unique('email', 'users');

if (isset($data['roll_number']) && !empty($data['roll_number'])) {
    $validator->unique('roll_number', 'users');
}

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

// Prepare user data
$userData = [
    'name' => $data['name'],
    'email' => $data['email'],
    'password' => password_hash($data['password'], PASSWORD_DEFAULT),
    'role' => $data['role'],
    'status' => $data['status'] ?? 'active'
];

// Optional fields
$optionalFields = ['phone', 'department', 'class', 'roll_number'];
foreach ($optionalFields as $field) {
    if (isset($data[$field]) && !empty($data[$field])) {
        $userData[$field] = $data[$field];
    }
}

$db = Database::getInstance();

try {
    $userId = $db->insert('users', $userData);
    
    // Get created user
    $newUser = $db->fetchOne('SELECT id, name, email, role, phone, department, class, roll_number, status, created_at FROM users WHERE id = :id', ['id' => $userId]);
    
    Response::success($newUser, 'User created successfully', 201);
    
} catch (Exception $e) {
    Response::error('Failed to create user: ' . $e->getMessage(), 500);
}
