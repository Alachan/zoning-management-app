package com.example.zoning_tool.service;

import java.util.*;
import java.util.stream.Collectors;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.zoning_tool.exception.ZoningUpdateException;
import com.example.zoning_tool.model.app.ParcelZoning;
import com.example.zoning_tool.model.app.ZoningType;
import com.example.zoning_tool.repository.app.ParcelZoningRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InternalParcelService {
    private final ParcelZoningRepository parcelZoningRepository;
    private final AuditLogService auditLogService;

    public List<ParcelZoning> getZoningsByParcelIds(List<Integer> parcelIds) {
        return parcelZoningRepository.findByParcelIdIn(parcelIds);
    }

    @Transactional
    public void updateZoning(List<Integer> parcelIds, ZoningType zoningType) {
        if (parcelIds == null || parcelIds.isEmpty()) {
            throw new IllegalArgumentException("Parcel IDs cannot be empty");
        }

        if (zoningType == null) {
            throw new IllegalArgumentException("Zoning type must not be null");
        }

        try {
            // Find existing zoning records for these parcels
            List<ParcelZoning> existingZonings = parcelZoningRepository.findByParcelIdIn(parcelIds);
            Map<Integer, ParcelZoning> zoningMap = existingZonings.stream()
                    .collect(Collectors.toMap(ParcelZoning::getParcelId, z -> z));

            List<ParcelZoning> zoningsToSave = new ArrayList<>();

            for (Integer parcelId : parcelIds) {
                ParcelZoning zoning = zoningMap.getOrDefault(parcelId, new ParcelZoning());

                zoning.setParcelId(parcelId);
                zoning.setZoningType(zoningType);
                // lastUpdated will be set by @PrePersist/@PreUpdate

                zoningsToSave.add(zoning);
            }

            // Batch save all zonings
            parcelZoningRepository.saveAll(zoningsToSave);

            // Create and save audit log entry
            auditLogService.logZoningUpdate(parcelIds, zoningType.toString());
        } catch (DataAccessException e) {
            // More specific exception for database errors
            throw new ZoningUpdateException("Database error while updating zoning", e);
        } catch (Exception e) {
            // Catch any other unexpected errors
            throw new ZoningUpdateException("Failed to update zoning", e);
        }
    }

    public List<String> getAvailableZoningTypes() {
        return Arrays.stream(ZoningType.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }
}