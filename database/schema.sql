-- Trackify Database Schema
-- Online Attendance Management System

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Create Database
CREATE DATABASE IF NOT EXISTS `trackify` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `trackify`;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','teacher','student') NOT NULL DEFAULT 'student',
  `profile_picture` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `class` varchar(50) DEFAULT NULL,
  `roll_number` varchar(50) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `roll_number` (`roll_number`),
  KEY `role` (`role`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `attendance`
-- --------------------------------------------------------

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `status` enum('present','absent','late','excused') NOT NULL DEFAULT 'absent',
  `subject` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `class` varchar(50) DEFAULT NULL,
  `marked_by` int(11) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attendance` (`user_id`, `date`, `subject`),
  KEY `user_id` (`user_id`),
  KEY `marked_by` (`marked_by`),
  KEY `date` (`date`),
  KEY `status` (`status`),
  CONSTRAINT `fk_attendance_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_attendance_marker` FOREIGN KEY (`marked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `subjects`
-- --------------------------------------------------------

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(20) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `class` varchar(50) DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `fk_subject_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `departments`
-- --------------------------------------------------------

CREATE TABLE `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(20) NOT NULL,
  `head_id` int(11) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `head_id` (`head_id`),
  CONSTRAINT `fk_department_head` FOREIGN KEY (`head_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `classes`
-- --------------------------------------------------------

CREATE TABLE `classes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `academic_year` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `department_id` (`department_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `fk_class_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_class_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `notifications`
-- --------------------------------------------------------

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info','warning','success','error') DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `is_read` (`is_read`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `announcements`
-- --------------------------------------------------------

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `type` enum('general','urgent','reminder') DEFAULT 'general',
  `target_role` enum('all','admin','teacher','student') DEFAULT 'all',
  `created_by` int(11) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `status` (`status`),
  CONSTRAINT `fk_announcement_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `settings`
-- --------------------------------------------------------

CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `description` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `password_resets`
-- --------------------------------------------------------

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  KEY `token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Insert default data
-- --------------------------------------------------------

-- Default Admin User (password: admin123)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `department`, `status`) VALUES
('Admin User', 'admin@trackify.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Administration', 'active');

-- Default Teacher User (password: teacher123)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `department`, `status`) VALUES
('John Teacher', 'teacher@trackify.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'Computer Science', 'active');

-- Default Student User (password: student123)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `department`, `class`, `roll_number`, `status`) VALUES
('Jane Student', 'student@trackify.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'Computer Science', 'CS-101', 'CS001', 'active');

-- Default Departments
INSERT INTO `departments` (`name`, `code`, `status`) VALUES
('Computer Science', 'CS', 'active'),
('Information Technology', 'IT', 'active'),
('Electronics', 'EC', 'active'),
('Mechanical', 'ME', 'active');

-- Default Classes
INSERT INTO `classes` (`name`, `academic_year`, `status`) VALUES
('CS-101', '2024-2025', 'active'),
('IT-101', '2024-2025', 'active'),
('EC-101', '2024-2025', 'active');

-- Default Subjects
INSERT INTO `subjects` (`name`, `code`, `department`, `status`) VALUES
('Data Structures', 'CS101', 'Computer Science', 'active'),
('Database Management', 'CS102', 'Computer Science', 'active'),
('Web Development', 'CS103', 'Computer Science', 'active'),
('Operating Systems', 'CS104', 'Computer Science', 'active');

-- Default Settings
INSERT INTO `settings` (`setting_key`, `setting_value`, `description`) VALUES
('attendance_threshold', '75', 'Minimum attendance percentage required'),
('academic_year', '2024-2025', 'Current academic year'),
('email_notifications', '1', 'Enable email notifications'),
('low_attendance_alert', '70', 'Alert threshold for low attendance'),
('app_name', 'Trackify', 'Application name'),
('institution_name', 'Demo Institution', 'Institution name');

-- Default Announcement
INSERT INTO `announcements` (`title`, `content`, `type`, `target_role`, `created_by`, `status`) VALUES
('Welcome to Trackify', 'Welcome to Trackify - Your digital attendance management system. Please ensure to mark attendance regularly.', 'general', 'all', 1, 'active');

COMMIT;
