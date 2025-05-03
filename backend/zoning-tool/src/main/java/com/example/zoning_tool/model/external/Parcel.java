package com.example.zoning_tool.model.external;

import jakarta.persistence.*;
import lombok.Data;
import org.locationtech.jts.geom.Geometry;

import com.example.zoning_tool.model.app.ZoningType;

@Data
@Entity
@Table(name = "real_estate_zoning")
public class Parcel {
    @Id
    private Integer id;

    @Column(name = "geom", columnDefinition = "geometry")
    private Geometry geometry;

    @Enumerated(EnumType.STRING)
    @Column(name = "zoning_typ")
    private ZoningType zoningType;

    // Additional fields for hover info
    private String name;

    @Column(name = "mailadd")
    private String mailingAddress;
}
