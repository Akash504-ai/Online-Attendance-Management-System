<?php
/**
 * Logout API Endpoint
 */

require_once __DIR__ . '/../../utils/CORS.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';

// In JWT-based auth, logout is handled client-side by removing the token
// This endpoint is mainly for consistency

Response::success(null, 'Logged out successfully');
