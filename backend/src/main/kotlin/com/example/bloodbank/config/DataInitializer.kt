package com.example.bloodbank.config

import com.example.bloodbank.entity.*
import com.example.bloodbank.repository.*
import org.springframework.boot.CommandLineRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime

@Component
class DataInitializer(
    private val userRepository: UserRepository,
    private val donorRepository: DonorRepository,
    private val hospitalRepository: HospitalRepository,
    private val bloodInventoryRepository: BloodInventoryRepository,
    private val bloodRequestRepository: BloodRequestRepository,
    private val donationRepository: DonationRepository,
    private val passwordEncoder: PasswordEncoder
) : CommandLineRunner {

    @Transactional
    override fun run(vararg args: String?) {
        if (userRepository.existsByEmail("admin@bloodbank.org")) {
            return
        }

        println(">>> Seeding Initial Demo Data for Blood Bank Management System...")

        // 1. Create Admin User
        val adminUser = User(
            name = "System Administrator",
            email = "admin@bloodbank.org",
            password = passwordEncoder.encode("Admin@123"),
            role = Role.ADMIN,
            phone = "+1 (555) 000-1111"
        )
        userRepository.save(adminUser)

        // 2. Create Donors
        val donor1User = userRepository.save(
            User(
                name = "John Doe",
                email = "donor1@example.com",
                password = passwordEncoder.encode("Donor@123"),
                role = Role.DONOR,
                phone = "+1 (555) 234-5678"
            )
        )
        val donor1 = donorRepository.save(
            Donor(
                user = donor1User,
                dateOfBirth = LocalDate.of(1995, 5, 15),
                gender = "Male",
                bloodGroup = "O+",
                address = "123 Oak Street",
                city = "Metropolis",
                lastDonationDate = LocalDate.now().minusMonths(2),
                availabilityStatus = AvailabilityStatus.AVAILABLE
            )
        )

        val donor2User = userRepository.save(
            User(
                name = "Sarah Smith",
                email = "sarah.smith@example.com",
                password = passwordEncoder.encode("Donor@123"),
                role = Role.DONOR,
                phone = "+1 (555) 876-5432"
            )
        )
        val donor2 = donorRepository.save(
            Donor(
                user = donor2User,
                dateOfBirth = LocalDate.of(1998, 8, 22),
                gender = "Female",
                bloodGroup = "A+",
                address = "456 Maple Avenue",
                city = "Metropolis",
                lastDonationDate = LocalDate.now().minusMonths(4),
                availabilityStatus = AvailabilityStatus.AVAILABLE
            )
        )

        val donor3User = userRepository.save(
            User(
                name = "Mike Johnson",
                email = "mike.johnson@example.com",
                password = passwordEncoder.encode("Donor@123"),
                role = Role.DONOR,
                phone = "+1 (555) 432-1098"
            )
        )
        val donor3 = donorRepository.save(
            Donor(
                user = donor3User,
                dateOfBirth = LocalDate.of(1990, 11, 30),
                gender = "Male",
                bloodGroup = "B-",
                address = "789 Pine Road",
                city = "Gotham",
                lastDonationDate = LocalDate.now().minusMonths(1),
                availabilityStatus = AvailabilityStatus.TEMPORARILY_UNAVAILABLE
            )
        )

        val donor4User = userRepository.save(
            User(
                name = "Emily Davis",
                email = "emily.davis@example.com",
                password = passwordEncoder.encode("Donor@123"),
                role = Role.DONOR,
                phone = "+1 (555) 654-3210"
            )
        )
        val donor4 = donorRepository.save(
            Donor(
                user = donor4User,
                dateOfBirth = LocalDate.of(2001, 3, 10),
                gender = "Female",
                bloodGroup = "AB+",
                address = "321 Cedar Lane",
                city = "Metropolis",
                lastDonationDate = null,
                availabilityStatus = AvailabilityStatus.AVAILABLE
            )
        )

        // 3. Create Hospitals
        val hospital1User = userRepository.save(
            User(
                name = "Dr. Robert Vance (Director)",
                email = "hospital1@example.com",
                password = passwordEncoder.encode("Hospital@123"),
                role = Role.HOSPITAL,
                phone = "+1 (555) 999-8888"
            )
        )
        val hospital1 = hospitalRepository.save(
            Hospital(
                user = hospital1User,
                hospitalName = "Metro General Hospital",
                phone = "+1 (555) 999-8888",
                address = "100 Hospital Boulevard",
                city = "Metropolis",
                registrationNumber = "REG-HOSP-2024-001",
                approvalStatus = ApprovalStatus.APPROVED
            )
        )

        val hospital2User = userRepository.save(
            User(
                name = "Dr. Alice Walker",
                email = "hospital2@example.com",
                password = passwordEncoder.encode("Hospital@123"),
                role = Role.HOSPITAL,
                phone = "+1 (555) 777-6666"
            )
        )
        val hospital2 = hospitalRepository.save(
            Hospital(
                user = hospital2User,
                hospitalName = "City Care Medical Center",
                phone = "+1 (555) 777-6666",
                address = "500 Wellness Way",
                city = "Gotham",
                registrationNumber = "REG-HOSP-2024-002",
                approvalStatus = ApprovalStatus.PENDING
            )
        )

        // 4. Create Donations History
        donationRepository.save(
            Donation(
                donor = donor1,
                donationDate = LocalDate.now().minusMonths(2),
                bloodGroup = "O+",
                units = 1,
                location = "Metropolis Blood Donation Hub",
                status = DonationStatus.COMPLETED
            )
        )
        donationRepository.save(
            Donation(
                donor = donor1,
                donationDate = LocalDate.now().minusMonths(6),
                bloodGroup = "O+",
                units = 1,
                location = "Central Red Cross Drive",
                status = DonationStatus.COMPLETED
            )
        )
        donationRepository.save(
            Donation(
                donor = donor2,
                donationDate = LocalDate.now().minusMonths(4),
                bloodGroup = "A+",
                units = 1,
                location = "Metro General Donor Center",
                status = DonationStatus.COMPLETED
            )
        )
        donationRepository.save(
            Donation(
                donor = donor3,
                donationDate = LocalDate.now().minusMonths(1),
                bloodGroup = "B-",
                units = 1,
                location = "Gotham Mobile Clinic",
                status = DonationStatus.COMPLETED
            )
        )

        // 5. Create Blood Inventory Batches
        val now = LocalDate.now()
        val inventoryData = listOf(
            Triple("A+", 12, now.minusDays(10)),
            Triple("A-", 5, now.minusDays(15)),
            Triple("B+", 18, now.minusDays(5)),
            Triple("B-", 4, now.minusDays(8)),
            Triple("AB+", 6, now.minusDays(20)),
            Triple("AB-", 3, now.minusDays(12)),
            Triple("O+", 25, now.minusDays(2)),
            Triple("O-", 8, now.minusDays(7))
        )

        for ((bg, units, colDate) in inventoryData) {
            bloodInventoryRepository.save(
                BloodInventory(
                    bloodGroup = bg,
                    units = units,
                    collectionDate = colDate,
                    expiryDate = colDate.plusDays(42),
                    status = InventoryStatus.AVAILABLE,
                    lastUpdated = LocalDateTime.now()
                )
            )
        }

        // Add 1 expired batch for demonstration
        bloodInventoryRepository.save(
            BloodInventory(
                bloodGroup = "O+",
                units = 2,
                collectionDate = now.minusDays(50),
                expiryDate = now.minusDays(8),
                status = InventoryStatus.EXPIRED,
                lastUpdated = LocalDateTime.now()
            )
        )

        // 6. Create Initial Blood Requests
        bloodRequestRepository.save(
            BloodRequest(
                hospital = hospital1,
                bloodGroup = "O+",
                requiredUnits = 3,
                urgency = UrgencyLevel.EMERGENCY,
                requiredDate = now.plusDays(1),
                reason = "Emergency trauma surgery patient requires immediate blood transfusion.",
                notes = "ICU Bed 12",
                status = RequestStatus.PENDING,
                createdAt = LocalDateTime.now().minusHours(3)
            )
        )

        bloodRequestRepository.save(
            BloodRequest(
                hospital = hospital1,
                bloodGroup = "A+",
                requiredUnits = 2,
                urgency = UrgencyLevel.URGENT,
                requiredDate = now.plusDays(2),
                reason = "Scheduled open heart surgical procedure.",
                notes = "Operating Room 4",
                status = RequestStatus.APPROVED,
                adminRemarks = "Pre-approved based on surgical schedule.",
                createdAt = LocalDateTime.now().minusDays(1),
                approvedAt = LocalDateTime.now().minusHours(12)
            )
        )

        bloodRequestRepository.save(
            BloodRequest(
                hospital = hospital1,
                bloodGroup = "B+",
                requiredUnits = 1,
                urgency = UrgencyLevel.NORMAL,
                requiredDate = now.minusDays(1),
                reason = "Severe anemia treatment patient.",
                notes = "General Ward",
                status = RequestStatus.FULFILLED,
                adminRemarks = "Fulfilled from batch B+ #3",
                createdAt = LocalDateTime.now().minusDays(3),
                approvedAt = LocalDateTime.now().minusDays(2),
                fulfilledAt = LocalDateTime.now().minusDays(1)
            )
        )

        println(">>> Demo Data Seeding Completed Successfully!")
        println("==================================================")
        println("  ADMIN:     admin@bloodbank.org / Admin@123")
        println("  DONOR:     donor1@example.com / Donor@123")
        println("  HOSPITAL:  hospital1@example.com / Hospital@123")
        println("==================================================")
    }
}
