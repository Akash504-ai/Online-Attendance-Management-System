<?php
/**
 * Forgot Password API Endpoint
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
$validator->required(['email'])->email('email');

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

$email = $data['email'];

// Check if user exists
$db = Database::getInstance();
$user = $db->fetchOne('SELECT * FROM users WHERE email = :email', ['email' => $email]);

if (!$user) {
    // Don't reveal if email exists or not for security
    Response::success(null, 'If the email exists, a password reset link has been sent');
}

// Generate reset token
$token = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

// Store reset token
try {
    $db->insert('password_resets', [
        'email' => $email,
        'token' => $token,
        'expires_at' => $expiresAt
    ]);
    
    // TODO: Send email with reset link
    // For now, we'll just return success
    // In production, integrate with PHPMailer or similar
    
    Response::success([
        'reset_token' => $token // Remove this in production, only send via email
    ], 'Password reset link has been sent to your email');
    
} catch (Exception $e) {
    Response::error('Failed to process request', 500);
}
