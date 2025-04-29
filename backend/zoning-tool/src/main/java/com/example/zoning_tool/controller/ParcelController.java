package com.example.zoning_tool.controller;

import com.example.zoning_tool.dto.ParcelDTO;
import com.example.zoning_tool.dto.ZoningUpdateRequest;
import com.example.zoning_tool.service.ParcelCoordinatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/parcels")
@RequiredArgsConstructor
public class ParcelController {
    private final ParcelCoordinatorService parcelCoordinatorService;

    @GetMapping
    public ResponseEntity<List<ParcelDTO>> getAllParcels() {
        try {
            List<ParcelDTO> parcels = parcelCoordinatorService.getAllParcelsWithZoning();
            return ResponseEntity.ok(parcels);
        } catch (Exception e) {
            // log the specific error details
            throw new RuntimeException("Failed to retrieve parcels: " + e.getMessage(), e);
        }
    }

    @PutMapping("/zoning")
    public ResponseEntity<Void> updateZoning(@RequestBody ZoningUpdateRequest request) {
        parcelCoordinatorService.updateZoning(request.getParcelIds(), request.getZoningType());
        return ResponseEntity.ok().build();
    }
}