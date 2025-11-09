<?php
/**
 * Delete Attendance API Endpoint
 */

require_once __DIR__ . '/../../utils/CORS.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../middleware/Auth.php';

// Only admin can delete attendance
$user = Auth::requireRole(['admin']);

// Get attendance ID from route params
global $_ROUTE_PARAMS;
$attendanceId = $_ROUTE_PARAMS['id'] ?? null;

if (!$attendanceId) {
    Response::error('Attendance ID is required', 400);
}

$db = Database::getInstance();

// Check if attendance exists
$attendance = $db->fetchOne('SELECT * FROM attendance WHERE id = :id', ['id' => $attendanceId]);
if (!$attendance) {
    Response::error('Attendance record not found', 404);
}

try {
    $db->delete('attendance', 'id = :id', ['id' => $attendanceId]);
    Response::success(null, 'Attendance deleted successfully');
    
} catch (Exception $e) {
    Response::error('Failed to delete attendance: ' . $e->getMessage(), 500);
}
