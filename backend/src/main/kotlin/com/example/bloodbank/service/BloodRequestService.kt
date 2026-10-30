package com.example.bloodbank.service

import com.example.bloodbank.dto.*
import com.example.bloodbank.entity.*
import com.example.bloodbank.exception.BadRequestException
import com.example.bloodbank.exception.ResourceNotFoundException
import com.example.bloodbank.exception.UnauthorizedAccessException
import com.example.bloodbank.repository.BloodInventoryRepository
import com.example.bloodbank.repository.BloodRequestRepository
import com.example.bloodbank.repository.HospitalRepository
import com.example.bloodbank.security.UserPrincipal
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime

@Service
class BloodRequestService(
    private val bloodRequestRepository: BloodRequestRepository,
    private val hospitalRepository: HospitalRepository,
    private val bloodInventoryRepository: BloodInventoryRepository,
    private val inventoryService: InventoryService
) {

    @Transactional
    fun createRequest(dto: BloodRequestCreateDTO, principal: UserPrincipal): BloodRequestResponse {
        inventoryService.validateBloodGroup(dto.bloodGroup)

        if (dto.requiredUnits <= 0) {
            throw BadRequestException("Required blood units must be greater than zero")
        }

        val hospital = hospitalRepository.findByUserId(principal.id)
            .orElseThrow { UnauthorizedAccessException("Only registered hospital accounts can submit blood requests") }

        if (hospital.approvalStatus != ApprovalStatus.APPROVED) {
            throw BadRequestException("Your hospital account registration status is '${hospital.approvalStatus}'. Only APPROVED hospitals can submit blood requests.")
        }

        val request = BloodRequest(
            hospital = hospital,
            bloodGroup = dto.bloodGroup,
            requiredUnits = dto.requiredUnits,
            urgency = dto.urgency,
            requiredDate = dto.requiredDate,
            reason = dto.reason,
            notes = dto.notes,
            status = RequestStatus.PENDING,
            createdAt = LocalDateTime.now()
        )

        val saved = bloodRequestRepository.save(request)
        return mapToResponse(saved)
    }

    @Transactional(readOnly = true)
    fun getAllRequests(status: RequestStatus? = null): List<BloodRequestResponse> {
        val list = if (status != null) {
            bloodRequestRepository.findByStatus(status)
        } else {
            bloodRequestRepository.findAll()
        }
        return list.map { mapToResponse(it) }
    }

    @Transactional(readOnly = true)
    fun getHospitalRequests(hospitalId: Long): List<BloodRequestResponse> {
        val list = bloodRequestRepository.findByHospitalId(hospitalId)
        return list.map { mapToResponse(it) }
    }

    @Transactional(readOnly = true)
    fun getRequestById(id: Long): BloodRequestResponse {
        val request = bloodRequestRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Blood request not found with ID $id") }
        return mapToResponse(request)
    }

    @Transactional
    fun approveRequest(id: Long, dto: BloodRequestActionDTO?): BloodRequestResponse {
        val request = bloodRequestRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Blood request not found with ID $id") }

        if (request.status == RequestStatus.FULFILLED) {
            throw BadRequestException("A fulfilled request cannot be modified back to pending or approved")
        }
        if (request.status == RequestStatus.REJECTED) {
            throw BadRequestException("Request is already rejected")
        }

        request.status = RequestStatus.APPROVED
        request.approvedAt = LocalDateTime.now()
        dto?.adminRemarks?.let { request.adminRemarks = it }

        val updated = bloodRequestRepository.save(request)
        return mapToResponse(updated)
    }

    @Transactional
    fun rejectRequest(id: Long, dto: BloodRequestActionDTO?): BloodRequestResponse {
        val request = bloodRequestRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Blood request not found with ID $id") }

        if (request.status == RequestStatus.FULFILLED) {
            throw BadRequestException("A fulfilled request cannot be rejected")
        }

        request.status = RequestStatus.REJECTED
        dto?.adminRemarks?.let { request.adminRemarks = it }

        val updated = bloodRequestRepository.save(request)
        return mapToResponse(updated)
    }

    @Transactional
    fun fulfillRequest(id: Long, dto: BloodRequestActionDTO?): BloodRequestResponse {
        val request = bloodRequestRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Blood request not found with ID $id") }

        if (request.status == RequestStatus.FULFILLED) {
            throw BadRequestException("A request cannot be fulfilled twice")
        }
        if (request.status == RequestStatus.REJECTED) {
            throw BadRequestException("A rejected request cannot be fulfilled")
        }

        val today = LocalDate.now()
        val availableUnits = bloodInventoryRepository.getAvailableUnitsByBloodGroup(request.bloodGroup, today)

        if (availableUnits < request.requiredUnits) {
            throw BadRequestException("Insufficient blood inventory for ${request.bloodGroup}. Required: ${request.requiredUnits}, Available valid units: $availableUnits")
        }

        // Deduct inventory units transactionally (oldest non-expired inventory batches first)
        val validBatches = bloodInventoryRepository.findValidInventoryByBloodGroup(request.bloodGroup, today)
            .sortedBy { it.expiryDate }

        var remainingToDeduct = request.requiredUnits
        for (batch in validBatches) {
            if (remainingToDeduct <= 0) break

            if (batch.units <= remainingToDeduct) {
                remainingToDeduct -= batch.units
                batch.units = 0
                batch.status = InventoryStatus.RESERVED
            } else {
                batch.units -= remainingToDeduct
                remainingToDeduct = 0
            }
            batch.lastUpdated = LocalDateTime.now()
            bloodInventoryRepository.save(batch)
        }

        request.status = RequestStatus.FULFILLED
        request.fulfilledAt = LocalDateTime.now()
        dto?.adminRemarks?.let { request.adminRemarks = it }

        val updated = bloodRequestRepository.save(request)
        return mapToResponse(updated)
    }

    private fun mapToResponse(request: BloodRequest): BloodRequestResponse {
        return BloodRequestResponse(
            id = request.id!!,
            hospitalId = request.hospital.id!!,
            hospitalName = request.hospital.hospitalName,
            hospitalCity = request.hospital.city,
            bloodGroup = request.bloodGroup,
            requiredUnits = request.requiredUnits,
            urgency = request.urgency,
            requiredDate = request.requiredDate,
            reason = request.reason,
            notes = request.notes,
            status = request.status,
            adminRemarks = request.adminRemarks,
            createdAt = request.createdAt,
            approvedAt = request.approvedAt,
            fulfilledAt = request.fulfilledAt
        )
    }
}
