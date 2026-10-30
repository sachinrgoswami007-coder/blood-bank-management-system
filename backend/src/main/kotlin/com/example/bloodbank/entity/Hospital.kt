package com.example.bloodbank.entity

import jakarta.persistence.*

@Entity
@Table(name = "hospitals")
class Hospital(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @OneToOne(fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    var user: User = User(),

    @Column(nullable = false)
    var hospitalName: String = "",

    @Column(nullable = false)
    var phone: String = "",

    @Column(nullable = false)
    var address: String = "",

    @Column(nullable = false)
    var city: String = "",

    @Column(nullable = false, unique = true)
    var registrationNumber: String = "",

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var approvalStatus: ApprovalStatus = ApprovalStatus.PENDING
)
