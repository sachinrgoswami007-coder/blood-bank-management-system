package com.example.bloodbank.service

import com.example.bloodbank.dto.HospitalResponse
import com.example.bloodbank.entity.ApprovalStatus
import com.example.bloodbank.entity.Hospital
import com.example.bloodbank.exception.ResourceNotFoundException
import com.example.bloodbank.repository.HospitalRepository
import com.example.bloodbank.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class HospitalService(
    private val hospitalRepository: HospitalRepository,
    private val userRepository: UserRepository
) {

    @Transactional(readOnly = true)
    fun getAllHospitals(status: ApprovalStatus? = null): List<HospitalResponse> {
        val list = if (status != null) {
            hospitalRepository.findByApprovalStatus(status)
        } else {
            hospitalRepository.findAll()
        }
        return list.map { mapToHospitalResponse(it) }
    }

    @Transactional(readOnly = true)
    fun getHospitalById(id: Long): HospitalResponse {
        val hospital = hospitalRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Hospital not found with ID $id") }
        return mapToHospitalResponse(hospital)
    }

    @Transactional
    fun approveHospital(id: Long): HospitalResponse {
        val hospital = hospitalRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Hospital not found with ID $id") }

        hospital.approvalStatus = ApprovalStatus.APPROVED
        val updated = hospitalRepository.save(hospital)
        return mapToHospitalResponse(updated)
    }

    @Transactional
    fun rejectHospital(id: Long): HospitalResponse {
        val hospital = hospitalRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Hospital not found with ID $id") }

        hospital.approvalStatus = ApprovalStatus.REJECTED
        val updated = hospitalRepository.save(hospital)
        return mapToHospitalResponse(updated)
    }

    @Transactional
    fun toggleHospitalActive(id: Long): HospitalResponse {
        val hospital = hospitalRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Hospital not found with ID $id") }

        hospital.user.enabled = !hospital.user.enabled
        userRepository.save(hospital.user)
        return mapToHospitalResponse(hospital)
    }

    private fun mapToHospitalResponse(hospital: Hospital): HospitalResponse {
        return HospitalResponse(
            id = hospital.id!!,
            userId = hospital.user.id!!,
            hospitalName = hospital.hospitalName,
            email = hospital.user.email,
            phone = hospital.phone,
            address = hospital.address,
            city = hospital.city,
            registrationNumber = hospital.registrationNumber,
            approvalStatus = hospital.approvalStatus,
            enabled = hospital.user.enabled
        )
    }
}
