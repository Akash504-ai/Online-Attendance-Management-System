<?php
/**
 * Update User API Endpoint
 */

require_once __DIR__ . '/../../utils/CORS.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Validator.php';
require_once __DIR__ . '/../../middleware/Auth.php';

// Get user ID from query params
$targetUserId = $_GET['id'] ?? null;

if (!$targetUserId) {
    Response::error('User ID is required', 400);
}

// Authenticate
$currentUser = Auth::check();

// Users can update their own profile, admin can update anyone
if ($currentUser['role'] !== 'admin' && $currentUser['id'] != $targetUserId) {
    Response::forbidden('You can only update your own profile');
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

$db = Database::getInstance();

// Check if target user exists
$targetUser = $db->fetchOne('SELECT * FROM users WHERE id = :id', ['id' => $targetUserId]);
if (!$targetUser) {
    Response::error('User not found', 404);
}

// Validate input
$validator = new Validator($data);

if (isset($data['email'])) {
    $validator->email('email')->unique('email', 'users', 'email', $targetUserId);
}

if (isset($data['password'])) {
    $validator->min('password', 6);
}

if (isset($data['role']) && $currentUser['role'] !== 'admin') {
    Response::forbidden('Only admin can change user roles');
}

if (isset($data['roll_number']) && !empty($data['roll_number'])) {
    $validator->unique('roll_number', 'users', 'roll_number', $targetUserId);
}

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

// Prepare update data
$updateData = [];
$allowedFields = ['name', 'email', 'phone', 'department', 'class', 'roll_number'];

// Admin can update additional fields
if ($currentUser['role'] === 'admin') {
    $allowedFields = array_merge($allowedFields, ['role', 'status']);
}

foreach ($allowedFields as $field) {
    if (isset($data[$field])) {
        $updateData[$field] = $data[$field];
    }
}

// Handle password separately
if (isset($data['password']) && !empty($data['password'])) {
    $updateData['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
}

if (empty($updateData)) {
    Response::error('No valid fields to update', 400);
}

try {
    $db->update('users', $updateData, 'id = :id', ['id' => $targetUserId]);
    
    // Get updated user
    $updatedUser = $db->fetchOne('SELECT id, name, email, role, phone, department, class, roll_number, status, profile_picture, created_at, updated_at FROM users WHERE id = :id', ['id' => $targetUserId]);
    
    Response::success($updatedUser, 'User updated successfully');
    
} catch (Exception $e) {
    Response::error('Failed to update user: ' . $e->getMessage(), 500);
}
