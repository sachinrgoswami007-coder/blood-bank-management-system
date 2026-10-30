package com.example.bloodbank.controller

import com.example.bloodbank.dto.AdminDashboardDTO
import com.example.bloodbank.dto.ApiResponse
import com.example.bloodbank.dto.DonorDashboardDTO
import com.example.bloodbank.dto.HospitalDashboardDTO
import com.example.bloodbank.security.UserPrincipal
import com.example.bloodbank.service.DashboardService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/dashboard")
class DashboardController(
    private val dashboardService: DashboardService
) {

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    fun getAdminDashboard(): ResponseEntity<ApiResponse<AdminDashboardDTO>> {
        val data = dashboardService.getAdminDashboardData()
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Admin dashboard data retrieved", data = data)
        )
    }

    @GetMapping("/donor")
    @PreAuthorize("hasAnyRole('ADMIN', 'DONOR')")
    fun getDonorDashboard(
        @RequestParam(required = false) donorId: Long?,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<ApiResponse<DonorDashboardDTO>> {
        val targetDonorId = donorId ?: principal.id
        val data = dashboardService.getDonorDashboardData(targetDonorId)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Donor dashboard data retrieved", data = data)
        )
    }

    @GetMapping("/hospital")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOSPITAL')")
    fun getHospitalDashboard(
        @RequestParam(required = false) hospitalId: Long?,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<ApiResponse<HospitalDashboardDTO>> {
        val targetHospitalId = hospitalId ?: principal.id
        val data = dashboardService.getHospitalDashboardData(targetHospitalId)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Hospital dashboard data retrieved", data = data)
        )
    }
}
