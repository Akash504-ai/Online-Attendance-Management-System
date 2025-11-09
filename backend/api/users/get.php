<?php
/**
 * Get Single User API Endpoint
 */

require_once __DIR__ . '/../../utils/CORS.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../middleware/Auth.php';

// Authenticate
$currentUser = Auth::check();

// Get user ID from query params
$userId = $_GET['id'] ?? null;

if (!$userId) {
    Response::error('User ID is required', 400);
}

$db = Database::getInstance();

// Get user
$user = $db->fetchOne('SELECT id, name, email, role, phone, department, class, roll_number, status, profile_picture, created_at, updated_at FROM users WHERE id = :id', ['id' => $userId]);

if (!$user) {
    Response::error('User not found', 404);
}

// Students can only view their own profile, teachers and admins can view anyone
if ($currentUser['role'] === 'student' && $currentUser['id'] != $userId) {
    Response::forbidden('You can only view your own profile');
}

Response::success($user);
