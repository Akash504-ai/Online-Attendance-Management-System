<?php
/**
 * Update Attendance API Endpoint
 */

require_once __DIR__ . '/../../utils/CORS.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Validator.php';
require_once __DIR__ . '/../../middleware/Auth.php';

// Only admin and teacher can update attendance
$user = Auth::requireRole(['admin', 'teacher']);

// Get attendance ID from route params
global $_ROUTE_PARAMS;
$attendanceId = $_ROUTE_PARAMS['id'] ?? null;

if (!$attendanceId) {
    Response::error('Attendance ID is required', 400);
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
$validator = new Validator($data);
if (isset($data['status'])) {
    $validator->in('status', ['present', 'absent', 'late', 'excused']);
}
if (isset($data['date'])) {
    $validator->date('date');
}

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

$db = Database::getInstance();

// Check if attendance exists
$attendance = $db->fetchOne('SELECT * FROM attendance WHERE id = :id', ['id' => $attendanceId]);
if (!$attendance) {
    Response::error('Attendance record not found', 404);
}

// Prepare update data
$updateData = [];
$allowedFields = ['status', 'subject', 'department', 'class', 'remarks'];
foreach ($allowedFields as $field) {
    if (isset($data[$field])) {
        $updateData[$field] = $data[$field];
    }
}

if (empty($updateData)) {
    Response::error('No valid fields to update', 400);
}

try {
    $db->update('attendance', $updateData, 'id = :id', ['id' => $attendanceId]);
    
    // Get updated attendance
    $updated = $db->fetchOne('SELECT * FROM attendance WHERE id = :id', ['id' => $attendanceId]);
    
    Response::success($updated, 'Attendance updated successfully');
    
} catch (Exception $e) {
    Response::error('Failed to update attendance: ' . $e->getMessage(), 500);
}
