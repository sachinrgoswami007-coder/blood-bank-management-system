package com.example.bloodbank.service

import com.example.bloodbank.dto.*
import com.example.bloodbank.entity.BloodInventory
import com.example.bloodbank.entity.InventoryStatus
import com.example.bloodbank.exception.BadRequestException
import com.example.bloodbank.exception.ResourceNotFoundException
import com.example.bloodbank.repository.BloodInventoryRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime

@Service
class InventoryService(
    private val inventoryRepository: BloodInventoryRepository
) {

    private val supportedBloodGroups = setOf("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")

    @Transactional
    fun checkAndUpdateExpiredItems() {
        val today = LocalDate.now()
        val allItems = inventoryRepository.findAll()
        var updatedCount = 0
        for (item in allItems) {
            if (item.expiryDate.isBefore(today) && item.status == InventoryStatus.AVAILABLE) {
                item.status = InventoryStatus.EXPIRED
                item.lastUpdated = LocalDateTime.now()
                inventoryRepository.save(item)
                updatedCount++
            }
        }
    }

    @Transactional(readOnly = true)
    fun getAllInventory(): List<InventoryResponse> {
        val today = LocalDate.now()
        return inventoryRepository.findAll().map { mapToInventoryResponse(it, today) }
    }

    @Transactional(readOnly = true)
    fun getInventoryByBloodGroup(bloodGroup: String): List<InventoryResponse> {
        validateBloodGroup(bloodGroup)
        val today = LocalDate.now()
        return inventoryRepository.findByBloodGroup(bloodGroup).map { mapToInventoryResponse(it, today) }
    }

    @Transactional
    fun addInventory(request: InventoryCreateRequest): InventoryResponse {
        validateBloodGroup(request.bloodGroup)
        if (request.units <= 0) {
            throw BadRequestException("Units must be greater than zero")
        }

        val collectionDate = request.collectionDate
        val expiryDate = request.expiryDate ?: collectionDate.plusDays(42)
        val today = LocalDate.now()

        val status = if (expiryDate.isBefore(today)) InventoryStatus.EXPIRED else InventoryStatus.AVAILABLE

        val inventory = BloodInventory(
            bloodGroup = request.bloodGroup,
            units = request.units,
            collectionDate = collectionDate,
            expiryDate = expiryDate,
            status = status,
            lastUpdated = LocalDateTime.now()
        )

        val saved = inventoryRepository.save(inventory)
        return mapToInventoryResponse(saved, today)
    }

    @Transactional
    fun updateInventory(id: Long, request: InventoryUpdateRequest): InventoryResponse {
        val inventory = inventoryRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Inventory record not found with ID $id") }

        if (request.units < 0) {
            throw BadRequestException("Units cannot be negative")
        }

        inventory.units = request.units
        request.status?.let { inventory.status = it }
        inventory.lastUpdated = LocalDateTime.now()

        val today = LocalDate.now()
        if (inventory.expiryDate.isBefore(today)) {
            inventory.status = InventoryStatus.EXPIRED
        }

        val updated = inventoryRepository.save(inventory)
        return mapToInventoryResponse(updated, today)
    }

    @Transactional
    fun deleteInventory(id: Long) {
        if (!inventoryRepository.existsById(id)) {
            throw ResourceNotFoundException("Inventory record not found with ID $id")
        }
        inventoryRepository.deleteById(id)
    }

    @Transactional(readOnly = true)
    fun getAvailableUnitsSummary(): Map<String, Int> {
        val today = LocalDate.now()
        return supportedBloodGroups.associateWith { bg ->
            inventoryRepository.getAvailableUnitsByBloodGroup(bg, today)
        }
    }

    fun validateBloodGroup(bloodGroup: String) {
        if (!supportedBloodGroups.contains(bloodGroup.trim())) {
            throw BadRequestException("Invalid blood group '$bloodGroup'. Supported groups: $supportedBloodGroups")
        }
    }

    private fun mapToInventoryResponse(item: BloodInventory, today: LocalDate): InventoryResponse {
        val isExpired = item.expiryDate.isBefore(today)
        return InventoryResponse(
            id = item.id!!,
            bloodGroup = item.bloodGroup,
            units = item.units,
            collectionDate = item.collectionDate,
            expiryDate = item.expiryDate,
            status = if (isExpired) InventoryStatus.EXPIRED else item.status,
            lastUpdated = item.lastUpdated,
            isExpired = isExpired
        )
    }
}
