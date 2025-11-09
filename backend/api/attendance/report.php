<?php
/**
 * Generate Attendance Report API Endpoint
 */

require_once __DIR__ . '/../../utils/CORS.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../middleware/Auth.php';

// Authenticate user
$user = Auth::check();

$db = Database::getInstance();

// Get filters
$userId = $user['role'] === 'student' ? $user['id'] : ($_GET['user_id'] ?? null);
$startDate = $_GET['start_date'] ?? date('Y-m-01');
$endDate = $_GET['end_date'] ?? date('Y-m-d');
$department = $_GET['department'] ?? null;
$class = $_GET['class'] ?? null;
$status = $_GET['status'] ?? null;
$format = $_GET['format'] ?? 'json'; // json, csv, pdf

// Build query
$where = ['a.date BETWEEN :start_date AND :end_date'];
$params = [
    'start_date' => $startDate,
    'end_date' => $endDate
];

if ($userId) {
    $where[] = 'a.user_id = :user_id';
    $params['user_id'] = $userId;
}

if ($department) {
    $where[] = 'u.department = :department';
    $params['department'] = $department;
}

if ($class) {
    $where[] = 'u.class = :class';
    $params['class'] = $class;
}

if ($status) {
    $where[] = 'a.status = :status';
    $params['status'] = $status;
}

$whereClause = 'WHERE ' . implode(' AND ', $where);

// Get individual attendance records (not summary)
$records = $db->fetchAll("
    SELECT 
        a.id,
        a.date,
        a.status,
        a.created_at,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.roll_number,
        u.department,
        u.class,
        marker.name as marked_by_name
    FROM attendance a
    JOIN users u ON a.user_id = u.id
    LEFT JOIN users marker ON a.marked_by = marker.id
    {$whereClause}
    ORDER BY a.date DESC, u.name
", $params);

if ($format === 'csv') {
    // Generate CSV
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="attendance_report_' . date('Y-m-d') . '.csv"');
    
    $output = fopen('php://output', 'w');
    
    // Headers
    fputcsv($output, ['Date', 'Student Name', 'Email', 'Roll Number', 'Department', 'Class', 'Status', 'Marked By']);
    
    // Data
    foreach ($records as $row) {
        fputcsv($output, [
            $row['date'],
            $row['user_name'],
            $row['user_email'],
            $row['roll_number'],
            $row['department'],
            $row['class'],
            $row['status'],
            $row['marked_by_name']
        ]);
    }
    
    fclose($output);
    exit();
}

// Return JSON with records array (frontend expects this)
Response::success([
    'records' => $records,
    'filters' => [
        'start_date' => $startDate,
        'end_date' => $endDate,
        'department' => $department,
        'class' => $class,
        'status' => $status
    ],
    'generated_at' => date('Y-m-d H:i:s')
]);
