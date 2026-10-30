package com.example.bloodbank.entity

enum class Role {
    ADMIN,
    DONOR,
    HOSPITAL
}

enum class ApprovalStatus {
    PENDING,
    APPROVED,
    REJECTED
}

enum class RequestStatus {
    PENDING,
    APPROVED,
    REJECTED,
    FULFILLED
}

enum class DonationStatus {
    COMPLETED,
    CANCELLED,
    PENDING
}

enum class InventoryStatus {
    AVAILABLE,
    EXPIRED,
    RESERVED
}

enum class UrgencyLevel {
    NORMAL,
    URGENT,
    EMERGENCY
}

enum class AvailabilityStatus {
    AVAILABLE,
    TEMPORARILY_UNAVAILABLE
}
