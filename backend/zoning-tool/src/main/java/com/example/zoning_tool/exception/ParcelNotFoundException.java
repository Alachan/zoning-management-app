package com.example.zoning_tool.exception;

public class ParcelNotFoundException extends RuntimeException {
    public ParcelNotFoundException(String message) {
        super(message);
    }

    public ParcelNotFoundException(Long id) {
        super("Parcel not found with id: " + id);
    }

    public ParcelNotFoundException(Iterable<Long> ids) {
        super("One or more parcels not found with ids: " + ids);
    }
}