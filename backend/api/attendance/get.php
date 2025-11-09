<?php
/**
 * Get Single Attendance Record API Endpoint
 */

require_once __DIR__ . '/../../utils/CORS.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../middleware/Auth.php';

// Authenticate user
$user = Auth::check();

// Get attendance ID from route params
global $_ROUTE_PARAMS;
$attendanceId = $_ROUTE_PARAMS['id'] ?? null;

if (!$attendanceId) {
    Response::error('Attendance ID is required', 400);
}

$db = Database::getInstance();

// Get attendance record
$attendance = $db->fetchOne("
    SELECT a.*, 
    u.name as user_name, u.email as user_email, u.roll_number,
    m.name as marked_by_name
    FROM attendance a
    LEFT JOIN users u ON a.user_id = u.id
    LEFT JOIN users m ON a.marked_by = m.id
    WHERE a.id = :id
", ['id' => $attendanceId]);

if (!$attendance) {
    Response::error('Attendance record not found', 404);
}

// Students can only view their own attendance
if ($user['role'] === 'student' && $attendance['user_id'] != $user['id']) {
    Response::forbidden('You can only view your own attendance');
}

Response::success($attendance);
