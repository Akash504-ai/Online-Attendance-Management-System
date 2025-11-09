<?php
/**
 * Authentication Middleware
 */

require_once __DIR__ . '/../utils/JWT.php';
require_once __DIR__ . '/../utils/Response.php';

class Auth {
    private static $user = null;
    
    public static function check() {
        $token = JWT::getTokenFromHeader();
        
        if (!$token) {
            Response::unauthorized('No token provided');
        }
        
        $payload = JWT::decode($token);
        
        if (!$payload) {
            Response::unauthorized('Invalid or expired token');
        }
        
        // Get user from database
        $db = Database::getInstance();
        $user = $db->fetchOne('SELECT * FROM users WHERE id = :id AND status = :status', [
            'id' => $payload['user_id'],
            'status' => 'active'
        ]);
        
        if (!$user) {
            Response::unauthorized('User not found or inactive');
        }
        
        // Remove password from user object
        unset($user['password']);
        
        self::$user = $user;
        return $user;
    }
    
    public static function user() {
        return self::$user;
    }
    
    public static function requireRole($roles) {
        $user = self::check();
        
        if (!is_array($roles)) {
            $roles = [$roles];
        }
        
        if (!in_array($user['role'], $roles)) {
            Response::forbidden('Insufficient permissions');
        }
        
        return $user;
    }
    
    public static function isAdmin() {
        return self::$user && self::$user['role'] === 'admin';
    }
    
    public static function isTeacher() {
        return self::$user && self::$user['role'] === 'teacher';
    }
    
    public static function isStudent() {
        return self::$user && self::$user['role'] === 'student';
    }
}
