package com.example.bloodbank.entity

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "donors")
class Donor(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @OneToOne(fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    var user: User = User(),

    @Column(nullable = false)
    var dateOfBirth: LocalDate = LocalDate.now().minusYears(20),

    @Column(nullable = false)
    var gender: String = "Male",

    @Column(nullable = false)
    var bloodGroup: String = "O+",

    @Column(nullable = false)
    var address: String = "",

    @Column(nullable = false)
    var city: String = "",

    var lastDonationDate: LocalDate? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var availabilityStatus: AvailabilityStatus = AvailabilityStatus.AVAILABLE
)
