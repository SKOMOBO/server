CREATE TABLE `box_info` (
	`ID` TEXT NOT NULL,
	`processor` TEXT NULL,
	PRIMARY KEY (`ID`(4))
)
COMMENT='this is the table storing all the data about the individual SKOMOBO boxes.'
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
