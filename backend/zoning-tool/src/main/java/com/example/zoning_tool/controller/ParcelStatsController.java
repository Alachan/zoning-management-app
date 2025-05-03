package com.example.zoning_tool.controller;

import com.example.zoning_tool.dto.ParcelStatsDTO;
import com.example.zoning_tool.dto.ZoningUpdateRequest;
import com.example.zoning_tool.service.ParcelCoordinatorService;
import com.example.zoning_tool.service.ParcelStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class ParcelStatsController {
    private final ParcelCoordinatorService parcelCoordinatorService;
    private final ParcelStatsService parcelStatsService;

    /**
     * Get statistics for selected parcels
     */
    @PostMapping
    public ResponseEntity<ParcelStatsDTO> getParcelStats(@RequestBody List<Integer> parcelIds) {
        // Get all parcels with zoning
        var allParcels = parcelCoordinatorService.getAllParcelsWithZoning();
        // Calculate statistics
        var stats = parcelStatsService.calculateStatsByIds(parcelIds, allParcels);

        return ResponseEntity.ok(stats);
    }

    /**
     * Get statistics for what would change if parcels were updated to a new zoning
     * type
     */
    @PostMapping("/simulate")
    public ResponseEntity<ParcelStatsDTO> simulateZoningUpdate(
            @RequestBody ZoningUpdateRequest request) {
        // Get all parcels with zoning
        var allParcels = parcelCoordinatorService.getAllParcelsWithZoning();
        // Calculate statistics after update
        var stats = parcelStatsService.calculateStatsAfterUpdate(request.getParcelIds(), allParcels,
                request.getZoningType());

        return ResponseEntity.ok(stats);
    }
}