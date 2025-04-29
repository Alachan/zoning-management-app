package com.example.zoning_tool.controller;

import com.example.zoning_tool.model.app.ZoningType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/zoning-types")
public class ZoningTypeController {

    @GetMapping
    public ResponseEntity<List<String>> getZoningTypes() {
        List<String> zoningTypes = Arrays.stream(ZoningType.values())
                .map(Enum::name)
                .collect(Collectors.toList());
        return ResponseEntity.ok(zoningTypes);
    }
}