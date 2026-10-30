package com.example.bloodbank.controller

import com.example.bloodbank.dto.*
import com.example.bloodbank.service.DonorService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/donors")
class DonorController(
    private val donorService: DonorService
) {

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HOSPITAL')")
    fun getAllDonors(
        @RequestParam(required = false) bloodGroup: String?,
        @RequestParam(required = false) city: String?
    ): ResponseEntity<ApiResponse<List<DonorResponse>>> {
        val donors = donorService.getAllDonors(bloodGroup, city)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Donors retrieved successfully", data = donors)
        )
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DONOR', 'HOSPITAL')")
    fun getDonorById(@PathVariable id: Long): ResponseEntity<ApiResponse<DonorResponse>> {
        val donor = donorService.getDonorById(id)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Donor details retrieved", data = donor)
        )
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DONOR')")
    fun updateDonorProfile(
        @PathVariable id: Long,
        @RequestBody request: DonorUpdateRequest
    ): ResponseEntity<ApiResponse<DonorResponse>> {
        val updated = donorService.updateDonorProfile(id, request)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Donor profile updated successfully", data = updated)
        )
    }

    @PutMapping("/{id}/availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'DONOR')")
    fun updateAvailabilityStatus(
        @PathVariable id: Long,
        @RequestBody request: AvailabilityUpdateRequest
    ): ResponseEntity<ApiResponse<DonorResponse>> {
        val updated = donorService.updateAvailabilityStatus(id, request)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Availability status updated", data = updated)
        )
    }

    @PutMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    fun toggleDonorStatus(@PathVariable id: Long): ResponseEntity<ApiResponse<DonorResponse>> {
        val updated = donorService.toggleDonorActive(id)
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                message = if (updated.enabled) "Donor account activated" else "Donor account deactivated",
                data = updated
            )
        )
    }

    @GetMapping("/{id}/donations")
    @PreAuthorize("hasAnyRole('ADMIN', 'DONOR')")
    fun getDonationHistory(@PathVariable id: Long): ResponseEntity<ApiResponse<List<DonationDTO>>> {
        val donations = donorService.getDonationHistory(id)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Donation history retrieved", data = donations)
        )
    }
}
