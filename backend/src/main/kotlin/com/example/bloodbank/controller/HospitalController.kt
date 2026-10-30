package com.example.bloodbank.controller

import com.example.bloodbank.dto.ApiResponse
import com.example.bloodbank.dto.HospitalResponse
import com.example.bloodbank.entity.ApprovalStatus
import com.example.bloodbank.service.HospitalService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/hospitals")
class HospitalController(
    private val hospitalService: HospitalService
) {

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun getAllHospitals(
        @RequestParam(required = false) status: ApprovalStatus?
    ): ResponseEntity<ApiResponse<List<HospitalResponse>>> {
        val hospitals = hospitalService.getAllHospitals(status)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Hospitals retrieved successfully", data = hospitals)
        )
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOSPITAL')")
    fun getHospitalById(@PathVariable id: Long): ResponseEntity<ApiResponse<HospitalResponse>> {
        val hospital = hospitalService.getHospitalById(id)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Hospital details retrieved", data = hospital)
        )
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    fun approveHospital(@PathVariable id: Long): ResponseEntity<ApiResponse<HospitalResponse>> {
        val hospital = hospitalService.approveHospital(id)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Hospital approved successfully", data = hospital)
        )
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    fun rejectHospital(@PathVariable id: Long): ResponseEntity<ApiResponse<HospitalResponse>> {
        val hospital = hospitalService.rejectHospital(id)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Hospital registration rejected", data = hospital)
        )
    }

    @PutMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    fun toggleHospitalStatus(@PathVariable id: Long): ResponseEntity<ApiResponse<HospitalResponse>> {
        val updated = hospitalService.toggleHospitalActive(id)
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                message = if (updated.enabled) "Hospital account activated" else "Hospital account deactivated",
                data = updated
            )
        )
    }
}
