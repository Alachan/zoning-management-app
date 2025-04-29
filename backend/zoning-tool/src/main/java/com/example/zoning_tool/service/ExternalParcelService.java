package com.example.zoning_tool.service;

import com.example.zoning_tool.repository.external.ParcelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ExternalParcelService {
    private final ParcelRepository externalParcelRepository;

    public List<Object[]> getAllParcelsGeoJSON() {
        return externalParcelRepository.findAllParcelsAsGeoJSON();
    }

    public List<Object[]> getParcelsGeoJSONByIds(List<Integer> ids) {
        return externalParcelRepository.findParcelsAsGeoJSONByIds(ids);
    }
}
