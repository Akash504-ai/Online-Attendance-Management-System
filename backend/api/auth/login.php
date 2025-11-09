<?php
/**
 * Login API Endpoint
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
$validator->required(['email', 'password'])
          ->email('email');

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

$email = $data['email'];
$password = $data['password'];

// Get user from database
$db = Database::getInstance();
$user = $db->fetchOne('SELECT * FROM users WHERE email = :email', ['email' => $email]);

if (!$user) {
    Response::error('Invalid credentials', 401);
}

// Verify password
if (!password_verify($password, $user['password'])) {
    Response::error('Invalid credentials', 401);
}

// Check if user is active
if ($user['status'] !== 'active') {
    Response::error('Account is inactive. Please contact administrator.', 403);
}

// Generate JWT token
$token = JWT::encode([
    'user_id' => $user['id'],
    'email' => $user['email'],
    'role' => $user['role']
]);

// Remove password from response
unset($user['password']);

// Return success response
Response::success([
    'token' => $token,
    'user' => $user
], 'Login successful');
