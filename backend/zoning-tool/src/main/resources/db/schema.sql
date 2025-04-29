-- Drop tables if they exist
DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS parcel_zoning;

-- Create table for parcel zoning
CREATE TABLE parcel_zoning (
    id SERIAL PRIMARY KEY,
    parcel_id INT NOT NULL,
    zoning_type VARCHAR(20) NOT NULL CHECK (zoning_type IN ('Residential', 'Commercial', 'Industrial', 'Agricultural', 'Planned')),
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create table for audit logs
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    action_type VARCHAR(20) NOT NULL,
    description TEXT,
    parcel_ids TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);