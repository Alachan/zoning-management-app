package com.example.zoning_tool.repository.app;

import com.example.zoning_tool.model.app.ParcelZoning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParcelZoningRepository extends JpaRepository<ParcelZoning, Long> {
    // Find Parcel Zoning for a specific parcel
    Optional<ParcelZoning> findByParcelId(Integer parcelId);

    // Find zoning for multiple parcels (bulk operation)
    List<ParcelZoning> findByParcelIdIn(List<Integer> parcelIds);
}