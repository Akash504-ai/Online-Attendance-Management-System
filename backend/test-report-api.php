<?php
/**
 * Test Report API directly
 */

require_once __DIR__ . '/utils/CORS.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/utils/Database.php';

$db = Database::getInstance();

$startDate = date('Y-m-d'); // Today
$endDate = date('Y-m-d');

echo "Testing report for date: $startDate\n\n";

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
    WHERE a.date BETWEEN :start_date AND :end_date
    ORDER BY a.date DESC, u.name
", [
    'start_date' => $startDate,
    'end_date' => $endDate
]);

echo "Found " . count($records) . " records\n\n";

if (count($records) > 0) {
    echo "Sample records:\n";
    foreach (array_slice($records, 0, 5) as $record) {
        echo "- {$record['date']} | {$record['user_name']} | {$record['status']}\n";
    }
} else {
    echo "No records found for today!\n";
    echo "Try marking attendance first.\n";
}
