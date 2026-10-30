package com.example.bloodbank.service

import com.example.bloodbank.dto.*
import com.example.bloodbank.entity.ApprovalStatus
import com.example.bloodbank.entity.RequestStatus
import com.example.bloodbank.entity.Role
import com.example.bloodbank.exception.ResourceNotFoundException
import com.example.bloodbank.repository.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate

@Service
class DashboardService(
    private val donorRepository: DonorRepository,
    private val hospitalRepository: HospitalRepository,
    private val bloodInventoryRepository: BloodInventoryRepository,
    private val bloodRequestRepository: BloodRequestRepository,
    private val donationRepository: DonationRepository,
    private val userRepository: UserRepository
) {

    private val bloodGroups = listOf("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")

    @Transactional(readOnly = true)
    fun getAdminDashboardData(): AdminDashboardDTO {
        val today = LocalDate.now()
        val totalDonors = donorRepository.count()
        val totalHospitals = hospitalRepository.count()
        val availableBloodUnits = bloodInventoryRepository.getTotalAvailableUnits(today)

        val pendingRequests = bloodRequestRepository.countByStatus(RequestStatus.PENDING)
        val approvedRequests = bloodRequestRepository.countByStatus(RequestStatus.APPROVED)
        val fulfilledRequests = bloodRequestRepository.countByStatus(RequestStatus.FULFILLED)

        val bloodGroupStats = bloodGroups.map { bg ->
            val units = bloodInventoryRepository.getAvailableUnitsByBloodGroup(bg, today)
            val donorsCount = donorRepository.findByBloodGroup(bg).size
            BloodGroupCountDTO(bloodGroup = bg, availableUnits = units, donorCount = donorsCount)
        }

        return AdminDashboardDTO(
            totalDonors = totalDonors,
            totalHospitals = totalHospitals,
            availableBloodUnits = availableBloodUnits,
            pendingRequests = pendingRequests,
            approvedRequests = approvedRequests,
            fulfilledRequests = fulfilledRequests,
            bloodGroupStats = bloodGroupStats
        )
    }

    @Transactional(readOnly = true)
    fun getDonorDashboardData(donorId: Long): DonorDashboardDTO {
        val donor = donorRepository.findById(donorId)
            .orElseThrow { ResourceNotFoundException("Donor not found with ID $donorId") }

        val donations = donationRepository.findByDonorId(donorId)
        val recentDonations = donations.take(5).map {
            DonationDTO(
                id = it.id!!,
                donationDate = it.donationDate,
                bloodGroup = it.bloodGroup,
                units = it.units,
                location = it.location,
                status = it.status
            )
        }

        return DonorDashboardDTO(
            donorName = donor.user.name,
            bloodGroup = donor.bloodGroup,
            availabilityStatus = donor.availabilityStatus,
            lastDonationDate = donor.lastDonationDate,
            donationCount = donations.size,
            recentDonations = recentDonations
        )
    }

    @Transactional(readOnly = true)
    fun getHospitalDashboardData(hospitalId: Long): HospitalDashboardDTO {
        val hospital = hospitalRepository.findById(hospitalId)
            .orElseThrow { ResourceNotFoundException("Hospital not found with ID $hospitalId") }

        val today = LocalDate.now()
        val availableBloodUnits = bloodInventoryRepository.getTotalAvailableUnits(today)

        val requests = bloodRequestRepository.findByHospitalId(hospitalId)
        val pending = requests.count { it.status == RequestStatus.PENDING }.toLong()
        val approved = requests.count { it.status == RequestStatus.APPROVED }.toLong()
        val fulfilled = requests.count { it.status == RequestStatus.FULFILLED }.toLong()
        val rejected = requests.count { it.status == RequestStatus.REJECTED }.toLong()

        val bloodGroupAvailability = bloodGroups.map { bg ->
            val units = bloodInventoryRepository.getAvailableUnitsByBloodGroup(bg, today)
            BloodGroupCountDTO(bloodGroup = bg, availableUnits = units)
        }

        return HospitalDashboardDTO(
            hospitalName = hospital.hospitalName,
            availableBloodUnits = availableBloodUnits,
            totalRequests = requests.size,
            pendingRequests = pending,
            approvedRequests = approved,
            fulfilledRequests = fulfilled,
            rejectedRequests = rejected,
            bloodGroupAvailability = bloodGroupAvailability
        )
    }
}
