<?php
/**
 * Mark Attendance API Endpoint
 */

require_once __DIR__ . '/../../utils/CORS.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Validator.php';
require_once __DIR__ . '/../../middleware/Auth.php';

// Only admin and teacher can mark attendance
$user = Auth::requireRole(['admin', 'teacher']);

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
$validator = new Validator($data);
$validator->required(['user_id', 'date', 'status'])
          ->in('status', ['present', 'absent', 'late', 'excused'])
          ->date('date');

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

$db = Database::getInstance();

// Check if user exists
$targetUser = $db->fetchOne('SELECT * FROM users WHERE id = :id', ['id' => $data['user_id']]);
if (!$targetUser) {
    Response::error('User not found', 404);
}

// Prepare attendance data
$attendanceData = [
    'user_id' => $data['user_id'],
    'date' => $data['date'],
    'status' => $data['status'],
    'marked_by' => $user['id']
];

// Optional fields
$optionalFields = ['subject', 'department', 'class', 'remarks'];
foreach ($optionalFields as $field) {
    if (isset($data[$field]) && !empty($data[$field])) {
        $attendanceData[$field] = $data[$field];
    }
}

try {
    // Check if attendance already exists
    $existing = $db->fetchOne(
        'SELECT * FROM attendance WHERE user_id = :user_id AND date = :date AND subject = :subject',
        [
            'user_id' => $data['user_id'],
            'date' => $data['date'],
            'subject' => $attendanceData['subject'] ?? ''
        ]
    );
    
    if ($existing) {
        // Update existing attendance
        $db->update('attendance', $attendanceData, 'id = :id', ['id' => $existing['id']]);
        $attendanceId = $existing['id'];
        $message = 'Attendance updated successfully';
    } else {
        // Insert new attendance
        $attendanceId = $db->insert('attendance', $attendanceData);
        $message = 'Attendance marked successfully';
    }
    
    // Get created/updated attendance
    $attendance = $db->fetchOne('SELECT * FROM attendance WHERE id = :id', ['id' => $attendanceId]);
    
    Response::success($attendance, $message);
    
} catch (Exception $e) {
    Response::error('Failed to mark attendance: ' . $e->getMessage(), 500);
}
