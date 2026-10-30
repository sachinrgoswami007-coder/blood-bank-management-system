package com.example.bloodbank.entity

import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "blood_inventory")
class BloodInventory(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var bloodGroup: String = "O+",

    @Column(nullable = false)
    var units: Int = 0,

    @Column(nullable = false)
    var collectionDate: LocalDate = LocalDate.now(),

    @Column(nullable = false)
    var expiryDate: LocalDate = LocalDate.now().plusDays(42),

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: InventoryStatus = InventoryStatus.AVAILABLE,

    @Column(nullable = false)
    var lastUpdated: LocalDateTime = LocalDateTime.now()
)
