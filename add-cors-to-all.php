<?php
/**
 * Script to add CORS.php include to all API files
 * Run: php add-cors-to-all.php
 */

$apiDir = __DIR__ . '/backend/api';
$corsInclude = "require_once __DIR__ . '/../../utils/CORS.php';\n";

function addCorsToFile($file) {
    $content = file_get_contents($file);
    
    // Check if config already included
    if (strpos($content, "config/database.php") === false) {
        // Add config after CORS
        $pattern = "/(require_once __DIR__ . '\\/\\.\\.\\/.+?CORS\\.php';)/";
        $replacement = "$1\nrequire_once __DIR__ . '/../../config/database.php';";
        $content = preg_replace($pattern, $replacement, $content, 1);
        
        if ($content) {
            file_put_contents($file, $content);
            echo "✅ Added config to: " . basename($file) . "\n";
        }
    } else {
        echo "✓ Already has config: " . basename($file) . "\n";
    }
}

// Find all PHP files in api directory
$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($apiDir)
);

foreach ($iterator as $file) {
    if ($file->isFile() && $file->getExtension() === 'php') {
        addCorsToFile($file->getPathname());
    }
}

echo "\n✅ Done! CORS added to all API files.\n";
echo "Now restart Apache and test!\n";
