package com.example.bloodbank.entity

import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "blood_requests")
class BloodRequest(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    var hospital: Hospital = Hospital(),

    @Column(nullable = false)
    var bloodGroup: String = "O+",

    @Column(nullable = false)
    var requiredUnits: Int = 1,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var urgency: UrgencyLevel = UrgencyLevel.NORMAL,

    @Column(nullable = false)
    var requiredDate: LocalDate = LocalDate.now(),

    @Column(nullable = false)
    var reason: String = "",

    var notes: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: RequestStatus = RequestStatus.PENDING,

    var adminRemarks: String? = null,

    @Column(nullable = false, updatable = false)
    var createdAt: LocalDateTime = LocalDateTime.now(),

    var approvedAt: LocalDateTime? = null,

    var fulfilledAt: LocalDateTime? = null
)
