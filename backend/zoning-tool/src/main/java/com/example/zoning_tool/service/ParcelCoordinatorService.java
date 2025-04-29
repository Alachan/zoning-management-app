package com.example.zoning_tool.service;

import com.example.zoning_tool.dto.ParcelDTO;
import com.example.zoning_tool.exception.ParcelNotFoundException;
import com.example.zoning_tool.model.app.ParcelZoning;
import com.example.zoning_tool.model.app.ZoningType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParcelCoordinatorService {
    private final ExternalParcelService externalParcelService;
    private final InternalParcelService internalParcelService;

    public List<ParcelDTO> getAllParcelsWithZoning() {
        try {
            // Get external parcels data
            List<Object[]> parcelsGeoJSON = externalParcelService.getAllParcelsGeoJSON();

            if (parcelsGeoJSON.isEmpty()) {
                return Collections.emptyList();
            }

            // Extract parcel IDs - convert from Integer to Long
            List<Integer> parcelIds = parcelsGeoJSON.stream()
                    .map(p -> ((Integer) p[0]))
                    .collect(Collectors.toList());

            // Get zoning info from internal DB
            List<ParcelZoning> zonings = internalParcelService.getZoningsByParcelIds(parcelIds);

            Map<Integer, ZoningType> zoningMap = zonings.stream()
                    .collect(Collectors.toMap(
                            ParcelZoning::getParcelId,
                            ParcelZoning::getZoningType,
                            (existing, replacement) -> replacement)); // Handle potential duplicates

            // Combine the data
            List<ParcelDTO> result = new ArrayList<>();
            for (Object[] parcel : parcelsGeoJSON) {
                Integer id = (Integer) parcel[0];
                String geoJson = (String) parcel[1];

                // Convert string to ZoningType enum
                ZoningType externalZoningType = null;
                if (parcel[4] != null) {
                    try {
                        externalZoningType = ZoningType.valueOf((String) parcel[4]);
                    } catch (IllegalArgumentException e) {
                        // Just continue without external zoning type if invalid
                    }
                }

                ParcelDTO dto = new ParcelDTO();
                dto.setId(id);
                dto.setGeometry(geoJson);

                // Use local zoning type if available, otherwise use external
                dto.setZoningType(zoningMap.containsKey(id) ? zoningMap.get(id) : externalZoningType);
                // Set additional hover info fields
                if (parcel.length > 2)
                    dto.setName((String) parcel[2]);
                if (parcel.length > 3)
                    dto.setMailingAddress((String) parcel[3]);
                // Set the area if available
                if (parcel.length > 5 && parcel[5] != null) {
                    double areaInSquareMeters = ((Number) parcel[5]).doubleValue();
                    // Convert square meters to acres (1 acre = 4046.86 square meters)
                    double areaInAcres = areaInSquareMeters / 4046.86;

                    dto.setArea(areaInAcres); // Store as acres
                }

                result.add(dto);
            }

            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error combining parcel data: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void updateZoning(List<Integer> parcelIds, ZoningType zoningType) {
        // First verify parcels exist in external DB
        List<Object[]> existingParcels = externalParcelService.getParcelsGeoJSONByIds(parcelIds);
        Set<Integer> foundParcelIds = existingParcels.stream()
                .map(p -> (Integer) p[0])
                .collect(Collectors.toSet());

        // Check if all requested parcels exist
        if (foundParcelIds.size() != parcelIds.size()) {
            List<Integer> missingIds = parcelIds.stream()
                    .filter(id -> !foundParcelIds.contains(id))
                    .collect(Collectors.toList());
            throw new ParcelNotFoundException("Parcels not found: " + missingIds);
        }

        // If all parcels exist, update their zoning in internal DB
        internalParcelService.updateZoning(parcelIds, zoningType);
    }

    public List<String> getAvailableZoningTypes() {
        return internalParcelService.getAvailableZoningTypes();
    }
}
