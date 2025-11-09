<?php
/**
 * List Users API Endpoint
 */

require_once __DIR__ . '/../../utils/CORS.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../middleware/Auth.php';

// Only admin and teacher can list users
$user = Auth::requireRole(['admin', 'teacher']);

$db = Database::getInstance();

// Build query with filters
$where = [];
$params = [];

if (isset($_GET['role']) && $_GET['role'] !== '') {
    $where[] = 'role = :role';
    $params['role'] = $_GET['role'];
}

if (isset($_GET['department']) && $_GET['department'] !== '') {
    $where[] = 'department = :department';
    $params['department'] = $_GET['department'];
}

if (isset($_GET['class']) && $_GET['class'] !== '') {
    $where[] = 'class = :class';
    $params['class'] = $_GET['class'];
}

if (isset($_GET['status']) && $_GET['status'] !== '') {
    $where[] = 'status = :status';
    $params['status'] = $_GET['status'];
}

if (isset($_GET['search']) && $_GET['search'] !== '') {
    $searchTerm = '%' . $_GET['search'] . '%';
    $where[] = '(name LIKE :search1 OR email LIKE :search2 OR roll_number LIKE :search3)';
    $params['search1'] = $searchTerm;
    $params['search2'] = $searchTerm;
    $params['search3'] = $searchTerm;
}

$whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

// Pagination
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
$offset = ($page - 1) * $limit;

// Get total count
$countSql = "SELECT COUNT(*) as total FROM users {$whereClause}";
$totalResult = $db->fetchOne($countSql, $params);
$total = $totalResult['total'];

// Get users
$sql = "SELECT id, name, email, role, phone, department, class, roll_number, status, profile_picture, created_at, updated_at
        FROM users
        {$whereClause}
        ORDER BY created_at DESC
        LIMIT {$limit} OFFSET {$offset}";

$users = $db->fetchAll($sql, $params);

Response::success([
    'users' => $users,
    'pagination' => [
        'page' => $page,
        'limit' => $limit,
        'total' => $total,
        'pages' => ceil($total / $limit)
    ]
]);
