package com.example.zoning_tool.repository.app;

import com.example.zoning_tool.model.app.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    // Basic CRUD operations are provided by JpaRepository
}
