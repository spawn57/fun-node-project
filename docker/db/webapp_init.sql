ALTER SCHEMA `webapp`  DEFAULT CHARACTER SET utf8 ;

CREATE TABLE `webapp`.`orders` (
  `uuid` VARCHAR(36) CHARACTER SET 'utf8' NOT NULL,
  `distance` FLOAT NOT NULL,
  `status` VARCHAR(45) NOT NULL DEFAULT 'UNASSIGNED',
  PRIMARY KEY (`uuid`));

INSERT INTO `webapp`.`orders` (`uuid`, `distance`, `status`) 
VALUES ('7fc341f8-8ffb-42c1-979b-7fff3abcc2ba', 1, 'UNASSIGNED');
