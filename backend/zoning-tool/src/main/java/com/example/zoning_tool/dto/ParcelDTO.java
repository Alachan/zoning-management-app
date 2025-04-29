package com.example.zoning_tool.dto;

import com.example.zoning_tool.model.app.ZoningType;
import lombok.Data;

/**
 * DTO for Parcel
 * Represents a parcel with its ID, geometry, zoning type, and area.
 */
@Data
public class ParcelDTO {
    private Integer id;
    private String geometry;
    private ZoningType zoningType;
    private Double area; // May be null if not calculated
    private String name;
    private String mailingAddress;
}