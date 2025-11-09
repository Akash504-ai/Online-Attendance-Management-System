<?php
/**
 * Delete User API Endpoint
 */

require_once __DIR__ . '/../../utils/CORS.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../middleware/Auth.php';

// Only admin can delete users
$user = Auth::requireRole(['admin']);

// Get user ID from query params or route params
$userId = $_GET['id'] ?? null;

if (!$userId) {
    Response::error('User ID is required', 400);
}

// Prevent self-deletion
if ($user['id'] == $userId) {
    Response::error('You cannot delete your own account', 400);
}

$db = Database::getInstance();

// Check if user exists
$targetUser = $db->fetchOne('SELECT * FROM users WHERE id = :id', ['id' => $userId]);
if (!$targetUser) {
    Response::error('User not found', 404);
}

try {
    $db->delete('users', 'id = :id', ['id' => $userId]);
    Response::success(null, 'User deleted successfully');
    
} catch (Exception $e) {
    Response::error('Failed to delete user: ' . $e->getMessage(), 500);
}
