-- Migration: Add type column to school_profile table
-- Date: 2026-02-15
-- Description: Add metadata to distinguish between different field types (text, image, email, etc.)

USE sdit_rohum;

-- Add type column after value
ALTER TABLE school_profile 
ADD COLUMN type VARCHAR(50) DEFAULT 'text' 
AFTER value;

-- Update existing photo fields to have 'image' type
UPDATE school_profile 
SET type = 'image' 
WHERE `key` LIKE '%photo%' OR `key` LIKE '%logo%' OR `key` LIKE '%image%';

-- Update existing email fields
UPDATE school_profile 
SET type = 'email' 
WHERE `key` LIKE '%email%';

-- Update existing phone fields  
UPDATE school_profile 
SET type = 'phone' 
WHERE `key` LIKE '%phone%' OR `key` LIKE '%telepon%';

-- Update existing URL fields
UPDATE school_profile 
SET type = 'url' 
WHERE `key` LIKE '%website%' OR `key` LIKE '%url%';

-- Verify changes
SELECT `key`, `type` FROM school_profile ORDER BY `key`;
