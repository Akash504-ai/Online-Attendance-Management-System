<?php
/**
 * Dashboard Statistics API Endpoint
 */

require_once __DIR__ . '/../../utils/CORS.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../middleware/Auth.php';

// Authenticate user
$user = Auth::check();

$db = Database::getInstance();
$stats = [];

if ($user['role'] === 'admin' || $user['role'] === 'teacher') {
    // Admin/Teacher Dashboard
    
    // Total users by role
    $userStats = $db->fetchAll("
        SELECT role, COUNT(*) as count
        FROM users
        WHERE status = 'active'
        GROUP BY role
    ");
    
    $stats['users'] = [
        'total' => 0,
        'by_role' => []
    ];
    
    foreach ($userStats as $stat) {
        $stats['users']['by_role'][$stat['role']] = (int)$stat['count'];
        $stats['users']['total'] += (int)$stat['count'];
    }
    
    // Today's attendance
    $today = date('Y-m-d');
    $todayStats = $db->fetchOne("
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
            SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent
        FROM attendance
        WHERE date = :today
    ", ['today' => $today]);
    
    $stats['today'] = $todayStats;
    
    // This month's attendance summary
    $thisMonth = date('Y-m');
    $monthStats = $db->fetchOne("
        SELECT 
            COUNT(*) as total_records,
            COUNT(DISTINCT user_id) as total_students,
            ROUND(SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as avg_attendance
        FROM attendance
        WHERE DATE_FORMAT(date, '%Y-%m') = :month
    ", ['month' => $thisMonth]);
    
    $stats['this_month'] = $monthStats;
    
    // Low attendance alerts (below 75%)
    $lowAttendance = $db->fetchAll("
        SELECT 
            u.id, u.name, u.email, u.roll_number,
            COUNT(*) as total_days,
            SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_days,
            ROUND(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as percentage
        FROM users u
        JOIN attendance a ON u.id = a.user_id
        WHERE u.role = 'student' 
        AND DATE_FORMAT(a.date, '%Y-%m') = :month
        GROUP BY u.id
        HAVING percentage < 75
        ORDER BY percentage ASC
        LIMIT 10
    ", ['month' => $thisMonth]);
    
    $stats['low_attendance_alerts'] = $lowAttendance;
    
} else {
    // Student Dashboard
    
    // Overall attendance
    $overall = $db->fetchOne("
        SELECT 
            COUNT(*) as total_days,
            SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_days,
            SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_days,
            ROUND(SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as percentage
        FROM attendance
        WHERE user_id = :user_id
    ", ['user_id' => $user['id']]);
    
    $stats['overall'] = $overall;
    
    // This month's attendance
    $thisMonth = date('Y-m');
    $monthStats = $db->fetchOne("
        SELECT 
            COUNT(*) as total_days,
            SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_days,
            ROUND(SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as percentage
        FROM attendance
        WHERE user_id = :user_id
        AND DATE_FORMAT(date, '%Y-%m') = :month
    ", [
        'user_id' => $user['id'],
        'month' => $thisMonth
    ]);
    
    $stats['this_month'] = $monthStats;
    
    // Last 7 days trend
    $weekTrend = $db->fetchAll("
        SELECT 
            date,
            status
        FROM attendance
        WHERE user_id = :user_id
        AND date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        ORDER BY date DESC
    ", ['user_id' => $user['id']]);
    
    $stats['week_trend'] = $weekTrend;
}

Response::success($stats);
