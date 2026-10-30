package com.example.bloodbank.controller

import com.example.bloodbank.dto.*
import com.example.bloodbank.service.InventoryService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/inventory")
class InventoryController(
    private val inventoryService: InventoryService
) {

    @GetMapping("/public/summary")
    fun getPublicInventorySummary(): ResponseEntity<ApiResponse<Map<String, Int>>> {
        inventoryService.checkAndUpdateExpiredItems()
        val summary = inventoryService.getAvailableUnitsSummary()
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Public inventory summary", data = summary)
        )
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HOSPITAL', 'DONOR')")
    fun getAllInventory(): ResponseEntity<ApiResponse<List<InventoryResponse>>> {
        inventoryService.checkAndUpdateExpiredItems()
        val inventory = inventoryService.getAllInventory()
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Inventory records retrieved", data = inventory)
        )
    }

    @GetMapping("/{bloodGroup}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOSPITAL', 'DONOR')")
    fun getInventoryByBloodGroup(@PathVariable bloodGroup: String): ResponseEntity<ApiResponse<List<InventoryResponse>>> {
        inventoryService.checkAndUpdateExpiredItems()
        val list = inventoryService.getInventoryByBloodGroup(bloodGroup)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Inventory records for $bloodGroup retrieved", data = list)
        )
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun addInventory(@Valid @RequestBody request: InventoryCreateRequest): ResponseEntity<ApiResponse<InventoryResponse>> {
        val created = inventoryService.addInventory(request)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Blood units added to inventory", data = created)
        )
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun updateInventory(
        @PathVariable id: Long,
        @RequestBody request: InventoryUpdateRequest
    ): ResponseEntity<ApiResponse<InventoryResponse>> {
        val updated = inventoryService.updateInventory(id, request)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Inventory record updated", data = updated)
        )
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun deleteInventory(@PathVariable id: Long): ResponseEntity<ApiResponse<Void>> {
        inventoryService.deleteInventory(id)
        return ResponseEntity.ok(
            ApiResponse(success = true, message = "Inventory record deleted successfully", data = null)
        )
    }
}
