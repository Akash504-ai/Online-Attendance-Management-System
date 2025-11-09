<?php
/**
 * List Attendance Records API Endpoint
 */

require_once __DIR__ . '/../../utils/CORS.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../middleware/Auth.php';

// Authenticate user
$user = Auth::check();

$db = Database::getInstance();

// Build query based on user role and filters
$where = [];
$params = [];

// Students can only see their own attendance
if ($user['role'] === 'student') {
    $where[] = 'a.user_id = :user_id';
    $params['user_id'] = $user['id'];
}

// Apply filters from query parameters
if (isset($_GET['user_id']) && ($user['role'] === 'admin' || $user['role'] === 'teacher')) {
    $where[] = 'a.user_id = :user_id';
    $params['user_id'] = $_GET['user_id'];
}

if (isset($_GET['date'])) {
    $where[] = 'a.date = :date';
    $params['date'] = $_GET['date'];
}

if (isset($_GET['start_date']) && isset($_GET['end_date'])) {
    $where[] = 'a.date BETWEEN :start_date AND :end_date';
    $params['start_date'] = $_GET['start_date'];
    $params['end_date'] = $_GET['end_date'];
}

if (isset($_GET['status'])) {
    $where[] = 'a.status = :status';
    $params['status'] = $_GET['status'];
}

if (isset($_GET['subject'])) {
    $where[] = 'a.subject = :subject';
    $params['subject'] = $_GET['subject'];
}

if (isset($_GET['department'])) {
    $where[] = 'a.department = :department';
    $params['department'] = $_GET['department'];
}

if (isset($_GET['class'])) {
    $where[] = 'a.class = :class';
    $params['class'] = $_GET['class'];
}

$whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

// Pagination
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
$offset = ($page - 1) * $limit;

// Get total count
$countSql = "SELECT COUNT(*) as total FROM attendance a {$whereClause}";
$totalResult = $db->fetchOne($countSql, $params);
$total = $totalResult['total'];

// Get attendance records
$sql = "SELECT a.*, 
        u.name as user_name, u.email as user_email, u.roll_number,
        m.name as marked_by_name
        FROM attendance a
        LEFT JOIN users u ON a.user_id = u.id
        LEFT JOIN users m ON a.marked_by = m.id
        {$whereClause}
        ORDER BY a.date DESC, a.created_at DESC
        LIMIT {$limit} OFFSET {$offset}";

$records = $db->fetchAll($sql, $params);

Response::success([
    'records' => $records,
    'pagination' => [
        'page' => $page,
        'limit' => $limit,
        'total' => $total,
        'pages' => ceil($total / $limit)
    ]
]);
