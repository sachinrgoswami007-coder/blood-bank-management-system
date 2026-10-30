package com.example.bloodbank.controller

import com.example.bloodbank.dto.*
import com.example.bloodbank.entity.RequestStatus
import com.example.bloodbank.security.UserPrincipal
import com.example.bloodbank.service.BloodRequestService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/requests")
class BloodRequestController(
    private val bloodRequestService: BloodRequestService
) {

    @PostMapping
    @PreAuthorize("hasRole('HOSPITAL')")
    fun createRequest(
        @Valid @RequestBody dto: BloodRequestCreateDTO,
        @AuthenticationPrincipal principal: UserPrincipal
    ): ResponseEntity<ApiResponse<BloodRequestResponse>> {
        val created = bloodRequestService.createRequest(dto, principal)
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                message = "Blood request submitted successfully with status PENDING",
                data = created
            )
        )
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun getAllRequests(
        @RequestParam(required = false) status: RequestStatus?
    ): ResponseEntity<ApiResponse<List<BloodRequestResponse>>> {
        val requests = bloodRequestService.getAllRequests(status)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "All blood requests retrieved", data = requests)
        )
    }

    @GetMapping("/hospital/{hospitalId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOSPITAL')")
    fun getHospitalRequests(@PathVariable hospitalId: Long): ResponseEntity<ApiResponse<List<BloodRequestResponse>>> {
        val requests = bloodRequestService.getHospitalRequests(hospitalId)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Hospital blood requests retrieved", data = requests)
        )
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOSPITAL')")
    fun getRequestById(@PathVariable id: Long): ResponseEntity<ApiResponse<BloodRequestResponse>> {
        val request = bloodRequestService.getRequestById(id)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Blood request details retrieved", data = request)
        )
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    fun approveRequest(
        @PathVariable id: Long,
        @RequestBody(required = false) dto: BloodRequestActionDTO?
    ): ResponseEntity<ApiResponse<BloodRequestResponse>> {
        val approved = bloodRequestService.approveRequest(id, dto)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Blood request approved", data = approved)
        )
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    fun rejectRequest(
        @PathVariable id: Long,
        @RequestBody(required = false) dto: BloodRequestActionDTO?
    ): ResponseEntity<ApiResponse<BloodRequestResponse>> {
        val rejected = bloodRequestService.rejectRequest(id, dto)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Blood request rejected", data = rejected)
        )
    }

    @PutMapping("/{id}/fulfill")
    @PreAuthorize("hasRole('ADMIN')")
    fun fulfillRequest(
        @PathVariable id: Long,
        @RequestBody(required = false) dto: BloodRequestActionDTO?
    ): ResponseEntity<ApiResponse<BloodRequestResponse>> {
        val fulfilled = bloodRequestService.fulfillRequest(id, dto)
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                message = "Blood request fulfilled successfully. Inventory updated.",
                data = fulfilled
            )
        )
    }
}
