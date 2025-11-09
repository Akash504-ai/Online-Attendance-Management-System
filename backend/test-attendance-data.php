<?php
/**
 * Test if attendance data exists
 */

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/utils/Database.php';

$db = Database::getInstance();

echo "=== CHECKING ATTENDANCE DATA ===\n\n";

// Check if attendance table has any data
$count = $db->fetchOne("SELECT COUNT(*) as count FROM attendance");
echo "Total attendance records: " . $count['count'] . "\n\n";

if ($count['count'] > 0) {
    // Show sample records
    echo "=== SAMPLE ATTENDANCE RECORDS ===\n";
    $records = $db->fetchAll("
        SELECT 
            a.id,
            a.date,
            a.status,
            u.name as student_name,
            u.email
        FROM attendance a
        JOIN users u ON a.user_id = u.id
        ORDER BY a.date DESC
        LIMIT 10
    ");
    
    foreach ($records as $record) {
        echo "Date: {$record['date']} | Student: {$record['student_name']} | Status: {$record['status']}\n";
    }
} else {
    echo "❌ NO ATTENDANCE DATA FOUND!\n";
    echo "You need to mark attendance first at /admin/attendance\n";
}

echo "\n=== CHECKING USERS ===\n";
$users = $db->fetchOne("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
echo "Total students: " . $users['count'] . "\n";

if ($users['count'] == 0) {
    echo "❌ NO STUDENTS FOUND!\n";
    echo "You need to create student accounts first at /admin/users\n";
}
