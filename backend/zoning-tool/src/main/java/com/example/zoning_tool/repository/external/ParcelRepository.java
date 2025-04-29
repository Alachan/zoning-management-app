package com.example.zoning_tool.repository.external;

import com.example.zoning_tool.model.external.Parcel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParcelRepository extends JpaRepository<Parcel, Integer> {
    // Get all parcels with geometry
    @Query(value = "SELECT id, geom, name, mailadd, zoning_typ FROM real_estate_zoning", nativeQuery = true)
    List<Parcel> findAllParcels();

    // Get parcels in GeoJSON format (for map display)
    @Query(value = "SELECT id, ST_AsGeoJSON(geom) as geojson, name, mailadd, zoning_typ as zoningType, ST_Area(geom::geography) as area FROM real_estate_zoning", nativeQuery = true)
    List<Object[]> findAllParcelsAsGeoJSON();

    // Get parcels by ID list (for when user selects multiple parcels)
    @Query(value = "SELECT id, ST_AsGeoJSON(geom) as geojson, name, mailadd, zoning_typ as zoningType, ST_Area(geom::geography) as area FROM real_estate_zoning WHERE id IN :ids", nativeQuery = true)
    List<Object[]> findParcelsAsGeoJSONByIds(@Param("ids") List<Integer> ids);
}
