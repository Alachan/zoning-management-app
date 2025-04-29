package com.example.zoning_tool.dto;

import com.example.zoning_tool.model.app.ZoningType;
import lombok.Data;

import java.util.List;

/**
 * DTO for receiving zoning update requests
 */
@Data
public class ZoningUpdateRequest {
    private List<Integer> parcelIds;
    private ZoningType zoningType;
}