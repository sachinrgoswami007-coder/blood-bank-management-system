package com.example.bloodbank.entity

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "donations")
class Donation(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    var donor: Donor = Donor(),

    @Column(nullable = false)
    var donationDate: LocalDate = LocalDate.now(),

    @Column(nullable = false)
    var bloodGroup: String = "O+",

    @Column(nullable = false)
    var units: Int = 1,

    @Column(nullable = false)
    var location: String = "Central Blood Center",

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: DonationStatus = DonationStatus.COMPLETED
)
