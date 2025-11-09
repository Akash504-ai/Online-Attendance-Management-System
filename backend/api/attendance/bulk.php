<?php
/**
 * Bulk Mark Attendance API Endpoint
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
if (!isset($data['records']) || !is_array($data['records']) || empty($data['records'])) {
    Response::error('Records array is required', 400);
}

$db = Database::getInstance();
$db->beginTransaction();

try {
    $successCount = 0;
    $errors = [];
    
    foreach ($data['records'] as $index => $record) {
        // Validate each record
        $validator = new Validator($record);
        $validator->required(['user_id', 'date', 'status'])
                  ->in('status', ['present', 'absent', 'late', 'excused'])
                  ->date('date');
        
        if ($validator->fails()) {
            $errors[$index] = $validator->errors();
            continue;
        }
        
        // Prepare attendance data
        $attendanceData = [
            'user_id' => $record['user_id'],
            'date' => $record['date'],
            'status' => $record['status'],
            'marked_by' => $user['id']
        ];
        
        // Optional fields
        $optionalFields = ['subject', 'department', 'class', 'remarks'];
        foreach ($optionalFields as $field) {
            if (isset($record[$field]) && !empty($record[$field])) {
                $attendanceData[$field] = $record[$field];
            }
        }
        
        // Check if attendance already exists
        $existing = $db->fetchOne(
            'SELECT * FROM attendance WHERE user_id = :user_id AND date = :date AND subject = :subject',
            [
                'user_id' => $record['user_id'],
                'date' => $record['date'],
                'subject' => $attendanceData['subject'] ?? ''
            ]
        );
        
        if ($existing) {
            $db->update('attendance', $attendanceData, 'id = :id', ['id' => $existing['id']]);
        } else {
            $db->insert('attendance', $attendanceData);
        }
        
        $successCount++;
    }
    
    $db->commit();
    
    Response::success([
        'success_count' => $successCount,
        'total' => count($data['records']),
        'errors' => $errors
    ], "Successfully marked {$successCount} attendance records");
    
} catch (Exception $e) {
    $db->rollback();
    Response::error('Failed to mark bulk attendance: ' . $e->getMessage(), 500);
}
