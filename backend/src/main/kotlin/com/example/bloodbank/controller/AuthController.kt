package com.example.bloodbank.controller

import com.example.bloodbank.dto.*
import com.example.bloodbank.security.UserPrincipal
import com.example.bloodbank.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<ApiResponse<JwtResponse>> {
        val jwtResponse = authService.login(request)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Login successful", data = jwtResponse)
        )
    }

    @PostMapping("/register/donor")
    fun registerDonor(@Valid @RequestBody request: DonorRegistrationRequest): ResponseEntity<ApiResponse<JwtResponse>> {
        val jwtResponse = authService.registerDonor(request)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Donor registration successful", data = jwtResponse)
        )
    }

    @PostMapping("/register/hospital")
    fun registerHospital(@Valid @RequestBody request: HospitalRegistrationRequest): ResponseEntity<ApiResponse<JwtResponse>> {
        val jwtResponse = authService.registerHospital(request)
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                message = "Hospital registration submitted. Account status is PENDING approval by Administrator.",
                data = jwtResponse
            )
        )
    }

    @GetMapping("/me")
    fun getCurrentUser(@AuthenticationPrincipal principal: UserPrincipal): ResponseEntity<ApiResponse<JwtResponse>> {
        val jwtResponse = authService.getCurrentUser(principal)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Current user retrieved", data = jwtResponse)
        )
    }
}
