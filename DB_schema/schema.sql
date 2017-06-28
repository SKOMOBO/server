-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.1.22-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table skomobo.box_data
CREATE TABLE IF NOT EXISTS `box_data` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Location` text NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='this is the table storing all the data about the individual SKOMOBO boxes.';

-- Data exporting was unselected.
-- Dumping structure for table skomobo.pir
CREATE TABLE IF NOT EXISTS `pir` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table skomobo.sensor_data
CREATE TABLE IF NOT EXISTS `sensor_data` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Time_received` datetime DEFAULT CURRENT_TIMESTAMP,
  `Box_ID` int(11) DEFAULT NULL,
  `Time_sent` datetime DEFAULT NULL,
  `Dust1` float DEFAULT NULL,
  `Dust2_5` float DEFAULT NULL,
  `Dust10` float DEFAULT NULL,
  `Presence` bit(1) DEFAULT NULL,
  `Temperature` float DEFAULT NULL,
  `Humidity` float DEFAULT NULL,
  `CO2` float DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=562 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
