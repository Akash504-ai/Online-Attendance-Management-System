<?php
/**
 * Attendance Statistics API Endpoint
 */

require_once __DIR__ . '/../../utils/CORS.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../middleware/Auth.php';

// Authenticate user
$user = Auth::check();

$db = Database::getInstance();

// Get user_id from query or use current user for students
$userId = $user['role'] === 'student' ? $user['id'] : ($_GET['user_id'] ?? null);

if (!$userId) {
    Response::error('User ID is required', 400);
}

// Date range
$startDate = $_GET['start_date'] ?? date('Y-m-01'); // First day of current month
$endDate = $_GET['end_date'] ?? date('Y-m-d'); // Today

// Get attendance statistics
$stats = $db->fetchOne("
    SELECT 
        COUNT(*) as total_days,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_days,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_days,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late_days,
        SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END) as excused_days,
        ROUND(SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as attendance_percentage
    FROM attendance
    WHERE user_id = :user_id 
    AND date BETWEEN :start_date AND :end_date
", [
    'user_id' => $userId,
    'start_date' => $startDate,
    'end_date' => $endDate
]);

// Get monthly breakdown
$monthlyStats = $db->fetchAll("
    SELECT 
        DATE_FORMAT(date, '%Y-%m') as month,
        COUNT(*) as total_days,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_days,
        ROUND(SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as percentage
    FROM attendance
    WHERE user_id = :user_id
    AND date BETWEEN :start_date AND :end_date
    GROUP BY DATE_FORMAT(date, '%Y-%m')
    ORDER BY month DESC
", [
    'user_id' => $userId,
    'start_date' => $startDate,
    'end_date' => $endDate
]);

// Get subject-wise statistics
$subjectStats = $db->fetchAll("
    SELECT 
        subject,
        COUNT(*) as total_days,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_days,
        ROUND(SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as percentage
    FROM attendance
    WHERE user_id = :user_id
    AND date BETWEEN :start_date AND :end_date
    AND subject IS NOT NULL
    GROUP BY subject
    ORDER BY subject
", [
    'user_id' => $userId,
    'start_date' => $startDate,
    'end_date' => $endDate
]);

// Get recent attendance
$recentAttendance = $db->fetchAll("
    SELECT date, status, subject, remarks
    FROM attendance
    WHERE user_id = :user_id
    ORDER BY date DESC
    LIMIT 10
", ['user_id' => $userId]);

Response::success([
    'overall' => $stats,
    'monthly' => $monthlyStats,
    'by_subject' => $subjectStats,
    'recent' => $recentAttendance,
    'date_range' => [
        'start' => $startDate,
        'end' => $endDate
    ]
]);
