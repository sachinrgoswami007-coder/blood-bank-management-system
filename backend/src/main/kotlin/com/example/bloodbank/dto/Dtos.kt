package com.example.bloodbank.dto

import com.example.bloodbank.entity.*
import jakarta.validation.constraints.*
import java.time.LocalDate
import java.time.LocalDateTime

data class ApiResponse<T>(
    val success: Boolean,
    val message: String,
    val data: T? = null,
    val timestamp: LocalDateTime = LocalDateTime.now()
)

data class ErrorResponse(
    val success: Boolean = false,
    val message: String,
    val timestamp: LocalDateTime = LocalDateTime.now()
)

data class LoginRequest(
    @field:NotBlank(message = "Email is required")
    @field:Email(message = "Invalid email format")
    val email: String,

    @field:NotBlank(message = "Password is required")
    val password: String,

    val role: Role? = null
)

data class JwtResponse(
    val token: String,
    val type: String = "Bearer",
    val id: Long,
    val email: String,
    val name: String,
    val role: Role,
    val donorId: Long? = null,
    val hospitalId: Long? = null,
    val approvalStatus: ApprovalStatus? = null
)

data class DonorRegistrationRequest(
    @field:NotBlank(message = "Full name is required")
    val name: String,

    @field:NotBlank(message = "Email is required")
    @field:Email(message = "Invalid email format")
    val email: String,

    @field:NotBlank(message = "Password is required")
    @field:Size(min = 6, message = "Password must be at least 6 characters")
    val password: String,

    @field:NotBlank(message = "Phone is required")
    val phone: String,

    @field:NotNull(message = "Date of birth is required")
    val dateOfBirth: LocalDate,

    @field:NotBlank(message = "Gender is required")
    val gender: String,

    @field:NotBlank(message = "Blood group is required")
    val bloodGroup: String,

    @field:NotBlank(message = "Address is required")
    val address: String,

    @field:NotBlank(message = "City is required")
    val city: String,

    val lastDonationDate: LocalDate? = null
)

data class HospitalRegistrationRequest(
    @field:NotBlank(message = "Hospital name is required")
    val hospitalName: String,

    @field:NotBlank(message = "Email is required")
    @field:Email(message = "Invalid email format")
    val email: String,

    @field:NotBlank(message = "Password is required")
    @field:Size(min = 6, message = "Password must be at least 6 characters")
    val password: String,

    @field:NotBlank(message = "Phone is required")
    val phone: String,

    @field:NotBlank(message = "Address is required")
    val address: String,

    @field:NotBlank(message = "City is required")
    val city: String,

    @field:NotBlank(message = "Registration/License number is required")
    val registrationNumber: String,

    @field:NotBlank(message = "Contact person name is required")
    val contactPerson: String
)

data class UserSummary(
    val id: Long,
    val name: String,
    val email: String,
    val role: Role,
    val phone: String
)

data class DonorResponse(
    val id: Long,
    val userId: Long,
    val name: String,
    val email: String,
    val phone: String,
    val dateOfBirth: LocalDate,
    val gender: String,
    val bloodGroup: String,
    val address: String,
    val city: String,
    val lastDonationDate: LocalDate?,
    val availabilityStatus: AvailabilityStatus,
    val enabled: Boolean,
    val donationCount: Int = 0
)

data class DonorUpdateRequest(
    val name: String? = null,
    val phone: String? = null,
    val address: String? = null,
    val city: String? = null,
    val lastDonationDate: LocalDate? = null
)

data class AvailabilityUpdateRequest(
    val availabilityStatus: AvailabilityStatus
)

data class HospitalResponse(
    val id: Long,
    val userId: Long,
    val hospitalName: String,
    val email: String,
    val phone: String,
    val address: String,
    val city: String,
    val registrationNumber: String,
    val approvalStatus: ApprovalStatus,
    val enabled: Boolean
)

data class HospitalApprovalRequest(
    val status: ApprovalStatus,
    val remarks: String? = null
)

data class InventoryResponse(
    val id: Long,
    val bloodGroup: String,
    val units: Int,
    val collectionDate: LocalDate,
    val expiryDate: LocalDate,
    val status: InventoryStatus,
    val lastUpdated: LocalDateTime,
    val isExpired: Boolean
)

data class InventoryCreateRequest(
    @field:NotBlank(message = "Blood group is required")
    val bloodGroup: String,

    @field:Min(value = 1, message = "Units must be greater than zero")
    val units: Int,

    @field:NotNull(message = "Collection date is required")
    val collectionDate: LocalDate = LocalDate.now(),

    val expiryDate: LocalDate? = null
)

data class InventoryUpdateRequest(
    @field:Min(value = 0, message = "Units cannot be negative")
    val units: Int,

    val status: InventoryStatus? = null
)

data class BloodRequestCreateDTO(
    @field:NotBlank(message = "Blood group is required")
    val bloodGroup: String,

    @field:Min(value = 1, message = "Required units must be greater than zero")
    val requiredUnits: Int,

    @field:NotNull(message = "Urgency level is required")
    val urgency: UrgencyLevel,

    @field:NotNull(message = "Required date is required")
    val requiredDate: LocalDate,

    @field:NotBlank(message = "Reason is required")
    val reason: String,

    val notes: String? = null
)

data class BloodRequestResponse(
    val id: Long,
    val hospitalId: Long,
    val hospitalName: String,
    val hospitalCity: String,
    val bloodGroup: String,
    val requiredUnits: Int,
    val urgency: UrgencyLevel,
    val requiredDate: LocalDate,
    val reason: String,
    val notes: String?,
    val status: RequestStatus,
    val adminRemarks: String?,
    val createdAt: LocalDateTime,
    val approvedAt: LocalDateTime?,
    val fulfilledAt: LocalDateTime?
)

data class BloodRequestActionDTO(
    val adminRemarks: String? = null
)

data class BloodGroupCountDTO(
    val bloodGroup: String,
    val availableUnits: Int,
    val donorCount: Int = 0
)

data class AdminDashboardDTO(
    val totalDonors: Long,
    val totalHospitals: Long,
    val availableBloodUnits: Int,
    val pendingRequests: Long,
    val approvedRequests: Long,
    val fulfilledRequests: Long,
    val bloodGroupStats: List<BloodGroupCountDTO>
)

data class DonorDashboardDTO(
    val donorName: String,
    val bloodGroup: String,
    val availabilityStatus: AvailabilityStatus,
    val lastDonationDate: LocalDate?,
    val donationCount: Int,
    val recentDonations: List<DonationDTO>
)

data class DonationDTO(
    val id: Long,
    val donationDate: LocalDate,
    val bloodGroup: String,
    val units: Int,
    val location: String,
    val status: DonationStatus
)

data class HospitalDashboardDTO(
    val hospitalName: String,
    val availableBloodUnits: Int,
    val totalRequests: Int,
    val pendingRequests: Long,
    val approvedRequests: Long,
    val fulfilledRequests: Long,
    val rejectedRequests: Long,
    val bloodGroupAvailability: List<BloodGroupCountDTO>
)
