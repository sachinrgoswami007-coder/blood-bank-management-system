package com.example.bloodbank.service

import com.example.bloodbank.dto.*
import com.example.bloodbank.entity.*
import com.example.bloodbank.exception.BadRequestException
import com.example.bloodbank.exception.ResourceNotFoundException
import com.example.bloodbank.repository.*
import com.example.bloodbank.security.JwtTokenProvider
import com.example.bloodbank.security.UserPrincipal
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val donorRepository: DonorRepository,
    private val hospitalRepository: HospitalRepository,
    private val passwordEncoder: PasswordEncoder,
    private val authenticationManager: AuthenticationManager,
    private val jwtTokenProvider: JwtTokenProvider
) {

    @Transactional
    fun login(request: LoginRequest): JwtResponse {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.email, request.password)
        )

        val principal = authentication.principal as UserPrincipal
        val user = userRepository.findById(principal.id)
            .orElseThrow { ResourceNotFoundException("User not found") }

        if (request.role != null && user.role != request.role) {
            throw BadRequestException("Role mismatch: Account is registered as ${user.role}")
        }

        val token = jwtTokenProvider.generateToken(authentication)

        var donorId: Long? = null
        var hospitalId: Long? = null
        var approvalStatus: ApprovalStatus? = null

        if (user.role == Role.DONOR) {
            val donor = donorRepository.findByUserId(user.id!!)
                .orElse(null)
            donorId = donor?.id
        } else if (user.role == Role.HOSPITAL) {
            val hospital = hospitalRepository.findByUserId(user.id!!)
                .orElse(null)
            hospitalId = hospital?.id
            approvalStatus = hospital?.approvalStatus
        }

        return JwtResponse(
            token = token,
            id = user.id!!,
            email = user.email,
            name = user.name,
            role = user.role,
            donorId = donorId,
            hospitalId = hospitalId,
            approvalStatus = approvalStatus
        )
    }

    @Transactional
    fun registerDonor(request: DonorRegistrationRequest): JwtResponse {
        if (userRepository.existsByEmail(request.email)) {
            throw BadRequestException("Email '${request.email}' is already registered")
        }

        val user = User(
            name = request.name,
            email = request.email,
            password = passwordEncoder.encode(request.password),
            role = Role.DONOR,
            phone = request.phone
        )
        val savedUser = userRepository.save(user)

        val donor = Donor(
            user = savedUser,
            dateOfBirth = request.dateOfBirth,
            gender = request.gender,
            bloodGroup = request.bloodGroup,
            address = request.address,
            city = request.city,
            lastDonationDate = request.lastDonationDate,
            availabilityStatus = AvailabilityStatus.AVAILABLE
        )
        val savedDonor = donorRepository.save(donor)

        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.email, request.password)
        )
        val token = jwtTokenProvider.generateToken(authentication)

        return JwtResponse(
            token = token,
            id = savedUser.id!!,
            email = savedUser.email,
            name = savedUser.name,
            role = Role.DONOR,
            donorId = savedDonor.id
        )
    }

    @Transactional
    fun registerHospital(request: HospitalRegistrationRequest): JwtResponse {
        if (userRepository.existsByEmail(request.email)) {
            throw BadRequestException("Email '${request.email}' is already registered")
        }

        if (hospitalRepository.existsByRegistrationNumber(request.registrationNumber)) {
            throw BadRequestException("Registration/License number '${request.registrationNumber}' is already registered")
        }

        val user = User(
            name = request.contactPerson,
            email = request.email,
            password = passwordEncoder.encode(request.password),
            role = Role.HOSPITAL,
            phone = request.phone
        )
        val savedUser = userRepository.save(user)

        val hospital = Hospital(
            user = savedUser,
            hospitalName = request.hospitalName,
            phone = request.phone,
            address = request.address,
            city = request.city,
            registrationNumber = request.registrationNumber,
            approvalStatus = ApprovalStatus.PENDING
        )
        val savedHospital = hospitalRepository.save(hospital)

        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.email, request.password)
        )
        val token = jwtTokenProvider.generateToken(authentication)

        return JwtResponse(
            token = token,
            id = savedUser.id!!,
            email = savedUser.email,
            name = savedUser.name,
            role = Role.HOSPITAL,
            hospitalId = savedHospital.id,
            approvalStatus = savedHospital.approvalStatus
        )
    }

    @Transactional(readOnly = true)
    fun getCurrentUser(principal: UserPrincipal): JwtResponse {
        val user = userRepository.findById(principal.id)
            .orElseThrow { ResourceNotFoundException("User not found") }

        var donorId: Long? = null
        var hospitalId: Long? = null
        var approvalStatus: ApprovalStatus? = null

        if (user.role == Role.DONOR) {
            val donor = donorRepository.findByUserId(user.id!!).orElse(null)
            donorId = donor?.id
        } else if (user.role == Role.HOSPITAL) {
            val hospital = hospitalRepository.findByUserId(user.id!!).orElse(null)
            hospitalId = hospital?.id
            approvalStatus = hospital?.approvalStatus
        }

        return JwtResponse(
            token = "",
            id = user.id!!,
            email = user.email,
            name = user.name,
            role = user.role,
            donorId = donorId,
            hospitalId = hospitalId,
            approvalStatus = approvalStatus
        )
    }
}
