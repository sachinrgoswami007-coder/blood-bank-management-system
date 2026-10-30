-- ====================================================================
-- Lifeline Blood Bank Management System
-- Complete Database Schema & Dummy Data Script (MySQL 8.0+ / MariaDB)
-- Compatible with XAMPP, phpMyAdmin, and MySQL Terminal Client
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. DATABASE CREATION & CONTEXT
-- --------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `blood_bank_db` 
    DEFAULT CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE `blood_bank_db`;

-- Disable foreign key checks during schema rebuild & data ingestion
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------------------
-- 2. DROP EXISTING TABLES (Reverse Dependency Order)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `donations`;
DROP TABLE IF EXISTS `blood_requests`;
DROP TABLE IF EXISTS `blood_inventory`;
DROP TABLE IF EXISTS `hospitals`;
DROP TABLE IF EXISTS `donors`;
DROP TABLE IF EXISTS `users`;

-- --------------------------------------------------------------------
-- 3. TABLE DEFINITIONS
-- --------------------------------------------------------------------

-- Table: users
-- Stores authentication credentials, system roles, and contact info
CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('ADMIN', 'DONOR', 'HOSPITAL') NOT NULL DEFAULT 'DONOR',
    `phone` VARCHAR(50) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: donors
-- Extends user details for blood donors
CREATE TABLE `donors` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL UNIQUE,
    `date_of_birth` DATE NOT NULL,
    `gender` VARCHAR(50) NOT NULL,
    `blood_group` VARCHAR(10) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `last_donation_date` DATE DEFAULT NULL,
    `availability_status` ENUM('AVAILABLE', 'TEMPORARILY_UNAVAILABLE') NOT NULL DEFAULT 'AVAILABLE',
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_donors_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_donors_blood_group` (`blood_group`),
    INDEX `idx_donors_city` (`city`),
    INDEX `idx_donors_availability` (`availability_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: hospitals
-- Extends user details for healthcare organizations and verification
CREATE TABLE `hospitals` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL UNIQUE,
    `hospital_name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `registration_number` VARCHAR(100) NOT NULL UNIQUE,
    `approval_status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_hospitals_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_hospitals_approval` (`approval_status`),
    INDEX `idx_hospitals_reg_no` (`registration_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: blood_inventory
