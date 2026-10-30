package com.example.bloodbank.service

import com.example.bloodbank.dto.*
import com.example.bloodbank.entity.AvailabilityStatus
import com.example.bloodbank.entity.Donor
import com.example.bloodbank.exception.ResourceNotFoundException
import com.example.bloodbank.repository.DonationRepository
import com.example.bloodbank.repository.DonorRepository
import com.example.bloodbank.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DonorService(
    private val donorRepository: DonorRepository,
    private val userRepository: UserRepository,
    private val donationRepository: DonationRepository
) {

    @Transactional(readOnly = true)
    fun getAllDonors(bloodGroup: String? = null, city: String? = null): List<DonorResponse> {
        val donors = when {
            !bloodGroup.isNullOrBlank() -> donorRepository.findByBloodGroup(bloodGroup)
            !city.isNullOrBlank() -> donorRepository.findByCity(city)
            else -> donorRepository.findAll()
        }
        return donors.map { mapToDonorResponse(it) }
    }

    @Transactional(readOnly = true)
    fun getDonorById(id: Long): DonorResponse {
        val donor = donorRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Donor not found with ID $id") }
        return mapToDonorResponse(donor)
    }

    @Transactional
    fun updateDonorProfile(id: Long, request: DonorUpdateRequest): DonorResponse {
        val donor = donorRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Donor not found with ID $id") }

        request.name?.let { donor.user.name = it }
        request.phone?.let { donor.user.phone = it }
        request.address?.let { donor.address = it }
        request.city?.let { donor.city = it }
        request.lastDonationDate?.let { donor.lastDonationDate = it }

        userRepository.save(donor.user)
        val updated = donorRepository.save(donor)
        return mapToDonorResponse(updated)
    }

    @Transactional
    fun updateAvailabilityStatus(id: Long, request: AvailabilityUpdateRequest): DonorResponse {
        val donor = donorRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Donor not found with ID $id") }

        donor.availabilityStatus = request.availabilityStatus
        val updated = donorRepository.save(donor)
        return mapToDonorResponse(updated)
    }

    @Transactional
    fun toggleDonorActive(id: Long): DonorResponse {
        val donor = donorRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Donor not found with ID $id") }

        donor.user.enabled = !donor.user.enabled
        userRepository.save(donor.user)
        return mapToDonorResponse(donor)
    }

    @Transactional(readOnly = true)
    fun getDonationHistory(donorId: Long): List<DonationDTO> {
        if (!donorRepository.existsById(donorId)) {
            throw ResourceNotFoundException("Donor not found with ID $donorId")
        }
        val donations = donationRepository.findByDonorId(donorId)
        return donations.map {
            DonationDTO(
                id = it.id!!,
                donationDate = it.donationDate,
                bloodGroup = it.bloodGroup,
                units = it.units,
                location = it.location,
                status = it.status
            )
        }
    }

    private fun mapToDonorResponse(donor: Donor): DonorResponse {
        val donationCount = donationRepository.findByDonorId(donor.id!!).size
        return DonorResponse(
            id = donor.id!!,
            userId = donor.user.id!!,
            name = donor.user.name,
            email = donor.user.email,
            phone = donor.user.phone,
            dateOfBirth = donor.dateOfBirth,
            gender = donor.gender,
            bloodGroup = donor.bloodGroup,
            address = donor.address,
            city = donor.city,
            lastDonationDate = donor.lastDonationDate,
            availabilityStatus = donor.availabilityStatus,
            enabled = donor.user.enabled,
            donationCount = donationCount
        )
    }
}
