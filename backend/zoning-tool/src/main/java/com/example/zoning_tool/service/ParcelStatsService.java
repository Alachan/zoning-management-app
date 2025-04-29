package com.example.zoning_tool.service;

import com.example.zoning_tool.dto.ParcelDTO;
import com.example.zoning_tool.dto.ParcelStatsDTO;
import com.example.zoning_tool.model.app.ZoningType;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ParcelStatsService {

    /**
     * Calculate statistics for a list of parcels
     * 
     * @param parcels List of parcels to analyze
     * @return ParcelStatsDTO containing the statistics
     */
    public ParcelStatsDTO calculateStats(List<ParcelDTO> parcels) {
        if (parcels == null || parcels.isEmpty()) {
            return ParcelStatsDTO.builder()
                    .totalCount(0)
                    .totalArea(0.0)
                    .countByZoningType(new HashMap<>())
                    .areaByZoningType(new HashMap<>())
                    .build();
        }

        // Calculate total count
        int totalCount = parcels.size();

        // Calculate total area (handling null areas)
        double totalArea = parcels.stream()
                .filter(p -> p.getArea() != null)
                .mapToDouble(ParcelDTO::getArea)
                .sum();

        // Group by zoning type
        Map<String, List<ParcelDTO>> parcelsByZoningType = parcels.stream()
                .collect(Collectors.groupingBy(p -> p.getZoningType() != null ? p.getZoningType().name() : "Unzoned"));

        // Count by zoning type
        Map<String, Integer> countByZoningType = parcelsByZoningType.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> entry.getValue().size()));

        // Area by zoning type
        Map<String, Double> areaByZoningType = parcelsByZoningType.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> entry.getValue().stream()
                                .filter(p -> p.getArea() != null)
                                .mapToDouble(ParcelDTO::getArea)
                                .sum()));

        return ParcelStatsDTO.builder()
                .totalCount(totalCount)
                .totalArea(totalArea)
                .countByZoningType(countByZoningType)
                .areaByZoningType(areaByZoningType)
                .build();
    }

    /**
     * Calculate statistics for parcels by IDs
     * 
     * @param parcelIds  List of parcel IDs to analyze
     * @param allParcels List of all parcels to filter from
     * @return ParcelStatsDTO containing the statistics
     */
    public ParcelStatsDTO calculateStatsByIds(List<Integer> parcelIds, List<ParcelDTO> allParcels) {
        if (parcelIds == null || parcelIds.isEmpty() || allParcels == null || allParcels.isEmpty()) {
            return ParcelStatsDTO.builder()
                    .totalCount(0)
                    .totalArea(0.0)
                    .countByZoningType(new HashMap<>())
                    .areaByZoningType(new HashMap<>())
                    .build();
        }

        List<ParcelDTO> selectedParcels = allParcels.stream()
                .filter(p -> parcelIds.contains(p.getId()))
                .collect(Collectors.toList());

        return calculateStats(selectedParcels);
    }

    /**
     * Calculate statistics for what would change if parcels were updated to a new
     * zoning type
     * 
     * @param parcelIds     List of parcel IDs to analyze
     * @param allParcels    List of all parcels to filter from
     * @param newZoningType The new zoning type to simulate
     * @return ParcelStatsDTO containing the statistics after the change
     */
    public ParcelStatsDTO calculateStatsAfterUpdate(List<Integer> parcelIds, List<ParcelDTO> allParcels,
            ZoningType newZoningType) {
        if (parcelIds == null || parcelIds.isEmpty() || allParcels == null || allParcels.isEmpty()
                || newZoningType == null) {
            return ParcelStatsDTO.builder()
                    .totalCount(0)
                    .totalArea(0.0)
                    .countByZoningType(new HashMap<>())
                    .areaByZoningType(new HashMap<>())
                    .build();
        }

        // Create copies of parcels with updated zoning type
        List<ParcelDTO> updatedParcels = allParcels.stream()
                .map(p -> {
                    ParcelDTO copy = new ParcelDTO();
                    copy.setId(p.getId());
                    copy.setGeometry(p.getGeometry());
                    copy.setArea(p.getArea());
                    copy.setName(p.getName());
                    copy.setMailingAddress(p.getMailingAddress());

                    // Apply new zoning type only to selected parcels
                    if (parcelIds.contains(p.getId())) {
                        copy.setZoningType(newZoningType);
                    } else {
                        copy.setZoningType(p.getZoningType());
                    }

                    return copy;
                })
                .collect(Collectors.toList());

        return calculateStats(updatedParcels);
    }
}