-- Tracks blood units, batch shelf-life, and expiration
CREATE TABLE `blood_inventory` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `blood_group` VARCHAR(10) NOT NULL,
    `units` INT NOT NULL DEFAULT 1,
    `collection_date` DATE NOT NULL,
    `expiry_date` DATE NOT NULL,
    `status` ENUM('AVAILABLE', 'EXPIRED', 'RESERVED') NOT NULL DEFAULT 'AVAILABLE',
    `last_updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_inventory_blood_group` (`blood_group`),
    INDEX `idx_inventory_status` (`status`),
    INDEX `idx_inventory_expiry` (`expiry_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: blood_requests
-- Handles hospital requests with urgency levels and approval lifecycles
CREATE TABLE `blood_requests` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `hospital_id` BIGINT NOT NULL,
    `blood_group` VARCHAR(10) NOT NULL,
    `required_units` INT NOT NULL DEFAULT 1,
    `urgency` ENUM('NORMAL', 'URGENT', 'EMERGENCY') NOT NULL DEFAULT 'NORMAL',
    `required_date` DATE NOT NULL,
    `reason` TEXT NOT NULL,
    `notes` TEXT DEFAULT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'FULFILLED') NOT NULL DEFAULT 'PENDING',
    `admin_remarks` TEXT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `approved_at` DATETIME DEFAULT NULL,
    `fulfilled_at` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_requests_hospital` FOREIGN KEY (`hospital_id`) 
        REFERENCES `hospitals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_requests_status` (`status`),
    INDEX `idx_requests_urgency` (`urgency`),
    INDEX `idx_requests_blood_group` (`blood_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: donations
-- Logs donation history linked to individual donors
CREATE TABLE `donations` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `donor_id` BIGINT NOT NULL,
    `donation_date` DATE NOT NULL,
    `blood_group` VARCHAR(10) NOT NULL,
    `units` INT NOT NULL DEFAULT 1,
    `location` VARCHAR(255) NOT NULL,
    `status` ENUM('COMPLETED', 'CANCELLED', 'PENDING') NOT NULL DEFAULT 'COMPLETED',
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_donations_donor` FOREIGN KEY (`donor_id`) 
        REFERENCES `donors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_donations_donor` (`donor_id`),
    INDEX `idx_donations_date` (`donation_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. DUMMY DATA INSERTION
-- All passwords are cryptographically hashed using standard BCrypt
-- Passwords:
--   Admin:     Admin@123     -> $2a$10$YcGIVzybtyrDBUP1aOII/OzqS7QJ7w5JofDod2.GNWTO9btE2aNF2
--   Donors:    Donor@123     -> $2a$10$M6EvqjNI.JjK73KMhxDncO1NkPwZHq5prGLVA/Bh1G0hDFcT3Fvcu
--   Hospitals: Hospital@123  -> $2a$10$ju994kID4UZpzDQqnRj3WeEDjrHVVz.lES46nfm77fQ3A0bPFlbOS
-- --------------------------------------------------------------------

-- Insert Users
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `enabled`, `created_at`) VALUES
-- 1. System Administrator
(1, 'System Administrator', 'admin@bloodbank.org', '$2a$10$YcGIVzybtyrDBUP1aOII/OzqS7QJ7w5JofDod2.GNWTO9btE2aNF2', 'ADMIN', '+1 (555) 000-1111', TRUE, '2024-01-01 08:00:00'),

-- 2-6. Donors
(2, 'John Doe', 'donor1@example.com', '$2a$10$M6EvqjNI.JjK73KMhxDncO1NkPwZHq5prGLVA/Bh1G0hDFcT3Fvcu', 'DONOR', '+1 (555) 234-5678', TRUE, '2024-02-15 09:30:00'),
(3, 'Sarah Smith', 'sarah.smith@example.com', '$2a$10$M6EvqjNI.JjK73KMhxDncO1NkPwZHq5prGLVA/Bh1G0hDFcT3Fvcu', 'DONOR', '+1 (555) 876-5432', TRUE, '2024-03-01 10:15:00'),
(4, 'Mike Johnson', 'mike.johnson@example.com', '$2a$10$M6EvqjNI.JjK73KMhxDncO1NkPwZHq5prGLVA/Bh1G0hDFcT3Fvcu', 'DONOR', '+1 (555) 432-1098', TRUE, '2024-03-12 11:45:00'),
(5, 'Emily Davis', 'emily.davis@example.com', '$2a$10$M6EvqjNI.JjK73KMhxDncO1NkPwZHq5prGLVA/Bh1G0hDFcT3Fvcu', 'DONOR', '+1 (555) 654-3210', TRUE, '2024-04-05 14:20:00'),
(6, 'David Wilson', 'david.wilson@example.com', '$2a$10$M6EvqjNI.JjK73KMhxDncO1NkPwZHq5prGLVA/Bh1G0hDFcT3Fvcu', 'DONOR', '+1 (555) 321-7654', TRUE, '2024-04-18 16:00:00'),

-- 7-9. Hospitals
(7, 'Dr. Robert Vance (Director)', 'hospital1@example.com', '$2a$10$ju994kID4UZpzDQqnRj3WeEDjrHVVz.lES46nfm77fQ3A0bPFlbOS', 'HOSPITAL', '+1 (555) 999-8888', TRUE, '2024-01-10 10:00:00'),
(8, 'Dr. Alice Walker', 'hospital2@example.com', '$2a$10$ju994kID4UZpzDQqnRj3WeEDjrHVVz.lES46nfm77fQ3A0bPFlbOS', 'HOSPITAL', '+1 (555) 777-6666', TRUE, '2024-02-20 11:30:00'),
(9, 'Dr. Marcus Brody', 'hospital3@example.com', '$2a$10$ju994kID4UZpzDQqnRj3WeEDjrHVVz.lES46nfm77fQ3A0bPFlbOS', 'HOSPITAL', '+1 (555) 444-3333', TRUE, '2024-03-15 15:45:00');

-- Insert Donors Details
INSERT INTO `donors` (`id`, `user_id`, `date_of_birth`, `gender`, `blood_group`, `address`, `city`, `last_donation_date`, `availability_status`) VALUES
(1, 2, '1995-05-15', 'Male', 'O+', '123 Oak Street', 'Metropolis', '2024-08-15', 'AVAILABLE'),
(2, 3, '1998-08-22', 'Female', 'A+', '456 Maple Avenue', 'Metropolis', '2024-06-10', 'AVAILABLE'),
(3, 4, '1990-11-30', 'Male', 'B-', '789 Pine Road', 'Gotham', '2024-09-01', 'TEMPORARILY_UNAVAILABLE'),
(4, 5, '2001-03-10', 'Female', 'AB+', '321 Cedar Lane', 'Metropolis', NULL, 'AVAILABLE'),
(5, 6, '1992-12-05', 'Male', 'O-', '654 Elm Street', 'Gotham', '2024-07-20', 'AVAILABLE');

-- Insert Hospitals Details
INSERT INTO `hospitals` (`id`, `user_id`, `hospital_name`, `phone`, `address`, `city`, `registration_number`, `approval_status`) VALUES
(1, 7, 'Metro General Hospital', '+1 (555) 999-8888', '100 Hospital Boulevard', 'Metropolis', 'REG-HOSP-2024-001', 'APPROVED'),
(2, 8, 'City Care Medical Center', '+1 (555) 777-6666', '500 Wellness Way', 'Gotham', 'REG-HOSP-2024-002', 'PENDING'),
(3, 9, 'St. Jude Children Research Hospital', '+1 (555) 444-3333', '262 Danny Thomas Place', 'Metropolis', 'REG-HOSP-2024-003', 'APPROVED');

-- Insert Blood Inventory Batches
-- Shelf-life for whole blood is strictly 42 days from collection date
INSERT INTO `blood_inventory` (`id`, `blood_group`, `units`, `collection_date`, `expiry_date`, `status`, `last_updated`) VALUES
(1, 'A+',  15, DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 10 DAY), INTERVAL 42 DAY), 'AVAILABLE', NOW()),
(2, 'A-',  8,  DATE_SUB(CURDATE(), INTERVAL 15 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 15 DAY), INTERVAL 42 DAY), 'AVAILABLE', NOW()),
(3, 'B+',  22, DATE_SUB(CURDATE(), INTERVAL 5 DAY),  DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 5 DAY),  INTERVAL 42 DAY), 'AVAILABLE', NOW()),
(4, 'B-',  6,  DATE_SUB(CURDATE(), INTERVAL 8 DAY),  DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 8 DAY),  INTERVAL 42 DAY), 'AVAILABLE', NOW()),
(5, 'AB+', 9,  DATE_SUB(CURDATE(), INTERVAL 20 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 20 DAY), INTERVAL 42 DAY), 'AVAILABLE', NOW()),
(6, 'AB-', 4,  DATE_SUB(CURDATE(), INTERVAL 12 DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 12 DAY), INTERVAL 42 DAY), 'AVAILABLE', NOW()),
(7, 'O+',  30, DATE_SUB(CURDATE(), INTERVAL 2 DAY),  DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY),  INTERVAL 42 DAY), 'AVAILABLE', NOW()),
(8, 'O-',  10, DATE_SUB(CURDATE(), INTERVAL 7 DAY),  DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 7 DAY),  INTERVAL 42 DAY), 'AVAILABLE', NOW()),
-- Sample expired batch for demonstration
(9, 'O+',  2,  DATE_SUB(CURDATE(), INTERVAL 50 DAY), DATE_SUB(CURDATE(), INTERVAL 8 DAY), 'EXPIRED', NOW());

-- Insert Blood Requests
INSERT INTO `blood_requests` (`id`, `hospital_id`, `blood_group`, `required_units`, `urgency`, `required_date`, `reason`, `notes`, `status`, `admin_remarks`, `created_at`, `approved_at`, `fulfilled_at`) VALUES
(1, 1, 'O+', 3, 'EMERGENCY', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 
 'Emergency trauma surgery patient requires immediate blood transfusion.', 
 'ICU Bed 12 - Attending: Dr. Vance', 
 'PENDING', NULL, DATE_SUB(NOW(), INTERVAL 3 HOUR), NULL, NULL),

(2, 1, 'A+', 2, 'URGENT', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 
 'Scheduled open heart surgical procedure for senior patient.', 
 'Operating Room 4', 
 'APPROVED', 'Pre-approved based on surgical schedule confirmation.', 
 DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 12 HOUR), NULL),

(3, 1, 'B+', 1, 'NORMAL', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 
 'Severe anemia treatment patient routine stabilization.', 
 'General Ward Bed 5', 
 'FULFILLED', 'Fulfilled from batch B+ #3.', 
 DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),

(4, 3, 'AB-', 2, 'URGENT', DATE_ADD(CURDATE(), INTERVAL 3 DAY), 
 'Pediatric oncology transfusion unit replacement.', 
 'Pediatric Ward 3B', 
 'PENDING', NULL, DATE_SUB(NOW(), INTERVAL 5 HOUR), NULL, NULL);

-- Insert Donations History
INSERT INTO `donations` (`id`, `donor_id`, `donation_date`, `blood_group`, `units`, `location`, `status`) VALUES
(1, 1, '2024-08-15', 'O+', 1, 'Metropolis Blood Donation Hub', 'COMPLETED'),
(2, 1, '2024-04-10', 'O+', 1, 'Central Red Cross Drive', 'COMPLETED'),
(3, 2, '2024-06-10', 'A+', 1, 'Metro General Donor Center', 'COMPLETED'),
(4, 3, '2024-09-01', 'B-', 1, 'Gotham Mobile Clinic', 'COMPLETED'),
(5, 5, '2024-07-20', 'O-', 1, 'Metropolis Central Hospital Hub', 'COMPLETED');

-- --------------------------------------------------------------------
-- 5. RE-ENABLE FOREIGN KEY CHECKS
-- --------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- End of Script
-- ====================================================================
