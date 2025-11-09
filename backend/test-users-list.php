<?php
/**
 * Test Users List API
 */

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/utils/Database.php';

$db = Database::getInstance();

echo "=== TESTING USERS LIST ===\n\n";

// Test 1: Get all users
$users = $db->fetchAll("SELECT id, name, email, role, status FROM users ORDER BY created_at DESC");
echo "Total users in database: " . count($users) . "\n\n";

if (count($users) > 0) {
    echo "Sample users:\n";
    foreach (array_slice($users, 0, 5) as $user) {
        echo "- {$user['name']} ({$user['email']}) - Role: {$user['role']} - Status: {$user['status']}\n";
    }
} else {
    echo "❌ NO USERS FOUND!\n";
}

echo "\n=== TESTING FILTERS ===\n\n";

// Test 2: Get only students
$students = $db->fetchAll("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
echo "Students: " . $students[0]['count'] . "\n";

// Test 3: Get only active users
$active = $db->fetchAll("SELECT COUNT(*) as count FROM users WHERE status = 'active'");
echo "Active users: " . $active[0]['count'] . "\n";

// Test 4: Search test
$search = $db->fetchAll("SELECT COUNT(*) as count FROM users WHERE name LIKE '%test%' OR email LIKE '%test%'");
echo "Users matching 'test': " . $search[0]['count'] . "\n";
