package com.example.zoning_tool.service;

import com.example.zoning_tool.model.app.AuditActionType;
import com.example.zoning_tool.model.app.AuditLog;
import com.example.zoning_tool.repository.app.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    private final AuditLogRepository auditLogRepository;

    /**
     * Create and save an audit log entry
     * 
     * @param actionType  The type of action being audited
     * @param description Description of the action
     * @param parcelIds   List of parcel IDs affected by the action
     * @return The created audit log entry
     */
    public AuditLog createAuditLog(AuditActionType actionType, String description, List<Integer> parcelIds) {
        AuditLog auditLog = new AuditLog();
        auditLog.setActionType(actionType);
        auditLog.setDescription(description);

        // Convert list of IDs to comma-separated string
        if (parcelIds != null && !parcelIds.isEmpty()) {
            String parcelIdsStr = parcelIds.stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining(","));
            auditLog.setParcelIds(parcelIdsStr);
        }

        return auditLogRepository.save(auditLog);
    }

    /**
     * Create a zoning update audit log entry
     * 
     * @param parcelIds  List of parcel IDs that were updated
     * @param zoningType The zoning type assigned
     * @return The created audit log entry
     */
    public AuditLog logZoningUpdate(List<Integer> parcelIds, String zoningType) {
        int count = parcelIds.size();
        String description = String.format("Updated %d parcels to %s zoning", count, zoningType);
        return createAuditLog(AuditActionType.ZONE_UPDATE, description, parcelIds);
    }
}