package com.example.bloodbank.repository

import com.example.bloodbank.entity.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.util.Optional

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByEmail(email: String): Optional<User>
    fun existsByEmail(email: String): Boolean
    fun countByRole(role: Role): Long
}

@Repository
interface DonorRepository : JpaRepository<Donor, Long> {
    fun findByUserId(userId: Long): Optional<Donor>
    fun findByBloodGroup(bloodGroup: String): List<Donor>
    fun findByCity(city: String): List<Donor>
}

@Repository
interface HospitalRepository : JpaRepository<Hospital, Long> {
    fun findByUserId(userId: Long): Optional<Hospital>
    fun findByApprovalStatus(approvalStatus: ApprovalStatus): List<Hospital>
    fun existsByRegistrationNumber(registrationNumber: String): Boolean
    fun countByApprovalStatus(approvalStatus: ApprovalStatus): Long
}

@Repository
interface DonationRepository : JpaRepository<Donation, Long> {
    fun findByDonorId(donorId: Long): List<Donation>
}

@Repository
interface BloodInventoryRepository : JpaRepository<BloodInventory, Long> {
    fun findByBloodGroup(bloodGroup: String): List<BloodInventory>

    @Query("SELECT bi FROM BloodInventory bi WHERE bi.expiryDate >= :today AND bi.status = 'AVAILABLE'")
    fun findValidInventory(today: LocalDate = LocalDate.now()): List<BloodInventory>

    @Query("SELECT bi FROM BloodInventory bi WHERE bi.bloodGroup = :bloodGroup AND bi.expiryDate >= :today AND bi.status = 'AVAILABLE'")
    fun findValidInventoryByBloodGroup(bloodGroup: String, today: LocalDate = LocalDate.now()): List<BloodInventory>

    @Query("SELECT COALESCE(SUM(bi.units), 0) FROM BloodInventory bi WHERE bi.bloodGroup = :bloodGroup AND bi.expiryDate >= :today AND bi.status = 'AVAILABLE'")
    fun getAvailableUnitsByBloodGroup(bloodGroup: String, today: LocalDate = LocalDate.now()): Int

    @Query("SELECT COALESCE(SUM(bi.units), 0) FROM BloodInventory bi WHERE bi.expiryDate >= :today AND bi.status = 'AVAILABLE'")
    fun getTotalAvailableUnits(today: LocalDate = LocalDate.now()): Int
}

@Repository
interface BloodRequestRepository : JpaRepository<BloodRequest, Long> {
    fun findByHospitalId(hospitalId: Long): List<BloodRequest>
    fun findByStatus(status: RequestStatus): List<BloodRequest>
    fun countByStatus(status: RequestStatus): Long
    fun countByHospitalIdAndStatus(hospitalId: Long, status: RequestStatus): Long
}
