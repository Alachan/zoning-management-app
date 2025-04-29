package com.example.zoning_tool.model.app;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "parcel_zoning")
public class ParcelZoning {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "parcel_id", nullable = false)
    private Integer parcelId;

    @Enumerated(EnumType.STRING)
    @Column(name = "zoning_type", nullable = false)
    private ZoningType zoningType;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        lastUpdated = LocalDateTime.now();
    }
}
