-- Run this SQL against your existing Turso database
-- to migrate from ninong/ninang to godfather/godmother.

-- Rename the responses column
ALTER TABLE `responses` RENAME COLUMN `will_be_ninong_or_ninang` TO `will_be_godparent`;

-- Update existing guest roles
UPDATE `guests` SET `role` = 'godfather' WHERE `role` = 'ninong';
UPDATE `guests` SET `role` = 'godmother' WHERE `role` = 'ninang';
