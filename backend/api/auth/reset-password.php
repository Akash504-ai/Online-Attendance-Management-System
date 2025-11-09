<?php
/**
 * Reset Password API Endpoint
 */

require_once __DIR__ . '/../../utils/CORS.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Validator.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
$validator = new Validator($data);
$validator->required(['token', 'password'])->min('password', 6);

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

$token = $data['token'];
$password = $data['password'];

// Check if token is valid
$db = Database::getInstance();
$reset = $db->fetchOne(
    'SELECT * FROM password_resets WHERE token = :token AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
    ['token' => $token]
);

if (!$reset) {
    Response::error('Invalid or expired reset token', 400);
}

// Update user password
try {
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    $db->update('users', 
        ['password' => $hashedPassword],
        'email = :email',
        ['email' => $reset['email']]
    );
    
    // Delete used token
    $db->delete('password_resets', 'token = :token', ['token' => $token]);
    
    Response::success(null, 'Password has been reset successfully');
    
} catch (Exception $e) {
    Response::error('Failed to reset password', 500);
}
