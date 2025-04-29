package com.example.zoning_tool.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for returning statistics about parcels
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParcelStatsDTO {
    private Integer totalCount;
    private Double totalArea; // In acres
    private Map<String, Integer> countByZoningType;
    private Map<String, Double> areaByZoningType; // In acres
}